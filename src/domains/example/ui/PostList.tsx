'use client';

import { PostCard } from './PostCard';
import styles from './PostList.module.scss';
import { usePosts } from './usePosts';

export function PostList() {
  const { data: posts } = usePosts();

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
