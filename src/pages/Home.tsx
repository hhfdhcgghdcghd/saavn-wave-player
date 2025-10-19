import { useEffect, useState } from 'react';
import { api, Song, Album, Artist } from '@/lib/api';
import { SongCard } from '@/components/SongCard';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-music.jpg';
import { Sparkles, TrendingUp, Music2, Disc3 } from 'lucide-react';

export default function Home() {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [newReleases, setNewReleases] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsRes, albumsRes, artistsRes, releasesRes] = await Promise.all([
          api.searchSongs('trending', 1),
          api.searchAlbums('latest', 1),
          api.searchArtists('popular', 1),
          api.searchSongs('new', 1),
        ]);

        if (songsRes.data?.results) setTrendingSongs(songsRes.data.results.slice(0, 12));
        if (albumsRes.data?.results) setTopAlbums(albumsRes.data.results.slice(0, 10));
        if (artistsRes.data?.results) setTopArtists(artistsRes.data.results.slice(0, 10));
        if (releasesRes.data?.results) setNewReleases(releasesRes.data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
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
        {loading ? (
          <div className="space-y-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="min-w-[160px] space-y-3">
                      <Skeleton className="aspect-square rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Trending Songs */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {trendingSongs.map((song) => (
                  <SongCard key={song.id} song={song} queue={trendingSongs} />
                ))}
              </div>
            </section>

            {/* New Releases */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-secondary">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">New Releases</h2>
              </div>
              <HorizontalScroll title="">
                {newReleases.map((song) => (
                  <div key={song.id} className="min-w-[160px] md:min-w-[180px]">
                    <SongCard song={song} queue={newReleases} />
                  </div>
                ))}
              </HorizontalScroll>
            </section>

            {/* Top Albums */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-accent">
                  <Disc3 className="w-5 h-5 text-accent-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Top Albums</h2>
              </div>
              <HorizontalScroll title="">
                {topAlbums.map((album) => (
                  <div key={album.id} className="min-w-[160px] md:min-w-[180px]">
                    <AlbumCard album={album} />
                  </div>
                ))}
              </HorizontalScroll>
            </section>

            {/* Popular Artists */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-primary">
                  <Music2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Popular Artists</h2>
              </div>
              <HorizontalScroll title="">
                {topArtists.map((artist) => (
                  <div key={artist.id} className="min-w-[160px] md:min-w-[180px]">
                    <ArtistCard artist={artist} />
                  </div>
                ))}
              </HorizontalScroll>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
