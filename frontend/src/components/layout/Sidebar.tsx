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
  BarChart3,
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
      className="flex-shrink-0 h-full flex flex-col overflow-hidden select-none border-r-2 border-prussian-blue"
      style={{ width: 'var(--sidebar-width)', background: '#0C1626' }}
    >
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <Link href="/" className="px-5 py-5 flex items-center gap-3 group border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-vibrant-saffron flex items-center justify-center text-white font-bold text-lg flex-shrink-0 transition-transform group-hover:scale-105">
          S
        </div>
        <div>
          <span className="font-bold text-xl text-white block tracking-tight leading-none">
            Sonicly
          </span>
          <p className="text-[11px] text-on-primary-muted mt-0.5">
            Premium music
          </p>
        </div>
      </Link>

      {/* ── Main Nav ──────────────────────────────────────────────────────── */}
      <nav className="px-3 pt-4 space-y-1">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <NavItem key={href} href={href} icon={icon} label={label} active={isActive} />
          );
        })}
      </nav>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="mx-5 my-4 border-t border-prussian-blue/50" />

      {/* ── Library Section ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 no-scrollbar space-y-4">
        {isAuthenticated ? (
          <>
            <div>
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-on-primary-muted/70">
                  Your Library
                </span>
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
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-on-primary-muted/70">
                  Discover
                </span>
              </div>
              <Link
                href="/playlists"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded text-xs transition-all font-semibold',
                  pathname.startsWith('/playlist')
                    ? 'text-white bg-prussian-blue border-l-4 border-vibrant-saffron pl-2'
                    : 'text-on-primary-muted hover:text-white hover:bg-prussian-blue/50'
                )}
              >
                <ListMusic className="w-4 h-4 text-vibrant-saffron" />
                <span>Discover Playlists</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-3 px-3 py-2 rounded text-xs text-on-primary-muted hover:text-white hover:bg-prussian-blue/50 transition-all font-semibold mt-1"
              >
                <BarChart3 className="w-4 h-4 text-vibrant-saffron" />
                <span>Top 50 Charts</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg border border-white/15 bg-white/5">
            <h4 className="text-sm font-bold text-white mb-1">
              Log in to see your library
            </h4>
            <p className="text-xs text-on-primary-muted leading-relaxed mb-4">
              Save songs, create playlists, and follow your favorite artists.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="btn-primary justify-center text-center text-xs py-2">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-center text-xs font-bold text-on-primary-muted hover:text-white border border-on-primary-muted/40 py-2 rounded transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

        {/* Upgrade Card */}
        {isAuthenticated && (
          <div className="p-4 rounded-lg bg-vibrant-saffron/12 border border-vibrant-saffron/25">
            <p className="text-sm font-semibold text-vibrant-saffron mb-1">
              ★ Go Pro
            </p>
            <p className="text-[11px] text-on-primary-muted leading-snug mb-3">
              Lossless audio, offline mode & no ads.
            </p>
            <button className="w-full py-2 bg-vibrant-saffron text-white font-semibold text-xs rounded-md hover:bg-deep-saffron transition-colors">
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* ── User Footer ───────────────────────────────────────────────────── */}
      {isAuthenticated && user && (
        <div className="p-3 border-t-2 border-prussian-blue">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-prussian-blue/40 transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-vibrant-saffron flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.displayName}
                </p>
                <p className="text-[11px] font-medium text-vibrant-saffron">
                  Pro
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded text-on-primary-muted hover:text-vibrant-saffron hover:bg-prussian-blue transition-all"
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
        'flex items-center gap-3 rounded transition-all group relative font-bold',
        small ? 'px-3 py-2 text-xs' : 'px-3 py-2.5 text-sm',
        active
          ? 'text-white bg-prussian-blue border-l-4 border-vibrant-saffron pl-2'
          : 'text-on-primary-muted hover:text-white hover:bg-prussian-blue/50'
      )}
    >
      <Icon
        className={cn(
          'transition-transform group-hover:scale-110 flex-shrink-0',
          small ? 'w-4 h-4' : 'w-5 h-5',
          active ? 'text-vibrant-saffron' : 'text-on-primary-muted group-hover:text-vibrant-saffron'
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
