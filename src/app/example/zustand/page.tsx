'use client';

import { useCounterStore } from '@domains/counter/stores';

import styles from './page.module.css';

/**
 * Zustand 상태 관리 예제
 * - 간단하고 직관적인 전역 상태 관리
 * - DevTools 지원
 * - localStorage 자동 동기화 (persist)
 */
export default function ZustandPage() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Zustand 상태 관리 예제</h1>
        <p className={styles.description}>간단하고 직관적인 전역 상태 관리 라이브러리</p>
      </header>

      <div className={styles.content}>
        <div className={styles.counterDisplay}>
          <span className={styles.label}>현재 카운트</span>
          <div className={styles.countValue}>{count}</div>
        </div>

        <div className={styles.controls}>
          <button onClick={decrement} className={`${styles.button} ${styles.buttonSecondary}`} aria-label="감소">
            <span className={styles.icon}>−</span>
            감소
          </button>

          <button onClick={reset} className={`${styles.button} ${styles.buttonOutline}`} aria-label="리셋">
            리셋
          </button>

          <button onClick={increment} className={`${styles.button} ${styles.buttonPrimary}`} aria-label="증가">
            <span className={styles.icon}>+</span>
            증가
          </button>
        </div>

        <div className={styles.features}>
          <h2>주요 기능</h2>
          <ul className={styles.featureList}>
            <li>
              <strong>간단한 API:</strong> useState와 유사한 직관적인 사용법
            </li>
            <li>
              <strong>DevTools 지원:</strong> Redux DevTools로 상태 디버깅
            </li>
            <li>
              <strong>Persist:</strong> localStorage에 자동 저장 및 복원
            </li>
            <li>
              <strong>TypeScript:</strong> 완벽한 타입 추론 지원
            </li>
            <li>
              <strong>성능:</strong> 불필요한 리렌더링 최소화
            </li>
          </ul>
        </div>

        <div className={styles.info}>
          <div className={styles.infoBox}>
            <h3>💡 DevTools 확인</h3>
            <p>브라우저 Redux DevTools 확장프로그램을 설치하면 상태 변화를 시각적으로 확인할 수 있습니다.</p>
          </div>

          <div className={styles.infoBox}>
            <h3>💾 localStorage 동기화</h3>
            <p>페이지를 새로고침해도 카운트 값이 유지됩니다. localStorage에 자동으로 저장됩니다.</p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>Zustand로 간단하게 전역 상태를 관리하세요</p>
      </footer>
    </div>
  );
}
