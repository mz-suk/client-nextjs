'use client';

import { Button } from '@/domains/join';
import { JoinLayout } from '@/domains/join/components';
import SucessCheckLottie from '@/shared/ui/lotties/SucessCheckLottie';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function OnboardingGroupCompletePage() {
  const router = useRouter();
  const mockData = [
    {
      name: '래미안',
      address: '강남 래미안 라클래시 106동',
      status: '완료',
    },
    {
      name: '레미안',
      address: '강남 레미안 라클래시 106동',
      status: '진행중',
    },
    {
      name: '레미안',
      address: '강남 레미안 라클래시 106동',
      status: '진행중',
    },
    {
      name: '레미안',
      address: '강남 레미안 라클래시 106동',
      status: '진행중',
    },
  ];

  return (
    <JoinLayout title="프로필 작성" showProgress currentStep={8}>
      <div className={styles.content}>
        <SucessCheckLottie />
        <p className={styles.subTitle}> {mockData.length}개 그룹</p>
        <h2 className={styles.title}>매칭이 완료 되었어요</h2>

        <div className={styles.line}></div>

        <ul className={styles.groupItemLists}>
          {mockData.map((group, idx) => (
            <li className={styles.groupItemList} key={idx}>
              <div className={styles.groupItem}>
                <img src="/img/frame.png" alt={group.name} />
                <div className={styles.groupItemTitle}>
                  <p>{group.name}</p>
                  <h2>{group.address}</h2>
                </div>
              </div>
              <label className={styles.groupItemStatus}>{group.status}</label>
            </li>
          ))}
        </ul>
      </div>

      <Button className={styles.button} variant="default" size="full" onClick={() => router.push('/join/onboarding/allergy')}>
        다음
      </Button>
    </JoinLayout>
  );
}
