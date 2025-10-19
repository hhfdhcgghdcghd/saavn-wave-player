import { useEffect, useState, useCallback } from 'react';
import { Song } from '@/lib/api';

declare global {
  interface Window {
    __onGCastApiAvailable: (isAvailable: boolean) => void;
    cast: any;
    chrome: any;
  }
}

export const useCast = () => {
  const [isCastAvailable, setIsCastAvailable] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [castSession, setCastSession] = useState<any>(null);

  useEffect(() => {
    window.__onGCastApiAvailable = (isAvailable: boolean) => {
      if (isAvailable) {
        initializeCastApi();
      }
    };
  }, []);

  const initializeCastApi = () => {
    const context = window.cast.framework.CastContext.getInstance();
    
    context.setOptions({
      receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
    });

    setIsCastAvailable(true);

    context.addEventListener(
      window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (event: any) => {
        switch (event.sessionState) {
          case window.cast.framework.SessionState.SESSION_STARTED:
          case window.cast.framework.SessionState.SESSION_RESUMED:
            setCastSession(event.session);
            setIsCasting(true);
            break;
          case window.cast.framework.SessionState.SESSION_ENDED:
            setCastSession(null);
            setIsCasting(false);
            break;
        }
      }
    );
  };

  const loadMedia = useCallback((song: Song, currentTime: number = 0, autoplay: boolean = true) => {
    if (!castSession) return;

    const mediaInfo = new window.chrome.cast.media.MediaInfo(
      song.downloadUrl?.find(u => u.quality === '320kbps')?.link || song.downloadUrl?.[0]?.link,
      'audio/mpeg'
    );

    const imageUrl = song.image?.find(img => img.quality === '500x500')?.link || song.image?.[0]?.link;

    mediaInfo.metadata = new window.chrome.cast.media.MusicTrackMediaMetadata();
    mediaInfo.metadata.title = song.name;
    mediaInfo.metadata.artist = song.primaryArtists;
    mediaInfo.metadata.albumName = song.album?.name || '';
    mediaInfo.metadata.images = [
      new window.chrome.cast.Image(imageUrl)
    ];

    // Add custom data for branding
    mediaInfo.customData = {
      poweredBy: 'Shivashankar N M'
    };

    const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = autoplay;
    request.currentTime = currentTime;

    castSession.loadMedia(request).then(
      () => {
        console.log('Media loaded successfully on Cast device');
      },
      (error: any) => {
        console.error('Error loading media:', error);
      }
    );
  }, [castSession]);

  const playCast = useCallback(() => {
    if (!castSession) return;
    const media = castSession.getMediaSession();
    if (media) {
      media.play(new window.chrome.cast.media.PlayRequest());
    }
  }, [castSession]);

  const pauseCast = useCallback(() => {
    if (!castSession) return;
    const media = castSession.getMediaSession();
    if (media) {
      media.pause(new window.chrome.cast.media.PauseRequest());
    }
  }, [castSession]);

  const seekCast = useCallback((time: number) => {
    if (!castSession) return;
    const media = castSession.getMediaSession();
    if (media) {
      const request = new window.chrome.cast.media.SeekRequest();
      request.currentTime = time;
      media.seek(request);
    }
  }, [castSession]);

  const setVolumeCast = useCallback((volume: number) => {
    if (!castSession) return;
    const media = castSession.getMediaSession();
    if (media) {
      const volumeRequest = new window.chrome.cast.media.VolumeRequest(
        new window.chrome.cast.Volume(volume)
      );
      media.setVolume(volumeRequest);
    }
  }, [castSession]);

  const stopCast = useCallback(() => {
    if (!castSession) return;
    castSession.endSession(true);
  }, [castSession]);

  return {
    isCastAvailable,
    isCasting,
    castSession,
    loadMedia,
    playCast,
    pauseCast,
    seekCast,
    setVolumeCast,
    stopCast,
  };
};
