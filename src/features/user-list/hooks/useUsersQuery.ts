'use client';

import type { User } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api';

export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
