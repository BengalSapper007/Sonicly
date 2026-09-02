/**
 * search-history.ts
 * -----------------
 * localStorage helper for persisting recent search queries.
 *
 * Rules:
 *  - Maximum 8 unique entries (oldest dropped when full)
 *  - New entries are prepended so most-recent appears first
 *  - Duplicate queries are moved to the front (not duplicated)
 *  - All functions are SSR-safe (no-ops when window is undefined)
 */

const KEY = 'sonicly_search_history';
const MAX_ENTRIES = 8;

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded — skip silently
  }
}

/**
 * Prepend a query to the history list, deduplicating and capping at MAX_ENTRIES.
 * Empty or whitespace-only strings are ignored.
 */
export function addSearch(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const existing = read().filter((q) => q !== trimmed);
  write([trimmed, ...existing].slice(0, MAX_ENTRIES));
}

/**
 * Return the full history list (most-recent first).
 */
export function getSearchHistory(): string[] {
  return read();
}

/**
 * Remove a single query from history.
 */
export function removeSearch(query: string): void {
  write(read().filter((q) => q !== query));
}

/**
 * Wipe all saved search history.
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
