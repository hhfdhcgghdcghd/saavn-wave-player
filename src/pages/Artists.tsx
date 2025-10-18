import { useEffect, useState } from 'react';
import { api, Artist } from '@/lib/api';
import { ArtistCard } from '@/components/ArtistCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Artists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArtists = async (pageNum: number) => {
    try {
      const response = await api.searchArtists('a', pageNum);
      if (response.data?.results) {
        const newArtists = response.data.results;
        if (newArtists.length === 0) {
          setHasMore(false);
        } else {
          setArtists(prev => pageNum === 1 ? newArtists : [...prev, ...newArtists]);
        }
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchArtists(1);
      setLoading(false);
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchArtists(nextPage);
  };

  const { targetRef, isLoading } = useInfiniteScroll(loadMore);

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Popular Artists</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 animate-fade-in">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={targetRef} className="flex justify-center py-8">
              {isLoading && (
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
      )}
    </div>
  );
}
