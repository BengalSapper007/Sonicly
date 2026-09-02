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
      className="flex-shrink-0 h-full flex flex-col overflow-hidden select-none border-r border-sand"
      style={{ width: 'var(--sidebar-width)', background: '#F6F1E4' }}
    >
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <Link href="/" className="px-5 flex items-center gap-3 group" style={{ height: 'var(--header-height)' }}>
        <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-transform group-hover:scale-105">
          S
        </div>
        <span className="font-display font-semibold text-lg text-ink block tracking-tight leading-none">
          Sonicly
        </span>
      </Link>

      <div className="mx-5 border-t border-sand" />

      {/* ── Main Nav ──────────────────────────────────────────────────────── */}
      <nav className="px-3 pt-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <NavItem key={href} href={href} icon={icon} label={label} active={isActive} />
          );
        })}
      </nav>

      <div className="mx-5 my-4 border-t border-sand" />

      {/* ── Library Section ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 no-scrollbar space-y-5">
        {isAuthenticated ? (
          <>
            <div>
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-ink-muted">Your library</span>
              </div>
              <div className="space-y-0.5">
                {LIBRARY_ITEMS.map(({ href, icon, label }) => (
                  <NavItem key={href} href={href} icon={icon} label={label} active={pathname === href} small />
                ))}
              </div>
            </div>

            <div>
              <div className="px-3 mb-2">
                <span className="text-xs font-medium text-ink-muted">Discover</span>
              </div>
              <Link
                href="/playlists"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-all font-medium',
                  pathname.startsWith('/playlist')
                    ? 'text-ink bg-sand/60'
                    : 'text-ink-muted hover:text-ink hover:bg-sand/40'
                )}
              >
                <ListMusic className="w-4 h-4 text-saffron" />
                <span>Discover playlists</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-ink-muted hover:text-ink hover:bg-sand/40 transition-all font-medium mt-0.5"
              >
                <BarChart3 className="w-4 h-4 text-saffron" />
                <span>Top 50 charts</span>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg border border-sand bg-paper">
            <h4 className="text-sm font-semibold text-ink mb-1">Log in to see your library</h4>
            <p className="text-xs text-ink-muted leading-relaxed mb-4">
              Save songs, create playlists, and follow your favorite artists.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="btn-primary justify-center text-center text-xs py-2">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-center text-xs font-semibold text-ink-muted hover:text-ink border border-sand py-2 rounded-md transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="p-4 rounded-lg bg-saffron-tint border border-saffron/25">
            <p className="text-sm font-semibold text-saffron-deep mb-1">Go Pro</p>
            <p className="text-[11px] text-ink-muted leading-snug mb-3">
              Lossless audio, offline mode &amp; no ads.
            </p>
            <button className="w-full py-2 bg-saffron text-white font-semibold text-xs rounded-md hover:bg-saffron-deep transition-colors">
              Upgrade now
            </button>
          </div>
        )}
      </div>

      {/* ── User Footer ───────────────────────────────────────────────────── */}
      {isAuthenticated && user && (
        <div className="p-3 border-t border-sand">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-sand/40 transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center font-semibold text-xs text-white flex-shrink-0">
                {user.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink truncate">{user.displayName}</p>
                <p className="text-[11px] font-medium text-saffron">Pro</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded text-ink-muted hover:text-saffron hover:bg-sand/60 transition-all"
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
        'flex items-center gap-3 rounded-md transition-all group relative font-medium',
        small ? 'px-3 py-2 text-xs' : 'px-3 py-2.5 text-sm',
        active ? 'text-ink bg-sand/60' : 'text-ink-muted hover:text-ink hover:bg-sand/40'
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-saffron" />
      )}
      <Icon
        className={cn(
          'transition-transform group-hover:scale-110 flex-shrink-0',
          small ? 'w-4 h-4' : 'w-5 h-5',
          active ? 'text-saffron' : 'text-ink-muted group-hover:text-saffron'
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
