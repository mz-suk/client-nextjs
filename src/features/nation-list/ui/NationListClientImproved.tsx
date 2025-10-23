'use client';

import { useNations } from '../hooks';
import styles from './NationList.module.css';

export function NationListClientImproved() {
  const { nations, isLoading, error, refetch } = useNations();

  return (
    <div className={styles.container}>
      <h1>CSR with SWR 예제 (개선)</h1>

      <div className={styles.apiInfo}>
        <p>
          <strong>API 엔드포인트:</strong> /common/search/nations
        </p>
        <p>
          <strong>메서드:</strong> GET
        </p>
        <p>
          <strong>설명:</strong> useNations 커스텀 훅 사용
        </p>
      </div>

      <div className={styles.actions}>
        <button onClick={() => refetch()} disabled={isLoading} className={styles.button}>
          {isLoading ? '로딩 중...' : '국가 목록 가져오기'}
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
        <h3>커스텀 훅의 장점:</h3>
        <ul>
          <li>1줄로 데이터 페칭: useNations() 호출만으로 완성</li>
          <li>로직 재사용: 여러 컴포넌트에서 동일한 로직 공유</li>
          <li>타입 안전: TypeScript 완벽 지원</li>
          <li>테스트 용이: 훅을 독립적으로 테스트 가능</li>
        </ul>
      </div>
    </div>
  );
}
