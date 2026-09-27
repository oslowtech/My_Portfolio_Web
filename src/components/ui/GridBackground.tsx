import { cn } from '@/lib/utils'

interface GridBackgroundProps {
  className?: string
  density?: 'fine' | 'normal' | 'both'
  children?: React.ReactNode
}

export function GridBackground({ className, density = 'normal', children }: GridBackgroundProps) {
  return (
    <div className={cn('relative', className)}>
      {(density === 'normal' || density === 'both') && (
        <div className="absolute inset-0 bg-engineering-grid bg-grid-40 pointer-events-none" />
      )}
      {(density === 'fine' || density === 'both') && (
        <div className="absolute inset-0 bg-engineering-grid-fine bg-grid-8 pointer-events-none" />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
