import axios from 'axios';

/**
 * Always use a relative /api base URL so requests go through the Next.js
 * dev-server proxy (next.config.ts rewrites). This makes the auth cookie
 * same-origin (set & sent from localhost:3000) — no cross-origin cookie issues.
 *
 * In server-side contexts (SSR / Server Components) we use the absolute URL
 * because the Next.js proxy isn't available server-side.
 */
const isBrowser = typeof window !== 'undefined';
const API_URL = isBrowser
  ? '/api'
  : (() => {
      const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const clean = raw.replace(/\/+$/, '');
      return clean.endsWith('/api') ? clean : `${clean}/api`;
    })();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,          // Send/receive HTTP-only cookies
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Request interceptor — attach the stored JWT as an Authorization: Bearer header.
 *
 * We read directly from localStorage (instead of importing useAuthStore) to
 * avoid a circular dependency: api.ts ← auth.store.ts ← api.ts.
 *
 * The token is stored under the Zustand persist key 'sonicly-auth' in the
 * shape { state: { token: string | null } }. On every request we grab the
 * latest value so token refreshes are picked up automatically.
 *
 * This is the definitive fix for the cross-origin cookie issue in development:
 * even if the browser refuses to send the httpOnly cookie for cross-origin
 * requests, the Bearer token in the Authorization header always works.
 */
function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('sonicly-auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Bubble up the error — let stores handle auth redirects
    return Promise.reject(err);
  }
);

export default api;

/**
 * Build the backend URL for an R2 artwork object key.
 * The backend will redirect to a short-lived presigned R2 URL.
 *
 * Usage:  <img src={artworkUrl(artist.imageKey)} />
 *
 * @param key  R2 object key, e.g. "artists/ar_abc.webp" (or null/undefined)
 */
export function artworkUrl(key: string | null | undefined): string | undefined {
  if (!key) return undefined;
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const cleanKey = key.replace(/^\/+/, '').replace(/^images\//, '');
  return `/api/media/artwork?key=${encodeURIComponent(cleanKey)}`;
}

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
  /** Returns song metadata plus a short-lived presigned R2 streamUrl */
  getStreamUrl: (id: string) => api.get<{ streamUrl: string }>(`/songs/${id}/stream`),
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
export type SearchHistoryType = 'QUERY' | 'SONG' | 'ARTIST' | 'ALBUM' | 'PLAYLIST';

export interface RecentSearchEntry {
  id: string;
  type: SearchHistoryType;
  query?: string | null;
  songId?: string | null;
  artistId?: string | null;
  albumId?: string | null;
  playlistId?: string | null;
  createdAt: string;
  updatedAt: string;
  song?: any;
  artist?: any;
  album?: any;
  playlist?: any;
}

export interface RecordRecentSearchPayload {
  type: SearchHistoryType;
  query?: string;
  songId?: string;
  artistId?: string;
  albumId?: string;
  playlistId?: string;
}

export const searchApi = {
  search: (q: string, type = 'all') => api.get('/search', { params: { q, type } }),
  getRecent: () => api.get<RecentSearchEntry[]>('/search/recent'),
  recordRecent: (data: RecordRecentSearchPayload) => api.post<RecentSearchEntry>('/search/recent', data),
  removeRecent: (id: string) => api.delete(`/search/recent/${id}`),
  clearRecent: () => api.delete('/search/recent'),
};

// Genres
export const genresApi = {
  list: () => api.get('/genres'),
};
