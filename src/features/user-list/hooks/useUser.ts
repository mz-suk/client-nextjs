'use client';

import type { User } from '@/entities/user';
import useSWR from 'swr';
import { getUser } from '../api';

export interface UseUserOptions {
  initialData?: User;
}

export function useUser(id: number, options?: UseUserOptions) {
  const { initialData } = options || {};

  const { data, error, isLoading, mutate } = useSWR<User>(id ? `/users/${id}` : null, () => getUser(id), {
    fallbackData: initialData,
  });

  return {
    user: data,
    isLoading,
    error,
    refetch: mutate,
  };
}
