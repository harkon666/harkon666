import { createFileRoute, Link } from '@tanstack/react-router'
import { Canvas } from '@react-three/fiber'
import { MapControls, useTexture, Environment, Html } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { Suspense, useState, useRef, useEffect } from 'react'
import { ArrowLeft, X } from 'lucide-react'

export const Route = createFileRoute('/treasure')({
  component: TreasurePage,
})

function MapPlane() {
  const texture = useTexture('/map.jpg')
  // Assume a standard aspect ratio if unknown, but better to dynamic scale
  const aspect = texture.image instanceof HTMLImageElement ? texture.image.width / texture.image.height : 1.5

  return (
    <RigidBody type="fixed" position={[0, -0.1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100 * aspect, 100]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </RigidBody>
  )
}

function Fragment({ position }: { position: [number, number, number] }) {
  const api = useRef<RapierRigidBody>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 1000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (api.current) {
      // Apply explosive force outward
      const impulse = {
        x: (Math.random() - 0.5) * 15,
        y: Math.random() * 20 + 10,
        z: (Math.random() - 0.5) * 15
      }
      api.current.applyImpulse(impulse, true)
    }
  }, [])

  if (!visible) return null

  return (
    <RigidBody ref={api} colliders="ball" position={position} restitution={0.8} friction={0.5}>
      <mesh castShadow>
        <sphereGeometry args={[0.2 + Math.random() * 0.2, 16, 16]} />
        <meshStandardMaterial
          color="#338aca"
          emissive="#61bdaf"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </RigidBody>
  )
}

interface ShatterBaubleProps {
  position: [number, number, number]
  image: string
  story: string
  onImageClick: (image: string, story: string) => void
}

function ShatterBauble({ position, image, story, onImageClick }: ShatterBaubleProps) {
  const [shattered, setShattered] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Change cursor on hover
    document.body.style.cursor = hovered && !shattered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, shattered])

  if (shattered) {
    return (
      <>
        {[...Array(20)].map((_, i) => (
          <Fragment
            key={i}
            position={[
              position[0] + (Math.random() - 0.5),
              5,
              position[2] + (Math.random() - 0.5)
            ]}
          />
        ))}

        {/* Revealed Memory Card */}
        <Html transform position={[position[0], position[1] + 2, position[2]]} zIndexRange={[100, 0]}>
          <div
            className="bg-black/70 border border-[#26b7cd]/40 p-3 rounded-xl backdrop-blur-md flex flex-col items-center shadow-[0_0_30px_rgba(38,183,205,0.3)] w-48 animate-in fade-in zoom-in duration-1000 fill-mode-both"
            style={{ animationDelay: '0.3s' }} // Slight delay for dramatic effect after shatter
          >
            <div
              className="w-full aspect-square overflow-hidden rounded-lg mb-3 border border-white/10 cursor-pointer group"
              onClick={() => onImageClick(image, story)}
            >
              <img
                src={image}
                alt="Memory"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <p className="text-[#61bdaf] text-xs text-center font-medium leading-relaxed tracking-wide">
              {story}
            </p>
          </div>
        </Html>
      </>
    )
  }

  return (
    <RigidBody colliders="ball" position={position} restitution={0.4}>
      <mesh
        castShadow
        onClick={() => setShattered(true)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#338aca"
          emissive="#61bdaf"
          emissiveIntensity={hovered ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      {/* Visual ring to make it stand out on the map */}
      {hovered && (
        <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2, 32]} />
          <meshBasicMaterial color="#26b7cd" transparent opacity={0.6} />
        </mesh>
      )}
    </RigidBody>
  )
}

function TreasurePage() {
  const [selectedMemory, setSelectedMemory] = useState<{ image: string, story: string } | null>(null)

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* Top Navigation Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center justify-center text-[#26b7cd] bg-black/60 w-12 h-12 rounded-full border border-[#26b7cd]/50 hover:bg-[#26b7cd]/20 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(38,183,205,0.1)] group"
          title="Return to Void"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-10 pointer-events-none flex flex-col items-end gap-2 text-right">
        <span className="bg-black/60 text-white/50 px-5 py-2 rounded-full border border-white/10 text-[10px] tracking-[0.2em] uppercase backdrop-blur-md whitespace-nowrap">
          Drag to Pan • Scroll to Zoom
        </span>
        <span className="bg-black/60 text-[#26b7cd]/70 px-5 py-2 rounded-full border border-[#26b7cd]/20 text-[9px] tracking-[0.15em] uppercase backdrop-blur-md whitespace-nowrap border-r-2 border-r-[#26b7cd]/40">
          Press Bauble to Shatter • Click Photo for Detail
        </span>
      </div>

      {/* Crosshair / Center target overlay (visual only) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
        <div className="w-8 h-8 border border-[#26b7cd] rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-[#26b7cd] rounded-full" />
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 40, 30], fov: 35 }}>
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4 w-max">
              <div className="w-8 h-8 border-2 border-t-[#26b7cd] border-white/10 rounded-full animate-spin" />
              <span className="text-[#26b7cd] text-xs tracking-widest uppercase font-bold whitespace-nowrap">
                Decoding Map Data...
              </span>
            </div>
          </Html>
        }>
          <ambientLight intensity={0.4} />
          <directionalLight position={[20, 40, 20]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
          <Environment preset="city" />

          <MapControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={120}
            maxPolarAngle={Math.PI / 2.2} // Prevent camera from going under the map
            target={[10, 0, -10]} // Initial look target
          />

          <Physics gravity={[0, -30, 0]}>
            <MapPlane />
            {/* Specialized Interactive Bauble on the map */}
            <ShatterBauble
              position={[-8, 5, -5]}
              image="/treasure_5.jpeg"
              story="Went to WebX 2024 Tokyo after ETHTokyo Hackathon 2024"
              onImageClick={(image, story) => setSelectedMemory({ image, story })}
            />
            <ShatterBauble
              position={[3, 5, -25]}
              image="/treasure_1.jpeg"
              story="Graduation Blockdev ID Batch 3"
              onImageClick={(image, story) => setSelectedMemory({ image, story })}
            />
            <ShatterBauble
              position={[17, 5, -25]}
              image="/treasure_4.jpeg"
              story="Win Sui Bootcamp Mini Hackathon Indonesia"
              onImageClick={(image, story) => setSelectedMemory({ image, story })}
            />
            <ShatterBauble
              position={[10, 5, 10]}
              image="/treasure_6.jpeg"
              story="ETHTokyo 2024 - Win 2 bounty tracks"
              onImageClick={(image, story) => setSelectedMemory({ image, story })}
            />
            <ShatterBauble
              position={[10, 5, 25]}
              image="/treasure_2.jpeg"
              story="GELAP GURITA WKWKWKWK"
              onImageClick={(image, story) => setSelectedMemory({ image, story })}
            />
            <ShatterBauble
              position={[-8.5, 5, 32]}
              image="/treasure_3.jpeg"
              story="With Mysten Labs Mentor at Sui Bootcamp Indonesia"
              onImageClick={(image, story) => setSelectedMemory({ image, story })}
            />
          </Physics>
        </Suspense>
      </Canvas>

      {/* Memory Modal Overlay - Rendered LAST to guarantee it's on top */}
      {selectedMemory && (
        <div
          className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-500"
          onClick={() => setSelectedMemory(null)}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="relative bg-[#0a0a0a] border border-[#26b7cd]/40 p-6 rounded-2xl max-w-3xl w-full flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(38,183,205,0.2)] animate-in zoom-in slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white/40 hover:text-[#26b7cd] transition-colors z-10 bg-black/50 p-1 rounded-full backdrop-blur-sm"
              onClick={() => setSelectedMemory(null)}
            >
              <X size={24} />
            </button>

            <div className="w-full flex justify-center max-h-[60vh]">
              <img
                src={selectedMemory.image}
                alt="Selected Memory"
                className="max-w-full max-h-[60vh] object-contain rounded-xl border border-white/10"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] tracking-[0.4em] text-[#26b7cd] font-bold uppercase">TREASURE ACQUIRED</span>
              <p className="text-white/80 text-lg md:text-xl font-medium text-center leading-relaxed">
                {selectedMemory.story}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
