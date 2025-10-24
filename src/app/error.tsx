'use client';

import { logger } from '@/shared/lib';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error('Global Error:', error);
  }, [error]);

  return (
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
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>문제가 발생했습니다</h1>
      <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '600px' }}>예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>

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
        <Link
          href="/"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #ccc',
            background: 'white',
            color: '#333',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
