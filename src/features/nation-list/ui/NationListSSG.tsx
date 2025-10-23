import type { Nation } from '@/entities/nation';
import styles from './NationListSSG.module.css';

interface NationListSSGProps {
  nations: Nation[];
  timestamp: string;
  buildTime: number;
}

export function NationListSSG({ nations, timestamp, buildTime }: NationListSSGProps) {
  return (
    <div className={styles.container}>
      <h1>SSG 예제 페이지</h1>

      <div className={styles.info}>
        <p>
          <strong>API:</strong> /common/search/nations
        </p>
        <p>
          <strong>렌더링 방식:</strong> Static Site Generation
        </p>
        <p>
          <strong>페이지 생성 시간:</strong> {timestamp}
        </p>
        <p>
          <strong>빌드 타임스탬프:</strong> {buildTime}
        </p>
        <p className={styles.note}>이 페이지는 빌드 시 한 번만 생성되며 모든 사용자에게 동일한 정적 콘텐츠를 제공합니다.</p>
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
