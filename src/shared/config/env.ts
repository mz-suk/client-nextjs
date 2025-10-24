import { z } from 'zod';

// 환경변수 스키마 정의
const envSchema = z.object({
  // 필수 환경변수 (상대 경로 또는 절대 URL 허용)
  NEXT_PUBLIC_API_URL: z
    .string()
    .min(1, 'API_URL은 필수입니다')
    .refine(val => val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'), {
      message: '유효한 URL 또는 절대 경로 형식이 아닙니다',
    }),

  // 옵션 환경변수 (기본값 포함)
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().min(1000, '타임아웃은 최소 1000ms 이상이어야 합니다').default(30000),

  NEXT_PUBLIC_FEATURE_DEBUG: z
    .string()
    .optional()
    .default('false')
    .transform(val => val === 'true'),

  NEXT_PUBLIC_API_ACCEPT_LANGUAGE: z.string().optional(),

  // 서버 전용 (개발 환경)
  API_TARGET_URL: z.string().url().optional(),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ANALYZE: z
    .string()
    .optional()
    .default('false')
    .transform(val => val === 'true'),
});

// 환경변수 파싱 및 검증
function parseEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
      NEXT_PUBLIC_FEATURE_DEBUG: process.env.NEXT_PUBLIC_FEATURE_DEBUG,
      NEXT_PUBLIC_API_ACCEPT_LANGUAGE: process.env.NEXT_PUBLIC_API_ACCEPT_LANGUAGE,
      API_TARGET_URL: process.env.API_TARGET_URL,
      NODE_ENV: process.env.NODE_ENV,
      ANALYZE: process.env.ANALYZE,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
      throw new Error(`❌ 환경변수 검증 실패:\n${missingVars}`);
    }
    throw error;
  }
}

export const parsed = parseEnv();

export const env = {
  API_URL: parsed.NEXT_PUBLIC_API_URL,
  API_TIMEOUT: parsed.NEXT_PUBLIC_API_TIMEOUT,
  FEATURE_DEBUG: parsed.NEXT_PUBLIC_FEATURE_DEBUG,
  API_TARGET_URL: typeof window === 'undefined' ? parsed.API_TARGET_URL : undefined,
  API_ACCEPT_LANGUAGE: parsed.NEXT_PUBLIC_API_ACCEPT_LANGUAGE,
  ANALYZE: parsed.ANALYZE,
  NODE_ENV: parsed.NODE_ENV,
} as const;
