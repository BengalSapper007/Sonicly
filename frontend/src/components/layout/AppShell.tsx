'use client';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Player } from '@/components/player/Player';
import { AudioEngine } from '@/components/player/AudioEngine';
import { useAuthStore } from '@/stores/auth.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const pathname = usePathname();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background text-on-surface">
      {/* Hidden audio element managed by AudioEngine */}
      <AudioEngine />

      {/* Main layout: sidebar + scrollable content */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ paddingBottom: 'var(--player-height)' }}
      >
        {/* Sidebar — fixed 256px / w-64 */}
        <Sidebar />

        {/* Main scrollable content */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden md:ml-64 bg-background min-h-screen"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-between items-center px-margin-mobile bg-vibrant-saffron border-t-2 border-prussian-blue shadow-lg h-20">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition-transform hover:scale-105 ${
            pathname === '/' ? 'text-prussian-blue font-bold' : 'text-prussian-blue/80'
          }`}
        >
          <span className="material-symbols-outlined" style={pathname === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className="text-[11px] font-bold">Home</span>
        </Link>
        <Link
          href="/search"
          className={`flex flex-col items-center gap-1 transition-transform hover:scale-105 ${
            pathname.startsWith('/search') ? 'text-prussian-blue font-bold' : 'text-prussian-blue/80'
          }`}
        >
          <span className="material-symbols-outlined" style={pathname.startsWith('/search') ? { fontVariationSettings: "'FILL' 1" } : {}}>explore</span>
          <span className="text-[11px] font-bold">Explore</span>
        </Link>
        <Link
          href="/library"
          className={`flex flex-col items-center gap-1 transition-transform hover:scale-105 ${
            pathname.startsWith('/library') ? 'text-prussian-blue font-bold' : 'text-prussian-blue/80'
          }`}
        >
          <span className="material-symbols-outlined" style={pathname.startsWith('/library') ? { fontVariationSettings: "'FILL' 1" } : {}}>library_music</span>
          <span className="text-[11px] font-bold">Library</span>
        </Link>
        <Link
          href="/search"
          className="flex flex-col items-center gap-1 text-prussian-blue/80 transition-transform hover:scale-105"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-[11px] font-bold">Search</span>
        </Link>
      </nav>

      {/* Persistent player bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 hidden md:block"
        style={{ height: 'var(--player-height)' }}
      >
        <Player />
      </div>
    </div>
  );
}
