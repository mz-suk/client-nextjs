import { apiClient } from '@/core/api';
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

/**
 * 본인인증 요청
 */
export async function requestVerification(data: { name: string; carrier: string; phoneNumber: string }): Promise<VerificationResponse> {
  const response = await apiClient.post<VerificationResponse>('/join/verify', data);
  return response.data;
}

/**
 * 본인인증 확인
 */
export async function confirmVerification(data: { verificationId: string; verificationCode: string }): Promise<VerificationConfirmResponse> {
  const response = await apiClient.post<VerificationConfirmResponse>('/join/verify/confirm', data);
  return response.data;
}

/**
 * 회원가입
 */
export async function createAccount(data: Partial<JoinFormData>): Promise<JoinResponse> {
  const response = await apiClient.post<JoinResponse>('/join/account', data);
  return response.data;
}

/**
 * 아이디 중복 확인
 */
export async function checkUserIdAvailable(userId: string): Promise<{ available: boolean }> {
  const response = await apiClient.get<{ available: boolean }>(`/join/check-userid?userId=${userId}`);
  return response.data;
}

/**
 * 추천인 코드 확인
 */
export async function validateReferralCode(code: string): Promise<{ valid: boolean; referrerName?: string }> {
  const response = await apiClient.get<{ valid: boolean; referrerName?: string }>(`/join/referral?code=${code}`);
  return response.data;
}
