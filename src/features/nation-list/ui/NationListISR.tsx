import type { Nation } from '@/entities/nation';
import { revalidateConfig } from '@/shared/config';
import styles from './NationListISR.module.css';

interface NationListISRProps {
  nations: Nation[];
  timestamp: string;
  buildTime: number;
}

export function NationListISR({ nations, timestamp, buildTime }: NationListISRProps) {
  return (
    <div className={styles.container}>
      <h1>ISR 예제 페이지</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> /common/search/nations
        </p>
        <p>
          <strong>재검증 주기:</strong> {revalidateConfig.dynamic}초
        </p>
        <p>
          <strong>페이지 생성 시간:</strong> {timestamp}
        </p>
        <p>
          <strong>빌드 타임스탬프:</strong> {buildTime}
        </p>
        <p className={styles.note}>이 페이지는 {revalidateConfig.dynamic}초마다 백그라운드에서 재생성됩니다.</p>
      </div>

      {nations.length > 0 ? (
        <div className={styles.posts}>
          <h2>국가 목록 ({nations.length})</h2>
          <div className={styles.grid}>
            {nations.slice(0, 12).map(nation => (
              <div key={nation.alp3NatnCode} className={styles.card}>
                <div className={styles.code}>{nation.alp2NatnCode}</div>
                <div className={styles.nameKo}>{nation.natnNm}</div>
                <div className={styles.nameEn}>{nation.natnIntcNo}</div>
              </div>
            ))}
          </div>
          {nations.length > 12 && <p className={styles.moreInfo}>총 {nations.length}개 국가 중 12개만 표시</p>}
        </div>
      ) : (
        <p className={styles.empty}>국가 데이터를 불러올 수 없습니다.</p>
      )}

      <div className={styles.features}>
        <h3>ISR 특징:</h3>
        <ul>
          <li>첫 방문: 캐시된 페이지 즉시 표시</li>
          <li>재검증: 백그라운드에서 자동 업데이트</li>
          <li>성능: 빠른 응답 속도 유지</li>
          <li>신선도: 주기적으로 최신 데이터 반영</li>
        </ul>
      </div>
    </div>
  );
}
