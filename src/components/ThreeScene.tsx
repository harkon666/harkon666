import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'
import { Bauble } from './Bauble'
import { Pointer } from './Pointer'
import { Suspense, useState, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/cap.glb')

interface BaubleConfig {
  count: number
  variant: 'hero' | 'summary' | 'skills' | 'contact'
}

const SECTION_CONFIGS: BaubleConfig[] = [
  { count: 80, variant: 'hero' },
  { count: 50, variant: 'summary' },
  { count: 48, variant: 'skills' },
  { count: 50, variant: 'contact' },
  { count: 80, variant: 'hero' }, // Treasure section shares hero storm
]

interface ThreeSceneProps {
  activeSection: number
}

const SECTION_LIGHTS = [
  { spotlight: "#338aca", directional: "#26b7cd", intensity: 1.0 },
  { spotlight: "#5c6bc0", directional: "#7986cb", intensity: 0.8 },
  { spotlight: "#26a69a", directional: "#4db6ac", intensity: 0.9 },
  { spotlight: "#42a5f5", directional: "#90caf9", intensity: 1.1 },
  { spotlight: "#338aca", directional: "#26b7cd", intensity: 1.0 }, // Duplicate of hero for treasure
]

export function ThreeScene({ activeSection }: ThreeSceneProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [renderedSection, setRenderedSection] = useState(activeSection)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setRenderedSection(activeSection)
  }, [activeSection])

  const mobileConfigs = useMemo(() => [
    { count: 70, variant: 'hero' },
    { count: 40, variant: 'summary' },
    { count: 32, variant: 'skills' },
    { count: 40, variant: 'contact' },
    { count: 55, variant: 'hero' },
  ], [])

  const config = isMobile
    ? (mobileConfigs[renderedSection] || mobileConfigs[0])
    : (SECTION_CONFIGS[renderedSection] || SECTION_CONFIGS[0])
  const lights = SECTION_LIGHTS[renderedSection] || SECTION_LIGHTS[0]

  const baubleData = useMemo(() => {
    const r = (n: number) => (Math.random() - 0.5) * n

    return [...Array(config.count)].map((_, i) => {
      let x: number, y: number, z: number
      const scale = [0.6, 0.75, 0.85, 1, 1.1][Math.floor(Math.random() * 5)]

      if (config.variant === 'hero') {
        x = -15 + Math.random() * 10
        y = 10 + Math.random() * 15
        z = 0
      } else if (config.variant === 'summary') {
        const side = i % 2 === 0 ? -1 : 1
        x = side * (10 + Math.random() * 3)
        y = r(15) - 20
        z = r(4)
      } else if (config.variant === 'skills') {
        const angle = (i / config.count) * Math.PI * 2
        const radius = 11 + Math.random() * 1.5
        x = Math.cos(angle) * radius
        y = r(15) - 20
        z = r(3)
      } else {
        x = r(20)
        y = r(15) - 20
        z = r(6)
      }

      return {
        scale,
        initialPosition: [x, y, z] as [number, number, number],
        variant: config.variant,
        index: i,
        total: config.count,
      }
    })
  }, [renderedSection])

  if (!mounted) return null

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
      gl={{ antialias: false }}
      eventSource={typeof window !== 'undefined' ? document.body : undefined}
      className="!fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2 * Math.PI * lights.intensity} />
        <spotLight
          intensity={2 * Math.PI * lights.intensity}
          angle={0.2}
          penumbra={1}
          position={[30, 30, 30]}
          color={lights.spotlight}
        />
        <directionalLight
          intensity={0.5 * Math.PI * lights.intensity}
          position={[-10, 10, -10]}
          color={lights.directional}
        />

        <Physics gravity={[0, 0, 0]} key={`physics-${renderedSection}`}>
          {renderedSection === 0 && <Pointer />}
          {baubleData.map((props, i) => (
            <Bauble key={i} {...props} />
          ))}
        </Physics>

        <Environment preset="city" />

        <EffectComposer>
          <N8AO color={lights.spotlight} aoRadius={1} intensity={1} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
