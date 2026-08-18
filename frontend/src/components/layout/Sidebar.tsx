'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon, SearchIcon, LibraryIcon, ListMusicIcon,
  HeartIcon, DiscIcon, MicIcon, TrendingUpIcon, PlusCircleIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const NAV_ITEMS = [
  { href: '/',           icon: HomeIcon,      label: 'Home' },
  { href: '/search',     icon: SearchIcon,    label: 'Search' },
  { href: '/library',    icon: LibraryIcon,   label: 'Your Library' },
];

const LIBRARY_ITEMS = [
  { href: '/library/liked', icon: HeartIcon,      label: 'Liked Songs' },
  { href: '/library/albums',icon: DiscIcon,       label: 'Saved Albums' },
  { href: '/library/artists',icon: MicIcon,       label: 'Following' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  return (
    <aside
      className="flex-shrink-0 h-full flex flex-col bg-abyss border-r border-rim overflow-hidden"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-sonic flex items-center justify-center shadow-sonic">
          <span className="text-white font-display font-bold text-sm">S</span>
        </div>
        <span className="font-display font-bold text-lg text-gradient-sonic">Sonicly</span>
      </div>

      {/* Main nav */}
      <nav className="px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <NavLink key={href} href={href} icon={Icon} label={label} active={pathname === href} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 border-t border-rim" />

      {/* Library section */}
      {isAuthenticated ? (
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-4 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-ghost uppercase tracking-wider">Library</span>
            <button className="p-1 rounded-md text-ink-ghost hover:text-ink hover:bg-rim transition-colors">
              <PlusCircleIcon size={16} />
            </button>
          </div>

          <nav className="px-3 space-y-0.5">
            {LIBRARY_ITEMS.map(({ href, icon: Icon, label }) => (
              <NavLink
                key={href}
                href={href}
                icon={Icon}
                label={label}
                active={pathname === href}
                small
              />
            ))}
          </nav>

          <div className="px-4 mt-4 mb-2">
            <span className="text-xs font-semibold text-ink-ghost uppercase tracking-wider">Playlists</span>
          </div>

          {/* User playlists would be rendered here */}
          <nav className="px-3">
            <Link
              href="/playlists"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group',
                pathname.startsWith('/playlists')
                  ? 'text-ink bg-rim'
                  : 'text-ink-dim hover:text-ink hover:bg-rim/60'
              )}
            >
              <ListMusicIcon size={16} className="group-hover:text-sonic transition-colors" />
              Discover Playlists
            </Link>
          </nav>
        </div>
      ) : (
        <div className="flex-1 px-4 py-4">
          <div className="rounded-xl bg-surface border border-rim p-4">
            <p className="text-sm font-medium text-ink mb-1">Log in to see your library</p>
            <p className="text-xs text-ink-dim mb-3">Save songs, albums and playlists.</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2 px-4 rounded-lg bg-sonic text-white text-sm font-medium
                  hover:bg-sonic-light transition-colors shadow-sonic"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="w-full text-center py-2 px-4 rounded-lg border border-rim text-ink-dim text-sm
                  hover:text-ink hover:border-muted transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
          {/* Trending */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon size={14} className="text-sonic" />
              <span className="text-xs font-semibold text-ink-ghost uppercase tracking-wider">Trending</span>
            </div>
            <Link
              href="/charts"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink-dim
                hover:text-ink hover:bg-rim/60 transition-all"
            >
              <ListMusicIcon size={16} />
              Top 50 Charts
            </Link>
          </div>
        </div>
      )}

      {/* Bottom spacer — account info if logged in */}
      {isAuthenticated && <SidebarUser />}
    </aside>
  );
}

function NavLink({
  href, icon: Icon, label, active, small = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg transition-all group',
        small ? 'px-3 py-2 text-sm' : 'px-3 py-2.5 text-sm font-medium',
        active
          ? 'text-ink bg-rim shadow-inner'
          : 'text-ink-dim hover:text-ink hover:bg-rim/60'
      )}
    >
      <Icon
        size={small ? 16 : 18}
        className={cn('transition-colors', active ? 'text-sonic' : 'group-hover:text-sonic')}
      />
      {label}
    </Link>
  );
}

function SidebarUser() {
  const { user, logout } = useAuthStore();
  if (!user) return null;

  return (
    <div className="border-t border-rim p-3">
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rim/60 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-sonic flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {user.displayName?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-ink line-clamp-1">{user.displayName}</p>
          <p className="text-xs text-ink-ghost line-clamp-1">@{user.username}</p>
        </div>
      </button>
    </div>
  );
}
