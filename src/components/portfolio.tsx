import { ArrowUpRight } from 'lucide-react'
import projects from '@/content/projects.json'

export type Project = (typeof projects)[number]

function resolveHref(project: Project) {
  return project.href.startsWith('/') ? `${import.meta.env.BASE_URL}${project.href.slice(1)}` : project.href
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const external = project.href.startsWith('http')
  const href = resolveHref(project)
  return <article className={`qh-project-card${featured ? ' qh-project-card--featured' : ''}`}>
    <a className="qh-project-image" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} aria-label={`Ver proyecto ${project.name}`}>
      <img src={`${import.meta.env.BASE_URL}${project.image.slice(1)}`} alt={project.alt} loading={featured ? 'eager' : 'lazy'} decoding="async" />
      <span className="qh-project-arrow" aria-hidden="true"><ArrowUpRight /></span>
    </a>
    <div className="qh-project-info"><div><span>{project.sector}</span></div><h3><a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{project.name}</a></h3><p>{project.statement}</p><a className="qh-link" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>Ver proyecto <ArrowUpRight aria-hidden="true" /></a></div>
  </article>
}

export function PortfolioGrid({ items = projects }: { items?: Project[] }) {
  return <div className="qh-project-grid">{items.map((project, index) => <ProjectCard key={project.id} project={project} featured={index === 0} />)}</div>
}
