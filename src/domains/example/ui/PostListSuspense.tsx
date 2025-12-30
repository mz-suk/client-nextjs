'use client';

import { PostCard } from './PostCard';
import styles from './PostList.module.scss';
import { useSuspensePosts } from './usePosts';

/**
 * Suspense를 사용하는 게시글 목록 컴포넌트
 * SSG/SSR에서 prefetch된 데이터를 hydrate하여 사용하거나,
 * CSR에서 Suspense와 함께 사용
 */
export function PostListSuspense() {
  const { data: posts } = useSuspensePosts();

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.messageContainer}>게시글이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
