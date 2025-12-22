'use client';

import { useJoinStore } from '@/domains/join';
import { Checkbox, Input, JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

const CARRIERS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LGU+', label: 'LGU+' },
] as const;

// 내부 단계 타입
type VerifyStep = 'name' | 'carrier' | 'phone' | 'agreement' | 'complete';

// 각 단계별 안내 메시지 정의
const stepTitles: Record<VerifyStep, React.ReactNode> = {
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
  const router = useRouter();
  const { formData, setFormData, goToStep } = useJoinStore();

  // 상태
  const [name, setName] = useState(formData.name);
  const [carrier, setCarrier] = useState(formData.carrier);
  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber);
  const [agreeTerms, setAgreeTerms] = useState(formData.agreeTerms);
  const [agreePrivacy, setAgreePrivacy] = useState(formData.agreePrivacy);
  const [agreeMarketing, setAgreeMarketing] = useState(formData.agreeMarketing);
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // 내부 단계 관리
  const [currentStep, setCurrentStep] = useState<VerifyStep>('name');

  // 이전 데이터가 있으면 해당 단계로 이동
  useEffect(() => {
    if (formData.name) {
      if (formData.carrier) {
        if (formData.phoneNumber && formData.phoneNumber.length >= 10) {
          if (formData.agreeTerms && formData.agreePrivacy) {
            setCurrentStep('complete');
          } else {
            setCurrentStep('agreement');
          }
        } else {
          setCurrentStep('phone');
        }
      } else {
        setCurrentStep('carrier');
      }
    }
  }, []);

  // 이름 입력 완료 시 다음 단계로
  const handleNameBlur = () => {
    if (name.trim().length >= 2) {
      setTimeout(() => {
        setCurrentStep('carrier');
      }, 300);
    }
  };

  // 통신사 선택 시 다음 단계로
  const handleCarrierSelect = (value: (typeof CARRIERS)[number]['value']) => {
    setCarrier(value);
    setTimeout(() => {
      setCurrentStep('phone');
    }, 300);
  };

  const allRequiredAgreed = agreeTerms && agreePrivacy;
  const allAgree = allRequiredAgreed && agreeMarketing;
  const canSubmit = name.trim() && carrier && phoneNumber.length >= 10 && allRequiredAgreed;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      setPhoneNumber(value);
      setPhoneError('');

      // 전화번호 입력 완료 시 약관 동의 단계로
      if (value.length >= 10) {
        setTimeout(() => {
          setCurrentStep('agreement');
        }, 500);
      }
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  };

  const handleAllAgree = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);

    // 모든 필수 약관 동의 시 완료 단계로
    if (checked) {
      setTimeout(() => {
        setCurrentStep('complete');
      }, 300);
    } else {
      setCurrentStep('agreement');
    }
  };

  const handleAgreeChange = (type: 'terms' | 'privacy' | 'marketing', checked: boolean) => {
    if (type === 'terms') setAgreeTerms(checked);
    if (type === 'privacy') setAgreePrivacy(checked);
    if (type === 'marketing') setAgreeMarketing(checked);

    // 필수 약관 모두 동의 시 완료 단계로
    const newTerms = type === 'terms' ? checked : agreeTerms;
    const newPrivacy = type === 'privacy' ? checked : agreePrivacy;

    if (newTerms && newPrivacy) {
      setTimeout(() => {
        setCurrentStep('complete');
      }, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('이름을 입력해주세요.');
      return;
    }

    if (!carrier) {
      alert('통신사를 선택해주세요.');
      return;
    }

    if (phoneNumber.length < 10) {
      setPhoneError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    if (!allRequiredAgreed) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    // 본인인증 API 호출 (Mock)
    setFormData({
      name: name.trim(),
      carrier,
      phoneNumber,
      agreeTerms,
      agreePrivacy,
      agreeMarketing,
    });

    goToStep('auth-code');
    router.push('/join/auth-code');
  };

  const handleNext = () => {
    if (currentStep === 'name') {
      if (name.trim().length < 2) {
        setNameError('이름은 2자 이상 입력해주세요.');
        return;
      }
      setCurrentStep('carrier');
    } else if (currentStep === 'carrier') {
      if (!carrier) {
        alert('통신사를 선택해주세요.');
        return;
      }
      setCurrentStep('phone');
    } else if (currentStep === 'phone') {
      if (phoneNumber.length < 10) {
        setPhoneError('올바른 휴대폰 번호를 입력해주세요.');
        return;
      }
      setCurrentStep('agreement');
    } else if (currentStep === 'agreement' || currentStep === 'complete') {
      if (!allRequiredAgreed) {
        alert('필수 약관에 동의해주세요.');
        return;
      }
      // 완료 상태면 제출
      if (currentStep === 'complete') {
        handleSubmit(new Event('submit') as any);
      }
    }
  };

  const handleCancel = () => {
    if (currentStep === 'name') {
      router.back();
    } else if (currentStep === 'carrier') {
      setCurrentStep('name');
    } else if (currentStep === 'phone') {
      setCurrentStep('carrier');
    } else if (currentStep === 'agreement' || currentStep === 'complete') {
      setCurrentStep('phone');
    }
  };

  const getNextButtonText = () => {
    if (currentStep === 'complete') {
      return '인증번호 받기';
    }
    return '다음';
  };

  const isNextButtonDisabled = () => {
    if (currentStep === 'name') {
      return !name.trim() || name.trim().length < 2;
    } else if (currentStep === 'carrier') {
      return !carrier;
    } else if (currentStep === 'phone') {
      return phoneNumber.length < 10;
    } else if (currentStep === 'agreement' || currentStep === 'complete') {
      return !allRequiredAgreed;
    }
    return true;
  };

  return (
    <JoinLayout showBackButton={false} showProgress currentStep={1} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{stepTitles[currentStep]}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: 이름 입력 */}
          <div className={`${styles.section} ${styles.fadeIn}`}>
            <Input
              label="이름"
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setNameError('');
              }}
              onBlur={handleNameBlur}
              placeholder="이름을 입력해 주세요"
              error={nameError}
              onClear={() => setName('')}
              autoFocus
            />
          </div>

          {/* Step 2: 통신사 선택 (이름 입력 후 표시) */}
          {currentStep !== 'name' && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <h3 className={styles.sectionTitle}>통신사 선택</h3>
              <div className={styles.carrierGroup}>
                {CARRIERS.map(item => (
                  <button
                    key={item.value}
                    type="button"
                    className={`${styles.carrierButton} ${carrier === item.value ? styles.active : ''}`}
                    onClick={() => handleCarrierSelect(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 휴대폰 번호 (통신사 선택 후 표시) */}
          {currentStep !== 'name' && currentStep !== 'carrier' && (
            <div className={`${styles.section} ${styles.fadeIn}`}>
              <Input
                label="휴대폰 번호"
                type="tel"
                value={formatPhoneNumber(phoneNumber)}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                error={phoneError}
                onClear={() => setPhoneNumber('')}
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
                  checked={agreeTerms}
                  onChange={checked => handleAgreeChange('terms', checked)}
                  required
                  linkText="보기"
                  onLinkClick={() => setShowTermsModal(true)}
                />
                <Checkbox
                  label="개인정보 처리방침 동의"
                  checked={agreePrivacy}
                  onChange={checked => handleAgreeChange('privacy', checked)}
                  required
                  linkText="보기"
                  onLinkClick={() => alert('개인정보 처리방침')}
                />
                <Checkbox
                  label="마케팅 정보 수신 동의 (선택)"
                  checked={agreeMarketing}
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

      {/* 약관 모달 (간단 구현) */}
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
    </JoinLayout>
  );
}
