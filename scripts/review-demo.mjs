import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { chromium } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const outputDir = resolve(root, process.env.REVIEW_OUTPUT_DIR ?? join('artifacts', 'visual-review', stamp))
const referenceDir = process.env.REVIEW_REFERENCE_DIR ? resolve(root, process.env.REVIEW_REFERENCE_DIR) : null
const viewports = [
  { name: 'desktop', width: 1440, height: 1000, isMobile: false },
  { name: 'tablet', width: 900, height: 1100, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]

function wait(ms) {
  return new Promise(resolveWait => setTimeout(resolveWait, ms))
}

async function freePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      server.close(() => resolvePort(address.port))
    })
  })
}

async function waitForServer(url, timeout = 30000) {
  const deadline = Date.now() + timeout
  let lastError = 'sin respuesta'
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok || response.status === 404) return
      lastError = `HTTP ${response.status}`
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
    await wait(250)
  }
  throw new Error(`El servidor local no respondió a tiempo (${lastError})`)
}

function startServer(port) {
  const viteCli = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js')
  const server = spawn(process.execPath, [viteCli, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: root,
    env: { ...process.env, BROWSER: 'none' },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })
  const logs = []
  server.stdout.on('data', chunk => logs.push(String(chunk)))
  server.stderr.on('data', chunk => logs.push(String(chunk)))
  return { server, logs }
}

async function compareImages(actualPath, referencePath, diffPath) {
  const [actualBuffer, referenceBuffer] = await Promise.all([readFile(actualPath), readFile(referencePath)])
  const actual = PNG.sync.read(actualBuffer)
  const reference = PNG.sync.read(referenceBuffer)
  if (actual.width !== reference.width || actual.height !== reference.height) {
    return {
      status: 'dimension-mismatch',
      actual: `${actual.width}x${actual.height}`,
      reference: `${reference.width}x${reference.height}`,
    }
  }

  const diff = new PNG({ width: actual.width, height: actual.height })
  const differentPixels = pixelmatch(actual.data, reference.data, diff.data, actual.width, actual.height, { threshold: 0.1 })
  await writeFile(diffPath, PNG.sync.write(diff))
  const ratio = differentPixels / (actual.width * actual.height)
  return {
    status: 'compared',
    differentPixels,
    ratio: Number(ratio.toFixed(4)),
    diffPath,
  }
}

function referenceFor(name) {
  if (!referenceDir) return null
  return resolve(referenceDir, `${name}.png`)
}

async function captureViewport(browser, baseUrl, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile,
    reducedMotion: 'no-preference',
  })
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []
  const failedRequests = []

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => pageErrors.push(error.message))
  page.on('requestfailed', request => {
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? 'unknown' })
  })

  const url = `${baseUrl}/demo-portada-3d`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts?.ready)

  // Capture before the 4.6s entrance animation finishes.
  await page.waitForTimeout(350)
  const initialPath = resolve(outputDir, `${viewport.name}-initial.png`)
  await page.screenshot({ path: initialPath, fullPage: true })

  let canvasVisible = false
  try {
    await page.locator('.qd-canvas canvas').waitFor({ state: 'visible', timeout: 10000 })
    canvasVisible = true
  } catch {
    // The final report records this as a WebGL/rendering issue.
  }
  await page.waitForTimeout(5200)
  const finalPath = resolve(outputDir, `${viewport.name}-after-animation.png`)
  await page.screenshot({ path: finalPath, fullPage: true })

  const diagnostics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth
    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0)
    const overflowNodes = [...document.querySelectorAll('*')]
      .filter(element => {
        const rect = element.getBoundingClientRect()
        return rect.right > viewportWidth + 1 || rect.left < -1
      })
      .slice(0, 12)
      .map(element => ({ tag: element.tagName.toLowerCase(), className: element.className, right: Math.round(element.getBoundingClientRect().right) }))
    const canvas = document.querySelector('canvas')
    let webgl = false
    if (canvas instanceof HTMLCanvasElement) {
      webgl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    }
    return {
      title: document.title,
      documentWidth,
      viewportWidth,
      horizontalOverflow: documentWidth > viewportWidth + 1,
      overflowNodes,
      canvas: Boolean(canvas),
      webgl,
      links: [...document.querySelectorAll('a')].filter(link => !link.href).length,
    }
  })

  const referencePath = referenceFor(viewport.name)
  let comparison = { status: 'not-configured' }
  if (referencePath) {
    try {
      comparison = await compareImages(finalPath, referencePath, resolve(outputDir, `${viewport.name}-diff.png`))
    } catch (error) {
      comparison = { status: 'reference-unavailable', message: error instanceof Error ? error.message : String(error) }
    }
  }

  await context.close()
  return {
    ...viewport,
    initialPath,
    finalPath,
    consoleErrors,
    pageErrors,
    failedRequests,
    canvasVisible,
    diagnostics,
    comparison,
  }
}

function relative(filePath) {
  return filePath.replace(`${root}${process.platform === 'win32' ? '\\' : '/'}`, '').replaceAll('\\', '/')
}

function markdownReport({ baseUrl, branch, serverLogs, results, startedAt }) {
  const rows = results.map(result => {
    const errors = result.consoleErrors.length + result.pageErrors.length
    const overflow = result.diagnostics.horizontalOverflow ? 'Sí' : 'No'
    const webgl = result.diagnostics.webgl ? 'OK' : 'No disponible'
    return `| ${result.name} (${result.width}×${result.height}) | ${webgl} | ${overflow} | ${errors} | ${result.failedRequests.length} |`
  }).join('\n')
  const details = results.map(result => {
    const comparison = result.comparison.status === 'compared'
      ? `comparada; diferencia de píxeles ${(result.comparison.ratio * 100).toFixed(2)}% ([diff](${relative(result.comparison.diffPath)}))`
      : result.comparison.status === 'not-configured'
        ? 'no configurada: no se encontró referencia aprobada explícita'
        : `no disponible (${result.comparison.status})`
    const errors = [...result.consoleErrors, ...result.pageErrors].map(error => `  - ${error}`).join('\n') || '  - Ninguno'
    const failedRequests = result.failedRequests.map(request => `  - ${request.error}: ${request.url}`).join('\n') || '  - Ninguna'
    return `### ${result.name}\n\n- Captura inicial: [${relative(result.initialPath)}](${relative(result.initialPath)})\n- Captura tras animación: [${relative(result.finalPath)}](${relative(result.finalPath)})\n- Referencia visual: ${comparison}\n- Ancho del documento: ${result.diagnostics.documentWidth}px; viewport: ${result.diagnostics.viewportWidth}px\n- Canvas visible durante la revisión: ${result.canvasVisible ? 'Sí' : 'No'}\n- Elementos fuera de viewport: ${result.diagnostics.overflowNodes.length ? result.diagnostics.overflowNodes.map(node => `\`${node.tag}.${node.className}\``).join(', ') : 'Ninguno'}\n\nErrores de consola/página:\n${errors}\n\nPeticiones fallidas:\n${failedRequests}`
  }).join('\n\n')
  const hasErrors = results.some(result => result.consoleErrors.length || result.pageErrors.length)
  const hasOverflow = results.some(result => result.diagnostics.horizontalOverflow)
  const hasNoWebgl = results.some(result => !result.diagnostics.webgl)
  const status = hasErrors || hasOverflow || hasNoWebgl ? 'Requiere revisión' : 'Correcto en las comprobaciones automáticas'
  return `# Revisión visual automática — /demo-portada-3d\n\n- Fecha: ${startedAt}\n- Rama: ${branch}\n- Estado: **${status}**\n- URL local: ${baseUrl}/demo-portada-3d\n- Servidor: local y temporal; se detuvo al finalizar\n- Publicación, push, merge y deploy: no realizados\n\n## Resumen\n\n| Viewport | WebGL | Overflow horizontal | Errores JS | Peticiones fallidas |\n| --- | --- | --- | ---: | ---: |\n${rows}\n\n## Criterio visual\n\nNo se detectó una referencia aprobada explícita. Las imágenes existentes phase3-*.png se conservan como evidencia previa y no se usan como objetivo automático. Para comparar una referencia, definir REVIEW_REFERENCE_DIR=visual-reference y ejecutar npm run review:demo con desktop.png, tablet.png y mobile.png dentro de esa carpeta.\n\n## Detalle por viewport\n\n${details}\n\n## Logs del servidor\n\n~~~text\n${serverLogs.join('').slice(-4000) || 'Sin salida'}\n~~~\n`
}

async function main() {
  const startedAt = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })
  await mkdir(outputDir, { recursive: true })
  const port = await freePort()
  const baseUrl = `http://127.0.0.1:${port}`
  const { server, logs } = startServer(port)
  let browser
  try {
    await waitForServer(`${baseUrl}/demo-portada-3d`)
    browser = await chromium.launch({ headless: true })
    const results = []
    for (const viewport of viewports) results.push(await captureViewport(browser, baseUrl, viewport))
    const branch = (await new Promise((resolveBranch, reject) => {
      const git = spawn('git', ['branch', '--show-current'], { cwd: root, windowsHide: true })
      let output = ''
      git.stdout.on('data', chunk => { output += chunk })
      git.once('error', reject)
      git.once('close', code => code === 0 ? resolveBranch(output.trim()) : reject(new Error(`git terminó con código ${code}`)))
    }))
    const reportPath = resolve(outputDir, 'report.md')
    await writeFile(reportPath, markdownReport({ baseUrl, branch, serverLogs: logs, results, startedAt }), 'utf8')
    console.log(`Informe: ${reportPath}`)
    console.log(`Capturas: ${outputDir}`)
    if (results.some(result => result.consoleErrors.length || result.pageErrors.length || result.diagnostics.horizontalOverflow || !result.diagnostics.webgl)) process.exitCode = 1
  } finally {
    await browser?.close()
    server.kill()
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
