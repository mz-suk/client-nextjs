'use client';

import { useQuery } from '@tanstack/react-query';

import { getUsers } from '../services';
import type { User } from '../types';

export interface UseUsersOptions {
  initialData?: User[];
  enabled?: boolean;
}

export function useUsers(options?: UseUsersOptions) {
  const { initialData, enabled = true } = options || {};

  const { data, error, isLoading, refetch } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData,
    enabled,
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch,
  };
}
