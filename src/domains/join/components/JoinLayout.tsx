'use client';

import { useJoinStore } from '@domains/join';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import styles from './JoinLayout.module.scss';

interface JoinLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showProgress?: boolean;
  currentStep?: number;
  totalStep?: number;
  onBack?: () => void;
}

export function JoinLayout({
  children,
  title,
  showBackButton = true,
  showProgress = false,
  currentStep = 1,
  totalStep: _totalStep = 10,
  onBack,
}: JoinLayoutProps) {
  const router = useRouter();
  const { goBack, canGoBack, previousProgress, setPreviousProgress } = useJoinStore();

  // 프로필 작성(Step 7 이상)일 때만 프로그레스 계산
  const isProfileStep = currentStep >= 7;
  const profileStep = isProfileStep ? currentStep - 6 : 0; // 7->1, 8->2, 9->3, 10->4
  const profileTotalSteps = 4;

  // 프로그레스 바를 4분할해서 100% 기준으로 %
  const [progress, setProgress] = useState(previousProgress);

  useEffect(() => {
    if (!isProfileStep) return;

    // (progress 0% ~ 100%)
    const targetProgressPercent = (profileStep / profileTotalSteps) * 100;

    // 트랜지션 효과를 위해 약간의 딜레이
    const timer = setTimeout(() => {
      setProgress(targetProgressPercent);
      setPreviousProgress(targetProgressPercent);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep, isProfileStep, profileStep, profileTotalSteps, setPreviousProgress]);

  const handleBack = () => router.back();

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        {showBackButton && (
          <button type="button" className={styles.backButton} onClick={handleBack} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
      </header>

      {/* Progress Bar - 프로필 작성(Step 7) 이후부터만 표시 */}
      {showProgress && isProfileStep && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${progress}%`,
              transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)', // 부드러운 효과, 필요시 css에서 커스텀
            }}
          >
            {/* 빛나는 효과 */}
            <div className={styles.progressGlow} />
          </div>
        </div>
      )}

      {/* Content */}
      <main className={styles.content}>{children}</main>
    </div>
  );
}
