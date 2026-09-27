import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { StatusBadge } from '@/components/ui'
import type { Project } from '@/types'

interface PageProps {
  params: Promise<{ category: string }>
}

const CATEGORY_META: Record<string, { label: string; sub: string; desc: string; scene: string; specs: string[] }> = {
  flight: {
    label: 'FLIGHT AVIONICS & ROCKETRY',
    sub: 'SRAD-01',
    desc: 'Student Research and Designed flight computers, active fin stabilization, apogee detection algorithms, telemetry downlink, and RocketPy trajectory verification.',
    scene: '/character/scene-launch.jpg',
    specs: ['Sampling Rate: 100Hz', 'Sensors: BMP390, MPU6050, GPS', 'Telemetry: LoRa 433MHz', 'Target Apogee: 1.1km'],
  },
  robotics: {
    label: 'GROUND ROBOTICS & AUTONOMY',
    sub: 'UGV-ALPHA',
    desc: 'Unmanned Ground Vehicles equipped with LiDAR SLAM, ROS2 nodes, real-time obstacle evasion, wheel odometry fusion, and Jetson compute units.',
    scene: '/character/scene-explore.jpg',
    specs: ['LIDAR: RPLIDAR A1 12m', 'Compute: Nvidia Jetson Nano', 'Control: Adaptive PID loops', 'Localization: 2D EKF SLAM'],
  },
  uav: {
    label: 'UNMANNED AERIAL VEHICLES',
    sub: 'UAV-SYS',
    desc: 'Aerial platforms, custom flight controllers, computer-vision assisted indoor navigation, FPV telemetry pipelines, and payload release mechanisms.',
    scene: '/character/scene-explore.jpg',
    specs: ['Platform: X-Frame Quad', 'Controller: Custom Firmware / Betaflight', 'Comms: Crossfire 915MHz', 'Vision: OpenCV Monocular SLAM'],
  },
  ai: {
    label: 'ARTIFICIAL INTELLIGENCE & VISION',
    sub: 'NEURAL-CORE',
    desc: 'Deep neural networks for facial manipulation detection, synthetic media identification, real-time object tracking, and edge embedded inference.',
    scene: '/character/scene-develop.jpg',
    specs: ['Framework: PyTorch / TensorRT', 'Base Architecture: ResNet18 / YOLOv8', 'Dataset: FaceForensics++ / Custom', 'Precision: 94.2% Validation Acc'],
  },
  embedded: {
    label: 'EMBEDDED HARDWARE & PCB',
    sub: 'HARDWARE-LAB',
    desc: 'Schematic capture, high-reliability PCB design in KiCad, surface mount soldering, microcontroller firmware in C++/FreeRTOS, and high-G sensor suites.',
    scene: '/character/scene-build.jpg',
    specs: ['EDA: KiCad 8.0', 'MCU: ESP32-S3 / STM32F4', 'Buses: SPI, I2C, UART, CAN', 'Power: Buck-Boost 3.3V/5V Low Noise'],
  },
  software: {
    label: 'APPLICATIONS & TELEMETRY SYSTEMS',
    sub: 'GROUND-STATION',
    desc: 'Real-time telemetry stations, serial bridges, WebSocket feeds, 3D visualization consoles, and custom web dashboards for aerospace testbeds.',
    scene: '/character/scene-develop.jpg',
    specs: ['Frontend: Next.js / Three.js / Tailwind', 'Backend: WebSocket / Python / C++', 'Protocol: Protobuf / JSON Packets', 'Latency: <15ms Telemetry Jitter'],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const meta = CATEGORY_META[category]
  if (!meta) return { title: 'System Not Found — Pranjal Giri' }
  return { title: `${meta.label} — Systems Console`, description: meta.desc }
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params
  const meta = CATEGORY_META[category]
  if (!meta) notFound()

  const supabase = await createServerSupabaseClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-paper pt-20 pb-16">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-25 pointer-events-none" />

      {/* Hero Header with Scene Banner */}
      <div className="relative border-b border-graphite/10 overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full">
          <Image src={meta.scene} alt={meta.label} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-graphite/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pb-8 -mt-20">
          <Link
            href="/systems"
            className="inline-flex items-center gap-2 font-mono text-2xs text-steel hover:text-orange-DEFAULT transition-colors mb-4"
          >
            ← ALL SYSTEMS OVERVIEW
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-2xs text-orange-DEFAULT tracking-widest uppercase">
              {meta.sub}
            </span>
            <span className="text-steel/40 text-xs">/</span>
            <span className="font-mono text-2xs text-steel">SUBSYSTEM DOMAIN</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink leading-tight">
            {meta.label}
          </h1>
          <p className="font-sans text-sm text-steel mt-3 max-w-3xl leading-relaxed">
            {meta.desc}
          </p>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {meta.specs.map(spec => (
              <div key={spec} className="border border-graphite/15 bg-paper/80 backdrop-blur-sm p-2.5">
                <span className="font-mono text-2xs text-ink block truncate">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid for this Category */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-orange-DEFAULT" />
          <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">DEPLOYED PLATFORMS</span>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="border border-graphite/15 p-12 text-center font-mono text-xs text-steel">
            NO PROJECTS RECORDED IN THIS CATEGORY YET
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p: Project) => (
              <div key={p.id} className="relative border border-graphite/15 p-5 bg-paper hover:border-orange/40 transition-colors flex flex-col justify-between group">
                <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange/40" />
                <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-orange/40" />
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-ink text-base group-hover:text-orange-DEFAULT transition-colors">
                      {p.title}
                    </h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="font-sans text-xs text-steel leading-relaxed mb-4">
                    {p.short_description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.technologies?.slice(0, 4).map(tech => (
                      <span key={tech} className="font-mono text-2xs border border-graphite/15 text-steel px-1.5 py-0.5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-graphite/10 flex items-center justify-between">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="font-mono text-2xs text-orange-DEFAULT hover:underline"
                  >
                    INSPECT SYSTEM →
                  </Link>
                  {p.github_url && (
                    <a
                      href={p.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-2xs text-steel hover:text-ink"
                    >
                      GITHUB ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
