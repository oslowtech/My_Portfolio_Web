import Image from 'next/image'
import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Mission Control — Pranjal Giri',
}

const SYSTEM_STATUS = [
  { id: 'FLIGHT-SW-01', label: 'FLIGHT SOFTWARE', status: 'NOMINAL', color: 'text-sage' },
  { id: 'ROBOTICS-01', label: 'ROBOTICS SYSTEMS', status: 'NOMINAL', color: 'text-sage' },
  { id: 'AI-SYS-01', label: 'AI SYSTEMS', status: 'NOMINAL', color: 'text-sage' },
  { id: 'TELEM-01', label: 'TELEMETRY MODULE', status: 'NOMINAL', color: 'text-sage' },
  { id: 'VISION-01', label: 'COMPUTER VISION', status: 'NOMINAL', color: 'text-sage' },
  { id: 'DB-01', label: 'DATABASE LINK', status: 'NOMINAL', color: 'text-sage' },
]

const FLIGHT_DATA = [
  { label: 'MAX ALTITUDE', value: '842 m', sub: 'AGL' },
  { label: 'MAX VELOCITY', value: '134 m/s', sub: 'VERTICAL' },
  { label: 'APOGEE', value: '1.1 km', sub: 'ABOVE LAUNCH' },
  { label: 'FLIGHT TIME', value: '47.3 s', sub: 'TO APOGEE' },
  { label: 'DESCENT RATE', value: '6.2 m/s', sub: 'UNDER CHUTE' },
  { label: 'LANDING DRIFT', value: '142 m', sub: 'FROM LAUNCH' },
]

export default async function MissionControlPage() {
  const supabase = await createServerSupabaseClient()
  const { data: stats } = await supabase.from('site_stats').select('*').single()
  const { data: projects } = await supabase.from('projects').select('status', { count: 'exact' })

  const activeCount = projects?.filter(p => p.status === 'active').length ?? 0
  const completedCount = projects?.filter(p => p.status === 'completed').length ?? 0

  return (
    <div className="min-h-screen bg-graphite text-paper pt-20">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">COMMAND & CONTROL</div>
            <h1 className="font-display font-bold text-4xl text-paper">MISSION CONTROL</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="font-mono text-xs text-sage tracking-widest">ALL SYSTEMS NOMINAL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status — left column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="border border-paper/10 p-5">
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-4">SYSTEM STATUS</div>
              <div className="space-y-3">
                {SYSTEM_STATUS.map(sys => (
                  <div key={sys.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-xs text-paper/80">{sys.label}</div>
                      <div className="font-mono text-2xs text-paper/30 mt-0.5">{sys.id}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                      <span className={`font-mono text-2xs ${sys.color}`}>{sys.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="border border-paper/10 p-5">
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-4">DATABASE</div>
              <div className="space-y-3">
                {[
                  { label: 'ACTIVE PROJECTS', value: activeCount },
                  { label: 'COMPLETED PROJECTS', value: completedCount },
                  { label: 'BLOG POSTS', value: stats?.blog_posts ?? 0 },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-paper/5 pb-2">
                    <span className="font-mono text-2xs text-paper/50">{item.label}</span>
                    <span className="font-mono text-sm text-paper">{String(item.value).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operator */}
            <div className="border border-paper/10 p-5 flex items-center gap-4">
              <Image src="/character/avatar.jpg" alt="Pranjal" width={56} height={56} className="rounded-full w-14 h-14 object-cover border border-orange/30" />
              <div>
                <div className="font-display font-bold text-sm text-paper">PRANJAL GIRI</div>
                <div className="font-mono text-2xs text-sage mt-0.5">● OPERATOR ONLINE</div>
                <div className="font-mono text-2xs text-paper/30 mt-0.5">VIT CHENNAI · TEAM IGNITION</div>
              </div>
            </div>
          </div>

          {/* Flight telemetry — center + right */}
          <div className="lg:col-span-2 space-y-4">
            {/* Simulation banner */}
            <div className="border border-yellow-DEFAULT/30 bg-yellow-DEFAULT/5 px-4 py-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-DEFAULT" />
              <span className="font-mono text-2xs text-yellow-DEFAULT tracking-widest">
                SIMULATION MODE — VALUES ARE MISSION SIMULATION, NOT LIVE TELEMETRY
              </span>
            </div>

            {/* Telemetry grid */}
            <div className="border border-paper/10 p-5">
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-4">
                LATEST MISSION — SRAD-01 FLIGHT SIMULATION
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {FLIGHT_DATA.map(item => (
                  <div key={item.label} className="border border-paper/10 p-3">
                    <div className="font-mono text-2xs text-paper/40 mb-1">{item.label}</div>
                    <div className="font-display font-bold text-xl text-paper">{item.value}</div>
                    <div className="font-mono text-2xs text-paper/30 mt-0.5">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight profile bar */}
            <div className="border border-paper/10 p-5">
              <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-4">FLIGHT PHASE SEQUENCE</div>
              <div className="relative h-6 bg-paper/5 overflow-hidden">
                {[
                  { label: 'BOOST', width: '20%', color: 'bg-orange-DEFAULT' },
                  { label: 'COAST', width: '25%', color: 'bg-orange/60' },
                  { label: 'APOGEE', width: '5%', color: 'bg-yellow-DEFAULT' },
                  { label: 'DROGUE', width: '20%', color: 'bg-sage' },
                  { label: 'MAIN', width: '20%', color: 'bg-sage/60' },
                  { label: 'LAND', width: '10%', color: 'bg-paper/30' },
                ].map(phase => (
                  <div
                    key={phase.label}
                    className={`absolute top-0 bottom-0 ${phase.color} flex items-center justify-center`}
                    style={{ width: phase.width, left: (() => {
                      const phases = ['20%', '25%', '5%', '20%', '20%', '10%']
                      const idx = ['BOOST', 'COAST', 'APOGEE', 'DROGUE', 'MAIN', 'LAND'].indexOf(phase.label)
                      return phases.slice(0, idx).reduce((acc, w) => acc + parseInt(w), 0) + '%'
                    })() }}
                  >
                    <span className="font-mono text-2xs text-paper/80 text-center leading-none">{phase.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Build the future CTA */}
            <div className="border border-orange/20 p-5 flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-lg text-paper">BUILD · SIMULATE · TEST · LAUNCH</div>
                <div className="font-mono text-2xs text-paper/40 mt-1">VIT CHENNAI · TEAM IGNITION · ROBOTICS CLUB</div>
              </div>
              <a href="/contact" className="font-mono text-2xs text-orange-DEFAULT border border-orange/30 px-3 py-2 hover:bg-orange/10 transition-colors whitespace-nowrap">
                CONTACT →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
