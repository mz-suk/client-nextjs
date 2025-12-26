'use client';

import { PostCard } from './PostCard';
import styles from './PostList.module.scss';
import { usePosts } from './usePosts';

export function PostList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>게시글을 불러올 수 없습니다.</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>게시글이 없습니다.</div>
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
