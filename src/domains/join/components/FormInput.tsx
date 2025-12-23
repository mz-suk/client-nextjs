'use client';

import { useState } from 'react';
import type { Control, FieldPathValue, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { FormFieldError } from './FormFieldError';
import styles from './Input.module.scss';

interface FormInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  type?: string;
  readOnly?: boolean;
  rightIcon?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  onClick?: () => void;
  autoFocus?: boolean;
}

export function FormInput<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  description,
  type = 'text',
  readOnly = false,
  rightIcon,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  onClick,
  autoFocus,
}: FormInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [isFocused, setIsFocused] = useState(false);
  const hasValue = field.value !== undefined && field.value !== null && String(field.value).length > 0;

  const handleClear = () => {
    field.onChange('' as FieldPathValue<T, Path<T>>);
    onChangeProp?.('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoFocus={autoFocus}
          className={`${styles.input} ${error ? styles.error : ''} ${isFocused ? styles.focused : ''} ${className || ''}`}
          {...field}
          onChange={e => {
            field.onChange(e);
            onChangeProp?.(e.target.value);
          }}
          onBlur={e => {
            field.onBlur();
            setIsFocused(false);
            onBlurProp?.(e.target.value);
          }}
          onFocus={e => {
            setIsFocused(true);
            onFocusProp?.(e.target.value);
          }}
          onClick={onClick}
        />
        {rightIcon
          ? rightIcon
          : hasValue &&
            !disabled &&
            !readOnly && (
              <button type="button" className={styles.clearButton} onClick={handleClear} aria-label="입력 내용 지우기">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="9" fill="#E2E5EB" />
                  <path d="M11.5 6.5L6.5 11.5M6.5 6.5L11.5 11.5" stroke="#5F646F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
      </div>
      {description && !error && <span className={styles.helperText}>{description}</span>}
      <FormFieldError message={error?.message} />
    </div>
  );
}
