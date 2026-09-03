import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { JsonLd } from '@/components/seo/JsonLd';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Sonicly', template: '%s | Sonicly' },
  description: 'A premium music listening experience built for people who care about sound.',
  keywords: ['music', 'streaming', 'sonicly', 'listen', 'albums', 'playlists', 'high fidelity'],
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Sonicly',
    title: 'Sonicly — High-Fidelity Music Streaming',
    description: 'A premium music listening experience built for sound enthusiasts. Stream albums, curated playlists, and discover artists.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sonicly — High-Fidelity Music Streaming',
    description: 'A premium music listening experience built for sound enthusiasts.',
  },
};

const rootStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Sonicly',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo-icon.png`,
      },
      description: 'High-fidelity music streaming platform built for sound enthusiasts.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Sonicly',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      name: 'Sonicly',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={rootStructuredData} />
      </head>
      <body className="h-full overflow-hidden bg-[#F6F1E4] text-[#211E1A]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
