import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const output = resolve('dist')
const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
const errors = []
const titles = new Map()
const indexedPaths = new Set(urls.map((url) => new URL(url).pathname || '/'))

const value = (html, pattern) => html.match(pattern)?.[1]?.trim()

for (const url of urls) {
  const pathname = new URL(url).pathname || '/'
  const file = pathname === '/' ? resolve(output, 'index.html') : resolve(output, `.${pathname}`, 'index.html')
  let html = ''
  try {
    html = await readFile(file, 'utf8')
  } catch {
    errors.push(`${pathname}: no existe index.html`)
    continue
  }

  const title = value(html, /<title>(.*?)<\/title>/s)
  const description = value(html, /<meta name="description" content="(.*?)"/s)
  const canonical = value(html, /<link rel="canonical" href="(.*?)"/s)
  const robots = value(html, /<meta name="robots" content="(.*?)"/s)
  const h1Count = (html.match(/<h1[\s>]/g) || []).length

  if (!title || title.length < 30 || title.length > 65) errors.push(`${pathname}: title ausente o fuera de rango (${title?.length || 0})`)
  if (title) titles.set(title, [...(titles.get(title) || []), pathname])
  if (!description || description.length < 110 || description.length > 165) errors.push(`${pathname}: description ausente o fuera de rango (${description?.length || 0})`)
  if (canonical !== url) errors.push(`${pathname}: canonical incorrecta (${canonical})`)
  if (robots?.includes('noindex')) errors.push(`${pathname}: URL del sitemap contiene noindex`)
  if (h1Count !== 1) errors.push(`${pathname}: contiene ${h1Count} H1 en HTML inicial`)

  for (const required of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description']) {
    if (!html.includes(`property="${required}"`) && !html.includes(`name="${required}"`)) errors.push(`${pathname}: falta ${required}`)
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]) } catch (error) { errors.push(`${pathname}: JSON-LD inválido (${error.message})`) }
  }

  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const target = new URL(href, url)
    if (target.origin !== new URL(url).origin || !target.pathname.startsWith('/')) continue
    if (/\.[a-z0-9]+$/i.test(target.pathname)) continue
    const targetPath = target.pathname || '/'
    if (!indexedPaths.has(targetPath)) errors.push(`${pathname}: enlace interno roto o no indexado (${href})`)
  }
}

for (const [title, paths] of titles) {
  if (paths.length > 1) errors.push(`title duplicado en ${paths.join(', ')}: ${title}`)
}

const notFound = await readFile(resolve(output, '404.html'), 'utf8')
if (!notFound.includes('noindex,follow')) errors.push('/404.html: debe incluir noindex,follow')

for (const required of ['robots.txt', 'sitemap.xml', 'og-quiroz.webp', 'favicon-quiroz.svg', 'qr-maitagarri.webp', 'qr-quiroz-cocina.webp']) {
  try { await access(resolve(output, required)) } catch { errors.push(`falta /${required}`) }
}

if (errors.length) {
  console.error(`Validación SEO fallida (${errors.length}):\n- ${errors.join('\n- ')}`)
  process.exit(1)
}

console.log(`SEO validado: ${urls.length} URLs canónicas, metadata única, enlaces internos, JSON-LD, sitemap y 404 correctos.`)
