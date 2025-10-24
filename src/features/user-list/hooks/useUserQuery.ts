'use client';

import type { User } from '@/entities/user';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api';

export function useUserQuery(id: number, enabled = true) {
  return useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: enabled && id > 0,
  });
}
