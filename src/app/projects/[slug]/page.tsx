import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from '@/components/ui'
import { formatDate } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: project } = await supabase.from('projects').select('title, short_description').eq('slug', slug).single()
  if (!project) return { title: 'Project Not Found' }
  return { title: `${project.title} — Pranjal Giri`, description: project.short_description }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  const { data: project } = await supabase.from('projects').select('*').eq('slug', slug).single()

  if (!project) notFound()

  const SCENE_MAP: Record<string, string> = {
    flight: '/character/scene-launch.jpg',
    robotics: '/character/scene-explore.jpg',
    uav: '/character/scene-explore.jpg',
    ai: '/character/scene-develop.jpg',
    embedded: '/character/scene-build.jpg',
    software: '/character/scene-develop.jpg',
  }

  const sceneImage = project.cover_image || SCENE_MAP[project.category] || '/character/scene-develop.jpg'

  return (
    <div className="min-h-screen bg-paper pt-20">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-25 pointer-events-none" />

      {/* Hero image */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <Image src={sceneImage} alt={project.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-graphite/60 to-paper" />

        {/* Project ID top-left */}
        <div className="absolute top-6 left-6 font-mono text-2xs text-paper/50 tracking-widest">
          {`PRJ-${project.slug.toUpperCase()}`}
        </div>

        {/* Status top-right */}
        <div className="absolute top-6 right-6">
          <StatusBadge status={project.status} size="md" />
        </div>

        {/* Bottom-left: category */}
        <div className="absolute bottom-8 left-6">
          <span className="font-mono text-2xs text-orange-DEFAULT border border-orange/30 px-2 py-1 bg-paper/10">
            {project.category.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors mb-8">
          ← BACK TO SYSTEMS
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <h1 className="font-display font-bold text-3xl lg:text-4xl text-ink leading-tight">{project.title}</h1>
              <p className="font-mono text-sm text-steel mt-2">{project.short_description}</p>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-orange-DEFAULT" />
                <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SYSTEM OVERVIEW</span>
              </div>
              <p className="font-sans text-sm text-graphite leading-relaxed">{project.description}</p>
            </div>

            {/* Architecture stub */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-orange-DEFAULT" />
                <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">ARCHITECTURE</span>
              </div>
              <div className="border border-graphite/15 p-4 font-mono text-xs text-steel space-y-1 bg-graphite/[0.02]">
                {project.category === 'flight' && (
                  <>
                    <div>SENSOR → SERIAL → ESP32</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>STATE MACHINE → APOGEE DETECTION</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>RECOVERY → TELEMETRY → GROUND STATION</div>
                  </>
                )}
                {project.category === 'robotics' && (
                  <>
                    <div>LIDAR → SLAM → PATH PLANNING</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>PID CONTROLLER → MOTOR DRIVER</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>JETSON NANO → ROS → OBSTACLE AVOIDANCE</div>
                  </>
                )}
                {(project.category === 'ai' || project.category === 'software') && (
                  <>
                    <div>INPUT → PREPROCESSING → MODEL</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>INFERENCE → POST-PROCESSING</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>OUTPUT → VISUALIZATION → API</div>
                  </>
                )}
                {(project.category === 'embedded' || project.category === 'uav') && (
                  <>
                    <div>SENSORS → MCU → PROCESSING</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>CONTROL LOOP → ACTUATORS</div>
                    <div className="pl-4 text-graphite/40">↓</div>
                    <div>TELEMETRY → GROUND STATION</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Tech stack */}
            <div className="relative border border-graphite/15 p-4">
              <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange/40" />
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-3">TECH STACK</div>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech: string) => (
                  <span key={tech} className="font-mono text-2xs text-ink border border-graphite/20 px-2 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="relative border border-graphite/15 p-4 space-y-2">
              <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange/40" />
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-3">LINKS</div>
              {project.github_url ? (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs text-graphite hover:text-orange-DEFAULT transition-colors">
                  ↗ GITHUB REPOSITORY
                </a>
              ) : (
                <div className="font-mono text-2xs text-steel/50">GitHub — Private</div>
              )}
              {project.demo_url && (
                <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs text-graphite hover:text-orange-DEFAULT transition-colors">
                  ↗ LIVE DEMO
                </a>
              )}
              {project.documentation_url && (
                <a href={project.documentation_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs text-graphite hover:text-orange-DEFAULT transition-colors">
                  ↗ DOCUMENTATION
                </a>
              )}
            </div>

            {/* Meta */}
            <div className="relative border border-graphite/15 p-4">
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-3">META</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-mono text-2xs text-steel">STATUS</span>
                  <StatusBadge status={project.status} />
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-2xs text-steel">DOMAIN</span>
                  <span className="font-mono text-2xs text-ink">{project.category.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-2xs text-steel">CREATED</span>
                  <span className="font-mono text-2xs text-ink">{formatDate(project.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
