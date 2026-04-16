import { createFileRoute } from '@tanstack/react-router'
import { ThreeScene } from '#/components/ThreeScene'
import { Underlay } from '#/components/Overlays'
import { Suspense } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      <Underlay />
      <Suspense fallback={null}>
        <ThreeScene />
      </Suspense>
    </div>
  )
}
