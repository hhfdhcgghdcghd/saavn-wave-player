import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, Song, Album, Artist } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  const [songsPage, setSongsPage] = useState(1);
  const [albumsPage, setAlbumsPage] = useState(1);
  const [artistsPage, setArtistsPage] = useState(1);

  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const [hasMoreAlbums, setHasMoreAlbums] = useState(true);
  const [hasMoreArtists, setHasMoreArtists] = useState(true);

  const fetchSongs = async (pageNum: number) => {
    try {
      const songsRes = await api.searchSongs(query, pageNum);
      if (songsRes.data?.results) {
        const newSongs = songsRes.data.results;
        if (newSongs.length === 0) {
          setHasMoreSongs(false);
        } else {
          setSongs(prev => pageNum === 1 ? newSongs : [...prev, ...newSongs]);
        }
      }
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const fetchAlbums = async (pageNum: number) => {
    try {
      const albumsRes = await api.searchAlbums(query, pageNum);
      if (albumsRes.data?.results) {
        const newAlbums = albumsRes.data.results;
        if (newAlbums.length === 0) {
          setHasMoreAlbums(false);
        } else {
          setAlbums(prev => pageNum === 1 ? newAlbums : [...prev, ...newAlbums]);
        }
      }
    } catch (error) {
      console.error('Error searching albums:', error);
    }
  };

  const fetchArtists = async (pageNum: number) => {
    try {
      const artistsRes = await api.searchArtists(query, pageNum);
      if (artistsRes.data?.results) {
        const newArtists = artistsRes.data.results;
        if (newArtists.length === 0) {
          setHasMoreArtists(false);
        } else {
          setArtists(prev => pageNum === 1 ? newArtists : [...prev, ...newArtists]);
        }
      }
    } catch (error) {
      console.error('Error searching artists:', error);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      setSongsPage(1);
      setAlbumsPage(1);
      setArtistsPage(1);
      setHasMoreSongs(true);
      setHasMoreAlbums(true);
      setHasMoreArtists(true);

      await Promise.all([
        fetchSongs(1),
        fetchAlbums(1),
        fetchArtists(1),
      ]);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  const loadMoreSongs = async () => {
    if (!hasMoreSongs) return;
    const nextPage = songsPage + 1;
    setSongsPage(nextPage);
    await fetchSongs(nextPage);
  };

  const loadMoreAlbums = async () => {
    if (!hasMoreAlbums) return;
    const nextPage = albumsPage + 1;
    setAlbumsPage(nextPage);
    await fetchAlbums(nextPage);
  };

  const loadMoreArtists = async () => {
    if (!hasMoreArtists) return;
    const nextPage = artistsPage + 1;
    setArtistsPage(nextPage);
    await fetchArtists(nextPage);
  };

  const { targetRef: songsTargetRef, isLoading: songsLoading } = useInfiniteScroll(loadMoreSongs);
  const { targetRef: albumsTargetRef, isLoading: albumsLoading } = useInfiniteScroll(loadMoreAlbums);
  const { targetRef: artistsTargetRef, isLoading: artistsLoading } = useInfiniteScroll(loadMoreArtists);

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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} queue={songs} />
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {albums.map((album) => (
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
              {hasMoreArtists && (
                <div ref={artistsTargetRef} className="flex justify-center py-8">
                  {artistsLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="aspect-square rounded-full" />
                          <Skeleton className="h-4 w-3/4 mx-auto" />
                          <Skeleton className="h-3 w-1/2 mx-auto" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12">No artists found</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
