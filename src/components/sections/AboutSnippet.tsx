'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const SCENES = [
  { label: 'DEVELOP', image: '/character/scene-develop.jpg', desc: 'Writing flight software at 2am' },
  { label: 'BUILD', image: '/character/scene-build.jpg', desc: 'Assembling flight computers' },
  { label: 'LAUNCH', image: '/character/scene-launch.jpg', desc: 'Field tests at Team Ignition' },
  { label: 'EXPLORE', image: '/character/scene-explore.jpg', desc: 'Testing UGV + UAV systems' },
]

export function AboutSnippet() {
  return (
    <section className="py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-orange-DEFAULT" />
              <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">OPERATOR PROFILE</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-ink">ABOUT THE ENGINEER</h2>
          </div>
          <Link href="/about" className="font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors tracking-widest">
            FULL PROFILE →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENES.map((scene, i) => (
            <motion.div
              key={scene.label}
              className="relative overflow-hidden group"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="relative aspect-video">
                <Image
                  src={scene.image}
                  alt={scene.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-graphite/40 group-hover:bg-graphite/25 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="font-mono text-xs font-bold text-paper">{scene.label}</div>
                  <div className="font-mono text-2xs text-paper/60 mt-0.5">{scene.desc}</div>
                </div>
                {/* Corner mark */}
                <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-orange/70" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
