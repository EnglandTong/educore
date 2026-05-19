import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[hsl(var(--color-primary))] text-[hsl(var(--color-surface))] shadow-[var(--shadow-md)] hover:bg-[hsl(var(--color-primary-dark))] focus-visible:ring-[hsl(var(--color-primary)/0.35)]',
  secondary:
    'bg-[hsl(var(--color-secondary-light))] text-[hsl(var(--color-text))] shadow-[var(--shadow-sm)] hover:brightness-95 focus-visible:ring-[hsl(var(--color-secondary)/0.35)]',
  ghost:
    'bg-transparent text-[hsl(var(--color-text))] hover:bg-[hsl(var(--color-border)/0.45)] focus-visible:ring-[hsl(var(--color-primary)/0.25)]',
  danger:
    'bg-[hsl(var(--color-error))] text-[hsl(var(--color-surface))] shadow-[var(--shadow-sm)] hover:brightness-95 focus-visible:ring-[hsl(var(--color-error)/0.35)]',
}

const sizeClass: Record<Size, string> = {
  sm: 'text-sm px-3 py-2 rounded-[var(--radius-md)]',
  md: 'text-base px-4 py-2.5 rounded-[var(--radius-lg)]',
  lg: 'text-lg px-6 py-3 rounded-[var(--radius-xl)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-[transform,box-shadow,background-color] duration-[var(--transition-base)] ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-4 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  )
})
