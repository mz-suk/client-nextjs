'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>심각한 오류가 발생했습니다</h1>
          <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '600px' }}>애플리케이션에 심각한 문제가 발생했습니다. 페이지를 새로고침해주세요.</p>

          {error.digest && <p style={{ fontSize: '0.875rem', color: '#999', marginBottom: '2rem' }}>에러 ID: {error.digest}</p>}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid #0070f3',
                background: '#0070f3',
                color: 'white',
              }}
            >
              다시 시도
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: 'white',
                color: '#333',
              }}
            >
              새로고침
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
