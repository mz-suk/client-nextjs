'use client';

import { useJoinStore } from '@/domains/join';
import { Input, JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';

const AUTH_TIME_LIMIT = 180; // 3분

export default function JoinAuthCodePage() {
  const router = useRouter();
  const { formData, setFormData, goToStep } = useJoinStore();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(AUTH_TIME_LIMIT);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 타이머 시작
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResending]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
      setError('');
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setCode('');
    setError('');
    setTimeLeft(AUTH_TIME_LIMIT);

    // 인증번호 재발송 API 호출 (Mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsResending(false);
    alert('인증번호가 재발송되었습니다.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError('6자리 인증번호를 입력해주세요.');
      return;
    }

    if (timeLeft === 0) {
      setError('인증 시간이 만료되었습니다. 인증번호를 재발송해주세요.');
      return;
    }

    // 인증번호 확인 API 호출 (Mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 임시로 123456을 정답으로 설정
    if (code === '123456') {
      setFormData({ verificationCode: code, isVerified: true });
      goToStep('auth-complete');
      router.push('/join/auth-complete');
    } else {
      setError('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <JoinLayout title="본인인증" showProgress currentStep={3} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            문자로 받은
            <br />
            인증번호를 입력해주세요
          </h2>
          <p className={styles.description}>
            {formData.phoneNumber && `${formData.phoneNumber.slice(0, 3)}-${formData.phoneNumber.slice(3, 7)}-${formData.phoneNumber.slice(7)}`}
            <br />로 인증번호가 발송되었습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <Input
              label="인증번호"
              type="text"
              inputMode="numeric"
              value={code}
              onChange={handleCodeChange}
              placeholder="6자리 숫자 입력"
              error={error}
              autoFocus
            />
            {timeLeft > 0 && <div className={styles.timer}>{formatTime(timeLeft)}</div>}
          </div>

          <button type="button" className={styles.resendButton} onClick={handleResend} disabled={isResending}>
            {isResending ? '재발송 중...' : '인증번호 재발송'}
          </button>

          <Button type="submit" variant="default" size="lg" disabled={code.length !== 6 || timeLeft === 0} className={styles.submitButton}>
            인증하기
          </Button>
        </form>

        <div className={styles.hint}>
          <p>💡 테스트용 인증번호: 123456</p>
        </div>
      </div>
    </JoinLayout>
  );
}
