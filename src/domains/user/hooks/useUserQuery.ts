'use client';

import { useQuery } from '@tanstack/react-query';
import type { User } from '../types';
import { getUser } from '../services';

export function useUserQuery(id: number) {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}
