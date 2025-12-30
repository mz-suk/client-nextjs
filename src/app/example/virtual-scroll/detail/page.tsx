'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { ExampleLayout } from '../../_components';
import styles from './page.module.scss';

function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('id') || '0';

  return (
    <ExampleLayout title={`게시글 상세 #${postId}`} description="뒤로가기 시 목록의 스크롤 위치가 복원됩니다.">
      <div className={styles.container}>
        <article className={styles.content}>
          <header className={styles.header}>
            <span className={styles.badge}>Post #{postId}</span>
            <h1 className={styles.title}>게시글 상세 페이지</h1>
          </header>

          <div className={styles.description}>
            <p>이것은 {postId}번 게시글의 상세 페이지입니다.</p>
            <p>뒤로가기 시 목록의 스크롤 위치가 자동으로 복원됩니다.</p>
          </div>

          <section className={styles.infoBox} aria-labelledby="restore-mechanism">
            <h2 id="restore-mechanism" className={styles.infoTitle}>
              🔄 스크롤 위치 복원 메커니즘
            </h2>
            <ol>
              <li>
                <strong>저장:</strong> 아이템 클릭 시 인덱스와 데이터 길이를 Store에 저장
              </li>
              <li>
                <strong>이동:</strong> 상세 페이지로 네비게이션
              </li>
              <li>
                <strong>복원:</strong> 뒤로가기 시 필요한 페이지를 자동 로드 후 인덱스를 상단에 배치
              </li>
              <li>
                <strong>정리:</strong> 복원 완료 시 저장된 상태 정리
              </li>
            </ol>
          </section>

          <button type="button" onClick={() => router.back()} className={styles.backButton} aria-label="목록으로 돌아가기">
            ← 목록으로 돌아가기
          </button>
        </article>
      </div>
    </ExampleLayout>
  );
}

/**
 * Virtual Scroll 상세 페이지
 */
export default function VirtualScrollDetailPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loading} role="status" aria-live="polite">
          <p>로딩 중...</p>
        </div>
      }
    >
      <DetailContent />
    </Suspense>
  );
}
