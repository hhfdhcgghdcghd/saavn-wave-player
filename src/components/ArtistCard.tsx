import { Artist } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();
  const imageUrl = artist.image?.find(img => img.quality === '500x500')?.link || artist.image?.[0]?.link;

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 bg-card border-border hover:shadow-glow-tertiary"
      onClick={() => navigate(`/artist/${artist.id}`)}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-foreground truncate mb-1">{artist.name}</h3>
        <p className="text-xs text-muted-foreground">
          {artist.followerCount ? `${(artist.followerCount / 1000000).toFixed(1)}M followers` : 'Artist'}
        </p>
      </div>
    </Card>
  );
};
