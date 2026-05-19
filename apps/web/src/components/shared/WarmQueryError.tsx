import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export interface WarmQueryErrorProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function WarmQueryError({
  title = 'We hit a gentle snag',
  description = 'Something drifted out of sync on our side — a refresh or a quiet retry usually brings everything back into place.',
  onRetry,
}: WarmQueryErrorProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button type="button" variant="primary" onClick={onRetry}>
            Try again with care
          </Button>
        ) : undefined
      }
    />
  )
}
