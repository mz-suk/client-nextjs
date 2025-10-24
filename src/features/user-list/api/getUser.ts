import type { User } from '@/entities/user';
import { fetchAPI } from '@/shared/api';
import { logger } from '@/shared/lib';

export async function getUser(id: number): Promise<User> {
  try {
    const user = await fetchAPI<User>(`/users/${id}`);
    return user;
  } catch (error) {
    logger.error('getUser 에러:', error);
    throw error;
  }
}
