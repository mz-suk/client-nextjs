'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 전역 에러 바운더리
 * 루트 레이아웃을 포함한 최상위 레벨의 에러를 포착합니다.
 *
 * Next.js 모범 사례:
 * - app/global-error.tsx에 배치 (루트 레이아웃 에러 포착)
 * - <html>, <body> 태그를 직접 포함해야 함
 * - 프로덕션에서만 활성화됨
 * - 매우 드물게 발생하는 치명적인 에러만 포착
 *
 * 주의: global-error.tsx는 개발 모드에서는 표시되지 않습니다.
 * error.tsx가 대신 사용됩니다.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 심각한 에러 로깅 (반드시 외부 모니터링 서비스로 전송)
    console.error('Critical Global Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // 외부 에러 모니터링 서비스로 전송
    // 예: Sentry, LogRocket, Datadog 등
    // if (typeof window !== 'undefined') {
    //   window.errorMonitoring?.captureException(error);
    // }
  }, [error]);

  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🚨</div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#7f1d1d', fontWeight: '700' }}>심각한 오류가 발생했습니다</h1>
            <p style={{ color: '#991b1b', marginBottom: '2rem', fontSize: '1.125rem', lineHeight: 1.6 }}>
              애플리케이션에 치명적인 문제가 발생했습니다.
              <br />
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>

            {error.digest && (
              <div
                style={{
                  background: 'white',
                  border: '2px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  marginBottom: '2rem',
                  fontSize: '0.875rem',
                  color: '#991b1b',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '0.75rem', fontSize: '1rem' }}>⚠️ 에러 정보</div>
                <div style={{ fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.5 }}>
                  <div>ID: {error.digest}</div>
                  {error.message && <div style={{ marginTop: '0.5rem' }}>메시지: {error.message}</div>}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#7f1d1d' }}>이 에러 ID를 고객 지원팀에 전달해주세요.</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc2626',
                  color: 'white',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                페이지 새로고침
              </button>
              <button
                onClick={reset}
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: '2px solid #dc2626',
                  background: 'white',
                  color: '#dc2626',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                다시 시도
              </button>
            </div>

            <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#7f1d1d' }}>문제가 계속되면 고객 지원팀에 문의해주세요.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
