import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Following Artists',
  description: 'Artists you follow on Sonicly.',
};

export default function FollowingArtistsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
