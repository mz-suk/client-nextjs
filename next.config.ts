import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/proxy/:path*',
          destination: `${process.env.API_TARGET_URL || 'http://localhost:3001/api'}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
