'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import { StatusBadge } from '@/components/ui'
import type { Project } from '@/types'

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'flight', label: 'FLIGHT' },
  { id: 'robotics', label: 'ROBOTICS' },
  { id: 'uav', label: 'UAV' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'software', label: 'SOFTWARE' },
  { id: 'embedded', label: 'EMBEDDED' },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative border border-graphite/15 overflow-hidden group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Cover image / scene */}
      <div className="relative h-40 bg-graphite/5 overflow-hidden">
        {project.cover_image ? (
          <Image src={project.cover_image} alt={project.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />

        {/* Corner marks */}
        <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/50 z-10" />
        <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-orange/50 z-10" />

        {/* Category label */}
        <div className="absolute top-3 right-7 z-10">
          <span className="font-mono text-2xs text-paper/60 border border-paper/20 px-1.5 py-0.5 bg-graphite/40">
            {project.category.toUpperCase()}
          </span>
        </div>

        {/* Project ID */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="font-mono text-2xs text-paper/40">
            {`PRJ-${String(index + 1).padStart(3, '0')}`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-ink text-base leading-tight">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="font-sans text-xs text-steel leading-relaxed line-clamp-2">
          {project.short_description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map(tech => (
            <span key={tech} className="font-mono text-2xs text-steel border border-graphite/15 px-1.5 py-0.5">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="font-mono text-2xs text-steel/50">+{project.technologies.length - 4}</span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-1 border-t border-graphite/10">
          <Link
            href={`/projects/${project.slug}`}
            className="font-mono text-2xs text-orange-DEFAULT hover:text-orange-dark transition-colors"
          >
            OPEN SYSTEM →
          </Link>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-2xs text-steel hover:text-graphite transition-colors"
            >
              GITHUB
            </a>
          )}
        </div>
      </div>

      {/* Hover: full border highlight */}
      <motion.div
        className="absolute inset-0 border border-orange/30 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/50" />
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [category, setCategory] = useState('all')
  const { projects, loading } = useProjects(category === 'all' ? undefined : category)

  return (
    <div className="min-h-screen bg-paper pt-20">
      {/* Grid bg */}
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-orange-DEFAULT" />
            <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">PROJECT DATABASE</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-ink tracking-tight">SYSTEMS</h1>
          <p className="font-sans text-steel text-sm mt-2">Everything Pranjal has built, organized by domain.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`font-mono text-2xs tracking-widest px-3 py-1.5 border transition-colors ${
                category === cat.id
                  ? 'bg-graphite text-paper border-graphite'
                  : 'border-graphite/20 text-steel hover:border-orange/40 hover:text-orange-DEFAULT'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-graphite/10 animate-pulse h-72 bg-graphite/5" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-mono text-2xs text-steel tracking-widest">NO SYSTEMS FOUND</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
