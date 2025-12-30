'use client';

import { useJoinStore, validateGender } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.scss';

const GENDER_OPTIONS = [
  { value: 'male', label: '남성', icon: '👨' },
  { value: 'female', label: '여성', icon: '👩' },
  { value: 'other', label: '기타', icon: '🌈' },
] as const;

export default function OnboardingGenderPage() {
  const router = useRouter();
  const { formData, setOnboardingData, goToStep } = useJoinStore();
  const [selected, setSelected] = useState(formData.onboarding.gender);
  const [error, setError] = useState('');

  const handleNext = () => {
    // Zod 벨리데이션
    const result = validateGender(selected);

    if (!result.success || !result.data) {
      setError(result.error || '');
      return;
    }

    setOnboardingData({ gender: result.data.gender });
    goToStep('onboarding-lifestyle');
    router.push('/join/onboarding/lifestyle');
  };

  return (
    <JoinLayout title="프로필 작성" showProgress currentStep={9} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            성별을
            <br />
            선택해주세요
          </h2>
          <p className={styles.description}>더 나은 맞춤 서비스를 제공하기 위해 필요합니다</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.optionList}>
          {GENDER_OPTIONS.map(option => (
            <button
              key={option.value}
              type="button"
              className={`${styles.optionCard} ${selected === option.value ? styles.active : ''}`}
              onClick={() => {
                setSelected(option.value);
                setError('');
              }}
            >
              <span className={styles.icon}>{option.icon}</span>
              <span className={styles.label}>{option.label}</span>
              <span className={styles.radio}>
                {selected === option.value && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="var(--brand60)" />
                    <circle cx="10" cy="10" r="4" fill="white" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        <Button variant="default" size="lg" onClick={handleNext} disabled={!selected} className={styles.button}>
          다음
        </Button>
      </div>
    </JoinLayout>
  );
}
