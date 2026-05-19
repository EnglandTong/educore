import { cn } from '@/utils/cn'

type AvatarSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-12 w-12 text-sm',
  lg: 'h-16 w-16 text-base',
}

export interface AvatarProps {
  name: string
  src?: string
  size?: AvatarSize
  className?: string
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? '?').toUpperCase()
  const a = parts[0]?.[0]
  const b = parts[parts.length - 1]?.[0]
  return `${a ?? ''}${b ?? ''}`.toUpperCase() || '?'
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[hsl(var(--color-primary)/0.12)] font-semibold text-[hsl(var(--color-primary-dark))] ring-2 ring-[hsl(var(--color-primary)/0.15)]',
        sizeMap[size],
        className,
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
