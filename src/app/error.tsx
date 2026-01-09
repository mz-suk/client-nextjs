'use client';

import { logger } from '@core/lib';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import styles from './error.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * 페이지별 에러 바운더리
 *
 * @description Server/Client Component 에러를 포착하여 복구 시도
 * - app/error.tsx에 배치하여 전역 에러 처리
 * - 특정 경로의 에러는 해당 경로에 error.tsx 추가
 * - 'use client' 필수 (에러 바운더리는 클라이언트 컴포넌트)
 * - reset() 함수로 에러 복구 시도 가능
 */
export default function Error({ error, reset }: ErrorProps) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
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
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>⚠️</div>
        <h1 className={styles.title}>문제가 발생했습니다</h1>
        <p className={styles.description}>
          페이지를 표시하는 중 예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {error.digest && (
          <div className={styles.digest}>
            <div className={styles.digestLabel}>에러 정보</div>
            <div className={styles.digestValue}>ID: {error.digest}</div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={handleReset} disabled={isResetting} className={styles.buttonPrimary}>
            {isResetting ? '재시도 중...' : '다시 시도'}
          </button>
          <Link href="/" className={styles.buttonSecondary}>
            홈으로 이동
          </Link>
          <button onClick={() => window.location.reload()} className={styles.buttonSecondary}>
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
