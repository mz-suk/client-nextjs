'use client';

import { forwardRef, useState } from 'react';

import { ClearIcon } from '@/shared/ui';

import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  helperText?: string;
  showClearButton?: boolean;
  onClear?: () => void;
  children?: React.ReactNode;
}

/**
 * 독립형 Input 컴포넌트
 * - label, helperText, error 표시 기능 포함
 * - react-hook-form 없이 독립적으로 사용 가능
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, showClearButton = true, onClear, className, value, onChange, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const errorMessage = typeof error === 'string' ? error : undefined;
    const hasError = !!error;

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // @ts-expect-error - onChange expects native event, but we're creating a synthetic clear event
        onChange({ target: { value: '' } });
      }
    };

    return (
      <div className={styles.container}>
        <div className={`${styles.inputWrapper} ${children ? styles.hasAction : ''}`}>
          {label && <label className={`${styles.label} ${isFocused ? styles.focused : ''}`}>{label}</label>}
          <input
            ref={ref}
            className={`${styles.input} ${hasError ? styles.error : ''} ${isFocused ? styles.focused : ''} ${children ? styles.hasActionButton : ''} ${className || ''}`}
            value={value}
            onChange={onChange}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {children
            ? children
            : showClearButton && hasValue && !props.disabled && !props.readOnly && <ClearIcon className={styles.clearButton} onClick={handleClear} />}
        </div>
        {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
        {helperText && !errorMessage && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
