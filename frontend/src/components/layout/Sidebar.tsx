'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="hidden md:flex flex-col h-full py-stack-md bg-midnight-blue w-64 fixed left-0 top-0 border-r-2 border-prussian-blue z-40 select-none">
      {/* ── Brand & User Profile ────────────────────────────────────────────── */}
      <div className="px-6 mb-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded bg-vibrant-saffron flex items-center justify-center text-prussian-blue font-black text-xl border-2 border-prussian-blue hard-shadow-sm transition-transform group-hover:scale-105">
            S
          </div>
          <h2 className="font-headline-md text-headline-md font-black text-vibrant-saffron tracking-tight">
            Sonicly
          </h2>
        </Link>

        <div className="flex items-center gap-3 mt-5 p-2 rounded bg-prussian-blue/40 border border-prussian-blue/60">
          <div className="w-10 h-10 rounded-full border-2 border-vibrant-saffron overflow-hidden flex-shrink-0 bg-prussian-blue flex items-center justify-center text-white font-bold text-sm">
            {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-xs text-white truncate">
              {user ? user.displayName || 'Sonicly User' : 'Guest Listener'}
            </p>
            <p className="text-[11px] font-medium text-vibrant-saffron">
              {isAuthenticated ? 'Premium Member' : 'Free Tier'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav Items ───────────────────────────────────────────────────────── */}
      <ul className="flex flex-col gap-1.5 flex-grow mt-2 font-body-md text-body-md">
        <li>
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3.5 py-2.5 transition-colors font-medium text-sm',
              pathname === '/'
                ? 'text-vibrant-saffron font-bold border-l-4 border-vibrant-saffron pl-4 bg-prussian-blue/80'
                : 'text-on-primary-container hover:text-white pl-5 hover:bg-prussian-blue/40'
            )}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={pathname === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              home
            </span>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className={cn(
              'flex items-center gap-3.5 py-2.5 transition-colors font-medium text-sm',
              pathname.startsWith('/search')
                ? 'text-vibrant-saffron font-bold border-l-4 border-vibrant-saffron pl-4 bg-prussian-blue/80'
                : 'text-on-primary-container hover:text-white pl-5 hover:bg-prussian-blue/40'
            )}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={pathname.startsWith('/search') ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              explore
            </span>
            <span>Explore</span>
          </Link>
        </li>
        <li>
          <Link
            href="/library"
            className={cn(
              'flex items-center gap-3.5 py-2.5 transition-colors font-medium text-sm',
              pathname.startsWith('/library')
                ? 'text-vibrant-saffron font-bold border-l-4 border-vibrant-saffron pl-4 bg-prussian-blue/80'
                : 'text-on-primary-container hover:text-white pl-5 hover:bg-prussian-blue/40'
            )}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={pathname.startsWith('/library') ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              library_music
            </span>
            <span>Library</span>
          </Link>
        </li>

        <div className="h-px bg-prussian-blue my-3 mx-4"></div>

        <li className="px-5 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container/80">
            Playlists
          </span>
        </li>
        <li>
          <Link
            href="/library"
            className="flex items-center gap-3.5 py-2 text-on-primary-container hover:text-white pl-5 hover:bg-prussian-blue/40 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            <span>Create Playlist</span>
          </Link>
        </li>
        <li>
          <Link
            href="/library"
            className="flex items-center gap-3.5 py-2 text-on-primary-container hover:text-white pl-5 hover:bg-prussian-blue/40 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            <span>Liked Songs</span>
          </Link>
        </li>
      </ul>

      {/* ── Footer CTA & Auth ────────────────────────────────────────────────── */}
      <div className="px-6 mt-auto flex flex-col gap-3">
        <button className="w-full bg-vibrant-saffron text-prussian-blue font-label-md text-xs py-2.5 rounded font-bold border-2 border-prussian-blue shadow-[3px_3px_0px_0px_rgba(0,49,83,1)] hover:bg-deep-saffron transition-all active:translate-y-0.5 active:shadow-none">
          Upgrade to Pro
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => logout()}
            className="text-xs text-on-primary-container hover:text-white py-1 flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-1.5 text-xs text-white border border-on-primary-container rounded hover:bg-prussian-blue transition-colors font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-1.5 text-xs bg-white text-prussian-blue rounded font-bold hover:bg-zinc-200 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
