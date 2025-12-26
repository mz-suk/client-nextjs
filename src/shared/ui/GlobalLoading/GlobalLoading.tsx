'use client';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

import styles from './GlobalLoading.module.scss';

export function GlobalLoading() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle} />
      </div>
    </div>
  );
}
