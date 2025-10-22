export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  FEATURE_DEBUG: process.env.NEXT_PUBLIC_FEATURE_DEBUG === 'true',
  API_TARGET_URL: typeof window === 'undefined' ? process.env.API_TARGET_URL : undefined,
} as const;

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// 서버 사이드에서만 필수 환경변수 검증
if (typeof window === 'undefined') {
  if (!env.API_URL) {
    throw new Error('필수 환경변수 NEXT_PUBLIC_API_URL이 설정되지 않았습니다');
  }
}
