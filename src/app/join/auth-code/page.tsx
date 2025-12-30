'use client';

import { useJoinStore } from '@domains/join';
import { JoinLayout } from '@domains/join/components';
import { Button } from '@domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './page.module.scss';

const AUTH_TIME_LIMIT = 180; // 3분

export default function JoinAuthCodePage() {
  const router = useRouter();
  const { formData, setFormData, goToStep } = useJoinStore();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(AUTH_TIME_LIMIT);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      // 입력이 6자리 모두 채워지면 자동 검증
      if (value.length === 6) {
        void verifyCode(value);
      }
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setCode('');
    setError('');
    setTimeLeft(AUTH_TIME_LIMIT);
    // 입력 위치를 처음으로 포커스
    inputRef.current?.focus();

    // 인증번호 재발송 API 호출 (Mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsResending(false);
    alert('인증번호가 재발송되었습니다.');
  };

  const verifyCode = useCallback(
    async (codeToVerify: string) => {
      if (isVerifying) return;
      setIsVerifying(true);

      // 시간 만료 시 검증 중단
      if (timeLeft === 0) {
        setError('인증 시간이 만료되었습니다. 인증번호를 재발송해주세요.');
        setIsVerifying(false);
        return;
      }

      // 인증번호 확인 API 호출 (Mock)
      await new Promise(resolve => setTimeout(resolve, 300)); // UX 지연 최소화

      if (codeToVerify === '123456') {
        setFormData({ verificationCode: codeToVerify, isVerified: true });
        goToStep('auth-complete');
        router.push('/join/auth-complete');
      } else {
        setError('인증번호가 일치하지 않습니다.');
      }

      setIsVerifying(false);
    },
    [goToStep, router, setFormData, timeLeft, isVerifying]
  );

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

    await verifyCode(code);
  };

  const digits = Array.from({ length: 6 }, (_, idx) => code[idx] ?? '');

  const handleCodeContainerClick = () => {
    // 사용자가 다시 입력하려고 눌렀을 때 기존 값 초기화 후 포커스
    if (code) {
      setCode('');
      setError('');
    }
    inputRef.current?.focus();
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
          <p className={styles.timer}>남은 시간 {formatTime(timeLeft)}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <div className={styles.codeInputGroup} onClick={handleCodeContainerClick}>
              {digits.map((digit, idx) => (
                <div key={idx} className={`${styles.digit} ${digit ? styles.filled : ''} ${idx === code.length ? styles.active : ''}`}>
                  {digit}
                </div>
              ))}
              <input
                ref={inputRef}
                className={styles.hiddenInput}
                type="tel"
                inputMode="numeric"
                autoFocus
                autoComplete="one-time-code"
                aria-label="인증번호 입력"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
              />
            </div>
          </div>

          <Button type="button" className={styles.submitButton} onClick={handleResend} disabled={isResending}>
            문자 다시 받기
          </Button>
        </form>

        <div className={styles.hint}>
          <p>💡 테스트용 인증번호: 123456</p>
        </div>
      </div>
    </JoinLayout>
  );
}
