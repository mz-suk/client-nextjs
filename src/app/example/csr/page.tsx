'use client';

import { useUsers } from '@domains/user/hooks';
import { useEffect, useState } from 'react';

import styles from './page.module.css';

/**
 * CSR + TanStack Query 예제
 * - 완전히 클라이언트에서 데이터 페칭
 * - TanStack Query의 모든 기능 활용
 * - 로딩, 에러 상태 자동 관리
 */
export default function CSRPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { users, isLoading, error, refetch } = useUsers({
    enabled: mounted,
  });

  if (!mounted || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>사용자 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>에러 발생</h2>
          <p>{error instanceof Error ? error.message : '알 수 없는 에러'}</p>
          <button onClick={() => refetch()} className={styles.button}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>CSR + TanStack Query 예제</h1>
        <p className={styles.description}>클라이언트에서 데이터를 페칭하고 TanStack Query로 관리</p>
      </header>

      <div className={styles.actions}>
        <button onClick={() => refetch()} disabled={isLoading} className={styles.button}>
          새로고침
        </button>
      </div>

      <div className={styles.grid}>
        {users.map(user => (
          <article key={user.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>{user.name}</h2>
              <span className={styles.badge}>ID: {user.id}</span>
            </div>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Username:</span>
                <span>@{user.username}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span>{user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phone:</span>
                <span>{user.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Company:</span>
                <span>{user.company.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Website:</span>
                <span>{user.website}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>총 사용자</span>
            <span className={styles.statValue}>{users.length}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
