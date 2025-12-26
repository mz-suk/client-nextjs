'use client';

import { ApiError } from '@core/api/error';
import { logger } from '@core/lib';
import { useQueryClient } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';

interface GlobalErrorHandlerProps {
  children: ReactNode;
}

interface ErrorState {
  error: Error | null;
  timestamp: number;
}

/**
 * 전역 에러 핸들러
 * React Query의 모든 에러를 감지하고 처리합니다.
 */
export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  const queryClient = useQueryClient();
  const [errorState, setErrorState] = useState<ErrorState>({ error: null, timestamp: 0 });

  useEffect(() => {
    // Query Cache 에러 구독
    const unsubscribeQuery = queryClient.getQueryCache().subscribe(event => {
      if (event.type === 'observerResultsUpdated') {
        const query = event.query;
        if (query.state.error) {
          const error = query.state.error as Error;
          logger.error('Query Error Detected:', error);
          setErrorState({ error, timestamp: Date.now() });
        }
      }
    });

    // Mutation Cache 에러 구독
    const unsubscribeMutation = queryClient.getMutationCache().subscribe(event => {
      if (event.type === 'updated' && event.mutation.state.error) {
        const error = event.mutation.state.error as Error;
        logger.error('Mutation Error Detected:', error);
        setErrorState({ error, timestamp: Date.now() });
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient]);

  // 에러 자동 해제 (5초 후)
  useEffect(() => {
    if (errorState.error) {
      const timer = setTimeout(() => {
        setErrorState({ error: null, timestamp: 0 });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorState]);

  const handleReset = () => {
    setErrorState({ error: null, timestamp: 0 });
    queryClient.resetQueries();
  };

  if (errorState.error) {
    const isApiError = errorState.error instanceof ApiError;
    const error = errorState.error;

    return (
      <>
        {children}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            maxWidth: '400px',
            padding: '16px 20px',
            background: isApiError ? '#fef2f2' : '#fff7ed',
            border: `2px solid ${isApiError ? '#dc2626' : '#f59e0b'}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 10000,
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '1.5rem' }}>{isApiError ? '❌' : '⚠️'}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>{isApiError ? 'API 오류' : '오류 발생'}</h4>
              <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>{error.message}</p>
              {isApiError && (error as ApiError).code && (
                <p style={{ margin: '0 0 12px', fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>코드: {(error as ApiError).code}</p>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  재시도
                </button>
                <button
                  onClick={() => setErrorState({ error: null, timestamp: 0 })}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.875rem',
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>
      </>
    );
  }

  return <>{children}</>;
}
