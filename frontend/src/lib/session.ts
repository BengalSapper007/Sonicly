/**
 * session.ts
 * ----------
 * Thin sessionStorage helpers for preserving the user's intended destination
 * before they are redirected to /login.  Stored in sessionStorage so the
 * redirect is forgotten when the browser tab is closed.
 *
 * All functions are SSR-safe (they no-op when window is undefined).
 */

const REDIRECT_KEY = 'sonicly_redirect';

/**
 * Persist the path the user was trying to reach before being redirected
 * to /login.  Call this from any "auth required" guard or component.
 */
export function saveRedirect(path: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(REDIRECT_KEY, path);
}

/**
 * Read the stored redirect path and immediately clear it.
 * Returns `'/'` when no redirect was saved.
 *
 * Usage (in login page after successful auth):
 *   router.push(popRedirect());
 */
export function popRedirect(): string {
  if (typeof window === 'undefined') return '/';
  const path = sessionStorage.getItem(REDIRECT_KEY) || '/';
  sessionStorage.removeItem(REDIRECT_KEY);
  return path;
}
