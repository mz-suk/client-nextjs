import { type z } from 'zod';

import * as schemas from '../schemas';

type ValidationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * 공통 검증 로직을 담당하는 제네릭 함수
 */
const createValidator =
  <T>(schema: z.ZodSchema<T>) =>
  (data: unknown): ValidationResult<T> => {
    const result = schema.safeParse(data);

    if (!result.success) {
      // 첫 번째 에러 메시지만 추출
      return {
        success: false,
        error: result.error.issues[0]?.message || '알 수 없는 오류가 발생했습니다.',
      };
    }

    return { success: true, data: result.data };
  };

// 이름 검증
export const validateName = (name: string) => createValidator(schemas.nameSchema)({ name });

// 통신사 검증
export const validateCarrier = (carrier: string) => createValidator(schemas.carrierSchema)({ carrier });

// 휴대폰 번호 검증
export const validatePhoneNumber = (phoneNumber: string) => createValidator(schemas.phoneSchema)({ phoneNumber });

// 약관 동의 검증
export const validateAgreement = (agreeTerms: boolean, agreePrivacy: boolean, agreeMarketing?: boolean) =>
  createValidator(schemas.agreementSchema)({ agreeTerms, agreePrivacy, agreeMarketing });

// 본인인증 전체 검증
export const validateVerification = (data: schemas.VerificationFormData) => createValidator(schemas.verificationSchema)(data);

// 인증번호 검증
export const validateAuthCode = (verificationCode: string) => createValidator(schemas.authCodeSchema)({ verificationCode });

// 아이디 검증
export const validateUserId = (userId: string) => createValidator(schemas.userIdSchema)({ userId });

// 계정 정보 검증
export const validateAccount = (data: schemas.AccountFormData) => createValidator(schemas.accountSchema)(data);

// 알러지 검증
export const validateAllergies = (allergies: string[]) => createValidator(schemas.allergiesSchema)({ allergies });

// 성별 검증
export const validateGender = (gender: string) => createValidator(schemas.genderSchema)({ gender });

// 생활패턴 검증
export const validateLifestyle = (lifestyle: string[]) => createValidator(schemas.lifestyleSchema)({ lifestyle });
