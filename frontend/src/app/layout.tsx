import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: { default: 'Sonicly', template: '%s — Sonicly' },
  description: 'A premium music listening experience built for people who care about sound.',
  keywords: ['music', 'streaming', 'sonicly', 'listen', 'albums', 'playlists'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Montserrat font family + Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden antialiased bg-[#f9f9f9] text-[#1a1c1c] font-sans selection:bg-[#ff8800]/25 selection:text-[#003153]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
