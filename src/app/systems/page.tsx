import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Systems — Pranjal Giri',
}

const SYSTEMS = [
  {
    id: 'flight',
    label: 'FLIGHT',
    sublabel: 'SRAD AVIONICS & ROCKETRY',
    description: 'Student-researched and designed rocket avionics. Flight computers, apogee detection, telemetry, recovery systems, and RocketPy simulation.',
    image: '/character/scene-launch.jpg',
    tags: ['FLIGHT SOFTWARE', 'TELEMETRY', 'ESP32', 'ROCKETPY', 'RECOVERY'],
    projects: ['SRAD Flight Software', 'RocketPy Simulator', 'Active Fin Stabilization', 'Glance Telemetry'],
  },
  {
    id: 'robotics',
    label: 'ROBOTICS',
    sublabel: 'GROUND SYSTEMS',
    description: 'Autonomous and semi-autonomous ground vehicles. LiDAR-based navigation, sensor fusion, PID control loops, and ROS integration.',
    image: '/character/scene-explore.jpg',
    tags: ['UGV', 'LIDAR', 'ROS', 'PID', 'SENSOR FUSION'],
    projects: ['LiDAR UGV Navigation', 'Line Follower', 'Robotic Arm', 'Obstacle Avoidance'],
  },
  {
    id: 'uav',
    label: 'UAV',
    sublabel: 'AERIAL SYSTEMS',
    description: 'Unmanned aerial vehicles — drone platforms, flight controller development, and computer vision-guided navigation.',
    image: '/character/scene-explore.jpg',
    tags: ['DRONE', 'FLIGHT CTRL', 'COMPUTER VISION', 'FPV'],
    projects: ['Quadcopter Build', 'CV Navigation', 'FPV Platform'],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    sublabel: 'INTELLIGENCE SYSTEMS',
    description: 'Deep learning models for computer vision, synthetic media detection, and object recognition. PyTorch, OpenCV, YOLO.',
    image: '/character/scene-develop.jpg',
    tags: ['PYTORCH', 'OPENCV', 'YOLO', 'RESNET', 'DEEPFAKE'],
    projects: ['Deepfake Detection', 'Object Detection', 'ResNet18 Classifier'],
  },
  {
    id: 'embedded',
    label: 'EMBEDDED',
    sublabel: 'SYSTEMS',
    description: 'PCB design, microcontroller firmware, flight computers. ESP32, STM32, Jetson Nano, sensor integration.',
    image: '/character/scene-build.jpg',
    tags: ['ESP32', 'STM32', 'C++', 'PCB', 'KICAD'],
    projects: ['Flight Computer PCB', 'Sensor Integration', 'IMU Firmware'],
  },
  {
    id: 'software',
    label: 'SOFTWARE',
    sublabel: 'APPLICATIONS',
    description: 'Full-stack applications, backend systems, desktop tools, and telemetry platforms. Python, TypeScript, React.',
    image: '/character/scene-develop.jpg',
    tags: ['PYTHON', 'TYPESCRIPT', 'REACT', 'BACKEND'],
    projects: ['Glance Telemetry', 'Desktop Software Builder', 'Portfolio CMS'],
  },
]

export default function SystemsPage() {
  return (
    <div className="min-h-screen bg-paper pt-20">
      <div className="fixed inset-0 bg-engineering-grid bg-grid-40 opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-orange-DEFAULT" />
            <span className="font-mono text-2xs tracking-widest text-orange-DEFAULT">SYSTEM OVERVIEW</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-ink">SYSTEMS</h1>
          <p className="font-sans text-steel text-sm mt-2">Six domains. One engineer.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SYSTEMS.map((sys, i) => (
            <Link key={sys.id} href={`/systems/${sys.id}`}>
              <div className="relative border border-graphite/15 overflow-hidden group hover:border-orange/30 transition-colors h-56">
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image src={sys.image} alt={sys.label} fill className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-graphite/75 group-hover:bg-graphite/60 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-engineering-grid bg-grid-40 opacity-10" />
                </div>

                {/* Corner marks */}
                <span className="absolute top-2 left-2 w-3 h-3 border-t border-l border-orange/60 z-10" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-orange/60 z-10" />

                {/* SYS ID */}
                <div className="absolute top-3 left-4 z-10 font-mono text-2xs text-paper/30">
                  SYS-{String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between p-5">
                  <div className="flex justify-between items-start">
                    <div />
                    <div className="flex flex-wrap gap-1 max-w-48">
                      {sys.tags.slice(0, 3).map(t => (
                        <span key={t} className="font-mono text-2xs text-paper/50 border border-paper/15 px-1.5 py-0.5">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-2xs text-orange-DEFAULT tracking-widest mb-1">{sys.sublabel}</div>
                    <h2 className="font-display font-bold text-3xl text-paper">{sys.label}</h2>
                    <p className="font-sans text-sm text-paper/60 mt-2 line-clamp-2">{sys.description}</p>
                    <div className="mt-3 font-mono text-2xs text-orange-DEFAULT opacity-0 group-hover:opacity-100 transition-opacity">
                      EXPLORE SYSTEM →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
