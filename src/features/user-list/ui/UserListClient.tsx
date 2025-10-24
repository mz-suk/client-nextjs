'use client';

import { useUsers } from '../hooks';
import styles from './UserList.module.css';

export function UserListClient() {
  const { users, isLoading, error } = useUsers();

  return (
    <div className={styles.container}>
      <h1>CSR 예제 - 사용자 목록</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> JSONPlaceholder /users
        </p>
        <p>
          <strong>렌더링 방식:</strong> Client-Side Rendering with SWR
        </p>
        <p>
          <strong>현재 상태:</strong> {isLoading ? '🔄 로딩 중...' : error ? '❌ 에러' : '✅ 완료'}
        </p>
        <p className={styles.note}>클라이언트에서만 데이터를 페칭합니다.</p>
      </div>

      {isLoading && <div className={styles.loading}>데이터를 불러오는 중...</div>}

      {error && <div className={styles.error}>에러: {error.message}</div>}

      {!isLoading && users.length > 0 ? (
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
        <h3>CSR 특징:</h3>
        <ul>
          <li>클라이언트 전용: 브라우저에서만 데이터 페칭</li>
          <li>초기 로딩: 로딩 상태 표시 필요</li>
          <li>실시간 데이터: 항상 최신 데이터 가져옴</li>
          <li>용도: 인증 필요하거나 실시간 데이터가 중요한 경우</li>
        </ul>
      </div>
    </div>
  );
}
