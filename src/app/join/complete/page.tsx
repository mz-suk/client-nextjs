'use client';

import { useRouter } from 'next/navigation';
import { useJoinStore } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import { Button } from '@/shared/ui';
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
    <JoinLayout title="가입 완료" showBackButton={false} showProgress currentStep={6} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <div className={styles.celebrationIcon}>
            <span role="img" aria-label="축하">
              🎉
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>
            환영합니다!
            <br />
            회원가입이 완료되었습니다
          </h2>
          <p className={styles.description}>
            <strong>{formData.name}</strong>님, 가입을 진심으로 축하드립니다!
            <br />
            아이디: <strong>{formData.userId}</strong>
          </p>
        </div>

        <div className={styles.nextStep}>
          <h3 className={styles.nextStepTitle}>
            더 나은 서비스를 위해
            <br />
            프로필을 작성해주세요
          </h3>
          <p className={styles.nextStepDescription}>
            프로필 작성은 약 2분 정도 소요되며,
            <br />
            나중에도 언제든 작성하실 수 있습니다.
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="default" size="lg" onClick={handleStartOnboarding} className={styles.button}>
            프로필 작성하기
          </Button>
          <button type="button" className={styles.skipButton} onClick={handleSkipOnboarding}>
            나중에 하기
          </button>
        </div>
      </div>
    </JoinLayout>
  );
}
