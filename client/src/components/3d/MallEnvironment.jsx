import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import { adjacentFloorNumber, FLOOR_HEIGHT, floorName, floors } from '../../data/floors'
import Storefront from './Storefront'
import { illustrativeStorefrontPosition } from './storefrontLayout'

const GOLD = '#d4af37'
const BRASS_COLLAR = '#bfa15f'

export default function MallEnvironment({
  floor = 0,
  stores = [],
  selectedStoreId = null,
  highlightedStoreIds = [],
  onSelectStore = () => {},
  onHoverStore = () => {},
  onNavigateFloor,
  onFloorClick = () => {},
}) {
  const kineticRef = useRef()
  const floorY = floor * FLOOR_HEIGHT
  const nextFloor = adjacentFloorNumber(floor)
  const isUpperFloor = nextFloor > floor
  const topFloor = floors[floors.length - 1]?.number
  const storefronts = stores.map((store, index) => ({
    ...store,
    position: illustrativeStorefrontPosition(index, stores.length),
  }))

  // Gentle floating rotation for the central atrium kinetic sculpture
  useFrame((_, delta) => {
    if (kineticRef.current) {
      kineticRef.current.rotation.y += delta * 0.25
    }
  })

  // Procedural marble tile joints for realistic flooring
  const corridorWidth = 8.8
  const corridorLength = 30.0

  return (
    <group position={[0, floorY, 0]}>
      {/* ── 1. MAIN CORRIDOR MARBLE FLOOR ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        name="corridor-floor"
        onClick={(e) => {
          e.stopPropagation()
          onFloorClick(e.point)
        }}
      >
        <planeGeometry args={[corridorWidth, corridorLength]} />
        <meshStandardMaterial
          color="#f6f2ea"
          roughness={0.16}
          metalness={0.12}
        />
      </mesh>

      {/* Brass Dividing Inlay Strips along Walkway Edges */}
      {[-3.6, 3.6].map((x, i) => (
        <mesh key={i} position={[x, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, corridorLength]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Transverse Expansion Joints every 3m */}
      {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((z) => (
        <mesh key={z} position={[0, 0.004, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[corridorWidth, 0.03]} />
          <meshStandardMaterial color="#c8beae" roughness={0.6} />
        </mesh>
      ))}

      {/* ── 2. ARCHITECTURAL ACOUSTIC CEILING WITH RECESSED LIGHTING ── */}
      <mesh position={[0, 3.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[corridorWidth, corridorLength]} />
        <meshStandardMaterial color="#eee9df" roughness={0.6} />
      </mesh>

      {/* Recessed Longitudinal Warm-White Light Trough (Center of Ceiling) */}
      <mesh position={[0, 3.63, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.65, corridorLength - 2]} />
        <meshStandardMaterial
          color="#fffcf0"
          emissive="#fff7e6"
          emissiveIntensity={1.3}
          roughness={0.2}
        />
      </mesh>

      {/* Ceiling Downlight Spots along the Corridor */}
      {[-12, -8, -4, 0, 4].map((z) => (
        <group key={z} position={[0, 3.62, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight color="#fff6e8" intensity={1.1} distance={9} decay={2} />
        </group>
      ))}

      {/* ── 3. ARCHITECTURAL STRUCTURAL COLUMNS WITH BRASS BASES ── */}
      {[-6.9, -0.1, 6.7, 13.5].map((z) =>
        [-3.8, 3.8].map((x, sideIdx) => (
          <group key={`${z}-${sideIdx}`} position={[x, 0, z]}>
            {/* Column Shaft */}
            <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.42, 3.6, 0.42]} />
              <meshStandardMaterial color="#e6dfd1" roughness={0.35} metalness={0.08} />
            </mesh>
            {/* Brushed Brass Base Collar */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.48, 0.24, 0.48]} />
              <meshStandardMaterial color={BRASS_COLLAR} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Capital Crown at Ceiling */}
            <mesh position={[0, 3.52, 0]}>
              <boxGeometry args={[0.48, 0.18, 0.48]} />
              <meshStandardMaterial color={BRASS_COLLAR} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* Storefronts line both sides of the shared visitor corridor. */}
      {storefronts.map((store) => (
        <Storefront
          key={store.id}
          store={store}
          floorY={0}
          isSelected={store.id === selectedStoreId}
          isHighlighted={highlightedStoreIds.includes(store.id)}
          onSelect={onSelectStore}
          onHoverStore={onHoverStore}
        />
      ))}

      {storefronts.filter((store) => store.floor >= 4).map((store) => {
        const isEmphasized = store.id === selectedStoreId || highlightedStoreIds.includes(store.id)

        return (
          <Billboard
            key={`${store.id}-wayfinding-sign`}
            position={[store.position.x * 0.48, 3.1, store.position.z]}
            follow
          >
            <group
              onClick={(event) => {
                event.stopPropagation()
                onSelectStore(store)
              }}
              onPointerOver={(event) => {
                event.stopPropagation()
                if (event.pointerType === 'mouse') onHoverStore(store.id)
              }}
              onPointerOut={(event) => {
                if (event.pointerType === 'mouse') onHoverStore(null)
              }}
            >
              <mesh position={[0, 0, -0.035]}>
                <boxGeometry args={[3, 0.82, 0.08]} />
                <meshStandardMaterial
                  color={isEmphasized ? '#283c3b' : '#172832'}
                  emissive={isEmphasized ? '#b4975a' : '#000000'}
                  emissiveIntensity={isEmphasized ? 0.35 : 0}
                  metalness={0.35}
                  roughness={0.38}
                />
              </mesh>
              {[-0.22, 0.22].map((x) => (
                <mesh key={x} position={[x, 0.49, -0.035]}>
                  <boxGeometry args={[0.045, 0.16, 0.06]} />
                  <meshStandardMaterial color={BRASS_COLLAR} metalness={0.8} roughness={0.25} />
                </mesh>
              ))}
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.18}
                maxWidth={2.8}
                color={isEmphasized ? '#ffe4a3' : '#fffefa'}
                anchorX="center"
                anchorY="middle"
                textAlign="center"
              >
                {store.brand}
              </Text>
            </group>
          </Billboard>
        )
      })}

      {/* ── 4. CORRIDOR PLANTERS & RESTING BENCHES ── */}
      {[-9, -3, 3].map((z) => (
        <group key={z} position={[z % 2 === 0 ? -3.1 : 3.1, 0, z]}>
          {/* Planter Box */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.65, 0.5, 1.6]} />
            <meshStandardMaterial color="#2d2a27" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Wood Bench Rim */}
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[0.72, 0.06, 1.68]} />
            <meshStandardMaterial color="#5c4533" roughness={0.3} />
          </mesh>
          {/* Soil Bed */}
          <mesh position={[0, 0.51, 0]}>
            <boxGeometry args={[0.55, 0.02, 1.5]} />
            <meshStandardMaterial color="#1a1816" roughness={0.9} />
          </mesh>
          {/* Lush Green Foliage (Monstera / Ficus layered discs) */}
          {[-0.4, 0, 0.4].map((pz, pi) => (
            <group key={pi} position={[0, 0.75 + pi * 0.1, pz]}>
              <mesh rotation={[0.2 * pi, pi * 1.2, 0.15]}>
                <cylinderGeometry args={[0.22, 0.05, 0.4, 8]} />
                <meshStandardMaterial color="#2d5a37" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0.2, 0]} rotation={[0.4, -pi * 0.8, -0.3]}>
                <sphereGeometry args={[0.18, 8, 8]} />
                <meshStandardMaterial color="#3b7a48" roughness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* ── 5. GRAND CENTRAL ATRIUM (Z = +7 to +14) ── */}
      <group position={[0, 0, 10.5]}>
        {/* Atrium Mezzanine Opening Floor Cutout Trim */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[corridorWidth + 0.2, 0.1, 7.2]} />
          <meshStandardMaterial color="#dcd3c4" roughness={0.2} />
        </mesh>

        {/* Curved / Linear Glass Balustrade with Champagne-Gold Handrail */}
        <group position={[0, 0, 0]}>
          {/* Left Railing */}
          <mesh position={[-3.5, 0.5, 0]}>
            <boxGeometry args={[0.06, 1.0, 7.0]} />
            <meshPhysicalMaterial
              color="#eaf3fa"
              transmission={0.92}
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.65}
            />
          </mesh>
          <mesh position={[-3.5, 1.02, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 7.0, 8]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Glowing LED Base Toe-Kick */}
          <mesh position={[-3.5, 0.03, 0]}>
            <boxGeometry args={[0.08, 0.06, 7.0]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} />
          </mesh>

          {/* Right Railing */}
          <mesh position={[3.5, 0.5, 0]}>
            <boxGeometry args={[0.06, 1.0, 7.0]} />
            <meshPhysicalMaterial
              color="#eaf3fa"
              transmission={0.92}
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.65}
            />
          </mesh>
          <mesh position={[3.5, 1.02, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 7.0, 8]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[3.5, 0.03, 0]}>
            <boxGeometry args={[0.08, 0.06, 7.0]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} />
          </mesh>

          {/* End Perimeter Railing at Z = 3.5 */}
          <mesh position={[0, 0.5, 3.5]}>
            <boxGeometry args={[7.0, 1.0, 0.06]} />
            <meshPhysicalMaterial
              color="#eaf3fa"
              transmission={0.92}
              roughness={0.05}
              metalness={0.1}
              transparent
              opacity={0.65}
            />
          </mesh>
          <mesh position={[0, 1.02, 3.5]}>
            <cylinderGeometry args={[0.04, 0.04, 7.0, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
          </mesh>
        </group>

        {/* Suspended Modern Kinetic Sculpture Hanging in Atrium Center */}
        <group ref={kineticRef} position={[0, 1.8, 0]}>
          {/* Main Gold Ring */}
          <mesh rotation={[Math.PI / 3, 0.4, 0]}>
            <torusGeometry args={[1.4, 0.035, 16, 64]} />
            <meshStandardMaterial color={GOLD} metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Intersecting Inner Ring */}
          <mesh rotation={[-Math.PI / 4, 0.8, 0.2]}>
            <torusGeometry args={[0.9, 0.03, 16, 48]} />
            <meshStandardMaterial color="#fffefa" emissive={GOLD} emissiveIntensity={0.4} metalness={0.9} />
          </mesh>
          {/* Central Prismatic Core */}
          <mesh>
            <octahedronGeometry args={[0.25]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* ── 6. DUAL SCISSOR ESCALATORS CONNECTING FLOORS ── */}
      <group position={[-1.6, 0, 10.5]}>
        {/* Escalator Incline Truss */}
        <mesh position={[0, 1.4, 0]} rotation={[0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.95, 0.35, 5.2]} />
          <meshStandardMaterial color="#302d28" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Stainless Steel Side Cladding */}
        <mesh position={[-0.48, 1.4, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.04, 0.6, 5.2]} />
          <meshStandardMaterial color="#c2b8a8" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.48, 1.4, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.04, 0.6, 5.2]} />
          <meshStandardMaterial color="#c2b8a8" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Glowing Balustrade Glass with Black Continuous Handrail */}
        <mesh position={[-0.48, 1.95, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.02, 0.7, 5.0]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.85} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.48, 2.32, 0]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 5.0, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#1a1918" roughness={0.4} />
        </mesh>

        <mesh position={[0.48, 1.95, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.02, 0.7, 5.0]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.85} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.48, 2.32, 0]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 5.0, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#1a1918" roughness={0.4} />
        </mesh>

        {/* Steps with Yellow Safety Edges */}
        <mesh position={[0, 1.45, 0]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.82, 0.04, 4.8]} />
          <meshStandardMaterial color="#403c37" roughness={0.5} />
        </mesh>
        {Array.from({ length: 10 }, (_, index) => (
          <mesh key={index} position={[0, 0.65 + index * 0.12, -1.85 + index * 0.38]}>
            <boxGeometry args={[0.78, 0.08, 0.28]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#aaa49a' : '#77736b'} roughness={0.45} />
          </mesh>
        ))}

        {/* Escalator Overhead Directional Signage */}
        <group position={[0, 2.7, -2.6]}>
          <mesh>
            <boxGeometry args={[1.5, 0.4, 0.08]} />
            <meshStandardMaterial color="#161514" metalness={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.13}
            color={GOLD}
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI, 0]}
          >
            {isUpperFloor ? `↑ ${floorName(nextFloor)}` : `↓ ${floorName(nextFloor)}`}
          </Text>
        </group>

        {/* Clickable Escalator Trigger Zone */}
        <mesh
          position={[0, 0.8, -1.8]}
          onClick={(e) => {
            e.stopPropagation()
            if (onNavigateFloor) {
              onNavigateFloor(nextFloor)
            }
          }}
        >
          <boxGeometry args={[1.2, 1.6, 1.5]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* ── 7. PANORAMIC GLASS OBSERVATION ELEVATOR ── */}
      <group position={[2.5, 0, 10.5]}>
        {/* Elevator Structural Guide Pylons */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 1.8, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 4.2, 8]} />
            <meshStandardMaterial color="#2d2a26" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Cylindrical Glass Shaft */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 3.6, 24, 1, true]} />
          <meshPhysicalMaterial
            color="#e8f3fa"
            transmission={0.92}
            roughness={0.06}
            metalness={0.15}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Elevator Cab (Floor, Roof, Handrail) */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.12, 24]} />
          <meshStandardMaterial color="#26231f" metalness={0.7} />
        </mesh>
        <mesh position={[0, 3.45, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.12, 24]} />
          <meshStandardMaterial color="#26231f" metalness={0.7} />
        </mesh>

        {/* Ceiling Downlight inside Cab */}
        <pointLight position={[0, 3.2, 0]} color="#fff7e6" intensity={1.2} distance={4} />

        {/* Elevator Floor Call Pillar */}
        <group position={[0, 1.2, -0.9]}>
          <mesh>
            <boxGeometry args={[0.28, 0.7, 0.1]} />
            <meshStandardMaterial color="#22201d" metalness={0.8} />
          </mesh>
          <Text
            position={[0, 0.18, 0.06]}
            fontSize={0.09}
            color={GOLD}
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI, 0]}
          >
            ELEVATOR
          </Text>
          {/* Floor Number Indicator */}
          <mesh position={[0, 0, 0.055]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Clickable Elevator Trigger */}
        <mesh
          position={[0, 1.6, -0.2]}
          onClick={(e) => {
            e.stopPropagation()
            if (onNavigateFloor) {
              onNavigateFloor(nextFloor)
            }
          }}
        >
          <cylinderGeometry args={[0.85, 0.85, 3.2, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* ── 8. MONUMENTAL GLASS SKYLIGHT (Over Atrium above Floor 3) ── */}
      {floor === topFloor && (
        <group position={[0, 4.8, 10.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[4.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial
              color="#d9effa"
              transmission={0.9}
              roughness={0.08}
              transparent
              opacity={0.5}
            />
          </mesh>
          <directionalLight
            position={[0, 10, 0]}
            intensity={1.2}
            color="#fffbf2"
            castShadow
          />
        </group>
      )}
    </group>
  )
}
