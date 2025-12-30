'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ExampleLayout } from '../../_components';
import styles from './page.module.scss';

/**
 * 상세 페이지 컨텐츠
 */
function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('id') || '0';

  const handleBack = () => {
    router.back();
  };

  return (
    <ExampleLayout title={`게시글 상세 #${postId}`} description="뒤로가기 시 목록의 스크롤 위치가 복원됩니다.">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.badge}>Post #{postId}</span>
            <h1 className={styles.title}>게시글 상세 페이지</h1>
          </div>

          <div className={styles.description}>
            <p>이것은 {postId}번 게시글의 상세 페이지입니다.</p>
            <p>뒤로가기 버튼을 클릭하면 목록 페이지로 돌아가며, 이전 스크롤 위치가 자동으로 복원됩니다.</p>
          </div>

          <div className={styles.infoBox}>
            <h3>🔄 스크롤 위치 복원 메커니즘</h3>
            <ol>
              <li>
                <strong>저장:</strong> 아이템 클릭 시 해당 인덱스와 데이터 길이를 Store에 저장
              </li>
              <li>
                <strong>이동:</strong> 상세 페이지로 네비게이션
              </li>
              <li>
                <strong>복원:</strong> 뒤로가기 시 필요한 페이지를 자동 로드 후, 클릭한 인덱스를 리스트 상단에 배치
              </li>
              <li>
                <strong>정리:</strong> 복원 완료 시 저장된 상태를 정리
              </li>
            </ol>
          </div>

          <button onClick={handleBack} className={styles.backButton}>
            ← 목록으로 돌아가기
          </button>
        </div>
      </div>
    </ExampleLayout>
  );
}

/**
 * Virtual Scroll 상세 페이지
 *
 * useSearchParams를 사용하므로 Suspense 경계 필요
 */
export default function VirtualScrollDetailPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <p>로딩 중...</p>
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  );
}
