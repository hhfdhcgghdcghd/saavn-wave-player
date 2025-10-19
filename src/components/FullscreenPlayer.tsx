import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2, Heart } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { CastButton } from '@/components/CastButton';
import { useState } from 'react';

export const FullscreenPlayer = () => {
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
    isFullscreen,
    setIsFullscreen
  } = useMusicPlayer();

  const [isMuted, setIsMuted] = useState(false);

  if (!isFullscreen || !currentSong) return null;

  const imageUrl = currentSong.image?.find(img => img.quality === '500x500')?.link || currentSong.image?.[0]?.link;

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
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">Now Playing</h2>
          <div className="flex items-center">
            <CastButton />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(false)}
          className="hover:bg-secondary"
        >
          <Minimize2 className="w-5 h-5 md:w-6 md:h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-20">
        {/* Album Art */}
        <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-md aspect-square mb-6 md:mb-8 relative">
          <img
            src={imageUrl}
            alt={currentSong.name}
            className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-primary/30 animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
        </div>

        {/* Song Info */}
        <div className="text-center mb-6 md:mb-8 max-w-[280px] sm:max-w-sm md:max-w-md w-full px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-foreground line-clamp-2">{currentSong.name}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground line-clamp-1">{currentSong.primaryArtists}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {currentSong.album?.name} • {currentSong.year}
          </p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-[280px] sm:max-w-md md:max-w-2xl mb-6 md:mb-8 px-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="cursor-pointer mb-2"
          />
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 sm:w-12 sm:h-12 hover:bg-secondary hover:scale-110 transition-transform"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={playPrevious}
            className="w-12 h-12 sm:w-14 sm:h-14 hover:bg-secondary hover:scale-110 transition-transform"
          >
            <SkipBack className="w-6 h-6 sm:w-7 sm:h-7" />
          </Button>
          
          <Button
            size="icon"
            onClick={isPlaying ? pauseSong : resumeSong}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-primary hover:shadow-glow transition-all hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={playNext}
            className="w-12 h-12 sm:w-14 sm:h-14 hover:bg-secondary hover:scale-110 transition-transform"
          >
            <SkipForward className="w-6 h-6 sm:w-7 sm:h-7" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-10 h-10 sm:w-12 sm:h-12 hover:bg-secondary hover:scale-110 transition-transform"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </Button>
        </div>

        {/* Volume Slider */}
        <div className="w-full max-w-[280px] sm:max-w-md flex items-center gap-3 md:gap-4 px-4">
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="cursor-pointer"
          />
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
