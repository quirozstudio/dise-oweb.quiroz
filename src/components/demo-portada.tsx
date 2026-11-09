import { lazy, Suspense, Component, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Code2, QrCode, Image, MapPin, Settings } from 'lucide-react'
import './demo-portada.css'
const Scene = lazy(() => import('./demo-portada-scene'))
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}
export function Restaurant() {
  return <div className="qd-restaurant"><header><b>Restaurante</b><span>Cocina · Esencia · Reservas</span></header><div className="qd-food"><small>EL ARTE DE COMPARTIR</small><h2>El sabor de<br/><i>quedarse.</i></h2><span className="qd-reserve">Reservar mesa ↗</span></div><footer><span>Cocina de temporada</span><svg viewBox="0 0 120 35" aria-hidden="true"><path d="M2 32 L24 27 L43 29 L64 16 L83 19 L118 3" fill="none" stroke="#d6be9f" strokeWidth="2"/></svg><small>Concepto visual</small></footer></div>
}
export default function DemoPortada() {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    const timer = window.setTimeout(() => setReady(true), 150)
    const previous = document.title
    document.title = 'Quiroz Studio · Demo portada 3D'
    const robots = document.createElement('meta'); robots.name = 'robots'; robots.content = 'noindex, nofollow'; document.head.append(robots)
    return () => { clearTimeout(timer); media.removeEventListener('change', update); document.title = previous; robots.remove() }
  }, [])
  return <main className="qd"><a className="qd-skip" href="#qd-content">Saltar al contenido</a><header className="qd-nav"><a href="/" aria-label="Quiroz Studio, inicio"><img src="/logo-quiroz.svg" alt="Quiroz Studio"/></a><nav aria-label="Navegación de la demostración"><a href="/proyectos/">Proyectos</a><a href="#qd-services">Servicios</a><a href="/#contacto">Hablemos ↗</a></nav></header><section className="qd-hero" id="qd-content"><div className="qd-copy"><p className="qd-eyebrow">ESTUDIO INDEPENDIENTE · PAMPLONA</p><h1>Diseñamos la<br/>presencia digital<br/><em>que tu negocio<br className="qd-title-break"/> merece.</em></h1><p className="qd-description">Webs que atraen, comunican y convierten, especializadas en hostelería, comercios y empresas.</p><div className="qd-buttons"><a href="/proyectos/">Ver proyectos reales ↗</a><a href="/#contacto">Hablemos de tu negocio ↗</a></div><div className="qd-sign"><span>Bryans Astorga</span><small>Diseñador y desarrollador web</small></div></div><div className="qd-visual" role="img" aria-label="Portátil grafito con una propuesta conceptual de web gastronómica"><div className="qd-static"><Restaurant/><div className="qd-base"/></div>{ready && <SceneBoundary><Suspense fallback={null}><Scene reduced={reduced}/></Suspense></SceneBoundary>}<p className="qd-caption">DISEÑO CON INTENCIÓN. PRESENCIA CON CARÁCTER.<br/><small>Restaurante · Demostración conceptual</small></p></div></section><section className="qd-services" id="qd-services" aria-label="Servicios"><span><Code2 aria-hidden="true"/>Diseño web a medida</span><span><QrCode aria-hidden="true"/>Cartas y menús QR</span><span><Image aria-hidden="true"/>Contenido visual</span><span><MapPin aria-hidden="true"/>Posicionamiento local</span><span><Settings aria-hidden="true"/>Mantenimiento web</span></section><section className="qd-metrics"><div className="qd-metrics-intro"><p>El valor está en los detalles.</p><span>Datos reales · Pendientes de confirmar</span></div><dl><div><dt>Clientes</dt><dd>Por confirmar</dd></div><div><dt>Proyectos</dt><dd>Por confirmar</dd></div><div><dt>Experiencia</dt><dd>Por confirmar</dd></div></dl></section></main>
}
