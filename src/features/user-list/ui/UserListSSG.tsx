import type { User } from '@/entities/user';
import Link from 'next/link';
import styles from './UserList.module.css';

interface UserListSSGProps {
  users: User[];
  timestamp?: string;
}

export function UserListSSG({ users, timestamp }: UserListSSGProps) {
  return (
    <div className={styles.container}>
      <h1>SSG 예제 - 사용자 목록</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> JSONPlaceholder /users
        </p>
        <p>
          <strong>렌더링 방식:</strong> Static Site Generation
        </p>
        {timestamp && (
          <p>
            <strong>페이지 생성 시간:</strong> {timestamp}
          </p>
        )}
        <p className={styles.note}>빌드 시 한 번만 생성되며 모든 사용자에게 동일한 정적 콘텐츠를 제공합니다.</p>
      </div>

      {users.length > 0 ? (
        <div className={styles.posts}>
          <h2>사용자 목록 ({users.length})</h2>
          <div className={styles.grid}>
            {users.map(user => (
              <Link key={user.id} href={`/example-ssg/${user.id}`} className={styles.card}>
                <div className={styles.code}>{user.id}</div>
                <div className={styles.nameKo}>{user.name}</div>
                <div className={styles.nameEn}>@{user.username}</div>
                <div className={styles.email}>{user.email}</div>
                <div className={styles.company}>{user.company.name}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.empty}>사용자 데이터를 불러올 수 없습니다.</p>
      )}

      <div className={styles.features}>
        <h3>SSG 특징:</h3>
        <ul>
          <li>빌드 시 데이터 고정: 빌드 시점의 데이터로 페이지 생성</li>
          <li>최고 성능: CDN 캐싱으로 초고속 로딩</li>
          <li>안정성: 외부 API 장애와 무관하게 동작</li>
          <li>용도: 자주 변경되지 않는 콘텐츠에 적합</li>
        </ul>
      </div>
    </div>
  );
}
