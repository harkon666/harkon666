import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'
import { Bauble } from './Bauble'
import { Pointer } from './Pointer'
import { Suspense, useState, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

useGLTF.preload('/cap.glb')

export function ThreeScene() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const baubleData = useMemo(() => {
    const r = (n: number) => (Math.random() - 0.5) * n
    return [...Array(100)].map(() => ({
      scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)],
      initialPosition: [r(15), r(15) - 20, r(15)] as [number, number, number]
    }))
  }, [])

  if (!mounted) return null

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
      gl={{ antialias: false }}
      className="fixed inset-0 z-0 touch-none"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15 * Math.PI} />
        <spotLight
          intensity={2 * Math.PI}
          angle={0.2}
          penumbra={1}
          position={[30, 30, 30]}
          castShadow
          color="#338aca"
        />
        <directionalLight
          intensity={0.4 * Math.PI}
          position={[-10, 10, -10]}
          color="#26b7cd"
        />

        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {baubleData.map((props, i) => (
            <Bauble key={i} {...props} />
          ))}
        </Physics>

        <Environment preset="city" />

        <EffectComposer>
          <N8AO color="#26b7cd" aoRadius={2} intensity={2} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
