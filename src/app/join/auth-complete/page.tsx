'use client';

import { useJoinStore } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.scss';

export default function JoinAuthCompletePage() {
  const router = useRouter();
  const { goToStep } = useJoinStore();

  useEffect(() => {
    // 자동으로 다음 단계로 이동 (3초 후)
    const timer = setTimeout(() => {
      handleNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    goToStep('account');
    router.push('/join/account');
  };

  return (
    <JoinLayout title="본인인증" showBackButton={false} showProgress currentStep={4} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <div className={styles.checkIcon}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="var(--brand60)" />
              <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>인증이 완료되었습니다!</h2>
          <p className={styles.description}>
            본인인증이 정상적으로 완료되었습니다.
            <br />
            계속해서 회원가입을 진행해주세요.
          </p>
        </div>

        <Button variant="default" size="lg" onClick={handleNext} className={styles.button}>
          계속하기
        </Button>

        <p className={styles.autoRedirect}>3초 후 자동으로 이동합니다...</p>
      </div>
    </JoinLayout>
  );
}
