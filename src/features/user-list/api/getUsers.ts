import type { User } from '@/entities/user';
import { fetchAPI } from '@/shared/api';
import { logger } from '@/shared/lib';

export async function getUsers(): Promise<User[]> {
  try {
    const users = await fetchAPI<User[]>('/users');
    return users;
  } catch (error) {
    logger.error('getUsers 에러:', error);
    throw error;
  }
}
