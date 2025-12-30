import type { ReactNode } from 'react';

import styles from './ExampleLayout.module.scss';

interface ExampleLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  tip?: string;
}

export function ExampleLayout({ title, description, children, tip }: ExampleLayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>

      {tip && (
        <div className={styles.tip}>
          <strong>💡 Tip:</strong> {tip}
        </div>
      )}

      {children}
    </div>
  );
}
