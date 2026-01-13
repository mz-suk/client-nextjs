import { apiClient } from '@core/api';

import type { JoinFormData } from '../types';

export interface JoinResponse {
  success: boolean;
  userId?: string;
  message?: string;
}

export interface VerificationResponse {
  success: boolean;
  verificationId: string;
}

export interface VerificationConfirmResponse {
  success: boolean;
  isVerified: boolean;
}

export const requestVerification = async (data: { name: string; carrier: string; phoneNumber: string }): Promise<VerificationResponse> => {
  return apiClient.post<VerificationResponse>('/join/verify', data);
};

export const confirmVerification = async (data: { verificationId: string; verificationCode: string }): Promise<VerificationConfirmResponse> => {
  return apiClient.post<VerificationConfirmResponse>('/join/verify/confirm', data);
};

export const createAccount = async (data: Partial<JoinFormData>): Promise<JoinResponse> => {
  return apiClient.post<JoinResponse>('/join/account', data);
};

export const checkUserIdAvailable = async (userId: string): Promise<{ available: boolean }> => {
  return apiClient.get<{ available: boolean }>('/join/check-userid', { params: { userId } });
};

export const validateReferralCode = async (code: string): Promise<{ valid: boolean; referrerName?: string }> => {
  return apiClient.get<{ valid: boolean; referrerName?: string }>('/join/referral', { params: { code } });
};
