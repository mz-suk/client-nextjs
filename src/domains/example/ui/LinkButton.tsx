import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './LinkButton.module.scss';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * 링크 버튼 컴포넌트
 *
 * Next.js Link를 버튼 스타일로 렌더링하는 공통 컴포넌트
 */
export function LinkButton({ href, children, variant = 'primary', size = 'medium', fullWidth = false, icon, iconPosition = 'left' }: LinkButtonProps) {
  const className = [styles.link, styles[variant], size !== 'medium' && styles[size], fullWidth && styles.fullWidth].filter(Boolean).join(' ');

  return (
    <Link href={href} className={className}>
      {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
    </Link>
  );
}
