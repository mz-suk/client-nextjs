'use client';

import { useJoinStore, validateAllergies } from '@domains/join';
import { JoinLayout } from '@domains/join/components';
import { Button } from '@domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { FullPopup } from '@/shared/ui/FullPopup';

import styles from './page.module.scss';

const ALLERGY_OPTIONS = [
  { id: 'dairy', label: '유제품', description: '우유, 치즈, 요거트 등 유제품에 대한 알러지' },
  { id: 'egg', label: '계란', description: '계란 및 계란이 포함된 음식에 대한 알러지' },
  { id: 'peanut', label: '땅콩', description: '땅콩 및 땅콩 제품에 대한 알러지' },
  { id: 'soy', label: '콩', description: '대두, 두부, 콩나물 등 콩 제품에 대한 알러지' },
  { id: 'wheat', label: '밀', description: '밀가루, 빵, 면 등 밀 제품에 대한 알러지' },
  { id: 'seafood', label: '해산물', description: '생선 등 해산물에 대한 알러지' },
  { id: 'shellfish', label: '갑각류', description: '새우, 게, 랍스터 등 갑각류에 대한 알러지' },
  { id: 'tree-nut', label: '견과류', description: '아몬드, 호두, 캐슈넛 등 견과류에 대한 알러지' },
  { id: 'none', label: '해당 없음', description: '알러지가 없습니다' },
];

export default function OnboardingAllergyPage() {
  const router = useRouter();
  const { formData, setOnboardingData, goToStep } = useJoinStore();
  const [selected, setSelected] = useState<string[]>(formData.onboarding.allergies);
  const [error, setError] = useState('');
  const [selectedAllergyInfo, setSelectedAllergyInfo] = useState<{ id: string; label: string; description: string } | null>(null);

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

  const handleAllergyInfo = (option: (typeof ALLERGY_OPTIONS)[0]) => {
    setSelectedAllergyInfo(option);
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
    <JoinLayout title="프로필 작성" showProgress currentStep={9}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.subTitle}>문진정보 입력</p>
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
            <div key={option.id} className={styles.optionWrapper}>
              <button
                type="button"
                className={`${styles.optionCard} ${selected.includes(option.id) ? styles.active : ''}`}
                onClick={() => toggleSelection(option.id)}
              >
                <span className={styles.label}>{option.label}</span>
              </button>
              <button type="button" className={styles.infoButton} onClick={() => handleAllergyInfo(option)} aria-label={`${option.label} 정보 보기`}>
                ℹ️
              </button>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          <Button size="full" onClick={handleNext} className={styles.button}>
            다음
          </Button>
          <p className={styles.buttonDesc}>확인은 가입 시 제공하신 정보 내에서만 이루어져요</p>
        </footer>
      </div>

      {/* 알러지 상세 정보 팝업 */}
      <FullPopup open={!!selectedAllergyInfo} onOpenChange={open => !open && setSelectedAllergyInfo(null)} title={selectedAllergyInfo?.label} direction="right">
        <div className={styles.popupContent}>
          <h3>알러지 정보</h3>
          <p className={styles.popupDescription}>{selectedAllergyInfo?.description}</p>

          <div className={styles.popupSection}>
            <h4>주의사항</h4>
            <ul>
              <li>해당 알러지가 있을 경우 반드시 선택해주세요</li>
              <li>식단 추천 시 해당 알러지 성분이 제외됩니다</li>
              <li>알러지 정보는 마이페이지에서 수정 가능합니다</li>
            </ul>
          </div>

          <div className={styles.popupSection}>
            <h4>관련 식품 예시</h4>
            <p className={styles.popupExamples}>
              {selectedAllergyInfo?.id === 'dairy' && '우유, 치즈, 버터, 요거트, 크림'}
              {selectedAllergyInfo?.id === 'egg' && '계란, 마요네즈, 쿠키, 케이크'}
              {selectedAllergyInfo?.id === 'peanut' && '땅콩, 땅콩버터, 땅콩오일'}
              {selectedAllergyInfo?.id === 'soy' && '두부, 간장, 된장, 두유'}
              {selectedAllergyInfo?.id === 'wheat' && '빵, 면, 쿠키, 케이크'}
              {selectedAllergyInfo?.id === 'seafood' && '생선, 어묵, 젓갈'}
              {selectedAllergyInfo?.id === 'shellfish' && '새우, 게, 랍스터, 조개'}
              {selectedAllergyInfo?.id === 'tree-nut' && '아몬드, 호두, 캐슈넛, 피스타치오'}
              {selectedAllergyInfo?.id === 'none' && '알러지가 없어 모든 식품을 섭취할 수 있습니다'}
            </p>
          </div>
        </div>
      </FullPopup>
    </JoinLayout>
  );
}
