import { apiClient } from '@core/api';

import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/users');
  return data;
};

export const getUser = async (id: number): Promise<User> => {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
};
