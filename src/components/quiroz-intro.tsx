import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { IntroArt } from './quiroz-intro-art'
import './quiroz-intro.css'

const motionPreference = '(prefers-reduced-motion: reduce)'

export function QuirozIntro({ onFinish }: { onFinish: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [exiting, setExiting] = useState(false)

  useLayoutEffect(() => {
    const element = dialog.current
    if (!element?.showModal) {
      onFinish()
      return
    }
    element.showModal()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [onFinish])

  useEffect(() => {
    if (window.matchMedia(motionPreference).matches) return
    const timer = window.setTimeout(() => setExiting(true), 2700)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!exiting) return
    const duration = window.matchMedia(motionPreference).matches ? 0 : 300
    const timer = window.setTimeout(onFinish, duration)
    return () => window.clearTimeout(timer)
  }, [exiting, onFinish])

  return (
    <dialog
      ref={dialog}
      className={exiting ? 'qi-intro is-exiting' : 'qi-intro'}
      aria-label="Presentación de Quiroz Studio"
      onCancel={event => { event.preventDefault(); setExiting(true) }}
    >
      <IntroArt />
      <div className="qi-intro-content">
        <p className="qi-intro-kicker">Estudio digital · Pamplona</p>
        <p className="qi-intro-title">QUIROZ <span>STUDIO.</span></p>
        <p className="qi-intro-line">Diseño digital por Bryans Astorga</p>
      </div>
      <button className="qi-intro-skip" type="button" onClick={() => setExiting(true)}>
        Entrar al estudio <ArrowUpRight aria-hidden="true" />
      </button>
      <span className="qi-intro-progress" aria-hidden="true" />
    </dialog>
  )
}
