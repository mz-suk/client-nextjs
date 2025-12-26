'use client';

import { CarrierSelectBottomSheet, JoinLayout } from '@domains/join/components';
import { Button } from '@domains/join/components/Button';
import { FormCheckbox } from '@domains/join/components/FormCheckbox';
import { FormInput } from '@domains/join/components/FormInput';
import { useJoinForm } from '@domains/join/hooks/useJoinForm';
import { stepTitles } from '@domains/join/types';

import styles from './page.module.scss';

export default function JoinPage() {
  const {
    control,
    formData,
    currentStep,
    showCarrierBottomSheet,
    showTermsModal,
    setShowCarrierBottomSheet,
    setShowTermsModal,
    handleNameBlur,
    handleCarrierSelect,
    handlePhoneChange,
    handleAllAgree,
    handleNext,
    handleCancel,
    getNextButtonText,
    isNextButtonDisabled,
    allAgree,
  } = useJoinForm();

  return (
    <JoinLayout showBackButton={false} showProgress currentStep={2} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{stepTitles[currentStep]}</h2>
        </div>

        <form onSubmit={e => e.preventDefault()} className={styles.form}>
          {/* Step 1: 이름 입력 */}
          <div className={`${styles.section} ${styles.fadeIn}`}>
            <FormInput name="name" control={control} label="이름" type="text" placeholder="이름을 입력해 주세요" onBlur={handleNameBlur} autoFocus />
          </div>

          {/* Step 2: 통신사 선택 (이름 입력 후 표시) */}
          {currentStep !== 'name' && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <FormInput
                name="carrier"
                control={control}
                label="통신사"
                type="text"
                placeholder="선택해주세요"
                readOnly
                onClick={() => setShowCarrierBottomSheet(true)}
                rightIcon={
                  <div className={styles.arrowIcon}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                }
              />
            </div>
          )}

          {/* Step 3: 휴대폰 번호 (통신사 선택 후 표시) */}
          {currentStep !== 'name' && currentStep !== 'carrier' && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <FormInput
                name="phoneNumber"
                control={control}
                label="휴대폰 번호"
                type="tel"
                placeholder="010-1234-5678"
                onChange={handlePhoneChange}
                autoFocus
              />
            </div>
          )}

          {/* Step 4: 약관 동의 (전화번호 입력 후 표시) */}
          {currentStep === 'agreement' && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <h3 className={styles.sectionTitle}>약관 동의</h3>
              <div className={styles.agreementGroup}>
                <div onClick={() => handleAllAgree(!allAgree)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <input type="checkbox" checked={allAgree} onChange={e => handleAllAgree(e.target.checked)} style={{ cursor: 'pointer' }} />
                    <span>전체 동의</span>
                  </div>
                </div>
                <div className={styles.divider} />
                <FormCheckbox name="agreeTerms" control={control} label="이용약관 동의" required linkText="보기" onLinkClick={() => setShowTermsModal(true)} />
                <FormCheckbox
                  name="agreePrivacy"
                  control={control}
                  label="개인정보 처리방침 동의"
                  required
                  linkText="보기"
                  onLinkClick={() => alert('개인정보 처리방침')}
                />
                <FormCheckbox
                  name="agreeMarketing"
                  control={control}
                  label="마케팅 정보 수신 동의 (선택)"
                  linkText="보기"
                  onLinkClick={() => alert('마케팅 정보 수신 동의')}
                />
              </div>
            </div>
          )}

          {/* 취소/다음 버튼 */}
          <div className={styles.buttonContainer}>
            <Button type="button" variant="secondary" size="full" onClick={handleCancel} className={styles.cancelButton}>
              취소
            </Button>
            <Button type="button" variant="default" size="full" onClick={handleNext} disabled={isNextButtonDisabled()} className={styles.nextButton}>
              {getNextButtonText()}
            </Button>
          </div>
        </form>
      </div>

      {/* 약관 모달 */}
      {showTermsModal && (
        <div className={styles.modal} onClick={() => setShowTermsModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>이용약관</h3>
            <div className={styles.modalBody}>
              <p>이용약관 내용...</p>
            </div>
            <Button onClick={() => setShowTermsModal(false)}>닫기</Button>
          </div>
        </div>
      )}

      {/* 통신사 선택 바텀시트 */}
      <CarrierSelectBottomSheet
        open={showCarrierBottomSheet}
        onOpenChange={setShowCarrierBottomSheet}
        onSelect={handleCarrierSelect}
        selectedCarrier={formData.carrier}
      />
    </JoinLayout>
  );
}
