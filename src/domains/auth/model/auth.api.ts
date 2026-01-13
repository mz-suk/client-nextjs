import { apiClient, type AuthTokens } from '@core/api';

export const login = async (email: string, password: string): Promise<AuthTokens> => {
  return apiClient.post<AuthTokens>('/auth/login', { email, password }, { skipAuth: true });
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
  return apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }, { skipAuth: true });
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
