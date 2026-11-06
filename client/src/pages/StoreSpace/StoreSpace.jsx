import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Html, Text } from '@react-three/drei';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react';
import * as THREE from 'three';
import { findStore, floorLabel, stores } from '../../data/stores';
import { floors } from '../../data/floors';
import PageTransition from '../../components/layout/PageTransition';
import './StoreSpace.css';

const FLOOR_COLORS = {
  0: '#ff8a5b',
  1: '#ffbf69',
  2: '#4ecdc4',
  3: '#7aa2ff',
  4: '#c084fc',
  5: '#f472b6',
};

const CATEGORY_SHAPES = {
  Shopping: 'box',
  Dining: 'sphere',
  Entertainment: 'icosa',
};

function hash01(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function brandPosition(index, total) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const t = index / Math.max(total - 1, 1);
  const radius = 4.2 + t * 10.8;
  const angle = index * golden;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius * 0.72;
  const y = -1.2 + (index % 7) * 0.78 + Math.sin(angle * 1.7) * 0.45;
  return [x, y, z];
}

function BrandNode({ store, position, selected, dimmed, onSelect }) {
  const group = useRef();
  const material = useRef();
  const [hovered, setHovered] = useState(false);
  const color = FLOOR_COLORS[store.floor] ?? '#7aa2ff';
  const shape = CATEGORY_SHAPES[store.type] || 'octa';
  const scaleBase = 0.55 + hash01(store.slug) * 0.55;
  const active = selected || hovered;

  useFrame((state, delta) => {
    if (!group.current) return;
    const target = active ? scaleBase * 1.18 : scaleBase;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 8));
    group.current.rotation.y += delta * (active ? 0.55 : 0.18);
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35 + position[0]) * 0.08;
    if (material.current) {
      material.current.emissiveIntensity = THREE.MathUtils.lerp(
        material.current.emissiveIntensity,
        selected ? 1.25 : hovered ? 0.8 : 0.35,
        1 - Math.exp(-delta * 6),
      );
      material.current.opacity = THREE.MathUtils.lerp(
        material.current.opacity,
        dimmed ? 0.28 : 0.92,
        1 - Math.exp(-delta * 6),
      );
    }
  });

  return (
    <Float speed={selected ? 0.8 : 1.6} rotationIntensity={0.25} floatIntensity={selected ? 0.25 : 0.7}>
      <group
        ref={group}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(store.slug);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (e.pointerType === 'mouse') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <mesh castShadow>
          {shape === 'box' && <boxGeometry args={[1.15, 1.15, 1.15]} />}
          {shape === 'sphere' && <sphereGeometry args={[0.72, 28, 28]} />}
          {shape === 'icosa' && <icosahedronGeometry args={[0.78, 0]} />}
          {shape === 'octa' && <octahedronGeometry args={[0.78, 0]} />}
          <meshStandardMaterial
            ref={material}
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.35}
            transparent
            opacity={0.92}
          />
        </mesh>
        {selected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.35, 0.035, 16, 64]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
        )}
        <Text
          position={[0, 1.18, 0]}
          fontSize={selected ? 0.34 : 0.24}
          maxWidth={3.8}
          lineHeight={1.05}
          color={active ? '#ffffff' : '#eaf2ff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={active ? 0.018 : 0.012}
          outlineColor="rgba(8, 14, 24, 0.85)"
          fillOpacity={dimmed ? 0.35 : 1}
        >
          {store.brand}
        </Text>
        <Text
          position={[0, 0.86, 0]}
          fontSize={0.11}
          color={active ? '#ffe0b8' : 'rgba(230, 240, 255, 0.72)'}
          anchorX="center"
          anchorY="middle"
          fillOpacity={dimmed ? 0.2 : 0.95}
        >
          {floorLabel(store.floor)} · {store.category}
        </Text>
      </group>
    </Float>
  );
}

function CameraRig({ target }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 1.8, 14));
  const desiredLook = useRef(new THREE.Vector3(0, 0.4, 0));

  useEffect(() => {
    if (target) {
      desiredLook.current.set(target[0], target[1] + 0.25, target[2]);
      desiredPos.current.set(target[0] + 3.8, target[1] + 2.2, target[2] + 5.2);
    } else {
      desiredLook.current.set(0, 0.4, 0);
      desiredPos.current.set(0, 1.8, 14);
    }
  }, [target]);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 2.6);
    camera.position.lerp(desiredPos.current, k);
    look.current.lerp(desiredLook.current, k);
    camera.lookAt(look.current);
  });

  return null;
}

function StoreSpaceScene({ selectedSlug, onSelect }) {
  const selectedStore = selectedSlug ? findStore(selectedSlug) : null;
  const nodes = useMemo(
    () =>
      stores.map((store, index) => ({
        store,
        position: brandPosition(index, stores.length),
      })),
    [],
  );
  const selectedNode = nodes.find((n) => n.store.slug === selectedSlug);

  return (
    <>
      <color attach="background" args={['#0b1320']} />
      <fog attach="fog" args={['#0b1320', 10, 34]} />
      <ambientLight intensity={0.72} color="#d7e8ff" />
      <directionalLight position={[8, 12, 6]} intensity={1.35} color="#fff4df" />
      <pointLight position={[-10, 4, -8]} intensity={22} distance={30} color="#4ecdc4" />
      <pointLight position={[10, 2, 10]} intensity={18} distance={28} color="#ff8a5b" />
      <pointLight position={[0, 8, -6]} intensity={16} distance={26} color="#c084fc" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]} receiveShadow>
        <circleGeometry args={[24, 64]} />
        <meshStandardMaterial color="#111c30" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.38, 0]}>
        <ringGeometry args={[5.8, 6.0, 80]} />
        <meshBasicMaterial color="#35507d" transparent opacity={0.5} />
      </mesh>

      {nodes.map(({ store, position }) => (
        <BrandNode
          key={store.slug}
          store={store}
          position={position}
          selected={store.slug === selectedSlug}
          dimmed={Boolean(selectedSlug) && store.slug !== selectedSlug}
          onSelect={onSelect}
        />
      ))}

      {!selectedStore && (
        <Html center position={[0, 4.8, 0]} zIndexRange={[1, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: 999,
            background: 'rgba(10,18,32,0.55)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(240,247,255,0.88)',
            fontSize: 12,
            fontWeight: 700,
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}>
            Select any floating brand to focus it
          </div>
        </Html>
      )}

      <CameraRig target={selectedNode?.position || null} />
    </>
  );
}

export default function StoreSpacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const slug = searchParams.get('slug');
  const store = slug ? findStore(slug) : null;
  const fromExplorer = searchParams.get('from') === 'explore';
  const explorerStore = searchParams.get('store') || slug;
  const [webglOk] = useState(() => {
    try {
      const c = document.createElement('canvas');
      return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!slug) return;
    if (!store) setSearchParams({}, { replace: true });
  }, [slug, store, setSearchParams]);

  const floorInfo = useMemo(() => (store ? floors.find((f) => f.number === store.floor) : null), [store]);

  const selectBrand = (nextSlug) => {
    const next = new URLSearchParams(searchParams);
    next.set('slug', nextSlug);
    if (fromExplorer) next.set('from', 'explore');
    setSearchParams(next, { replace: true });
  };

  const backToExplorer = () => {
    if (explorerStore) navigate(`/explore?store=${encodeURIComponent(explorerStore)}`);
    else navigate('/explore');
  };

  return (
    <PageTransition>
      <div className="store-space-page">
        <div className="store-space-canvas" aria-label="3D brand environment">
          {webglOk ? (
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 1.8, 14], fov: 50, near: 0.1, far: 80 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <StoreSpaceScene selectedSlug={store?.slug || null} onSelect={selectBrand} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="store-space-fallback">3D view needs WebGL. You can still open destinations from the directory.</div>
          )}
        </div>

        <div className="store-space-ui">
          <div className="store-space-topbar">
            {fromExplorer ? (
              <button type="button" className="store-space-back" onClick={backToExplorer}>
                <ArrowLeft size={16} /> Back to Explorer
              </button>
            ) : (
              <Link to="/stores" className="store-space-back">
                <ArrowLeft size={16} /> Directory
              </Link>
            )}

            <div className="store-space-intro">
              <p className="store-space-kicker">ORION STORE SPACE</p>
              <h1>Explore every brand in one place.</h1>
              <p>A shared 3D environment for all {stores.length} Orion Mall destinations. Select a floating brand to focus it, then keep exploring without opening another page.</p>
            </div>

            <Link to={fromExplorer ? `/explore?store=${encodeURIComponent(explorerStore || '')}` : '/explore'} className="store-space-explore">
              <Compass size={16} /> Explorer
            </Link>
          </div>

          {store ? (
            <aside className="store-space-panel" aria-live="polite">
              <p className="eyebrow">
                {store.type} <span>·</span> {floorLabel(store.floor)}
              </p>
              <h2>{store.brand}</h2>
              <p>{store.description}</p>
              <div className="store-space-meta">
                <span>{store.category}</span>
                <span>{floorLabel(store.floor)} · {floorInfo?.name}</span>
                <span>Shared Store Space</span>
              </div>
              <div className="store-space-actions">
                <Link className="store-space-action primary" to={`/explore?store=${store.slug}`}>
                  Locate in Explorer <Compass size={15} />
                </Link>
                <Link className="store-space-action secondary" to="/visit">
                  Plan visit <ArrowUpRight size={15} />
                </Link>
              </div>
            </aside>
          ) : (
            <div className="store-space-hint">
              All 45 destinations are floating here. Tap or click a brand name to see its details. If you arrived from the 3D Explorer, use Back to Explorer to return to the same floor.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
