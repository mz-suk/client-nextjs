'use client';

import type { Control, FieldPathValue, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Input } from './Input';

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
  children?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  onClick?: () => void;
  autoFocus?: boolean;
}

/**
 * react-hook-form과 통합된 Form Input 컴포넌트
 * - Input 컴포넌트를 래핑하여 form 관련 기능 제공
 * - label, error 표시, clear 버튼 등의 UI 로직은 Input 컴포넌트가 담당
 */
export function FormInput<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder,
  required: _required = false,
  disabled = false,
  className,
  description,
  type = 'text',
  readOnly = false,
  children,
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

  const handleClear = () => {
    field.onChange('' as FieldPathValue<T, Path<T>>);
    onChangeProp?.('');
  };

  return (
    <Input
      id={name}
      label={label}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoFocus={autoFocus}
      error={error?.message}
      helperText={description}
      className={className}
      showClearButton={!children}
      {...field}
      onChange={e => {
        field.onChange(e);
        onChangeProp?.(e.target.value);
      }}
      onBlur={e => {
        field.onBlur();
        onBlurProp?.(e.target.value);
      }}
      onFocus={e => {
        onFocusProp?.(e.target.value);
      }}
      onClear={handleClear}
      onClick={onClick}
    >
      {children}
    </Input>
  );
}
