'use client';

import useSWR from 'swr';
import type { User } from '../types';
import { getUser } from '../services';

export function useUser(id: number) {
  const { data, error, isLoading } = useSWR<User>(id ? `/users/${id}` : null, () => getUser(id));

  return {
    user: data,
    isLoading,
    error,
  };
}
