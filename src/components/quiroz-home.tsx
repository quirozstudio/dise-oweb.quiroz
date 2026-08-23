import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import './quiroz-home.css'

const BASE = import.meta.env.BASE_URL
const assets = {
  mark: `${BASE}isotipo-quiroz.jpg`,
  hero: `${BASE}quiroz-hero-architecture.webp`,
  materials: `${BASE}quiroz-editorial-materials.webp`,
  portrait: `${BASE}bryan-quiroz.jpg`,
  casa: `${BASE}casa-paco-fachada.webp`,
  karla: `${BASE}portfolio/karla-masaje.webp`,
  maitagarri: `${BASE}portfolio/maitagarri.webp`,
  north: `${BASE}portfolio/north.webp`,
  nacimientos: `${BASE}portfolio/nacimientos.webp`,
  raices: `${BASE}portfolio/blog.webp`,
}

const projects = [
  { name: 'Casa Paco', type: 'Web · Hostelería', image: assets.casa, href: 'https://casapacopamplona.com/', className: 'qh-project--wide' },
  { name: 'Karla Castañeda', type: 'Web · Bienestar', image: assets.karla, imageAlt: 'Karla Castañeda realizando un masaje profesional en camilla', href: 'https://kcmasajesybelleza.es/' },
  { name: 'Maitagarri', type: 'Campaña · San Fermín', image: assets.maitagarri, href: 'https://padrearatosblog.github.io/maitagarri.sanfermin/' },
  { name: 'North Division', type: 'Concept / Demo', image: assets.north, href: 'https://padrearatosblog.github.io/north.division/', className: 'qh-project--wide' },
  { name: 'Nacimientos Quiroz', type: 'Experiencia · Memoria', image: assets.nacimientos, href: 'https://padrearatosblog.github.io/nacimientos.quiroz/' },
  { name: 'Raíces', type: 'Escritura · Privacidad', image: assets.raices, href: 'https://raices-quiroz.bryans-astorga.chatgpt.site/' },
]

function QuirozIntro() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const exitTimer = window.setTimeout(() => setExiting(true), reducedMotion ? 450 : 2750)
    const closeTimer = window.setTimeout(() => setVisible(false), reducedMotion ? 750 : 3350)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(closeTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  if (!visible) return null
  const skip = () => { setExiting(true); window.setTimeout(() => setVisible(false), 450) }

  return (
    <div className={`qh-intro${exiting ? ' is-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Presentación de Quiroz Digital Studio">
      <div className="qh-intro-light" aria-hidden="true" />
      <div className="qh-intro-frame" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="qh-intro-brand">
        <div className="qh-intro-mark"><span aria-hidden="true" /><img src={assets.mark} alt="" width="340" height="265" /></div>
        <div className="qh-intro-name"><strong>QUIROZ</strong><span>Digital Studio</span><small>Webs con esencia para negocios reales</small></div>
        <div className="qh-intro-signature"><span>Bryans Astorga</span><small>Diseñador web · Pamplona</small></div>
      </div>
      <div className="qh-intro-progress" aria-hidden="true"><i /></div>
      <button type="button" onClick={skip}>Saltar intro <X /></button>
    </div>
  )
}

export function QuirozHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('quiroz-theme') === 'dark' ? 'dark' : 'light')
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = 'Diseño web en Pamplona para negocios locales | Quiroz'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('quiroz-theme', theme)
  }, [theme])

  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: .12 })
    document.querySelectorAll('.qh-reveal').forEach((element) => reveal.observe(element))
    return () => reveal.disconnect()
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero || matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        hero.style.setProperty('--mx', `${(event.clientX / innerWidth - .5) * 14}px`)
        hero.style.setProperty('--my', `${(event.clientY / innerHeight - .5) * 10}px`)
      })
    }
    addEventListener('pointermove', move, { passive: true })
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(frame) }
  }, [])

  return (
    <main className="qh-shell">
      <QuirozIntro />
      <header className="qh-header">
        <a className="qh-brand" href="#inicio" aria-label="Quiroz, inicio"><img src={assets.mark} alt="" width="340" height="265" /><span>QUIROZ<small>Digital Studio</small></span></a>
        <nav className="qh-nav" aria-label="Navegación principal"><a href="#servicios">Servicios</a><a href="#proyectos">Proyectos</a><a href="#sobre-mi">Sobre mí</a></nav>
        <div className="qh-actions"><button type="button" className="qh-theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Activar modo ${theme === 'light' ? 'oscuro' : 'claro'}`}>{theme === 'light' ? <Moon /> : <Sun />}</button><a className="qh-talk" href="#contacto">Hablemos <ArrowUpRight /></a><button type="button" className="qh-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></div>
        {menuOpen && <nav className="qh-mobile-nav" aria-label="Navegación móvil"><a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a><a href="#proyectos" onClick={() => setMenuOpen(false)}>Proyectos</a><a href="#sobre-mi" onClick={() => setMenuOpen(false)}>Sobre mí</a><a href="#contacto" onClick={() => setMenuOpen(false)}>Hablemos</a></nav>}
      </header>

      <section id="inicio" className="qh-hero" ref={heroRef}>
        <img className="qh-hero-image" src={assets.hero} alt="Arquitectura escultórica en piedra y oro creada para Quiroz Digital Studio" width="1672" height="941" fetchPriority="high" />
        <div className="qh-hero-shade" />
        <div className="qh-hero-copy">
          <p className="qh-kicker">Diseño web en Pamplona · Bryans Astorga</p>
          <h1>Tu negocio<br />merece una web<br /><em>que esté a su altura.</em></h1>
          <p>Diseño páginas web con identidad, estrategia y una presencia visual capaz de convertir atención en clientes.</p>
          <div><a className="qh-primary" href="#proyectos">Ver proyectos <ArrowDownRight /></a><a className="qh-secondary" href="#servicios">Qué puedo hacer por ti</a></div>
        </div>
        <div className="qh-hero-index"><span>QUIROZ / 2026</span><span>WEB · IDENTIDAD · SEO LOCAL</span></div>
      </section>

      <section id="servicios" className="qh-offer">
        <div className="qh-offer-visual qh-reveal"><img src={assets.materials} alt="Composición editorial de piedra, papel, cristal y tejido granate" width="1672" height="941" loading="lazy" decoding="async" /><div><span>01</span><strong>Tu negocio ya tiene valor.<br />Mi trabajo es hacer que se note.</strong></div></div>
        <div className="qh-offer-copy qh-reveal"><p className="qh-kicker">Lo que hago</p><h2>Una web clara.<br /><em>Una marca que se recuerda.</em></h2><p>No necesitas más ruido. Necesitas una presencia que explique quién eres, facilite la decisión y dé confianza desde el primer segundo.</p>
          <div className="qh-services"><a href={`${BASE}servicios/diseno-web-restaurantes/`}><span>01</span><b>Diseño web a medida</b><ArrowUpRight /></a><a href={`${BASE}servicios/menus-digitales-qr/`}><span>02</span><b>Cartas y experiencias QR</b><ArrowUpRight /></a><a href={`${BASE}servicios/seo-local/`}><span>03</span><b>SEO local y conversión</b><ArrowUpRight /></a><a href={`${BASE}servicios/`}><span>04</span><b>Identidad y contenido visual</b><ArrowUpRight /></a></div>
        </div>
      </section>

      <section id="proyectos" className="qh-work">
        <header className="qh-work-head qh-reveal"><div><p className="qh-kicker">Trabajo seleccionado</p><h2>No repito fórmulas.<br /><em>Diseño para cada historia.</em></h2></div><p>Hostelería, bienestar, industria y proyectos personales. La dirección cambia; el criterio permanece.</p></header>
        <div className="qh-grid">{projects.map((project, index) => <a className={`qh-project qh-reveal ${project.className ?? ''}`} href={project.href} target="_blank" rel="noreferrer" key={project.name}><figure><img src={project.image} alt={'imageAlt' in project ? project.imageAlt : `Proyecto ${project.name} diseñado por Quiroz`} loading="lazy" decoding="async" /></figure><div><span>0{index + 1} / {project.type}</span><h3>{project.name}</h3><ArrowUpRight /></div></a>)}</div>
      </section>

      <section id="sobre-mi" className="qh-about">
        <div className="qh-about-copy qh-reveal"><p className="qh-kicker">Quién está detrás</p><h2>Un estudio pequeño<br /><em>con ambición grande.</em></h2><p>Soy Bryans Astorga. Trabajo contigo de forma directa para convertir la personalidad de tu negocio en una web útil, reconocible y preparada para crecer.</p><ul><li>Dirección creativa personal</li><li>Diseño mobile first</li><li>Desarrollo, rendimiento y SEO</li></ul></div>
        <figure className="qh-about-photo qh-reveal"><img src={assets.portrait} alt="Bryans Astorga, diseñador web de Quiroz Digital Studio" width="576" height="1280" loading="lazy" decoding="async" /><figcaption>BRYANS ASTORGA / PAMPLONA</figcaption></figure>
      </section>

      <section id="contacto" className="qh-contact"><img src={assets.hero} alt="" aria-hidden="true" loading="lazy" /><div className="qh-reveal"><p className="qh-kicker">Tu proyecto puede ser el siguiente</p><h2>Hagamos que tu negocio<br /><em>se vea como realmente vale.</em></h2><a href="https://wa.me/34618905239?text=Hola%20Bryans%2C%20he%20visto%20tu%20web%20y%20me%20gustar%C3%ADa%20hablar%20sobre%20mi%20proyecto." target="_blank" rel="noreferrer" aria-label="Hablar con Bryans por WhatsApp">Cuéntame tu idea <ArrowUpRight /></a></div></section>

      <footer className="qh-footer"><a className="qh-brand" href="#inicio"><img src={assets.mark} alt="" width="340" height="265" /><span>QUIROZ<small>Digital Studio</small></span></a><p>Diseño web con estrategia, identidad y detalle.</p><span>© 2026 · Pamplona</span></footer>
    </main>
  )
}
