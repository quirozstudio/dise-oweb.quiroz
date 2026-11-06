import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import projects from '@/content/projects.json'
import { PortfolioGrid } from './portfolio'
import './quiroz-home.css'

const BASE = import.meta.env.BASE_URL
const WHATSAPP = '34618905239'
const whatsapp = `https://wa.me/${WHATSAPP}`
const assets = {
  mark: `${BASE}isotipo-quiroz.jpg`,
  hero: `${BASE}quiroz-hero-architecture.webp`,
  portrait: `${BASE}bryan-quiroz.jpg`,
}

const services = [
  ['01', 'Diseño y desarrollo web', 'Webs a medida que explican mejor tu negocio, transmiten confianza y funcionan desde el móvil.', `${BASE}servicios/diseno-web-restaurantes/`],
  ['02', 'Cartas y soluciones QR', 'Experiencias digitales claras, actualizables y coherentes con la identidad del local.', `${BASE}servicios/menus-digitales-qr/`],
  ['03', 'SEO local y continuidad', 'Una base técnica cuidada y acompañamiento para que tu presencia digital siga teniendo sentido.', `${BASE}servicios/seo-local/`],
]

const process = [
  ['01', 'Conversamos', 'Entiendo tu negocio, tu público y el momento en el que está.'],
  ['02', 'Definimos', 'Ordenamos prioridades y elegimos una solución proporcionada.'],
  ['03', 'Construimos', 'Diseño y desarrollo la experiencia con atención al detalle.'],
  ['04', 'Acompañamos', 'Publicamos, revisamos y dejamos una base fácil de mantener.'],
]

function Brand() {
  return <a className="qh-brand" href={BASE} aria-label="Quiroz Studio, inicio"><img src={assets.mark} alt="" width="340" height="265" /><span>QUIROZ<small>Digital Studio</small></span></a>
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const idea = String(data.get('idea') || '').trim()
    window.open(`${whatsapp}?text=${encodeURIComponent(`Hola Bryans, soy ${name}. ${idea}`)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }
  return <form className="qh-contact-form" onSubmit={submit}><label><span>Tu nombre</span><input name="name" required autoComplete="name" placeholder="Cómo te llamas" /></label><label><span>Cuéntame tu proyecto</span><textarea name="idea" required rows={5} placeholder="Qué necesitas, qué estás imaginando o qué quieres mejorar" /></label><div><button type="submit">Abrir conversación <ArrowUpRight aria-hidden="true" /></button>{sent && <p role="status">WhatsApp se ha abierto con tu mensaje preparado.</p>}</div></form>
}

export function QuirozHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try { return localStorage.getItem('quiroz-theme') === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    document.title = 'Diseño web en Pamplona para negocios locales | Quiroz'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('quiroz-theme', theme) } catch { /* storage may be disabled */ }
  }, [theme])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting)), { threshold: .15 })
    document.querySelectorAll('.qh-reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const featured = projects.slice(0, 4)

  return <main className="qh-shell">
    <header className="qh-header"><Brand /><nav className="qh-nav" aria-label="Navegación principal"><a href={`${BASE}proyectos/`}>Proyectos</a><a href={`${BASE}servicios/`}>Servicios</a><a href={`${BASE}sobre-mi/`}>Sobre mí</a><a href={`${BASE}zonas/pamplona/`}>Pamplona</a></nav><div className="qh-actions"><button type="button" className="qh-theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Activar modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}>{theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button><a className="qh-header-cta" href="#contacto">Hablemos <ArrowUpRight aria-hidden="true" /></a><button type="button" className="qh-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div>{menuOpen && <nav className="qh-mobile-nav" aria-label="Navegación móvil"><a href={`${BASE}proyectos/`} onClick={closeMenu}>Proyectos</a><a href={`${BASE}servicios/`} onClick={closeMenu}>Servicios</a><a href={`${BASE}sobre-mi/`} onClick={closeMenu}>Sobre mí</a><a href={`${BASE}zonas/pamplona/`} onClick={closeMenu}>Pamplona</a><a href="#contacto" onClick={closeMenu}>Hablemos</a></nav>}</header>

    <section className="qh-hero" aria-labelledby="hero-title"><div className="qh-hero-image"><img src={assets.hero} alt="Composición arquitectónica creada para Quiroz Digital Studio" width="1672" height="941" fetchPriority="high" /></div><div className="qh-hero-overlay" /><div className="qh-hero-content"><p className="qh-kicker">Quiroz Studio · Pamplona, Navarra</p><h1 id="hero-title">Diseño web en Pamplona<br />para negocios con una <em>presencia clara.</em></h1><p>Diseño web, identidad digital y soluciones a medida para negocios que quieren transmitir confianza y ofrecer una mejor experiencia a sus clientes.</p><div className="qh-hero-buttons"><a className="qh-button" href={`${BASE}proyectos/`}>Explorar proyectos <ArrowUpRight aria-hidden="true" /></a><a className="qh-underlink" href={`${BASE}sobre-mi/`}>Conocer el estudio <ArrowUpRight aria-hidden="true" /></a></div></div><div className="qh-hero-footer"><span>WEB · IDENTIDAD · SEO LOCAL</span><span>01 / 05</span><a href="#portfolio" aria-label="Ver portfolio"><ArrowDown aria-hidden="true" /></a></div></section>

    <section className="qh-statement qh-section"><div className="qh-section-label"><span>01</span><span>La intención</span></div><div className="qh-statement-content qh-reveal"><p className="qh-kicker">Una web debe hacer algo más que verse bien</p><h2>Tu negocio ya tiene una historia. <em>Vamos a hacer que se note.</em></h2><div className="qh-statement-bottom"><p>Trabajo contigo para ordenar lo que quieres comunicar, convertirlo en una experiencia digital propia y dejar una base que puedas entender y mantener.</p><a className="qh-link" href={`${BASE}sobre-mi/`}>Sobre el estudio <ArrowUpRight aria-hidden="true" /></a></div></div></section>

    <section id="portfolio" className="qh-portfolio qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">02 / Trabajo seleccionado</p><h2>Proyectos que<br /><em>hablan por sí solos.</em></h2></div><p>Trabajos publicados, proyectos realizados y conceptos claramente identificados. Cada uno nace de una necesidad distinta.</p></header><PortfolioGrid items={featured} /><div className="qh-portfolio-footer"><p>Hay más historias detrás del estudio.</p><a className="qh-link" href={`${BASE}proyectos/`}>Ver todos los proyectos <ArrowUpRight aria-hidden="true" /></a></div></section>

    <section className="qh-about qh-section"><div className="qh-about-image qh-reveal"><img src={assets.portrait} alt="Bryans Astorga, diseñador web de Quiroz Digital Studio" width="576" height="1280" loading="lazy" decoding="async" /><span>Bryans Astorga<br />Pamplona · Navarra</span></div><div className="qh-about-content qh-reveal"><p className="qh-kicker">03 / Quién está detrás</p><h2>Una persona real detrás de cada <em>decisión.</em></h2><p>Soy Bryans, la persona detrás de Quiroz Studio. Trabajo con negocios que quieren mejorar su presencia digital sin perder su esencia. Me implico en entender cada proyecto para desarrollar soluciones que tengan sentido para sus clientes.</p><ul><li>Dirección creativa personal</li><li>Diseño y desarrollo</li><li>SEO local y rendimiento</li></ul><a className="qh-link" href={`${BASE}sobre-mi/`}>Conocer más sobre mí <ArrowUpRight aria-hidden="true" /></a></div></section>

    <section className="qh-services qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">04 / Servicios</p><h2>Lo necesario para<br /><em>hacerlo bien.</em></h2></div><p>Una selección de servicios claros, sin listados interminables ni soluciones que no aportan al negocio.</p></header><div className="qh-service-list">{services.map(([number, title, text, href]) => <a className="qh-service qh-reveal" href={href} key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowUpRight aria-hidden="true" /></a>)}</div></section>

    <section className="qh-process qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">05 / Forma de trabajar</p><h2>Directo, claro<br /><em>y con intención.</em></h2></div><p>Un proceso sencillo, con una misma persona escuchando, pensando y construyendo el proyecto contigo.</p></header><ol className="qh-process-list">{process.map(([number, title, text]) => <li className="qh-process-item qh-reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

    <section id="contacto" className="qh-contact qh-section"><div className="qh-contact-copy qh-reveal"><p className="qh-kicker">06 / Contacto</p><h2>Tu próximo proyecto empieza con <em>una conversación.</em></h2><p>Cuéntame qué tienes en mente y veremos cómo convertirlo en una solución digital que encaje con tu negocio.</p><div className="qh-contact-links"><a href={`${whatsapp}?text=Hola%20Bryans%2C%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto.`} target="_blank" rel="noreferrer"><span>WhatsApp</span><b>Escribir a Bryans <ArrowUpRight aria-hidden="true" /></b></a><a href={`${BASE}zonas/pamplona/`}><span>Zona de trabajo</span><b>Pamplona · Navarra <ArrowUpRight aria-hidden="true" /></b></a><a href="https://github.com/quirozstudio" target="_blank" rel="noreferrer"><span>Trabajo público</span><b>GitHub / Quiroz <ArrowUpRight aria-hidden="true" /></b></a></div></div><ContactForm /></section>

    <footer className="qh-footer"><Brand /><p>Diseño web, identidad digital y soluciones a medida para negocios locales.</p><nav aria-label="Enlaces del pie"><a href={`${BASE}proyectos/`}>Proyectos</a><a href={`${BASE}servicios/`}>Servicios</a><a href={`${BASE}sobre-mi/`}>Sobre mí</a><a href={`${BASE}zonas/pamplona/`}>Pamplona</a></nav><small>© 2026 · Quiroz Studio</small></footer>
  </main>
}
