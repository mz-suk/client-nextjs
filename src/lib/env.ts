const envSchema = {
  NEXT_PUBLIC_API_URL: { required: true, isPublic: true },
  NEXT_PUBLIC_API_AUTH_URL: { required: true, isPublic: true },
  NEXT_PUBLIC_API_TIMEOUT: { required: false, isPublic: true },
  NEXT_PUBLIC_FEATURE_ANALYTICS: { required: false, isPublic: true },
  NEXT_PUBLIC_FEATURE_DEBUG: { required: false, isPublic: true },
  // API_TARGET_URL: { required: false, isPublic: false },
} as const;

type EnvKey = keyof typeof envSchema;

function getEnv<T extends EnvKey>(key: T): string | undefined {
  const config = envSchema[key];

  if (config.isPublic) {
    return process.env[key];
  }

  if (typeof window !== 'undefined') {
    throw new Error(`서버 전용 환경변수 ${key}를 클라이언트에서 접근할 수 없습니다`);
  }

  return process.env[key];
}

function validateEnv(): void {
  const errors: string[] = [];

  (Object.keys(envSchema) as EnvKey[]).forEach(key => {
    const config = envSchema[key];
    const value = process.env[key];

    if (config.required && !value) {
      errors.push(`필수 환경변수 ${key}가 설정되지 않았습니다`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`환경변수 검증 실패:\n${errors.join('\n')}`);
  }
}

export const env = {
  API_URL: getEnv('NEXT_PUBLIC_API_URL') ?? '',
  API_AUTH_URL: getEnv('NEXT_PUBLIC_API_AUTH_URL') ?? '',
  API_TIMEOUT: Number(getEnv('NEXT_PUBLIC_API_TIMEOUT')) || 10000,
  FEATURE_ANALYTICS: getEnv('NEXT_PUBLIC_FEATURE_ANALYTICS') === 'true',
  FEATURE_DEBUG: getEnv('NEXT_PUBLIC_FEATURE_DEBUG') === 'true',
  // API_TARGET_URL: getEnv('API_TARGET_URL'),
} as const;

export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

if (typeof window === 'undefined') {
  validateEnv();
}
