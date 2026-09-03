import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Your Library',
    template: '%s | Sonicly',
  },
  description: 'Access your saved albums, favorite tracks, and followed artists on Sonicly.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
