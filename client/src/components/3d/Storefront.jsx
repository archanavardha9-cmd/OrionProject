import { memo } from 'react'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

// Category colour palettes for realistic retail styling
const CATEGORY_PALETTES = {
  Fashion: { base: '#2b2c34', accent: '#d4af37', glass: '#e4ecf0', glow: '#ffd885' },
  Footwear: { base: '#3d342a', accent: '#c99a5e', glass: '#e0e6e8', glow: '#ffcc88' },
  Jewellery: { base: '#1a1917', accent: '#f3cf7a', glass: '#f0f4fa', glow: '#ffe599' },
  Beauty: { base: '#3a2933', accent: '#e8a5b8', glass: '#f5ebf0', glow: '#ffc5d5' },
  Electronics: { base: '#1b222d', accent: '#62b0e8', glass: '#dff1fa', glow: '#80d4ff' },
  Restaurant: { base: '#352119', accent: '#e2885c', glass: '#faeee6', glow: '#ffb38a' },
  Cafe: { base: '#3a2e26', accent: '#dcb183', glass: '#f5eee6', glow: '#ffd699' },
  'Food Court': { base: '#332b24', accent: '#f5aa5b', glass: '#f7f0e8', glow: '#ffc285' },
  Cinema: { base: '#161426', accent: '#a77bf3', glass: '#ebe6fa', glow: '#c8a8ff' },
  Gaming: { base: '#14202b', accent: '#4ee3c1', glass: '#e3faf4', glow: '#85ffdf' },
  Entertainment: { base: '#22192e', accent: '#e86bc7', glass: '#fcebf7', glow: '#ffa8ea' },
  'Family Leisure': { base: '#1f2824', accent: '#8dc2a4', glass: '#e8f5ee', glow: '#b4e8cb' },
  Lifestyle: { base: '#2b3330', accent: '#8dc2a4', glass: '#e8f5ee', glow: '#b5e8cd' },
  'Department Store': { base: '#262930', accent: '#d6a865', glass: '#eef2f7', glow: '#f0c78a' },
  Supermarket: { base: '#1e3023', accent: '#72c988', glass: '#ebf7ed', glow: '#99e6ad' },
  Health: { base: '#1c2e28', accent: '#58c7a2', glass: '#e6f7f2', glow: '#85ebd0' },
  Services: { base: '#2a3036', accent: '#7da4c7', glass: '#edf3f7', glow: '#a8d1f7' },
  Facilities: { base: '#2c2c2c', accent: '#c0b8ac', glass: '#eeeeee', glow: '#e0dacd' },
  'Customer Service': { base: '#2c2925', accent: '#d4af37', glass: '#f0ece1', glow: '#ffe299' },
  Parking: { base: '#25282c', accent: '#7da4c7', glass: '#e8edf2', glow: '#a0c4e8' },
}

const GOLD = '#d4af37'
const GOLD_GLOW = '#ffd885'

function StoreInterior({ category, palette }) {
  // Category-specific high-realism interior fixtures
  if (['Fashion', 'Footwear', 'Accessories', 'Department Store', 'Lifestyle'].includes(category)) {
    return (
      <group position={[0, 0, 1.4]}>
        {/* Central Display Island Table */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.5, 0.9]} />
          <meshStandardMaterial color="#302d2a" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Display Items on Table */}
        {[-0.5, 0.5].map((x, i) => (
          <mesh key={i} position={[x, 0.75, 0]}>
            <boxGeometry args={[0.38, 0.12, 0.28]} />
            <meshStandardMaterial color={i === 0 ? palette.accent : '#f4eee1'} roughness={0.5} />
          </mesh>
        ))}

        {/* Mannequins on Pedestals */}
        {[-0.9, 0.9].map((x, i) => (
          <group key={i} position={[x, 0, -0.6]}>
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.22, 0.25, 0.24, 16]} />
              <meshStandardMaterial color="#1a1918" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <cylinderGeometry args={[0.13, 0.17, 0.75, 16]} />
              <meshStandardMaterial color={palette.accent} roughness={0.3} metalness={0.3} />
            </mesh>
            <mesh position={[0, 1.35, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Wall Garment Hanging Rails */}
        {[-1.5, 1.5].map((x, i) => (
          <group key={i} position={[x, 1.6, 0.8]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
              <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
            </mesh>
            {[-0.4, -0.1, 0.2, 0.5].map((off, j) => (
              <mesh key={j} position={[0, -0.4, off]}>
                <boxGeometry args={[0.05, 0.7, 0.18]} />
                <meshStandardMaterial color={j % 2 === 0 ? palette.base : palette.accent} roughness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    )
  }

  if (['Jewellery', 'Beauty'].includes(category)) {
    return (
      <group position={[0, 0, 1.4]}>
        {/* Illuminated Vitrine Pedestals */}
        {[-0.7, 0.7].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.65, 1.0, 0.65]} />
              <meshStandardMaterial color="#151413" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[0.6, 0.5, 0.6]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.05} transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, 1.15, 0]}>
              <octahedronGeometry args={[0.12]} />
              <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
        {/* Mirrored Feature Wall Accent */}
        <mesh position={[0, 1.8, 1.6]}>
          <planeGeometry args={[2.4, 2.2]} />
          <meshStandardMaterial color="#1f1d1a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    )
  }

  if (['Electronics'].includes(category)) {
    return (
      <group position={[0, 0, 1.4]}>
        {/* Minimalist Tech Display Table */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[2.2, 0.5, 0.85]} />
          <meshStandardMaterial color="#e5ded2" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Tablet / Laptop Displays */}
        {[-0.7, -0.2, 0.3, 0.8].map((x, i) => (
          <group key={i} position={[x, 0.75, 0]}>
            <mesh rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.26, 0.02, 0.2]} />
              <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.05, 0.02]} rotation={[-0.3, 0, 0]}>
              <planeGeometry args={[0.22, 0.16]} />
              <meshBasicMaterial color={palette.glow} />
            </mesh>
          </group>
        ))}
        {/* Glowing Tech Wall Accent */}
        <mesh position={[0, 2.0, 1.6]}>
          <planeGeometry args={[2.6, 0.4]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    )
  }

  if (['Restaurant', 'Cafe', 'Food Court', 'Dessert', 'Beverage'].includes(category)) {
    return (
      <group position={[0, 0, 1.4]}>
        {/* Service Counter */}
        <mesh position={[0, 0.55, 0.6]}>
          <boxGeometry args={[2.2, 1.1, 0.6]} />
          <meshStandardMaterial color="#2d241e" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Counter Top Marble */}
        <mesh position={[0, 1.12, 0.6]}>
          <boxGeometry args={[2.3, 0.06, 0.7]} />
          <meshStandardMaterial color="#faf6ee" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Espresso / Display Machine */}
        <mesh position={[-0.5, 1.3, 0.6]}>
          <boxGeometry args={[0.45, 0.35, 0.35]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Dining Table with Chairs */}
        <mesh position={[0.6, 0.4, -0.6]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
          <meshStandardMaterial color="#4a3728" roughness={0.4} />
        </mesh>
        <mesh position={[0.6, 0.2, -0.6]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#1a1918" metalness={0.8} />
        </mesh>
        {/* Warm Amber Pendant */}
        <mesh position={[0, 2.5, 0.6]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#ffd885" emissive="#ffd885" emissiveIntensity={0.8} />
        </mesh>
      </group>
    )
  }

  if (['Cinema', 'Entertainment', 'Gaming', 'Family Leisure'].includes(category)) {
    return (
      <group position={[0, 0, 1.4]}>
        {/* Cinema / Entertainment Entrance Portal */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[2.6, 2.2, 0.1]} />
          <meshStandardMaterial color="#120e24" roughness={0.4} />
        </mesh>
        {/* Illuminated Poster Lightboxes */}
        {[-0.8, 0.8].map((x, i) => (
          <group key={i} position={[x, 1.8, 0.08]}>
            <mesh>
              <planeGeometry args={[0.55, 0.85]} />
              <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[0.62, 0.92, 0.04]} />
              <meshStandardMaterial color="#111" metalness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Concession / Arcade Glow */}
        <mesh position={[0, 0.5, 0.8]}>
          <boxGeometry args={[1.8, 0.9, 0.5]} />
          <meshStandardMaterial color="#1a1530" emissive="#7c3aed" emissiveIntensity={0.3} />
        </mesh>
      </group>
    )
  }

  // Generic / Essentials / Supermarket / Facilities
  return (
    <group position={[0, 0, 1.4]}>
      {/* Reception / Checkout Desk */}
      <mesh position={[0, 0.55, 0.3]}>
        <boxGeometry args={[2.0, 1.0, 0.6]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Back Shelving Unit */}
      <mesh position={[0, 1.6, 1.4]}>
        <boxGeometry args={[2.6, 2.0, 0.3]} />
        <meshStandardMaterial color="#423d38" roughness={0.5} />
      </mesh>
    </group>
  )
}

function StorefrontComponent({
  store,
  floorY,
  isSelected,
  isHighlighted,
  onSelect,
  onHoverStore,
}) {
  const { position, name, brand, category, type } = store
  const displayName = brand || name
  const isEmphasized = isSelected || isHighlighted
  const interiorCategory = type === 'Dining'
    ? 'Food Court'
    : type === 'Entertainment'
      ? 'Entertainment'
      : category.includes('Electronics')
        ? 'Electronics'
        : 'Fashion'
  const palette = CATEGORY_PALETTES[interiorCategory]

  // Store orientation based on X position:
  // Storefront facades face inward toward the main corridor.
  // x < 0: Left side faces +X; x > 0: Right side faces -X.
  const isLeftSide = position.x < -1
  const isRightSide = position.x > 1
  const rotationY = isLeftSide ? -Math.PI / 2 : isRightSide ? Math.PI / 2 : 0

  const width = 3.2
  const height = 3.6
  const depth = 3.6

  // Entrance door on the facade
  const doorWidth = 1.05
  const doorHeight = 2.45

  return (
    <group
      position={[position.x, floorY, position.z]}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(store)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (e.pointerType === 'mouse') onHoverStore(store.id)
      }}
      onPointerOut={(e) => {
        if (e.pointerType === 'mouse') onHoverStore(null)
      }}
    >
      {/* Clickable Storefront Hitbox for Effortless User Selection */}
      <mesh
        position={[0, height / 2, -0.18]}
        onClick={(event) => {
          event.stopPropagation()
          onSelect(store)
        }}
      >
        <boxGeometry args={[width, height, 0.12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {/* ── STORE INTERIOR ROOM (FLOOR, WALLS, CEILING) ── */}
      {/* Interior Floor */}
      <mesh position={[0, 0.02, depth / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#dcd3c4" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, height / 2, depth]} receiveShadow>
        <planeGeometry args={[width, height]} rotation={[0, Math.PI, 0]} />
        <meshStandardMaterial color="#e8e1d5" roughness={0.6} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, height / 2, depth / 2]} receiveShadow>
        <planeGeometry args={[depth, height]} rotation={[0, Math.PI / 2, 0]} />
        <meshStandardMaterial color="#eae4d8" roughness={0.5} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, height / 2, depth / 2]} receiveShadow>
        <planeGeometry args={[depth, height]} rotation={[0, -Math.PI / 2, 0]} />
        <meshStandardMaterial color="#eae4d8" roughness={0.5} />
      </mesh>

      {/* Store Interior Ceiling */}
      <mesh position={[0, height, depth / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f0eadf" roughness={0.5} />
      </mesh>

      {/* ── DETAILED INTERIOR DISPLAY FIXTURES ── */}
      <StoreInterior category={interiorCategory} palette={palette} />

      {/* ── STOREFRONT ARCHITECTURAL FACADE (FACING CORRIDOR AT Z = 0) ── */}
      {/* Top Header / Signboard Fascia Beam */}
      <mesh position={[0, height - 0.35, 0]} castShadow>
        <boxGeometry args={[width + 0.08, 0.7, 0.22]} />
        <meshStandardMaterial
          color={isEmphasized ? '#1c1a17' : '#242220'}
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Signboard Illuminated Accent Border */}
      <mesh position={[0, height - 0.35, -0.115]}>
        <boxGeometry args={[width, 0.62, 0.02]} />
        <meshStandardMaterial
          color={isEmphasized ? GOLD_GLOW : palette.accent}
          emissive={isEmphasized ? GOLD_GLOW : palette.accent}
          emissiveIntensity={isEmphasized ? 0.9 : 0.4}
        />
      </mesh>

      {/* Signboard Backing Plate */}
      <mesh position={[0, height - 0.35, -0.125]}>
        <boxGeometry args={[width - 0.08, 0.54, 0.02]} />
        <meshStandardMaterial color="#141312" metalness={0.7} roughness={0.3} />
      </mesh>

      {store.floor < 4 && (
        <Billboard position={[0, height - 0.35, -0.15]} follow>
          <Text
            fontSize={0.24}
            maxWidth={width - 0.3}
            color={isEmphasized ? GOLD_GLOW : '#fffefa'}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
          >
            {displayName}
          </Text>
        </Billboard>
      )}

      {/* Vertical Side Framing Columns */}
      <mesh position={[-width / 2 + 0.08, height / 2, 0]} castShadow>
        <boxGeometry args={[0.16, height, 0.22]} />
        <meshStandardMaterial color="#2d2a27" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2 - 0.08, height / 2, 0]} castShadow>
        <boxGeometry args={[0.16, height, 0.22]} />
        <meshStandardMaterial color="#2d2a27" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Entrance Doorway Frame (Center or Offset) */}
      <group position={[0, doorHeight / 2, 0]}>
        {/* Doorway Frame Box */}
        <mesh position={[-doorWidth / 2 - 0.03, 0, 0]}>
          <boxGeometry args={[0.06, doorHeight, 0.14]} />
          <meshStandardMaterial color={isSelected ? GOLD : '#3a3631'} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[doorWidth / 2 + 0.03, 0, 0]}>
          <boxGeometry args={[0.06, doorHeight, 0.14]} />
          <meshStandardMaterial color={isSelected ? GOLD : '#3a3631'} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, doorHeight / 2 + 0.03, 0]}>
          <boxGeometry args={[doorWidth + 0.12, 0.06, 0.14]} />
          <meshStandardMaterial color={isSelected ? GOLD : '#3a3631'} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Clear Glass Door Panes */}
        <mesh position={[-doorWidth / 4, 0, 0]}>
          <planeGeometry args={[doorWidth / 2 - 0.02, doorHeight - 0.04]} />
          <meshPhysicalMaterial
            color="#eef6fa"
            transmission={0.88}
            roughness={0.06}
            metalness={0.1}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[doorWidth / 4, 0, 0]}>
          <planeGeometry args={[doorWidth / 2 - 0.02, doorHeight - 0.04]} />
          <meshPhysicalMaterial
            color="#eef6fa"
            transmission={0.88}
            roughness={0.06}
            metalness={0.1}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Vertical Brushed Brass Pull Handles */}
        <mesh position={[-0.05, 0, -0.06]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.05, 0, -0.06]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* Left Display Window (Glass) */}
      <mesh
        position={[-(width / 2 + doorWidth / 2) / 2, doorHeight / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[(width - doorWidth) / 2 - 0.18, doorHeight - 0.1]} />
        <meshPhysicalMaterial
          color={palette.glass}
          transmission={0.88}
          roughness={0.05}
          metalness={0.15}
          reflectivity={0.9}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right Display Window (Glass) */}
      <mesh
        position={[(width / 2 + doorWidth / 2) / 2, doorHeight / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[(width - doorWidth) / 2 - 0.18, doorHeight - 0.1]} />
        <meshPhysicalMaterial
          color={palette.glass}
          transmission={0.88}
          roughness={0.05}
          metalness={0.15}
          reflectivity={0.9}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Display Window Plinth / Base Sills */}
      <mesh
        position={[-(width / 2 + doorWidth / 2) / 2, 0.15, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[(width - doorWidth) / 2 - 0.14, 0.3, 0.2]} />
        <meshStandardMaterial color="#2d2a27" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh
        position={[(width / 2 + doorWidth / 2) / 2, 0.15, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[(width - doorWidth) / 2 - 0.14, 0.3, 0.2]} />
        <meshStandardMaterial color="#2d2a27" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* ── SELECTED STORE WAYFINDING BEACON ── */}
      {isSelected && (
        <group position={[0, height + 0.6, -0.1]}>
          {/* Pulsing Beacon Cone Pointing Down */}
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.3, 0.65, 16]} />
            <meshStandardMaterial
              color={GOLD_GLOW}
              emissive={GOLD_GLOW}
              emissiveIntensity={1.2}
            />
          </mesh>
          <pointLight color={GOLD_GLOW} intensity={2.5} distance={8} decay={2} />
          {/* Floating 'YOU ARE HERE' / Destination Marker */}
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default memo(StorefrontComponent)
