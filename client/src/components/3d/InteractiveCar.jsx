import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, RoundedBox } from '@react-three/drei'
import { MathUtils } from 'three'
import { useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp } from 'lucide-react'

const wheels = [
  [-1, 0.36, 0.98],
  [1, 0.36, 0.98],
  [-1, 0.36, -0.98],
  [1, 0.36, -0.98],
]

function CarModel({ raised, reducedMotion, onToggle }) {
  const car = useRef(null)
  const wheelRefs = useRef([])
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    invalidate()
  }, [invalidate, raised])

  useFrame((_, delta) => {
    if (!car.current) return
    const target = raised ? 0.72 : 0
    if (reducedMotion) {
      car.current.position.y = target
      return
    }

    car.current.position.y = MathUtils.damp(car.current.position.y, target, 5, delta)
    if (Math.abs(car.current.position.y - target) > 0.002) {
      wheelRefs.current.forEach((wheel) => {
        if (wheel) wheel.rotation.x += delta * 1.6
      })
      invalidate()
    } else {
      car.current.position.y = target
    }
  })

  return (
    <group
      ref={car}
      position={[0, 0, 0]}
      onClick={(event) => {
        event.stopPropagation()
        onToggle()
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}
    >
      <RoundedBox args={[2.05, 0.52, 3.5]} radius={0.24} smoothness={5} position={[0, 0.58, 0]}>
        <meshPhysicalMaterial color="#c7533e" roughness={0.23} metalness={0.3} clearcoat={0.85} clearcoatRoughness={0.16} />
      </RoundedBox>
      <RoundedBox args={[1.58, 0.74, 1.72]} radius={0.26} smoothness={5} position={[0, 1.12, -0.18]}>
        <meshPhysicalMaterial color="#a94035" roughness={0.25} metalness={0.28} clearcoat={0.8} />
      </RoundedBox>
      <RoundedBox args={[1.4, 0.45, 0.08]} radius={0.08} smoothness={4} position={[0, 1.18, 0.56]} rotation={[-0.42, 0, 0]}>
        <meshPhysicalMaterial color="#8fb5bd" roughness={0.12} metalness={0.18} transmission={0.18} />
      </RoundedBox>
      <RoundedBox args={[1.35, 0.42, 0.08]} radius={0.08} smoothness={4} position={[0, 1.18, -0.91]} rotation={[0.46, 0, 0]}>
        <meshPhysicalMaterial color="#8fb5bd" roughness={0.12} metalness={0.18} transmission={0.18} />
      </RoundedBox>
      {[-1, 1].map((side) => (
        <group key={side}>
          <RoundedBox args={[0.075, 0.42, 1.18]} radius={0.04} smoothness={3} position={[side * 0.79, 1.16, -0.17]}>
            <meshPhysicalMaterial color="#8fb5bd" roughness={0.14} metalness={0.14} transparent opacity={0.92} />
          </RoundedBox>
          <RoundedBox args={[0.18, 0.1, 0.2]} radius={0.04} smoothness={3} position={[side * 1.08, 0.96, 0.93]}>
            <meshStandardMaterial color="#a94035" roughness={0.28} metalness={0.18} />
          </RoundedBox>
        </group>
      ))}
      <RoundedBox args={[0.42, 0.16, 0.08]} radius={0.06} smoothness={4} position={[-0.65, 0.7, 1.79]}>
        <meshStandardMaterial color="#fff4d7" emissive="#ffc96b" emissiveIntensity={0.35} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.16, 0.08]} radius={0.06} smoothness={4} position={[0.65, 0.7, 1.79]}>
        <meshStandardMaterial color="#fff4d7" emissive="#ffc96b" emissiveIntensity={0.35} />
      </RoundedBox>
      {wheels.map((position, index) => (
        <group key={position.join('-')} ref={(element) => { wheelRefs.current[index] = element }} position={position}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.25, 32]} />
            <meshStandardMaterial color="#20252a" roughness={0.78} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.27, 24]} />
            <meshStandardMaterial color="#c6c5bd" roughness={0.25} metalness={0.78} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function InteractiveCar() {
  const section = useRef(null)
  const [visible, setVisible] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  const [raised, setRaised] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = section.current
    if (!element || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '180px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const toggleCar = () => setRaised((value) => !value)

  return (
    <section className="home-car-section" ref={section} aria-labelledby="car-experience-title">
      <div className="home-car-copy">
        <p className="eyebrow">A LITTLE ORION MOMENT</p>
        <h2 id="car-experience-title">Tap to lift<br /><em>your arrival.</em></h2>
        <p>A crafted 3D ride, right here in the experience. Tap the car or the control and watch it rise, then settle back in.</p>
        <button className="car-toggle" type="button" onClick={toggleCar} aria-pressed={raised}>
          {raised ? 'Bring it back down' : 'Lift the car'}
          {raised ? <ArrowDown size={17} /> : <ArrowUp size={17} />}
        </button>
      </div>
      <div className={`home-car-stage ${raised ? 'is-raised' : ''}`}>
        <div className="car-stage-glow" aria-hidden="true" />
        {visible ? (
          <Canvas
            aria-hidden="true"
            camera={{ position: [4.4, 3, 5.2], fov: 34 }}
            dpr={[1, 1.4]}
            frameloop="demand"
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            fallback={<div className="car-canvas-fallback">Interactive 3D preview is not available on this device.</div>}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[4, 6, 5]} intensity={3} castShadow />
            <pointLight position={[-4, 2, -2]} intensity={35} color="#f0aa67" />
            <CarModel raised={raised} reducedMotion={Boolean(prefersReducedMotion)} onToggle={toggleCar} />
            <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={7} blur={2.2} far={3} />
            <Environment preset="studio" />
          </Canvas>
        ) : (
          <div className="car-preview-placeholder" aria-hidden="true" />
        )}
        <span className="car-stage-caption">ORION / MOTION STUDY</span>
      </div>
    </section>
  )
}
