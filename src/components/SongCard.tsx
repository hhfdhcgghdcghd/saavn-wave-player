import { Play } from 'lucide-react';
import { Song } from '@/lib/api';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Card } from '@/components/ui/card';

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export const SongCard = ({ song, queue = [] }: SongCardProps) => {
  const { playSong } = useMusicPlayer();
  const imageUrl = song.image?.find(img => img.quality === '500x500')?.link || song.image?.[0]?.link;

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 bg-card border-border hover:shadow-glow"
      onClick={() => playSong(song, queue.length > 0 ? queue : [song])}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={song.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Play className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate mb-1">{song.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{song.primaryArtists}</p>
      </div>
    </Card>
  );
};
