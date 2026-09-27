import { cn } from '@/lib/utils'

type Status = 'active' | 'completed' | 'archived' | 'simulation' | 'online' | 'offline'

interface StatusBadgeProps {
  status: Status
  className?: string
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  active: { label: 'ACTIVE', color: 'text-orange-DEFAULT', dot: 'bg-orange-DEFAULT' },
  completed: { label: 'COMPLETED', color: 'text-sage', dot: 'bg-sage' },
  archived: { label: 'ARCHIVED', color: 'text-steel-light', dot: 'bg-steel-light' },
  simulation: { label: 'SIMULATION', color: 'text-yellow-DEFAULT', dot: 'bg-yellow-DEFAULT' },
  online: { label: 'ONLINE', color: 'text-sage', dot: 'bg-sage animate-pulse' },
  offline: { label: 'OFFLINE', color: 'text-steel-light', dot: 'bg-steel-light' },
}

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-mono',
      size === 'sm' ? 'text-2xs' : 'text-xs',
      config.color,
      className
    )}>
      <span className={cn('rounded-full flex-shrink-0', config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {config.label}
    </span>
  )
}
