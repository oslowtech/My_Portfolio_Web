'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TerminalTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  cursor?: boolean
  delay?: number
}

export function TerminalText({ text, speed = 40, className, onComplete, cursor = true, delay = 0 }: TerminalTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setDone(true)
          onComplete?.()
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, speed, delay, onComplete])

  return (
    <span className={cn('font-mono', className)}>
      {displayed}
      {cursor && !done && <span className="animate-blink text-orange-DEFAULT">█</span>}
    </span>
  )
}
