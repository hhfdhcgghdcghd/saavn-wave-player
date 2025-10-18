import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { Song } from '@/lib/api';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  playSong: (song: Song, newQueue?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  }
  return context;
};

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (newQueue) {
      setQueue(newQueue);
      const index = newQueue.findIndex(s => s.id === song.id);
      setCurrentIndex(index >= 0 ? index : 0);
    } else if (!queue.find(s => s.id === song.id)) {
      setQueue([song]);
      setCurrentIndex(0);
    } else {
      const index = queue.findIndex(s => s.id === song.id);
      setCurrentIndex(index);
    }
    
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    setIsPlaying(true);
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
  };

  const removeFromQueue = (index: number) => {
    const newQueue = queue.filter((_, i) => i !== index);
    setQueue(newQueue);
    if (index === currentIndex && newQueue.length > 0) {
      setCurrentSong(newQueue[Math.min(currentIndex, newQueue.length - 1)]);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(0);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentIndex < queue.length - 1) {
        playNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, queue]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        currentIndex,
        playSong,
        pauseSong,
        resumeSong,
        playNext,
        playPrevious,
        addToQueue,
        removeFromQueue,
        clearQueue,
        audioRef,
        currentTime,
        duration,
        seek,
        volume,
        setVolume,
        isFullscreen,
        setIsFullscreen,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.downloadUrl?.find(u => u.quality === '320kbps')?.link || currentSong?.downloadUrl?.[0]?.link}
      />
    </MusicPlayerContext.Provider>
  );
};
