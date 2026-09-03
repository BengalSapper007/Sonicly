/**
 * stream-cache.ts
 * ---------------
 * TTL-aware sessionStorage cache for Cloudflare R2 presigned stream URLs.
 *
 * R2 presigned URLs expire after 1 hour.  We cache them for 50 minutes to
 * give a comfortable safety margin.  Storing in sessionStorage means the
 * cache lives for the tab session only — a fresh tab always fetches a new URL,
 * preventing stale-URL playback errors across sessions.
 *
 * Cache entry shape: { url: string; expiresAt: number }
 * Key pattern:       "sonicly_stream_<songId>"
 */

import { songsApi } from './api';

const PREFIX = 'sonicly_stream_';
const TTL_MS = 50 * 60 * 1000; // 50 minutes

interface CacheEntry {
  url: string;
  expiresAt: number;
}

function cacheKey(songId: string): string {
  return `${PREFIX}${songId}`;
}

function readEntry(songId: string): CacheEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(songId));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() >= entry.expiresAt) {
      // Expired — evict eagerly
      sessionStorage.removeItem(cacheKey(songId));
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeEntry(songId: string, url: string): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry = { url, expiresAt: Date.now() + TTL_MS };
    sessionStorage.setItem(cacheKey(songId), JSON.stringify(entry));
  } catch {
    // Quota exceeded or private mode — silently continue without caching
  }
}

/**
 * Returns a valid presigned R2 stream URL for the given song.
 *
 * - If a non-expired cached URL exists in sessionStorage → returns it immediately.
 * - Otherwise → fetches from `/songs/:id/stream`, caches the result, then returns it.
 *
 * Throws if the API request fails (caller should handle).
 */
export async function getStreamUrl(songId: string): Promise<string> {
  const cached = readEntry(songId);
  if (cached) return cached.url;

  const { data } = await songsApi.getStreamUrl(songId);
  writeEntry(songId, data.streamUrl);
  return data.streamUrl;
}

/**
 * Manually evict a cached URL (e.g. after a playback error suggests the URL
 * expired early or was rotated).
 */
export function evictStreamUrl(songId: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(cacheKey(songId));
}
