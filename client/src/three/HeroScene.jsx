import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

function Pavilion() {
  const architecture = useRef(null)
  const reduceMotion = useReducedMotion()
  const trees = [-5.2, 5.2]
  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime()
    if (architecture.current) architecture.current.rotation.y = reduceMotion ? 0 : Math.sin(time * 0.12) * 0.025
    camera.position.set(reduceMotion ? 11.4 : 11.4 + Math.sin(time * 0.12) * 0.22, 7.6, 16.8)
    camera.lookAt(0, 1.8, 0)
  })

  return (
    <group ref={architecture}>
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[15, 0.3, 9]} />
        <meshStandardMaterial color="#c9bda9" roughness={0.42} />
      </mesh>
      <mesh position={[0, 1.95, -2.35]} castShadow receiveShadow>
        <boxGeometry args={[10.8, 4.3, 3.2]} />
        <meshStandardMaterial color="#dfd5c6" roughness={0.48} />
      </mesh>
      <mesh position={[-5.65, 1.9, -1.7]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 3.95, 4.2]} />
        <meshStandardMaterial color="#e9b9a2" roughness={0.38} />
      </mesh>
      <mesh position={[5.65, 1.9, -1.7]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 3.95, 4.2]} />
        <meshStandardMaterial color="#c9b8ed" roughness={0.38} />
      </mesh>
      <mesh position={[0, 2.08, -0.7]}>
        <boxGeometry args={[8.6, 3.65, 0.14]} />
        <meshPhysicalMaterial color="#71958e" roughness={0.14} metalness={0.12} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0, 0.97, -0.56]}>
        <boxGeometry args={[2.05, 2.12, 0.12]} />
        <meshPhysicalMaterial color="#b8dccb" roughness={0.13} metalness={0.1} transparent opacity={0.58} />
      </mesh>
      <mesh position={[0, 3.78, -0.56]}>
        <boxGeometry args={[8.85, 0.12, 0.22]} />
        <meshStandardMaterial color="#f18b78" emissive="#f18b78" emissiveIntensity={0.48} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={`mullion-${index}`} position={[-3.6 + index * 1.2, 2.07, -0.6]}>
          <boxGeometry args={[0.055, 3.58, 0.06]} />
          <meshStandardMaterial color="#f4efe4" metalness={0.28} roughness={0.35} />
        </mesh>
      ))}
      {[-5.3, 5.3].map((x, index) => (
        <group key={`wing-glass-${x}`}>
          <mesh position={[x, 1.98, 0.43]}>
            <boxGeometry args={[1.45, 3.4, 0.08]} />
            <meshPhysicalMaterial color={index ? '#c7b8f1' : '#f6c8aa'} roughness={0.16} metalness={0.13} transparent opacity={0.48} />
          </mesh>
          {[-0.36, 0.36].map((offset) => (
            <mesh key={offset} position={[x + offset, 1.98, 0.49]}>
              <boxGeometry args={[0.035, 3.34, 0.03]} />
              <meshStandardMaterial color="#fff8ed" metalness={0.35} roughness={0.24} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 4.23, -2.3]} castShadow>
        <boxGeometry args={[11.6, 0.24, 3.8]} />
        <meshStandardMaterial color="#b9a98e" roughness={0.34} />
      </mesh>
      <mesh position={[0, 4.36, -0.55]}>
        <boxGeometry args={[9.9, 0.08, 2.6]} />
        <meshStandardMaterial color="#d3b16f" metalness={0.42} roughness={0.27} emissive="#d3b16f" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 2.85, 0.28]} castShadow>
        <boxGeometry args={[7.4, 0.25, 2.15]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.26} />
      </mesh>
      {[-3.15, 3.15].map((x) => (
        <mesh key={`column-${x}`} position={[x, 1.55, 0.1]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 3.1, 24]} />
          <meshStandardMaterial color="#f4efe5" roughness={0.32} />
        </mesh>
      ))}
      {Array.from({ length: 10 }, (_, index) => (
        <mesh key={`step-${index}`} position={[0, -0.12 + index * 0.035, 2.15 + index * 0.34]} receiveShadow>
          <boxGeometry args={[6.8 - index * 0.38, 0.12, 0.36]} />
          <meshStandardMaterial color={index % 2 ? '#cabeaa' : '#ded4c4'} roughness={0.54} />
        </mesh>
      ))}
      <mesh position={[0, -0.05, 6.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.9, 48]} />
        <meshPhysicalMaterial color="#a8d5f2" roughness={0.18} metalness={0.14} transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.015, 6.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.95, 3.04, 48]} />
        <meshStandardMaterial color="#fff5df" metalness={0.42} roughness={0.24} />
      </mesh>
      {trees.map((x) => (
        <group key={`tree-${x}`} position={[x, 0, 1.8]}>
          <mesh position={[0, 0.28, 0]} receiveShadow>
            <cylinderGeometry args={[0.95, 1.15, 0.56, 32]} />
            <meshStandardMaterial color="#b9aa91" roughness={0.76} />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.11, 1.4, 12]} />
            <meshStandardMaterial color="#89785f" />
          </mesh>
          {[0, 1, 2, 3].map((leaf) => (
            <mesh key={leaf} position={[Math.cos(leaf * 1.7) * 0.35, 1.85 + (leaf % 2) * 0.25, Math.sin(leaf * 1.7) * 0.35]} castShadow>
              <icosahedronGeometry args={[0.62, 1]} />
              <meshStandardMaterial color={leaf % 2 ? '#77856e' : '#899478'} roughness={0.72} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.03, -5]}>
        <boxGeometry args={[22, 0.08, 0.08]} />
        <meshStandardMaterial color="#c6a66f" emissive="#c6a66f" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[-5.3, 2.5, 1.2]} intensity={0.75} color="#f6c8aa" />
      <pointLight position={[5.2, 2.8, 0.7]} intensity={0.72} color="#c7b8f1" />
    </group>
  )
}

export default function HeroScene({ compact = false }) {
  return (
    <Canvas
      className={compact ? 'hero-canvas hero-canvas-compact' : 'hero-canvas'}
      aria-label="Animated architectural model of a contemporary mall entrance"
      dpr={[1, 1.35]}
      camera={{ position: [11.4, 7.6, 16.8], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.94
        camera.lookAt(0, 1.8, 0)
      }}
      fallback={<div className="hero-3d-fallback" aria-label="Architectural entrance illustration" />}
    >
      <color attach="background" args={['#e8e2d6']} />
      <fog attach="fog" args={['#e8e2d6', 20, 42]} />
      <ambientLight intensity={0.45} color="#fff4df" />
      <hemisphereLight args={['#fff8e9', '#89765f', 0.48]} />
      <directionalLight position={[8, 12, 9]} intensity={1.7} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-2, 5, 1]} intensity={0.65} color="#f4d6a0" />
      <Suspense fallback={null}><Pavilion /><AdaptiveDpr pixelated /></Suspense>
    </Canvas>
  )
}
