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
  const response = await apiClient.post<VerificationResponse>('/join/verify', data);
  return response.data;
};

export const confirmVerification = async (data: { verificationId: string; verificationCode: string }): Promise<VerificationConfirmResponse> => {
  const response = await apiClient.post<VerificationConfirmResponse>('/join/verify/confirm', data);
  return response.data;
};

export const createAccount = async (data: Partial<JoinFormData>): Promise<JoinResponse> => {
  const response = await apiClient.post<JoinResponse>('/join/account', data);
  return response.data;
};

export const checkUserIdAvailable = async (userId: string): Promise<{ available: boolean }> => {
  const response = await apiClient.get<{ available: boolean }>('/join/check-userid', { params: { userId } });
  return response.data;
};

export const validateReferralCode = async (code: string): Promise<{ valid: boolean; referrerName?: string }> => {
  const response = await apiClient.get<{ valid: boolean; referrerName?: string }>('/join/referral', { params: { code } });
  return response.data;
};
