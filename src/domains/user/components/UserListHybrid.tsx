'use client';

import { useUsers } from '../hooks';
import type { User } from '../types';
import styles from './UserList.module.css';

interface UserListHybridProps {
  initialUsers: User[];
}

export function UserListHybrid({ initialUsers }: UserListHybridProps) {
  const { users, isLoading, error } = useUsers({ initialData: initialUsers });

  return (
    <div className={styles.container}>
      <h1>Hybrid 예제 - 사용자 목록</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> JSONPlaceholder /users
        </p>
        <p>
          <strong>렌더링 방식:</strong> SSG + React Query (Hybrid)
        </p>
        <p>
          <strong>현재 상태:</strong> {isLoading ? '🔄 데이터 갱신 중...' : '✅ 최신 데이터'}
        </p>
        <p className={styles.note}>초기는 SSG로 빠르게 로딩, 이후 React Query가 최신 데이터로 자동 업데이트합니다.</p>
      </div>

      {error && <div className={styles.error}>에러: {error.message}</div>}

      {users.length > 0 ? (
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
      ) : (
        <p className={styles.empty}>사용자 데이터를 불러올 수 없습니다.</p>
      )}

      <div className={styles.features}>
        <h3>Hybrid (SSG + React Query) 특징:</h3>
        <ul>
          <li>빠른 초기 렌더링: SSG로 즉시 콘텐츠 표시</li>
          <li>실시간 업데이트: React Query가 백그라운드에서 최신 데이터 가져옴</li>
          <li>강력한 캐싱: 스마트한 캐시 관리 및 자동 재검증</li>
          <li>용도: 대부분의 경우에 추천 ⭐</li>
        </ul>
      </div>
    </div>
  );
}
