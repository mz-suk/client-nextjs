import '@shared/assets/styles/index.scss';

import { API_CONFIG } from '@core/config';
import { AuthProvider, QueryProvider } from '@shared/providers';
import type { Metadata, Viewport } from 'next';

import { pretendard, suite } from '@/shared/assets/fonts';

export const metadata: Metadata = {
  title: 'Next.js 범용 템플릿',
  description: 'Next.js 16 + React 19 기반 범용 프로젝트 템플릿',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* API 호스트로 초기 연결 최적화 */}
        <link rel="preconnect" href={API_CONFIG.BASE_URL} />
        <link rel="dns-prefetch" href={API_CONFIG.BASE_URL} />
      </head>
      <body className={`${pretendard.variable} ${suite.variable}`}>
        <div id="root">
          <AuthProvider>
            <QueryProvider>{children}</QueryProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
