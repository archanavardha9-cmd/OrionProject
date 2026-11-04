import { Component, useEffect, useMemo, useRef } from 'react'
import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  AdaptiveDpr,
  Environment,
  Html,
  Text,
  useGLTF,
} from '@react-three/drei'
import * as THREE from 'three'

const FLOOR_HEIGHT = 4.25
const GOLD = '#c8a96a'
const WALL = '#e7e0d4'
const GLASS = '#dfe5e2'

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

function UploadedStoreModel({ url, scale = 1, rotation = 0 }) {
  const { scene } = useGLTF(url)
  const model = useMemo(() => scene.clone(true), [scene])
  return (
    <primitive object={model} position={[0, 0.05, 0]} rotation={[0, rotation, 0]} scale={scale} />
  )
}

function SignagePlate({ name, accent, selected, side }) {
  return (
    <group position={[0, 3.05, -0.12]}>
      <mesh>
        <boxGeometry args={[3.4, 0.42, 0.06]} />
        <meshStandardMaterial
          color={selected ? GOLD : '#302d26'}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0, 0.03]}
        rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}
        fontSize={0.17}
        maxWidth={3.2}
        color="#fffefa"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      {selected && (
        <mesh>
          <boxGeometry args={[3.6, 0.045, 0.07]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  )
}

function Storefront({ store, index, side, selected, onSelect }) {
  const { x, y: floorY, z } = store.position
  const accent = store.color || '#9b8268'
  const isFacility = ['Facilities', 'Customer Service', 'Parking', 'Services'].includes(
    store.category
  )
  return (
    <group
      position={[x, floorY, z]}
      onPointerOver={(event) => {
        event.stopPropagation()
        event.nativeEvent.target.style.cursor = 'pointer'
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        event.nativeEvent.target.style.cursor = 'grab'
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(store)
      }}
    >
      {/* rear wall */}
      <mesh position={[0, 1.55, 0.95]} receiveShadow>
        <boxGeometry args={[isFacility ? 3.0 : 4.2, 3.1, 0.18]} />
        <meshStandardMaterial color={WALL} roughness={0.55} />
      </mesh>
      {/* glass storefront */}
      <mesh position={[0, 1.5, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[isFacility ? 2.6 : 3.6, 2.35, 0.08]} />
        <meshPhysicalMaterial
          color={GLASS}
          roughness={0.12}
          metalness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* mullions */}
      {[-0.9, 0, 0.9].map((m) => (
        <mesh key={m} position={[m, 1.5, -0.02]}>
          <boxGeometry args={[0.05, 2.25, 0.05]} />
          <meshStandardMaterial color="#c7bca8" metalness={0.3} roughness={0.28} />
        </mesh>
      ))}
      {/* horizontal rail */}
      <mesh position={[0, 0.6, -0.02]}>
        <boxGeometry args={[isFacility ? 2.6 : 3.6, 0.07, 0.05]} />
        <meshStandardMaterial color="#b5a68f" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* display window */}
      <mesh position={[0, 0.95, -0.01]} receiveShadow>
        <boxGeometry args={[isFacility ? 2.2 : 3.2, 0.95, 0.06]} />
        <meshStandardMaterial color="#d8ccb6" roughness={0.45} />
      </mesh>
      {/* shelf silhouettes */}
      {[-0.85, 0, 0.85].map((s, i) => (
        <mesh key={`shelf-${i}`} position={[s, 0.5, 0.04]}>
          <boxGeometry args={[0.5, 0.5, 0.04]} />
          <meshStandardMaterial color="#b5a68f" roughness={0.6} />
        </mesh>
      ))}
      {/* door */}
      <mesh position={[side * 0.95, 0, -0.09]} castShadow>
        <boxGeometry args={[0.75, 2.05, 0.08]} />
        <meshStandardMaterial color="#c7bca8" roughness={0.5} />
      </mesh>
      <mesh position={[side * 0.95, 1.0, -0.085]}>
        <boxGeometry args={[0.65, 0.06, 0.07]} />
        <meshStandardMaterial color="#8a785f" metalness={0.6} roughness={0.3} />
      </mesh>
      <SignagePlate name={store.name} accent={accent} selected={selected} side={side} />
      {store.storefront?.modelUrl && (
        <StoreAssetBoundary
          fallback={
            <Html position={[0, 0.1, 0]} center>
              <span className="scene-model-error">Store model unavailable</span>
            </Html>
          }
        >
          <Suspense fallback={null}>
            <UploadedStoreModel
              url={store.storefront.modelUrl}
              scale={store.storefront.modelScale || 1}
              rotation={store.storefront.modelRotation || 0}
            />
          </Suspense>
        </StoreAssetBoundary>
      )}
      {selected && (
        <mesh position={[0, 1.55, -0.2]}>
          <boxGeometry args={[isFacility ? 3.2 : 4.4, 3.3, 0.04]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.35}
          />
        </mesh>
      )}
    </group>
  )
}

function Column({ x, y, z, height = 3.6 }) {
  return (
    <group position={[x, y + height / 2, z]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.32, height, 24]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.35} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 0.18, 24]} />
        <meshStandardMaterial color="#c7bca8" roughness={0.4} />
      </mesh>
      <mesh position={[0, -height / 2, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 0.18, 24]} />
        <meshStandardMaterial color="#c7bca8" roughness={0.4} />
      </mesh>
    </group>
  )
}

function Escalator({ side, y, z }) {
  return (
    <group position={[side * 3.2, y + FLOOR_HEIGHT * 0.5, z]} rotation={[0, 0, side * -0.45]}>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.3, 4.9, 0.3]} />
        <meshStandardMaterial color="#746f65" metalness={0.45} roughness={0.34} />
      </mesh>
      {Array.from({ length: 16 }, (_, step) => (
        <mesh key={`step-${step}`} position={[0, -2.2 + step * 0.29, 0.16]} castShadow>
          <boxGeometry args={[1.16, 0.11, 0.44]} />
          <meshStandardMaterial
            color={step % 2 ? '#aaa59b' : '#c7c3ba'}
            metalness={0.55}
            roughness={0.3}
          />
        </mesh>
      ))}
      {[-0.7, 0.7].map((x) => (
        <mesh key={`rail-${x}`} position={[x, 0, 0.25]}>
          <boxGeometry args={[0.055, 4.95, 0.07]} />
          <meshStandardMaterial color={GOLD} metalness={0.72} roughness={0.24} />
        </mesh>
      ))}
    </group>
  )
}

function Elevator({ y, z }) {
  return (
    <group position={[0, y + FLOOR_HEIGHT * 0.5, z]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 3.2, 1.6]} />
        <meshStandardMaterial color="#c7bca8" metalness={0.5} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.82]}>
        <boxGeometry args={[1.4, 3.0, 0.08]} />
        <meshPhysicalMaterial
          color="#e9e4da"
          roughness={0.14}
          metalness={0.1}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.2, 0.06, 1.4]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Restroom({ side, y, z }) {
  return (
    <group position={[side * 1.6, y + 0.05, z]}>
      <mesh position={[0, 1.1, 0.6]} receiveShadow>
        <boxGeometry args={[2.6, 2.2, 1.2]} />
        <meshStandardMaterial color="#e7e0d4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.1, 1.15]}>
        <boxGeometry args={[2.2, 1.8, 0.08]} />
        <meshPhysicalMaterial
          color="#dfe5e2"
          roughness={0.12}
          metalness={0.08}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh position={[0, 2.3, 1.1]}>
        <boxGeometry args={[2.4, 0.5, 1.15]} />
        <meshStandardMaterial color="#c7bca8" roughness={0.4} />
      </mesh>
      <Text
        position={[0, 1.1, 1.16]}
        fontSize={0.14}
        color="#302d26"
        anchorX="center"
        anchorY="middle"
      >
        Restrooms
      </Text>
    </group>
  )
}

function ServiceDesk({ y, z }) {
  return (
    <group position={[0, y + 0.05, z]}>
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <boxGeometry args={[3.2, 1.0, 1.4]} />
        <meshStandardMaterial color="#c7bca8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[3.0, 0.05, 1.2]} />
        <meshStandardMaterial color="#b5a68f" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.85, 0.7]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#c7bca8" roughness={0.5} />
      </mesh>
      <Text
        position={[0, 0.55, 1.22]}
        fontSize={0.15}
        color="#302d26"
        anchorX="center"
        anchorY="middle"
      >
        Guest Services
      </Text>
    </group>
  )
}

function Seating({ side, y, z }) {
  return (
    <group position={[side * 2.2, y + 0.4, z]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.45, 0.7]} />
        <meshStandardMaterial color="#746f65" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.48, 0.1]}>
        <boxGeometry args={[1.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#5c544a" roughness={0.7} />
      </mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.9, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} />
          <meshStandardMaterial color="#746f65" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Planter({ side, y, z }) {
  return (
    <group position={[side * 2.6, y + 0.26, z]}>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.6, 0.52, 0.52, 24]} />
        <meshStandardMaterial color="#c7b9a2" roughness={0.8} />
      </mesh>
      {[0, 1, 2, 3].map((leaf) => (
        <mesh
          key={leaf}
          position={[
            Math.cos(leaf) * 0.2,
            0.95 + (leaf % 2) * 0.18,
            Math.sin(leaf) * 0.2,
          ]}
          rotation={[0.15, leaf, -0.24]}
          scale={[0.68, 1.55, 0.68]}
        >
          <sphereGeometry args={[0.27, 12, 8]} />
          <meshStandardMaterial color="#839176" roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function CeilingLight({ x, y, z }) {
  return (
    <group position={[x, y + 7.6, z]}>
      <mesh>
        <boxGeometry args={[1.1, 0.06, 2.15]} />
        <meshStandardMaterial color="#fff9e9" emissive="#f2d89d" emissiveIntensity={0.55} />
      </mesh>
      <pointLight intensity={0.4} distance={10} color="#ffe9bd" />
    </group>
  )
}

function FloorArchitecture({ floor, storeys }) {
  const y = floor * FLOOR_HEIGHT
  const zSlots = useMemo(
    () => Array.from({ length: 14 }, (_, i) => -10 + i * 1.6),
    []
  )
  return (
    <group>
      <mesh position={[0, y - 0.15, -3]} receiveShadow>
        <boxGeometry args={[11, 0.3, 36]} />
        <meshStandardMaterial color="#e5dfd4" roughness={0.45} />
      </mesh>
      <mesh position={[0, y + 0.05, -3]} receiveShadow>
        <boxGeometry args={[4.2, 0.1, 36]} />
        <meshStandardMaterial color="#d8ccb6" roughness={0.34} />
      </mesh>
      {zSlots.map((z) => (
        <mesh key={`tile-${z}`} position={[0, y + 0.105, z]} receiveShadow>
          <boxGeometry args={[4.18, 0.012, 1.2]} />
          <meshStandardMaterial color="#c2b28f" roughness={0.5} />
        </mesh>
      ))}
      {/* atrium columns */}
      {zSlots.filter((_, i) => i % 3 === 0).map((z) => (
        <group key={`col-group-${z}`}>
          <Column key={`col-${z}`} x={-5.4} y={y} z={z} />
          <Column key={`col-r-${z}`} x={5.4} y={y} z={z} />
        </group>
      ))}
      {floor > 0 && (
        <group key={`transport-${y}`}>
          <Escalator key={`esc-l-${y}`} side={-1} y={y - FLOOR_HEIGHT} z={-3} />
          <Escalator key={`esc-r-${y}`} side={1} y={y - FLOOR_HEIGHT} z={-3} />
          <Elevator key={`elev-${y}`} y={y - FLOOR_HEIGHT} z={-9} />
        </group>
      )}
      <ServiceDesk y={y} z={-6} />
      <Restroom side={-1} y={y} z={2} />
      <Restroom side={1} y={y} z={2} />
      <Seating side={-1} y={y} z={4} />
      <Seating side={1} y={y} z={4} />
      <Planter side={-1} y={y} z={-6} />
      <Planter side={1} y={y} z={-6} />
      {zSlots.filter((_, i) => i % 4 === 0).map((z) => (
        <group key={`light-group-${z}`}>
          <CeilingLight key={`light-${z}`} x={-3} y={y} z={z} />
          <CeilingLight key={`light-r-${z}`} x={3} y={y} z={z} />
        </group>
      ))}
      <Text
        position={[0, y + 3.5, -12]}
        fontSize={0.32}
        color="#76684e"
        anchorX="center"
        anchorY="middle"
      >
        {storeys.find((s) => s.number === floor)?.label || `F${floor}`}
      </Text>
    </group>
  )
}

function FloorLabel({ floor, storeys }) {
  const floorInfo = storeys.find((s) => s.number === floor)
  return (
    <Html
      position={[0, floor * FLOOR_HEIGHT + 4.5, -11]}
      containerClass="floor-label"
    >
      <div className="floor-label-card">
        <span className="floor-label-number">{floorInfo?.label || `F${floor}`}</span>
        <span className="floor-label-name">{floorInfo?.name || `Floor ${floor}`}</span>
      </div>
    </Html>
  )
}

function MallCamera({ floor = 0, stores, selectedStore, focusKey }) {
  const { camera, gl } = useThree()
  const target = useRef({ x: 0, y: 1.65, z: 10, yaw: 0 })
  const dragging = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      reducedMotion.current = preference.matches
    }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
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
        THREE.MathUtils.clamp(camera.rotation.x - deltaY * 0.003, -0.6, 0.6),
        camera.rotation.y - deltaX * 0.004,
        camera.rotation.z,
        'YXZ'
      )
      target.current.yaw = camera.rotation.y
    }
    const dragEnd = (event) => {
      if (dragging.current?.pointerId !== event.pointerId) return
      dragging.current = null
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
    }
    const release = () => {
      if (!dragging.current) return
      if (canvas.hasPointerCapture(dragging.current.pointerId)) {
        canvas.releasePointerCapture(dragging.current.pointerId)
      }
      dragging.current = null
    }
    canvas.addEventListener('pointerdown', dragStart)
    canvas.addEventListener('pointermove', dragMove)
    canvas.addEventListener('pointerup', dragEnd)
    canvas.addEventListener('pointercancel', dragEnd)
    window.addEventListener('blur', release)
    document.addEventListener('visibilitychange', release)
    return () => {
      canvas.removeEventListener('pointerdown', dragStart)
      canvas.removeEventListener('pointermove', dragMove)
      canvas.removeEventListener('pointerup', dragEnd)
      canvas.removeEventListener('pointercancel', dragEnd)
      window.removeEventListener('blur', release)
      document.removeEventListener('visibilitychange', release)
      if (dragging.current && canvas.hasPointerCapture(dragging.current.pointerId)) {
        canvas.releasePointerCapture(dragging.current.pointerId)
      }
    }
  }, [camera, gl])

  useEffect(() => {
    const placement = selectedStore ? selectedStore.position : null
    target.current.x = placement ? placement.x : 0
    target.current.y = placement ? placement.y + 1.7 : Number(floor) * FLOOR_HEIGHT + 1.7
    target.current.z = placement ? placement.z + 5.5 : 11
    target.current.yaw = placement ? -Math.atan2(placement.x, 5.5) : 0
  }, [floor, selectedStore, focusKey])

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05)
    if (reducedMotion.current) {
      camera.position.set(target.current.x, target.current.y, target.current.z)
      camera.rotation.set(0, target.current.yaw, 0, 'YXZ')
      return
    }
    camera.position.set(
      THREE.MathUtils.damp(camera.position.x, target.current.x, 2.4, step),
      THREE.MathUtils.damp(camera.position.y, target.current.y, 2.4, step),
      THREE.MathUtils.damp(camera.position.z, target.current.z, 2.4, step)
    )
    camera.rotation.set(
      THREE.MathUtils.damp(camera.rotation.x, 0, 2, step),
      THREE.MathUtils.damp(camera.rotation.y, target.current.yaw, 2, step),
      camera.rotation.z,
      'YXZ'
    )
  })

  return null
}

export default function MallScene({
  stores = [],
  floors = [],
  floor = 0,
  selectedStore,
  onSelectStore = () => {},
  focusKey = 0,
}) {
  const floorStores = useMemo(
    () => stores.filter((s) => s.floor === Number(floor)),
    [stores, floor]
  )

  return (
    <Canvas
      className="mall-canvas"
      role="img"
      aria-label="Interactive three-dimensional mall directory"
      fallback={
        <div className="scene-fallback">
          This device can&rsquo;t display the 3D preview. Use the store directory below.
        </div>
      }
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.65, 11], fov: 51, near: 0.1, far: 90 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.9
      }}
    >
      <color attach="background" args={['#eeeae1']} />
      <fog attach="fog" args={['#eeeae1', 20, 46]} />
      <ambientLight intensity={0.5} color="#fff9ef" />
      <hemisphereLight args={['#fff9ee', '#b9aa91', 0.55]} />
      <directionalLight position={[8, 14, 8]} intensity={0.95} castShadow shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}>
        {floors.map((f) => (
          <FloorArchitecture
            key={f.number}
            floor={f.number}
            storeys={floors}
          />
        ))}
        {floorStores.map((store, index) => {
          const side = index % 2 === 0 ? -1 : 1
          return (
            <Storefront
              key={store.id}
              store={store}
              index={index}
              side={side}
              selected={selectedStore?.id === store.id}
              onSelect={onSelectStore}
            />
          )
        })}
      </Suspense>
      <MallCamera
        floor={floor}
        stores={floorStores}
        selectedStore={selectedStore}
        focusKey={focusKey}
      />
      <Environment preset="apartment" environmentIntensity={0.2} />
      <AdaptiveDpr pixelated />
      <FloorLabel floor={floor} storeys={floors} />
    </Canvas>
  )
}
