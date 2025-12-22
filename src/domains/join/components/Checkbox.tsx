'use client';

import styles from './Checkbox.module.scss';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  linkText?: string;
  onLinkClick?: () => void;
}

export function Checkbox({ label, checked, onChange, required = false, linkText, onLinkClick }: CheckboxProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className={styles.input} />
        <span className={styles.checkbox}>
          {checked && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className={styles.text}>
          {required && <span className={styles.required}>(필수)</span>}
          {label}
        </span>
      </label>
      {linkText && (
        <button type="button" className={styles.link} onClick={onLinkClick}>
          {linkText}
        </button>
      )}
    </div>
  );
}
