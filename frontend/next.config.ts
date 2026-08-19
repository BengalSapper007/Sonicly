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
    return [
      {
        source: '/media/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}/media/:path*`,
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
