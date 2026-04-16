import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'

const _vec = new THREE.Vector3()

export function Pointer() {
  const ref = useRef<RapierRigidBody>(null)
  
  const active = useRef(false)
  
  useFrame(({ mouse, viewport }) => {
    if (!ref.current) return
    if (!active.current && (mouse.x !== 0 || mouse.y !== 0)) active.current = true
    if (!active.current) return

    _vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)
    ref.current.setNextKinematicTranslation(_vec)
  })

  return (
    <RigidBody name="pointer" position={[100, 100, 100]} ref={ref as any} type="kinematicPosition" colliders={false}>
      <BallCollider args={[2]} />
    </RigidBody>
  )
}
