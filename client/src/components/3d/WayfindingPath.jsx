import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const GOLD_GLOW = '#ffd885'

export default function WayfindingPath({
  targetStore,
  currentPos = [0, 1.7, -11],
  floorY = 0,
}) {
  const groupRef = useRef()

  // Generate waypoint nodes along the corridor from current position to store entrance
  const waypoints = useMemo(() => {
    if (!targetStore) return []
    const targetX = targetStore.position.x
    const targetZ = targetStore.position.z

    const startX = currentPos[0] || 0
    const startZ = currentPos[2] || -11

    const points = []
    const steps = 14

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      // Interpolate along Z in corridor, then curve into store entrance on X
      const z = THREE.MathUtils.lerp(startZ, targetZ, t)
      let x = startX
      if (t > 0.75) {
        const blend = (t - 0.75) / 0.25
        x = THREE.MathUtils.lerp(startX, targetX > 0 ? targetX - 1.2 : targetX + 1.2, blend)
      }
      points.push({ x, z, index: i })
    }
    return points
  }, [targetStore, currentPos])

  // Animated pulse wave flowing along the path
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const time = clock.getElapsedTime() * 4
    groupRef.current.children.forEach((child, i) => {
      const wave = Math.sin(time - i * 0.4)
      child.material.opacity = THREE.MathUtils.clamp((wave + 1) * 0.45 + 0.2, 0.15, 0.95)
    })
  })

  if (!targetStore || waypoints.length === 0) return null

  return (
    <group ref={groupRef} position={[0, floorY + 0.015, 0]}>
      {waypoints.map((pt, idx) => (
        <mesh
          key={idx}
          position={[pt.x, 0, pt.z]}
          rotation={[-Math.PI / 2, 0, pt.x < 0 && idx > 10 ? Math.PI / 2 : pt.x > 0 && idx > 10 ? -Math.PI / 2 : 0]}
        >
          {/* Luminous Chevron / Direction Arrow */}
          <planeGeometry args={[0.42, 0.24]} />
          <meshBasicMaterial
            color={GOLD_GLOW}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

