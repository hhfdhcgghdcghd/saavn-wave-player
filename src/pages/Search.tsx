import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, Song, Album, Artist } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const [songsRes, albumsRes, artistsRes] = await Promise.all([
          api.searchSongs(query),
          api.searchAlbums(query),
          api.searchArtists(query),
        ]);

        setSongs(songsRes.data?.results || []);
        setAlbums(albumsRes.data?.results || []);
        setArtists(artistsRes.data?.results || []);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Search for music</h1>
        <p className="text-muted-foreground">Enter a search term to find songs, albums, and artists</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <h1 className="text-3xl font-bold mb-8">Search results for "{query}"</h1>

      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="songs">Songs ({songs.length})</TabsTrigger>
          <TabsTrigger value="albums">Albums ({albums.length})</TabsTrigger>
          <TabsTrigger value="artists">Artists ({artists.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : songs.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} queue={songs} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No songs found</p>
          )}
        </TabsContent>

        <TabsContent value="albums">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : albums.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No albums found</p>
          )}
        </TabsContent>

        <TabsContent value="artists">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-3 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : artists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No artists found</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
