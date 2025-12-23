'use client';

interface FormFieldErrorProps {
  message?: string;
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500" role="alert">
      {message}
    </p>
  );
}
