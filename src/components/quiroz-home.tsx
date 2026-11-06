import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import projects from '@/content/projects.json'
import { PortfolioGrid } from './portfolio'
import './quiroz-home.css'

const BASE = import.meta.env.BASE_URL
const WHATSAPP = '34618905239'
const whatsappBase = `https://wa.me/${WHATSAPP}`
const assets = {
  mark: `${BASE}isotipo-quiroz.jpg`,
  portrait: `${BASE}bryan-quiroz.jpg`,
  casa: `${BASE}casa-paco-fachada.webp`,
  maitagarri: `${BASE}portfolio/maitagarri.webp`,
  north: `${BASE}portfolio/north.webp`,
}

const services = [
  { number: '01', title: 'Diseño y desarrollo web', text: 'Webs corporativas, páginas de servicio y experiencias digitales adaptadas a la forma real de trabajar de cada negocio.', href: `${BASE}servicios/diseno-web-restaurantes/` },
  { number: '02', title: 'Soluciones digitales para negocios', text: 'Cartas QR, experiencias multilingües y herramientas digitales que resuelven una necesidad concreta sin añadir complejidad.', href: `${BASE}servicios/menus-digitales-qr/` },
  { number: '03', title: 'Presencia digital y mantenimiento', text: 'SEO local, rendimiento y acompañamiento para que la web siga siendo útil después de publicarla.', href: `${BASE}servicios/seo-local/` },
]

const process = [
  ['01', 'Conversamos', 'Conocemos el negocio, el momento en el que está y lo que debe entender el cliente.'],
  ['02', 'Proponemos', 'Definimos una dirección visual y una solución proporcionada al objetivo real.'],
  ['03', 'Desarrollamos', 'Diseñamos y construimos la experiencia con atención a móvil, accesibilidad y rendimiento.'],
  ['04', 'Publicamos y acompañamos', 'Ponemos el proyecto en marcha y dejamos una base preparada para seguir creciendo.'],
]

const caseStudies = projects.filter(({ id }) => ['maitagarri', 'casa-paco', 'north-division'].includes(id))

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={footer ? 'qh-brand qh-brand--footer' : 'qh-brand'} href={BASE} aria-label="Quiroz Studio, inicio"><img src={assets.mark} alt="" width="340" height="265" /><span>QUIROZ<small>Digital Studio</small></span></a>
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const business = String(data.get('business') || '').trim()
    const idea = String(data.get('idea') || '').trim()
    const message = `Hola Bryans, soy ${name}. ${business ? `Mi negocio es ${business}. ` : ''}${idea}`
    window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  return <form className="qh-contact-form" onSubmit={submit}>
    <div className="qh-form-fields">
      <label><span>Tu nombre</span><input name="name" required autoComplete="name" placeholder="Cómo te llamas" /></label>
      <label><span>Tu negocio <small>opcional</small></span><input name="business" autoComplete="organization" placeholder="Nombre del negocio" /></label>
    </div>
    <label><span>Qué tienes en mente</span><textarea name="idea" required rows={4} placeholder="Cuéntame brevemente qué necesitas" /></label>
    <div className="qh-form-submit"><button type="submit">Enviar por WhatsApp <ArrowUpRight aria-hidden="true" /></button>{submitted && <p role="status">Se ha abierto WhatsApp con tu mensaje preparado.</p>}</div>
  </form>
}

export function QuirozHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('quiroz-theme') === 'dark' ? 'dark' : 'light')

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

  const closeMenu = () => setMenuOpen(false)

  return <main className="qh-shell">
    <header className="qh-header">
      <Brand />
      <nav className="qh-nav" aria-label="Navegación principal"><a href={`${BASE}proyectos/`}>Proyectos</a><a href={`${BASE}servicios/`}>Servicios</a><a href={`${BASE}sobre-mi/`}>Sobre mí</a><a href={`${BASE}zonas/pamplona/`}>Pamplona</a></nav>
      <div className="qh-actions"><button type="button" className="qh-theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Activar modo ${theme === 'light' ? 'oscuro' : 'claro'}`}>{theme === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}</button><a className="qh-talk" href="#contacto">Hablemos <ArrowUpRight aria-hidden="true" /></a><button type="button" className="qh-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div>
      {menuOpen && <nav className="qh-mobile-nav" aria-label="Navegación móvil"><a href={`${BASE}proyectos/`} onClick={closeMenu}>Proyectos</a><a href={`${BASE}servicios/`} onClick={closeMenu}>Servicios</a><a href={`${BASE}sobre-mi/`} onClick={closeMenu}>Sobre mí</a><a href={`${BASE}zonas/pamplona/`} onClick={closeMenu}>Pamplona</a><a href="#contacto" onClick={closeMenu}>Hablemos</a></nav>}
    </header>

    <section className="qh-hero" aria-labelledby="hero-title">
      <div className="qh-hero-copy"><p className="qh-kicker">Quiroz Studio · Pamplona, Navarra</p><h1 id="hero-title">Diseño web en<br /><em>Pamplona</em> para negocios<br />locales.</h1><p>Diseñamos experiencias digitales que hacen destacar tu negocio, transmiten confianza y ayudan a tus clientes a decidir.</p><div className="qh-hero-actions"><a className="qh-primary" href={`${BASE}proyectos/`}>Explorar proyectos <ArrowDownRight aria-hidden="true" /></a><a className="qh-secondary" href={`${BASE}sobre-mi/`}>Conocer el estudio <ArrowUpRight aria-hidden="true" /></a></div></div>
      <div className="qh-hero-collage" aria-label="Selección de proyectos de Quiroz Studio"><figure className="qh-collage-main"><img src={assets.maitagarri} alt="Proyecto Maitagarri para hostelería en Pamplona" width="1023" height="1537" fetchPriority="high" /><figcaption>Maitagarri <span>Proyecto realizado</span></figcaption></figure><figure className="qh-collage-secondary"><img src={assets.casa} alt="Fachada del restaurante Casa Paco" width="1024" height="1536" /><figcaption>Casa Paco</figcaption></figure><figure className="qh-collage-tertiary"><img src={assets.north} alt="Concepto visual North Division" width="1500" height="844" /><figcaption>North Division <span>Concepto / demo</span></figcaption></figure><span className="qh-collage-stamp">WEB<br />IDENTIDAD<br />SEO LOCAL</span></div>
      <div className="qh-hero-foot"><span>01 / 05</span><span>Diseño · Desarrollo · Dirección digital</span><a href="#proyectos" aria-label="Bajar al portfolio"><ArrowDownRight aria-hidden="true" /></a></div>
    </section>

    <section className="qh-introduction qh-section"><div className="qh-section-marker"><span>01</span><span>La idea</span></div><div className="qh-introduction-body qh-reveal"><p className="qh-kicker">Una presencia con sentido</p><h2>Tu negocio ya tiene algo que decir. <em>La web debe saber contarlo.</em></h2><div className="qh-introduction-detail"><p>Quiroz Studio es un estudio digital independiente. Trabajo directamente contigo para convertir la personalidad de tu negocio en una experiencia web útil, reconocible y preparada para crecer.</p><a className="qh-text-link" href={`${BASE}sobre-mi/`}>Conocer el estudio <ArrowUpRight aria-hidden="true" /></a></div></div></section>

    <section id="proyectos" className="qh-portfolio qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">02 / Portfolio destacado</p><h2>Trabajos que<br /><em>hablan por sí solos.</em></h2></div><p>Cada negocio tiene su identidad. Cada proyecto merece una solución propia. Aquí puedes ver trabajos publicados, proyectos realizados, conceptos y experiencias personales, siempre identificados con claridad.</p></header><PortfolioGrid items={projects} featuredId="maitagarri" /><div className="qh-centered-link"><a className="qh-text-link" href={`${BASE}proyectos/`}>Ver el portfolio completo <ArrowUpRight aria-hidden="true" /></a></div></section>

    <section className="qh-cases qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">03 / Casos y decisiones</p><h2>El trabajo se entiende<br /><em>cuando ves el porqué.</em></h2></div><p>No inventamos métricas. Mostramos decisiones, soluciones y resultados funcionales que pueden comprobarse en cada proyecto.</p></header><div className="qh-case-list">{caseStudies.map((project, index) => <article className="qh-case qh-reveal" key={project.id}><div className="qh-case-number">0{index + 1}</div><div className="qh-case-image"><img src={`${BASE}${project.image.slice(1)}`} alt={project.alt} loading="lazy" decoding="async" /></div><div className="qh-case-copy"><p className="qh-kicker">{project.sector}</p><h3>{project.name}</h3><dl><div><dt>Situación</dt><dd>{project.statement}</dd></div><div><dt>Solución</dt><dd>{project.outcome}</dd></div></dl><a className="qh-text-link" href={project.href.startsWith('/') ? `${BASE}${project.href.slice(1)}` : project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined}>Ver proyecto <ArrowUpRight aria-hidden="true" /></a></div></article>)}</div></section>

    <section id="sobre-mi" className="qh-about qh-section"><div className="qh-section-marker"><span>04</span><span>El estudio</span></div><div className="qh-about-photo qh-reveal"><img src={assets.portrait} alt="Bryans Astorga, diseñador web de Quiroz Digital Studio" width="576" height="1280" loading="lazy" decoding="async" /><span>Bryans Astorga<br />Diseñador web · Pamplona</span></div><div className="qh-about-copy qh-reveal"><p className="qh-kicker">Una persona detrás de cada proyecto</p><h2>Un estudio con identidad. <em>Una relación directa.</em></h2><p>Soy Bryans, la persona detrás de Quiroz Studio. Trabajo con negocios que quieren mejorar su presencia digital sin perder su esencia. Me implico en entender cada proyecto para desarrollar soluciones que tengan sentido para sus clientes.</p><ul><li>Dirección creativa personal</li><li>Diseño mobile first</li><li>Desarrollo, rendimiento y SEO</li></ul><a className="qh-text-link" href={`${BASE}sobre-mi/`}>Conocer más sobre mí <ArrowUpRight aria-hidden="true" /></a></div></section>

    <section id="servicios" className="qh-services qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">05 / Qué puedo hacer</p><h2>Soluciones que<br /><em>tienen una función.</em></h2></div><p>No se trata de añadir más cosas. Se trata de resolver mejor lo que tu cliente necesita entender, consultar o hacer.</p></header><div className="qh-service-grid">{services.map((service) => <a className="qh-service qh-reveal" href={service.href} key={service.number}><span className="qh-service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><span className="qh-service-link">Ver servicio <ArrowUpRight aria-hidden="true" /></span></a>)}</div></section>

    <section className="qh-process qh-section"><header className="qh-section-heading qh-reveal"><div><p className="qh-kicker">06 / Cómo trabajamos</p><h2>Del primer mensaje<br /><em>a una web que funciona.</em></h2></div><p>Un proceso sencillo de entender, con decisiones compartidas y atención especial a móvil, rendimiento y visibilidad.</p></header><ol className="qh-process-list">{process.map(([number, title, text]) => <li className="qh-process-item qh-reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

    <section className="qh-confidence qh-section"><div className="qh-confidence-mark" aria-hidden="true"><img src={assets.mark} alt="" width="340" height="265" /></div><div className="qh-confidence-copy qh-reveal"><p className="qh-kicker">07 / Confianza</p><h2>Lo que ves es lo que hay.</h2><p>Proyectos reales, conceptos identificados como conceptos y una persona responsable de cada decisión. Cuando todavía no hay una métrica verificable, hablamos de lo que sí puede comprobarse: la solución, la experiencia y el trabajo publicado.</p><div><span>01 · Trabajo directo</span><span>02 · Proyectos identificados</span><span>03 · Sin cifras inventadas</span></div></div></section>

    <section id="contacto" className="qh-contact qh-section"><div className="qh-contact-copy qh-reveal"><p className="qh-kicker">08 / Hablemos</p><h2>Tu próximo proyecto empieza con <em>una conversación.</em></h2><p>Cuéntame qué tienes en mente y veremos cómo convertirlo en una solución digital que encaje con tu negocio.</p><div className="qh-contact-details"><a href={`${whatsappBase}?text=Hola%20Bryans%2C%20me%20gustar%C3%ADa%20hablar%20sobre%20un%20proyecto.`} target="_blank" rel="noreferrer"><span>WhatsApp</span><b>Escribir a Bryans <ArrowUpRight aria-hidden="true" /></b></a><a href={`${BASE}zonas/pamplona/`}><span>Localización</span><b>Pamplona · Navarra <ArrowUpRight aria-hidden="true" /></b></a><a href="https://github.com/quirozstudio" target="_blank" rel="noreferrer"><span>Trabajo público</span><b>GitHub / Quiroz <ArrowUpRight aria-hidden="true" /></b></a></div></div><ContactForm /></section>

    <footer className="qh-footer"><Brand footer /><p>Diseño web, identidad digital y soluciones a medida para negocios que quieren transmitir confianza.</p><div><a href={`${BASE}proyectos/`}>Proyectos</a><a href={`${BASE}servicios/`}>Servicios</a><a href={`${BASE}sobre-mi/`}>Sobre mí</a><a href={`${BASE}zonas/pamplona/`}>Pamplona</a></div><span>© 2026 · Quiroz Studio</span></footer>
  </main>
}
