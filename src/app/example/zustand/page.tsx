'use client';

import { useCounterStore } from '@/domains/counter';

import styles from '../page.module.css';

export default function ExampleZustandPage() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Zustand 상태 관리 예제</h1>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
            }}
          >
            {count}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={decrement}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#fff',
              }}
            >
              -1
            </button>
            <button
              onClick={reset}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#fff',
              }}
            >
              Reset
            </button>
            <button
              onClick={increment}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#fff',
              }}
            >
              +1
            </button>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'left', maxWidth: '600px', margin: '3rem auto 0' }}>
            <h3>Zustand 특징:</h3>
            <ul>
              <li>간단한 API: useState와 유사한 사용법</li>
              <li>Boilerplate 최소화: Redux보다 훨씬 간결</li>
              <li>DevTools 지원: Redux DevTools 통합</li>
              <li>Middleware: persist, devtools 등 지원</li>
              <li>TypeScript 친화적: 완벽한 타입 지원</li>
              <li>번들 크기: 매우 작은 크기 (~1KB)</li>
            </ul>

            <p style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
              💡 이 카운터는 localStorage에 저장되어 페이지를 새로고침해도 값이 유지됩니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
