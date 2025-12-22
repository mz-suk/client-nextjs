'use client';

import { useJoinStore } from '@/domains/join';
import { Input, JoinLayout } from '@/domains/join/components';
import { Button } from '@/domains/join/components/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.scss';

export default function JoinAccountPage() {
  const router = useRouter();
  const { formData, setFormData, goToStep } = useJoinStore();

  const [userId, setUserId] = useState(formData.userId);
  const [referralCode, setReferralCode] = useState(formData.referralCode);
  const [userIdError, setUserIdError] = useState('');
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUserId(value);
    setUserIdError('');
    setIsUserIdAvailable(false);
  };

  const checkUserIdAvailability = async () => {
    if (!userId) {
      setUserIdError('아이디를 입력해주세요.');
      return;
    }

    if (userId.length < 4) {
      setUserIdError('아이디는 4자 이상이어야 합니다.');
      return;
    }

    setIsCheckingUserId(true);

    // 중복 체크 API 호출 (Mock)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 임시로 "admin"만 중복으로 설정
    if (userId === 'admin') {
      setUserIdError('이미 사용 중인 아이디입니다.');
      setIsUserIdAvailable(false);
    } else {
      setUserIdError('');
      setIsUserIdAvailable(true);
      alert('사용 가능한 아이디입니다!');
    }

    setIsCheckingUserId(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUserIdAvailable) {
      setUserIdError('아이디 중복 확인을 해주세요.');
      return;
    }

    setFormData({ userId, referralCode });
    goToStep('join-complete');
    router.push('/join/complete');
  };

  return (
    <JoinLayout title="계정 정보" showProgress currentStep={5} totalStep={10}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            사용할 아이디를
            <br />
            입력해주세요
          </h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <div className={styles.inputWithButton}>
              <Input
                label="아이디"
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                placeholder="4자 이상 (영문, 숫자, _)"
                error={userIdError}
                helperText={isUserIdAvailable ? '✓ 사용 가능한 아이디입니다' : undefined}
                autoFocus
              />
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={checkUserIdAvailability}
                disabled={!userId || userId.length < 4 || isCheckingUserId}
                className={styles.checkButton}
              >
                {isCheckingUserId ? '확인 중...' : '중복 확인'}
              </Button>
            </div>
          </div>

          <div className={styles.section}>
            <Input
              label="추천인 코드 (선택)"
              type="text"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value.toUpperCase())}
              placeholder="추천인 코드 입력"
              helperText="추천인 코드가 있다면 입력해주세요"
            />
          </div>

          <Button type="submit" variant="default" size="lg" disabled={!isUserIdAvailable} className={styles.submitButton}>
            다음
          </Button>
        </form>
      </div>
    </JoinLayout>
  );
}
