'use client';

import { PostList } from '@domains/example';

/**
 * CSR (Client-Side Rendering) 데이터 패칭 예제
 *
 * 동작 방식:
 * 1. 서버에서는 데이터를 가져오지 않음 (빈 HTML 전송)
 * 2. 클라이언트에서 마운트 후 데이터 페칭 시작
 * 3. 전역 로딩이 자동으로 표시됨
 * 4. TanStack Query의 캐싱 정책에 따라 동작
 *
 * 장점:
 * - 서버 부하 감소
 * - 빠른 초기 페이지 로드
 * - 실시간 데이터 업데이트에 적합
 *
 * 단점:
 * - SEO 불리
 * - 초기 콘텐츠 표시 지연
 */
export default function CSRPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>CSR Data Fetching</h1>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
          클라이언트에서만 데이터를 가져옵니다.
          <br />
          페이지 로드 후 전역 로딩이 표시되고, 데이터를 가져온 후 렌더링됩니다.
        </p>
      </header>

      <div style={{ marginBottom: '24px', padding: '16px', background: '#fef3c7', borderRadius: '8px' }}>
        <strong>💡 Tip:</strong> 네트워크 탭에서 &quot;Slow 3G&quot;로 설정하면 전역 로딩을 더 명확하게 확인할 수 있습니다.
      </div>

      <PostList />
    </div>
  );
}
