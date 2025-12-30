'use client';

import { Suspense } from 'react';

import { PostCard } from './PostCard';
import styles from './PostList.module.scss';
import { useSuspensePosts } from './usePosts';

function PostListContent() {
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

function PostListSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>로딩 중...</div>
    </div>
  );
}

export function PostList() {
  return (
    <Suspense fallback={<PostListSkeleton />}>
      <PostListContent />
    </Suspense>
  );
}
