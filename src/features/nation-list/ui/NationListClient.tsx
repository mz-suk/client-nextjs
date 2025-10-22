'use client';

import { useState } from 'react';
import type { Nation } from '@/entities/nation';
import { getNationsClient } from '../api';
import styles from './NationList.module.css';

export function NationListClient() {
  const [nations, setNations] = useState<Nation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNationsClient();
      setNations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>API 사용 예제</h1>

      <div className={styles.apiInfo}>
        <p>
          <strong>API 엔드포인트:</strong> /common/search/nations
        </p>
        <p>
          <strong>메서드:</strong> GET
        </p>
        <p>
          <strong>설명:</strong> 국가 목록 조회
        </p>
      </div>

      <div className={styles.actions}>
        <button onClick={fetchNations} disabled={loading} className={styles.button}>
          {loading ? '로딩 중...' : '국가 목록 가져오기'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>에러:</strong> {error}
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
        <h3>적용된 기술:</h3>
        <ul>
          <li>자동 재시도 로직 (최대 3회, 지수 백오프)</li>
          <li>타임아웃 설정 (30초)</li>
          <li>Accept-Language: ko 헤더 자동 적용</li>
          <li>타입 안전 API 호출</li>
          <li>에러 핸들링 및 디버그 로깅</li>
        </ul>
      </div>
    </div>
  );
}
