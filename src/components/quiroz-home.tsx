import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpRight, Award, CalendarDays, ChartNoAxesColumnIncreasing, ChevronRight,
  CodeXml, Heart, Laptop, Layers2, MapPin, Menu, MessageCircle, Monitor, Moon,
  Play, QrCode, Sun, Target, UsersRound, X, Zap,
} from 'lucide-react'
import projects from '@/content/projects.json'
import { HomePortfolio } from './quiroz-home-portfolio'
import { HeroMonitor } from './quiroz-hero-monitor'
import { QuirozIntro } from './quiroz-intro'
import './quiroz-home.css'

const BASE = import.meta.env.BASE_URL
const introSessionKey = 'quiroz-intro-v2-seen'
const whatsapp = 'https://wa.me/34618905239'
const contactHref = whatsapp + '?text=' + encodeURIComponent('Hola Bryans, me gustaría hablar sobre un proyecto.')
const links = [
  ['Proyectos', 'proyectos/'],
  ['Servicios', 'servicios/'],
  ['Sobre mí', 'sobre-mi/'],
  ['Pamplona', 'zonas/pamplona/'],
] as const

const services = [
  [Laptop, 'Diseño web', 'Una web rápida, a medida y adaptada a tu negocio.', BASE + 'servicios/diseno-web-restaurantes/'],
  [QrCode, 'Cartas QR', 'Digitaliza tu carta y facilita su consulta desde el móvil.', BASE + 'servicios/menus-digitales-qr/'],
  [CalendarDays, 'Reservas online', 'Integra reservas y accesos directos de contacto.', '#contacto'],
  [ChartNoAxesColumnIncreasing, 'Visibilidad local', 'Ayuda a que te encuentren cuando buscan en tu zona.', BASE + 'servicios/seo-local/'],
] as const

const process = [
  ['Hablamos', 'Conocemos tu negocio y tus objetivos.'],
  ['Diseñamos', 'Creamos una propuesta visual y funcional.'],
  ['Desarrollamos', 'Construimos y probamos la web.'],
  ['Lanzamos', 'Publicamos y te acompañamos después.'],
] as const

const aboutPoints = [
  [Heart, 'Cercanía real', 'Acompañamiento en todo el proceso.'],
  [Target, 'Objetivos claros', 'Cada decisión responde a lo que necesita tu negocio.'],
  [MapPin, 'Conocimiento local', 'Desde Pamplona, para negocios de toda España.'],
] as const

const advantages = [
  [Award, 'Diseño con identidad', 'Webs alineadas con la voz y el carácter de tu marca.'],
  [Zap, 'Rápidas y adaptadas', 'Preparadas para el móvil y los buscadores.'],
  [UsersRound, 'Acompañamiento real', 'Soporte, mantenimiento y mejoras.'],
  [MapPin, 'Desde Pamplona', 'Una visión local y un trato cercano.'],
] as const

function Brand() {
  return (
    <a className="qh-header-wordmark" href={BASE} aria-label="Quiroz Studio, inicio">QUIROZ <span>STUDIO.</span></a>
  )
}

function FeatureList({ items, className }: {
  items: typeof aboutPoints | typeof advantages
  className: string
}) {
  return (
    <ul className={className}>
      {items.map(([Icon, title, description]) => (
        <li key={title}>
          <Icon aria-hidden="true" />
          <div><h3>{title}</h3><p>{description}</p></div>
        </li>
      ))}
    </ul>
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
  if (window.location.pathname !== BASE || window.location.hash) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try { return sessionStorage.getItem(introSessionKey) !== 'true' } catch { return false }
}

export function QuirozHome() {
  const shell = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const [intro, setIntro] = useState<'arrival' | 'replay' | null>(() => shouldPlayIntro() ? 'arrival' : null)
  const finishIntro = useCallback(() => setIntro(null), [])
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try { return localStorage.getItem('quiroz-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    if (!intro) return
    try { sessionStorage.setItem(introSessionKey, 'true') } catch { /* Storage can be disabled. */ }
  }, [intro])

  useEffect(() => {
    document.title = 'Diseño web en Pamplona para negocios locales | Quiroz'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('quiroz-theme', theme) } catch { /* Storage can be disabled. */ }
  }, [theme])

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
          <button className="qh-theme" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}>
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
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
            <span>Tu negocio merece</span>{' '}
            <span>una presencia digital</span>{' '}
            <em>a su altura.</em>
          </h1>
          <p>Diseño web y soluciones digitales para negocios que quieren destacar, transmitir confianza y conectar con sus clientes.</p>
          <div className="qh-hero-buttons">
            <a className="qh-button" href="#portfolio">Explorar proyectos <ArrowUpRight aria-hidden="true" /></a>
            <a className="qh-link" href={BASE + 'sobre-mi/'}>Sobre el estudio</a>
          </div>
          <ul className="qh-hero-points" aria-label="Enfoque del estudio">
            <li><Monitor aria-hidden="true" /><span>Diseño web<br /> a medida</span></li>
            <li><Layers2 aria-hidden="true" /><span>Experiencia<br /> digital cuidada</span></li>
            <li><ChartNoAxesColumnIncreasing aria-hidden="true" /><span>Resultados<br /> para tu negocio</span></li>
          </ul>
        </div>
        <figure className="qh-hero-art">
          <HeroMonitor defer={intro === 'arrival'} />
        </figure>
      </section>

      <HomePortfolio items={projects} />

      <section className="qh-services qh-section" aria-labelledby="qh-services-title">
        <header className="qh-band-heading">
          <p className="qh-kicker">Servicios <span className="qh-kicker-rule" /></p>
          <h2 id="qh-services-title">Soluciones digitales para negocios reales</h2>
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
          <img src={BASE + 'bryan-quiroz.jpg'} alt="Bryans Astorga en su estudio" width="576" height="1280" loading="lazy" decoding="async" />
        </figure>
        <div className="qh-about-content">
          <p className="qh-kicker">Sobre mí <span className="qh-kicker-rule" /></p>
          <h2 id="qh-about-title">Bryans Astorga</h2>
          <p>Diseñador web y creador digital. Ayudo a negocios de hostelería, comercios y servicios a tener una presencia online profesional, cercana y efectiva.</p>
          <a className="qh-signature" href={BASE + 'sobre-mi/'} aria-label="Conocer más sobre Bryans Astorga">Bryans Astorga <ArrowUpRight aria-hidden="true" /></a>
        </div>
        <FeatureList items={aboutPoints} className="qh-about-points" />
      </section>

      <section className="qh-process qh-section" aria-labelledby="qh-process-title">
        <header className="qh-band-heading">
          <p className="qh-kicker">Nuestro proceso <span className="qh-kicker-rule" /></p>
          <h2 id="qh-process-title">De tu idea a una web que funciona</h2>
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
        <section className="qh-trust qh-section" aria-labelledby="qh-trust-title">
          <h2 className="qh-kicker" id="qh-trust-title">¿Por qué Quiroz Studio? <span className="qh-kicker-rule" /></h2>
          <FeatureList items={advantages} className="qh-trust-points" />
        </section>

        <section id="contacto" className="qh-contact qh-section" aria-labelledby="qh-contact-title">
          <div className="qh-contact-banner">
            <MessageCircle className="qh-contact-icon" aria-hidden="true" />
            <div className="qh-contact-copy">
              <h2 id="qh-contact-title">Hablemos de tu proyecto</h2>
              <p>Cuéntame tu idea y veamos cómo podemos darle forma.</p>
            </div>
            <a className="qh-button" href={contactHref} target="_blank" rel="noreferrer">Contactar ahora <ArrowUpRight aria-hidden="true" /></a>
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
