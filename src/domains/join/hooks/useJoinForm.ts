import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type JoinPageFormData, joinPageSchema } from '../schemas';
import { useJoinStore } from '../stores/useJoinStore';
import type { JoinFormData, VerifyStep } from '../types';

export function useJoinForm() {
  const router = useRouter();
  const { formData, setFormData, goToStep } = useJoinStore();

  // UI 상태
  const [currentStep, setCurrentStep] = useState<VerifyStep>('name');
  const [showCarrierBottomSheet, setShowCarrierBottomSheet] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<JoinPageFormData>({
    resolver: zodResolver(joinPageSchema),
    mode: 'onChange',
    defaultValues: {
      name: formData.name || '',
      carrier: formData.carrier || '',
      phoneNumber: formData.phoneNumber || '',
      agreeTerms: formData.agreeTerms || false,
      agreePrivacy: formData.agreePrivacy || false,
      agreeMarketing: formData.agreeMarketing || false,
    },
  });

  const watchAllFields = watch();

  // 이름 입력 완료
  const handleNameBlur = async () => {
    const isValid = await trigger('name');
    if (isValid && watchAllFields.name.trim().length >= 2) {
      setTimeout(() => {
        setCurrentStep('carrier');
        setShowCarrierBottomSheet(true);
      }, 300);
    }
  };

  // 통신사 선택
  const handleCarrierSelect = (carrier: JoinFormData['carrier']) => {
    setValue('carrier', carrier, { shouldValidate: true });
    setShowCarrierBottomSheet(false);
    setTimeout(() => {
      setCurrentStep('phone');
    }, 300);
  };

  // 전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    if (value.length <= 3) return value;
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  };

  // 전화번호 입력 처리
  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length <= 11) {
      setValue('phoneNumber', cleaned, { shouldValidate: true });
    }
  };

  // 약관 전체 동의
  const handleAllAgree = (checked: boolean) => {
    setValue('agreeTerms', checked);
    setValue('agreePrivacy', checked);
    setValue('agreeMarketing', checked);
  };

  // 제출
  const onSubmit = (data: JoinPageFormData) => {
    // Zustand 스토어에 저장
    setFormData({
      name: data.name,
      carrier: data.carrier as JoinFormData['carrier'],
      phoneNumber: data.phoneNumber,
      agreeTerms: data.agreeTerms,
      agreePrivacy: data.agreePrivacy,
      agreeMarketing: data.agreeMarketing || false,
    });

    // 다음 페이지로 이동
    goToStep('auth-code');
    router.push('/join/auth-code');
  };

  // 다음 단계
  const handleNext = async () => {
    if (currentStep === 'name') {
      const isValid = await trigger('name');
      if (isValid) {
        setCurrentStep('carrier');
        setShowCarrierBottomSheet(true);
      }
    } else if (currentStep === 'carrier') {
      const isValid = await trigger('carrier');
      if (isValid) {
        setCurrentStep('phone');
      }
    } else if (currentStep === 'phone') {
      const isValid = await trigger('phoneNumber');
      if (isValid) {
        setCurrentStep('agreement');
      }
    } else if (currentStep === 'agreement') {
      const isValid = await trigger(['agreeTerms', 'agreePrivacy']);
      if (isValid) {
        handleSubmit(onSubmit)();
      }
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
    } else if (currentStep === 'agreement') {
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
      return !watchAllFields.name?.trim() || watchAllFields.name.trim().length < 2;
    } else if (currentStep === 'carrier') {
      return !watchAllFields.carrier;
    } else if (currentStep === 'phone') {
      return !watchAllFields.phoneNumber || watchAllFields.phoneNumber.length < 10;
    } else if (currentStep === 'agreement') {
      return !(watchAllFields.agreeTerms && watchAllFields.agreePrivacy);
    }
    return true;
  };

  return {
    // Form control
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,

    // 상태
    formData: watchAllFields,
    currentStep,
    showCarrierBottomSheet,
    showTermsModal,

    // 상태 변경
    setShowCarrierBottomSheet,
    setShowTermsModal,
    setValue,

    // 핸들러
    handleNameBlur,
    handleCarrierSelect,
    handlePhoneChange,
    handleAllAgree,
    handleNext,
    handleCancel,

    // 유틸
    formatPhoneNumber,
    getNextButtonText,
    isNextButtonDisabled,

    // 계산된 값
    allRequiredAgreed: watchAllFields.agreeTerms && watchAllFields.agreePrivacy,
    allAgree: watchAllFields.agreeTerms && watchAllFields.agreePrivacy && watchAllFields.agreeMarketing,
  };
}
