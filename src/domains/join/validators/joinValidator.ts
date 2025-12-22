import { z } from 'zod';
import * as schemas from '../schemas';

type ValidationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 이름 검증
export const validateName = (name: string): ValidationResult<schemas.NameFormData> => {
  try {
    const data = schemas.nameSchema.parse({ name });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 통신사 검증
export const validateCarrier = (carrier: string): ValidationResult<schemas.CarrierFormData> => {
  try {
    const data = schemas.carrierSchema.parse({ carrier });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 휴대폰 번호 검증
export const validatePhone = (phoneNumber: string): ValidationResult<schemas.PhoneFormData> => {
  try {
    const data = schemas.phoneSchema.parse({ phoneNumber });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 약관 동의 검증
export const validateAgreement = (agreeTerms: boolean, agreePrivacy: boolean, agreeMarketing?: boolean): ValidationResult<schemas.AgreementFormData> => {
  try {
    const data = schemas.agreementSchema.parse({ agreeTerms, agreePrivacy, agreeMarketing });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 본인인증 전체 검증
export const validateVerification = (data: schemas.VerificationFormData): ValidationResult<schemas.VerificationFormData> => {
  try {
    const validated = schemas.verificationSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 인증번호 검증
export const validateAuthCode = (verificationCode: string): ValidationResult<schemas.AuthCodeFormData> => {
  try {
    const data = schemas.authCodeSchema.parse({ verificationCode });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 아이디 검증
export const validateUserId = (userId: string): ValidationResult<schemas.UserIdFormData> => {
  try {
    const data = schemas.userIdSchema.parse({ userId });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 계정 정보 검증
export const validateAccount = (data: schemas.AccountFormData): ValidationResult<schemas.AccountFormData> => {
  try {
    const validated = schemas.accountSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 알러지 검증
export const validateAllergies = (allergies: string[]): ValidationResult<schemas.AllergiesFormData> => {
  try {
    const data = schemas.allergiesSchema.parse({ allergies });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 성별 검증
export const validateGender = (gender: string): ValidationResult<schemas.GenderFormData> => {
  try {
    const data = schemas.genderSchema.parse({ gender });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};

// 생활패턴 검증
export const validateLifestyle = (lifestyle: string[]): ValidationResult<schemas.LifestyleFormData> => {
  try {
    const data = schemas.lifestyleSchema.parse({ lifestyle });
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다.' };
  }
};
