'use client';

import type { User } from '@/entities/user';
import useSWR from 'swr';
import { getUsers } from '../api';

export interface UseUsersOptions {
  initialData?: User[];
}

export function useUsers(options?: UseUsersOptions) {
  const { initialData } = options || {};

  const { data, error, isLoading, mutate } = useSWR<User[]>('/users', getUsers, {
    fallbackData: initialData,
  });

  return {
    users: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
}
