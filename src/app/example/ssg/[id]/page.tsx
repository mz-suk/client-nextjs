import { DetailCard, LinkButton, type Post, postApi } from '@domains/example';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * SSG 동적 라우트 상세 페이지
 *
 * generateStaticParams를 사용하여 빌드 시점에 정적 경로를 생성합니다.
 * Next.js 16 + Static Export 최적화 패턴
 *
 * **실제 데이터 사용:**
 * - JSONPlaceholder API에서 빌드 타임에 데이터를 가져와 정적 HTML 생성
 * - 총 100개의 포스트 중 처음 10개만 SSG로 생성 (성능 최적화)
 */

/**
 * 정적 경로 생성 (빌드 타임)
 *
 * 이 함수는 빌드 시점에 실행되어 미리 생성할 경로 목록을 반환합니다.
 * Static Export 모드에서는 이 함수가 반환하는 경로만 HTML로 생성됩니다.
 */
export async function generateStaticParams() {
  // 빌드 시점에 실제 API를 호출하여 포스트 목록 가져오기
  // 전체 100개 중 처음 10개만 SSG로 생성 (빌드 성능 최적화)
  const posts = await postApi.getPosts();
  const limitedPosts = posts.slice(0, 10);

  // URL 파라미터용으로 id를 string으로 변환
  return limitedPosts.map(post => ({
    id: String(post.id),
  }));
}

/**
 * 동적 파라미터 처리 전략
 *
 * - dynamicParams = false (권장): generateStaticParams에 없는 경로는 404 처리
 * - dynamicParams = true (기본값): 런타임에 동적 생성 시도 (Static Export에서는 동작 안 함)
 */
export const dynamicParams = false;

/**
 * 페이지 컴포넌트
 */
export default async function SSGDetailPage({ params }: PageProps) {
  const { id } = await params;

  // URL 파라미터(string)를 number로 변환
  const postId = parseInt(id, 10);

  // 유효성 검증
  if (isNaN(postId) || postId < 1) {
    notFound();
  }

  // 빌드 타임에 실제 API를 호출하여 데이터 가져오기
  let post: Post;
  try {
    post = await postApi.getPost(postId);
  } catch (error) {
    console.error(`Failed to fetch post ${postId}:`, error);
    notFound();
  }

  return (
    <DetailCard
      title={post.title}
      description={`Post #${post.id} by User ${post.userId}`}
      meta={
        <>
          <span className="badge">SSG</span>
          <span>•</span>
          <span>실제 API 데이터</span>
        </>
      }
      content={<p>{post.body}</p>}
      footer={
        <LinkButton href="/example/ssg" variant="secondary" icon="←" iconPosition="left">
          목록으로 돌아가기
        </LinkButton>
      }
    />
  );
}
