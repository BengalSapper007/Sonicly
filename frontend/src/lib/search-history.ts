/**
 * search-history.ts
 * -----------------
 * Local helper for persisting recent search queries & entities.
 * Acts as an offline / guest fallback and synchronizer for Sonicly.
 */
import type { RecentSearchEntry, RecordRecentSearchPayload } from './api';

const KEY_V2 = 'sonicly_recent_searches_v2';
const KEY_LEGACY = 'sonicly_search_history';
const MAX_ENTRIES = 12;

export function getLocalRecentSearches(): RecentSearchEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY_V2);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    // Fallback: migrate legacy string array if present
    const legacyRaw = localStorage.getItem(KEY_LEGACY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (Array.isArray(legacy)) {
        return legacy.map((q: string, idx: number) => ({
          id: `local_q_${idx}_${encodeURIComponent(q)}`,
          type: 'QUERY' as const,
          query: q,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveLocalRecentSearches(entries: RecentSearchEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_V2, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    // Also sync legacy key for backward compatibility
    const queries = entries
      .filter((e) => e.type === 'QUERY' && e.query)
      .map((e) => e.query as string);
    localStorage.setItem(KEY_LEGACY, JSON.stringify(queries.slice(0, 8)));
  } catch {
    // Quota exceeded
  }
}

export function addLocalRecentSearch(
  payload: RecordRecentSearchPayload,
  hydratedEntity?: { song?: any; artist?: any; album?: any; playlist?: any }
): RecentSearchEntry[] {
  const current = getLocalRecentSearches();

  // Deduplicate
  const filtered = current.filter((item) => {
    if (payload.type === 'QUERY' && payload.query) {
      return item.type !== 'QUERY' || item.query?.toLowerCase() !== payload.query.toLowerCase().trim();
    }
    if (payload.type === 'SONG' && payload.songId) {
      return item.type !== 'SONG' || item.songId !== payload.songId;
    }
    if (payload.type === 'ARTIST' && payload.artistId) {
      return item.type !== 'ARTIST' || item.artistId !== payload.artistId;
    }
    if (payload.type === 'ALBUM' && payload.albumId) {
      return item.type !== 'ALBUM' || item.albumId !== payload.albumId;
    }
    if (payload.type === 'PLAYLIST' && payload.playlistId) {
      return item.type !== 'PLAYLIST' || item.playlistId !== payload.playlistId;
    }
    return true;
  });

  const now = new Date().toISOString();
  const newEntry: RecentSearchEntry = {
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: payload.type,
    query: payload.query?.trim() || null,
    songId: payload.songId || null,
    artistId: payload.artistId || null,
    albumId: payload.albumId || null,
    playlistId: payload.playlistId || null,
    createdAt: now,
    updatedAt: now,
    ...hydratedEntity,
  };

  const updated = [newEntry, ...filtered].slice(0, MAX_ENTRIES);
  saveLocalRecentSearches(updated);
  return updated;
}

export function removeLocalRecentSearch(id: string): RecentSearchEntry[] {
  const current = getLocalRecentSearches();
  const updated = current.filter((item) => item.id !== id && item.query !== id);
  saveLocalRecentSearches(updated);
  return updated;
}

export function clearLocalRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_V2);
  localStorage.removeItem(KEY_LEGACY);
}

// ── Legacy string wrappers for backward compatibility ─────────────────────

export function addSearch(query: string): void {
  if (!query.trim()) return;
  addLocalRecentSearch({ type: 'QUERY', query });
}

export function getSearchHistory(): string[] {
  return getLocalRecentSearches()
    .filter((e) => e.type === 'QUERY' && e.query)
    .map((e) => e.query as string);
}

export function removeSearch(query: string): void {
  const current = getLocalRecentSearches();
  const updated = current.filter((item) => item.query !== query);
  saveLocalRecentSearches(updated);
}

export function clearSearchHistory(): void {
  clearLocalRecentSearches();
}
