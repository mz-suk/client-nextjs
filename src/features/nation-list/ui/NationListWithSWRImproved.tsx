'use client';

import type { Nation } from '@/entities/nation';
import { useNations } from '../hooks';
import styles from './NationList.module.css';

interface NationListWithSWRImprovedProps {
  initialNations: Nation[];
  timestamp: string;
  buildTime: number;
}

export function NationListWithSWRImproved({ initialNations, timestamp, buildTime }: NationListWithSWRImprovedProps) {
  const { nations, isLoading, error, refetch } = useNations({
    initialData: initialNations,
  });

  const isClientFetched = nations.length > 0 && nations !== initialNations;

  return (
    <div className={styles.container}>
      <h1>하이브리드 (SSG + SWR) 예제</h1>

      <div className={styles.apiInfo}>
        <p>
          <strong>API:</strong> /common/search/nations
        </p>
        <p>
          <strong>렌더링 방식:</strong> {isClientFetched ? 'Client-Side with SWR' : 'Static (SSG)'}
        </p>
        <p>
          <strong>초기 생성 시간 (빌드):</strong> {timestamp}
        </p>
        <p>
          <strong>빌드 타임스탬프:</strong> {buildTime}
        </p>
        <p>
          <strong>데이터 상태:</strong> {isLoading ? '로딩 중...' : error ? '에러 발생' : '로드 완료'}
        </p>
      </div>

      <div className={styles.actions}>
        <button onClick={() => refetch()} disabled={isLoading} className={styles.button}>
          {isLoading ? '새로고침 중...' : 'SWR로 최신 데이터 가져오기'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>에러:</strong> {error instanceof Error ? error.message : '알 수 없는 오류'}
        </div>
      )}

      {nations.length > 0 && (
        <div className={styles.userList}>
          <h2>국가 목록 ({nations.length})</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>코드</th>
                  <th>국가명</th>
                  <th>국제전화번호</th>
                </tr>
              </thead>
              <tbody>
                {nations.slice(0, 20).map(nation => (
                  <tr key={nation.alp3NatnCode}>
                    <td>{nation.alp2NatnCode}</td>
                    <td>{nation.natnNm}</td>
                    <td>{nation.natnIntcNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {nations.length > 20 && <p className={styles.moreInfo}>총 {nations.length}개 국가 중 20개만 표시</p>}
        </div>
      )}

      <div className={styles.info}>
        <h3>개선된 SWR 통합:</h3>
        <ul>
          <li>useNations 커스텀 훅: 재사용 가능한 로직 캡슐화</li>
          <li>중앙화된 설정: swrConfig로 일관된 동작</li>
          <li>타입 안전: 제네릭 기반 타입 추론</li>
          <li>간결한 코드: 3줄로 데이터 페칭 완료</li>
        </ul>

        <h3>사용 예시:</h3>
        <pre>
          {`const { nations, isLoading, refetch } = useNations({
  initialData: ssgData,
});`}
        </pre>
      </div>
    </div>
  );
}
