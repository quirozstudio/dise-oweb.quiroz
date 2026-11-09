import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const SITE = 'https://quirozstudio.es'
const BASE = ''
const OUTPUT = resolve('dist')
const UPDATED = '2026-09-16'
const projects = JSON.parse(await readFile(resolve('src/content/projects.json'), 'utf8'))

const routes = [
  {
    path: '/servicios/',
    type: 'CollectionPage',
    title: 'Servicios de diseño web en Pamplona | Quiroz',
    description: 'Diseño y desarrollo web, menús digitales QR y SEO local para restaurantes y negocios de Pamplona y Navarra que quieren crecer online.',
    eyebrow: 'Servicios digitales a medida',
    h1: 'Diseño web que convierte la esencia de tu negocio en una presencia digital clara.',
    intro: 'Trabajo directamente contigo para ordenar tu propuesta, diseñar una identidad digital coherente y construir una web rápida que ayude al cliente a entender por qué elegirte.',
    sections: [
      ['Diseño web para hostelería', 'Webs a medida para restaurantes, bares y cafeterías. La experiencia, la carta, las reservas y la ubicación se organizan pensando primero en el móvil y en la decisión real del cliente.', '/servicios/diseno-web-restaurantes/'],
      ['Menús digitales QR', 'Cartas digitales legibles, visuales y fáciles de consultar, sin obligar al cliente a descargar una aplicación ni ampliar un PDF incómodo.', '/servicios/menus-digitales-qr/'],
      ['SEO local para negocios', 'Estructura, contenido y señales locales para que Google entienda qué haces, dónde trabajas y qué página debe mostrar en cada búsqueda.', '/servicios/seo-local/'],
    ],
    faq: [
      ['¿Trabajas únicamente con restaurantes?', 'La especialización principal es hostelería, aunque también trabajo con negocios locales que valoran el diseño, la cercanía y una presencia digital cuidada.'],
      ['¿La web se diseña a partir de una plantilla?', 'No. La dirección visual, la estructura y los mensajes se plantean según el negocio, su cliente y sus objetivos.'],
      ['¿La web estará preparada para móvil?', 'Sí. La experiencia se diseña mobile first y se valida también en tablet y ordenador.'],
    ],
  },
  {
    path: '/servicios/diseno-web-restaurantes/',
    type: 'Service',
    serviceType: 'Diseño web para restaurantes',
    title: 'Diseño web para restaurantes en Pamplona | Quiroz',
    description: 'Webs a medida para restaurantes, bares y cafeterías de Pamplona: diseño premium, carta digital, reservas, velocidad y SEO local.',
    eyebrow: 'Diseño web · Hostelería',
    h1: 'Diseño web para restaurantes que quieren transmitir su verdadero nivel.',
    intro: 'Tu web debe hacer sentir el ambiente del local, facilitar la consulta de la carta y convertir una búsqueda desde el móvil en una visita, una llamada o una reserva.',
    sections: [
      ['Una experiencia que empieza antes de entrar', 'La mayoría de clientes comprueba la carta, las fotografías, la ubicación o la posibilidad de reservar antes de decidir. Diseño ese recorrido para que la información importante aparezca con naturalidad y la identidad del restaurante no se pierda en una plantilla genérica.'],
      ['Qué puede incluir el proyecto', 'Arquitectura de contenidos, dirección visual, desarrollo responsive, carta o menú digital, integración de reservas existentes, mapa, idiomas, optimización de imágenes, analítica preparada y una base técnica para SEO local. Solo se incorporan las funciones que aportan valor real.'],
      ['Proceso directo con Bryans', 'Primero entiendo el concepto, el público y la experiencia del local. Después defino una dirección visual, diseño las pantallas principales, desarrollo la web y reviso rendimiento, accesibilidad y uso móvil antes del lanzamiento.'],
      ['Pamplona y Navarra', 'Trabajo especialmente con restaurantes, bares y cafeterías de Pamplona y Navarra. El conocimiento del entorno local ayuda a construir mensajes y recorridos más cercanos al cliente que busca dónde comer, reservar o descubrir un nuevo local.'],
    ],
    faq: [
      ['¿Puedo integrar mi sistema de reservas?', 'Sí, cuando el sistema utilizado permite integración o enlazado. Se estudia la opción que cause menos fricción al cliente.'],
      ['¿Podré mostrar la carta en varios idiomas?', 'Sí. La estructura puede prepararse para cartas y contenidos multilingües cuando el público del restaurante lo necesita.'],
      ['¿Incluye posicionamiento en Google?', 'La web se entrega con una base SEO técnica y local. Una estrategia de crecimiento continuado requiere contenidos, medición y trabajo periódico.'],
    ],
  },
  {
    path: '/servicios/menus-digitales-qr/',
    type: 'Service',
    serviceType: 'Diseño de menús digitales QR',
    title: 'Menús digitales QR para restaurantes en Navarra | Quiroz',
    description: 'Diseño de cartas y menús digitales QR para restaurantes y bares de Navarra: claros, rápidos, multilingües y adaptados a cada marca.',
    eyebrow: 'Cartas digitales · Experiencia móvil',
    h1: 'Menús digitales QR que forman parte del restaurante, no un código pegado en la mesa.',
    intro: 'Diseño la pieza física y la experiencia digital para que el cliente consulte la carta con rapidez, entienda la oferta y reconozca la identidad del local.',
    sections: [
      ['Lectura cómoda desde cualquier móvil', 'La carta se estructura para evitar PDFs pesados, textos diminutos y ampliaciones constantes. Categorías, platos, precios, alérgenos e idiomas se ordenan para una consulta rápida durante el servicio.'],
      ['Diseño coherente con el local', 'El soporte QR, los colores, la tipografía y el entorno digital siguen la identidad del restaurante. El resultado puede ser sobrio, tradicional, gastronómico o contemporáneo, pero nunca genérico.'],
      ['Preparado para clientes internacionales', 'Cuando el negocio lo necesita, la información puede organizarse en varios idiomas para reducir dudas, agilizar el servicio y ofrecer una experiencia más cómoda al visitante.'],
      ['Aplicaciones más allá de la carta', 'El mismo enfoque puede utilizarse para cartas de temporada, promociones, información de eventos o experiencias privadas. Cada QR debe tener un objetivo claro y una página útil detrás.'],
    ],
    faq: [
      ['¿El cliente necesita instalar una aplicación?', 'No. El contenido se abre directamente en el navegador del móvil.'],
      ['¿Se puede diseñar también el soporte impreso?', 'Sí. El diseño visual del soporte QR puede integrarse con la estética del establecimiento.'],
      ['¿Puede haber versiones en varios idiomas?', 'Sí. Se define una navegación sencilla para acceder a cada idioma sin duplicar innecesariamente la experiencia.'],
    ],
  },
  {
    path: '/servicios/seo-local/',
    type: 'Service',
    serviceType: 'SEO local para negocios',
    title: 'SEO local para negocios en Pamplona | Quiroz',
    description: 'SEO local para negocios de Pamplona y Navarra: arquitectura web, contenidos, rendimiento y señales técnicas para ganar visibilidad cualificada.',
    eyebrow: 'Visibilidad local · Estrategia',
    h1: 'SEO local para que tu negocio sea entendido, encontrado y elegido.',
    intro: 'El posicionamiento local empieza por una web clara: servicios diferenciados, información consistente, páginas rápidas y contenido que responda a búsquedas reales de clientes de la zona.',
    sections: [
      ['Una arquitectura que evita competir contigo mismo', 'Cada servicio y cada zona relevante necesita una intención clara. Organizo URLs, títulos, contenidos y enlazado interno para que varias páginas no intenten posicionar por exactamente la misma búsqueda.'],
      ['Base técnica y rendimiento', 'Reviso indexación, sitemap, datos estructurados, canonicals, imágenes, experiencia móvil y Core Web Vitals. El objetivo es facilitar el rastreo sin sacrificar la experiencia visual de la marca.'],
      ['Contenido local útil', 'Pamplona o Navarra no se repiten de forma artificial. Las señales locales se incorporan donde aportan contexto: área de servicio, proyectos, preguntas, necesidades del público y forma de trabajar.'],
      ['Medición y evolución', 'La arquitectura queda preparada para Search Console y analítica. Los datos permiten priorizar nuevas páginas, mejorar consultas con impresiones y detectar oportunidades reales en lugar de publicar contenido sin dirección.'],
    ],
    faq: [
      ['¿Cuánto tarda el SEO local en dar resultados?', 'Depende del punto de partida, la competencia y la autoridad del negocio. La mejora técnica es inmediata; la evolución orgánica necesita rastreo, señales externas y continuidad.'],
      ['¿Es suficiente con crear una ficha de Google?', 'No. La ficha es importante, pero debe estar respaldada por una web coherente, datos consistentes, reseñas reales y contenido que explique servicios y ubicación.'],
      ['¿Añades Analytics o Search Console?', 'La web queda preparada para integrarlos cuando el propietario facilite las cuentas e identificadores reales.'],
    ],
  },
  {
    path: '/proyectos/',
    type: 'CollectionPage',
    title: 'Proyectos de diseño web y menús QR | Quiroz',
    description: 'Selección de proyectos de identidad digital, diseño web y menús QR para hostelería y negocios locales de Pamplona y Navarra.',
    eyebrow: 'Trabajo seleccionado',
    h1: 'Proyectos donde estrategia, identidad y experiencia trabajan juntas.',
    intro: 'Una selección de webs y cartas QR para clientes, junto con ideas y productos propios de Quiroz Studio.',
    sections: [
      ['Diseños de cartas QR', 'Ejemplos de cartas digitales y soportes QR para hostelería.', '/proyectos/menus-qr/'],
    ],
    faq: [],
  },
  {
    path: '/proyectos/asador-maitagarri/',
    type: 'CreativeWork',
    image: '/qr-maitagarri.webp',
    title: 'Proyecto Asador Maitagarri en Pamplona | Quiroz',
    description: 'Caso de diseño visual y experiencia QR para Asador Maitagarri en Pamplona: identidad, carta accesible y coherencia con el ambiente del restaurante.',
    eyebrow: 'Proyecto · Hostelería en Pamplona',
    h1: 'Asador Maitagarri: una pieza digital con el carácter de la brasa y Pamplona.',
    intro: 'El objetivo fue crear un acceso a la carta que no pareciera un elemento técnico añadido, sino una extensión visual del restaurante.',
    sections: [
      ['El reto', 'Un código QR puede resolver el acceso a la carta y, al mismo tiempo, romper la estética de la mesa. La pieza debía ser clara para el cliente, reconocible y coherente con la identidad del asador.'],
      ['La dirección visual', 'La composición utiliza crema, negro y granate, referencias a Pamplona y una jerarquía central que guía desde la marca hasta la acción de escanear. Las indicaciones se organizan en español, inglés y francés.'],
      ['La solución', 'El QR ocupa una posición protagonista y mantiene suficiente contraste y espacio de seguridad. El soporte explica cómo utilizarlo sin ruido y conserva la atmósfera tradicional del negocio.'],
      ['Servicios relacionados', 'Este proyecto conecta diseño de identidad aplicada, contenido visual y experiencia QR para hostelería.', '/servicios/menus-digitales-qr/'],
    ],
    faq: [],
  },
  {
    path: '/proyectos/menus-qr/',
    type: 'CreativeWork',
    image: '/qr-quiroz-cocina.webp',
    title: 'Proyectos de menús y experiencias QR | Quiroz',
    description: 'Diseños QR para restaurantes, cartas multilingües y experiencias personalizadas creadas por Quiroz Digital Studio.',
    eyebrow: 'Proyecto · Diseño QR',
    h1: 'Tres contextos, tres experiencias QR diseñadas con intención.',
    intro: 'Un restaurante tradicional, una propuesta gastronómica premium y un recuerdo familiar no deberían compartir la misma plantilla. Cada pieza necesita su propio tono y una acción clara.',
    sections: [
      ['Casa Paco', 'Una composición oscura, cálida y multilingüe que integra el QR en un ambiente de restaurante tradicional. La lectura guía al cliente en español, inglés y francés.'],
      ['Quiroz Restobar', 'Un concepto sobrio y contemporáneo en negro y oro, con énfasis en la marca y una consulta de carta rápida desde el móvil.'],
      ['Amy', 'Una aplicación emocional del QR para conservar y consultar recuerdos. Demuestra que la tecnología puede adoptar un lenguaje cálido y personal sin perder claridad.'],
      ['Diseño adaptado al objetivo', 'Los tres casos comparten contraste, legibilidad y una acción evidente, pero cambian por completo en tono, jerarquía y emoción.', '/servicios/menus-digitales-qr/'],
    ],
    faq: [],
  },
  {
    path: '/sobre-mi/',
    type: 'AboutPage',
    title: 'Bryans Astorga, diseñador web en Pamplona | Quiroz',
    description: 'Conoce a Bryans Astorga, creador de Quiroz Digital Studio y diseñador web especializado en hostelería y negocios locales de Pamplona.',
    eyebrow: 'Sobre mí · Pamplona, Navarra',
    h1: 'Soy Bryans Astorga.',
    intro: 'Creé Quiroz Studio para ayudar a restaurantes, bares y negocios locales a tener una web que refleje el cuidado que ponen en su trabajo.',
    sections: [
      ['Diseño y desarrollo web', 'Diseño y construyo webs a medida que explican qué ofreces y facilitan que te contacten desde el móvil.', '/servicios/diseno-web-restaurantes/'],
      ['Cartas QR y reservas', 'Preparo cartas digitales fáciles de consultar y conecto la web con las reservas o el canal de contacto que ya utilizas.', '/servicios/menus-digitales-qr/'],
      ['Visibilidad local', 'Organizo la web para que quien busca tu negocio en Pamplona encuentre lo que necesita: servicios, horarios, ubicación y contacto.', '/servicios/seo-local/'],
    ],
    faq: [],
  },
  {
    path: '/zonas/pamplona/',
    type: 'WebPage',
    title: 'Diseño web para negocios en Pamplona | Quiroz',
    description: 'Diseño web, menús QR y SEO local para restaurantes y negocios de Pamplona que quieren proyectar una imagen profesional y atraer clientes.',
    eyebrow: 'Área de servicio · Pamplona',
    h1: 'Diseño web para negocios de Pamplona con identidad, claridad y estrategia local.',
    intro: 'Trabajo con restaurantes y negocios de Pamplona que quieren dejar de parecer uno más en internet. La cercanía permite comprender mejor el local, su público y la experiencia que debe trasladarse a la web.',
    sections: [
      ['Para hostelería y negocios locales', 'La web puede integrar carta, reservas existentes, servicios, ubicación, contenidos visuales y llamadas a la acción. La estructura se adapta al recorrido real del cliente que busca desde el móvil.'],
      ['Visibilidad en Pamplona y Navarra', 'La arquitectura técnica conecta servicios, proyectos y señales locales sin repetir la ciudad de forma artificial. Esto ayuda a Google y al usuario a entender la relación real del negocio con su zona.'],
      ['Trabajo cercano y a medida', 'Las reuniones y la comunicación se adaptan al proyecto. El objetivo es conocer la personalidad del negocio y convertirla en una experiencia digital propia.'],
      ['Servicios disponibles', 'Diseño y desarrollo web, menús digitales QR, dirección visual y base técnica para SEO local.', '/servicios/'],
    ],
    faq: [
      ['¿Trabajas con negocios fuera del centro de Pamplona?', 'Sí. El servicio se dirige a Pamplona y su entorno, además de otros proyectos de Navarra cuando existe un buen encaje.'],
      ['¿Es necesario reunirnos presencialmente?', 'No siempre. La cercanía facilita conocer el negocio, pero el proceso también puede organizarse de forma remota.'],
    ],
  },
]

const absolute = (path = '/') => `${SITE}${path}`
const asset = (path) => `${BASE}${path}`
const link = (path) => `${BASE}${path}`

const [sharedStyles, aboutStyles] = await Promise.all(['seo-pages.css', 'sobre-mi.css'].map(async file => {
  const contents = await readFile(resolve(OUTPUT, file))
  const version = createHash('sha256').update(contents).digest('hex').slice(0, 12)
  return `${asset('/' + file)}?v=${version}`
}))

const escapeJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')

function schemaFor(page) {
  const items = [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Quiroz Digital Studio',
      inLanguage: 'es-ES',
      publisher: { '@id': `${SITE}/#business` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE}/#business`,
      name: 'Quiroz Digital Studio',
      url: `${SITE}/`,
      logo: absolute('/isotipo-quiroz.jpg'),
      image: absolute('/og-quiroz.webp'),
      founder: { '@type': 'Person', name: 'Bryans Astorga' },
      description: 'Diseño y desarrollo web, menús digitales QR y SEO local para hostelería y negocios locales.',
      areaServed: [
        { '@type': 'City', name: 'Pamplona' },
        { '@type': 'AdministrativeArea', name: 'Navarra' },
      ],
      sameAs: ['https://github.com/quirozstudio'],
      knowsAbout: ['Diseño web', 'Desarrollo web', 'SEO local', 'Hostelería', 'Menús digitales QR'],
    },
    {
      '@type': page.type === 'Service' ? 'WebPage' : page.type,
      '@id': `${absolute(page.path)}#page`,
      url: absolute(page.path),
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': page.type === 'AboutPage' ? `${SITE}/#bryans` : `${SITE}/#business` },
      primaryImageOfPage: page.image ? { '@type': 'ImageObject', contentUrl: absolute(page.image) } : undefined,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: page.eyebrow.split('·')[0].trim(), item: absolute(page.path) },
      ],
    },
  ]
  if (page.type === 'AboutPage') {
    items.push({
      '@type': 'Person',
      '@id': `${SITE}/#bryans`,
      name: 'Bryans Astorga',
      url: absolute(page.path),
      image: absolute('/bryan-quiroz.jpg'),
      jobTitle: 'Diseñador y desarrollador web',
      worksFor: { '@id': `${SITE}/#business` },
    })
  }
  if (page.type === 'Service') {
    items.push({
      '@type': 'Service',
      name: page.serviceType,
      description: page.description,
      provider: { '@id': `${SITE}/#business` },
      areaServed: [{ '@type': 'City', name: 'Pamplona' }, { '@type': 'AdministrativeArea', name: 'Navarra' }],
      url: absolute(page.path),
    })
  }
  if (page.faq.length) {
    items.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': items }
}

function renderSections(page) {
  return page.sections.map(([title, copy, href], index) => `
    <article class="content-block">
      <span class="content-index">0${index + 1}</span>
      <div><h2>${title}</h2><p>${copy}</p>${href ? `<a href="${link(href)}">Ver ${href.includes('servicios') ? 'servicio' : 'proyecto'} <span aria-hidden="true">↗</span></a>` : ''}</div>
    </article>`).join('')
}

function renderPortfolio(page) {
  if (page.path !== '/proyectos/') return ''
  const renderTile = (project) => {
    const external = project.href.startsWith('http')
    const href = project.href.startsWith('/') ? link(project.href) : project.href
    const actions = project.actions?.map(({ label, href }) =>
      `<a href="${href}" target="_blank" rel="noreferrer" aria-label="${label} de ${project.name}">${label} <span aria-hidden="true">↗</span></a>`
    ).join('')
    return `<article class="project-tile"><a href="${href}"${external ? ' target="_blank" rel="noreferrer"' : ''}><div class="project-tile-image"><img src="${asset(project.image)}" alt="${project.alt}" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></div><div class="project-tile-meta">${project.sector}</div><h4>${project.name}</h4><p>${project.statement}</p></a>${actions ? `<div class="project-tile-actions">${actions}</div>` : ''}</article>`
  }
  const groups = [['client', 'Marcas que confían en Quiroz'], ['own', 'Proyectos propios']]
  return `<section class="project-portfolio" aria-labelledby="project-portfolio-title"><p class="kicker">Portfolio completo</p><h2 id="project-portfolio-title">Proyectos con carácter</h2>${groups.map(([group, title]) =>
    `<section class="project-group" aria-labelledby="project-group-${group}"><h3 id="project-group-${group}">${title}</h3><div class="project-grid">${projects.filter(project => project.group === group).map(renderTile).join('')}</div></section>`
  ).join('')}</section>`
}

function renderFaq(page) {
  if (!page.faq.length) return ''
  return `<section class="faq" aria-labelledby="faq-title"><p class="kicker">Preguntas frecuentes</p><h2 id="faq-title">Antes de empezar</h2>${page.faq.map(([question, answer]) => `<details><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join('')}</section>`
}

function renderAbout(page) {
  return `
    <header class="about-hero">
      <div class="about-hero-copy">
        <p class="kicker">${page.eyebrow}</p>
        <h1>${page.h1}</h1>
        <p class="about-role">Diseñador y desarrollador web.</p>
        <p class="about-lead">${page.intro}</p>
        <div class="about-actions">
          <a class="about-button" href="${link('/#contacto')}">Hablemos de tu negocio <span aria-hidden="true">↗</span></a>
          <a class="about-link" href="${link('/proyectos/')}">Ver mis proyectos <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <figure class="about-portrait">
        <img src="${asset('/bryan-quiroz.jpg')}" alt="Bryans Astorga trabajando en su estudio" width="576" height="1280" fetchpriority="high" decoding="async">
        <figcaption><span>Bryans Astorga</span><span>Quiroz Studio · Pamplona</span></figcaption>
      </figure>
    </header>
    <section class="about-story" aria-labelledby="about-story-title">
      <div><p class="kicker">Mi enfoque</p><h2 id="about-story-title">Una web tiene que resolver algo.</h2></div>
      <div class="about-prose">
        <p>Me gusta entender qué necesita la persona que llega a tu web. En un restaurante puede ser consultar la carta o reservar una mesa. En un negocio de servicios, saber qué haces y cómo ponerse en contacto contigo.</p>
        <p>A partir de ahí doy forma al contenido, al diseño y a la navegación. El objetivo es que la web tenga el carácter de tu negocio y sea fácil de usar.</p>
      </div>
    </section>
    <section class="about-services" aria-labelledby="about-services-title">
      <p class="kicker">En qué puedo ayudarte</p>
      <h2 id="about-services-title">Lo que hago</h2>
      <ul class="about-service-list">${page.sections.map(([title, copy, href]) => `
        <li><h3>${title}</h3><p>${copy}</p><a class="about-link" href="${link(href)}" aria-label="Ver servicio: ${title}">Ver servicio <span aria-hidden="true">↗</span></a></li>
      `).join('')}</ul>
    </section>
    <section class="about-method" aria-labelledby="about-method-title">
      <div><p class="kicker">Cómo trabajo</p><h2 id="about-method-title">Hablas directamente conmigo.</h2></div>
      <div class="about-prose">
        <p>Primero hablamos de tu negocio y de lo que quieres mejorar. Después te propongo una dirección, diseño la web y la desarrollo. Antes de publicarla, la revisamos juntos y comprobamos que las acciones importantes funcionan, especialmente en móvil.</p>
        <p>Además de los proyectos para clientes, desarrollo ideas propias como <a href="https://quirozstudio.github.io/camarero-cursoquiroz/" target="_blank" rel="noreferrer">Primer Turno</a>, un curso para preparar el primer turno como camarero.</p>
      </div>
    </section>
    <section class="about-contact" aria-labelledby="about-contact-title">
      <div><p class="kicker">Contacto</p><h2 id="about-contact-title">Cuéntame qué necesitas.</h2><p>Podemos empezar por una idea, una web que quieras mejorar o un problema concreto que resolver.</p></div>
      <a class="about-button" href="${link('/#contacto')}">Hablar con Bryans <span aria-hidden="true">↗</span></a>
    </section>`
}

function renderPage(page) {
  const image = page.image ? absolute(page.image) : absolute('/og-quiroz.webp')
  const schema = escapeJson(schemaFor(page))
  const about = page.type === 'AboutPage'
  return `<!doctype html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="author" content="Bryans Astorga">
  <meta name="theme-color" content="#110c09">
  <link rel="canonical" href="${absolute(page.path)}">
  <link rel="icon" type="image/svg+xml" href="${asset('/favicon-quiroz.svg')}">
  <link rel="manifest" href="${asset('/site.webmanifest')}">
  <link rel="stylesheet" href="${sharedStyles}">
  ${about ? `<link rel="stylesheet" href="${aboutStyles}">` : ''}
  <meta property="og:locale" content="es_ES">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Quiroz Digital Studio">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${absolute(page.path)}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="Quiroz Digital Studio, diseño web en Pamplona">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">${schema}</script>
  <script>document.documentElement.dataset.theme=localStorage.getItem('quiroz-theme')==='light'?'light':'dark'</script>
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header">
    <a class="logo" href="${link('/')}"><img src="${asset('/isotipo-quiroz.jpg')}" width="44" height="44" alt=""><span>QUIROZ<small>Digital Studio</small></span></a>
    <nav aria-label="Navegación principal"><a href="${link('/servicios/')}">Servicios</a><a href="${link('/proyectos/')}">Proyectos</a><a href="${link('/sobre-mi/')}"${about ? ' aria-current="page"' : ''}>Sobre mí</a><a href="${link('/zonas/pamplona/')}">Pamplona</a></nav>
    <button class="theme-button" type="button" aria-label="Cambiar tema">◐</button>
  </header>
  <main id="contenido"${about ? ' class="about-page"' : ''} tabindex="-1">
    ${about ? renderAbout(page) : `
    <header class="page-hero">
      <div class="hero-copy"><p class="kicker">${page.eyebrow}</p><h1>${page.h1}</h1><p>${page.intro}</p><a class="primary" href="${link('/#contacto')}">Hablar sobre mi proyecto <span aria-hidden="true">↗</span></a></div>
      <div class="hero-mark" aria-hidden="true"><img src="${asset('/isotipo-quiroz.jpg')}" width="340" height="265" alt=""></div>
    </header>
    <div class="trust-strip"><span>Diseño a medida</span><span>Mobile first</span><span>Pamplona · Navarra</span></div>
    ${renderPortfolio(page)}
    <section class="content-list" aria-label="Información principal">${renderSections(page)}</section>
    ${renderFaq(page)}
    <section class="final-cta"><p class="kicker">Un proyecto con intención</p><h2>Tu negocio ya tiene una historia.<br>Vamos a hacer que se note.</h2><a class="primary" href="${link('/#contacto')}">Conocer a Quiroz <span aria-hidden="true">↗</span></a></section>`}
  </main>
  <footer><a class="logo" href="${link('/')}"><img src="${asset('/isotipo-quiroz.jpg')}" width="44" height="44" alt=""><span>QUIROZ<small>Digital Studio</small></span></a><p>Diseño web para hostelería y negocios locales en Pamplona.</p><nav aria-label="Enlaces del pie"><a href="${link('/servicios/')}">Servicios</a><a href="${link('/proyectos/')}">Proyectos</a><a href="${link('/sobre-mi/')}">Sobre mí</a></nav></footer>
  <script>
    const button=document.querySelector('.theme-button');
    button.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('quiroz-theme',next)});
  </script>
</body>
</html>`
}

for (const page of routes) {
  const directory = resolve(OUTPUT, `.${page.path}`)
  await mkdir(directory, { recursive: true })
  await writeFile(resolve(directory, 'index.html'), renderPage(page), 'utf8')
}

for (const image of ['qr-maitagarri.webp', 'qr-quiroz-cocina.webp']) {
  await copyFile(resolve(image), resolve(OUTPUT, image))
}

const urls = ['/', ...routes.map((route) => route.path)]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path, index) => `  <url><loc>${absolute(path)}</loc><lastmod>${UPDATED}</lastmod><changefreq>${index === 0 ? 'weekly' : 'monthly'}</changefreq><priority>${index === 0 ? '1.0' : path === '/servicios/' || path === '/proyectos/' ? '0.8' : '0.7'}</priority></url>`).join('\n')}\n</urlset>\n`
await writeFile(resolve(OUTPUT, 'sitemap.xml'), sitemap, 'utf8')

const notFound = `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página no encontrada | Quiroz</title><meta name="robots" content="noindex,follow"><link rel="icon" type="image/svg+xml" href="${asset('/favicon-quiroz.svg')}"><link rel="stylesheet" href="${sharedStyles}"></head><body><main class="not-found"><p class="kicker">Error 404</p><h1>Esta página no existe.</h1><p>Puede que el enlace haya cambiado o que la dirección no sea correcta.</p><a class="primary" href="${link('/')}">Volver al estudio</a></main></body></html>`
await writeFile(resolve(OUTPUT, '404.html'), notFound, 'utf8')
