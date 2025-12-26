'use client';

import { useJoinStore, validateAllergies } from '@domains/join';
import { JoinLayout } from '@domains/join/components';
import { Button } from '@domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import styles from './page.module.scss';

const ALLERGY_OPTIONS = [
  { id: 'dairy', label: '유제품', icon: '🥛' },
  { id: 'egg', label: '계란', icon: '🥚' },
  { id: 'peanut', label: '땅콩', icon: '🥜' },
  { id: 'soy', label: '콩', icon: '🫘' },
  { id: 'wheat', label: '밀', icon: '🌾' },
  { id: 'seafood', label: '해산물', icon: '🦐' },
  { id: 'shellfish', label: '갑각류', icon: '🦀' },
  { id: 'tree-nut', label: '견과류', icon: '🌰' },
  { id: 'none', label: '해당 없음', icon: '✅' },
];

export default function OnboardingAllergyPage() {
  const router = useRouter();
  const { formData, setOnboardingData, goToStep } = useJoinStore();
  const [selected, setSelected] = useState<string[]>(formData.onboarding.allergies);
  const [error, setError] = useState('');

  const toggleSelection = (id: string) => {
    if (id === 'none') {
      setSelected(['none']);
    } else {
      setSelected(prev => {
        const filtered = prev.filter(item => item !== 'none');
        return filtered.includes(id) ? filtered.filter(item => item !== id) : [...filtered, id];
      });
    }
    setError('');
  };

  const handleNext = () => {
    // Zod 벨리데이션
    const result = validateAllergies(selected);

    if (!result.success || !result.data) {
      setError(result.error || '');
      return;
    }

    setOnboardingData({ allergies: result.data.allergies });
    goToStep('onboarding-gender');
    router.push('/join/onboarding/gender');
  };

  return (
    <JoinLayout title="프로필 작성" showProgress currentStep={8} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            가지고 계신
            <br />
            알러지가 있나요?
          </h2>
          <p className={styles.description}>중복 선택 가능합니다</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.optionGrid}>
          {ALLERGY_OPTIONS.map(option => (
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

        <Button variant="default" size="lg" onClick={handleNext} disabled={selected.length === 0} className={styles.button}>
          다음
        </Button>
      </div>
    </JoinLayout>
  );
}
