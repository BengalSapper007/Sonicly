import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liked Songs',
  description: 'Listen to all your liked songs in one place on Sonicly.',
};

export default function LikedSongsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
