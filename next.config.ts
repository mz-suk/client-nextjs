import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const isAnalyze = process.env.ANALYZE === 'true';

let nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: isDev,
  },

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // 프로덕션 빌드 최적화
  compiler: {
    removeConsole: !isDev,
  },

  // 실험적 기능
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react'],
    reactCompiler: true,
  },

  async rewrites() {
    if (isDev && process.env.API_TARGET_URL) {
      return [
        {
          source: '/api/proxy/:path*',
          destination: `${process.env.API_TARGET_URL}/:path*`,
        },
      ];
    }
    return [];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'https:'}`,
            ].join('; '),
          },
        ],
      },
      // 정적 자산 캐싱
      {
        source: '/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

// 번들 분석기 (ANALYZE=true pnpm build)
if (isAnalyze) {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
