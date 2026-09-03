import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Music, Artists & Albums',
  description: 'Search across tracks, artists, albums, and playlists on Sonicly.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
