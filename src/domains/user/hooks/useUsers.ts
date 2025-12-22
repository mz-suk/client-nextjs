'use client';

import useSWR from 'swr';
import type { User } from '../types';
import { getUsers } from '../services';

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
