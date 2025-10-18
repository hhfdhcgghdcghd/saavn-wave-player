import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    pauseSong, 
    resumeSong, 
    playNext, 
    playPrevious,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    setIsFullscreen
  } = useMusicPlayer();

  const [isMuted, setIsMuted] = useState(false);

  if (!currentSong) return null;

  const imageUrl = currentSong.image?.find(img => img.quality === '150x150')?.link || currentSong.image?.[0]?.link;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={imageUrl}
              alt={currentSong.name}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-foreground truncate">{currentSong.name}</h4>
              <p className="text-sm text-muted-foreground truncate">{currentSong.primaryArtists}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPrevious}
              className="hover:bg-secondary"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              size="icon"
              onClick={isPlaying ? pauseSong : resumeSong}
              className="w-12 h-12 rounded-full bg-gradient-primary hover:shadow-glow transition-shadow"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={playNext}
              className="hover:bg-secondary"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume & Fullscreen */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="hover:bg-secondary"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24 cursor-pointer"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(true)}
              className="hover:bg-secondary"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
