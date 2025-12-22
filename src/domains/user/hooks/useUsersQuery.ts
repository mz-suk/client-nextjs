'use client';

import { useQuery } from '@tanstack/react-query';
import type { User } from '../types';
import { getUsers } from '../services';

export function useUsersQuery() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
