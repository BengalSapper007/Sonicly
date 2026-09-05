import type { Metadata } from 'next';
import { DedicatedPlayerScreen } from '@/components/player/DedicatedPlayerScreen';

export const metadata: Metadata = {
  title: 'Now Playing',
  description: 'Dedicated music player view on Sonicly with high-fidelity playback, lyrics, and artist insights.',
};

export default function NowPlayingPage() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-var(--player-height)-var(--header-height))]">
      <DedicatedPlayerScreen mode="page" />
    </div>
  );
}
