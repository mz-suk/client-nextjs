import { API_CONFIG } from '@/shared/config';
import { QueryProvider } from '@/shared/providers';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
