'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useJoinStore, validateLifestyle } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';

import styles from './page.module.scss';

const LIFESTYLE_OPTIONS = [
  { id: 'morning', label: '아침형 인간', icon: '🌅', desc: '일찍 일어나고 일찍 자요' },
  { id: 'night', label: '저녁형 인간', icon: '🌙', desc: '늦게 자고 늦게 일어나요' },
  { id: 'exercise', label: '운동을 좋아해요', icon: '💪', desc: '규칙적으로 운동해요' },
  { id: 'reading', label: '독서를 즐겨요', icon: '📚', desc: '책 읽는 걸 좋아해요' },
  { id: 'social', label: '사교적이에요', icon: '🎉', desc: '사람 만나는 걸 좋아해요' },
  { id: 'introvert', label: '혼자가 편해요', icon: '🏠', desc: '혼자 있는 시간이 필요해요' },
  { id: 'cooking', label: '요리를 해요', icon: '👨‍🍳', desc: '직접 요리하는 걸 좋아해요' },
  { id: 'travel', label: '여행을 좋아해요', icon: '✈️', desc: '새로운 곳을 탐험해요' },
];

export default function OnboardingLifestylePage() {
  const router = useRouter();
  const { formData, setOnboardingData, resetForm } = useJoinStore();
  const [selected, setSelected] = useState<string[]>(formData.onboarding.lifestyle);
  const [error, setError] = useState('');

  const toggleSelection = (id: string) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
    setError('');
  };

  const handleComplete = async () => {
    // Zod 벨리데이션
    const result = validateLifestyle(selected);

    if (!result.success || !result.data) {
      setError(result.error || '');
      return;
    }

    setOnboardingData({ lifestyle: result.data.lifestyle, isCompleted: true });

    // 온보딩 완료 API 호출 (Mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 완료 후 스토리지 초기화
    resetForm();
    router.push('/');
  };

  return (
    <JoinLayout title="프로필 작성" showProgress currentStep={10} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            마지막으로,
            <br />
            생활 패턴을 알려주세요
          </h2>
          <p className={styles.description}>중복 선택 가능합니다</p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.optionList}>
          {LIFESTYLE_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              className={`${styles.optionCard} ${selected.includes(option.id) ? styles.active : ''}`}
              onClick={() => toggleSelection(option.id)}
            >
              <span className={styles.icon}>{option.icon}</span>
              <div className={styles.content}>
                <span className={styles.label}>{option.label}</span>
                <span className={styles.desc}>{option.desc}</span>
              </div>
              <span className={styles.checkbox}>
                {selected.includes(option.id) && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="4" fill="var(--brand60)" />
                    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>

        <Button variant="default" size="lg" onClick={handleComplete} disabled={selected.length === 0} className={styles.button}>
          완료
        </Button>
      </div>
    </JoinLayout>
  );
}
