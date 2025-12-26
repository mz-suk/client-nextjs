import type { ReactNode } from 'react';

import styles from './InfoBox.module.scss';

interface InfoBoxProps {
  title: string;
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export function InfoBox({ title, children, variant = 'info' }: InfoBoxProps) {
  return (
    <div className={`${styles.box} ${styles[variant]}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
