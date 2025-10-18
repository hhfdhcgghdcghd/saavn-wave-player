import { useEffect, useState } from 'react';
import { api, Song } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-music.jpg';

export default function Home() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending songs using search
        const response = await api.searchSongs('trending');
        if (response.data?.results) {
          setTrendingSongs(response.data.results.slice(0, 12));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-8">
        <img
          src={heroImage}
          alt="Music Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Your Music, Your Vibe
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Stream millions of songs from your favorite artists. Discover new music every day.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Trending Songs */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          
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
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 animate-fade-in">
              {trendingSongs.map((song) => (
                <SongCard key={song.id} song={song} queue={trendingSongs} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
