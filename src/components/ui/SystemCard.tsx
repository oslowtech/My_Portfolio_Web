'use client'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SystemCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  label?: string
  id?: string
  variant?: 'default' | 'dark' | 'orange'
}

export function SystemCard({ children, className, onClick, hover = true, label, id, variant = 'default' }: SystemCardProps) {
  const variants = {
    default: 'bg-paper border-graphite/10',
    dark: 'bg-graphite text-paper border-graphite',
    orange: 'bg-orange/5 border-orange/30',
  }

  return (
    <motion.div
      className={cn(
        'relative border rounded-sm overflow-hidden',
        variants[variant],
        hover && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={hover ? { scale: 1.005, boxShadow: '0 0 0 1px rgba(217, 108, 50, 0.3), 0 4px 16px rgba(217, 108, 50, 0.12)' } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Corner marks */}
      <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-orange/60" />
      <span className="absolute top-1 right-1 w-2 h-2 border-t border-r border-orange/60" />
      <span className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-orange/60" />
      <span className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-orange/60" />

      {/* ID label */}
      {(label || id) && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2">
          <span className="font-mono text-2xs text-steel tracking-widest">
            {label || id}
          </span>
        </div>
      )}

      {children}
    </motion.div>
  )
}
