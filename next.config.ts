import type { NextConfig } from 'next';
import { API_CONFIG, isAnalyze, isDebug, isDev, SERVER_CONFIG } from './src/shared/config/constants';

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
    removeConsole: !isDebug,
  },

  // 실험적 기능
  experimental: {
    optimizePackageImports: ['lucide-react'],
    reactCompiler: true,
  },

  async rewrites() {
    if (isDev && SERVER_CONFIG.API_TARGET_URL) {
      return [
        {
          source: '/api/proxy/:path*',
          destination: `${SERVER_CONFIG.API_TARGET_URL}/:path*`,
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
            value: (() => {
              const cspBase = [
                "default-src 'self'",
                "img-src 'self' data: https:",
                "font-src 'self' data:",
                `connect-src 'self' ${API_CONFIG.BASE_URL || 'https:'}`,
              ];
              const cspDev = [...cspBase, "script-src 'self' 'unsafe-eval' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'"];
              const cspProd = [...cspBase, "script-src 'self'", "style-src 'self' 'unsafe-inline'"];
              return (isDev ? cspDev : cspProd).join('; ');
            })(),
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
