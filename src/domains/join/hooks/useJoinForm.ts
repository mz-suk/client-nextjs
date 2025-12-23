import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useJoinStore } from '../stores/useJoinStore';
import type { JoinFormData } from '../types';
import { validateCarrier, validateName, validatePhoneNumber } from '../validators';

type VerifyStep = 'name' | 'carrier' | 'phone' | 'agreement' | 'complete';

export function useJoinForm() {
  const router = useRouter();
  const { formData, setFormData, goToStep } = useJoinStore();

  // UI 상태
  const [currentStep, setCurrentStep] = useState<VerifyStep>('name');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showCarrierBottomSheet, setShowCarrierBottomSheet] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // 이름 변경
  const handleNameChange = (name: string) => {
    setFormData({ name });
    setNameError('');
  };

  // 이름 입력 완료 (실제 검증 적용)
  const handleNameBlur = () => {
    const result = validateName(formData.name);

    if (!result.success) {
      setNameError(result.error || '');
      return;
    }

    // 검증 성공 시 다음 단계로
    setTimeout(() => {
      setCurrentStep('carrier');
      setShowCarrierBottomSheet(true);
    }, 300);
  };

  // 통신사 선택
  const handleCarrierSelect = (carrier: JoinFormData['carrier']) => {
    setFormData({ carrier });
    setShowCarrierBottomSheet(false);
    setTimeout(() => {
      setCurrentStep('phone');
    }, 300);
  };

  // 전화번호 변경
  const handlePhoneChange = (phoneNumber: string) => {
    const value = phoneNumber.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      setFormData({ phoneNumber: value });
      setPhoneError('');
    }
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  };

  // 약관 전체 동의
  const handleAllAgree = (checked: boolean) => {
    setFormData({
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    });
  };

  // 개별 약관 동의
  const handleAgreeChange = (type: 'terms' | 'privacy' | 'marketing', checked: boolean) => {
    setFormData({ [`agree${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof formData]: checked } as any);
  };

  // 제출
  const handleSubmit = () => {
    goToStep('auth-code');
    router.push('/join/auth-code');
  };

  // 다음 단계
  const handleNext = () => {
    if (currentStep === 'name') {
      // 이름 검증 적용
      const result = validateName(formData.name);
      if (!result.success) {
        setNameError(result.error || '');
        return;
      }
      setCurrentStep('carrier');
      setShowCarrierBottomSheet(true);
    } else if (currentStep === 'carrier') {
      // 통신사 검증 적용
      const result = validateCarrier(formData.carrier);
      if (!result.success) {
        alert(result.error || '통신사를 선택해주세요.');
        return;
      }
      setCurrentStep('phone');
    } else if (currentStep === 'phone') {
      // 휴대폰 번호 검증 적용
      const result = validatePhoneNumber(formData.phoneNumber);
      if (!result.success) {
        setPhoneError(result.error || '');
        return;
      }
      setCurrentStep('agreement');
    } else if (currentStep === 'agreement') {
      // 약관 동의 검증
      const allRequiredAgreed = formData.agreeTerms && formData.agreePrivacy;
      if (!allRequiredAgreed) {
        alert('필수 약관에 동의해주세요.');
        return;
      }
      // 다음 페이지로 이동 (인증번호 입력 페이지)
      handleSubmit();
    } else if (currentStep === 'complete') {
      handleSubmit();
    }
  };

  // 이전 단계
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

  // 버튼 텍스트
  const getNextButtonText = () => {
    if (currentStep === 'agreement') {
      return '인증번호 받기';
    }
    return '다음';
  };

  // 버튼 비활성화 여부
  const isNextButtonDisabled = () => {
    if (currentStep === 'name') {
      return !formData.name.trim() || formData.name.trim().length < 2;
    } else if (currentStep === 'carrier') {
      return !formData.carrier;
    } else if (currentStep === 'phone') {
      return formData.phoneNumber.length < 10;
    } else if (currentStep === 'agreement' || currentStep === 'complete') {
      return !(formData.agreeTerms && formData.agreePrivacy);
    }
    return true;
  };

  return {
    // 상태
    formData,
    currentStep,
    nameError,
    phoneError,
    showCarrierBottomSheet,
    showTermsModal,

    // 상태 변경
    setShowCarrierBottomSheet,
    setShowTermsModal,

    // 핸들러
    handleNameChange,
    handleNameBlur,
    handleCarrierSelect,
    handlePhoneChange,
    handleAllAgree,
    handleAgreeChange,
    handleNext,
    handleCancel,

    // 유틸
    formatPhoneNumber,
    getNextButtonText,
    isNextButtonDisabled,

    // 계산된 값
    allRequiredAgreed: formData.agreeTerms && formData.agreePrivacy,
    allAgree: formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing,
  };
}
