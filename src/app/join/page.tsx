'use client';

import { useJoinForm } from '@/domains/join';
import { CarrierSelectBottomSheet, Checkbox, Input, JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import styles from './page.module.scss';

// 각 단계별 안내 메시지 정의
const stepTitles = {
  name: (
    <>
      본인 확인을 위한
      <br />
      이름을 입력해주세요
    </>
  ),
  carrier: (
    <>
      통신사를
      <br />
      선택해주세요
    </>
  ),
  phone: (
    <>
      본인 인증 받으실
      <br />
      연락처를 입력해 주세요
    </>
  ),
  agreement: (
    <>
      본인 인증을 위한
      <br />
      약관 동의가 필요해요
    </>
  ),
  complete: (
    <>
      본인 인증을 위한
      <br />
      약관 동의가 필요해요
    </>
  ),
};

export default function JoinPage() {
  const {
    formData,
    currentStep,
    nameError,
    phoneError,
    showCarrierBottomSheet,
    showTermsModal,
    setShowCarrierBottomSheet,
    setShowTermsModal,
    handleNameChange,
    handleNameBlur,
    handleCarrierSelect,
    handlePhoneChange,
    handleAllAgree,
    handleAgreeChange,
    handleNext,
    handleCancel,
    formatPhoneNumber,
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
            <Input
              label="이름"
              type="text"
              value={formData.name}
              onChange={e => handleNameChange(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="이름을 입력해 주세요"
              error={nameError}
              onClear={() => handleNameChange('')}
              autoFocus
            />
          </div>

          {/* Step 2: 통신사 선택 (이름 입력 후 표시) */}
          {currentStep !== 'name' && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <Input
                label="통신사"
                type="text"
                value={formData.carrier}
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
              <Input
                label="휴대폰 번호"
                type="tel"
                value={formatPhoneNumber(formData.phoneNumber)}
                onChange={e => handlePhoneChange(e.target.value)}
                placeholder="010-1234-5678"
                error={phoneError}
                onClear={() => handlePhoneChange('')}
                autoFocus
              />
            </div>
          )}

          {/* Step 4: 약관 동의 (전화번호 입력 후 표시) */}
          {(currentStep === 'agreement' || currentStep === 'complete') && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <h3 className={styles.sectionTitle}>약관 동의</h3>
              <div className={styles.agreementGroup}>
                <Checkbox label="전체 동의" checked={allAgree} onChange={handleAllAgree} />
                <div className={styles.divider} />
                <Checkbox
                  label="이용약관 동의"
                  checked={formData.agreeTerms}
                  onChange={checked => handleAgreeChange('terms', checked)}
                  required
                  linkText="보기"
                  onLinkClick={() => setShowTermsModal(true)}
                />
                <Checkbox
                  label="개인정보 처리방침 동의"
                  checked={formData.agreePrivacy}
                  onChange={checked => handleAgreeChange('privacy', checked)}
                  required
                  linkText="보기"
                  onLinkClick={() => alert('개인정보 처리방침')}
                />
                <Checkbox
                  label="마케팅 정보 수신 동의 (선택)"
                  checked={formData.agreeMarketing}
                  onChange={checked => handleAgreeChange('marketing', checked)}
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
