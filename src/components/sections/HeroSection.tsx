'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'


const SYSTEM_STATUS = [
  { label: 'FLIGHT SOFTWARE', status: 'online' as const },
  { label: 'ROBOTICS', status: 'online' as const },
  { label: 'AI SYSTEMS', status: 'online' as const },
  { label: 'TELEMETRY', status: 'online' as const },
  { label: 'IDEAS', status: 'online' as const },
]

const TAGS = ['ROCKETS', 'ROBOTICS', 'AI / ML', 'EMBEDDED SYSTEMS', 'DRONES', 'FLIGHT SOFTWARE']

export function HeroSection() {
  const [time, setTime] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC')
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="relative min-h-screen bg-paper overflow-hidden">
      {/* Engineering grid background */}
      <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-60" />
      <div className="absolute inset-0 bg-engineering-grid-fine bg-grid-8 opacity-30" />

      {/* Top coordinate markers */}
      <div className="absolute top-20 left-6 font-mono text-2xs text-graphite/20 tracking-widest">
        28.6139° N
      </div>
      <div className="absolute top-20 right-6 font-mono text-2xs text-graphite/20 tracking-widest">
        77.2090° E
      </div>

      {/* Horizontal center line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-graphite/5" />

      {/* Vertical center line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-graphite/5" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 w-full items-center">

          {/* LEFT: Text content */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* Designation label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-orange-DEFAULT" />
              <span className="font-mono text-2xs tracking-[0.25em] text-orange-DEFAULT uppercase">
                Engineering Systems Console
              </span>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h1 className="font-display font-bold text-5xl sm:text-6xl xl:text-7xl text-ink leading-none tracking-tight">
                PRANJAL
                <br />
                <span className="text-orange-DEFAULT">GIRI</span>
              </h1>
              <div className="mt-3 font-mono text-sm text-graphite tracking-wider">
                AI & ROBOTICS ENGINEER · FLIGHT SOFTWARE BUILDER
              </div>
            </motion.div>

            {/* Specializations */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-2"
            >
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-2xs tracking-widest border border-graphite/15 px-2 py-1 text-steel hover:border-orange/40 hover:text-orange-DEFAULT transition-colors"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* System Status Panel — matches the character sheet design */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="relative border border-graphite/15 bg-graphite/[0.03] p-4 max-w-xs"
            >
              {/* Corner marks */}
              <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-orange/50" />
              <span className="absolute top-1 right-1 w-3 h-3 border-t border-r border-orange/50" />
              <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-orange/50" />
              <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-orange/50" />

              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-3">SYSTEM STATUS</div>
              <div className="space-y-2">
                {SYSTEM_STATUS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-center justify-between"
                  >
                    <span className="font-mono text-2xs text-steel tracking-wider">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-slow" />
                      <span className="font-mono text-2xs text-sage">ONLINE</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-graphite/10 font-mono text-2xs text-graphite/30">
                {time}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/systems"
                className="group flex items-center gap-2 bg-graphite text-paper font-mono text-xs tracking-widest px-5 py-3 hover:bg-orange-DEFAULT transition-colors duration-300"
              >
                <span>VIEW SYSTEMS</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 border border-graphite/30 text-graphite font-mono text-xs tracking-widest px-5 py-3 hover:border-orange/50 hover:text-orange-DEFAULT transition-colors"
              >
                PROJECTS
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 border border-orange/40 text-orange-DEFAULT font-mono text-xs tracking-widest px-5 py-3 hover:bg-orange/5 transition-colors"
              >
                CONTACT
              </Link>
            </motion.div>
          </div>

          {/* RIGHT: Character illustration */}
          <motion.div
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {/* Outer engineering frame */}
            <div className="relative">
              {/* Engineering annotation lines */}
              <div className="absolute -top-4 left-0 right-0 flex items-center gap-2 justify-center">
                <div className="h-px flex-1 bg-orange/20" />
                <span className="font-mono text-2xs text-orange/60 tracking-widest">OPERATOR: PG-01</span>
                <div className="h-px flex-1 bg-orange/20" />
              </div>

              {/* Character image with parallax effect */}
              <motion.div
                className="relative w-72 sm:w-80 lg:w-96 xl:w-[420px]"
                animate={{
                  rotateY: mousePos.x * 8,
                  rotateX: -mousePos.y * 4,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Decorative border frame */}
                <div className="absolute inset-0 border border-orange/15" />
                <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange z-10" />
                <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange z-10" />
                <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange z-10" />
                <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange z-10" />

                <Image
                  src="/character/hero.jpg"
                  alt="Pranjal Giri — AI & Robotics Engineer"
                  width={420}
                  height={560}
                  className="w-full object-cover"
                  priority
                />

                {/* Floating annotation: IDEAS */}
                <motion.div
                  className="absolute top-8 -right-16 hidden lg:block"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-px w-12 bg-orange/40" />
                    <div className="border border-orange/30 bg-paper/90 px-2 py-1">
                      <div className="font-mono text-2xs text-orange-DEFAULT">&ldquo;IDEAS</div>
                      <div className="font-mono text-2xs text-steel">SIMULATIONS</div>
                      <div className="font-mono text-2xs text-steel">PROTOTYPES</div>
                      <div className="font-mono text-2xs text-orange-DEFAULT">REAL SYSTEMS&rdquo;</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating annotation: BUILD */}
                <motion.div
                  className="absolute -bottom-6 -left-20 hidden lg:block"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="border border-graphite/20 bg-paper/90 px-2 py-1">
                    <div className="font-mono text-2xs text-graphite/60">BUILD · SIMULATE</div>
                    <div className="font-mono text-2xs text-graphite/40">TEST · LAUNCH · IMPROVE</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom annotation line */}
              <div className="absolute -bottom-4 left-0 right-0 flex items-center gap-2 justify-center">
                <div className="h-px flex-1 bg-graphite/10" />
                <span className="font-mono text-2xs text-graphite/30 tracking-widest">VIT CHENNAI · TEAM IGNITION</span>
                <div className="h-px flex-1 bg-graphite/10" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-mono text-2xs text-graphite/30 tracking-widest">SCROLL TO EXPLORE</span>
          <div className="w-px h-8 bg-gradient-to-b from-graphite/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
