import { apiClient, type AuthTokens } from '@core/api';

/**
 * 로그인
 */
export async function login(email: string, password: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/login', { email, password }, { skipAuth: true });
  return data;
}

/**
 * 토큰 갱신
 */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }, { skipAuth: true });
  return data;
}

/**
 * 로그아웃
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
