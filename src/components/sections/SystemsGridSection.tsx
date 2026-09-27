'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

const SYSTEMS = [
  {
    id: 'flight',
    label: 'FLIGHT',
    sublabel: 'SRAD AVIONICS',
    description: 'Flight computers, telemetry, recovery systems, RocketPy simulation',
    image: '/character/scene-launch.jpg',
    tags: ['FLIGHT SOFTWARE', 'TELEMETRY', 'ESP32', 'ROCKETPY'],
    href: '/systems/flight',
    span: 'lg:col-span-2',
  },
  {
    id: 'robotics',
    label: 'ROBOTICS',
    sublabel: 'GROUND SYSTEMS',
    description: 'UGV platforms, LiDAR navigation, sensor fusion, obstacle avoidance',
    image: '/character/scene-explore.jpg',
    tags: ['UGV', 'LIDAR', 'ROS', 'PID'],
    href: '/systems/robotics',
    span: '',
  },
  {
    id: 'embedded',
    label: 'EMBEDDED',
    sublabel: 'SYSTEMS',
    description: 'PCB design, flight computers, microcontrollers, sensor integration',
    image: '/character/scene-build.jpg',
    tags: ['ESP32', 'JETSON', 'C++', 'PCB'],
    href: '/systems/embedded',
    span: '',
  },
  {
    id: 'ai',
    label: 'AI / ML',
    sublabel: 'INTELLIGENCE',
    description: 'Computer vision, deepfake detection, ResNet, object detection',
    image: '/character/scene-develop.jpg',
    tags: ['PYTORCH', 'OPENCV', 'YOLO', 'RESNET'],
    href: '/systems/ai',
    span: 'lg:col-span-2',
  },
  {
    id: 'uav',
    label: 'UAV',
    sublabel: 'AERIAL SYSTEMS',
    description: 'Drone platforms, flight controllers, computer vision navigation',
    image: '/character/scene-explore.jpg',
    tags: ['DRONE', 'FLIGHT CTRL', 'CV', 'FPV'],
    href: '/systems/uav',
    span: '',
  },
]

function SystemTile({ system, index }: { system: typeof SYSTEMS[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden border border-graphite/15 group cursor-pointer ${system.span} h-52 lg:h-64`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={system.href} className="block w-full h-full">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={system.image}
            alt={system.label}
            fill
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-graphite/70 group-hover:bg-graphite/50 transition-colors duration-500" />
          {/* Paper texture overlay */}
          <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-20" />
        </div>

        {/* Corner marks */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/60 z-10" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-orange/60 z-10" />
        <span className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-orange/60 z-10" />
        <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/60 z-10" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          {/* Top: ID */}
          <div className="font-mono text-2xs text-paper/40 tracking-widest">
            SYS-{String(index + 1).padStart(2, '0')}
          </div>

          {/* Middle: Label */}
          <div>
            <div className="font-display font-bold text-2xl text-paper tracking-tight">{system.label}</div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mt-0.5">{system.sublabel}</div>
          </div>

          {/* Bottom: Description + tags (on hover) */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <p className="font-sans text-xs text-paper/70 leading-relaxed line-clamp-2">
              {system.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {system.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-2xs text-paper/60 border border-paper/20 px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hover: OPEN SYSTEM arrow */}
        <motion.div
          className="absolute bottom-4 right-5 z-10 font-mono text-2xs text-orange-DEFAULT"
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }}
          transition={{ duration: 0.2 }}
        >
          OPEN SYSTEM →
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function SystemsGridSection() {
  return (
    <section className="py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-orange-DEFAULT" />
            <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SYS-OVERVIEW</span>
          </div>
          <h2 className="font-display font-bold text-4xl text-ink tracking-tight">SYSTEMS</h2>
          <p className="font-sans text-steel mt-2 max-w-md">
            Everything Pranjal builds, organized by domain.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-graphite/10">
          {SYSTEMS.map((system, i) => (
            <SystemTile key={system.id} system={system} index={i} />
          ))}
          {/* Software tile */}
          <motion.div
            className="relative overflow-hidden border border-graphite/15 group cursor-pointer h-52 lg:h-64 bg-paper"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/systems/software" className="block w-full h-full p-5">
              <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-40" />
              <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/40" />
              <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/40" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="font-mono text-2xs text-graphite/30 tracking-widest">SYS-06</div>
                <div>
                  <div className="font-display font-bold text-2xl text-ink tracking-tight">SOFTWARE</div>
                  <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mt-0.5">APPLICATIONS</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['PYTHON', 'C++', 'REACT', 'BACKEND'].map(t => (
                    <span key={t} className="font-mono text-2xs text-steel border border-graphite/15 px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
