import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, Artist, Song, Album } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { AlbumCard } from '@/components/AlbumCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [additionalSongs, setAdditionalSongs] = useState<Song[]>([]);
  const [additionalAlbums, setAdditionalAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusicPlayer();

  const [songsPage, setSongsPage] = useState(1);
  const [albumsPage, setAlbumsPage] = useState(1);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const [hasMoreAlbums, setHasMoreAlbums] = useState(true);

  const fetchArtistSongs = async (pageNum: number) => {
    if (!id) return;
    try {
      const response = await api.getArtistSongs(id, pageNum);
      if (response.data?.results) {
        const newSongs = response.data.results;
        if (newSongs.length === 0) {
          setHasMoreSongs(false);
        } else {
          setAdditionalSongs(prev => pageNum === 1 ? newSongs : [...prev, ...newSongs]);
        }
      }
    } catch (error) {
      console.error('Error fetching artist songs:', error);
    }
  };

  const fetchArtistAlbums = async (pageNum: number) => {
    if (!id) return;
    try {
      const response = await api.getArtistAlbums(id, pageNum);
      if (response.data?.results) {
        const newAlbums = response.data.results;
        if (newAlbums.length === 0) {
          setHasMoreAlbums(false);
        } else {
          setAdditionalAlbums(prev => pageNum === 1 ? newAlbums : [...prev, ...newAlbums]);
        }
      }
    } catch (error) {
      console.error('Error fetching artist albums:', error);
    }
  };

  useEffect(() => {
    const fetchArtist = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.getArtist(id);
        setArtist(response.data);
        
        // Fetch additional paginated data
        await Promise.all([
          fetchArtistSongs(1),
          fetchArtistAlbums(1),
        ]);
      } catch (error) {
        console.error('Error fetching artist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const loadMoreSongs = async () => {
    if (!hasMoreSongs) return;
    const nextPage = songsPage + 1;
    setSongsPage(nextPage);
    await fetchArtistSongs(nextPage);
  };

  const loadMoreAlbums = async () => {
    if (!hasMoreAlbums) return;
    const nextPage = albumsPage + 1;
    setAlbumsPage(nextPage);
    await fetchArtistAlbums(nextPage);
  };

  const { targetRef: songsTargetRef, isLoading: songsLoading } = useInfiniteScroll(loadMoreSongs);
  const { targetRef: albumsTargetRef, isLoading: albumsLoading } = useInfiniteScroll(loadMoreAlbums);

  // Combine top songs with additional songs
  const allSongs = artist?.topSongs ? [...artist.topSongs, ...additionalSongs] : additionalSongs;
  const allAlbums = artist?.topAlbums ? [...artist.topAlbums, ...additionalAlbums] : additionalAlbums;

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
                onClick={() => allSongs[0] && playSong(allSongs[0], allSongs)}
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
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
          </TabsList>

          <TabsContent value="songs">
            {allSongs.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {allSongs.map((song) => (
                    <SongCard key={song.id} song={song} queue={allSongs} />
                  ))}
                </div>
                {hasMoreSongs && (
                  <div ref={songsTargetRef} className="flex justify-center py-8">
                    {songsLoading && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground py-12">No songs available</p>
            )}
          </TabsContent>

          <TabsContent value="albums">
            {allAlbums.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {allAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
                {hasMoreAlbums && (
                  <div ref={albumsTargetRef} className="flex justify-center py-8">
                    {albumsLoading && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted-foreground py-12">No albums available</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
