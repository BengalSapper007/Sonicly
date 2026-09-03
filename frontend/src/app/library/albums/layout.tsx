import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Albums',
  description: 'Your personal collection of saved albums on Sonicly.',
};

export default function SavedAlbumsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
