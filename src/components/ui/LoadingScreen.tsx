'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const BOOT_SEQUENCE = [
  { label: 'AVIONICS & FLIGHT SOFTWARE', code: 'SYS_BOOT_OK', latency: '24ms' },
  { label: 'ROBOTICS & SENSOR SUITE', code: 'CALIBRATED', latency: '41ms' },
  { label: 'RADAR / LIDAR TELEMETRY', code: 'LOCKED', latency: '68ms' },
  { label: '3D GRAPHICS PIPELINE', code: 'INITIALIZED', latency: '112ms' },
  { label: 'SECURE COMMUNICATIONS GATEWAY', code: 'ONLINE', latency: '150ms' },
]

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  const handleEnter = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(onComplete, 350)
  }, [exiting, onComplete])

  useEffect(() => {
    // Keyboard shortcut to enter immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleEnter])

  useEffect(() => {
    // Progressive boot sequence
    const timers: NodeJS.Timeout[] = []

    BOOT_SEQUENCE.forEach((_, i) => {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i])
        setProgress(Math.round(((i + 1) / BOOT_SEQUENCE.length) * 100))
        if (i === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setReady(true), 250)
        }
      }, (i + 1) * 320)
      timers.push(timer)
    })

    return () => {
      timers.forEach(t => clearTimeout(t))
    }
  }, [])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-paper text-ink transition-colors duration-200"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
        >
          {/* Engineering grid background matching active theme */}
          <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-engineering-grid-fine bg-grid-8 opacity-20 pointer-events-none" />

          {/* Quick skip button at top right */}
          <button
            type="button"
            onClick={handleEnter}
            className="absolute top-6 right-6 font-mono text-3xs tracking-widest text-steel hover:text-orange-DEFAULT border border-graphite/20 hover:border-orange-DEFAULT px-3 py-1.5 transition-colors z-20"
          >
            SKIP INITIALIZATION [ESC] →
          </button>

          {/* Main Aerospace Boot Terminal Card */}
          <div className="relative w-full max-w-lg bg-paper border border-graphite/20 p-6 sm:p-8 shadow-2xl z-10">
            {/* Aerospace Corner Brackets */}
            <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-orange-DEFAULT" />
            <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-orange-DEFAULT" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-orange-DEFAULT" />
            <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-orange-DEFAULT" />

            {/* Header with Avatar & Status */}
            <div className="flex items-center gap-4 pb-6 border-b border-graphite/10">
              <div className="relative flex-shrink-0">
                <Image
                  src="/character/avatar.jpg"
                  alt="Pranjal Giri"
                  width={52}
                  height={52}
                  className="rounded-full w-12 h-12 sm:w-14 sm:h-14 object-cover border-2 border-orange-DEFAULT"
                  priority
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-sage border-2 border-paper animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-3xs text-orange-DEFAULT tracking-[0.25em] uppercase font-bold">
                  FLIGHT COMPUTER // BOOT PROTOCOL
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-ink tracking-tight leading-snug truncate">
                  PRANJAL GIRI
                </h1>
                <div className="font-mono text-3xs text-steel tracking-wider truncate">
                  VIT CHENNAI · AI & ROBOTICS / FLIGHT SOFTWARE
                </div>
              </div>
            </div>

            {/* Boot Sequence Feed */}
            <div className="py-5 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-3xs text-steel/60 tracking-widest pb-1 border-b border-graphite/10">
                <span>SUBSYSTEM INITIALIZATION</span>
                <span>STATUS // LATENCY</span>
              </div>

              {BOOT_SEQUENCE.map((item, idx) => {
                const isDone = completedSteps.includes(idx)
                const isCurrent = completedSteps.length === idx
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between py-1 px-2 transition-colors ${
                      isDone
                        ? 'bg-paper-dark/30 text-ink'
                        : isCurrent
                        ? 'bg-orange/10 text-ink border-l-2 border-orange-DEFAULT'
                        : 'text-steel/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isDone ? 'bg-sage' : isCurrent ? 'bg-orange-DEFAULT animate-ping' : 'bg-graphite/20'
                      }`} />
                      <span className="text-3xs sm:text-2xs font-medium tracking-wide truncate">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-3xs flex-shrink-0">
                      <span className={`font-bold ${
                        isDone ? 'text-sage' : isCurrent ? 'text-orange-DEFAULT' : 'text-steel/50'
                      }`}>
                        {isDone ? item.code : isCurrent ? 'INITIALIZING...' : 'PENDING'}
                      </span>
                      <span className="text-steel/60 w-12 text-right hidden sm:inline">
                        {isDone ? item.latency : '—'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress Bar & Telemetry Metric */}
            <div className="pt-2 pb-4">
              <div className="flex justify-between items-center text-3xs font-mono text-steel mb-1.5">
                <span>TELEMETRY SYNC</span>
                <span className="font-bold text-orange-DEFAULT">{progress}% COMPLETE</span>
              </div>
              <div className="h-2 w-full bg-paper-dark/50 rounded-none overflow-hidden border border-graphite/15 p-0.5">
                <motion.div
                  className="h-full bg-orange-DEFAULT"
                  style={{ backgroundColor: '#D96C32' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Prominent High-Contrast Enter Button */}
            <div className="pt-4 border-t border-graphite/10">
              {ready ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={handleEnter}
                    autoFocus
                    className="w-full py-4 px-6 font-mono text-sm font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:opacity-95"
                    style={{
                      backgroundColor: '#D96C32',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 20px rgba(217, 108, 50, 0.45)',
                    }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white font-extrabold text-sm sm:text-base">
                      SYSTEM READY // ENTER CONSOLE →
                    </span>
                  </button>
                  <div className="text-center mt-2.5 font-mono text-3xs text-steel">
                    Press <kbd className="px-1.5 py-0.5 bg-paper-dark text-ink border border-graphite/20">ENTER</kbd> or click button to proceed
                  </div>
                </motion.div>
              ) : (
                <div className="py-3 px-4 bg-paper-dark/30 border border-graphite/15 text-center font-mono text-2xs text-steel flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-DEFAULT animate-ping" />
                  <span>SYNCHRONIZING SUBSYSTEM TELEMETRY...</span>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
