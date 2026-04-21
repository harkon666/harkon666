import { createFileRoute } from '@tanstack/react-router'
import { ThreeScene } from '#/components/ThreeScene'
import { HeroSection, SummarySection, SkillsSection, ContactSection, TreasureSection } from '#/components/Overlays'
import { Suspense, useState, useEffect, useRef, useCallback } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  const setSectionRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionRefs.current.forEach((section, index) => {
      if (!section) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setActiveSection(index)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(section)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="relative w-full bg-[var(--bg-base)]">
      {/* Fixed 3D Canvas overlay */}
      <Suspense fallback={null}>
        <ThreeScene activeSection={activeSection} />
      </Suspense>

      {/* Scrollable HTML sections */}
      <div ref={setSectionRef(0)} className="section">
        <HeroSection isActive={activeSection === 0} />
      </div>

      <div ref={setSectionRef(1)} className="section">
        <SummarySection isActive={activeSection === 1} />
      </div>

      <div ref={setSectionRef(2)} className="section">
        <SkillsSection isActive={activeSection === 2} />
      </div>

      <div ref={setSectionRef(3)} className="section">
        <ContactSection isActive={activeSection === 3} />
      </div>

      <div ref={setSectionRef(4)} className="section">
        <TreasureSection isActive={activeSection === 4} />
      </div>
    </div>
  )
}
