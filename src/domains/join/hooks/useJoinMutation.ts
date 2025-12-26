import { logger } from '@core/lib';
import { useMutation } from '@tanstack/react-query';

import * as joinService from '../services/joinService';
import { useJoinStore } from '../stores/useJoinStore';

/**
 * 본인인증 요청 훅
 */
export function useRequestVerification() {
  const { formData } = useJoinStore();

  return useMutation({
    mutationFn: () =>
      joinService.requestVerification({
        name: formData.name,
        carrier: formData.carrier,
        phoneNumber: formData.phoneNumber,
      }),
    onSuccess: () => {
      // 본인인증 요청 성공
    },
    onError: error => {
      logger.error('본인인증 요청 실패:', error);
    },
  });
}

/**
 * 본인인증 확인 훅
 */
export function useConfirmVerification() {
  const { setFormData } = useJoinStore();

  return useMutation({
    mutationFn: (data: { verificationId: string; verificationCode: string }) => joinService.confirmVerification(data),
    onSuccess: data => {
      if (data.isVerified) {
        setFormData({ isVerified: true });
      }
    },
    onError: error => {
      logger.error('본인인증 실패:', error);
    },
  });
}

/**
 * 회원가입 훅
 */
export function useCreateAccount() {
  const { formData, resetForm } = useJoinStore();

  return useMutation({
    mutationFn: () => joinService.createAccount(formData),
    onSuccess: () => {
      // 회원가입 완료 후 폼 초기화
      resetForm();
    },
    onError: error => {
      logger.error('회원가입 실패:', error);
    },
  });
}

/**
 * 아이디 중복 확인 훅
 */
export function useCheckUserId() {
  return useMutation({
    mutationFn: (userId: string) => joinService.checkUserIdAvailable(userId),
  });
}

/**
 * 추천인 코드 확인 훅
 */
export function useValidateReferralCode() {
  return useMutation({
    mutationFn: (code: string) => joinService.validateReferralCode(code),
  });
}
