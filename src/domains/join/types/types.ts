export interface JoinFormData {
  // Step 1: 이름
  name: string;

  // Step 2-4: 본인인증
  carrier: 'SKT' | 'KT' | 'LGU+' | '';
  phoneNumber: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;

  // Step 5: 인증번호
  verificationCode: string;
  isVerified: boolean;

  // Step 7-8: 계정 정보
  userId: string;
  referralCode: string;

  // Step 10: 프로필 (온보딩)
  onboarding: {
    groupInfo: string[]; // 그룹 정보
    allergies: string[]; // 알러지
    gender: 'male' | 'female' | 'other' | '';
    lifestyle: string[]; // 생활패턴
    isCompleted: boolean;
  };
}

export type JoinStep =
  | 'name' // 1. 이름
  | 'verify' // 2-4. 본인인증
  | 'auth-code' // 5. 인증번호
  | 'auth-complete' // 6. 인증완료
  | 'account' // 7-8. 계정정보
  | 'join-complete' // 9. 가입완료
  | 'onboarding-group' // 10-1. 그룹정보
  | 'onboarding-allergy' // 10-2. 알러지
  | 'onboarding-gender' // 10-3. 성별
  | 'onboarding-lifestyle' // 10-4. 생활패턴
  | 'onboarding-complete'; // 10-5. 온보딩완료

export const STEP_ROUTES: Record<JoinStep, string> = {
  name: '/join',
  verify: '/join/verify',
  'auth-code': '/join/auth-code',
  'auth-complete': '/join/auth-complete',
  account: '/join/account',
  'join-complete': '/join/complete',
  'onboarding-group': '/join/onboarding/group',
  'onboarding-allergy': '/join/onboarding/allergy',
  'onboarding-gender': '/join/onboarding/gender',
  'onboarding-lifestyle': '/join/onboarding/lifestyle',
  'onboarding-complete': '/join/onboarding/complete',
};
