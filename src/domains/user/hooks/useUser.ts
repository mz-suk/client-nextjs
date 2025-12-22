'use client';

import { useQuery } from '@tanstack/react-query';
import type { User } from '../types';
import { getUser } from '../services';

export function useUser(id: number) {
  const { data, error, isLoading } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  return {
    user: data,
    isLoading,
    error,
  };
}
