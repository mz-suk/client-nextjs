import { apiClient, type AuthTokens } from '@core/api';

export const login = async (email: string, password: string): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>('/auth/login', { email, password }, { skipAuth: true });
  return data;
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }, { skipAuth: true });
  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
