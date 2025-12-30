'use client';

import type { Post } from '../model';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.body}>{post.body}</p>
      <div className={styles.meta}>
        <span className={styles.id}>#{post.id}</span>
        <span className={styles.userId}>User {post.userId}</span>
      </div>
    </article>
  );
}
