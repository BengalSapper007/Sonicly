import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Point Turbopack to the monorepo root so it can resolve packages
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },

  // Proxy /media/* to NestJS backend for audio streaming & images
  // This keeps the frontend consuming consistent /media/... paths
  // regardless of where the media server lives.
  async rewrites() {
    const backendBase =
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', '').replace(/\/+$/, '') ||
      'http://localhost:3001';

    return [
      /**
       * Proxy all /api/* calls through the Next.js dev server.
       * This makes auth cookies same-origin (set and sent from localhost:3000)
       * so the browser never sees them as cross-site — fixing the refresh-logout bug.
       */
      {
        source: '/api/:path*',
        destination: `${backendBase}/api/:path*`,
      },
      /**
       * Proxy /media/* for audio streaming & artwork (existing rule).
       */
      {
        source: '/media/:path*',
        destination: `${backendBase}/media/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.neon.tech' },
    ],
  },
};

export default nextConfig;
