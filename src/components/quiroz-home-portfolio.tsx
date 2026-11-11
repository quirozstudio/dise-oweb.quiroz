import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, PanelsTopLeft } from 'lucide-react'
import type { Project } from './portfolio'
import './quiroz-home-portfolio.css'

const base = import.meta.env.BASE_URL

function ProjectCard({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false)

  if (!project.href) {
    return (
      <li className="qhp-slide">
        <article className="qhp-card qhp-card-description">
          <small>{project.sector}</small>
          <h4>{project.name}</h4>
          <p>{project.statement}</p>
        </article>
      </li>
    )
  }

  const external = /^https?:\/\//.test(project.href)
  const href = project.href.startsWith('/') ? base + project.href.slice(1) : project.href

  return (
    <li className="qhp-slide">
      <article className="qhp-card">
        <a className="qhp-card-main" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
          <span className="qhp-card-media">
            {failed || !project.image ? (
              <span className="qhp-card-placeholder" aria-hidden="true"><PanelsTopLeft /></span>
            ) : (
              <img src={base + project.image.slice(1)} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
            )}
          </span>
          <span className="qhp-card-copy">
            <strong>{project.name}</strong>
            <small>{project.sector}</small>
            <span className="qhp-card-arrow" aria-hidden="true"><ArrowUpRight /></span>
          </span>
        </a>
        {project.actions && (
          <ul className="qhp-card-actions" aria-label={'Enlaces de ' + project.name}>
            {project.actions.map(action => (
              <li key={action.label}>
                <a href={action.href} target="_blank" rel="noreferrer" aria-label={action.label + ' de ' + project.name}>
                  {action.label} <ArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  )
}

function PortfolioRow({ id, title, items }: { id: string; title: string; items: readonly Project[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  useEffect(() => {
    const list = track.current
    if (!list) return

    function update() {
      if (!list) return
      const atStart = list.scrollLeft <= 2
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2
      setEdges(previous => previous.atStart === atStart && previous.atEnd === atEnd ? previous : { atStart, atEnd })
    }

    update()
    list.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(list)
    if (!observer) window.addEventListener('resize', update)
    return () => {
      list.removeEventListener('scroll', update)
      observer?.disconnect()
      if (!observer) window.removeEventListener('resize', update)
    }
  }, [items.length])

  function move(direction: -1 | 1) {
    const list = track.current
    if (!list || list.children.length < 2) return
    const first = list.children[0].getBoundingClientRect()
    const second = list.children[1].getBoundingClientRect()
    list.scrollBy({ left: direction * (second.left - first.left) })
  }

  if (items.length === 0) return null

  return (
    <section className="qhp-row" aria-labelledby={id + '-title'}>
      <h3 id={id + '-title'}>{title}</h3>
      <ul className="qhp-track" id={id + '-track'} ref={track} aria-labelledby={id + '-title'}>
        {items.map(project => <ProjectCard key={project.id} project={project} />)}
      </ul>
      <div className="qhp-controls" role="group" aria-label={'Navegar: ' + title}>
        <button type="button" onClick={() => move(-1)} aria-label="Proyectos anteriores" aria-controls={id + '-track'} disabled={edges.atStart}><ArrowLeft aria-hidden="true" /></button>
        <button type="button" onClick={() => move(1)} aria-label="Más proyectos" aria-controls={id + '-track'} disabled={edges.atEnd}><ArrowRight aria-hidden="true" /></button>
      </div>
    </section>
  )
}

export function HomePortfolio({ items }: { items: readonly Project[] }) {
  return (
    <section className="qhp" id="portfolio" aria-labelledby="qhp-title">
      <div className="qhp-inner">
        <header className="qhp-heading">
          <p className="qhp-meta">Portfolio de Quiroz Studio</p>
          <h2 id="qhp-title">Proyectos con carácter</h2>
          <a className="qhp-all" href={base + 'proyectos/'}>Ver todos los proyectos <ArrowUpRight aria-hidden="true" /></a>
        </header>
        <PortfolioRow id="qhp-clientes" title="Marcas que confían en Quiroz" items={items.filter(project => project.group === 'client')} />
        <PortfolioRow id="qhp-propios" title="Proyectos propios" items={items.filter(project => project.group === 'own')} />
      </div>
    </section>
  )
}
