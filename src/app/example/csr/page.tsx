'use client';

import { PostList } from '@domains/example';

import { ExampleLayout } from '../_components';

export default function CSRPage() {
  return (
    <ExampleLayout
      title="CSR Data Fetching"
      description="클라이언트에서만 데이터를 가져옵니다. 페이지 진입 후 데이터를 패칭하므로 로딩 상태가 발생합니다."
      tip='브라우저 개발자 도구 Network 탭에서 "Slow 3G"로 설정하고 새로고침하면 로딩 과정을 명확히 볼 수 있습니다.'
    >
      <PostList />
    </ExampleLayout>
  );
}
