import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sonicly — High-Fidelity Music Streaming',
    short_name: 'Sonicly',
    description: 'A premium music listening experience built for sound enthusiasts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F1E4',
    theme_color: '#E8720C',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
