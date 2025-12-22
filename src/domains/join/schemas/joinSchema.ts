import { z } from 'zod';

// Step 1: 이름
export const nameSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상 입력해주세요.').max(50, '이름은 50자 이하로 입력해주세요.'),
});

// Step 2-4: 본인인증
export const carrierSchema = z.object({
  carrier: z.enum(['SKT', 'KT', 'LGU+'], {
    required_error: '통신사를 선택해주세요.',
  }),
});

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, '올바른 휴대폰 번호를 입력해주세요.')
    .max(11, '올바른 휴대폰 번호를 입력해주세요.')
    .regex(/^01[0-9]\d{7,8}$/, '올바른 휴대폰 번호 형식이 아닙니다.'),
});

export const agreementSchema = z.object({
  agreeTerms: z.boolean().refine(val => val === true, {
    message: '이용약관에 동의해주세요.',
  }),
  agreePrivacy: z.boolean().refine(val => val === true, {
    message: '개인정보 처리방침에 동의해주세요.',
  }),
  agreeMarketing: z.boolean().optional(),
});

export const verificationSchema = carrierSchema.merge(phoneSchema).merge(agreementSchema);

// Step 5: 인증번호
export const authCodeSchema = z.object({
  verificationCode: z
    .string()
    .length(6, '6자리 인증번호를 입력해주세요.')
    .regex(/^\d{6}$/, '숫자만 입력 가능합니다.'),
});

// Step 7: 아이디
export const userIdSchema = z.object({
  userId: z
    .string()
    .min(4, '아이디는 4자 이상이어야 합니다.')
    .max(20, '아이디는 20자 이하로 입력해주세요.')
    .regex(/^[a-z0-9_]+$/, '영문 소문자, 숫자, _만 사용 가능합니다.'),
});

// Step 8: 추천인 코드 (선택)
export const referralCodeSchema = z.object({
  referralCode: z.string().max(20, '추천인 코드는 20자 이하로 입력해주세요.').optional(),
});

export const accountSchema = userIdSchema.merge(referralCodeSchema);

// Step 10-1: 그룹 정보
export const groupInfoSchema = z.object({
  groupInfo: z.array(z.string()).min(0).max(10),
});

// Step 10-2: 알러지
export const allergiesSchema = z.object({
  allergies: z.array(z.string()).min(1, '최소 1개 이상 선택해주세요.'),
});

// Step 10-3: 성별
export const genderSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '성별을 선택해주세요.',
  }),
});

// Step 10-4: 생활패턴
export const lifestyleSchema = z.object({
  lifestyle: z.array(z.string()).min(1, '최소 1개 이상 선택해주세요.'),
});

// 온보딩 전체
export const onboardingSchema = z.object({
  groupInfo: z.array(z.string()),
  allergies: z.array(z.string()),
  gender: z.enum(['male', 'female', 'other', '']),
  lifestyle: z.array(z.string()),
  isCompleted: z.boolean(),
});

// 전체 회원가입 폼
export const joinFormSchema = z.object({
  name: z.string(),
  carrier: z.enum(['SKT', 'KT', 'LGU+', '']),
  phoneNumber: z.string(),
  agreeTerms: z.boolean(),
  agreePrivacy: z.boolean(),
  agreeMarketing: z.boolean(),
  verificationCode: z.string(),
  isVerified: z.boolean(),
  userId: z.string(),
  referralCode: z.string(),
  onboarding: onboardingSchema,
});

// 타입 추론
export type NameFormData = z.infer<typeof nameSchema>;
export type CarrierFormData = z.infer<typeof carrierSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type AgreementFormData = z.infer<typeof agreementSchema>;
export type VerificationFormData = z.infer<typeof verificationSchema>;
export type AuthCodeFormData = z.infer<typeof authCodeSchema>;
export type UserIdFormData = z.infer<typeof userIdSchema>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type GroupInfoFormData = z.infer<typeof groupInfoSchema>;
export type AllergiesFormData = z.infer<typeof allergiesSchema>;
export type GenderFormData = z.infer<typeof genderSchema>;
export type LifestyleFormData = z.infer<typeof lifestyleSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type JoinFormData = z.infer<typeof joinFormSchema>;
