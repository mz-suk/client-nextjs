'use client';

import SucessCheckLottie from '@/shared/ui/lotties/SucessCheckLottie';
import { useJoinStore } from '@domains/join';
import { JoinLayout } from '@domains/join/components';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import styles from './page.module.scss';

export default function JoinAuthCompletePage() {
  const router = useRouter();
  const { goToStep } = useJoinStore();

  const handleNext = useCallback(() => {
    goToStep('account');
    router.push('/join/account');
  }, [goToStep, router]);

  useEffect(() => {
    // 자동으로 다음 단계로 이동 (3초 후)
    const timer = setTimeout(() => {
      handleNext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleNext]);

  return (
    <JoinLayout title="본인인증" showBackButton={false} showProgress currentStep={4} totalStep={10}>
      <div className={styles.container}>
        <SucessCheckLottie />
        <h2 className={styles.title}>인증을 완료했어요!</h2>
      </div>
    </JoinLayout>
  );
}
