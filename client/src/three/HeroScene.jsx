import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// ── Premium realistic mall interior visual for the hero section ──
// Marble floors, glass balustrades, brass handrails, warm architectural lighting,
// slow cinematic camera movement. No cartoon colours or low-poly styling.

const GOLD = '#c8a96a'
const MARBLE = '#f2efe6'
const STONE = '#d8d2c4'
const GLASS_TINT = '#eef4f8'
const WARM_WHITE = '#fff7e6'

function Column({ x, z, height = 4.6 }) {
  return (
    <group position={[x, height / 2, z]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, height, 32]} />
        <meshStandardMaterial color={STONE} roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0, height / 2 + 0.08, 0]}>
        <cylinderGeometry args={[0.62, 0.68, 0.3, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.08, 0]}>
        <cylinderGeometry args={[0.62, 0.68, 0.3, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  )
}

function GlassPanel({ x, y, z, rotationY, width, height: panelHeight, depth = 0.08 }) {
  return (
    <mesh position={[x, y, z]} rotation={[0, rotationY, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, panelHeight, depth]} />
      <meshPhysicalMaterial
        color={GLASS_TINT}
        transmission={0.92}
        roughness={0.04}
        metalness={0.08}
        transparent
        opacity={0.75}
        ior={1.45}
      />
    </mesh>
  )
}

function Handrail({ x, z, rotationY, length }) {
  return (
    <group position={[x, 1.05, z]} rotation={[0, rotationY, 0]}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, length, 16]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, length / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, -length / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function StorefrontColumn({ x, z, side = 1 }) {
  return (
    <group position={[side * x, 2.3, z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.12, 4.6, 0.12]} />
        <meshStandardMaterial color={STONE} roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.15} />
      </mesh>
    </group>
  )
}

function MallInterior() {
  const architecture = useRef(null)
  const reduceMotion = useReducedMotion()

  // Slow cinematic camera orbit around the mall interior
  useFrame(({ clock, camera }) => {
    if (reduceMotion.current) return
    const time = clock.getElapsedTime()
    const radius = 18
    const height = 7.5
    const speed = 0.08
    camera.position.set(
      Math.sin(time * speed) * radius,
      height + Math.cos(time * speed * 0.5) * 0.6,
      Math.cos(time * speed) * radius + 2
    )
    camera.lookAt(0, 2.2, 0)
    if (architecture.current) {
      architecture.current.rotation.y = Math.sin(time * 0.06) * 0.015
    }
  })

  return (
    <group ref={architecture}>
      {/* Marble floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={MARBLE} roughness={0.18} metalness={0.08} />
      </mesh>

      {/* Central atrium opening */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#e8e3d8" roughness={0.4} />
      </mesh>

      {/* Structural columns around the perimeter */}
      {[-12, -6, 0, 6, 12].map((z) => (
        <>
          <Column key={`col-l-${z}`} x={-14} z={z} />
          <Column key={`col-r-${z}`} x={14} z={z} />
        </>
      ))}

      {/* Glass balustrade around atrium */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <group key={`balustrade-${i}`} position={[0, 0, 0]} rotation={[0, angle, 0]}>
          <GlassPanel x={7} y={2} z={-3} rotationY={0} width={13} height={3.2} />
          <Handrail x={7} z={-3} rotationY={0} length={13} />
        </group>
      ))}

      {/* Storefront columns along the sides */}
      {[-9, -3, 3, 9].map((z) => (
        <>
          <StorefrontColumn key={`store-l-${z}`} x={13.5} z={z} side={1} />
          <StorefrontColumn key={`store-r-${z}`} x={13.5} z={z} side={-1} />
        </>
      ))}

      {/* Central escalator */}
      <group position={[0, 1.2, 8]} rotation={[0.3, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.3, 5.2]} />
          <meshStandardMaterial color="#302d28" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[1.0, 0.7, 5.0]} />
          <meshPhysicalMaterial color="#e8f3fa" transmission={0.85} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0, 0.8, 0]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 5.0, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#1a1918" roughness={0.4} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={`step-${i}`} position={[0, 0.3 + i * 0.12, -1.6 + i * 0.4]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.9, 0.08, 0.3]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#aaa49a' : '#77736b'} roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Warm recessed ceiling lights */}
      {[-8, -4, 0, 4, 8].map((z) => (
        <group key={`light-${z}`} position={[0, 4.55, z]}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.12, 16]} />
            <meshStandardMaterial color="#2d2a26" metalness={0.7} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 0, -0.06]} color={WARM_WHITE} intensity={1.2} distance={5} decay={2} />
        </group>
      ))}

      {/* Ambient glow panels */}
      <mesh position={[0, 4.4, -12]}>
        <planeGeometry args={[12, 2]} />
        <meshStandardMaterial color={WARM_WHITE} emissive={WARM_WHITE} emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.4, 12]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[12, 2]} />
        <meshStandardMaterial color={WARM_WHITE} emissive={WARM_WHITE} emissiveIntensity={0.6} roughness={0.3} />
      </mesh>

      <pointLight position={[-10, 6, -5]} color="#f4e8c9" intensity={0.8} distance={15} />
      <pointLight position={[10, 6, -5]} color="#f4e8c9" intensity={0.8} distance={15} />
    </group>
  )
}

export default function HeroScene({ compact = false }) {
  return (
    <Canvas
      className={compact ? 'hero-canvas hero-canvas-compact' : 'hero-canvas'}
      aria-label="Premium realistic 3D shopping mall interior architectural visualization"
      dpr={[1, 1.5]}
      camera={{ position: [0, 7.5, 20], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      shadows
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
        camera.lookAt(0, 2.2, 0)
      }}
      fallback={<div className="hero-3d-fallback" aria-label="Architectural mall interior" />}
    >
      <color attach="background" args={['#f7f4ec']} />
      <fog attach="fog" args={['#f7f4ec', 15, 45]} />
      <ambientLight intensity={0.5} color="#fff9f0" />
      <hemisphereLight args={['#fff8e9', '#b9aa91', 0.4]} />
      <directionalLight position={[10, 15, 8]} intensity={1.2} color="#fffdf4" castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-8, 10, -12]} intensity={0.6} color="#f3e9d2" castShadow />
      <Suspense fallback={null}>
        <MallInterior />
        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  )
}
