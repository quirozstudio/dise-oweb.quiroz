import { useEffect, useRef, useState } from 'react'
import brandPosterSrc from '../../quiroz-sculpture.webp'
import qrAmySrc from '../../qr-amy.webp'
import qrCasaPacoSrc from '../../qr-casa-paco.webp'
import qrMaitagarriSrc from '../../qr-maitagarri.webp'
import qrQuirozSrc from '../../qr-quiroz-cocina.webp'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  X,
} from 'lucide-react'

const BASE_URL = import.meta.env.BASE_URL
const brandIsotypeSrc = `${BASE_URL}isotipo-quiroz.jpg`
const PHOTO_SRC = `${BASE_URL}bryan-quiroz.jpg`
const CASA_PACO_HERO = `${BASE_URL}casa-paco-fachada.webp`
const PORTFOLIO_ASSETS = {
  karla: `${BASE_URL}portfolio/karla.webp`,
  maitagarri: `${BASE_URL}portfolio/maitagarri.webp`,
  north: `${BASE_URL}portfolio/north.webp`,
  nacimientos: `${BASE_URL}portfolio/nacimientos.webp`,
  blog: `${BASE_URL}portfolio/blog.webp`,
}

function observeScrollSection(section: HTMLElement, update: () => void) {
  let frame = 0
  let listening = false
  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(() => {
      frame = 0
      update()
    })
  }
  const start = () => {
    if (listening) return
    listening = true
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    requestUpdate()
  }
  const stop = () => {
    if (!listening) return
    listening = false
    window.removeEventListener('scroll', requestUpdate)
    window.removeEventListener('resize', requestUpdate)
    window.cancelAnimationFrame(frame)
    frame = 0
  }
  const observer = new IntersectionObserver(([entry]) => entry.isIntersecting ? start() : stop(), { rootMargin: '100% 0px' })
  update()
  observer.observe(section)
  return () => {
    observer.disconnect()
    stop()
  }
}

const qrShowcase = [
  { src: qrCasaPacoSrc, name: 'Casa Paco', alt: 'Cartel QR multilingüe para Casa Paco', width: 1122, height: 1402 },
  { src: qrQuirozSrc, name: 'Quiroz Restobar', alt: 'Diseño de menú QR para Quiroz Restobar en Navarra', width: 1024, height: 1536 },
  { src: qrAmySrc, name: 'Amy', alt: 'Diseño QR personalizado para recuerdos de Amy', width: 1200, height: 1200 },
]

function QrCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    const track = trackRef.current
    const card = track?.children[1] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: 'auto' })
  }, [])

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(qrShowcase.length - 1, index))
    const card = trackRef.current?.children[next] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setCurrent(next)
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    const cards = Array.from(track.children) as HTMLElement[]
    const closest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
      return distance < best.distance ? { index, distance } : best
    }, { index: 0, distance: Number.POSITIVE_INFINITY })
    setCurrent(closest.index)
  }

  return (
    <div className="project-scene qr-carousel" aria-label="Galería de diseños QR">
      <div className="qr-carousel-track" ref={trackRef} onScroll={handleScroll}>
        {qrShowcase.map((item, index) => (
          <figure className={`qr-slide ${index === current ? 'active' : ''}`} key={item.name}>
            <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
            <figcaption><span>0{index + 1}</span>{item.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="qr-carousel-controls">
        <div className="qr-carousel-dots" aria-hidden="true">{qrShowcase.map((item, index) => <i className={index === current ? 'active' : ''} key={item.name} />)}</div>
        <div>
          <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Diseño anterior"><ChevronLeft /></button>
          <button type="button" onClick={() => goTo(current + 1)} disabled={current === qrShowcase.length - 1} aria-label="Diseño siguiente"><ChevronRight /></button>
        </div>
      </div>
      <span className="qr-swipe-hint">Desliza para explorar ↔</span>
    </div>
  )
}

function ProjectVisual({ type }: { type: string }) {
  if (type === 'restaurant') {
    return (
      <div className="project-scene real-work-scene restaurant-work">
        <img src={qrMaitagarriSrc} alt="Diseño de carta QR para Asador Maitagarri en Pamplona" width="1054" height="1492" loading="lazy" decoding="async" />
        <div className="real-work-label"><span>Trabajo real</span><b>ASADOR MAITAGARRI / PAMPLONA</b></div>
      </div>
    )
  }

  if (type === 'menu') return <QrCarousel />

  return (
    <div className="project-scene studio-logo-reveal" aria-label="Animación de la identidad Quiroz Digital Studio">
      <div className="studio-reveal-grid" />
      <div className="studio-reveal-mark" aria-hidden="true">
        <div className="studio-gold-arrival" />
        <svg viewBox="0 0 240 240" role="presentation">
          <circle className="studio-q-circle" cx="118" cy="111" r="72" />
          <path className="studio-q-tail" d="M91 169 C119 159 144 167 159 187 C177 208 199 210 220 199" />
          <path className="studio-branch" d="M126 151 C146 147 161 137 176 119" />
          <ellipse className="studio-leaf leaf-one" cx="143" cy="141" rx="4" ry="9" transform="rotate(-52 143 141)" />
          <ellipse className="studio-leaf leaf-two" cx="154" cy="133" rx="4" ry="9" transform="rotate(-42 154 133)" />
          <ellipse className="studio-leaf leaf-three" cx="165" cy="123" rx="4" ry="9" transform="rotate(-30 165 123)" />
        </svg>
        <img className="studio-final-mark" src={brandIsotypeSrc} alt="" width="340" height="265" />
        <div className="studio-mark-glint" />
      </div>
      <div className="studio-wordmark" aria-hidden="true">
        <div className="studio-letter-flare" />
        <div className="studio-quiroz-letters">
          {'QUIROZ'.split('').map((letter, index) => <span data-letter={letter} key={letter + index} style={{ '--letter': index } as React.CSSProperties}>{letter}</span>)}
        </div>
        <div className="studio-subtitle">Digital Studio</div>
        <p>Webs con esencia para negocios reales</p>
      </div>
      <div className="studio-reveal-caption"><span>Identidad en movimiento</span><b>QUIROZ / 2026</b></div>
    </div>
  )
}

function BrandIntro() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem('quiroz-intro-seen') !== 'true')
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!visible) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const exitTimer = window.setTimeout(() => setExiting(true), reducedMotion ? 350 : 5100)
    const closeTimer = window.setTimeout(() => {
      sessionStorage.setItem('quiroz-intro-seen', 'true')
      setVisible(false)
    }, reducedMotion ? 750 : 5900)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(closeTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  useEffect(() => {
    if (!visible) document.body.style.overflow = ''
  }, [visible])

  if (!visible) return null

  const skipIntro = () => {
    setExiting(true)
    sessionStorage.setItem('quiroz-intro-seen', 'true')
    window.setTimeout(() => setVisible(false), 450)
  }

  return (
    <div className={`brand-intro${exiting ? ' is-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Presentación de Quiroz Digital Studio">
      <div className="brand-intro-stage project-card is-visible">
        <ProjectVisual type="studio" />
        <div className="brand-intro-signature" aria-label="Firma de Bryans Astorga">
          <span>Bryans Astorga</span>
          <small>Diseñador web · Pamplona</small>
        </div>
      </div>
      <button type="button" className="brand-intro-skip" onClick={skipIntro}>
        Saltar introducción <X size={14} />
      </button>
    </div>
  )
}

function Interactive3DShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !scene || !context) return
    let frame = 0
    let width = 0
    let height = 0
    let px = 0
    let py = 0
    let running = false
    let sceneVisible = false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars = Array.from({ length: 86 }, (_, i) => ({ x: ((i * 73) % 997) / 997, y: ((i * 151) % 613) / 613, size: .4 + (i % 4) * .35, phase: i * .71 }))

    const resize = () => {
      const bounds = scene.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const mountain = (side: number, depth: number, color: string, horizon: number) => {
      context.beginPath()
      context.moveTo(side < 0 ? 0 : width, horizon + 25)
      for (let i = 0; i <= 8; i += 1) {
        const part = i / 8
        const x = side < 0 ? part * width * .49 : width - part * width * .49
        const rise = Math.sin(part * Math.PI) * height * depth
        context.lineTo(x + px * side * depth * 18, horizon - rise + Math.sin(i * 2.1 + depth * 10) * height * .025)
      }
      context.lineTo(width / 2, horizon + 25)
      context.closePath()
      context.fillStyle = color
      context.fill()
    }
    const draw = (time: number) => {
      const t = time * .00035
      const horizon = height * .59
      const sky = context.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#080706'); sky.addColorStop(.55, '#1d110b'); sky.addColorStop(1, '#050403')
      context.fillStyle = sky; context.fillRect(0, 0, width, height)
      stars.forEach((star) => {
        context.fillStyle = `rgba(238,196,126,${.16 + Math.sin(t * 3 + star.phase) * .1})`
        context.beginPath(); context.arc(star.x * width + px * 9, star.y * horizon * .9 + py * 5, star.size, 0, Math.PI * 2); context.fill()
      })
      const glow = context.createRadialGradient(width / 2, horizon * .88, 0, width / 2, horizon * .88, width * .43)
      glow.addColorStop(0, 'rgba(218,166,91,.34)'); glow.addColorStop(.38, 'rgba(132,72,37,.10)'); glow.addColorStop(1, 'transparent')
      context.fillStyle = glow; context.fillRect(0, 0, width, horizon)
      mountain(-1, .36, '#120c09', horizon); mountain(1, .39, '#100b08', horizon)
      mountain(-1, .2, '#2a1710', horizon); mountain(1, .23, '#23130e', horizon)
      const water = context.createLinearGradient(0, horizon, 0, height)
      water.addColorStop(0, '#673b25'); water.addColorStop(.18, '#21130d'); water.addColorStop(1, '#050403')
      context.fillStyle = water; context.fillRect(0, horizon, width, height - horizon)
      for (let row = 0; row < 38; row += 1) {
        const p = row / 38; const y = horizon + p * p * (height - horizon); const spread = width * (.045 + p * .54); const wave = Math.sin(t * 4 + row * 1.7) * 12 * p
        context.strokeStyle = `rgba(229,177,96,${.18 * (1 - p) + .025})`; context.lineWidth = .5 + p
        context.beginPath(); context.moveTo(width / 2 - spread + wave, y); context.lineTo(width / 2 + spread + wave, y); context.stroke()
      }
      if (!reduceMotion && running) frame = requestAnimationFrame(draw)
    }
    const onPointer = (event: PointerEvent) => {
      px = event.clientX / window.innerWidth - .5; py = event.clientY / window.innerHeight - .5
      scene.style.setProperty('--scene-x', `${px * 20}px`); scene.style.setProperty('--scene-y', `${py * 13}px`)
    }
    const start = () => {
      if (reduceMotion) { draw(0); return }
      if (running || document.hidden || !sceneVisible) return
      running = true
      frame = requestAnimationFrame(draw)
    }
    const stop = () => { running = false; cancelAnimationFrame(frame) }
    const visibility = () => { if (document.hidden) stop(); else start() }
    const sceneObserver = new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting
      if (sceneVisible) start(); else stop()
    }, { threshold: .01 })

    resize()
    sceneObserver.observe(scene)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      stop()
      sceneObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  return (
    <div className="quiroz-scene" ref={sceneRef} aria-label="Escena digital tridimensional de Quiroz">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="scene-vignette" />
      <div className="scene-values" aria-hidden="true"><span className="active">Esencia</span><span>Estrategia</span><span>Diseño</span><span>Precisión</span><span>Impacto</span></div>
      <div className="q-totem" aria-hidden="true">
        <div className="q-aura" /><div className="q-ring ring-one" /><div className="q-ring ring-two" />
        <div className="q-core"><img src={brandIsotypeSrc} alt="" width="340" height="265" /></div><div className="q-shadow" />
      </div>
      <div className="scene-coordinate coordinate-left">QUIROZ / NAVARRA<br />42.8125° N</div>
      <div className="scene-coordinate coordinate-right">DIGITAL CRAFT<br />EST. 2026</div>
    </div>
  )
}

function WireframeBuildExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const update = () => {
      const bounds = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, -bounds.top / distance))
      const stage = progress < .22 ? 'estructura' : progress < .47 ? 'tipografia' : progress < .72 ? 'identidad' : 'real'
      section.style.setProperty('--build', progress.toFixed(4))
      section.dataset.stage = stage
    }
    return observeScrollSection(section, update)
  }, [])

  return (
    <section className="build-experience" ref={sectionRef} aria-labelledby="build-title" data-stage="estructura">
      <div className="build-sticky">
        <div className="build-meta" aria-hidden="true">
          <span>SECTION 01</span><span>1440 / 12 COL</span><span>GRID 24 PX</span>
        </div>
        <div className="build-copy">
          <p className="eyebrow"><span /> Del criterio al resultado</p>
          <h2 id="build-title">No enseño un proceso.<br /><em>Lo construyo delante de ti.</em></h2>
        </div>
        <div className="build-stage" aria-label="La estructura de una web se transforma progresivamente en el proyecto real Casa Paco">
          <div className="build-grid" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
          <div className="build-browser">
            <div className="build-browser-bar"><i /><i /><i /><span>casapaco.es</span></div>
            <div className="build-site">
              <div className="build-nav"><b>CASA PACO</b><div><span>El restaurante</span><span>La carta</span><span>Reservas</span></div><button type="button" tabIndex={-1}>Reservar</button></div>
              <div className="build-content">
                <div className="build-text">
                  <small>COCINA · PAMPLONA</small>
                  <h3>La mesa de siempre.<br />Una forma nueva de llegar.</h3>
                  <p>Cocina honesta, ambiente cercano y una presencia digital pensada para convertir una visita en una reserva.</p>
                  <span className="build-cta">Descubrir Casa Paco</span>
                </div>
                <figure><img src={CASA_PACO_HERO} alt="Fachada de Casa Paco en Pamplona" width="1024" height="1536" loading="lazy" decoding="async" /><figcaption>Proyecto real · Casa Paco</figcaption></figure>
              </div>
            </div>
            <div className="build-measure measure-x">24 PX</div>
            <div className="build-measure measure-y">AUTO</div>
          </div>
        </div>
        <div className="build-progress" aria-hidden="true"><i /><span className="label-structure">Estructura</span><span className="label-type">Tipografía</span><span className="label-brand">Identidad</span><span className="label-real">Web real</span></div>
      </div>
    </section>
  )
}

function QuirozCinematicStatement() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      const bounds = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, -bounds.top / distance))
      section.style.setProperty('--cinema', progress.toFixed(4))
      section.dataset.phase = progress < .34 ? 'materia' : progress < .72 ? 'forma' : 'presencia'
    }
    return observeScrollSection(section, update)
  }, [])

  return (
    <section className="quiroz-cinema" ref={sectionRef} data-phase="materia" aria-labelledby="cinema-title">
      <div className="quiroz-cinema-sticky">
        <figure className="cinema-material" aria-hidden="true">
          <img src={brandPosterSrc} alt="" width="1122" height="1402" loading="lazy" decoding="async" />
        </figure>
        <div className="cinema-depth" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="cinema-frame" aria-hidden="true"><span>QUIROZ / DIGITAL CRAFT</span><span>PAMPLONA · 42.8125° N</span><i /><i /><i /><i /></div>
        <div className="cinema-copy">
          <p className="eyebrow light"><span /> Diseño que ocupa su lugar</p>
          <h2 id="cinema-title"><span>No hago webs.</span><strong>Construyo</strong><em>presencia.</em></h2>
          <p>Una marca debe sentirse antes de explicarse. Estrategia, imagen y tecnología avanzan juntas hasta convertir atención en deseo.</p>
          <a href="#proyectos">Verlo en mis proyectos <ArrowUpRight size={15} /></a>
        </div>
        <div className="cinema-phases" aria-hidden="true"><span>01 Materia</span><span>02 Forma</span><span>03 Presencia</span><i /></div>
      </div>
    </section>
  )
}

function ResponsiveMorphExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      const bounds = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, -bounds.top / distance))
      const first = Math.min(progress / .48, 1)
      const second = Math.max(0, (progress - .48) / .52)
      const width = 100 - first * 34 - second * 34
      section.style.setProperty('--morph', progress.toFixed(4))
      section.style.setProperty('--device-width', `${width.toFixed(2)}%`)
      section.dataset.device = progress < .32 ? 'desktop' : progress < .7 ? 'tablet' : 'movil'
    }
    return observeScrollSection(section, update)
  }, [])

  return (
    <section className="responsive-story" ref={sectionRef} data-device="desktop" aria-labelledby="responsive-title">
      <div className="responsive-sticky">
        <div className="responsive-heading">
          <p className="eyebrow light"><span /> Una interfaz. Cualquier pantalla.</p>
          <h2 id="responsive-title">El diseño no se reduce.<br /><em>Responde.</em></h2>
        </div>
        <div className="responsive-device" aria-label="La misma web de Casa Paco adaptándose de escritorio a móvil">
          <div className="responsive-chrome"><i /><i /><i /><span>Casa Paco</span><b /></div>
          <div className="responsive-site">
            <header><b>CASA PACO</b><nav>Restaurante&nbsp;&nbsp;&nbsp; Carta&nbsp;&nbsp;&nbsp; Reservas</nav><i>☰</i></header>
            <div><figure><img src={CASA_PACO_HERO} alt="Fachada de Casa Paco" width="1024" height="1536" loading="lazy" decoding="async" /></figure><article><small>PAMPLONA · COCINA NAVARRA</small><h3>La mesa<br />de siempre.</h3><p>Producto de temporada y una forma directa de reservar.</p><span>Ver carta</span></article></div>
          </div>
        </div>
        <div className="responsive-readout" aria-hidden="true"><span className="device-desktop">DESKTOP · 1440</span><span className="device-tablet">TABLET · 768</span><span className="device-mobile">MOBILE · 390</span><i /></div>
      </div>
    </section>
  )
}

function QrMenuExperience() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => {
      const bounds = section.getBoundingClientRect()
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1)
      const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, -bounds.top / distance))
      section.style.setProperty('--scan', progress.toFixed(4))
      section.dataset.scan = progress < .3 ? 'qr' : progress < .62 ? 'conexion' : 'carta'
    }
    return observeScrollSection(section, update)
  }, [])

  return (
    <section className="qr-story" ref={sectionRef} data-scan="qr" aria-labelledby="qr-story-title">
      <div className="qr-story-sticky">
        <div className="qr-story-copy">
          <p className="eyebrow"><span /> Carta digital · Proyecto real</p>
          <h2 id="qr-story-title">De la mesa<br /><em>a la carta.</em></h2>
          <p>Un QR diseñado para el local abre una experiencia clara, actualizable y preparada para cada cliente.</p>
          <a href={`${BASE_URL}servicios/menus-digitales-qr/`}>Ver servicio <ArrowUpRight size={14} /></a>
        </div>
        <div className="qr-story-scene">
          <figure className="qr-source"><img src={qrCasaPacoSrc} alt="Diseño QR multilingüe de Casa Paco" width="1122" height="1402" loading="lazy" decoding="async" /></figure>
          <div className="qr-signal" aria-hidden="true"><i /><i /><i /></div>
          <div className="menu-phone">
            <div className="phone-speaker" />
            <div className="menu-app">
              <header><b>CASA PACO</b><button type="button" tabIndex={-1}>ES⌄</button></header>
              <div className="menu-cover"><img src={CASA_PACO_HERO} alt="" width="1024" height="1536" loading="lazy" decoding="async" /><span>Cocina navarra<br /><b>en el centro de Pamplona</b></span></div>
              <nav aria-label="Categorías de ejemplo de la carta"><span className="active">Menús</span><span>Carta</span><span>Postres</span></nav>
              <article><small>ENTRE SEMANA</small><h3>Menú del día <b>22 €</b></h3><p>Consulta los platos disponibles y la información del menú.</p><div><span>🌿 Opciones</span><span>ⓘ Alérgenos</span></div></article>
              <article><small>SÁBADOS Y DOMINGOS</small><h3>Fin de semana <b>37 €</b></h3></article>
            </div>
          </div>
        </div>
        <div className="qr-story-status" aria-hidden="true"><span>01 QR</span><span>02 Conexión</span><span>03 Carta real</span></div>
      </div>
    </section>
  )
}

function ServiceDemonstrations() {
  const demonstrations = [
    { number: '01', title: 'Diseño web estratégico', text: 'Jerarquía, dirección visual y contenido trabajando para que el negocio se entienda y se recuerde.', href: 'servicios/diseno-web-restaurantes/', visual: 'design' },
    { number: '02', title: 'Desarrollo a medida', text: 'Código responsive, accesible y preparado para crecer sin convertir la experiencia en una plantilla.', href: 'servicios/', visual: 'code' },
    { number: '03', title: 'Cartas digitales QR', text: 'Una carta fácil de consultar, actualizar y adaptar a idiomas, categorías y necesidades reales.', href: 'servicios/menus-digitales-qr/', visual: 'menu' },
    { number: '04', title: 'SEO local y conversión', text: 'Arquitectura y contenido para que te encuentren en Pamplona y sepan cuál es el siguiente paso.', href: 'servicios/seo-local/', visual: 'local' },
  ]
  return (
    <section id="servicios" className="service-stories">
      <header className="service-stories-heading">
        <p className="eyebrow light"><span /> Lo que construyo</p>
        <h2>Cuatro capacidades.<br /><em>Un solo resultado.</em></h2>
      </header>
      {demonstrations.map((service) => (
        <article className={`service-story service-${service.visual}`} key={service.number}>
          <div className="service-story-copy"><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><a href={`${BASE_URL}${service.href}`}>Conocer el servicio <ArrowUpRight size={14} /></a></div>
          <div className="service-demo" aria-hidden="true">
            {service.visual === 'design' && <><div className="demo-grid">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div><div className="demo-type"><b>Tu negocio</b><span>bien contado.</span></div></>}
            {service.visual === 'code' && <div className="demo-code"><span>&lt;main&gt;</span><b>&nbsp;&nbsp;&lt;h1&gt;Tu propuesta&lt;/h1&gt;</b><i>&nbsp;&nbsp;&lt;section aria-label=&quot;Servicios&quot;&gt;</i><em>&nbsp;&nbsp;&nbsp;&nbsp;experiencia + rendimiento</em><i>&nbsp;&nbsp;&lt;/section&gt;</i><span>&lt;/main&gt;</span></div>}
            {service.visual === 'menu' && <div className="demo-menu"><header><b>CARTA</b><span>ES&nbsp; EN&nbsp; FR</span></header><p>Entrantes <b>→</b></p><p>Carnes <b>→</b></p><p>Postres <b>→</b></p><small>Información clara · Siempre actualizable</small></div>}
            {service.visual === 'local' && <div className="demo-local"><span>⌖ PAMPLONA</span><div><small>DISEÑO WEB PARA HOSTELERÍA</small><b>QUIROZ</b><p>Servicio · Proyectos · Contacto</p></div><i>Arquitectura local</i><i>Contenido útil</i><i>Conversión clara</i></div>}
          </div>
        </article>
      ))}
    </section>
  )
}

function PortfolioNarrative() {
  const portfolio = [
    { key: 'casa', number: '01', name: 'Casa Paco', kind: 'Hostelería · Web y carta digital', statement: 'Convertir una visita en ganas de sentarse a la mesa.', image: CASA_PACO_HERO, width: 1024, height: 1536, alt: 'Fachada del restaurante Casa Paco', href: 'https://github.com/quirozstudio/casapaco-demo' },
    { key: 'karla', number: '02', name: 'Karla Castañeda', kind: 'Bienestar · Presencia local', statement: 'Una experiencia serena para un servicio basado en confianza.', image: PORTFOLIO_ASSETS.karla, width: 810, height: 1080, alt: 'Retrato profesional de Karla Castañeda', href: 'https://github.com/quirozstudio/karla.casta-eda' },
    { key: 'maitagarri', number: '03', name: 'Maitagarri · San Fermín', kind: 'Campaña · Hostelería · Carta', statement: 'Una identidad preparada para el momento más intenso del año.', image: PORTFOLIO_ASSETS.maitagarri, width: 1023, height: 1537, alt: 'Fachada del Asador Maitagarri en Pamplona', href: 'https://github.com/quirozstudio/maitagarri.sanfermin' },
    { key: 'north', number: '04', name: 'North Division', kind: 'Concept / Demo · Dirección creativa', statement: 'La ingeniería explicada como una construcción cinematográfica.', image: PORTFOLIO_ASSETS.north, width: 1500, height: 844, alt: 'Estructura industrial del concepto North Division', href: 'https://github.com/quirozstudio/north.division' },
    { key: 'birth', number: '05', name: 'Nacimientos Quiroz', kind: 'Experiencia personal · Memoria', statement: 'Tecnología que baja la voz para dejar hablar a los recuerdos.', image: PORTFOLIO_ASSETS.nacimientos, width: 1500, height: 844, alt: 'Fotografía de recién nacida del proyecto Nacimientos Quiroz', href: 'https://github.com/quirozstudio/nacimientos.quiroz' },
    { key: 'blog', number: '06', name: 'Raíces', kind: 'Memoria · Escritura privada', statement: 'Un espacio íntimo para escribir, guardar recuerdos y compartirlos solo con quien elijas.', image: PORTFOLIO_ASSETS.blog, width: 1400, height: 933, alt: 'Manos sosteniendo una fotografía familiar sobre un cuaderno en el proyecto Raíces', href: 'https://github.com/quirozstudio/raices-quiroz' },
  ]
  return (
    <section id="proyectos" className="portfolio-narrative">
      <header className="portfolio-heading"><p className="eyebrow"><span /> Adaptación, no repetición</p><h2>Seis proyectos.<br /><em>Seis formas de diseñar.</em></h2><p>La dirección cambia porque el negocio, el público y la historia también cambian.</p></header>
      {portfolio.map((project) => (
        <article className={`portfolio-scene scene-${project.key}`} key={project.key}>
          <figure><img src={project.image} alt={project.alt} width={project.width} height={project.height} loading="lazy" decoding="async" /></figure>
          <div className="portfolio-scene-copy"><span>{project.number} / {project.kind}</span><h3>{project.name}</h3><p>{project.statement}</p><a href={project.href} target="_blank" rel="noreferrer">Explorar proyecto <ArrowUpRight size={15} /></a></div>
          {project.key === 'north' && <div className="north-blueprint" aria-hidden="true"><i /><i /><span>CONCEPT / DEMO</span></div>}
          {project.key === 'birth' && <div className="birth-note" aria-hidden="true">Cada momento,<br />guardado con cuidado.</div>}
          {project.key === 'blog' && <div className="blog-lines" aria-hidden="true"><span>Un recuerdo</span><i /><i /><i /></div>}
        </article>
      ))}
    </section>
  )
}

export function QuirozHero() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => localStorage.getItem('quiroz-theme') === 'light' ? 'light' : 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('quiroz-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#15100c' : '#f4ecdf')
  }, [theme])

  useEffect(() => {
    document.title = 'Diseño web en Pamplona para negocios locales | Quiroz'
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        const shouldReplay = entry.target.matches('.brand-poster-stage') || entry.target.querySelector('.studio-logo-reveal')
        if (shouldReplay) {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
          return
        }
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element))
    return () => reveal.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className="site-shell">
      <BrandIntro />
      <header className="topbar">
        <a href="#inicio" className="brand" aria-label="Quiroz, inicio">
          <img src={brandIsotypeSrc} alt="" width="340" height="265" />
          <span><b>QUIROZ</b><small>Digital studio</small></span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#/experiencia">Experiencia 3D</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#servicios">Servicios</a>
          <a href={`${BASE_URL}sobre-mi/`}>Sobre mí</a>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Activar modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            title={`Modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            <Sun size={14} aria-hidden="true" />
            <span className="theme-toggle-track"><i /></span>
            <Moon size={14} aria-hidden="true" />
          </button>
          <a href="#contacto" className="nav-cta">Hablemos <ArrowUpRight size={15} /></a>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Navegación móvil">
            <a href="#/experiencia" onClick={closeMenu}>Experiencia 3D</a>
            <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
            <a href="#servicios" onClick={closeMenu}>Servicios</a>
            <a href={`${BASE_URL}sobre-mi/`} onClick={closeMenu}>Sobre mí</a>
            <a href="#contacto" onClick={closeMenu}>Hablemos</a>
          </nav>
        )}
      </header>

      <section id="inicio" className="hero-section">
        <Interactive3DShowcase />
        <div className="hero-glow" />
        <div className="hero-copy reveal is-visible">
          <p className="eyebrow"><span /> Diseño web en Pamplona · Bryans Astorga</p>
          <h1>Diseño web en Pamplona<br />para negocios con una<br /><em>presencia imposible de ignorar.</em></h1>
          <div className="hero-bottom">
            <p>Creo páginas web a medida para hostelería y negocios locales que elevan tu marca, mejoran tu visibilidad y convierten atención en clientes.</p>
            <a href="#proyectos" className="hero-primary">Explorar proyectos <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <div className="hero-status" aria-hidden="true">
          <span><i /> Experiencia interactiva</span><span>Desliza para descubrir</span><ArrowDown size={14} />
        </div>
      </section>

      <section className="manifesto section-pad">
        <div className="section-number">01 / Enfoque</div>
        <div className="manifesto-copy reveal">
          <p className="eyebrow"><span /> Menos explicación. Más evidencia.</p>
          <h2>Tu web debe hacer sentir tu negocio <em>antes de visitarlo.</em></h2>
          <div className="manifesto-detail">
            <p>Primero ordeno lo importante. Después convierto estrategia, contenido y diseño en una experiencia clara que ayuda a elegirte.</p>
            <div className="pill-list"><span>Claridad</span><span>Carácter</span><span>Conversión</span></div>
          </div>
        </div>
      </section>

      <QuirozCinematicStatement />
      <WireframeBuildExperience />
      <ResponsiveMorphExperience />
      <QrMenuExperience />
      <ServiceDemonstrations />
      <PortfolioNarrative />

      <section id="identidad" className="brand-world section-pad">
        <div className="brand-world-copy reveal">
          <p className="eyebrow light"><span /> Una identidad con raíz</p>
          <h2>Distinto para cada cliente.<br /><em>Reconocible como Quiroz.</em></h2>
          <p>Escucho, ordeno y diseño solo lo que aporta valor. Esa es la parte que no cambia.</p>
          <div className="brand-values"><span><b>01</b> Cálido</span><span><b>02</b> Preciso</span><span><b>03</b> Humano</span></div>
        </div>
        <div className="brand-poster-stage reveal" aria-label="Identidad visual Quiroz">
          <div className="brand-poster-card"><img src={brandPosterSrc} alt="Escultura digital en oro y piedra creada para la identidad de Quiroz" width="1122" height="1402" loading="lazy" decoding="async" /><div className="brand-poster-shine" /><div className="brand-poster-focus" aria-hidden="true" /></div>
          <div className="brand-poster-caption"><span>QUIROZ / NAVARRA</span><span>BRAND SYSTEM 01</span></div>
        </div>
      </section>

      <section className="about-section section-pad">
        <div className="about-photo reveal"><img src={PHOTO_SRC} alt="Bryans Astorga, diseñador web de Quiroz Digital Studio" width="576" height="1280" loading="lazy" decoding="async" /><span>Diseñando desde Pamplona</span></div>
        <div className="about-copy reveal">
          <p className="eyebrow"><span /> Sobre mí</p>
          <h2>Tu proyecto no pasa por cinco departamentos. <em>Hablamos tú y yo.</em></h2>
          <p>Soy Bryans Astorga. Combino estrategia, diseño y desarrollo para crear webs con personalidad y objetivos claros. Me implico en cada proyecto como si el negocio también fuera mío.</p>
          <div className="about-points">
            <span><Check size={16} /> Comunicación directa</span>
            <span><Check size={16} /> Diseño sin plantillas</span>
            <span><Check size={16} /> Atención al detalle</span>
          </div>
        </div>
      </section>

      <section id="contacto" className="contact-section">
        <div className="contact-orbit" aria-hidden="true"><img src={brandIsotypeSrc} alt="" width="340" height="265" /></div>
        <p className="eyebrow light"><span /> Tu próximo paso</p>
        <h2>¿Creamos algo<br /><em>difícil de ignorar?</em></h2>
        <p className="contact-copy">Cuéntame qué tienes en mente. Te responderé con una primera dirección clara para convertirlo en una web que venda tu verdadero valor.</p>
        <a href="https://github.com/quirozstudio" target="_blank" rel="noreferrer" className="contact-button"><MessageCircle size={19} /> Conoce mi trabajo <ArrowUpRight size={18} /></a>
        <div className="contact-note">Respuesta personal · Sin compromiso · Propuesta a medida</div>
      </section>

      <footer>
        <a href="#inicio" className="footer-brand" aria-label="Quiroz Digital Studio, volver al inicio">
          <img src={brandIsotypeSrc} alt="" width="340" height="265" />
          <span><b>QUIROZ</b><small>Digital Studio</small></span>
        </a>
        <p>Diseño web con estrategia, carácter y detalle.</p>
        <div><span>© 2026 Quiroz</span><a href="#inicio">Volver arriba ↑</a></div>
      </footer>
    </main>
  )
}
