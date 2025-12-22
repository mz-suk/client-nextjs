'use client';

import { useUsersQuery } from '../hooks';
import styles from './UserList.module.css';

export function UserListWithQuery() {
  const { data: users, isLoading, error } = useUsersQuery();

  return (
    <div className={styles.container}>
      <h1>TanStack Query 예제 - 사용자 목록</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> JSONPlaceholder /users
        </p>
        <p>
          <strong>렌더링 방식:</strong> Client-Side with TanStack Query (React Query)
        </p>
        <p>
          <strong>현재 상태:</strong> {isLoading ? '🔄 로딩 중...' : error ? '❌ 에러' : '✅ 완료'}
        </p>
        <p className={styles.note}>TanStack Query를 사용하여 데이터를 페칭하고 캐싱합니다.</p>
      </div>

      {isLoading && <div className={styles.loading}>데이터를 불러오는 중...</div>}

      {error && <div className={styles.error}>에러: {(error as Error).message}</div>}

      {!isLoading && users && users.length > 0 ? (
        <div className={styles.posts}>
          <h2>사용자 목록 ({users.length})</h2>
          <div className={styles.grid}>
            {users.map(user => (
              <div key={user.id} className={styles.card}>
                <div className={styles.code}>{user.id}</div>
                <div className={styles.nameKo}>{user.name}</div>
                <div className={styles.nameEn}>@{user.username}</div>
                <div className={styles.email}>{user.email}</div>
                <div className={styles.company}>{user.company.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : !isLoading ? (
        <p className={styles.empty}>사용자 데이터를 불러올 수 없습니다.</p>
      ) : null}

      <div className={styles.features}>
        <h3>TanStack Query 특징:</h3>
        <ul>
          <li>강력한 캐싱: 자동 캐싱 및 무효화</li>
          <li>DevTools: 개발자 도구로 쿼리 상태 확인</li>
          <li>자동 재시도: 실패 시 자동 재시도</li>
          <li>Optimistic Updates: 낙관적 업데이트 지원</li>
          <li>Infinite Queries: 무한 스크롤 지원</li>
        </ul>
      </div>
    </div>
  );
}
