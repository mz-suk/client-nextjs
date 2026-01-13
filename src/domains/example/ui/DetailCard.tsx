import type { ReactNode } from 'react';

import styles from './DetailCard.module.scss';

interface DetailCardProps {
  title: string;
  description?: string;
  meta?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
}

/**
 * 상세 페이지용 카드 컴포넌트
 *
 * SSG, 블로그 포스트 등 상세 페이지에서 사용하는 공통 레이아웃
 */
export function DetailCard({ title, description, meta, content, footer }: DetailCardProps) {
  return (
    <div className={styles.container}>
      <article className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {meta && <div className={styles.meta}>{meta}</div>}
        </header>

        <div className={styles.content}>{content}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </article>
    </div>
  );
}
