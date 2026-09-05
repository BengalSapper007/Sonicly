'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Player } from '@/components/player/Player';
import { QueuePanel } from '@/components/player/QueuePanel';
import { DedicatedPlayerScreen } from '@/components/player/DedicatedPlayerScreen';
import { AudioEngine } from '@/components/player/AudioEngine';
import { ToastContainer } from '@/components/ui/Toast';
import { useAuthStore } from '@/stores/auth.store';
import { useLibraryStore } from '@/stores/library.store';
import { useSidebarStore } from '@/stores/sidebar.store';
import { Home, Search, Library } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const initLibrary = useLibraryStore((s) => s.initLibrary);
  const sidebarWidth = useSidebarStore((s) => s.width);
  const isDragging = useSidebarStore((s) => s.isDragging);
  const pathname = usePathname();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (isAuthenticated) {
      initLibrary();
    }
  }, [isAuthenticated, initLibrary]);

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (isAuthRoute) {
    return (
      <div className="h-full overflow-y-auto" style={{ background: '#F6F1E4' }}>
        <ToastContainer />
        {children}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F6F1E4' }}>
      <ToastContainer />
      <AudioEngine />

      {/* Main layout (Sidebar + Content column) */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar — desktop only */}
        <div
          className={`hidden md:flex flex-shrink-0 h-full ${!isDragging ? 'transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
          style={{ width: `${sidebarWidth}px` }}
        >
          <Sidebar />
        </div>

        {/* Content column */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ background: '#F6F1E4' }}>
            {children}
          </main>
        </div>

        {/* Queue side panel */}
        <QueuePanel />

        {/* Dedicated music player screen overlay */}
        <DedicatedPlayerScreen />
      </div>

      {/* ── Player bar: docked above mobile nav on mobile, at bottom on desktop ── */}
      <div
        className="flex-shrink-0 z-50"
        style={{ height: 'var(--player-height)' }}
      >
        <Player />
      </div>

      {/* ── Mobile bottom nav — anchored to bottom on mobile, hidden on desktop ── */}
      <nav
        className="md:hidden flex-shrink-0 z-40 bg-indigo border-t border-white/10 flex items-center justify-around"
        style={{ height: '56px' }}
      >
        {[
          { href: '/',        icon: Home,    label: 'Home'    },
          { href: '/search',  icon: Search,  label: 'Search'  },
          { href: '/library', icon: Library, label: 'Library' },
        ].map(({ href, icon: Icon, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded transition-colors ${
                isActive ? 'text-saffron' : 'text-on-indigo-muted hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
