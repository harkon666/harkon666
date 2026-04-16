import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { BallCollider, RigidBody, CylinderCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

const VARIANT_COLORS: Record<string, { sphere: string; emissive: string; cap: string }> = {
  hero:    { sphere: '#338aca', emissive: '#61bdaf', cap: '#2b2c68' },
  summary: { sphere: '#5c6bc0', emissive: '#7986cb', cap: '#283593' },
  skills:  { sphere: '#26a69a', emissive: '#4db6ac', cap: '#00695c' },
  contact: { sphere: '#42a5f5', emissive: '#90caf9', cap: '#1565c0' },
}

const capMaterials: Record<string, THREE.MeshStandardMaterial> = {}
function getCapMaterial(variant: string) {
  if (!capMaterials[variant]) {
    const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.hero
    capMaterials[variant] = new THREE.MeshStandardMaterial({
      metalness: 0.9,
      roughness: 0.1,
      color: colors.cap,
      emissive: '#000000',
      envMapIntensity: 20,
    })
  }
  return capMaterials[variant]
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28)

interface BaubleProps {
  scale: number
  initialPosition: [number, number, number]
  variant: string
  index: number
  total: number
}

const _vec = new THREE.Vector3()
const _dir = new THREE.Vector3()

export function Bauble({ scale, initialPosition, variant = 'hero', index, total }: BaubleProps) {
  const { nodes } = useGLTF('/cap.glb') as any
  const api = useRef<RapierRigidBody>(null)
  const [isDiscarded, setIsDiscarded] = useState(false)
  const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.hero
  const timeOffset = useRef(index * 1.7 + Math.random() * 2)

  const discard = () => {
    if (!api.current || variant !== 'hero') return
    const pos = api.current.translation()
    _dir.set(pos.x, pos.y, pos.z + 5).normalize()
    api.current.applyImpulse(_dir.multiplyScalar(35 * scale), true)
    setIsDiscarded(true)
  }

  useFrame((state, delta) => {
    if (!api.current) return
    delta = Math.min(0.1, delta)
    const t = state.clock.elapsedTime + timeOffset.current

    if (variant === 'hero') {
      // HERO: Pull toward center (swipeable)
      if (isDiscarded) return
      api.current.applyImpulse(
        _vec
          .copy(api.current.translation())
          .normalize()
          .multiply({
            x: -50 * delta * scale,
            y: -150 * delta * scale,
            z: -50 * delta * scale,
          }),
        true
      )
    } else if (variant === 'summary') {
      // SUMMARY: Bob up and down on left/right sides (more stable and wider)
      const side = index % 2 === 0 ? -1 : 1
      const targetX = side * (10 + (index % 4) * 0.8)
      const targetY = Math.sin(t * 0.5) * 4 + ((index % 6) - 3) * 1.5
      const targetZ = Math.sin(t * 0.2 + index) * 2

      const pos = api.current.translation()
      _vec.set(
        (targetX - pos.x) * 2 * delta,
        (targetY - pos.y) * 2 * delta,
        (targetZ - pos.z) * 2 * delta
      )
      api.current.applyImpulse(_vec, true)
    } else if (variant === 'skills') {
      // SKILLS: Orbit in a MUCH wider circle framing the content
      const angle = (index / total) * Math.PI * 2 + t * 0.2
      const radius = 10.5 + Math.sin(t * 0.4 + index) * 1.2
      const targetX = Math.cos(angle) * radius
      const targetY = Math.sin(angle) * (radius * 0.8) // Slightly oval for better framing
      const targetZ = Math.sin(t * 0.3 + index * 0.5) * 2

      const pos = api.current.translation()
      _vec.set(
        (targetX - pos.x) * 3 * delta,
        (targetY - pos.y) * 3 * delta,
        (targetZ - pos.z) * 3 * delta
      )
      api.current.applyImpulse(_vec, true)
    } else if (variant === 'contact') {
      // CONTACT: Stable floating on extreme sides
      const side = index % 2 === 0 ? -1 : 1
      const targetX = side * (12 + (index % 3) * 1.5)
      const targetY = Math.sin(t * 0.3 + index) * 6 + ((index % 8) - 4) * 1.5
      const targetZ = Math.cos(t * 0.2) * 3

      const pos = api.current.translation()
      _vec.set(
        (targetX - pos.x) * 1.5 * delta,
        (targetY - pos.y) * 1.5 * delta,
        (targetZ - pos.z) * 1.5 * delta
      )
      api.current.applyImpulse(_vec, true)
    }
  })

  return (
    <RigidBody
      linearDamping={variant === 'hero' ? (isDiscarded ? 2 : 0.75) : 4}
      angularDamping={0.4}
      friction={0.2}
      position={initialPosition}
      ref={api as any}
      colliders={false}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'pointer' && variant === 'hero') {
          discard()
        }
      }}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        onPointerEnter={variant === 'hero' ? discard : undefined}
        onClick={variant === 'hero' ? discard : undefined}
      >
        <meshStandardMaterial
          color={colors.sphere}
          emissive={colors.emissive}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.1}
          dispose={null}
        />
      </mesh>
      <mesh
        castShadow
        scale={2.5 * scale}
        position={[0, 0, -1.8 * scale]}
        geometry={nodes.Mesh_1.geometry}
        material={getCapMaterial(variant)}
        dispose={null}
      />
    </RigidBody>
  )
}
