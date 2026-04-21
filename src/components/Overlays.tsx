import { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, Map } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface SectionProps {
  isActive: boolean
}

export function HeroSection({ isActive }: SectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setVisible(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <div className="section-content">
      <div className={`flex flex-col items-center gap-4 p-10 text-center transition-opacity duration-[2000ms] ease-in-out pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/40 font-medium uppercase">
          INTERACTIVE CV / SWIPE THE BAUBLE IF THAT BAUBLE STUCK
        </span>
        <h1 className="text-[5vw] leading-none tracking-tighter text-[#26b7cd]/60 font-black uppercase max-w-4xl">
          HELP HARKON<br />
          TO SURVIVE
        </h1>
        <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/40 font-medium uppercase">
          STATUS: CRITICAL / MISSION: EMPLOYMENT
        </span>
        <div className="mt-8 text-[10px] tracking-[0.3em] text-white/20 animate-bounce">
          ↓ SCROLL DOWN ↓
        </div>
      </div>
    </div>
  )
}

export function SummarySection({ isActive }: SectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive && !visible) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive, visible])

  return (
    <div className="section-content">
      <div className={`flex flex-col items-center gap-6 p-10 max-w-2xl text-center transition-opacity duration-[2000ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/70 font-medium uppercase">
          ABOUT ME
        </span>
        <h2 className="text-[4vw] leading-tight tracking-tight text-white/60 font-black uppercase">
          Bryan Dewa<br />Wicaksana
        </h2>
        <p className="text-[1.1rem] leading-relaxed text-[#61bdaf]/50 font-medium max-w-lg">
          I am a fast learner and highly adaptable developer. I pride myself on my ability to master new programming languages and integrate seamlessly into any professional environment. Just give me the time, and I will prove it.
        </p>
        <div className="flex gap-4 mt-2">
          <span className="text-[9px] tracking-[0.4em] text-[#338aca]/50 font-semibold uppercase px-3 py-1 border border-[#338aca]/20 rounded-full">
            DEVELOPER
          </span>
          <span className="text-[9px] tracking-[0.4em] text-[#338aca]/50 font-semibold uppercase px-3 py-1 border border-[#338aca]/20 rounded-full">
            DESIGNER
          </span>
          <span className="text-[9px] tracking-[0.4em] text-[#338aca]/50 font-semibold uppercase px-3 py-1 border border-[#338aca]/20 rounded-full">
            CREATOR
          </span>
        </div>
      </div>
    </div>
  )
}

export function SkillsSection({ isActive }: SectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive && !visible) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [isActive, visible])

  const skills = [
    { category: 'LANGUAGES', items: ['TypeScript', 'Go', 'Rust', 'Python', 'Solidity', 'Others...'] },
    { category: 'FRONTEND', items: ['React', 'Next.js', 'Three.js', 'TailwindCSS', 'Vue', 'Others...'] },
    { category: 'BACKEND', items: ['Node.js', 'Hono', 'PostgreSQL', 'Redis', 'Docker', 'Others...'] },
    { category: 'WEB3', items: ['EVM', 'Solana', 'ZK', 'Sui', 'Proxy', 'Others...'] },
  ]

  return (
    <div className="section-content">
      <div className={`flex flex-col items-center gap-8 p-10 max-w-3xl text-center transition-opacity duration-[2000ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/70 font-medium uppercase">
          TECH STACK
        </span>
        <h2 className="text-[3.5vw] leading-none tracking-tight text-white/60 font-black uppercase">
          SKILLS & TOOLS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-4">
          {skills.map((group) => (
            <div key={group.category} className="flex flex-col gap-2">
              <span className="text-[9px] tracking-[0.4em] text-[#26b7cd]/60 font-bold uppercase">
                {group.category}
              </span>
              {group.items.map((skill) => (
                <span key={skill} className="text-[0.85rem] text-[#61bdaf]/45 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ContactSection({ isActive }: SectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive && !visible) {
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isActive, visible])

  const links = [
    { label: 'GitHub', url: 'https://github.com/harkon666', icon: Github },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/bryan-dewawicaksana', icon: Linkedin },
    { label: 'Email', url: 'mailto:bryan.wicaksanaa@gmail.com', icon: Mail },
  ]

  return (
    <div className="section-content">
      <div className={`flex flex-col items-center gap-8 p-10 max-w-xl text-center transition-opacity duration-[2000ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/80 font-medium uppercase">
          LET'S CONNECT
        </span>
        <h2 className="text-[4vw] leading-none tracking-tight text-white/60 font-black uppercase">
          CONTACT
        </h2>
        <p className="text-[1rem] leading-relaxed text-[#61bdaf]/60 font-medium">
          Currently open for opportunities.<br />
          Let's build something amazing together.
        </p>
        <div className="flex flex-col gap-4 mt-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 border border-[#26b7cd]/20 rounded-lg hover:border-[#26b7cd]/50 hover:bg-[#26b7cd]/10 bg-black/20 backdrop-blur-sm transition-all duration-300 no-underline"
              style={{ pointerEvents: 'auto' }}
            >
              <span className="text-[#26b7cd]/60 group-hover:text-[#26b7cd] transition-colors">
                <link.icon size={18} />
              </span>
              <span className="text-[0.9rem] text-white/40 group-hover:text-white/70 font-semibold tracking-wide transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-8 text-[9px] tracking-[0.5em] text-white/10 uppercase">
          Built with React Three Fiber + Rapier Physics
        </div>
      </div>
    </div>
  )
}

export function TreasureSection({ isActive }: SectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isActive && !visible) {
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isActive, visible])

  return (
    <div className="section-content">
      <div className={`flex flex-col items-center gap-8 p-10 max-w-xl text-center transition-opacity duration-[2000ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/80 font-medium uppercase">
          EXPLORE
        </span>
        <h2 className="text-[4vw] leading-none tracking-tight text-white/60 font-black uppercase">
          TREASURES MAP
        </h2>
        <p className="text-[1rem] leading-relaxed text-[#61bdaf]/60 font-medium">
          Discover hidden treasures.
        </p>

        <Link
          to="/treasure"
          className="group relative w-full aspect-video mt-6 overflow-hidden rounded-xl border border-[#26b7cd]/30 cursor-pointer block"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span className="flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-md rounded-full border border-[#26b7cd]/50 text-[#26b7cd] opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <Map size={18} />
              <span className="text-sm font-bold tracking-widest uppercase">ENTER MAP</span>
            </span>
          </div>
          <img
            src="/map.jpg"
            alt="Treasures Map Preview"
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105"
          />
        </Link>

        {/* Mobile-friendly Button */}
        <Link 
          to="/treasure"
          style={{ pointerEvents: 'auto' }}
          className="flex items-center gap-2 px-8 py-3 bg-[#26b7cd]/10 border border-[#26b7cd]/30 rounded-full text-[#26b7cd] hover:bg-[#26b7cd]/20 hover:border-[#26b7cd]/50 transition-all duration-300 shadow-[0_0_20px_rgba(38,183,205,0.1)] group"
        >
          <Map size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Open Treasure Map</span>
        </Link>
      </div>
    </div>
  )
}
