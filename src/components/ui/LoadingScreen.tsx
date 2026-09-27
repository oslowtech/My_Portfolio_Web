'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_SEQUENCE = [
  { label: 'FLIGHT SOFTWARE', delay: 400 },
  { label: 'ROBOTICS SYSTEMS', delay: 700 },
  { label: 'TELEMETRY MODULE', delay: 1000 },
  { label: 'VISION SYSTEMS', delay: 1300 },
  { label: 'DATABASE LINK', delay: 1600 },
]

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState<number[]>([])
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    // Check if first visit
    const visited = sessionStorage.getItem('pg_visited')
    if (visited) { onComplete(); return }
    sessionStorage.setItem('pg_visited', '1')

    BOOT_SEQUENCE.forEach((item, i) => {
      setTimeout(() => {
        setCompleted((prev) => [...prev, i])
        setProgress(((i + 1) / BOOT_SEQUENCE.length) * 100)
        if (i === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setReady(true), 400)
        }
      }, item.delay)
    })
  }, [onComplete])

  function handleEnter() {
    setExiting(true)
    setTimeout(onComplete, 600)
  }

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 bg-graphite flex items-center justify-center"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6 }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-10" />

          <div className="relative w-full max-w-md px-8 space-y-8">
            {/* Title */}
            <div>
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-[0.3em] mb-1">ENGINEERING SYSTEMS CONSOLE</div>
              <h1 className="font-display text-3xl font-bold text-paper tracking-tight">PRANJAL GIRI</h1>
              <div className="font-mono text-xs text-sage mt-1">AI & ROBOTICS / FLIGHT SOFTWARE</div>
            </div>

            {/* Separator */}
            <div className="h-px bg-paper/10" />

            {/* Boot sequence */}
            <div className="space-y-2">
              <div className="font-mono text-2xs text-paper/40 tracking-widest mb-3">INITIALIZING SYSTEMS...</div>
              {BOOT_SEQUENCE.map((item, i) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="font-mono text-xs text-paper/60">{item.label}</span>
                  <span className={`font-mono text-xs ${
                    completed.includes(i) ? 'text-sage' : 'text-paper/20'
                  }`}>
                    {completed.includes(i) ? 'OK' : '...'}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div className="h-px bg-paper/10 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-orange-DEFAULT"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-2xs text-paper/20">0%</span>
                <span className="font-mono text-2xs text-paper/40">{Math.round(progress)}%</span>
                <span className="font-mono text-2xs text-paper/20">100%</span>
              </div>
            </div>

            {/* Enter button */}
            <AnimatePresence>
              {ready && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-px flex-1 bg-orange/30" />
                  <button
                    onClick={handleEnter}
                    className="font-mono text-xs text-orange-DEFAULT border border-orange/40 px-4 py-2 hover:bg-orange/10 transition-colors tracking-widest"
                  >
                    SYSTEM READY — ENTER →
                  </button>
                  <div className="h-px flex-1 bg-orange/30" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
