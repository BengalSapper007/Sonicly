'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Player } from '@/components/player/Player';
import { AudioEngine } from '@/components/player/AudioEngine';
import { useAuthStore } from '@/stores/auth.store';
import { Home, Search, Library } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const pathname = usePathname();

  useEffect(() => { fetchMe(); }, [fetchMe]);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#FAF6EF' }}>
      <AudioEngine />

      {/* Main layout */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ paddingBottom: 'var(--player-height)' }}
      >
        {/* Sidebar — desktop only */}
        <div
          className="hidden md:flex flex-shrink-0 h-full"
          style={{ width: 'var(--sidebar-width)' }}
        >
          <Sidebar />
        </div>

        {/* Main scrollable content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ background: '#FAF6EF' }}
        >
          {children}
        </main>
      </div>

      {/* Persistent player bar — fixed bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ height: 'var(--player-height)' }}
      >
        <Player />
      </div>

      {/* Mobile bottom nav — shows only on mobile, above player */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-prussian-blue border-t border-white/10 flex items-center justify-around"
        style={{ height: '56px', bottom: 'var(--player-height)' }}
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
                isActive ? 'text-vibrant-saffron' : 'text-on-primary-muted hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
