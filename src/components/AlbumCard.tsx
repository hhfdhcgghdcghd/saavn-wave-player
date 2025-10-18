import { Album } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface AlbumCardProps {
  album: Album;
}

export const AlbumCard = ({ album }: AlbumCardProps) => {
  const navigate = useNavigate();
  const imageUrl = album.image?.find(img => img.quality === '500x500')?.link || album.image?.[0]?.link;

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 bg-card border-border hover:shadow-lg hover:shadow-primary/20"
      onClick={() => navigate(`/album/${album.id}`)}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={album.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate mb-1">{album.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{album.primaryArtists}</p>
        <p className="text-xs text-muted-foreground mt-1">{album.year} • {album.songCount} songs</p>
      </div>
    </Card>
  );
};
