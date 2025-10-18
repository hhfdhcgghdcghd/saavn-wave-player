import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, Artist } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { AlbumCard } from '@/components/AlbumCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    const fetchArtist = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.getArtist(id);
        setArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Skeleton className="w-full md:w-80 aspect-square rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Artist not found</h1>
      </div>
    );
  }

  const imageUrl = artist.image?.find(img => img.quality === '500x500')?.link || artist.image?.[0]?.link;

  return (
    <div className="min-h-screen pb-32">
      {/* Artist Header */}
      <div className="bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src={imageUrl}
              alt={artist.name}
              className="w-full md:w-80 aspect-square rounded-full shadow-2xl shadow-primary/20 object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                {artist.isVerified && <UserCheck className="inline w-4 h-4 mr-1" />}
                ARTIST
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{artist.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
                {artist.followerCount && (
                  <>
                    <span className="font-semibold text-foreground">
                      {(artist.followerCount / 1000000).toFixed(1)}M followers
                    </span>
                    <span>•</span>
                  </>
                )}
                <span>{artist.dominantLanguage}</span>
              </div>
              <Button
                size="lg"
                onClick={() => artist.topSongs?.[0] && playSong(artist.topSongs[0], artist.topSongs)}
                className="bg-gradient-primary hover:shadow-glow transition-shadow"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Play
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="songs" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="songs">Top Songs</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>

          <TabsContent value="songs">
            {artist.topSongs && artist.topSongs.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {artist.topSongs.map((song) => (
                  <SongCard key={song.id} song={song} queue={artist.topSongs} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No songs available</p>
            )}
          </TabsContent>

          <TabsContent value="albums">
            {artist.topAlbums && artist.topAlbums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {artist.topAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No albums available</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
