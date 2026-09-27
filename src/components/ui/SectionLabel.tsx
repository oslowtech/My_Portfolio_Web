import { cn } from '@/lib/utils'

interface SectionLabelProps {
  id: string
  label: string
  className?: string
}

export function SectionLabel({ id, label, className }: SectionLabelProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-2', className)}>
      <span className="font-mono text-2xs text-orange-DEFAULT tracking-widest">{id}</span>
      <div className="h-px flex-1 bg-graphite/10" />
      <span className="font-mono text-2xs text-steel tracking-widest">{label}</span>
    </div>
  )
}
