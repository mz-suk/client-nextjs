import { PrefetchBoundary } from '@core/lib';
import { ExampleLayout, InfoBox, postApi, PostListCard, PostListGrid, PostListSuspense, postQueries } from '@domains/example';

/**
 * SSG + CSR 하이브리드 예제 (프로덕션 권장 패턴)
 *
 * 동작 흐름:
 * 1. 빌드 타임: 데이터를 prefetch(SSG)하여 데이터가 포함된 HTML 생성
 * 2. 클라이언트 마운트: 데이터를 hydrate하여 React Query와 상호작용
 *
 * Next.js 16 + React 19 + TanStack Query v5 최신 패턴 적용:
 * - `PrefetchBoundary`를 사용하여 선언적으로 서버 데이터 프리패칭 처리
 * - 불필요한 보일러플레이트 코드 제거
 *
 * **실제 데이터 사용:**
 * - 모든 데이터는 JSONPlaceholder API에서 실시간으로 가져옴
 * - 동적 데이터: 전체 포스트 목록 (API 기반, Hydration)
 * - 정적 데이터: 처음 10개 포스트 (generateStaticParams로 빌드 시점 생성)
 */
export default async function SSGPage() {
  // 빌드 타임에 실제 API를 호출하여 SSG용 데이터 가져오기
  // 전체 100개 중 처음 10개만 SSG로 생성 (빌드 성능 최적화)
  const allPosts = await postApi.getPosts();
  const ssgPosts = allPosts.slice(0, 10);

  return (
    <ExampleLayout
      title="SSG + CSR 데이터 패칭"
      description="빌드 시점에 데이터를 미리 가져오고(SSG) 클라이언트에서 hydrate합니다. SEO가 필요한 공개 페이지에 가장 적합한 패턴입니다."
      tip="개발자 도구의 Network 탭을 확인해보세요. 초기 HTML에 이미 데이터가 포함되어 있습니다."
    >
      {/* 동적 데이터 (API 기반) */}
      <section>
        <h2>동적 데이터 (API 기반)</h2>
        <InfoBox type="info">JSONPlaceholder API에서 가져온 데이터입니다. 빌드 시점에 prefetch되어 클라이언트에서 hydrate됩니다.</InfoBox>
        <PrefetchBoundary queryOptions={postQueries.list()}>
          <PostListSuspense />
        </PrefetchBoundary>
      </section>

      {/* 정적 데이터 (generateStaticParams) */}
      <section style={{ marginTop: '3rem' }}>
        <h2>정적 데이터 (generateStaticParams)</h2>
        <InfoBox type="success">
          빌드 시점에 <code>generateStaticParams</code>로 생성된 정적 페이지들입니다. 각 카드를 클릭하면 미리 생성된 HTML 페이지로 이동합니다.
        </InfoBox>

        <PostListGrid>
          {ssgPosts.map(post => (
            <PostListCard key={post.id} id={String(post.id)} title={post.title} description={post.body} href={`/example/ssg/${post.id}`} badge="SSG" />
          ))}
        </PostListGrid>
      </section>

      {/* 설명 섹션 */}
      <section style={{ marginTop: '3rem' }}>
        <InfoBox type="warning">
          <strong>Static Export 모드 주의사항:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>
              <code>generateStaticParams</code>에 정의된 경로만 빌드 시점에 생성됩니다.
            </li>
            <li>
              <code>dynamicParams = false</code>로 설정하면 정의되지 않은 경로는 404 처리됩니다.
            </li>
            <li>API 데이터는 빌드 시점의 스냅샷이며, 클라이언트에서 실시간 업데이트가 가능합니다.</li>
            <li>
              <strong>실제 API 사용:</strong> 총 100개의 포스트 중 처음 10개만 SSG로 생성하여 빌드 성능을 최적화했습니다.
            </li>
          </ul>
        </InfoBox>
      </section>
    </ExampleLayout>
  );
}
