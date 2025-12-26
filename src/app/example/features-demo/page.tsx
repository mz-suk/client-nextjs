'use client';

import { postQueries } from '@domains/example';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { ExampleLayout, InfoBox } from '../_components';
import styles from './page.module.scss';

/**
 * 전역 기능 테스트 페이지
 * - 전역 로딩 (GlobalLoading)
 * - 전역 에러 처리 (GlobalErrorHandler)
 */
export default function FeaturesDemoPage() {
  const [tab, setTab] = useState<'loading' | 'error'>('loading');

  return (
    <ExampleLayout
      title="전역 기능 테스트"
      description="GlobalLoading과 GlobalErrorHandler의 동작을 확인할 수 있습니다."
      tip='네트워크 탭에서 "Slow 3G"로 설정하면 더 명확하게 확인할 수 있습니다.'
    >
      {/* 탭 */}
      <div className={styles.tabs}>
        <button onClick={() => setTab('loading')} className={`${styles.tab} ${tab === 'loading' ? styles.active : ''}`}>
          전역 로딩
        </button>
        <button onClick={() => setTab('error')} className={`${styles.tab} ${tab === 'error' ? styles.active : ''}`}>
          전역 에러
        </button>
      </div>

      {tab === 'loading' ? <LoadingDemo /> : <ErrorDemo />}
    </ExampleLayout>
  );
}

function LoadingDemo() {
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    ...postQueries.list(),
    enabled,
  });

  return (
    <>
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>GlobalLoading은 useIsFetching()과 useIsMutating()을 감지합니다.</li>
          <li>클라이언트에서 새로운 데이터를 가져올 때만 표시됩니다.</li>
          <li>SSG/SSR로 prefetch된 데이터는 이미 캐시에 있어 로딩이 표시되지 않습니다.</li>
          <li>네트워크 속도가 빠르면 로딩이 순간적으로 지나갈 수 있습니다.</li>
        </ul>
      </InfoBox>

      <div className={styles.buttonGroup}>
        <button onClick={() => setEnabled(true)} disabled={enabled} className={`${styles.button} ${styles.primary}`}>
          데이터 가져오기 (첫 로딩)
        </button>

        <button onClick={() => refetch()} disabled={!data} className={`${styles.button} ${styles.success}`}>
          다시 가져오기 (Refetch)
        </button>
      </div>

      {isLoading && <div className={`${styles.statusBox} ${styles.loading}`}>⏳ 로컬 로딩 상태: 데이터를 가져오는 중... (동시에 전역 로딩도 표시됩니다)</div>}

      {data && <div className={`${styles.statusBox} ${styles.success}`}>✅ 데이터 로드 완료: {data.length}개의 게시글</div>}

      <InfoBox title="🎯 테스트 방법" variant="info">
        <ol>
          <li>1. &quot;데이터 가져오기&quot; 버튼 클릭</li>
          <li>2. 화면 전체가 dim 처리되고 중앙에 로딩 스피너가 표시됩니다</li>
          <li>3. &quot;다시 가져오기&quot; 버튼으로 refetch 시에도 동일하게 동작합니다</li>
        </ol>
      </InfoBox>
    </>
  );
}

function ErrorDemo() {
  return (
    <>
      <InfoBox title="💡 동작 원리">
        <ul>
          <li>GlobalErrorHandler가 React Query의 모든 에러를 자동 감지합니다.</li>
          <li>우측 하단에 토스트 형태로 에러 메시지를 표시합니다.</li>
          <li>ApiError 타입을 감지하여 적절한 메시지를 표시합니다.</li>
          <li>5초 후 자동으로 사라지거나 수동으로 닫을 수 있습니다.</li>
        </ul>
      </InfoBox>

      <div className={styles.sectionGroup}>
        <section className={styles.section}>
          <h3>1. 404 에러 (Not Found)</h3>
          <ErrorTrigger errorType="404" />
        </section>

        <section className={styles.section}>
          <h3>2. 네트워크 에러</h3>
          <ErrorTrigger errorType="network" />
        </section>
      </div>

      <InfoBox title="🎯 테스트 방법" variant="info">
        <ol>
          <li>1. 각 섹션의 &quot;에러 발생시키기&quot; 버튼 클릭</li>
          <li>2. 우측 하단에 에러 토스트가 표시되는 것을 확인</li>
          <li>3. &quot;재시도&quot; 또는 &quot;닫기&quot; 버튼으로 토스트 제어</li>
          <li>4. 5초 후 자동으로 사라지는 것을 확인</li>
        </ol>
      </InfoBox>
    </>
  );
}

function ErrorTrigger({ errorType }: { errorType: '404' | 'network' }) {
  const [enabled, setEnabled] = useState(false);

  // 에러 발생 시뮬레이션을 위한 쿼리
  // retry: false 설정으로 즉시 에러 발생 유도
  const { isLoading, isError } = useQuery({
    queryKey: ['error-demo', errorType, enabled],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (errorType === 'network') {
        throw new Error('네트워크 연결에 실패했습니다');
      }

      // 존재하지 않는 리소스 요청 (404)
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/999999`);
      if (!response.ok) {
        throw new Error('요청한 리소스를 찾을 수 없습니다 (404)');
      }
      return response.json();
    },
    enabled,
    retry: false,
  });

  if (!enabled) {
    return (
      <button onClick={() => setEnabled(true)} className={`${styles.button} ${styles.danger}`}>
        에러 발생시키기
      </button>
    );
  }

  if (isLoading) {
    return <div className={`${styles.statusBox} ${styles.loading}`}>로딩 중...</div>;
  }

  if (isError) {
    return <div className={`${styles.statusBox} ${styles.error}`}>에러가 발생했습니다. 우측 하단의 토스트를 확인하세요.</div>;
  }

  return <div className={`${styles.statusBox} ${styles.success}`}>✅ 성공</div>;
}
