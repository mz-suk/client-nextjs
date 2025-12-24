# Core 아키텍처 가이드

## 개요

`core` 폴더는 프로젝트 전반에서 사용되는 공통 환경 설정과 유틸리티를 관리합니다.

## 구조

```
core/
├── api/              # API 클라이언트 및 인증 관리
├── config/           # 환경 설정 및 상수
├── lib/              # 공통 라이브러리 (logger 등)
└── types/            # 공통 타입 정의
```

## API 클라이언트

### 기본 사용법

```typescript
import { apiClient } from '@core/api';

// GET 요청
const { data } = await apiClient.get<User>('/users/me');

// POST 요청
const { data } = await apiClient.post<User>('/users', { name: 'John' });
```

### 인터셉터

```typescript
import { apiClient } from '@core/api';

// 요청 인터셉터
apiClient.addRequestInterceptor(async config => {
  config.headers = { ...config.headers, 'X-Custom': 'value' };
  return config;
});

// 응답 인터셉터
apiClient.addResponseInterceptor(async response => {
  // 응답 처리
  return response;
});
```

### 인증 설정

`AuthProvider`에서 자동으로 설정되지만, 필요시 수동 설정 가능:

```typescript
import { configureAuth } from '@core/api';
import { useAuthStore, refreshTokens } from '@domains/auth';

configureAuth({
  store: useAuthStore,
  refreshTokens,
  onAuthFailure: () => {
    // 인증 실패 처리
  },
  onError: error => {
    // 에러 처리
  },
});
```

## Logger

### 기본 사용법

```typescript
import { logger } from '@core/lib';

logger.debug('디버그 메시지', { userId: 123 });
logger.info('정보 메시지');
logger.warn('경고 메시지');
logger.error('에러 메시지', { error: error.message });
logger.api('GET', '/api/users');
```

### 설정

```typescript
import { Logger } from '@core/lib';

// 항상 활성화된 logger
const customLogger = new Logger(true);
```

## 환경 변수

### 정의

`.env.local` 파일에 환경 변수 정의:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_FEATURE_DEBUG=true
NEXT_PUBLIC_API_ACCEPT_LANGUAGE=ko-KR
API_TARGET_URL=http://backend:8080 # SSR 전용
```

### 사용

```typescript
import { env } from '@core/config';

console.log(env.API_URL);
console.log(env.API_TIMEOUT);
```

## 상수

### HTTP 상태 코드

```typescript
import { HTTP_STATUS } from '@core/api';

if (response.status === HTTP_STATUS.UNAUTHORIZED) {
  // 인증 필요
}
```

### API 상수

```typescript
import { API_CONSTANTS } from '@core/api';

console.log(API_CONSTANTS.MAX_RETRIES); // 3
console.log(API_CONSTANTS.RETRY_DELAY); // 1000
```

## 공통 타입

```typescript
import type { Nullable, Optional, DeepPartial } from '@core/types';

type User = {
  id: string;
  name: string;
  email: Nullable<string>; // string | null
  phone: Optional<string>; // string | undefined
};

type PartialUser = DeepPartial<User>;
```

## 에러 처리

### API 에러

```typescript
import { ApiError } from '@core/api';

try {
  await apiClient.get('/users');
} catch (error) {
  if (ApiError.isApiError(error)) {
    console.log(error.status); // HTTP 상태 코드
    console.log(error.message); // 에러 메시지
    console.log(error.code); // 에러 코드
    console.log(error.type); // 에러 타입

    if (error.isNetworkError()) {
      // 네트워크 에러
    }

    if (error.isServerError()) {
      // 서버 에러 (5xx)
    }
  }
}
```

### 인증 에러

```typescript
import { AuthError, AUTH_ERROR_CODES } from '@core/api';

try {
  await apiClient.get('/protected');
} catch (error) {
  if (AuthError.isAuthError(error)) {
    if (error.code === AUTH_ERROR_CODES.UNAUTHORIZED) {
      // 인증 필요
    }
  }
}
```

## 모범 사례

### 1. API 호출 시 타입 지정

```typescript
// ❌ 나쁜 예
const data = await apiClient.get('/users');

// ✅ 좋은 예
const { data } = await apiClient.get<User[]>('/users');
```

### 2. 에러 처리

```typescript
// ❌ 나쁜 예
try {
  await apiClient.post('/users', userData);
} catch (error) {
  console.error(error);
}

// ✅ 좋은 예
try {
  await apiClient.post('/users', userData);
} catch (error) {
  if (ApiError.isApiError(error)) {
    if (error.isNetworkError()) {
      // 네트워크 에러 처리
    } else if (error.isServerError()) {
      // 서버 에러 처리
    }
  }
  throw error;
}
```

### 3. Logger 사용

```typescript
// ❌ 나쁜 예
console.log('User data:', userData);

// ✅ 좋은 예
logger.debug('User data:', userData);
logger.info('User loaded:', userData.id, userData.name);
```

## 확장

### 커스텀 API 클라이언트

```typescript
import { ApiClient } from '@core/api';

class CustomApiClient extends ApiClient {
  constructor() {
    super();
    // 커스텀 설정
  }
}

export const customApiClient = new CustomApiClient();
```

### 커스텀 Logger

```typescript
import { Logger } from '@core/lib';

export const analyticsLogger = new Logger({
  enabled: true,
  minLevel: 'info',
});
```
