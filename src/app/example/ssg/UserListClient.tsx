'use client';

import { getUsers } from '@domains/user/services';
import type { User } from '@domains/user/types';
import { useQuery } from '@tanstack/react-query';

import styles from './page.module.css';

interface UserListClientProps {
  initialUsers: User[];
}

export function UserListClient({ initialUsers }: UserListClientProps) {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData: initialUsers,
    staleTime: 5 * 60 * 1000, // 5분
  });

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>에러 발생: {error instanceof Error ? error.message : '알 수 없는 에러'}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>SSG + TanStack Query 예제</h1>
        <p className={styles.description}>빌드 타임에 데이터를 가져오고 클라이언트에서 TanStack Query로 관리</p>
      </header>

      <div className={styles.actions}>
        <button onClick={() => refetch()} disabled={isLoading} className={styles.button}>
          {isLoading ? '로딩 중...' : '새로고침'}
        </button>
      </div>

      <div className={styles.grid}>
        {users?.map(user => (
          <article key={user.id} className={styles.card}>
            <h2>{user.name}</h2>
            <div className={styles.info}>
              <p>@{user.username}</p>
              <p>{user.email}</p>
              <p>{user.company.name}</p>
            </div>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>총 {users?.length || 0}명의 사용자</p>
      </footer>
    </div>
  );
}
