import { useEffect, useState } from 'react';
import { api, Album } from '@/lib/api';
import { AlbumCard } from '@/components/AlbumCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAlbums = async (pageNum: number) => {
    try {
      const response = await api.searchAlbums('bollywood', pageNum);
      if (response.data?.results) {
        const newAlbums = response.data.results;
        if (newAlbums.length === 0) {
          setHasMore(false);
        } else {
          setAlbums(prev => pageNum === 1 ? newAlbums : [...prev, ...newAlbums]);
        }
      }
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchAlbums(1);
      setLoading(false);
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchAlbums(nextPage);
  };

  const { targetRef, isLoading } = useInfiniteScroll(loadMore);

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Popular Albums</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={targetRef} className="flex justify-center py-8">
              {isLoading && (
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
      )}
    </div>
  );
}
