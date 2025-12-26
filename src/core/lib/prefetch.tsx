import { dehydrate, type FetchQueryOptions, HydrationBoundary, type QueryKey } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { getQueryClient } from './query-client';

export const Prefetch = async ({ queries, children }: { queries: FetchQueryOptions<unknown, Error, unknown, QueryKey>[]; children: ReactNode }) => {
  const queryClient = getQueryClient();
  await Promise.all(queries.map(query => queryClient.ensureQueryData(query)));
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};
