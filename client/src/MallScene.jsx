import { Component, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, Environment, Html, Text, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { demoStores } from './data'

const GOLD = '#c8a96a'
const FLOOR_HEIGHT = 4.25

function getStorePlacement(store, index) {
  const configuredX = Number(store.coordinates?.x)
  const configuredY = Number(store.coordinates?.y)
  const configuredZ = Number(store.coordinates?.z)
  const side = Number.isFinite(configuredX) && configuredX !== 0
    ? Math.sign(configuredX)
    : index % 2 === 1 ? -1 : 1
  return {
    side,
    x: Number.isFinite(configuredX) ? configuredX : side * 4.7,
    y: Number.isFinite(configuredY) ? configuredY : Number(store.floor ?? 0) * FLOOR_HEIGHT,
    z: Number.isFinite(configuredZ) ? configuredZ : -8 + (index % 3) * 5,
  }
}

class StoreAssetBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('The uploaded store model could not be rendered.', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function UploadedStoreModel({ url, side, scale = 1, rotation = 0 }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => scene.clone(true), [scene])
  return <primitive object={model} position={[-side * 0.22, 0.05, 0]} rotation={[0, rotation, 0]} scale={scale} />
}

function Storefront({ store, index, selected, onSelect }) {
  const { side, x, y: floorY, z } = getStorePlacement(store, index)
  const color = store.color || '#9b8268'
  return (
    <group
      position={[x, floorY, z]}
      onPointerOver={(event) => { event.stopPropagation(); event.nativeEvent.target.style.cursor = 'pointer' }}
      onPointerOut={(event) => { event.stopPropagation(); event.nativeEvent.target.style.cursor = 'grab' }}
      onClick={(event) => { event.stopPropagation(); onSelect(store) }}
    >
      <mesh position={[0, 1.65, 0]}>
        <boxGeometry args={[0.18, 3.3, 5.1]} />
        <meshStandardMaterial color="#eee8dd" roughness={0.75} />
      </mesh>
      <mesh position={[-side * 0.13, 1.45, 0]}>
        <boxGeometry args={[0.06, 2.45, 3.4]} />
        <meshPhysicalMaterial color={color} roughness={0.2} metalness={0.08} transparent opacity={0.42} />
      </mesh>
      <mesh position={[side * 0.68, 0.31, -0.75]} receiveShadow>
        <boxGeometry args={[0.65, 0.62, 0.76]} />
        <meshStandardMaterial color="#d5c7ac" roughness={0.48} />
      </mesh>
      <mesh position={[side * 0.68, 0.93, -0.75]} castShadow>
        <cylinderGeometry args={[0.23, 0.2, 0.62, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[side * 0.68, 1.38, -0.75]} castShadow>
        <sphereGeometry args={[0.2, 18, 12]} />
        <meshStandardMaterial color="#e9e1d3" roughness={0.42} />
      </mesh>
      <mesh position={[side * 0.68, 0.23, 0.9]} receiveShadow>
        <boxGeometry args={[0.58, 0.46, 0.64]} />
        <meshStandardMaterial color="#b6a58b" roughness={0.5} />
      </mesh>
      <mesh position={[-side * 0.17, 0.35, 0]}>
        <boxGeometry args={[0.09, 0.16, 3.7]} />
        <meshStandardMaterial color={GOLD} metalness={0.66} roughness={0.28} emissive={selected ? GOLD : '#000000'} emissiveIntensity={selected ? 0.32 : 0} />
      </mesh>
      <mesh position={[-side * 0.2, 2.95, 0]}>
        <boxGeometry args={[0.18, 0.66, 3.35]} />
        <meshStandardMaterial color={selected ? '#d6bd89' : '#f8f6f0'} roughness={0.38} />
      </mesh>
      <Text
        position={[-side * 0.32, 2.96, 0]}
        rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
        fontSize={0.24}
        maxWidth={2.8}
        color="#302d26"
        anchorX="center"
        anchorY="middle"
      >
        {store.name}
      </Text>
      <mesh position={[-side * 0.24, 1.46, 1.12]}>
        <boxGeometry args={[0.04, 2.25, 0.05]} />
        <meshStandardMaterial color="#d5c7aa" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-side * 0.24, 1.46, -1.12]}>
        <boxGeometry args={[0.04, 2.25, 0.05]} />
        <meshStandardMaterial color="#d5c7aa" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-side * 0.29, 3.36, 0]}>
        <boxGeometry args={[0.06, 0.035, 3.9]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.6} />
      </mesh>
      {store.storefront?.modelUrl && <StoreAssetBoundary fallback={<Html position={[-side * 0.4, 0.15, 0]} center><span className="scene-model-error">Store model unavailable</span></Html>}>
        <Suspense fallback={null}>
          <UploadedStoreModel
            url={store.storefront.modelUrl}
            side={side}
            scale={store.storefront.modelScale || 1}
            rotation={store.storefront.modelRotation || 0}
          />
        </Suspense>
      </StoreAssetBoundary>}
    </group>
  )
}

function AtriumPillars({ floorNumbers, pillars }) {
  const mesh = useRef(null)
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.19, 0.24, 3.8, 12), [])
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e5dfd5', roughness: 0.28 }), [])
  const count = floorNumbers.length * pillars.length * 2
  useLayoutEffect(() => {
    if (!mesh.current) return
    const matrix = new THREE.Matrix4()
    let instance = 0
    floorNumbers.forEach((floor) => {
      pillars.forEach((z) => [-7.3, 7.3].forEach((x) => {
        matrix.makeTranslation(x, floor * FLOOR_HEIGHT + 1.9, z)
        mesh.current.setMatrixAt(instance, matrix)
        instance += 1
      }))
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [floorNumbers, pillars])

  return <instancedMesh ref={mesh} args={[geometry, material, count]} castShadow receiveShadow />
}

function MallArchitecture({ stores, floors, selected, onSelect }) {
  const pillars = useMemo(() => Array.from({ length: 10 }, (_, index) => -15 + index * 3.3), [])
  const floorNumbers = useMemo(() => {
    const configured = floors.map((floor, index) => Number(floor.number ?? index))
    return [...new Set(configured.length ? configured : [0, 1, 2])].sort((a, b) => a - b)
  }, [floors])
  return (
    <group>
      {floorNumbers.map((floor) => {
        const y = floor * FLOOR_HEIGHT
        return (
          <group key={floor} position={[0, y, 0]}>
            <mesh position={[-4.8, -0.15, -3]} receiveShadow>
              <boxGeometry args={[5.9, 0.3, 34]} />
              <meshStandardMaterial color={floor === 0 ? '#e5dfd4' : '#eee9df'} roughness={0.42} />
            </mesh>
            <mesh position={[4.8, -0.15, -3]} receiveShadow>
              <boxGeometry args={[5.9, 0.3, 34]} />
              <meshStandardMaterial color={floor === 0 ? '#e5dfd4' : '#eee9df'} roughness={0.42} />
            </mesh>
            <mesh position={[0, 0.05, -3]} receiveShadow>
              <boxGeometry args={[3.5, 0.1, 34]} />
              <meshStandardMaterial color="#d8ccb6" roughness={0.34} />
            </mesh>
            {Array.from({ length: 17 }, (_, index) => (
              <mesh key={`tile-${floor}-${index}`} position={[0, 0.105, -19 + index * 2]} receiveShadow>
                <boxGeometry args={[3.48, 0.012, 0.018]} />
                <meshStandardMaterial color="#c2b28f" roughness={0.5} />
              </mesh>
            ))}
            {[-1.58, 1.58].map((x) => (
              <mesh key={`inlay-${floor}-${x}`} position={[x, 0.108, -3]}>
                <boxGeometry args={[0.018, 0.014, 33.8]} />
                <meshStandardMaterial color={GOLD} metalness={0.35} roughness={0.38} />
              </mesh>
            ))}
            {floor > 0 && (
              <>
                {[-1, 1].map((side) => (
                  <group key={side}>
                    <mesh position={[side * 2.45, 0.78, -2]} rotation={[0, 0, side * -0.16]}>
                      <boxGeometry args={[0.08, 1.5, 33]} />
                      <meshPhysicalMaterial color="#dfe5e2" roughness={0.1} metalness={0.05} transparent opacity={0.47} />
                    </mesh>
                    <mesh position={[side * 2.45, 1.56, -2]}>
                      <boxGeometry args={[0.12, 0.07, 33]} />
                      <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.22} />
                    </mesh>
                  </group>
                ))}
              </>
            )}
          </group>
        )
      })}
      <AtriumPillars floorNumbers={floorNumbers} pillars={pillars} />
      <mesh position={[0, 7.1, -3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4.4, 4.4, 0.12, 48]} />
        <meshStandardMaterial color="#f4f0e8" emissive="#d4bd90" emissiveIntensity={0.08} roughness={0.32} />
      </mesh>
      {pillars.map((z) => (
        <group key={`light-${z}`} position={[0, 7.7, z]}>
          <mesh>
            <boxGeometry args={[1.1, 0.06, 2.15]} />
            <meshStandardMaterial color="#fff9e9" emissive="#f2d89d" emissiveIntensity={0.55} />
          </mesh>
          <pointLight intensity={0.45} distance={8} color="#ffe9bd" />
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={`escalator-${side}`} position={[side * 3.1, FLOOR_HEIGHT * 0.48, -2.4]} rotation={[0, 0, side * -0.47]} scale={0.78}>
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[1.22, 4.9, 0.28]} />
            <meshStandardMaterial color="#746f65" metalness={0.45} roughness={0.34} />
          </mesh>
          {Array.from({ length: 16 }, (_, step) => (
            <mesh key={`step-${step}`} position={[0, -2.18 + step * 0.29, 0.16]} castShadow>
              <boxGeometry args={[1.08, 0.11, 0.44]} />
              <meshStandardMaterial color={step % 2 ? '#aaa59b' : '#c7c3ba'} metalness={0.55} roughness={0.3} />
            </mesh>
          ))}
          {[-0.66, 0.66].map((x) => (
            <mesh key={`rail-${x}`} position={[x, 0, 0.25]}>
              <boxGeometry args={[0.055, 4.95, 0.07]} />
              <meshStandardMaterial color={GOLD} metalness={0.72} roughness={0.24} />
            </mesh>
          ))}
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={`plant-${side}`} position={[side * 2.05, 0, -5]}>
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.6, 0.52, 0.5, 24]} />
            <meshStandardMaterial color="#c7b9a2" roughness={0.8} />
          </mesh>
          {[0, 1, 2, 3, 4].map((leaf) => (
            <mesh key={leaf} position={[Math.cos(leaf) * 0.2, 0.95 + (leaf % 2) * 0.18, Math.sin(leaf) * 0.2]} rotation={[0.15, leaf, -0.24]} scale={[0.68, 1.55, 0.68]}>
              <sphereGeometry args={[0.27, 12, 8]} />
              <meshStandardMaterial color="#839176" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
      <Text position={[0, 3.65, -12]} fontSize={0.47} color="#76684e" anchorX="center" anchorY="middle">
        ORION  ·  A PLACE TO GATHER
      </Text>
      {stores.map((store, index) => (
        <Storefront
          key={store._id || store.name}
          store={store}
          index={index}
          selected={selected?._id === store._id}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}

function MallCamera({ floor = 0, stores, selectedStore, focusKey }) {
  const { camera, gl } = useThree()
  const target = useRef({ x: 0, y: 1.65, z: 8, yaw: 0 })
  const dragging = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => { reducedMotion.current = preference.matches }
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const canvas = gl.domElement
    const dragStart = (event) => {
      if (event.button !== 0) return
      dragging.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
      canvas.setPointerCapture(event.pointerId)
    }
    const dragMove = (event) => {
      if (dragging.current?.pointerId !== event.pointerId) return
      const deltaX = event.clientX - dragging.current.x
      const deltaY = event.clientY - dragging.current.y
      dragging.current.x = event.clientX
      dragging.current.y = event.clientY
      camera.rotation.set(
        THREE.MathUtils.clamp(camera.rotation.x - deltaY * 0.003, -0.65, 0.65),
        camera.rotation.y - deltaX * 0.004,
        camera.rotation.z,
        'YXZ',
      )
      target.current.yaw = camera.rotation.y
    }
    const dragEnd = (event) => {
      if (dragging.current?.pointerId !== event.pointerId) return
      dragging.current = null
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
    }
    const releaseDrag = () => {
      if (!dragging.current) return
      if (canvas.hasPointerCapture(dragging.current.pointerId)) canvas.releasePointerCapture(dragging.current.pointerId)
      dragging.current = null
    }
    canvas.addEventListener('pointerdown', dragStart)
    canvas.addEventListener('pointermove', dragMove)
    canvas.addEventListener('pointerup', dragEnd)
    canvas.addEventListener('pointercancel', dragEnd)
    window.addEventListener('blur', releaseDrag)
    document.addEventListener('visibilitychange', releaseDrag)
    return () => {
      canvas.removeEventListener('pointerdown', dragStart)
      canvas.removeEventListener('pointermove', dragMove)
      canvas.removeEventListener('pointerup', dragEnd)
      canvas.removeEventListener('pointercancel', dragEnd)
      window.removeEventListener('blur', releaseDrag)
      document.removeEventListener('visibilitychange', releaseDrag)
      if (dragging.current && canvas.hasPointerCapture(dragging.current.pointerId)) {
        canvas.releasePointerCapture(dragging.current.pointerId)
      }
    }
  }, [camera, gl])

  useEffect(() => {
    const selectedIndex = selectedStore ? stores.findIndex((store) => store._id === selectedStore._id) : -1
    const placement = selectedIndex >= 0 ? getStorePlacement(stores[selectedIndex], selectedIndex) : null
    target.current.x = placement ? placement.x - placement.side * 1.6 : 0
    target.current.y = placement ? placement.y + 1.65 : Number(floor) * FLOOR_HEIGHT + 1.65
    target.current.z = placement ? placement.z + 4.2 : 8
    target.current.yaw = placement ? -Math.atan2(placement.side * 1.6, 4.2) : 0
  }, [floor, selectedStore, stores, focusKey])

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05)
    if (reducedMotion.current) {
      camera.position.set(target.current.x, target.current.y, target.current.z)
      camera.rotation.set(0, target.current.yaw, 0, 'YXZ')
      return
    }
    camera.position.set(
      THREE.MathUtils.damp(camera.position.x, target.current.x, 2.6, step),
      THREE.MathUtils.damp(camera.position.y, target.current.y, 2.6, step),
      THREE.MathUtils.damp(camera.position.z, target.current.z, 2.6, step),
    )
    camera.rotation.set(
      THREE.MathUtils.damp(camera.rotation.x, 0, 2, step),
      THREE.MathUtils.damp(camera.rotation.y, target.current.yaw, 2, step),
      camera.rotation.z,
      'YXZ',
    )
  })

  return null
}

export default function MallScene({ stores = demoStores, floors = [], floor = 0, selectedStore, onSelectStore = () => {}, focusKey = 0 }) {
  return (
    <Canvas
      className="mall-canvas"
      role="img"
      aria-label="Interactive three-dimensional preview of a multi-level mall atrium"
      fallback={<div className="scene-fallback">This device can't display the 3D preview. Use the store directory below to explore the sample listings.</div>}
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.65, 8], fov: 51, near: 0.1, far: 70 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 0.9 }}
    >
      <color attach="background" args={['#eeeae1']} />
      <fog attach="fog" args={['#eeeae1', 18, 39]} />
      <ambientLight intensity={0.48} color="#fff9ef" />
      <hemisphereLight args={['#fff9ee', '#b9aa91', 0.55]} />
      <directionalLight position={[6, 12, 7]} intensity={0.9} castShadow shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}>
        <MallArchitecture stores={stores} floors={floors} selected={selectedStore} onSelect={onSelectStore} />
      </Suspense>
      <MallCamera floor={floor} stores={stores} selectedStore={selectedStore} focusKey={focusKey} />
      <Environment preset="apartment" environmentIntensity={0.25} />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
