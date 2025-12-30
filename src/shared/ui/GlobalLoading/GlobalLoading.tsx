'use client';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useMemo } from 'react';

import styles from './GlobalLoading.module.scss';

/**
 * 전역 로딩 인디케이터
 *
 * React Query의 모든 Query와 Mutation을 자동 감지하여
 * 진행 중인 요청이 있을 때 전체 화면 로딩 표시
 *
 * @example
 * <QueryProvider>
 *   <GlobalLoading />
 *   <App />
 * </QueryProvider>
 */
export function GlobalLoading() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = useMemo(() => isFetching > 0 || isMutating > 0, [isFetching, isMutating]);

  if (!isLoading) return null;

  return (
    <div className={styles.overlay} role="progressbar" aria-busy="true" aria-label="Loading">
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle} />
      </div>
    </div>
  );
}
