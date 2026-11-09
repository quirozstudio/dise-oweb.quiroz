import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const Scene = lazy(() => import('./demo-portada-scene'))

class MonitorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }

  render() { return this.state.failed ? null : this.props.children }
}

export function HeroMonitor() {
  const stage = useRef<HTMLDivElement>(null)
  const [motion, setMotion] = useState<'pending' | 'reduced' | 'full'>('pending')
  const [contextLost, setContextLost] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotion(preference.matches ? 'reduced' : 'full')
    const timer = window.setTimeout(update, 180)
    preference.addEventListener('change', update)
    return () => {
      window.clearTimeout(timer)
      preference.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const element = stage.current
    const showStill = () => setContextLost(true)
    element?.addEventListener('webglcontextlost', showStill, true)
    return () => element?.removeEventListener('webglcontextlost', showStill, true)
  }, [])

  return (
    <div ref={stage} className="qh-monitor" role="img" aria-label="Monitor 3D sobre una base de piedra con una demostración conceptual de diseño web gastronómico">
      <img className="qh-monitor-fallback" src={`${import.meta.env.BASE_URL}quiroz-monitor-cocina.webp`} alt="" width="1153" height="841" />
      {motion !== 'pending' && !contextLost && (
        <MonitorBoundary>
          <Suspense fallback={null}><Scene monitor reduced={motion === 'reduced'} /></Suspense>
        </MonitorBoundary>
      )}
    </div>
  )
}
