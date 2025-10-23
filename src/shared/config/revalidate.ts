// 정적 FE 사이트 + REST API 구조
// SWR을 통한 클라이언트 캐싱 사용 (swrConfig 참고)

export const cacheConfig = {
  clientCacheTTL: 60 * 1000,
} as const;
