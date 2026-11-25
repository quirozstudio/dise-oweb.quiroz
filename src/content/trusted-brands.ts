import projects from './projects.json'

export type TrustedBrandStatus = 'published' | 'public-demo' | 'in-development'

export type TrustedBrandVariant =
  | 'casa-paco'
  | 'maitagarri'
  | 'north-division'
  | 'rasel'
  | 'sabor-y-tentacion'
  | 'karla-castaneda'
  | 'cony-makeup'
  | 'encargos'
  | 'default'

export type TrustedBrand = {
  id: string
  name: string
  sector: string
  href?: string
  status: TrustedBrandStatus
  statusLabel: string
  variant: TrustedBrandVariant
  composition: {
    primary: string
    secondary?: string
    detail?: string
  }
}

type BrandDefinition = Pick<TrustedBrand, 'status' | 'statusLabel' | 'variant' | 'composition'>

const definitions: Record<string, BrandDefinition> = {
  'north-division': {
    status: 'in-development',
    statusLabel: 'Proyecto en desarrollo · demo pública',
    variant: 'north-division',
    composition: { primary: 'NORTH', secondary: 'DIVISION', detail: 'INGENIERÍA' },
  },
  'casa-paco': {
    status: 'published',
    statusLabel: 'Web publicada',
    variant: 'casa-paco',
    composition: { primary: 'Casa Paco', secondary: 'Gastrobar' },
  },
  maitagarri: {
    status: 'published',
    statusLabel: 'Web publicada',
    variant: 'maitagarri',
    composition: { primary: 'MAITAGARRI', secondary: 'ASADOR' },
  },
  'karla-castaneda': {
    status: 'published',
    statusLabel: 'Web publicada',
    variant: 'karla-castaneda',
    composition: { primary: 'Karla C.', secondary: 'Quiromasaje · Belleza' },
  },
  'sabor-y-tentacion': {
    status: 'published',
    statusLabel: 'Web publicada',
    variant: 'sabor-y-tentacion',
    composition: { primary: 'S & T', secondary: 'Sabor y Tentación' },
  },
  'rasel-opinion': {
    status: 'public-demo',
    statusLabel: 'Página pública',
    variant: 'rasel',
    composition: { primary: 'Rasel', secondary: 'Opinión' },
  },
  'cony-makeup': {
    status: 'public-demo',
    statusLabel: 'Demo pública',
    variant: 'cony-makeup',
    composition: { primary: 'Cony', secondary: 'Makeup' },
  },
  'encargos-club-tenis': {
    status: 'in-development',
    statusLabel: 'Proyecto en desarrollo',
    variant: 'encargos',
    composition: { primary: 'Encargos', secondary: 'Club de tenis' },
  },
}

const fallbackDefinition: BrandDefinition = {
  status: 'in-development',
  statusLabel: 'Proyecto en desarrollo',
  variant: 'default',
  composition: { primary: 'Empresa' },
}

const preferredOrder = [
  'north-division',
  'casa-paco',
  'maitagarri',
  'karla-castaneda',
  'sabor-y-tentacion',
  'rasel-opinion',
  'cony-makeup',
  'encargos-club-tenis',
]

const orderIndex = new Map(preferredOrder.map((id, index) => [id, index]))

export const trustedBrands: TrustedBrand[] = projects
  .filter(project => project.group === 'client')
  .map(project => {
    const definition = definitions[project.id] ?? {
      ...fallbackDefinition,
      composition: { primary: project.name },
    }

    return {
      id: project.id,
      name: project.name,
      sector: project.sector,
      href: project.href,
      ...definition,
    }
  })
  .sort((a, b) => (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER))
