import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Compass, X } from 'lucide-react';
import * as THREE from 'three';
import { findStore, floorLabel, stores } from '../../data/stores';
import { floors } from '../../data/floors';
import PageTransition from '../../components/layout/PageTransition';
import './StoreSpace.css';

const FLOOR_COLORS = {
  0: '#ff6b6b',
  1: '#ffd166',
  2: '#4ecdc4',
  3: '#5dade2',
  4: '#b388ff',
  5: '#ff8fab',
};

const THEME_BY_TYPE = {
  Shopping: { shape: 'box', accent: '#ff7aa2', glow: '#ffd166' },
  Dining: { shape: 'sphere', accent: '#ff9f43', glow: '#ffe066' },
  Entertainment: { shape: 'torus', accent: '#63e6ff', glow: '#b197fc' },
};

function categoryTheme(category = '', type = '') {
  const c = category.toLowerCase();
  if (c.includes('electronic') || c.includes('gadget')) return { shape: 'icosa', accent: '#22d3ee', glow: '#818cf8' };
  if (c.includes('fashion') || c.includes('apparel') || c.includes('wear') || c.includes('styling')) return { shape: 'box', accent: '#fb7185', glow: '#fbbf24' };
  if (c.includes('food') || c.includes('dining') || c.includes('cafe') || c.includes('fast')) return { shape: 'sphere', accent: '#fb923c', glow: '#fde047' };
  if (c.includes('entertainment') || c.includes('cinema') || c.includes('game')) return { shape: 'torus', accent: '#60a5fa', glow: '#c084fc' };
  if (c.includes('footwear') || c.includes('bag') || c.includes('lifestyle') || c.includes('home') || c.includes('decor') || c.includes('gift') || c.includes('accessor')) return { shape: 'octa', accent: '#34d399', glow: '#f472b6' };
  if (c.includes('kid') || c.includes('personal') || c.includes('care')) return { shape: 'capsule', accent: '#f472b6', glow: '#38bdf8' };
  return THEME_BY_TYPE[type] || { shape: 'octa', accent: '#7dd3fc', glow: '#fda4af' };
}

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
  const radius = 4.0 + t * 11.2;
  const angle = index * golden;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius * 0.74;
  const y = -1.35 + (index % 8) * 0.72 + Math.sin(angle * 1.5) * 0.5;
  return [x, y, z];
}

function BrandNode({ store, position, selected, dimmed, onSelect }) {
  const group = useRef();
  const material = useRef();
  const ring = useRef();
  const [hovered, setHovered] = useState(false);
  const theme = categoryTheme(store.category, store.type);
  const floorColor = FLOOR_COLORS[store.floor] ?? theme.accent;
  const color = selected ? theme.glow : theme.accent;
  const scaleBase = 0.52 + hash01(store.slug) * 0.58;
  const active = selected || hovered;
  const phase = hash01(`${store.slug}-p`) * Math.PI * 2;

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const target = active ? scaleBase * 1.22 : scaleBase;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 1 - Math.exp(-delta * 7.5));
    group.current.rotation.y += delta * (active ? 0.7 : 0.22);
    group.current.rotation.x = Math.sin(t * 0.45 + phase) * 0.12;
    group.current.rotation.z = Math.cos(t * 0.32 + phase) * 0.06;
    if (ring.current) {
      ring.current.rotation.z += delta * (selected ? 1.1 : 0.35);
      ring.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.6 + phase) * 0.12;
    }
    if (material.current) {
      material.current.emissiveIntensity = THREE.MathUtils.lerp(
        material.current.emissiveIntensity,
        selected ? 1.45 : hovered ? 0.95 : 0.45,
        1 - Math.exp(-delta * 6),
      );
      material.current.opacity = THREE.MathUtils.lerp(
        material.current.opacity,
        dimmed ? 0.26 : 0.94,
        1 - Math.exp(-delta * 6),
      );
    }
  });

  return (
    <Float speed={selected ? 0.7 : 1.3 + hash01(store.slug) * 0.8} rotationIntensity={0.18} floatIntensity={selected ? 0.18 : 0.55}>
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
          {theme.shape === 'box' && <boxGeometry args={[1.15, 1.15, 1.15]} />}
          {theme.shape === 'sphere' && <sphereGeometry args={[0.74, 30, 30]} />}
          {theme.shape === 'icosa' && <icosahedronGeometry args={[0.8, 0]} />}
          {theme.shape === 'octa' && <octahedronGeometry args={[0.8, 0]} />}
          {theme.shape === 'torus' && <torusGeometry args={[0.56, 0.24, 20, 44]} />}
          {theme.shape === 'capsule' && <capsuleGeometry args={[0.36, 0.72, 8, 18]} />}
          <meshStandardMaterial
            ref={material}
            color={color}
            emissive={theme.glow}
            emissiveIntensity={0.45}
            roughness={0.16}
            metalness={0.42}
            transparent
            opacity={0.94}
          />
        </mesh>

        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} scale={selected ? 1.15 : 1}>
          <torusGeometry args={[1.05, selected ? 0.03 : 0.018, 12, 64]} />
          <meshBasicMaterial color={floorColor} transparent opacity={dimmed ? 0.12 : selected ? 0.95 : 0.45} />
        </mesh>

        <Text
          position={[0, 1.22, 0]}
          fontSize={selected ? 0.36 : 0.245}
          maxWidth={4.2}
          lineHeight={1.04}
          color={active ? '#ffffff' : '#eef5ff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={active ? 0.02 : 0.013}
          outlineColor="rgba(5, 10, 22, 0.9)"
          fillOpacity={dimmed ? 0.32 : 1}
        >
          {store.brand}
        </Text>
        <Text
          position={[0, 0.88, 0]}
          fontSize={0.112}
          color={active ? '#ffe8b8' : 'rgba(225, 238, 255, 0.72)'}
          anchorX="center"
          anchorY="middle"
          fillOpacity={dimmed ? 0.18 : 0.96}
        >
          {floorLabel(store.floor)} · {store.category}
        </Text>
      </group>
    </Float>
  );
}

function CameraRig({ target }) {
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 2.2, 15));
  const desiredLook = useRef(new THREE.Vector3(0, 0.35, 0));

  useEffect(() => {
    if (target) {
      desiredLook.current.set(target[0], target[1] + 0.2, target[2]);
      desiredPos.current.set(target[0] + 3.6, target[1] + 2.1, target[2] + 5.4);
    } else {
      desiredLook.current.set(0, 0.35, 0);
      desiredPos.current.set(0, 2.2, 15);
    }
  }, [target]);

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-delta * 2.8);
    state.camera.position.lerp(desiredPos.current, k);
    look.current.lerp(desiredLook.current, k);
    state.camera.lookAt(look.current);
    if (!target) {
      state.camera.position.x += Math.sin(state.clock.elapsedTime * 0.08) * 0.003;
    }
  });

  return null;
}

function StoreSpaceScene({ selectedSlug, onSelect }) {
  const nodes = useMemo(
    () => stores.map((store, index) => ({ store, position: brandPosition(index, stores.length) })),
    [],
  );
  const selectedNode = nodes.find((n) => n.store.slug === selectedSlug);

  return (
    <>
      <color attach="background" args={['#090d22']} />
      <fog attach="fog" args={['#090d22', 11, 36]} />
      <ambientLight intensity={0.78} color="#dcecff" />
      <directionalLight position={[8, 12, 7]} intensity={1.4} color="#fff3d6" />
      <pointLight position={[-11, 4, -8]} intensity={26} distance={34} color="#22d3ee" />
      <pointLight position={[11, 2, 10]} intensity={22} distance={32} color="#fb7185" />
      <pointLight position={[0, 8, -7]} intensity={18} distance={28} color="#a78bfa" />
      <pointLight position={[0, -1, 0]} intensity={10} distance={22} color="#34d399" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.45, 0]} receiveShadow>
        <circleGeometry args={[25, 80]} />
        <meshStandardMaterial color="#0f1736" roughness={0.88} metalness={0.08} emissive="#1a2558" emissiveIntensity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.43, 0]}>
        <ringGeometry args={[5.4, 5.62, 96]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.38} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.42, 0]}>
        <ringGeometry args={[9.2, 9.36, 96]} />
        <meshBasicMaterial color="#fda4af" transparent opacity={0.22} />
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
    if (nextSlug) next.set('slug', nextSlug);
    else next.delete('slug');
    if (fromExplorer) next.set('from', 'explore');
    if (explorerStore && !next.get('store')) next.set('store', explorerStore);
    setSearchParams(next, { replace: true });
  };

  const backToExplorer = () => {
    if (explorerStore) navigate(`/explore?store=${encodeURIComponent(explorerStore)}`);
    else navigate('/explore');
  };

  return (
    <PageTransition>
      <div className="store-space-page">
        <div className="store-space-canvas" aria-label="3D stores environment">
          {webglOk ? (
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 2.2, 15], fov: 50, near: 0.1, far: 85 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <StoreSpaceScene selectedSlug={store?.slug || null} onSelect={selectBrand} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="store-space-fallback">3D view needs WebGL. Open the site in a modern browser to explore the brand space.</div>
          )}
        </div>

        <div className="store-space-ui">
          <div className="store-space-topbar">
            {fromExplorer ? (
              <button type="button" className="store-space-back" onClick={backToExplorer}>
                <ArrowLeft size={16} /> Back to Explorer
              </button>
            ) : (
              <button type="button" className="store-space-back" onClick={() => navigate('/explore')}>
                <ArrowLeft size={16} /> Explore Mall
              </button>
            )}

            <div className="store-space-intro">
              <p className="store-space-kicker">ORION MALL STORES</p>
              <h1>One vibrant space for <em>every brand.</em></h1>
              <p>All {stores.length} destinations live here. Select a floating brand to see its details inside this page, then keep exploring without opening another screen.</p>
            </div>

            <button type="button" className="store-space-explore" onClick={() => navigate(fromExplorer && explorerStore ? `/explore?store=${encodeURIComponent(explorerStore)}` : '/explore')}>
              <Compass size={16} /> Explorer
            </button>
          </div>

          {store ? (
            <aside className="store-space-panel" aria-live="polite" key={store.slug}>
              <p className="eyebrow">
                {store.type} <span>·</span> {floorLabel(store.floor)}
              </p>
              <h2>{store.brand}</h2>
              <p>{store.description}</p>
              <div className="store-space-meta">
                <span>{store.category}</span>
                <span>{floorLabel(store.floor)} · {floorInfo?.name}</span>
              </div>
              <div className="store-space-actions">
                <button type="button" className="store-space-action secondary" onClick={() => selectBrand(null)}>
                  <X size={15} /> Clear selection
                </button>
                <button type="button" className="store-space-action primary" onClick={() => navigate(`/explore?store=${store.slug}`)}>
                  Locate in Explorer <ArrowUpRight size={15} />
                </button>
              </div>
            </aside>
          ) : (
            <div className="store-space-hint">
              Tap or click any floating brand to focus it. Details appear here inside Stores — no new page opens. From Explorer, choose a storefront to land on that brand.
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
