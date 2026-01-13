import { z } from 'zod';

/**
 * API 응답 헬퍼 함수들
 */

/**
 * Zod 스키마를 사용한 안전한 응답 파싱
 * @param schema Zod 스키마
 * @param data 검증할 데이터
 * @returns 타입이 보장된 데이터
 */
export const parseApiResponse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  return schema.parse(data);
};

/**
 * 배열 응답 안전하게 파싱
 */
export const parseArrayResponse = <T>(schema: z.ZodType<T>, data: unknown): T[] => {
  return z.array(schema).parse(data);
};

/**
 * 옵셔널 응답 파싱 (null/undefined 허용)
 */
export const parseOptionalResponse = <T>(schema: z.ZodType<T>, data: unknown): T | null => {
  return data === null || data === undefined ? null : schema.parse(data);
};
