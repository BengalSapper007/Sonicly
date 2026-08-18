import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: { default: 'Sonicly', template: '%s — Sonicly' },
  description: 'A music listening experience built for people who care about sound.',
  keywords: ['music', 'streaming', 'sonicly', 'listen', 'albums', 'playlists'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden bg-void text-ink">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
