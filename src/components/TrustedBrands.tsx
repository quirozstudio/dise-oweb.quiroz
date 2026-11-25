import { useId, useState } from 'react'
import { trustedBrands } from '@/content/trusted-brands'
import type { TrustedBrand } from '@/content/trusted-brands'
import './TrustedBrands.css'

function BrandMark({ brand }: { brand: TrustedBrand }) {
  return (
    <span className={'trusted-brands__mark trusted-brands__mark--' + brand.variant} aria-hidden="true">
      <span className="trusted-brands__primary">{brand.composition.primary}</span>
      {brand.composition.secondary && <span className="trusted-brands__secondary">{brand.composition.secondary}</span>}
      {brand.composition.detail && <span className="trusted-brands__detail">{brand.composition.detail}</span>}
    </span>
  )
}

function BrandItem({
  brand,
  clone,
  activeId,
  onActivate,
}: {
  brand: TrustedBrand
  clone: boolean
  activeId: string | null
  onActivate: (id: string | null) => void
}) {
  const statusId = useId()
  const accessibleName = `${brand.name}. ${brand.sector}. ${brand.statusLabel}${brand.href ? '. Abrir en una pestaña nueva.' : '.'}`
  const commonProps = {
    className: 'trusted-brands__interactive',
    tabIndex: clone ? -1 : undefined,
    'aria-label': clone ? undefined : accessibleName,
  }

  if (brand.href) {
    return (
      <li className="trusted-brands__item" aria-hidden={clone || undefined}>
        <a {...commonProps} href={brand.href} target="_blank" rel="noreferrer">
          <BrandMark brand={brand} />
        </a>
      </li>
    )
  }

  return (
    <li className="trusted-brands__item" aria-hidden={clone || undefined}>
      <button
        {...commonProps}
        type="button"
        aria-describedby={clone ? undefined : statusId}
        onClick={() => onActivate(brand.id)}
        onFocus={() => onActivate(brand.id)}
        onBlur={() => onActivate(null)}
        onMouseEnter={() => onActivate(brand.id)}
        onMouseLeave={() => onActivate(null)}
      >
        <BrandMark brand={brand} />
        {!clone && activeId === brand.id && <span className="trusted-brands__status" id={statusId} role="status">Proyecto en desarrollo</span>}
      </button>
    </li>
  )
}

export function TrustedBrands() {
  const [paused, setPaused] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section className="trusted-brands" aria-labelledby="trusted-brands-title">
      <header className="trusted-brands__header">
        <h2 id="trusted-brands-title">Empresas que confían en mí</h2>
        <button
          className="trusted-brands__pause"
          type="button"
          aria-controls="trusted-brands-track"
          aria-pressed={paused}
          onClick={() => setPaused(value => !value)}
        >
          {paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
      </header>

      <div className="trusted-brands__viewport">
        <div className={'trusted-brands__track' + (paused ? ' is-paused' : '')} id="trusted-brands-track">
          <ul className="trusted-brands__group" aria-label="Empresas cliente">
            {trustedBrands.map(brand => (
              <BrandItem key={brand.id} brand={brand} clone={false} activeId={activeId} onActivate={setActiveId} />
            ))}
          </ul>
          <ul className="trusted-brands__group" aria-hidden="true">
            {trustedBrands.map(brand => (
              <BrandItem key={brand.id + '-clone'} brand={brand} clone activeId={activeId} onActivate={setActiveId} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
