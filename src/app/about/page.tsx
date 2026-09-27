import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Pranjal Giri',
  description: 'AI & Robotics Engineer | Flight Software Builder at VIT Chennai',
}

const TIMELINE = [
  { year: '2024', events: ['Joined VIT Chennai', 'Founded interest in aerospace', 'Robotics Club'] },
  { year: '2025', events: ['Team Ignition — Rocketry', 'Flight Software development', 'LiDAR UGV project', 'Deepfake Detection AI'] },
  { year: '2026', events: ['SRAD Rocket Avionics', 'UGV Navigation System', 'Glance Telemetry Platform', 'Active Fin Stabilization'] },
  { year: '2027', events: ['...'] },
]

const STACK = [
  { level: 'AI / INTELLIGENCE', items: ['PyTorch', 'OpenCV', 'YOLO', 'ResNet18'] },
  { level: 'AUTONOMY', items: ['ROS', 'ROS2', 'SLAM', 'Path Planning'] },
  { level: 'COMPUTING', items: ['Jetson Nano', 'Raspberry Pi', 'ESP32', 'STM32'] },
  { level: 'SENSORS', items: ['LiDAR', 'MPU6050', 'BMP390', 'GPS', 'LoRa'] },
  { level: 'SOFTWARE', items: ['C++', 'Python', 'TypeScript', 'React', 'Next.js'] },
  { level: 'TOOLS', items: ['Blender', 'SolidWorks', 'KiCad', 'RocketPy', 'Git'] },
]

const SCENES = [
  { label: 'DEVELOP', image: '/character/scene-develop.jpg', caption: 'Flight software & simulation at the workstation' },
  { label: 'BUILD', image: '/character/scene-build.jpg', caption: 'Assembling flight computers & embedded systems' },
  { label: 'LAUNCH', image: '/character/scene-launch.jpg', caption: 'Field operations with Team Ignition' },
  { label: 'EXPLORE', image: '/character/scene-explore.jpg', caption: 'UAV & UGV system testing in the field' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper pt-20">
      {/* Hero strip */}
      <div className="relative bg-graphite overflow-hidden">
        <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-10" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="space-y-6">
              <div>
                <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">OPERATOR PROFILE · PG-01</div>
                <h1 className="font-display font-bold text-5xl text-paper">PRANJAL GIRI</h1>
                <div className="font-mono text-sm text-sage mt-2">AI & ROBOTICS ENGINEER · FLIGHT SOFTWARE BUILDER</div>
              </div>
              <div className="space-y-2 font-sans text-paper/70 text-sm leading-relaxed max-w-lg">
                <p>
                  Building systems that operate at the boundary of software and physical reality.
                  From rocket flight computers that survive 12G launches, to UGV platforms navigating
                  unknown terrain with LiDAR, to AI systems detecting synthetic media — 
                  I build things that actually work.
                </p>
                <p>
                  Currently at VIT Chennai, leading embedded systems development at Team Ignition
                  (SRAD rocketry) and building autonomous ground vehicles with the Robotics Club.
                </p>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {['ROCKETS', 'ROBOTICS', 'AI/ML', 'EMBEDDED', 'UAV', 'FLIGHT SOFTWARE'].map(t => (
                  <span key={t} className="font-mono text-2xs border border-paper/20 text-paper/60 px-2 py-1">{t}</span>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 border border-orange/20 rounded-full scale-110" />
                <div className="absolute inset-0 border border-orange/10 rounded-full scale-125" />
                <Image
                  src="/character/avatar.jpg"
                  alt="Pranjal Giri"
                  width={240}
                  height={240}
                  className="rounded-full w-48 h-48 lg:w-56 lg:h-56 object-cover border-2 border-orange/30"
                  priority
                />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="font-mono text-2xs text-orange-DEFAULT tracking-widest bg-graphite px-3 py-1 border border-orange/20">
                    PG · VIT CHENNAI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene variations */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-orange-DEFAULT" />
          <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SCENE VARIATIONS</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SCENES.map(scene => (
            <div key={scene.label} className="relative group">
              <div className="relative aspect-video overflow-hidden border border-graphite/15">
                <Image src={scene.image} alt={scene.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-graphite/50" />
                {/* Corner marks */}
                <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-orange/60" />
                <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-orange/60" />
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="font-mono text-xs font-bold text-paper">{scene.label}</div>
                </div>
              </div>
              <p className="font-mono text-2xs text-steel mt-2 leading-relaxed">{scene.caption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Timeline */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-orange-DEFAULT" />
              <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">ENGINEERING TIMELINE</span>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-graphite/15" />
              <div className="space-y-8">
                {TIMELINE.map((period) => (
                  <div key={period.year} className="flex gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-8 border border-orange/30 bg-paper flex items-center justify-center">
                        <span className="font-mono text-xs text-orange-DEFAULT">{period.year}</span>
                      </div>
                    </div>
                    <div className="space-y-2 pt-1">
                      {period.events.map((event) => (
                        <div key={event} className="flex items-start gap-2">
                          <span className="font-mono text-orange-DEFAULT mt-1 text-xs">├──</span>
                          <span className="font-mono text-xs text-graphite">{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Stack */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-orange-DEFAULT" />
              <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SYSTEM STACK</span>
            </div>
            <div className="space-y-3">
              {STACK.map((layer, i) => (
                <div key={layer.level} className="relative">
                  <div className="border border-graphite/15 p-3 hover:border-orange/30 transition-colors group">
                    <span className="absolute top-1 left-1 w-2 h-2 border-t border-l border-orange/40" />
                    <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-2">{layer.level}</div>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map(item => (
                        <span key={item} className="font-mono text-2xs text-steel border border-graphite/15 px-2 py-0.5 group-hover:border-graphite/30 transition-colors">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < STACK.length - 1 && (
                    <div className="flex justify-center">
                      <div className="w-px h-3 bg-orange/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
