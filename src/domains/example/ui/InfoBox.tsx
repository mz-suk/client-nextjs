import type { ReactNode } from 'react';

import styles from './InfoBox.module.scss';

interface InfoBoxProps {
  title?: string;
  children: ReactNode;
  type?: 'info' | 'warning' | 'success';
  /** @deprecated Use 'type' instead */
  variant?: 'info' | 'warning' | 'success';
}

/**
 * 정보 박스 컴포넌트
 *
 * 사용자에게 중요한 정보, 경고, 성공 메시지를 표시합니다.
 */
export function InfoBox({ title, children, type, variant }: InfoBoxProps) {
  // type이 우선, 없으면 variant 사용 (하위 호환성)
  const boxType = type || variant || 'info';

  return (
    <div className={`${styles.box} ${styles[boxType]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
