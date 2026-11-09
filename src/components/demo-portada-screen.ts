import { useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

// Render the display inside WebGL: no DOM layers can cover it during the turn.
function drawDesktopScreen(ctx: CanvasRenderingContext2D, photo?: HTMLImageElement) {
  const paper = '#faf1e6'
  const champagne = '#e2b780'
  ctx.fillStyle = '#17130f'
  ctx.fillRect(0, 0, 1200, 726)
  if (photo) {
    const scale = Math.max(1200 / photo.naturalWidth, 726 / photo.naturalHeight)
    const width = photo.naturalWidth * scale
    const height = photo.naturalHeight * scale
    ctx.drawImage(photo, 1200 - width, (726 - height) * 0.47, width, height)
  }
  const shade = ctx.createLinearGradient(0, 0, 920, 0)
  shade.addColorStop(0, '#100d0be0')
  shade.addColorStop(0.39, '#100d0ba0')
  shade.addColorStop(0.73, '#100d0b10')
  shade.addColorStop(1, '#100d0b00')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, 1200, 726)
  const depth = ctx.createLinearGradient(0, 0, 0, 726)
  depth.addColorStop(0, '#0d0a08dd')
  depth.addColorStop(0.28, '#100b0722')
  depth.addColorStop(0.84, '#130c0800')
  depth.addColorStop(1, '#130e0977')
  ctx.fillStyle = depth
  ctx.fillRect(0, 0, 1200, 726)

  ctx.fillStyle = paper
  ctx.font = 'italic 600 28px Georgia'
  ctx.fillText('RESTAURANTE', 67, 79)
  ctx.font = '19px Arial'
  ctx.fillText('Inicio      Carta      El restaurante      Contacto', 645, 77)
  ctx.fillStyle = '#ba8d59'
  ctx.beginPath()
  ctx.roundRect(1055, 49, 105, 44, 7)
  ctx.fill()
  ctx.fillStyle = '#fff5e7'
  ctx.font = '18px Arial'
  ctx.fillText('Reservar', 1073, 77)

  ctx.fillStyle = paper
  ctx.font = 'italic 85px Georgia'
  ctx.fillText('Cocina de', 66, 329)
  ctx.fillText('temporada', 62, 420)
  ctx.font = '25px Arial'
  ctx.fillText('Producto local, tradición', 66, 487)
  ctx.fillText('y una experiencia única.', 66, 525)
  ctx.strokeStyle = champagne
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(66, 568, 149, 54, 8)
  ctx.stroke()
  ctx.font = '600 20px Arial'
  ctx.fillText('Ver carta  →', 83, 602)
}

export function useRestaurantScreen(desktop = false) {
  const invalidate = useThree(state => state.invalidate)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200; canvas.height = 726
    return new CanvasTexture(canvas)
  }, [])
  useEffect(() => {
    const canvas = texture.image as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    let active = true
    const draw = (photo?: HTMLImageElement) => {
      if (desktop) {
        drawDesktopScreen(ctx, photo)
        texture.needsUpdate = true
        invalidate()
        return
      }
      ctx.fillStyle = '#201811'; ctx.fillRect(0, 0, 1200, 726)
      if (photo) {
        const scale = Math.max(1200 / photo.width, 530 / photo.height)
        ctx.drawImage(photo, (1200 - photo.width * scale) / 2, 100, photo.width * scale, photo.height * scale)
      } else {
        const glow = ctx.createRadialGradient(930, 350, 20, 930, 350, 350)
        glow.addColorStop(0, '#aa7950'); glow.addColorStop(1, '#302015')
        ctx.fillStyle = glow; ctx.fillRect(0, 100, 1200, 530)
      }
      const shade = ctx.createLinearGradient(0, 0, 1200, 0)
      shade.addColorStop(0, '#19120bf0'); shade.addColorStop(0.6, '#19120b70'); shade.addColorStop(1, '#19120b10')
      ctx.fillStyle = shade; ctx.fillRect(0, 100, 1200, 530)
      ctx.fillStyle = '#17120e'; ctx.fillRect(0, 0, 1200, 100); ctx.fillRect(0, 630, 1200, 96)
      ctx.fillStyle = '#f0e7d9'; ctx.font = '32px Georgia'; ctx.fillText('RESTAURANTE', 65, 62)
      ctx.font = '16px Arial'; ctx.fillText('La cocina     Carta     Reservas', 825, 58)
      ctx.fillStyle = '#d6be9f'; ctx.font = '15px Arial'; ctx.fillText('COCINA DE TEMPORADA', 70, 185)
      ctx.fillStyle = '#f7eee0'; ctx.font = '76px Georgia'; ctx.fillText('El sabor de', 65, 290)
      ctx.font = 'italic 76px Georgia'; ctx.fillText('quedarse.', 65, 378)
      ctx.font = '19px Arial'; ctx.fillText('Un momento para disfrutar con todos los sentidos.', 70, 435)
      ctx.fillStyle = '#d6be9f'; ctx.fillRect(70, 485, 245, 57)
      ctx.fillStyle = '#22170f'; ctx.font = '19px Arial'; ctx.fillText('Reservar mesa  ↗', 105, 521)
      ctx.fillStyle = '#d6be9f'; ctx.font = '17px Georgia'; ctx.fillText('Producto, origen y calma.', 70, 685)
      ctx.font = '14px Arial'; ctx.fillText('DEMONSTRACIÓN CONCEPTUAL', 885, 685)
      texture.needsUpdate = true
      invalidate()
    }
    texture.colorSpace = SRGBColorSpace
    draw()
    const photo = new Image()
    photo.onload = () => { if (active) draw(photo) }
    photo.src = `${import.meta.env.BASE_URL}${desktop ? 'quiroz-cocina-concepto.webp' : 'quiroz-restaurante.webp'}`
    return () => { active = false; texture.dispose() }
  }, [texture, invalidate, desktop])
  return texture
}
