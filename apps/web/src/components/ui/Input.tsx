import { type InputHTMLAttributes, forwardRef, useId } from 'react'

import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, id, className, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-[hsl(var(--color-text-secondary))]"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-[var(--radius-lg)] border bg-[hsl(var(--color-surface))] px-4 py-3 text-[hsl(var(--color-text))] shadow-inner transition-[border-color,box-shadow] duration-[var(--transition-fast)] placeholder:text-[hsl(var(--color-text-muted))] focus-visible:outline-none focus-visible:ring-4',
          error
            ? 'border-[hsl(var(--color-error))] focus-visible:ring-[hsl(var(--color-error)/0.25)]'
            : 'border-[hsl(var(--color-border))] focus-visible:ring-[hsl(var(--color-primary)/0.25)]',
          className,
        )}
        {...props}
      />
      {helperText && !error ? (
        <p id={`${inputId}-help`} className="text-sm text-[hsl(var(--color-text-muted))]">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-sm font-medium text-[hsl(var(--color-error))]">
          {error}
        </p>
      ) : null}
    </div>
  )
})
