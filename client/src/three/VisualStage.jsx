import { Canvas, useFrame } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

const palettes = {
  mall: { background: '#e7edf0', accent: '#d8b576', light: '#fff2d6' },
  stores: { background: '#edcbbb', accent: '#e67866', light: '#fff0d6' },
  dining: { background: '#f2c7a8', accent: '#c96548', light: '#ffe4a8' },
  events: { background: '#d4c9ef', accent: '#ef806e', light: '#fff0ce' },
  offers: { background: '#ecd39c', accent: '#d19a37', light: '#fff0bf' },
  entertainment: { background: '#bdd9d9', accent: '#8069b8', light: '#f2b9d1' },
  play: { background: '#e4d7f0', accent: '#e789a5', light: '#ffd7a5' },
  visit: { background: '#d8e6d9', accent: '#7fa899', light: '#fff2d7' },
  category: { background: '#e9e1d6', accent: '#b98c67', light: '#fff1d2' },
  storefront: { background: '#eadfd2', accent: '#c28e71', light: '#fff3dc' },
}

function FloatingGroup({ children, speed = 0.35, amplitude = 0.1, rotation = 0 }) {
  const group = useRef(null)
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    if (!group.current) return
    if (reducedMotion) {
      group.current.position.y = 0
      group.current.rotation.y = rotation
      return
    }
    const time = clock.getElapsedTime() * speed
    group.current.position.y = Math.sin(time) * amplitude
    group.current.rotation.y = rotation + Math.sin(time * 0.55) * 0.06
  })
  return <group ref={group}>{children}</group>
}

function Floor({ color = '#f2ece1', size = 22 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.13, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={0.78} />
    </mesh>
  )
}

function MallEnvironment({ accent, light, visit = false }) {
  const group = useRef(null)
  const reducedMotion = useReducedMotion()
  const columnXs = [-5.6, -2.8, 2.8, 5.6]
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = reducedMotion ? 0 : Math.sin(clock.getElapsedTime() * 0.12) * 0.018
  })
  return (
    <group ref={group}>
      <Floor color={visit ? '#e5eadc' : '#f1ece2'} size={34} />
      <mesh position={[0, 2.35, -3.2]} castShadow receiveShadow>
        <boxGeometry args={[13, 5.4, 1]} />
        <meshStandardMaterial color="#f8f6f0" roughness={0.34} />
      </mesh>
      <mesh position={[0, 2.4, -2.64]}>
        <boxGeometry args={[10.8, 4.65, 0.08]} />
        <meshPhysicalMaterial color="#a9c7c9" roughness={0.12} metalness={0.08} transparent opacity={0.58} />
      </mesh>
      {Array.from({ length: 8 }, (_, index) => (
        <mesh key={`mullion-${index}`} position={[-5.1 + index * 1.46, 2.35, -2.57]}>
          <boxGeometry args={[0.065, 4.6, 0.065]} />
          <meshStandardMaterial color="#fefcf5" metalness={0.3} roughness={0.28} />
        </mesh>
      ))}
      {[0, 1, 2].map((floor) => (
        <group key={`level-${floor}`} position={[0, floor * 2.18, 0]}>
          <mesh position={[0, 0.16, -0.05]} receiveShadow>
            <boxGeometry args={[12.7, 0.3, 5.7]} />
            <meshStandardMaterial color={floor % 2 ? '#f1e7d8' : '#fffaf0'} roughness={0.34} />
          </mesh>
          <mesh position={[0, 0.5, 2.72]}>
            <boxGeometry args={[12.4, 0.52, 0.08]} />
            <meshPhysicalMaterial color="#acd2ce" roughness={0.15} transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0.8, 2.75]}>
            <boxGeometry args={[12.4, 0.055, 0.12]} />
            <meshStandardMaterial color={accent} metalness={0.42} roughness={0.28} />
          </mesh>
          {[-4.3, 0, 4.3].map((x, index) => (
            <mesh key={`shop-${floor}-${index}`} position={[x, 1.06, -1.02]} castShadow>
              <boxGeometry args={[2.75, 1.78, 1.65]} />
              <meshStandardMaterial color={['#efc5ae', '#d2cae9', '#b9d8cb'][index]} roughness={0.42} />
            </mesh>
          ))}
          {columnXs.map((x) => (
            <mesh key={`column-${floor}-${x}`} position={[x, 1.1, 2.45]}>
              <cylinderGeometry args={[0.12, 0.17, 2.2, 16]} />
              <meshStandardMaterial color="#fffdf8" roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      <group position={[0, 0.12, 0.7]} rotation={[0, 0, -0.43]}>
        <mesh position={[-1.42, 1.18, 0]}>
          <boxGeometry args={[2.8, 0.16, 0.65]} />
          <meshStandardMaterial color="#d5c2a3" roughness={0.4} />
        </mesh>
        <mesh position={[1.42, 2.75, 0]}>
          <boxGeometry args={[2.8, 0.16, 0.65]} />
          <meshStandardMaterial color="#d5c2a3" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[0.11, 3.2, 0.54]} />
          <meshStandardMaterial color="#c0aa87" roughness={0.38} />
        </mesh>
      </group>
      {visit && [-1, 1].map((side) => (
        <group key={`tree-${side}`} position={[side * 7.3, 0, 2.2]}>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.9, 1.12, 0.56, 28]} />
            <meshStandardMaterial color="#d0c0a3" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.11, 0.14, 2.1, 12]} />
            <meshStandardMaterial color="#92775b" />
          </mesh>
          {[0, 1, 2].map((leaf) => (
            <mesh key={leaf} position={[(leaf - 1) * 0.4, 2.25 + (leaf % 2) * 0.35, 0]} castShadow>
              <icosahedronGeometry args={[0.64, 1]} />
              <meshStandardMaterial color={leaf % 2 ? '#91aa88' : '#aec29a'} roughness={0.72} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 5.85, -3.15]}>
        <boxGeometry args={[13.3, 0.2, 1.2]} />
        <meshStandardMaterial color={accent} emissive={light} emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

function Storefront({ x, accent, name, scale = 1 }) {
  return (
    <group position={[x, 0, 0]} scale={scale}>
      <mesh position={[0, 1.55, -0.1]} castShadow>
        <boxGeometry args={[2.75, 3.05, 0.3]} />
        <meshStandardMaterial color="#f8eee0" roughness={0.32} />
      </mesh>
      <mesh position={[0, 1.48, 0.085]}>
        <boxGeometry args={[2.34, 2.45, 0.08]} />
        <meshStandardMaterial color="#9b7465" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.45, 0.08]}>
        <boxGeometry args={[2.16, 2.19, 0.12]} />
        <meshPhysicalMaterial color="#9cc5c3" roughness={0.12} metalness={0.16} transparent opacity={0.68} />
      </mesh>
      <mesh position={[0, 2.78, 0.12]}>
        <boxGeometry args={[2.5, 0.52, 0.3]} />
        <meshStandardMaterial color={accent} roughness={0.32} />
      </mesh>
      <mesh position={[0, 2.78, 0.29]}>
        <boxGeometry args={[1.8, 0.055, 0.035]} />
        <meshStandardMaterial color="#fff1d2" emissive="#fff1d2" emissiveIntensity={0.36} />
      </mesh>
      {[-1.12, -0.74, -0.36, 0.36, 0.74, 1.12].map((offset) => (
        <mesh key={offset} position={[offset, 1.34, 0.18]}>
          <boxGeometry args={[0.045, 2.34, 0.07]} />
          <meshStandardMaterial color="#fff6e8" metalness={0.32} roughness={0.22} />
        </mesh>
      ))}
      {[-0.55, 0.55].map((x, index) => (
        <group key={x} position={[x, 0.1, 0.43]}>
          <mesh position={[0, 0.88, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.17, 0.16, 18]} />
            <meshStandardMaterial color={index ? '#dba886' : '#9eb6a1'} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.26, 0]} castShadow>
            <capsuleGeometry args={[0.2, 0.42, 5, 12]} />
            <meshStandardMaterial color={index ? '#dba886' : '#9eb6a1'} roughness={0.34} />
          </mesh>
          <mesh position={[0, 1.63, 0]} castShadow>
            <sphereGeometry args={[0.16, 18, 14]} />
            <meshStandardMaterial color="#d6b69b" roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.045, 0.055, 0.74, 10]} />
            <meshStandardMaterial color="#c6a579" metalness={0.42} roughness={0.29} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.96, 0.36, 0.52]} castShadow>
        <boxGeometry args={[0.34, 0.68, 0.34]} />
        <meshStandardMaterial color={accent} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0.55]} receiveShadow>
        <boxGeometry args={[3.5, 0.12, 1.2]} />
        <meshStandardMaterial color="#d8c4a4" roughness={0.48} />
      </mesh>
      {name && <mesh position={[0, 3.1, 0.2]}>
        <boxGeometry args={[2.35, 0.04, 0.035]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.7} />
      </mesh>}
    </group>
  )
}

function RetailEnvironment({ accent, stores = [], single = false }) {
  const entries = single ? [{ color: accent }] : stores.length
    ? stores.slice(0, 3).map((store) => ({ color: store.color || accent }))
    : [{ color: '#e68e79' }, { color: '#9885c7' }, { color: '#7fa899' }]
  return (
    <group>
      <Floor color="#eadfd2" size={22} />
      <mesh position={[0, 2.1, -3.1]}>
        <boxGeometry args={[13, 4.35, 0.45]} />
        <meshStandardMaterial color="#d8ab96" roughness={0.58} />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={`retail-wall-${index}`} position={[-5.7 + index * 1.14, 2.1, -2.84]}>
          <boxGeometry args={[0.045, 4.1, 0.045]} />
          <meshStandardMaterial color="#f7e8d6" metalness={0.18} roughness={0.34} />
        </mesh>
      ))}
      <mesh position={[0, 4.37, -2.83]}>
        <boxGeometry args={[13.3, 0.22, 0.72]} />
        <meshStandardMaterial color="#f1dfca" roughness={0.35} />
      </mesh>
      {entries.map((entry, index) => (
        <FloatingGroup key={index} speed={0.24 + index * 0.08} amplitude={0.035}>
          <Storefront x={(index - (entries.length - 1) / 2) * 4.2} accent={entry.color} scale={entries.length === 1 ? 1.15 : 0.94} />
        </FloatingGroup>
      ))}
      <mesh position={[0, 0.03, 1.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.7, 64]} />
        <meshStandardMaterial color="#f6eee0" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.06, 1.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.45, 4.54, 64]} />
        <meshStandardMaterial color={accent} metalness={0.48} roughness={0.26} />
      </mesh>
      {[-5.9, 5.9].map((x) => (
        <mesh key={x} position={[x, 2.35, -1.5]}>
          <boxGeometry args={[0.18, 4.6, 0.3]} />
          <meshStandardMaterial color="#f7ede0" roughness={0.36} />
        </mesh>
      ))}
    </group>
  )
}

function DiningEnvironment({ accent }) {
  return (
    <group>
      <Floor color="#f0d7c4" size={22} />
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.7, 64]} />
        <meshStandardMaterial color="#eac4a9" roughness={0.72} />
      </mesh>
      <mesh position={[0, 3.05, -2.35]}>
        <boxGeometry args={[11.2, 3.6, 0.38]} />
        <meshStandardMaterial color="#dba88c" roughness={0.55} />
      </mesh>
      <mesh position={[0, 3.1, -2.12]}>
        <boxGeometry args={[8.4, 2.9, 0.06]} />
        <meshPhysicalMaterial color="#89aaa0" roughness={0.13} metalness={0.12} transparent opacity={0.7} />
      </mesh>
      {[-3.9, -2.6, -1.3, 0, 1.3, 2.6, 3.9].map((x) => (
        <mesh key={`dining-window-${x}`} position={[x, 3.1, -2.05]}>
          <boxGeometry args={[0.045, 2.9, 0.07]} />
          <meshStandardMaterial color="#fff2df" metalness={0.26} roughness={0.25} />
        </mesh>
      ))}
      {[-4.8, 4.8].map((x) => (
        <mesh key={`dining-pillar-${x}`} position={[x, 1.8, -1.65]}>
          <cylinderGeometry args={[0.15, 0.21, 3.6, 18]} />
          <meshStandardMaterial color="#f5e8d8" roughness={0.33} />
        </mesh>
      ))}
      <FloatingGroup speed={0.28} amplitude={0.08}>
        <group position={[0, 1.18, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0.05, 0.1, 0]}>
            <cylinderGeometry args={[2.6, 2.45, 0.24, 64]} />
            <meshStandardMaterial color="#a66c50" roughness={0.34} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[2.36, 2.36, 0.09, 64]} />
            <meshStandardMaterial color="#f5ebd9" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.21, 0]}>
            <cylinderGeometry args={[1.02, 1.02, 0.08, 48]} />
            <meshStandardMaterial color="#df9c71" roughness={0.38} />
          </mesh>
          <mesh position={[0.15, 0.39, 0.03]} castShadow>
            <icosahedronGeometry args={[0.34, 2]} />
            <meshStandardMaterial color="#d99455" roughness={0.5} />
          </mesh>
          <mesh position={[-0.32, 0.35, -0.16]} castShadow>
            <sphereGeometry args={[0.25, 22, 18]} />
            <meshStandardMaterial color="#9aaf75" roughness={0.58} />
          </mesh>
          <mesh position={[0.47, 0.34, -0.2]} castShadow>
            <sphereGeometry args={[0.23, 22, 18]} />
            <meshStandardMaterial color="#bc654e" roughness={0.5} />
          </mesh>
          {[-0.42, -0.1, 0.22, 0.5].map((x, index) => (
            <mesh key={`herb-${x}`} position={[x, 0.48, 0.25]} rotation={[0.3, 0, (index - 1.5) * 0.25]} scale={[0.13, 0.045, 0.24]} castShadow>
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial color={index % 2 ? '#759168' : '#94a873'} roughness={0.72} />
            </mesh>
          ))}
          <mesh position={[-1.35, 0.49, 0.12]} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 0.62, 28]} />
            <meshStandardMaterial color="#c2e0dc" roughness={0.16} transparent opacity={0.74} />
          </mesh>
          <mesh position={[-1.35, 0.81, 0.12]}>
            <cylinderGeometry args={[0.2, 0.2, 0.045, 28]} />
            <meshStandardMaterial color="#f1e0c3" roughness={0.28} />
          </mesh>
          <mesh position={[1.4, 0.38, -0.1]}>
            <torusGeometry args={[0.32, 0.075, 12, 32]} />
            <meshStandardMaterial color={accent} metalness={0.45} roughness={0.25} />
          </mesh>
        </group>
      </FloatingGroup>
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 0, -1.3]}>
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.75, 0.86, 0.16, 32]} />
            <meshStandardMaterial color="#f7ead8" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.07, 0.11, 1, 16]} />
            <meshStandardMaterial color="#a67557" roughness={0.36} />
          </mesh>
          <mesh position={[0, 1.54, -0.39]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[1.05, 0.92, 0.12]} />
            <meshStandardMaterial color="#a67557" roughness={0.36} />
          </mesh>
        </group>
      ))}
      {[-2.8, 0, 2.8].map((x, index) => (
        <group key={x} position={[x, 4.4, -1]}>
          <mesh position={[0, -0.48, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.96, 8]} />
            <meshStandardMaterial color="#947656" />
          </mesh>
          <mesh position={[0, -1.05, 0]}>
            <sphereGeometry args={[0.48, 24, 16]} />
            <meshStandardMaterial color={index === 1 ? '#ffd893' : '#f4ad8e'} emissive={index === 1 ? '#ffd893' : '#f4ad8e'} emissiveIntensity={0.18} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function EventEnvironment({ accent }) {
  const rings = useRef(null)
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    if (rings.current) rings.current.rotation.y = reducedMotion ? 0 : clock.getElapsedTime() * 0.12
  })
  return (
    <group>
      <Floor color="#ded9ed" size={23} />
      <mesh position={[0, 0.12, -0.5]}>
        <cylinderGeometry args={[2.45, 2.75, 0.26, 64]} />
        <meshStandardMaterial color="#b4a7d7" roughness={0.3} metalness={0.12} />
      </mesh>
      <group ref={rings} position={[0, 2.6, -0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.065, 16, 96]} />
          <meshStandardMaterial color="#fff4dd" metalness={0.35} roughness={0.2} />
        </mesh>
        <mesh rotation={[0.55, 0.55, 0.18]}>
          <torusGeometry args={[1.72, 0.11, 16, 96]} />
          <meshStandardMaterial color={accent} metalness={0.22} roughness={0.26} />
        </mesh>
        <mesh rotation={[0.9, -0.6, 0.55]}>
          <torusGeometry args={[1.38, 0.075, 16, 96]} />
          <meshStandardMaterial color="#96c9be" metalness={0.24} roughness={0.22} />
        </mesh>
      </group>
      {[
        [-2.4, '#ef947e', 0.45],
        [0, '#d3b16f', 0.58],
        [2.4, '#9c88d0', 0.4],
      ].map(([x, color, size], index) => (
        <FloatingGroup key={x} speed={0.26 + index * 0.12} amplitude={0.18}>
          <mesh position={[x, 2 + index % 2, -0.5]} castShadow>
            <icosahedronGeometry args={[size, 1]} />
            <meshPhysicalMaterial color={color} roughness={0.22} metalness={0.16} clearcoat={0.75} />
          </mesh>
        </FloatingGroup>
      ))}
      {[-3.6, 3.6].map((x, index) => (
        <mesh key={x} position={[x, 1.15, -0.6]}>
          <cylinderGeometry args={[0.08, 0.58, 2.3, 6]} />
          <meshStandardMaterial color={index ? '#e99a83' : '#b9a7dc'} roughness={0.34} />
        </mesh>
      ))}
    </group>
  )
}

function OfferEnvironment({ accent }) {
  return (
    <group>
      <Floor color="#efe2c4" size={24} />
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.2, 64]} />
        <meshStandardMaterial color="#f8edd6" roughness={0.45} />
      </mesh>
      <FloatingGroup speed={0.3} amplitude={0.14}>
        <group position={[0, 1.35, 0]} rotation={[0.05, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.45, 2.05, 2.05]} />
            <meshPhysicalMaterial color="#e88676" roughness={0.24} metalness={0.08} clearcoat={0.5} />
          </mesh>
          <mesh position={[0, 1.08, 0]}>
            <boxGeometry args={[2.62, 0.18, 2.2]} />
            <meshStandardMaterial color="#f2ae8b" roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 1.04]}>
            <boxGeometry args={[0.32, 2.13, 0.07]} />
            <meshStandardMaterial color="#ffe9b7" metalness={0.16} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.12, 0]}>
            <boxGeometry args={[2.5, 0.25, 2.12]} />
            <meshStandardMaterial color="#ffe9b7" metalness={0.12} roughness={0.28} />
          </mesh>
          <mesh position={[0, 1.39, 0]}>
            <torusGeometry args={[0.38, 0.1, 12, 32]} />
            <meshStandardMaterial color="#ffe9b7" metalness={0.25} roughness={0.24} />
          </mesh>
        </group>
      </FloatingGroup>
      <FloatingGroup speed={0.23} amplitude={0.22}>
        <mesh position={[-2.65, 2.25, -0.9]} rotation={[0.2, 0.32, -0.15]} castShadow>
          <boxGeometry args={[1.25, 1.65, 0.72]} />
          <meshStandardMaterial color="#8db7aa" roughness={0.32} />
        </mesh>
        <mesh position={[-2.65, 3.15, -0.52]}>
          <torusGeometry args={[0.27, 0.06, 12, 28, Math.PI]} />
          <meshStandardMaterial color="#d8c29b" metalness={0.35} roughness={0.24} />
        </mesh>
      </FloatingGroup>
      <mesh position={[2.85, 2.1, -1.1]} rotation={[0.2, -0.4, 0.15]} castShadow>
        <dodecahedronGeometry args={[0.78, 1]} />
        <meshPhysicalMaterial color={accent} roughness={0.18} metalness={0.2} clearcoat={0.8} />
      </mesh>
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-4.3 + index * 4.3, 3.8 + (index % 2) * 0.45, -1.9]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#d6a64e" emissive="#d6a64e" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function EntertainmentEnvironment({ accent }) {
  const lights = useRef(null)
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    if (lights.current) lights.current.rotation.z = reducedMotion ? 0 : Math.sin(clock.getElapsedTime() * 0.3) * 0.08
  })
  return (
    <group>
      <Floor color="#cbdcda" size={23} />
      <mesh position={[0, 2.8, -2.5]} castShadow>
        <boxGeometry args={[8.4, 4.5, 0.48]} />
        <meshStandardMaterial color="#294d54" roughness={0.3} metalness={0.22} />
      </mesh>
      <mesh position={[0, 2.85, -2.23]}>
        <boxGeometry args={[7.65, 3.72, 0.06]} />
        <meshStandardMaterial color="#574b88" emissive="#7462b7" emissiveIntensity={0.42} roughness={0.22} />
      </mesh>
      <mesh position={[0, 4.98, -2.2]}>
        <boxGeometry args={[8.3, 0.12, 0.45]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} />
      </mesh>
      <group ref={lights}>
        {[-3.2, -1.1, 1.1, 3.2].map((x, index) => (
          <mesh key={x} position={[x, 4.1, 0.25]} rotation={[0.35, 0, (index - 1.5) * 0.1]}>
            <coneGeometry args={[0.67, 3.4, 24, 1, true]} />
            <meshBasicMaterial color={index % 2 ? '#e890bd' : '#a98be0'} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {[-3, -1.5, 0, 1.5, 3].map((x, index) => (
        <group key={x} position={[x, 0, 1.25 + (index % 2) * 0.24]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[1.18, 0.75, 0.85]} />
            <meshStandardMaterial color={index % 2 ? '#6d578f' : '#3a6970'} roughness={0.38} />
          </mesh>
          <mesh position={[0, 1.04, -0.3]}>
            <boxGeometry args={[0.78, 0.12, 0.045]} />
            <meshStandardMaterial color={index % 2 ? '#f5adca' : '#b3e2d4'} emissive={index % 2 ? '#f5adca' : '#b3e2d4'} emissiveIntensity={0.25} />
          </mesh>
        </group>
      ))}
      <FloatingGroup speed={0.2} amplitude={0.12}>
        <mesh position={[3.65, 2.55, -1]}>
          <torusGeometry args={[0.72, 0.11, 16, 48]} />
          <meshStandardMaterial color="#a38bdd" metalness={0.3} roughness={0.22} emissive="#8065be" emissiveIntensity={0.16} />
        </mesh>
      </FloatingGroup>
    </group>
  )
}

function PlayEnvironment({ accent }) {
  const wheel = useRef(null)
  const reducedMotion = useReducedMotion()
  useFrame(({ clock }) => {
    if (wheel.current) wheel.current.rotation.z = reducedMotion ? 0 : Math.sin(clock.getElapsedTime() * 0.18) * 0.12
  })
  return (
    <group>
      <Floor color="#eadff0" size={22} />
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[3.2, 3.35, 0.24, 56]} />
        <meshStandardMaterial color="#f4e8d8" roughness={0.45} />
      </mesh>
      <group ref={wheel} position={[0, 2.45, -1.5]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.8, 0.12, 16, 56]} />
          <meshStandardMaterial color={accent} metalness={0.24} roughness={0.25} />
        </mesh>
        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index / 6) * Math.PI * 2
          return (
            <group key={index} position={[Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0]}>
              <mesh>
                <sphereGeometry args={[0.38, 22, 18]} />
                <meshPhysicalMaterial color={['#f5bf85', '#91bfb5', '#ae9bd9'][index % 3]} roughness={0.2} clearcoat={0.75} />
              </mesh>
              <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.7, 8]} />
                <meshStandardMaterial color="#e7d5b9" />
              </mesh>
            </group>
          )
        })}
      </group>
      {[-2.2, -0.8, 0.9, 2.4].map((x, index) => (
        <FloatingGroup key={x} speed={0.28 + index * 0.06} amplitude={0.12}>
          <mesh position={[x, 0.86 + (index % 2) * 0.2, 1.15]} rotation={[0.1, x * 0.06, 0.08]}>
            <boxGeometry args={[0.9, 1.5 + (index % 2) * 0.32, 0.72]} />
            <meshStandardMaterial color={['#e78a9e', '#97c6b7', '#ad98d0', '#edbf7e'][index]} roughness={0.32} />
          </mesh>
        </FloatingGroup>
      ))}
    </group>
  )
}

function CategoryEnvironment({ category, accent }) {
  const object = useMemo(() => {
    switch (category) {
      case 'Dining':
        return <mesh position={[0, 1.2, 0]}><torusGeometry args={[1.2, 0.36, 24, 64]} /><meshStandardMaterial color="#dc8b67" roughness={0.35} /></mesh>
      case 'Entertainment':
        return <mesh position={[0, 1.55, 0]}><dodecahedronGeometry args={[1.25, 1]} /><meshPhysicalMaterial color="#8c75c6" roughness={0.19} metalness={0.16} clearcoat={0.8} /></mesh>
      case 'Jewellery':
        return <group position={[0, 1.55, 0]}><mesh><torusGeometry args={[0.95, 0.11, 18, 56]} /><meshStandardMaterial color="#d5b46e" metalness={0.75} roughness={0.2} /></mesh><mesh position={[0, 0.8, 0]}><octahedronGeometry args={[0.36, 1]} /><meshPhysicalMaterial color="#d6c3ef" roughness={0.08} transmission={0.2} clearcoat={1} /></mesh></group>
      case 'Electronics':
        return <group position={[0, 1.5, 0]}><mesh rotation={[0.18, -0.2, 0.08]}><boxGeometry args={[1.5, 2.25, 0.16]} /><meshPhysicalMaterial color="#a8d5f2" metalness={0.32} roughness={0.12} clearcoat={0.9} /></mesh><mesh position={[0, -0.8, 0.12]}><boxGeometry args={[0.68, 0.035, 0.025]} /><meshStandardMaterial color="#fff" /></mesh></group>
      case 'Beauty':
        return <group position={[0, 1.2, 0]}><mesh><cylinderGeometry args={[0.43, 0.58, 1.55, 32]} /><meshPhysicalMaterial color="#e7a5a2" roughness={0.23} clearcoat={0.8} /></mesh><mesh position={[0, 0.92, 0]}><cylinderGeometry args={[0.23, 0.23, 0.42, 24]} /><meshStandardMaterial color="#d3b16f" metalness={0.75} roughness={0.22} /></mesh></group>
      case 'Lifestyle':
        return <group position={[0, 1.35, 0]}><mesh position={[-0.38, 0, 0]}><boxGeometry args={[0.68, 1.8, 0.38]} /><meshStandardMaterial color="#b8dccb" roughness={0.3} /></mesh><mesh position={[0.38, 0.22, -0.04]}><boxGeometry args={[0.68, 1.35, 0.38]} /><meshStandardMaterial color="#f3c7ad" roughness={0.34} /></mesh></group>
      default:
        return <group position={[0, 1.3, 0]}><mesh><torusGeometry args={[0.72, 0.13, 18, 56]} /><meshPhysicalMaterial color={accent} metalness={0.18} roughness={0.24} clearcoat={0.8} /></mesh><mesh position={[0, -0.8, 0]}><boxGeometry args={[2.2, 0.16, 1.4]} /><meshStandardMaterial color="#dccdb8" roughness={0.38} /></mesh></group>
    }
  }, [accent, category])
  return (
    <group>
      <Floor color="#eee5d9" size={20} />
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.1, 56]} />
        <meshStandardMaterial color="#e2d1bd" roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.9, 56]} />
        <meshStandardMaterial color={accent} metalness={0.42} roughness={0.26} />
      </mesh>
      <FloatingGroup speed={0.27} amplitude={0.12}>{object}</FloatingGroup>
      {[-2.8, 2.8].map((x, index) => (
        <mesh key={x} position={[x, 1.35, -0.7]}>
          <cylinderGeometry args={[0.045, 0.045, 2.7, 8]} />
          <meshStandardMaterial color={index ? '#e1c4ab' : '#b8cdbb'} />
        </mesh>
      ))}
    </group>
  )
}

function StageScene({ variant, category, stores, accent, light }) {
  switch (variant) {
    case 'mall':
      return <MallEnvironment accent={accent} light={light} />
    case 'visit':
      return <MallEnvironment accent={accent} light={light} visit />
    case 'stores':
      return <RetailEnvironment accent={accent} stores={stores} />
    case 'storefront':
      return <RetailEnvironment accent={accent} single />
    case 'dining':
      return <DiningEnvironment accent={accent} />
    case 'events':
      return <EventEnvironment accent={accent} />
    case 'offers':
      return <OfferEnvironment accent={accent} />
    case 'entertainment':
      return <EntertainmentEnvironment accent={accent} />
    case 'play':
      return <PlayEnvironment accent={accent} />
    default:
      return <CategoryEnvironment category={category} accent={accent} />
  }
}

export default function VisualStage({
  variant = 'category',
  category,
  stores = [],
  accent,
  className = '',
  label = 'Animated three-dimensional mall experience',
}) {
  const host = useRef(null)
  const [visible, setVisible] = useState(false)
  const palette = palettes[variant] || palettes.category
  const sceneAccent = accent || palette.accent
  const sceneLight = palette.light

  useEffect(() => {
    const element = host.current
    if (!element) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '180px 0px' })
    observer.observe(element)
    const bounds = element.getBoundingClientRect()
    setVisible(bounds.bottom > -180 && bounds.top < window.innerHeight + 180)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={host}
      className={`visual-stage visual-stage-${variant} ${className}`}
      style={{ '--scene-background': palette.background, '--scene-accent': sceneAccent }}
      role="img"
      aria-label={label}
    >
      {visible && (
        <Canvas
          aria-hidden="true"
          dpr={[1, 1.4]}
          camera={{ position: variant === 'mall' || variant === 'visit' ? [11, 7.3, 14] : [6.5, 4.5, 8], fov: variant === 'mall' || variant === 'visit' ? 42 : 38, near: 0.1, far: 100 }}
          shadows
          gl={{ alpha: false, antialias: true, powerPreference: 'low-power' }}
          onCreated={({ gl, camera }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 0.94
            camera.lookAt(0, variant === 'mall' || variant === 'visit' ? 2 : 1.35, -0.5)
          }}
          fallback={<div className="visual-stage-fallback" />}
        >
          <color attach="background" args={[palette.background]} />
          <fog attach="fog" args={[palette.background, 15, 34]} />
          <ambientLight intensity={0.5} color="#fff8e9" />
          <hemisphereLight args={['#fff8ea', '#887660', 0.48]} />
          <directionalLight position={[7, 11, 8]} intensity={1.72} color="#fff0d6" castShadow shadow-mapSize={[768, 768]} />
          <pointLight position={[-4, 5, 1]} intensity={0.8} color={sceneLight} />
          <pointLight position={[5, 3, -3]} intensity={0.48} color={sceneAccent} />
          <Suspense fallback={null}>
            <StageScene variant={variant} category={category} stores={stores} accent={sceneAccent} light={sceneLight} />
            <AdaptiveDpr pixelated />
          </Suspense>
        </Canvas>
      )}
      {!visible && <div className="visual-stage-fallback" aria-hidden="true" />}
      <span className="visual-stage-grain" aria-hidden="true" />
    </div>
  )
}
