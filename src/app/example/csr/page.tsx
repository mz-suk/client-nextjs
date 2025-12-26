'use client';

import { PostList } from '@domains/example';

import { ExampleLayout } from '../_components';

/**
 * CSR (Client-Side Rendering) 데이터 패칭 예제
 *
 * [동작 방식]
 * 1. 서버: 데이터 없이 기본 HTML(Shell)만 전송
 * 2. 클라이언트: JS 로드 후 React 마운트
 * 3. 클라이언트: useEffect 시점에 데이터 패칭 시작 (useQuery)
 * 4. 클라이언트: 로딩 -> 데이터 표시
 *
 * [특징]
 * - 'use client' 지시어 필수
 * - 초기 로딩 시점에 데이터가 없어 검색 엔진(SEO)에 불리할 수 있음
 * - 사용자 인터랙션이 많은 비공개 대시보드 등에 적합
 * - GlobalLoading이 자동으로 동작함 (useIsFetching 감지)
 */
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
