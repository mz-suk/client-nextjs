'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useJoinStore } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import { FormInput } from '@/domains/join/components/FormInput';

import styles from './page.module.scss';

const accountSchema = z
  .object({
    userId: z
      .string()
      .min(4, '아이디는 4자 이상이어야 합니다')
      .regex(/^[a-z0-9_]+$/, '영문 소문자, 숫자, _만 입력 가능합니다'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

type AccountFormData = z.infer<typeof accountSchema>;

export default function JoinAccountPage() {
  const router = useRouter();
  const { setFormData, goToStep } = useJoinStore();

  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
  const [userIdCheckMessage, setUserIdCheckMessage] = useState('');

  const { control, handleSubmit, watch, setError, formState } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      userId: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const userId = watch('userId');
  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');
  const { isValid } = formState;

  const checkUserIdAvailability = async () => {
    if (!userId || userId.length < 4) {
      setUserIdCheckMessage('');
      return;
    }

    setIsCheckingUserId(true);
    setUserIdCheckMessage('');

    // 중복 체크 API 호출 (Mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 임시로 "admin"만 중복으로 설정
    if (userId === 'admin') {
      setError('userId', { message: '이미 사용 중인 아이디입니다.' });
      setIsUserIdAvailable(false);
      setUserIdCheckMessage('');
    } else {
      setIsUserIdAvailable(true);
      setUserIdCheckMessage('✓ 사용 가능한 아이디입니다');
    }

    setIsCheckingUserId(false);
  };

  const onSubmit = (data: AccountFormData) => {
    if (!isUserIdAvailable) {
      setError('userId', { message: '아이디 중복 확인을 해주세요.' });
      return;
    }

    setFormData({ userId: data.userId });
    goToStep('join-complete');
    router.push('/join/complete');
  };

  // 모든 필드가 유효하면 자동으로 제출
  useEffect(() => {
    if (isValid && isUserIdAvailable && userId && password && passwordConfirm) {
      const data: AccountFormData = {
        userId,
        password,
        passwordConfirm,
      };

      // 약간의 딜레이를 주어 사용자가 입력을 완료했음을 인지하도록
      const timer = setTimeout(() => {
        onSubmit(data);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isValid, isUserIdAvailable, userId, password, passwordConfirm]);

  return (
    <JoinLayout title="아이디 설정" showProgress currentStep={5}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            사용하실 아이디를
            <br />
            입력해 주세요
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.section}>
            <FormInput
              name="userId"
              control={control}
              label="아이디"
              type="text"
              placeholder="4자 이상 (영문, 숫자, _)"
              description={userIdCheckMessage}
              onChange={value => {
                const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                if (value !== sanitized) {
                  return;
                }
                setIsUserIdAvailable(false);
                setUserIdCheckMessage('');
              }}
              autoFocus
            >
              <button
                type="button"
                onClick={checkUserIdAvailability}
                disabled={!userId || userId.length < 4 || isCheckingUserId}
                className={styles.checkButton}
              >
                {isCheckingUserId ? '확인 중' : '중복 확인'}
              </button>
            </FormInput>
          </div>

          <div className={styles.section}>
            <FormInput name="password" control={control} label="패스워드" type="password" placeholder="8자 이상 (영문, 숫자 포함)" />
          </div>

          <div className={styles.section}>
            <FormInput name="passwordConfirm" control={control} label="패스워드 확인" type="password" placeholder="패스워드를 한번 더 입력해주세요" />
          </div>
        </form>
      </div>
    </JoinLayout>
  );
}
