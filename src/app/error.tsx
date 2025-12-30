'use client';

import { logger } from '@core/lib';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 페이지별 에러 바운더리
 * Server Component 및 Client Component의 에러를 포착합니다.
 *
 * Next.js 모범 사례:
 * - app/error.tsx에 배치하여 전역 에러 처리
 * - 특정 경로의 에러는 해당 경로에 error.tsx 추가
 * - 'use client' 필수 (에러 바운더리는 클라이언트 컴포넌트)
 * - reset() 함수로 에러 복구 시도 가능
 */
export default function Error({ error, reset }: ErrorProps) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // 에러 로깅 (모니터링 서비스로 전송 가능)
    logger.error('Page Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await reset();
    } finally {
      setIsResetting(false);
    }
  };

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
        background: 'linear-gradient(to bottom, #fef2f2, #fee2e2)',
      }}
    >
      <div style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#991b1b', fontWeight: '600' }}>문제가 발생했습니다</h1>
        <p style={{ color: '#7f1d1d', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          페이지를 표시하는 중 예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {error.digest && (
          <div
            style={{
              background: 'white',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '2rem',
              fontSize: '0.875rem',
              color: '#991b1b',
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>에러 정보</div>
            <div style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>ID: {error.digest}</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleReset}
            disabled={isResetting}
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              cursor: isResetting ? 'not-allowed' : 'pointer',
              borderRadius: '8px',
              border: 'none',
              background: isResetting ? '#9ca3af' : '#dc2626',
              color: 'white',
              fontWeight: '500',
              opacity: isResetting ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {isResetting ? '재시도 중...' : '다시 시도'}
          </button>
          <Link
            href="/"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#475569',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            홈으로 이동
          </Link>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#475569',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
