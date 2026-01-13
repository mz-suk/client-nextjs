'use client';

import { useJoinStore } from '@domains/join';
import { JoinLayout } from '@domains/join/components';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import SucessCheckLottie from '@/shared/ui/lotties/SucessCheckLottie';

import styles from './page.module.scss';

export default function JoinAuthCompletePage() {
  const router = useRouter();
  const { goToStep } = useJoinStore();

  const handleNext = () => {
    goToStep('account');
    router.push('/join/account');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <JoinLayout title="본인인증" showBackButton={false} showProgress currentStep={4}>
      <div className={styles.container}>
        <SucessCheckLottie />
        <h2 className={styles.title}>인증을 완료했어요!</h2>
      </div>
    </JoinLayout>
  );
}
