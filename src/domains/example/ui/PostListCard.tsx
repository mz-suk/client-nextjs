import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './PostListCard.module.scss';

interface PostListCardProps {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: ReactNode;
}

/**
 * 포스트 목록 카드 컴포넌트
 */
export function PostListCard({ title, description, href, badge }: PostListCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {badge && (
        <div className={styles.meta}>
          <span className={styles.badge}>{badge}</span>
        </div>
      )}
    </Link>
  );
}

interface PostListGridProps {
  children: ReactNode;
}

/**
 * 포스트 목록 그리드 컨테이너
 */
export function PostListGrid({ children }: PostListGridProps) {
  return <div className={styles.grid}>{children}</div>;
}
