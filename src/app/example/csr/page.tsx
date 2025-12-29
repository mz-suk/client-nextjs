'use client';

import { PostList } from '@domains/example';

import { ExampleLayout } from '../_components';

/**
 * CSR (Client-Side Rendering) 데이터 패칭 예제
 *
 * 사용 사례:
 * - 실시간 데이터 (예: 주식 시세, 채팅)
 * - 사용자별 개인화 데이터 (예: 대시보드, 마이페이지)
 * - SEO가 중요하지 않은 프라이빗 경로
 */
export default function CSRPage() {
  return (
    <ExampleLayout
      title="CSR 데이터 패칭"
      description="클라이언트 사이드에서만 데이터를 가져옵니다. 실시간성이나 보안이 필요한 데이터에 적합합니다."
      tip='네트워크 탭에서 "Slow 3G"로 설정하면 전역 로딩 상태를 명확하게 확인할 수 있습니다.'
    >
      <PostList />
    </ExampleLayout>
  );
}
