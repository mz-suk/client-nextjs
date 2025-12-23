'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Checkbox } from './Checkbox';

interface FormCheckboxProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  linkText?: string;
  onLinkClick?: () => void;
  onChange?: (checked: boolean) => void;
}

export function FormCheckbox<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  required = false,
  linkText,
  onLinkClick,
  onChange: onChangeProp,
}: FormCheckboxProps<T>) {
  const { field } = useController({
    name,
    control,
  });

  return (
    <Checkbox
      label={label}
      checked={field.value || false}
      required={required}
      linkText={linkText}
      onLinkClick={onLinkClick}
      onChange={checked => {
        field.onChange(checked);
        onChangeProp?.(checked);
      }}
    />
  );
}
