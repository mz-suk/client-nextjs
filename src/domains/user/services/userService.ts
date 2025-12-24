import { fetchAPI } from '@core/api';
import { logger } from '@shared/lib';

import type { User } from '../types';

export async function getUsers(): Promise<User[]> {
  try {
    const users = await fetchAPI<User[]>('/users');
    return users;
  } catch (error) {
    logger.error('getUsers 에러:', error);
    throw error;
  }
}

export async function getUser(id: number): Promise<User> {
  return fetchAPI<User>(`/users/${id}`);
}
