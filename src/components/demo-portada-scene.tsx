import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Environment, Lightformer } from '@react-three/drei'
import { MathUtils, PerspectiveCamera, Shape } from 'three'
import type { Group, MeshStandardMaterial } from 'three'
import { useRestaurantScreen } from './demo-portada-screen'

const keys = Array.from({ length: 6 }, (_, row) => Array.from({ length: row === 5 ? 7 : 14 }, (_, column) => ({ row, column }))).flat()
function Laptop({ reduced }: { reduced: boolean }) {
  const screen = useRestaurantScreen()
  const group = useRef<Group>(null)
  const elapsed = useRef(0)
  useFrame((state, delta) => {
    elapsed.current += Math.min(delta, 0.05)
    const t = reduced ? 1 : Math.min(elapsed.current / 4.6, 1)
    const e = 1 - Math.pow(1 - t, 3)
    if (group.current) {
      group.current.position.set((1 - e) * 8, -0.65 + (1 - e) * 0.4, (1 - e) * -3)
      // Keep the display facing the camera throughout the turn.
      group.current.rotation.set(0, -0.18 + (1 - e) * 0.85, (1 - e) * -0.06)
    }
    if (t < 1) state.invalidate()
  })
  return <group ref={group}>
    <RoundedBox args={[5.3, 0.12, 3.45]} radius={0.055} smoothness={3}><meshStandardMaterial color="#484440" metalness={0.85} roughness={0.26}/></RoundedBox>
    <RoundedBox args={[5.18, 0.035, 3.34]} position={[0, -0.069, 0]} radius={0.016} smoothness={2}><meshStandardMaterial color="#242220" metalness={0.8} roughness={0.32}/></RoundedBox>
    <RoundedBox args={[4.55, 0.018, 1.93]} position={[0, 0.066, -0.45]} radius={0.008} smoothness={2}><meshStandardMaterial color="#141311" roughness={0.6}/></RoundedBox>
    {keys.map(({ row, column }) => <RoundedBox key={`${row}-${column}`} args={[row === 5 && column === 3 ? 1.6 : 0.265, 0.026, row === 0 ? 0.15 : 0.24]} radius={0.009} smoothness={1} position={[row === 5 ? (column < 3 ? -2.08 + column * 0.32 : column === 3 ? 0 : 1.44 + (column - 4) * 0.32) : -2.08 + column * 0.32, 0.089, -1.22 + row * 0.29]}><meshStandardMaterial color="#51473d" metalness={0.15} roughness={0.48}/></RoundedBox>)}
    <RoundedBox args={[1.85, 0.012, 0.85]} position={[0, 0.068, 0.98]} radius={0.005} smoothness={2}><meshStandardMaterial color="#665c51" metalness={0.8} roughness={0.32}/></RoundedBox>
    <RoundedBox args={[1.81, 0.014, 0.81]} position={[0, 0.07, 0.98]} radius={0.006} smoothness={2}><meshStandardMaterial color="#423e39" metalness={0.8} roughness={0.32}/></RoundedBox>
    {[-1.85, 1.85].map(x => <mesh key={x} position={[x, 0.08, -1.58]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.075, 0.075, 0.72, 12]}/><meshStandardMaterial color="#716355" metalness={0.9} roughness={0.23}/></mesh>)}
    <group position={[0, 0.1, -1.58]} rotation={[-0.18, 0, 0]}>
      <RoundedBox args={[5.3, 3.36, 0.095]} position={[0, 1.66, 0]} radius={0.045} smoothness={3}><meshStandardMaterial color="#45403a" metalness={0.9} roughness={0.24}/></RoundedBox>
      <RoundedBox args={[5.16, 3.23, 0.025]} position={[0, 1.66, 0.055]} radius={0.012} smoothness={2}><meshStandardMaterial color="#0c0b0a" roughness={0.35}/></RoundedBox>
      <mesh position={[0, 1.66, 0.079]}><planeGeometry args={[4.94, 2.99]}/><meshBasicMaterial map={screen} toneMapped={false}/></mesh>
      <mesh position={[0, 3.25, 0.075]}><circleGeometry args={[0.018, 12]}/><meshBasicMaterial color="#746a5e"/></mesh>
    </group>
  </group>
}
const stoneSurface: MeshStandardMaterial['onBeforeCompile'] = (shader) => {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vStonePosition;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvStonePosition = position;')
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `
      #include <common>
      varying vec3 vStonePosition;

      float stoneHash(vec3 p) {
        p = fract(p * vec3(0.1031, 0.11369, 0.13787));
        p += dot(p, p.yzx + 19.19);
        return fract((p.x + p.y) * p.z);
      }

      float stoneNoise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(stoneHash(i), stoneHash(i + vec3(1,0,0)), u.x),
              mix(stoneHash(i + vec3(0,1,0)), stoneHash(i + vec3(1,1,0)), u.x), u.y),
          mix(mix(stoneHash(i + vec3(0,0,1)), stoneHash(i + vec3(1,0,1)), u.x),
              mix(stoneHash(i + vec3(0,1,1)), stoneHash(i + vec3(1,1,1)), u.x), u.y),
          u.z
        );
      }
    `)
    .replace('#include <color_fragment>', `
      #include <color_fragment>
      vec3 stonePoint = vStonePosition * vec3(2.8, 4.3, 3.5);
      float cloud = stoneNoise(stonePoint) * 0.65 + stoneNoise(stonePoint * 4.0) * 0.35;
      float grain = stoneNoise(stonePoint * 34.0);
      float strata = smoothstep(0.91, 0.99, sin(stonePoint.y * 2.1 + cloud * 7.2 + stonePoint.x * 1.7));
      diffuseColor.rgb *= 0.48 + cloud * 0.69 + grain * 0.36;
      diffuseColor.rgb += strata * mix(vec3(0.001), vec3(0.017, 0.012, 0.008), cloud);
    `)
}


const graphiteFinish: MeshStandardMaterial['onBeforeCompile'] = shader => {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying float vChinX;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvChinX = position.x;')
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying float vChinX;')
    .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= mix(1.25, 0.19, smoothstep(-3.7, 3.7, vChinX));')
}

const stoneProfile = new Shape()
stoneProfile.moveTo(-4.9, -1.47)
stoneProfile.lineTo(-3.58, -1.77)
stoneProfile.lineTo(-1.6, -2.02)
stoneProfile.lineTo(0.6, -2.09)
stoneProfile.lineTo(3.2, -1.96)
stoneProfile.lineTo(5.25, -1.64)
stoneProfile.lineTo(5.38, 0.98)
stoneProfile.lineTo(4.02, 1.73)
stoneProfile.lineTo(-3.4, 1.64)
stoneProfile.lineTo(-5.19, 0.58)
stoneProfile.closePath()

const standProfile = new Shape()
standProfile.moveTo(-0.31, -0.79)
standProfile.lineTo(0.66, -1.65)
standProfile.quadraticCurveTo(0.74, -1.86, 0.25, -1.90)
standProfile.lineTo(-0.85, -1.90)
standProfile.lineTo(-0.85, -1.85)
standProfile.lineTo(0.19, -1.85)
standProfile.quadraticCurveTo(0.56, -1.81, 0.52, -1.66)
standProfile.lineTo(-0.45, -0.79)
standProfile.closePath()

const stoneExtrusion = { depth: 1.10, bevelEnabled: true, bevelSize: 0.10, bevelThickness: 0.10, bevelSegments: 3, curveSegments: 8 }
const standExtrusion = { depth: 2.04, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3, curveSegments: 16 }

function HeroCamera() {
  const { camera, invalidate, size } = useThree()
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    const aspect = size.width / Math.max(1, size.height)
    const wide = MathUtils.smoothstep(aspect, 1.24, 1.37)
    camera.zoom = 1 + wide * 0.14
    camera.lookAt(0.30 - wide * 0.12, 0.415 + wide * 0.35, 0)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, invalidate, size.width, size.height])
  return null
}

function HeroDesktop({ reduced }: { reduced: boolean }) {
  const screen = useRestaurantScreen(true)
  const desktop = useRef<Group>(null)
  const elapsed = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const { gl, invalidate } = useThree()

  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) {
      pointer.current = { x: 0, y: 0 }
      invalidate()
      return
    }

    const canvas = gl.domElement
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current = {
        x: 2 * (event.clientX - rect.left) / rect.width - 1,
        y: 2 * (event.clientY - rect.top) / rect.height - 1,
      }
      invalidate()
    }
    const reset = () => {
      pointer.current = { x: 0, y: 0 }
      invalidate()
    }

    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', reset)
    return () => {
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', reset)
    }
  }, [gl, invalidate, reduced])


  useFrame(({ size, invalidate }, delta) => {
    const model = desktop.current
    if (!model) return
    const step = Math.min(delta, 0.05)
    elapsed.current += step
    const duration = size.width < 480 ? 0.9 : 1.9
    const progress = reduced ? 1 : Math.min(elapsed.current / duration, 1)
    const remaining = (1 - progress) ** 3
    const targetYaw = -0.56 - 0.18 * remaining + pointer.current.x * 0.09
    const targetPitch = -0.04 + pointer.current.y * 0.042
    const blend = reduced ? 1 : 1 - Math.exp(-step * 8)

    model.position.z = -0.38 * remaining
    model.rotation.y += (targetYaw - model.rotation.y) * blend
    model.rotation.x += (targetPitch - model.rotation.x) * blend

    const settling = Math.abs(model.rotation.y - targetYaw) + Math.abs(model.rotation.x - targetPitch)
    if (progress < 1 || settling > 0.001) invalidate()
  })

  return (
    <>
      <mesh position={[0.75, -3.11, 0]} rotation={[-Math.PI / 2, 0, -0.06]}>
        <extrudeGeometry args={[stoneProfile, stoneExtrusion]} />
        <meshStandardMaterial color="#23211e" roughness={0.91} onBeforeCompile={stoneSurface} />
      </mesh>
      <group ref={desktop} position={[0.03, 0, 0]} rotation={[-0.04, -0.56, 0]}>
        <mesh position={[-1.32, 0, 0.30]} rotation={[0, Math.PI / 2, 0]}>
          <extrudeGeometry args={[standProfile, standExtrusion]} />
          <meshStandardMaterial color="#817b72" metalness={0.88} roughness={0.27} />
        </mesh>
        <group position={[-0.34, 1.30, 0]} rotation={[-0.418, 0, 0.100]}>
          <RoundedBox args={[7.45, 4.91, 0.22]} radius={0.11} smoothness={4}>
            <meshStandardMaterial color="#85827d" metalness={0.88} roughness={0.25} />
          </RoundedBox>
          <RoundedBox args={[7.36, 4.81, 0.068]} radius={0.032} smoothness={4} position={[0, 0, 0.103]}>
            <meshStandardMaterial color="#11100e" metalness={0.3} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[7.34, 0.53, 0.057]} radius={0.028} smoothness={3} position={[0, -2.127, 0.125]}>
            <meshStandardMaterial color="#6c6966" metalness={0.66} roughness={0.39} onBeforeCompile={graphiteFinish} />
          </RoundedBox>
          <mesh position={[0, 0.247, 0.148]}>
            <planeGeometry args={[6.89, 4.16845]} />
            <meshBasicMaterial map={screen} toneMapped={false} />
          </mesh>
          <mesh position={[0, 2.379, 0.14]}>
            <circleGeometry args={[0.018, 12]} />
            <meshBasicMaterial color="#423a31" />
          </mesh>
        </group>
      </group>
    </>
  )
}

export default function Scene({ reduced, monitor = false }: { reduced: boolean; monitor?: boolean }) {
  return (
    <Canvas
      className={monitor ? 'qh-monitor-canvas' : 'qd-canvas'}
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: monitor ? [0.02, 1.65, 11.7] : [0, 2.8, 9.2], fov: monitor ? 38.5 : 42 }}
      gl={{ alpha: true, antialias: true }}
      fallback={<span />}
    >
      <ambientLight intensity={monitor ? 0.68 : 1.1} color="#f0e7d9" />
      <directionalLight position={monitor ? [-3, 5, 3] : [1, 5, 5]} color="#ffe5c3" intensity={monitor ? 1.95 : 2.8} />
      <pointLight position={[-4, 2, 1]} color="#d19a65" intensity={monitor ? 18 : 28} />
      {monitor && <spotLight position={[0, 3, -5]} color="#ffd6a2" intensity={104} angle={0.52} penumbra={0.87} />}
      <Environment resolution={64} frames={1}>
        <Lightformer position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 4, 1]} intensity={3} color="#fff1df" />
        <Lightformer position={[-4, 1, 0]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} intensity={4} color="#bc895e" />
        <Lightformer position={[4, 2, 3]} rotation={[0, -Math.PI / 4, 0]} scale={[2, 5, 1]} intensity={2} color="#f2d8b8" />
      </Environment>
      {monitor ? <><HeroCamera /><HeroDesktop reduced={reduced} /></> : <Laptop reduced={reduced} />}
    </Canvas>
  )
}
