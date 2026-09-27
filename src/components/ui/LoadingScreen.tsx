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
    setTimeout(onComplete, 400)
  }, [exiting, onComplete])

  useEffect(() => {
    // Keyboard shortcut to skip or enter immediately
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleEnter])

  useEffect(() => {
    // Check if previously visited in this session
    const visited = sessionStorage.getItem('pg_visited')
    if (visited) {
      onComplete()
      return
    }
    sessionStorage.setItem('pg_visited', '1')

    // Run progressive boot sequence
    const timers: NodeJS.Timeout[] = []

    BOOT_SEQUENCE.forEach((_, i) => {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, i])
        setProgress(Math.round(((i + 1) / BOOT_SEQUENCE.length) * 100))
        if (i === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setReady(true), 300)
        }
      }, (i + 1) * 350)
      timers.push(timer)
    })

    return () => {
      timers.forEach(t => clearTimeout(t))
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: '#0E1317', color: '#E9E6DD' }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          {/* Technical background grid with fine dots */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(217, 108, 50, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '24px 24px, 48px 48px, 48px 48px',
            }}
          />

          {/* Quick skip button at top right */}
          <button
            type="button"
            onClick={handleEnter}
            className="absolute top-6 right-6 font-mono text-3xs tracking-widest text-[#8A9A90] hover:text-[#D96C32] border border-[#242F35] hover:border-[#D96C32] px-3 py-1.5 transition-colors z-20"
          >
            SKIP INITIALIZATION [ESC] →
          </button>

          {/* Main Aerospace Boot Terminal Card */}
          <div className="relative w-full max-w-lg bg-[#141B1F] border border-[#2A363D] p-6 sm:p-8 shadow-2xl z-10">
            {/* Aerospace Corner Brackets */}
            <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D96C32]" />
            <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D96C32]" />
            <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D96C32]" />
            <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D96C32]" />

            {/* Header with Avatar & Status */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#242F35]">
              <div className="relative flex-shrink-0">
                <Image
                  src="/character/avatar.jpg"
                  alt="Pranjal Giri"
                  width={52}
                  height={52}
                  className="rounded-full w-12 h-12 sm:w-14 sm:h-14 object-cover border-2 border-[#D96C32]"
                  priority
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#34A853] border-2 border-[#141B1F] animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-3xs text-[#D96C32] tracking-[0.25em] uppercase font-bold">
                  FLIGHT COMPUTER // BOOT PROTOCOL
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug truncate">
                  PRANJAL GIRI
                </h1>
                <div className="font-mono text-3xs text-[#8A9A90] tracking-wider truncate">
                  VIT CHENNAI · AI & ROBOTICS / FLIGHT SOFTWARE
                </div>
              </div>
            </div>

            {/* Boot Sequence Feed */}
            <div className="py-5 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-3xs text-[#6C7A72] tracking-widest pb-1 border-b border-[#1E272D]">
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
                        ? 'bg-[#1A2328]/60 text-[#E9E6DD]'
                        : isCurrent
                        ? 'bg-[#D96C32]/10 text-white border-l-2 border-[#D96C32]'
                        : 'text-[#526068]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        isDone ? 'bg-[#34A853]' : isCurrent ? 'bg-[#D96C32] animate-ping' : 'bg-[#2A363D]'
                      }`} />
                      <span className="text-3xs sm:text-2xs font-medium tracking-wide truncate">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-3xs flex-shrink-0">
                      <span className={`font-bold ${
                        isDone ? 'text-[#34A853]' : isCurrent ? 'text-[#D96C32]' : 'text-[#3E4C54]'
                      }`}>
                        {isDone ? item.code : isCurrent ? 'INITIALIZING...' : 'PENDING'}
                      </span>
                      <span className="text-[#6C7A72] w-12 text-right hidden sm:inline">
                        {isDone ? item.latency : '—'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress Bar & Telemetry Metric */}
            <div className="pt-2 pb-4">
              <div className="flex justify-between items-center text-3xs font-mono text-[#8A9A90] mb-1.5">
                <span>TELEMETRY SYNC</span>
                <span className="font-bold text-[#D96C32]">{progress}% COMPLETE</span>
              </div>
              <div className="h-2 w-full bg-[#1C252B] rounded-none overflow-hidden border border-[#2A363D] p-0.5">
                <motion.div
                  className="h-full bg-[#D96C32]"
                  style={{ backgroundColor: '#D96C32' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Prominent High-Contrast Enter Button */}
            <div className="pt-4 border-t border-[#242F35]">
              {ready ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={handleEnter}
                    autoFocus
                    className="w-full py-4 px-6 font-mono text-sm font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl"
                    style={{
                      backgroundColor: '#D96C32',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 20px rgba(217, 108, 50, 0.45)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E88A55')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D96C32')}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white font-extrabold text-sm sm:text-base">
                      SYSTEM READY // ENTER CONSOLE →
                    </span>
                  </button>
                  <div className="text-center mt-2.5 font-mono text-3xs text-[#8A9A90]">
                    Press <kbd className="px-1.5 py-0.5 bg-[#1E272D] text-white border border-[#2A363D] rounded-none">ENTER</kbd> or click button to proceed
                  </div>
                </motion.div>
              ) : (
                <div className="py-3 px-4 bg-[#182025] border border-[#242F35] text-center font-mono text-2xs text-[#8A9A90] flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D96C32] animate-ping" />
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
