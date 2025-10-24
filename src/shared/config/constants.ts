/**
 * 애플리케이션 상수
 *
 * 환경변수는 빌드 시에만 읽히므로 상수로 변환하여 사용
 * 런타임에는 변경 불가능 (정적 배포 특성)
 */

import { env, parsed } from './env';

/**
 * API 관련 상수
 */
export const API_CONFIG = {
  BASE_URL: env.API_URL,
  TIMEOUT: env.API_TIMEOUT,
  ACCEPT_LANGUAGE: env.API_ACCEPT_LANGUAGE || 'ko-KR',
} as const;

/**
 * 애플리케이션 메타데이터
 */
export const APP_METADATA = {
  NAME: 'Next.js Template',
  DESCRIPTION: '서버 없는 SSG+CSR 하이브리드 템플릿',
  VERSION: '0.1.0',
} as const;

/**
 * 빌드 플래그
 */
export const isAnalyze = parsed.ANALYZE;
export const isDev = parsed.NODE_ENV === 'development';
export const isDebug = env.FEATURE_DEBUG;

/**
 * 서버 전용 설정
 */
export const SERVER_CONFIG = {
  API_TARGET_URL: env.API_TARGET_URL,
} as const;

/**
 * 캐시 설정
 */
export const CACHE_CONFIG = {
  REVALIDATE_TIME: 300, // 5분 (SSG 재검증)
  SWR_DEDUPE_INTERVAL: 2000, // 2초 (SWR 중복 제거)
} as const;
