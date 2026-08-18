'use client';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Player } from '@/components/player/Player';
import { AudioEngine } from '@/components/player/AudioEngine';
import { useAuthStore } from '@/stores/auth.store';

export function AppShell({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="h-full flex flex-col bg-void overflow-hidden">
      {/* Hidden audio element managed by AudioEngine */}
      <AudioEngine />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 overflow-hidden" style={{ paddingBottom: 'var(--player-height)' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-void">
          {children}
        </main>
      </div>

      {/* Fixed player bar at bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ height: 'var(--player-height)' }}
      >
        <Player />
      </div>
    </div>
  );
}
