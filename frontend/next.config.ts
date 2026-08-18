import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Point Turbopack to the monorepo root so it can resolve packages
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.neon.tech' },
    ],
  },
};

export default nextConfig;
