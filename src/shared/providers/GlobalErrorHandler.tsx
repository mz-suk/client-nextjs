'use client';

import { AuthError } from '@core/api/auth';
import { ApiError } from '@core/api/error';
import { logger } from '@core/lib';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

import styles from './GlobalErrorHandler.module.scss';

interface GlobalErrorHandlerProps {
  children: ReactNode;
  /**
   * 로그인 페이지 경로 (403 에러 시 리다이렉트)
   * @default '/login'
   */
  loginPath?: string;
}

interface ErrorState {
  error: Error | null;
  timestamp: number;
}

/**
 * 전역 에러 핸들러
 * React Query의 전역으로 처리해야 하는 에러만 감지하고 처리합니다.
 *
 * 전역 처리 대상:
 * - 403: 권한 없음 → 로그인 페이지로 리다이렉트
 * - 5xx: 서버 에러 → 토스트 표시
 * - 네트워크/타임아웃 에러 → 토스트 표시
 *
 * 로컬 처리 대상 (각 컴포넌트에서 처리):
 * - 400, 404, 422 등 비즈니스 로직 에러
 *
 * 자동 처리 대상 (client.ts):
 * - 401: 토큰 갱신 후 재시도
 */
export function GlobalErrorHandler({ children, loginPath = '/login' }: GlobalErrorHandlerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errorState, setErrorState] = useState<ErrorState>({ error: null, timestamp: 0 });

  /**
   * 전역으로 처리해야 하는 에러인지 판단하고 처리
   */
  const handleGlobalError = (error: Error) => {
    // ApiError인 경우
    if (error instanceof ApiError) {
      // 전역으로 처리해야 하는 에러만 토스트 표시
      if (error.shouldHandleGlobally()) {
        logger.error('Global Error Detected:', error);
        setErrorState({ error, timestamp: Date.now() });

        // 403 에러는 로그인 페이지로 리다이렉트
        if (error.status === 403) {
          setTimeout(() => {
            router.push(loginPath);
          }, 2000); // 2초 후 리다이렉트 (에러 메시지를 먼저 표시)
        }
      } else {
        // 로컬에서 처리해야 하는 에러는 로그만 남김
        logger.debug('Local Error (handled by component):', error);
      }
    }
    // AuthError인 경우 (client.ts에서 발생)
    else if (error instanceof AuthError) {
      logger.error('Auth Error Detected:', error);
      // AuthError는 이미 client.ts에서 처리되었으므로 추가 처리 불필요
      // 필요시 로그인 페이지로 리다이렉트
      router.push(loginPath);
    }
    // 일반 Error인 경우
    else {
      logger.error('Unknown Error Detected:', error);
      setErrorState({ error, timestamp: Date.now() });
    }
  };

  useEffect(() => {
    // Query Cache 에러 구독
    const unsubscribeQuery = queryClient.getQueryCache().subscribe(event => {
      if (event.type === 'observerResultsUpdated') {
        const query = event.query;
        if (query.state.error) {
          const error = query.state.error as Error;
          handleGlobalError(error);
        }
      }
    });

    // Mutation Cache 에러 구독
    const unsubscribeMutation = queryClient.getMutationCache().subscribe(event => {
      if (event.type === 'updated' && event.mutation.state.error) {
        const error = event.mutation.state.error as Error;
        handleGlobalError(error);
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleClose = () => {
    setErrorState({ error: null, timestamp: 0 });
  };

  if (errorState.error) {
    const error = errorState.error;
    const isApiError = error instanceof ApiError;
    const message = isApiError ? error.getUserFriendlyMessage() : error.message;
    const isServerError = isApiError && error.isServerError();
    const isForbidden = isApiError && error.status === 403;

    const toastClass = isForbidden ? styles.forbidden : isServerError ? styles.serverError : styles.default;

    return (
      <>
        {children}
        <div className={`${styles.toast} ${toastClass}`}>
          <div className={styles.content}>
            <div className={styles.icon}>{isForbidden ? '🔒' : isServerError ? '❌' : '⚠️'}</div>
            <div className={styles.body}>
              <h4>{isForbidden ? '접근 권한 없음' : isServerError ? '서버 오류' : '오류 발생'}</h4>
              <p>{message}</p>
              {isApiError && error.code && <p className={styles.code}>코드: {error.code}</p>}
              {isForbidden && <p className={styles.redirect}>로그인 페이지로 이동합니다...</p>}
              <div className={styles.actions}>
                {!isForbidden && (
                  <button onClick={handleReset} className={styles.retry}>
                    재시도
                  </button>
                )}
                <button onClick={handleClose} className={styles.close}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
