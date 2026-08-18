import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,          // Send/receive HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Bubble up the error — let stores handle auth redirects
    return Promise.reject(err);
  }
);

export default api;

// ── API functions ──────────────────────────────────────────────────────────

// Auth
export const authApi = {
  register: (data: { username: string; email: string; displayName: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Artists
export const artistsApi = {
  list: () => api.get('/artists'),
  get: (id: string) => api.get(`/artists/${id}`),
  follow: (id: string) => api.post(`/artists/${id}/follow`),
  unfollow: (id: string) => api.delete(`/artists/${id}/follow`),
};

// Albums
export const albumsApi = {
  list: () => api.get('/albums'),
  get: (id: string) => api.get(`/albums/${id}`),
  save: (id: string) => api.post(`/albums/${id}/save`),
  unsave: (id: string) => api.delete(`/albums/${id}/save`),
};

// Songs
export const songsApi = {
  get: (id: string) => api.get(`/songs/${id}`),
  like: (id: string) => api.post(`/songs/${id}/like`),
  unlike: (id: string) => api.delete(`/songs/${id}/like`),
};

// Playlists
export const playlistsApi = {
  list: () => api.get('/playlists'),
  curated: () => api.get('/playlists/curated'),
  get: (id: string) => api.get(`/playlists/${id}`),
  create: (data: { name: string; description?: string }) => api.post('/playlists', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch(`/playlists/${id}`, data),
  delete: (id: string) => api.delete(`/playlists/${id}`),
  addSong: (id: string, songId: string) => api.post(`/playlists/${id}/songs`, { songId }),
  removeSong: (id: string, songId: string) => api.delete(`/playlists/${id}/songs/${songId}`),
};

// Library
export const libraryApi = {
  likedSongs: () => api.get('/library/liked-songs'),
  savedAlbums: () => api.get('/library/saved-albums'),
  followedArtists: () => api.get('/library/followed-artists'),
};

// History
export const historyApi = {
  get: () => api.get('/history'),
  record: (songId: string) => api.post('/history', { songId }),
};

// Search
export const searchApi = {
  search: (q: string, type = 'all') => api.get('/search', { params: { q, type } }),
};

// Genres
export const genresApi = {
  list: () => api.get('/genres'),
};
