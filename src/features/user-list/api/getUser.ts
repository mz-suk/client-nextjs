import { fetchAPI } from '@/shared/api';
import type { User } from '@/entities/user/model/types';

export async function getUser(id: number): Promise<User> {
  return fetchAPI<User>(`/users/${id}`);
}
