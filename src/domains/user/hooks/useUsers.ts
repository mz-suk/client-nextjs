'use client';

import { useQuery } from '@tanstack/react-query';

import { getUsers } from '../services';
import type { User } from '../types';

export interface UseUsersOptions {
  initialData?: User[];
}

export function useUsers(options?: UseUsersOptions) {
  const { initialData } = options || {};

  const { data, error, isLoading, refetch } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData,
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch,
  };
}
