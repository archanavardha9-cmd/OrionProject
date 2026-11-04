import { Component, useState, useCallback, useEffect, Suspense, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { stores as defaultStores } from '../../data/stores'
import { FLOOR_HEIGHT } from '../../data/floors'
import MallEnvironment from './MallEnvironment'
import Storefront from './Storefront'
import WalkthroughControls from './WalkthroughControls'
import WayfindingPath from './WayfindingPath'
import WalkthroughHUD from './WalkthroughHUD'
import LoadingScreen from '../layout/LoadingScreen'
import './Walkthrough.css'

const NOOP = () => {}

class SceneErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    this.props.onError(error)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

export default function MallWalkthrough({
  stores = defaultStores,
  floor = 0,
  selectedStore,
  onSelectStore = NOOP,
  onChangeFloor = null,
  mode = 'full', // 'full' | 'preview'
  height = '100%',
  className = '',
}) {
  const [internalFloor, setInternalFloor] = useState(floor)
  const [internalSelected, setInternalSelected] = useState(selectedStore)
  const [transitPrompt, setTransitPrompt] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTargetFloor, setTransitionTargetFloor] = useState(null)
  const [touchVector, setTouchVector] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState([0, 1.7, -11])
  const [sceneError, setSceneError] = useState('')
  const [canvasElement, setCanvasElement] = useState(null)
  const controlsRef = useRef()

  const activeFloor = onChangeFloor !== null ? floor : internalFloor
  const selected = selectedStore !== undefined ? selectedStore : internalSelected

  const floorY = activeFloor * FLOOR_HEIGHT
  const floorStores = useMemo(() => stores.filter((store) => store.floor === activeFloor), [stores, activeFloor])

  useEffect(() => {
    if (!canvasElement) return undefined

    const handleContextLost = (event) => {
      event.preventDefault()
      setSceneError('The graphics context was interrupted. Reload the Explorer to restore the 3D view.')
    }

    canvasElement.addEventListener('webglcontextlost', handleContextLost)
    return () => canvasElement.removeEventListener('webglcontextlost', handleContextLost)
  }, [canvasElement])

  // Handle floor transition with smooth vertical transit animation
  const handleTransit = useCallback((targetFloor) => {
    if (targetFloor === activeFloor) return
    setIsTransitioning(true)
    setTransitionTargetFloor(targetFloor)
    setTransitPrompt(null)

    setTimeout(() => {
      if (onChangeFloor) {
        onChangeFloor(targetFloor)
      } else {
        setInternalFloor(targetFloor)
      }
      setInternalSelected(null)
    }, 450)

    setTimeout(() => {
      setIsTransitioning(false)
      setTransitionTargetFloor(null)
    }, 1200)
  }, [activeFloor, onChangeFloor])

  // Store selection handler
  const handleSelectStore = useCallback((store) => {
    setInternalSelected(store)
    onSelectStore(store)
    if (store && store.floor !== activeFloor) {
      handleTransit(Number(store.floor))
    }
  }, [activeFloor, onSelectStore, handleTransit])

  const handleWalkToStore = useCallback((store) => {
    if (!store) return
    if (store.floor !== activeFloor) {
      handleSelectStore(store)
      return
    }
    controlsRef.current?.focusStore(store)
  }, [activeFloor, handleSelectStore])

  // Click on floor to walk there
  const handleFloorClick = useCallback((point) => {
    controlsRef.current?.moveToPoint(point)
  }, [])

  const handleReset = useCallback(() => {
    setInternalSelected(null)
    onSelectStore(null)
    controlsRef.current?.reset()
  }, [onSelectStore])

  const handleCanvasCreated = useCallback(({ gl }) => {
    setCanvasElement(gl.domElement)
  }, [])

  const handleSceneError = useCallback((error) => {
    setSceneError(error.message || 'An unexpected rendering error interrupted the 3D scene.')
  }, [])

  const reloadScene = useCallback(() => {
    window.location.reload()
  }, [])

  return (
    <div
      className={`walkthrough-container ${mode === 'preview' ? 'is-preview' : ''} ${className}`}
      style={{ height }}
    >
      {/* 3D Canvas Layer */}
      <div className="walkthrough-canvas-wrapper">
        <Suspense fallback={<LoadingScreen label="Constructing First-Person Walkthrough Environment" />}>
          <Canvas
            fallback={
              <div className="scene-error scene-error-unsupported" role="alert">
                <strong>3D view unavailable</strong>
                <span>This Explorer needs a browser with WebGL enabled.</span>
              </div>
            }
            onCreated={handleCanvasCreated}
            camera={{
              position: [0, floorY + 1.7, -11],
              fov: 68,
              near: 0.1,
              far: 140,
            }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            shadows
          >
            <color attach="background" args={['#d8d5cc']} />
            <SceneErrorBoundary onError={handleSceneError}>
              <ambientLight color="#fff8ee" intensity={1.15} />
              <directionalLight
                position={[0, floorY + 18, 10.5]}
                intensity={1.5}
                color="#fffcf2"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight
                position={[0, floorY + 10, -10]}
                intensity={0.75}
                color="#fbf4e6"
              />

              <WalkthroughControls
                ref={controlsRef}
                floor={activeFloor}
                selectedStore={selected}
                onPositionChange={setCurrentPos}
                onApproachTransit={setTransitPrompt}
                touchVector={touchVector}
              />

              <MallEnvironment
                floor={activeFloor}
                onNavigateFloor={handleTransit}
                onFloorClick={handleFloorClick}
              />

              {floorStores.map((store) => (
                <Storefront
                  key={store.id}
                  store={store}
                  floorY={floorY}
                  isSelected={selected?.id === store.id}
                  onSelect={handleSelectStore}
                />
              ))}

              {selected && (
                <WayfindingPath
                  targetStore={selected}
                  currentPos={currentPos}
                  floorY={floorY}
                />
              )}
            </SceneErrorBoundary>
          </Canvas>
        </Suspense>
        {sceneError && (
          <div className="scene-error" role="alert">
            <strong>The 3D mall could not continue rendering.</strong>
            <span>{sceneError}</span>
            <button type="button" onClick={reloadScene}>Reload the Explorer</button>
          </div>
        )}
      </div>

      {/* Synchronized Walkthrough HUD & Directional Interface */}
      <WalkthroughHUD
        floor={activeFloor}
        mode={mode}
        selectedStore={selected}
        onCloseStore={() => {
          setInternalSelected(null)
          onSelectStore(null)
        }}
        onWalkToStore={handleWalkToStore}
        transitPrompt={transitPrompt}
        onTransit={handleTransit}
        onReset={handleReset}
        onSetTouchVector={setTouchVector}
        isTransitioning={isTransitioning}
        transitionTargetFloor={transitionTargetFloor}
      />
    </div>
  )
}
