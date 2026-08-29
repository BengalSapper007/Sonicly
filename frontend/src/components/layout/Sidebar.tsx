'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import {
  Home,
  Search,
  Library,
  Heart,
  Disc,
  Users,
  ListMusic,
  Plus,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  LucideIcon,
} from 'lucide-react';

interface NavItemConfig {
  href: string;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/library', icon: Library, label: 'Library' },
];

const LIBRARY_ITEMS: NavItemConfig[] = [
  { href: '/library/liked', icon: Heart, label: 'Liked Songs' },
  { href: '/library/albums', icon: Disc, label: 'Saved Albums' },
  { href: '/library/artists', icon: Users, label: 'Following' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <aside
      className="flex-shrink-0 h-full flex flex-col overflow-hidden select-none"
      style={{
        width: 'var(--sidebar-width)',
        background: 'rgba(25, 25, 29, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '4px 0 30px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* ── Brand ──────────────────────────────────────────────────────────── */}
      <Link href="/" className="px-5 py-5 flex items-center gap-3.5 group">
        {/* Official Logo mark */}
        <div
          className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105 shadow-lg relative"
          style={{
            boxShadow: '0 0 20px rgba(208, 188, 255, 0.35)',
          }}
        >
          <img
            src="/logo-icon.png"
            alt="Sonicly"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div>
          <span
            className="text-gradient-brand font-black text-xl block tracking-tight leading-none"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Sonicly
          </span>
          <p className="text-[11px] text-zinc-400 font-medium tracking-wide mt-1">
            Premium Music
          </p>
        </div>
      </Link>

      {/* ── Main Nav ───────────────────────────────────────────────────────── */}
      <nav className="px-3 space-y-1">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <NavItem
              key={href}
              href={href}
              icon={icon}
              label={label}
              active={isActive}
            />
          );
        })}
      </nav>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div
        className="mx-5 my-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}
      />

      {/* ── Library Section ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 no-scrollbar space-y-4">
        {isAuthenticated ? (
          <>
            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Your Library
                </span>
                <button
                  className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Create playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {LIBRARY_ITEMS.map(({ href, icon, label }) => (
                  <NavItem
                    key={href}
                    href={href}
                    icon={icon}
                    label={label}
                    active={pathname === href}
                    small
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Playlists
                </span>
              </div>
              <Link
                href="/playlists"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  pathname.startsWith('/playlist')
                    ? 'text-purple-200 font-semibold bg-purple-500/10 border-l-[3px] border-purple-400'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                )}
              >
                <ListMusic className="w-4 h-4 text-purple-300" />
                <span>Discover Playlists</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 shadow-inner">
            <h4 className="text-sm font-semibold text-zinc-100 mb-1">
              Log in to see your library
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Save songs, create playlists, and follow your favorite artists.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="btn-primary justify-center text-center text-xs py-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="btn-glass justify-center text-center text-xs py-2"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

        {/* ── Trending Shelf ───────────────────────────────────────────────── */}
        <div>
          <div className="px-3 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Trending
            </span>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Top 50 Charts</span>
          </Link>
        </div>
      </div>

      {/* ── User Footer ────────────────────────────────────────────────────── */}
      {isAuthenticated && user && (
        <div
          className="p-3 bg-zinc-950/40"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-purple-950 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #d0bcff 0%, #ffb0cd 100%)',
                }}
              >
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-100 truncate">
                  {user.displayName}
                </p>
                <p className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                  Premium
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  small = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl transition-all group relative font-medium',
        small ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-sm',
        active
          ? 'text-purple-100 font-semibold bg-white/10 shadow-sm border-l-[3px] border-purple-400'
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
      )}
    >
      <Icon
        className={cn(
          'transition-transform group-hover:scale-110 flex-shrink-0',
          small ? 'w-4 h-4' : 'w-5 h-5',
          active ? 'text-purple-300' : 'text-zinc-400 group-hover:text-zinc-200'
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
