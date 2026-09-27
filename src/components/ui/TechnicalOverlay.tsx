'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CalloutItem {
  label: string
  value?: string
  x: number  // percentage 0-100
  y: number  // percentage 0-100
  direction?: 'left' | 'right'
}

interface TechnicalOverlayProps {
  items: CalloutItem[]
  visible: boolean
  className?: string
}

export function TechnicalOverlay({ items, visible, className }: TechnicalOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn('absolute inset-0 pointer-events-none', className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="absolute"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              initial={{ opacity: 0, x: item.direction === 'left' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              {/* Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-orange-DEFAULT absolute top-0 left-0" />
              {/* Line */}
              <div
                className="absolute top-0.75 h-px bg-orange/50"
                style={{
                  width: 24,
                  left: item.direction === 'left' ? 'auto' : 6,
                  right: item.direction === 'left' ? 6 : 'auto',
                }}
              />
              {/* Label */}
              <div
                className={cn(
                  'absolute top-[-6px] whitespace-nowrap font-mono text-2xs text-orange-DEFAULT bg-paper/90 px-1',
                  item.direction === 'left' ? 'right-8' : 'left-8'
                )}
              >
                {item.label}
                {item.value && <span className="text-graphite/60 ml-1">{item.value}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
