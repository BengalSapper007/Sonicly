'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useSidebarStore, SIDEBAR_DEFAULT_WIDTH } from '@/stores/sidebar.store';
import {
  Home,
  Search,
  Library,
  Heart,
  Disc,
  Users,
  ListMusic,
  BarChart3,
  LogIn,
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
  const { isAuthenticated } = useAuthStore();
  const {
    width,
    isCollapsed,
    isDragging,
    setDragWidth,
    finishDrag,
    setIsDragging,
    collapse,
    expand,
    lastExpandedWidth,
  } = useSidebarStore();
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Drag resizing logic
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = width;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setDragWidth(startWidth + deltaX);
    };

    const onPointerUp = () => {
      finishDrag();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleDoubleClick = () => {
    if (isCollapsed) {
      expand(lastExpandedWidth || SIDEBAR_DEFAULT_WIDTH);
    } else {
      collapse();
    }
  };

  return (
    <aside
      className={cn(
        'relative flex-shrink-0 h-full flex flex-col overflow-hidden select-none border-r border-sand',
        !isDragging && 'transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]'
      )}
      style={{ width: `${width}px`, background: '#F6F1E4' }}
    >
      {/* ── Brand ─────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex items-center group transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
          isCollapsed ? 'justify-center px-2' : 'px-5'
        )}
        style={{ height: 'var(--header-height)' }}
      >
        <Link
          href="/"
          className="flex items-center"
          title="Sonicly"
        >
          <div
            className={cn(
              'rounded-full bg-saffron flex items-center justify-center text-white font-bold flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 shadow-sm',
              isCollapsed ? 'w-9 h-9 text-base' : 'w-8 h-8 text-sm'
            )}
          >
            S
          </div>
          <span
            className={cn(
              'font-display font-semibold text-lg text-ink block tracking-tight leading-none whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
              isCollapsed ? 'max-w-0 opacity-0 -translate-x-2' : 'max-w-[140px] opacity-100 translate-x-0 ml-3'
            )}
          >
            Sonicly
          </span>
        </Link>
      </div>

      <div
        className={cn(
          'border-t border-sand transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
          isCollapsed ? 'mx-3' : 'mx-5'
        )}
      />

      {/* ── Main Nav ──────────────────────────────────────────────────────── */}
      <nav className={cn('pt-4 space-y-1 transition-all duration-300', isCollapsed ? 'px-2' : 'px-3')}>
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <NavItem
              key={href}
              href={href}
              icon={icon}
              label={label}
              active={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>

      <div
        className={cn(
          'border-t border-sand transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
          isCollapsed ? 'mx-3 my-3' : 'mx-5 my-4'
        )}
      />

      {/* ── Library Section ───────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex-1 overflow-y-auto no-scrollbar space-y-4 transition-all duration-300',
          isCollapsed ? 'px-2' : 'px-3'
        )}
      >
        {isAuthenticated ? (
          <>
            <div>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
                  isCollapsed ? 'max-h-0 opacity-0 mb-0 -translate-x-2 pointer-events-none' : 'max-h-8 opacity-100 px-3 mb-2 translate-x-0'
                )}
              >
                <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Your library
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
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>

            <div>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
                  isCollapsed ? 'max-h-0 opacity-0 mb-0 -translate-x-2 pointer-events-none' : 'max-h-8 opacity-100 px-3 mb-2 translate-x-0'
                )}
              >
                <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Discover
                </span>
              </div>
              <div className="space-y-1">
                <NavItem
                  href="/playlists"
                  icon={ListMusic}
                  label="Discover playlists"
                  active={pathname.startsWith('/playlist')}
                  small
                  isCollapsed={isCollapsed}
                />
                <NavItem
                  href="/search"
                  icon={BarChart3}
                  label="Top 50 charts"
                  active={pathname === '/search'}
                  small
                  isCollapsed={isCollapsed}
                />
              </div>
            </div>
          </>
        ) : (
          isCollapsed ? (
            <Link
              href="/login"
              className="flex items-center justify-center w-11 h-11 mx-auto rounded-xl text-ink-muted hover:text-ink hover:bg-sand/50 transition-all duration-300"
              title="Log in to see your library"
            >
              <LogIn className="w-6 h-6 stroke-[2.1] text-saffron" />
            </Link>
          ) : (
            <div className="p-4 rounded-lg border border-sand bg-paper transition-all duration-300">
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
          )
        )}
      </div>

      {/* ── Draggable Edge Handle ─────────────────────────────────────────── */}
      <div
        ref={dragHandleRef}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        className={cn(
          'absolute top-0 right-0 bottom-0 w-2 cursor-col-resize z-40 group select-none transition-colors',
          isDragging ? 'bg-saffron/40' : 'hover:bg-saffron/30'
        )}
        title="Drag to resize (Double-click to toggle)"
      >
        <div
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-10 rounded-full transition-all duration-200',
            isDragging ? 'bg-saffron opacity-100' : 'bg-ink-muted/30 group-hover:bg-saffron group-hover:opacity-100 opacity-0'
          )}
        />
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  small = false,
  isCollapsed = false,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  small?: boolean;
  isCollapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={cn(
        'relative transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group font-medium flex items-center overflow-hidden',
        isCollapsed
          ? 'justify-center w-11 h-11 mx-auto rounded-xl px-0'
          : small
          ? 'w-full gap-3 px-3 py-2 text-xs rounded-md'
          : 'w-full gap-3 px-3 py-2.5 text-sm rounded-md',
        active
          ? 'text-ink bg-sand/70 shadow-xs'
          : 'text-ink-muted hover:text-ink hover:bg-sand/40'
      )}
    >
      {active && (
        <span
          className={cn(
            'absolute rounded-full bg-saffron transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
            isCollapsed
              ? 'left-0.5 top-1/2 -translate-y-1/2 w-1 h-5'
              : 'left-0 top-1/2 -translate-y-1/2 w-0.5 h-4'
          )}
        />
      )}
      <Icon
        className={cn(
          'transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 flex-shrink-0',
          isCollapsed
            ? 'w-6 h-6 stroke-[2.1]'
            : small
            ? 'w-4 h-4'
            : 'w-5 h-5',
          active ? 'text-saffron' : 'text-ink-muted group-hover:text-saffron'
        )}
      />
      <span
        className={cn(
          'truncate transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap',
          isCollapsed
            ? 'max-w-0 opacity-0 -translate-x-2 pointer-events-none'
            : 'max-w-[220px] opacity-100 translate-x-0'
        )}
      >
        {label}
      </span>
    </Link>
  );
}
