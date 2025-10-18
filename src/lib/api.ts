const API_BASE_URL = 'https://jiosaavn-api-privatecvc2.vercel.app';

export interface Song {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  year: string;
  releaseDate: string;
  duration: number;
  label: string;
  primaryArtists: string;
  primaryArtistsId: string;
  featuredArtists: string;
  featuredArtistsId: string;
  explicitContent: number;
  playCount: number;
  language: string;
  hasLyrics: boolean;
  url: string;
  copyright: string;
  image: Array<{
    quality: string;
    link: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    link: string;
  }>;
}

export interface Album {
  id: string;
  name: string;
  year: string;
  releaseDate: string;
  songCount: number;
  url: string;
  primaryArtistsId: string;
  primaryArtists: string;
  featuredArtists: string;
  artists: Array<{
    id: string;
    name: string;
    url: string;
    image: Array<{
      quality: string;
      link: string;
    }>;
    type: string;
    role: string;
  }>;
  image: Array<{
    quality: string;
    link: string;
  }>;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  url: string;
  image: Array<{
    quality: string;
    link: string;
  }>;
  followerCount: number;
  fanCount: number;
  isVerified: boolean;
  dominantLanguage: string;
  dominantType: string;
  topSongs: Song[];
  topAlbums: Album[];
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  followerCount: number;
  songCount: number;
  fanCount: number;
  username: string;
  firstname: string;
  lastname: string;
  shares: number;
  image: Array<{
    quality: string;
    link: string;
  }>;
  url: string;
  songs: Song[];
}

export const api = {
  // Search
  async searchAll(query: string) {
    const response = await fetch(`${API_BASE_URL}/api/search/all?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  async searchSongs(query: string) {
    const response = await fetch(`${API_BASE_URL}/api/search/songs?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  async searchAlbums(query: string) {
    const response = await fetch(`${API_BASE_URL}/api/search/albums?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  async searchArtists(query: string) {
    const response = await fetch(`${API_BASE_URL}/api/search/artists?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  async searchPlaylists(query: string) {
    const response = await fetch(`${API_BASE_URL}/api/search/playlists?query=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Songs
  async getSong(id: string): Promise<{ data: Song }> {
    const response = await fetch(`${API_BASE_URL}/api/songs/${id}`);
    return response.json();
  },

  async getSongSuggestions(id: string) {
    const response = await fetch(`${API_BASE_URL}/api/songs/${id}/suggestions`);
    return response.json();
  },

  // Albums
  async getAlbum(id: string): Promise<{ data: Album }> {
    const response = await fetch(`${API_BASE_URL}/api/albums/${id}`);
    return response.json();
  },

  // Artists
  async getArtist(id: string): Promise<{ data: Artist }> {
    const response = await fetch(`${API_BASE_URL}/api/artists/${id}`);
    return response.json();
  },

  async getArtistSongs(id: string, page: number = 1) {
    const response = await fetch(`${API_BASE_URL}/api/artists/${id}/songs?page=${page}`);
    return response.json();
  },

  async getArtistAlbums(id: string, page: number = 1) {
    const response = await fetch(`${API_BASE_URL}/api/artists/${id}/albums?page=${page}`);
    return response.json();
  },

  // Playlists
  async getPlaylist(id: string): Promise<{ data: Playlist }> {
    const response = await fetch(`${API_BASE_URL}/api/playlists/${id}`);
    return response.json();
  },

  // Modules (trending, featured, etc.)
  async getModules() {
    const response = await fetch(`${API_BASE_URL}/api/modules`);
    return response.json();
  },
};
