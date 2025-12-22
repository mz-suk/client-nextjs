import { API_CONFIG } from '@/core/config';
import '@/shared/styles/index.scss';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SWRConfig } from 'swr';

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
  keepPreviousData: true,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js 범용 템플릿',
  description: 'Next.js 15 + React 19 기반 범용 프로젝트 템플릿',
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SWRConfig value={swrConfig}>{children}</SWRConfig>
      </body>
    </html>
  );
}
