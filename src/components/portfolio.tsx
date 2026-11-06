import { ArrowUpRight } from 'lucide-react'
import projects from '@/content/projects.json'

export type Project = (typeof projects)[number]

function projectUrl(project: Project, base: string) {
  return project.href.startsWith('/') ? `${base}${project.href.slice(1)}` : project.href
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const isExternal = project.href.startsWith('http')
  const href = projectUrl(project, import.meta.env.BASE_URL)

  return (
    <article className={`qh-portfolio-card${featured ? ' qh-portfolio-card--featured' : ''}`}>
      <a className="qh-portfolio-image" href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined} aria-label={`Ver proyecto ${project.name}`}>
        <img src={`${import.meta.env.BASE_URL}${project.image.slice(1)}`} alt={project.alt} loading={featured ? 'eager' : 'lazy'} decoding="async" />
        <span className="qh-portfolio-arrow" aria-hidden="true"><ArrowUpRight /></span>
      </a>
      <div className="qh-portfolio-meta">
        <div><span className="qh-eyebrow">{project.sector}</span><span className="qh-status">{project.status}</span></div>
        <h3><a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined}>{project.name}</a></h3>
        <p>{project.statement}</p>
        <span className="qh-outcome"><b>Resultado</b>{project.outcome}</span>
      </div>
    </article>
  )
}

export function PortfolioGrid({ items = projects, featuredId }: { items?: Project[]; featuredId?: string }) {
  return <div className="qh-portfolio-grid">{items.map((project) => <ProjectCard key={project.id} project={project} featured={project.id === featuredId} />)}</div>
}

