import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, Album } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.getAlbum(id);
        setAlbum(response.data);
      } catch (error) {
        console.error('Error fetching album:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Skeleton className="w-full md:w-80 aspect-square rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Album not found</h1>
      </div>
    );
  }

  const imageUrl = album.image?.find(img => img.quality === '500x500')?.link || album.image?.[0]?.link;

  return (
    <div className="min-h-screen pb-32">
      {/* Album Header */}
      <div className="bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={imageUrl}
              alt={album.name}
              className="w-full md:w-80 aspect-square rounded-lg shadow-2xl shadow-primary/20"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground mb-2">ALBUM</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{album.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                <span className="font-semibold text-foreground">{album.primaryArtists}</span>
                <span>•</span>
                <span>{album.year}</span>
                <span>•</span>
                <span>{album.songCount} songs</span>
              </div>
              <Button
                size="lg"
                onClick={() => album.songs?.[0] && playSong(album.songs[0], album.songs)}
                className="bg-gradient-primary hover:shadow-glow transition-shadow"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Play Album
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Tracks</h2>
          {album.songs && album.songs.length > 0 ? (
            <div className="space-y-2">
              {album.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  onClick={() => playSong(song, album.songs)}
                >
                  <span className="w-8 text-center text-muted-foreground group-hover:hidden">
                    {index + 1}
                  </span>
                  <Play className="w-8 h-8 text-primary hidden group-hover:block" />
                  <img
                    src={song.image?.find(img => img.quality === '50x50')?.link || song.image?.[0]?.link}
                    alt={song.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {song.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.primaryArtists}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No songs available</p>
          )}
        </div>
      </div>
    </div>
  );
}
