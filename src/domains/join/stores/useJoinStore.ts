import { create } from 'zustand';

import type { JoinFormData, JoinStep } from '../types';

interface JoinStore {
  formData: JoinFormData;
  currentStep: JoinStep;
  historyStack: JoinStep[];
  previousProgress: number; // 이전 프로그레스 값 저장

  // Actions
  setFormData: (data: Partial<JoinFormData>) => void;
  setOnboardingData: (data: Partial<JoinFormData['onboarding']>) => void;
  goToStep: (step: JoinStep) => void;
  goBack: () => JoinStep | null;
  resetForm: () => void;
  canGoBack: () => boolean;
  setPreviousProgress: (progress: number) => void; // 프로그레스 저장 함수
}

const initialFormData: JoinFormData = {
  name: '',
  carrier: '',
  phoneNumber: '',
  agreeTerms: false,
  agreePrivacy: false,
  agreeMarketing: false,
  verificationCode: '',
  isVerified: false,
  userId: '',
  password: '',
  referralCode: '',
  onboarding: {
    groupInfo: [],
    allergies: [],
    gender: '',
    lifestyle: [],
    isCompleted: false,
  },
};

export const useJoinStore = create<JoinStore>((set, get) => ({
  formData: initialFormData,
  currentStep: 'name',
  historyStack: [],
  previousProgress: 0,

  setFormData: data =>
    set(state => ({
      formData: { ...state.formData, ...data },
    })),

  setOnboardingData: data =>
    set(state => ({
      formData: {
        ...state.formData,
        onboarding: { ...state.formData.onboarding, ...data },
      },
    })),

  goToStep: step =>
    set(state => ({
      currentStep: step,
      historyStack: [...state.historyStack, state.currentStep],
    })),

  goBack: (): JoinStep | null => {
    const { historyStack } = get();
    if (historyStack.length === 0) return null;

    const previousStep = historyStack[historyStack.length - 1];
    if (!previousStep) return null;

    set({
      currentStep: previousStep,
      historyStack: historyStack.slice(0, -1),
    });

    return previousStep;
  },

  canGoBack: () => {
    const { historyStack } = get();
    return historyStack.length > 0;
  },

  setPreviousProgress: progress => set({ previousProgress: progress }),

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 'name',
      historyStack: [],
      previousProgress: 0,
    }),
}));
