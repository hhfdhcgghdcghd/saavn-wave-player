import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2, Heart } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
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
      <div className="flex justify-between items-center p-6">
        <h2 className="text-xl font-semibold">Now Playing</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(false)}
          className="hover:bg-secondary"
        >
          <Minimize2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* Album Art */}
        <div className="w-full max-w-md aspect-square mb-8 relative">
          <img
            src={imageUrl}
            alt={currentSong.name}
            className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-primary/30 animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
        </div>

        {/* Song Info */}
        <div className="text-center mb-8 max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 truncate">{currentSong.name}</h1>
          <p className="text-xl text-muted-foreground truncate">{currentSong.primaryArtists}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {currentSong.album?.name} • {currentSong.year}
          </p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-2xl mb-8">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="cursor-pointer mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 hover:bg-secondary hover:scale-110 transition-transform"
          >
            <Heart className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={playPrevious}
            className="w-14 h-14 hover:bg-secondary hover:scale-110 transition-transform"
          >
            <SkipBack className="w-7 h-7" />
          </Button>
          
          <Button
            size="icon"
            onClick={isPlaying ? pauseSong : resumeSong}
            className="w-20 h-20 rounded-full bg-gradient-primary hover:shadow-glow transition-all hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={playNext}
            className="w-14 h-14 hover:bg-secondary hover:scale-110 transition-transform"
          >
            <SkipForward className="w-7 h-7" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-12 h-12 hover:bg-secondary hover:scale-110 transition-transform"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Volume Slider */}
        <div className="w-full max-w-md flex items-center gap-4">
          <VolumeX className="w-5 h-5 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="cursor-pointer"
          />
          <Volume2 className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
