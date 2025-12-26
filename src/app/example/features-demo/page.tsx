'use client';

import { postQueries } from '@domains/example';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { ExampleLayout, InfoBox } from '../_components';

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
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '2px solid #e5e7eb' }}>
        <button
          onClick={() => setTab('loading')}
          style={{
            padding: '12px 24px',
            background: tab === 'loading' ? '#3b82f6' : 'transparent',
            color: tab === 'loading' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: tab === 'loading' ? '2px solid #3b82f6' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          전역 로딩
        </button>
        <button
          onClick={() => setTab('error')}
          style={{
            padding: '12px 24px',
            background: tab === 'error' ? '#3b82f6' : 'transparent',
            color: tab === 'error' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: tab === 'error' ? '2px solid #3b82f6' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
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

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button
          onClick={() => setEnabled(true)}
          disabled={enabled}
          style={{
            padding: '12px 24px',
            background: enabled ? '#d1d5db' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: enabled ? 'not-allowed' : 'pointer',
          }}
        >
          데이터 가져오기 (첫 로딩)
        </button>

        <button
          onClick={() => refetch()}
          disabled={!data}
          style={{
            padding: '12px 24px',
            background: !data ? '#d1d5db' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: !data ? 'not-allowed' : 'pointer',
          }}
        >
          다시 가져오기 (Refetch)
        </button>
      </div>

      {isLoading && (
        <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '8px', marginBottom: '20px' }}>
          ⏳ 로컬 로딩 상태: 데이터를 가져오는 중... (동시에 전역 로딩도 표시됩니다)
        </div>
      )}

      {data && <div style={{ padding: '20px', background: '#d1fae5', borderRadius: '8px' }}>✅ 데이터 로드 완료: {data.length}개의 게시글</div>}

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <section style={{ padding: '24px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>1. 404 에러 (Not Found)</h3>
          <ErrorTrigger errorType="404" />
        </section>

        <section style={{ padding: '24px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>2. 네트워크 에러</h3>
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

  const { isLoading, isError } = useQuery({
    queryKey: ['error-demo', errorType, enabled],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (errorType === 'network') {
        throw new Error('네트워크 연결에 실패했습니다');
      }

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
      <button
        onClick={() => setEnabled(true)}
        style={{
          padding: '12px 24px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        에러 발생시키기
      </button>
    );
  }

  if (isLoading) {
    return <div style={{ color: '#6b7280' }}>로딩 중...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: '12px', background: '#fee2e2', borderRadius: '6px', color: '#991b1b' }}>에러가 발생했습니다. 우측 하단의 토스트를 확인하세요.</div>
    );
  }

  return <div style={{ color: '#059669' }}>✅ 성공</div>;
}
