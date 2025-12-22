'use client';

import { useState } from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  onClear?: () => void;
}

export function Input({ label, error, helperText, className, value, onClear, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          className={`${styles.input} ${error ? styles.error : ''} ${isFocused ? styles.focused : ''} ${className || ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          {...props}
        />
        {hasValue && !props.disabled && (
          <button type="button" className={styles.clearButton} onClick={handleClear} aria-label="입력 내용 지우기">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="9" fill="#E2E5EB" />
              <path d="M11.5 6.5L6.5 11.5M6.5 6.5L11.5 11.5" stroke="#5F646F" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {!error && helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
