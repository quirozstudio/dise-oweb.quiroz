import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpRight, ChartNoAxesColumnIncreasing, ChevronRight,
  CodeXml, Laptop, Menu, MessageCircle,
  Play, QrCode, X,
} from 'lucide-react'
import projects from '@/content/projects.json'
import { HomePortfolio } from './quiroz-home-portfolio'
import { QuirozIntro } from './quiroz-intro'
import './quiroz-home.css'

const BASE = import.meta.env.BASE_URL
const whatsapp = 'https://wa.me/34618905239'
const contactHref = whatsapp + '?text=' + encodeURIComponent('Hola Bryans, me gustaría hablar sobre un proyecto.')
const links = [
  ['Proyectos', 'proyectos/'],
  ['Servicios', 'servicios/'],
  ['Sobre mí', 'sobre-mi/'],
  ['Pamplona', 'zonas/pamplona/'],
] as const

const services = [
  [Laptop, 'Diseño web y reservas', 'Organizo la carta, la ubicación y las reservas en una web fácil de usar desde el móvil.', BASE + 'servicios/diseno-web-restaurantes/'],
  [QrCode, 'Cartas QR', 'Tus clientes pueden consultar platos, precios e idiomas desde la mesa.', BASE + 'servicios/menus-digitales-qr/'],
  [ChartNoAxesColumnIncreasing, 'SEO local', 'Reviso cómo se encuentra tu negocio en Google y qué información aparece.', BASE + 'servicios/seo-local/'],
] as const

const process = [
  ['Hablamos', 'Me cuentas qué necesita tu negocio y cómo atiendes a tus clientes.'],
  ['Diseño', 'Te enseño una propuesta y revisamos juntos las páginas principales.'],
  ['Probamos', 'Comprobamos desde el móvil la carta, las reservas o el contacto.'],
  ['Publico', 'Pongo la web en marcha y acordamos cómo mantenerla al día.'],
] as const

function Brand() {
  return (
    <a className="qh-header-wordmark" href={BASE} aria-label="Quiroz Studio, inicio">QUIROZ <span>STUDIO.</span></a>
  )
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return links.map(([label, path]) => (
    <a key={path} href={BASE + path} onClick={onNavigate}>{label}</a>
  ))
}

function ContactForm() {
  const [prepared, setPrepared] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const idea = String(data.get('idea') || '').trim()
    const message = encodeURIComponent('Hola Bryans, soy ' + name + '. ' + idea)
    window.open(whatsapp + '?text=' + message, '_blank', 'noopener,noreferrer')
    setPrepared(true)
  }

  return (
    <form className="qh-contact-form" onSubmit={submit} onChange={() => setPrepared(false)}>
      <p className="qh-kicker">Cuéntame tu idea</p>
      <label><span>Tu nombre</span><input name="name" required autoComplete="name" placeholder="Cómo te llamas" /></label>
      <label><span>Tu proyecto</span><textarea name="idea" required rows={4} placeholder="Qué te gustaría crear o mejorar" /></label>
      <button className="qh-button" type="submit">Abrir WhatsApp <ArrowUpRight aria-hidden="true" /></button>
      {prepared && <p role="status">Mensaje preparado para continuar en WhatsApp.</p>}
    </form>
  )
}

function shouldPlayIntro() {
  return document.documentElement.hasAttribute('data-quiroz-intro-pending')
    && !window.location.hash
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function QuirozHome() {
  const shell = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const [intro, setIntro] = useState<'arrival' | 'replay' | null>(() => shouldPlayIntro() ? 'arrival' : null)
  const finishIntro = useCallback(() => setIntro(null), [])
  const [menuOpen, setMenuOpen] = useState(false)
  useLayoutEffect(() => {
    const root = document.documentElement
    const sessionKey = root.dataset.quirozIntroKey
    delete root.dataset.quirozIntroPending
    if (!intro || !sessionKey) return
    try { sessionStorage.setItem(sessionKey, 'true') } catch { /* Storage can be disabled. */ }
  }, [intro])

  useEffect(() => {
    document.title = 'Diseño web en Pamplona para negocios locales | Quiroz'
  }, [])

  useLayoutEffect(() => {
    const root = shell.current
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || media.matches || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.12 })

    root.querySelectorAll('.qh-reveal').forEach(element => observer.observe(element))
    root.classList.add('qh-motion-ready')
    return () => {
      observer.disconnect()
      root.classList.remove('qh-motion-ready')
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButton.current?.focus()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <main className="qh-shell" ref={shell}>
      <a className="qh-skip" href="#hero-title">Saltar al contenido</a>
      <header className="qh-header">
        <Brand />
        <nav className="qh-nav" aria-label="Navegación principal"><NavigationLinks /></nav>
        <div className="qh-actions">
          <a className="qh-header-cta" href="#contacto">Contactar <ArrowUpRight aria-hidden="true" /></a>
          <button className="qh-menu" type="button" ref={menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="qh-mobile-nav">
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <nav className="qh-mobile-nav" id="qh-mobile-nav" hidden={!menuOpen} aria-label="Navegación móvil">
          <NavigationLinks onNavigate={() => setMenuOpen(false)} />
          <a href="#contacto" onClick={() => setMenuOpen(false)}>Hablemos</a>
        </nav>
      </header>

      <section className="qh-hero" aria-labelledby="hero-title">
        <div className="qh-hero-content">
          <p className="qh-kicker">Estudio digital · Pamplona <span className="qh-kicker-rule" /></p>
          <h1 id="hero-title" tabIndex={-1}>
            <span>Hay ideas que merecen</span>{' '}
            <em>algo más que una plantilla.</em>
          </h1>
          <p>Escucho, interpreto y doy forma a lo que hace diferente a cada negocio. Diseño y desarrollo webs desde cero, con identidad propia, funciones a medida y una estrategia para que también puedan encontrarlas.</p>
          <div className="qh-hero-buttons">
            <a className="qh-button" href="#portfolio">Ver proyectos <ArrowUpRight aria-hidden="true" /></a>
            <a className="qh-link" href={BASE + 'sobre-mi/'}>Sobre mí</a>
          </div>
        </div>
        <figure className="qh-featured-project">
          <a href={BASE + 'proyectos/#casa-paco'}>
            <img src={BASE + 'portfolio/captura-casa-paco.webp'} alt="Captura de la web de Casa Paco" fetchPriority="high" />
            <span>Casa Paco · Web y carta QR <ArrowUpRight aria-hidden="true" /></span>
          </a>
        </figure>
      </section>

      <HomePortfolio items={projects} />

      <section className="qh-services qh-section" aria-labelledby="qh-services-title">
        <header className="qh-band-heading">
          <p className="qh-kicker">Servicios <span className="qh-kicker-rule" /></p>
          <h2 id="qh-services-title">Diseño web, cartas QR y visibilidad en Google</h2>
        </header>
        <ul className="qh-service-list">
          {services.map(([Icon, title, description, href]) => (
            <li key={title}>
              <a href={href}>
                <Icon aria-hidden="true" />
                <h3>{title} <ArrowUpRight aria-hidden="true" /></h3>
                <p>{description}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="qh-about qh-section" aria-labelledby="qh-about-title">
        <figure className="qh-portrait">
          <img src={BASE + 'bryans-foto-instagram.png'} alt="Bryans Astorga trabajando en una cafetería" width="1536" height="1024" loading="lazy" decoding="async" />
        </figure>
        <div className="qh-about-content">
          <p className="qh-kicker">Sobre mí <span className="qh-kicker-rule" /></p>
          <h2 id="qh-about-title">Bryans Astorga</h2>
          <p>Trabajo contigo desde la primera conversación hasta la publicación. Empiezo por lo que tus clientes necesitan encontrar o hacer en tu web.</p>
          <a className="qh-signature" href={BASE + 'sobre-mi/'} aria-label="Conocer más sobre Bryans Astorga">Bryans Astorga <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="qh-process qh-section" aria-labelledby="qh-process-title">
        <header className="qh-band-heading">
          <p className="qh-kicker">Cómo trabajo <span className="qh-kicker-rule" /></p>
          <h2 id="qh-process-title">De la primera conversación a la publicación</h2>
        </header>
        <ol className="qh-process-list">
          {process.map(([title, description], index) => (
            <li key={title}>
              <span aria-hidden="true">{index + 1}</span>
              <h3>{title}</h3><p>{description}</p>
              {index < process.length - 1 && <ChevronRight aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>

      <div className="qh-closing">

        <section id="contacto" className="qh-contact qh-section" aria-labelledby="qh-contact-title">
          <div className="qh-contact-banner">
            <MessageCircle className="qh-contact-icon" aria-hidden="true" />
            <div className="qh-contact-copy">
              <h2 id="qh-contact-title">Hablemos de tu proyecto</h2>
              <p>Cuéntame qué quieres crear o qué te gustaría mejorar en tu web.</p>
            </div>
            <a className="qh-button" href={contactHref} target="_blank" rel="noreferrer">Escribirme por WhatsApp <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <details className="qh-contact-details">
            <summary>Preparar un mensaje para Bryans</summary>
            <ContactForm />
          </details>
        </section>
      </div>

      <footer className="qh-footer">
        <div className="qh-footer-top">
          <Brand />
          <nav aria-label="Enlaces del pie"><NavigationLinks /></nav>
          <div className="qh-footer-social">
            <button className="qh-footer-intro" type="button" onClick={() => setIntro('replay')}>
              <Play aria-hidden="true" /> Ver intro
            </button>
            <a href={contactHref} target="_blank" rel="noreferrer" aria-label="Quiroz Studio en WhatsApp"><MessageCircle aria-hidden="true" /></a>
            <a href="https://github.com/quirozstudio" target="_blank" rel="noreferrer" aria-label="Quiroz Studio en GitHub"><CodeXml aria-hidden="true" /></a>
          </div>
        </div>
        <div className="qh-footer-bottom">
          <small>© 2026 Quiroz Studio. Todos los derechos reservados.</small>
          <small>Diseño web en Pamplona · Hostelería · Comercios · Servicios</small>
        </div>
      </footer>
      {intro && <QuirozIntro onFinish={finishIntro} />}
    </main>
  )
}
