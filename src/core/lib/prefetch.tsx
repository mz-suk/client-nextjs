import { dehydrate, type FetchQueryOptions, HydrationBoundary, type QueryKey } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { getQueryClient } from './query-client';

/**
 * 서버 컴포넌트용 Prefetch 헬퍼
 *
 * @example
 * ```tsx
 * export default async function Page() {
 *   return (
 *     <Prefetch queries={[postQueries.list(), userQueries.me()]}>
 *       <PageContent />
 *     </Prefetch>
 *   );
 * }
 * ```
 */
export async function Prefetch({ queries, children }: { queries: FetchQueryOptions<unknown, Error, unknown, QueryKey>[]; children: ReactNode }) {
  const queryClient = getQueryClient();
  await Promise.all(queries.map(query => queryClient.ensureQueryData(query)));

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
