import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import { Navbar } from "./components/Navbar";
import { MusicPlayer } from "./components/MusicPlayer";
import { FullscreenPlayer } from "./components/FullscreenPlayer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AlbumDetail from "./pages/AlbumDetail";
import ArtistDetail from "./pages/ArtistDetail";
import Albums from "./pages/Albums";
import Artists from "./pages/Artists";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicPlayerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/artist/:id" element={<ArtistDetail />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/artists" element={<Artists />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MusicPlayer />
            <FullscreenPlayer />
          </div>
        </BrowserRouter>
      </MusicPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
