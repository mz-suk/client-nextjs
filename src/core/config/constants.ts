import { env } from './env';

export const API_CONFIG = {
  BASE_URL: env.API_URL,
  TIMEOUT: env.API_TIMEOUT,
  ACCEPT_LANGUAGE: env.API_ACCEPT_LANGUAGE || 'ko-KR',
} as const;

export const APP_METADATA = {
  NAME: 'Next.js Template',
  DESCRIPTION: '서버 없는 SSG+CSR 하이브리드 템플릿',
  VERSION: '0.1.0',
} as const;

export const isAnalyze = env.ANALYZE;
export const isDev = env.NODE_ENV === 'development';
export const isDebug = env.FEATURE_DEBUG;

export const SERVER_CONFIG = {
  API_TARGET_URL: env.API_TARGET_URL,
} as const;

export const CACHE_CONFIG = {
  REVALIDATE_TIME: 300,
  SWR_DEDUPE_INTERVAL: 2000,
} as const;
