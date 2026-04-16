import { useState, useEffect } from 'react'

export function Underlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 flex select-none flex-col justify-between p-10 font-bold uppercase text-white/40 transition-opacity duration-1000">
      <div className="flex w-full items-start justify-between">
        <div className="text-right text-[12px] leading-[1.5em] tracking-[0.2em]">
          R3F + Rapier
        </div>
      </div>

      <div className={`absolute inset-0 flex items-center justify-center p-20 text-center pointer-events-none transition-opacity duration-[2000ms] ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-4">
          <h2 className="text-[4vw] leading-none tracking-tighter text-[#61bdaf]/20 font-black uppercase max-w-4xl">
            HELP HARKON TO SURVIVE<br />
            COLLEGE DEBT
          </h2>
          <span className="text-[10px] tracking-[0.5em] text-[#26b7cd]/40 font-medium uppercase">
            STATUS: CRITICAL / MISSION: EMPLOYMENT
          </span>
        </div>
      </div>

      <div className="flex w-full items-end justify-between">
        <div className="text-[12px] leading-[1.5em] tracking-[0.2em]">
          Interactive<br />
          Physics Scene
        </div>
        <h1 className="m-0 text-[10vw] leading-[0.8em] tracking-tighter text-white/20">
          00—01
        </h1>
      </div>
    </div>
  )
}
