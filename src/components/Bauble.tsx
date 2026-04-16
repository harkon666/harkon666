import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { BallCollider, RigidBody, CylinderCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

const capMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.9,
  roughness: 0.1,
  color: "#2b2c68",
  emissive: "#000000",
  envMapIntensity: 20
})

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28)

interface BaubleProps {
  scale: number
  initialPosition: [number, number, number]
}

const _vec = new THREE.Vector3()
const _dir = new THREE.Vector3()

export function Bauble({ scale, initialPosition }: BaubleProps) {
  const { nodes } = useGLTF('/cap.glb') as any
  const api = useRef<RapierRigidBody>(null)
  const [isDiscarded, setIsDiscarded] = useState(false)

  const discard = () => {
    if (!api.current) return
    const pos = api.current.translation()
    // Apply a moderate impulse away from the center and slightly towards the camera
    _dir.set(pos.x, pos.y, pos.z + 5).normalize()
    api.current.applyImpulse(_dir.multiplyScalar(35 * scale), true)
    setIsDiscarded(true)
  }

  useFrame((_state, delta) => {
    if (!api.current || isDiscarded) return
    delta = Math.min(0.1, delta)
    api.current.applyImpulse(
      _vec
        .copy(api.current.translation())
        .normalize()
        .multiply({
          x: -50 * delta * scale,
          y: -150 * delta * scale,
          z: -50 * delta * scale
        }),
      true
    )
  })

  return (
    <RigidBody
      linearDamping={isDiscarded ? 2 : 0.75}
      angularDamping={0.15}
      friction={0.2}
      position={initialPosition}
      ref={api as any}
      colliders={false}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === 'pointer') {
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
        onPointerEnter={discard}
        onClick={discard}
      >
        <meshStandardMaterial
          color="#338aca"
          emissive="#61bdaf"
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
        material={capMaterial}
        dispose={null}
      />
    </RigidBody>
  )
}
