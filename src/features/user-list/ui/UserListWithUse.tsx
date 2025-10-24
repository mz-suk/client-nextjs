'use client';

import { use, useState } from 'react';
import { getUsers } from '../api';
import styles from './UserList.module.css';

export function UserListWithUse() {
  const [userPromise] = useState(() => getUsers());
  const users = use(userPromise);

  return (
    <div className={styles.container}>
      <h1>React 19 use() 훅 예제</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> JSONPlaceholder /users
        </p>
        <p>
          <strong>렌더링 방식:</strong> Client-Side with React 19 use() hook
        </p>
        <p className={styles.note}>React 19의 use() 훅을 사용하여 Promise를 직접 unwrap합니다.</p>
      </div>

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
        <h3>React 19 use() 훅 특징:</h3>
        <ul>
          <li>Promise Unwrapping: Promise를 직접 unwrap하여 데이터 가져오기</li>
          <li>Suspense 통합: 자동으로 Suspense와 연동</li>
          <li>간결한 코드: useEffect + useState 조합 불필요</li>
          <li>조건부 사용: 훅 규칙의 예외로 조건부 실행 가능</li>
        </ul>
      </div>
    </div>
  );
}
