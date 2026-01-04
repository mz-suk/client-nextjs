'use client';

import { useJoinStore } from '@domains/join';
import { JoinLayout } from '@domains/join/components';
import { Button } from '@domains/join/components/Button';
import { useRouter } from 'next/navigation';

import styles from './page.module.scss';

export default function JoinCompletePage() {
  const router = useRouter();
  const { formData, goToStep, resetForm } = useJoinStore();

  const handleStartOnboarding = () => {
    goToStep('onboarding-group');
    router.push('/join/onboarding/group');
  };

  const handleSkipOnboarding = () => {
    // 온보딩 건너뛰고 메인으로
    resetForm();
    router.push('/');
  };

  return (
    <JoinLayout showBackButton={false} showProgress currentStep={6}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <img src="/img/ceremony.png" />
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>
            회원가입을 완료했어요!
            <br />
            환영합니다~
          </h2>
          <p className={styles.description}>
            프로필을 작성하면 더욱 세심한 관리를
            <br />
            받으실 수 있어요
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="default" size="lg" onClick={handleStartOnboarding}>
            프로필 작성하기
          </Button>
          <Button type="button" className={styles.skipButton} onClick={handleSkipOnboarding}>
            홈으로
          </Button>
        </div>
      </div>
    </JoinLayout>
  );
}
