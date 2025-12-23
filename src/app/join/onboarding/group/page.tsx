'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJoinStore } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import styles from './page.module.scss';

const GROUP_OPTIONS = [
  { id: 'student', label: '학생', icon: '🎓' },
  { id: 'worker', label: '직장인', icon: '💼' },
  { id: 'freelancer', label: '프리랜서', icon: '💻' },
  { id: 'homemaker', label: '주부/주夫', icon: '🏠' },
  { id: 'jobseeker', label: '취업준비생', icon: '📚' },
  { id: 'etc', label: '기타', icon: '✨' },
];

export default function OnboardingGroupPage() {
  const router = useRouter();
  const { formData, setOnboardingData, goToStep } = useJoinStore();
  const [selected, setSelected] = useState<string[]>(formData.onboarding.groupInfo);

  const toggleSelection = (id: string) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const handleNext = () => {
    setOnboardingData({ groupInfo: selected });
    goToStep('onboarding-allergy');
    router.push('/join/onboarding/allergy');
  };

  const handleSkip = () => {
    goToStep('onboarding-allergy');
    router.push('/join/onboarding/allergy');
  };

  return (
    <JoinLayout title="프로필 작성" showProgress currentStep={7} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            어떤 그룹에
            <br />
            속하시나요?
          </h2>
          <p className={styles.description}>중복 선택 가능합니다 (건너뛰기 가능)</p>
        </div>

        <div className={styles.optionGrid}>
          {GROUP_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              className={`${styles.optionCard} ${selected.includes(option.id) ? styles.active : ''}`}
              onClick={() => toggleSelection(option.id)}
            >
              <span className={styles.icon}>{option.icon}</span>
              <span className={styles.label}>{option.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="default" size="lg" onClick={handleNext} disabled={selected.length === 0} className={styles.button}>
            다음
          </Button>
          <button type="button" className={styles.skipButton} onClick={handleSkip}>
            건너뛰기
          </button>
        </div>
      </div>
    </JoinLayout>
  );
}
