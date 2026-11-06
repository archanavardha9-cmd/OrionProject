import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Layers,
  X,
} from 'lucide-react'
import { floorLabel, floorName } from '../../data/floors'

export default function WalkthroughHUD({
  floor = 0,
  mode = 'full',
  selectedStore = null,
  onCloseStore = () => {},
  transitPrompt = null,
  onTransit = () => {},
  onReset = () => {},
  onSetTouchVector = () => {},
  isTransitioning = false,
  transitionTargetFloor = null,
}) {
  const isPreview = mode === 'preview'
  const currentFloorLabel = floorLabel(floor)
  const currentFloorName = floorName(floor)

  const setTouchDirection = (direction) => {
    const directions = {
      forward: { x: 0, y: 1 },
      backward: { x: 0, y: -1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }
    onSetTouchVector(directions[direction])
  }

  if (isPreview) {
    return (
      <div className="walkthrough-hud walkthrough-hud-preview">
        <div className="walkthrough-location-badge">
          <span className="location-dot" />
          <span className="location-text">{currentFloorLabel} &middot; {currentFloorName}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="walkthrough-hud">
      <div className="walkthrough-topbar">
        <div className="walkthrough-location-badge">
          <span className="location-dot" />
          <span className="location-text">{currentFloorLabel} &middot; {currentFloorName}</span>
          <span className="location-sub">ORION MALL</span>
        </div>
        <button className="hud-btn" onClick={onReset} type="button">
          <Compass size={14} />
          Reset view
        </button>
      </div>

      {transitPrompt && !isTransitioning && (
        <button
          className="walkthrough-transit-prompt"
          onClick={() => onTransit(transitPrompt.targetFloor)}
          type="button"
        >
          <Layers size={16} />
          <strong>{transitPrompt.label}</strong>
          <span>Ride</span>
          <ArrowRight size={14} />
        </button>
      )}

      {isTransitioning && (
        <div className="floor-transition-curtain" role="status">
          <Layers size={32} className="transit-icon-spin" />
          <h2 className="transit-title">
            Arriving at {floorLabel(transitionTargetFloor)} &middot; {floorName(transitionTargetFloor)}
          </h2>
        </div>
      )}

      {selectedStore && (
        <aside
          key={selectedStore.id}
          className="walkthrough-store-popup"
          role="dialog"
          aria-label={`${selectedStore.brand || selectedStore.name} details`}
        >
          <div className="popup-header">
            <span className="popup-eyebrow">{selectedStore.category}</span>
            <button className="popup-close" onClick={onCloseStore} aria-label="Close destination details" type="button">
              <X size={16} />
            </button>
          </div>
          <h2 className="popup-title">{selectedStore.brand || selectedStore.name}</h2>
          <div className="popup-meta">
            <span>{floorLabel(selectedStore.floor)} &middot; {floorName(selectedStore.floor)}</span>
            {selectedStore.type && <span className="popup-unit">{selectedStore.type}</span>}
          </div>
          {selectedStore.description && <p className="popup-desc">{selectedStore.description}</p>}
          <div className="popup-actions">
            <button type="button" className="popup-walk-btn" onClick={onCloseStore}>
              Keep exploring
            </button>
            <Link
              to={`/stores?slug=${selectedStore.slug}&from=explore&store=${selectedStore.slug}`}
              className="popup-details-link"
              aria-label={`Open ${selectedStore.brand || selectedStore.name} in Stores`}
            >
              Open in Stores
              <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      )}

      <div className="walkthrough-bottombar">
        <p className="walkthrough-instruction-pill">
          <span className="instruction-keys">
            <span className="kbd-badge">W</span>
            <span className="kbd-badge">A</span>
            <span className="kbd-badge">S</span>
            <span className="kbd-badge">D</span>
          </span>
          <span>Cursor / touch-drag to look &middot; WASD to walk &middot; Select a storefront</span>
        </p>
        <div className="mobile-touch-cluster" aria-label="Walk controls">
          <button className="touch-control-btn" onPointerDown={() => setTouchDirection('left')} onPointerUp={() => onSetTouchVector({ x: 0, y: 0 })} onPointerCancel={() => onSetTouchVector({ x: 0, y: 0 })} aria-label="Walk left" type="button">
            <ChevronLeft size={20} />
          </button>
          <div className="touch-control-column">
            <button className="touch-control-btn" onPointerDown={() => setTouchDirection('forward')} onPointerUp={() => onSetTouchVector({ x: 0, y: 0 })} onPointerCancel={() => onSetTouchVector({ x: 0, y: 0 })} aria-label="Walk forward" type="button">
              <ChevronUp size={20} />
            </button>
            <button className="touch-control-btn" onPointerDown={() => setTouchDirection('backward')} onPointerUp={() => onSetTouchVector({ x: 0, y: 0 })} onPointerCancel={() => onSetTouchVector({ x: 0, y: 0 })} aria-label="Walk backward" type="button">
              <ChevronDown size={20} />
            </button>
          </div>
          <button className="touch-control-btn" onPointerDown={() => setTouchDirection('right')} onPointerUp={() => onSetTouchVector({ x: 0, y: 0 })} onPointerCancel={() => onSetTouchVector({ x: 0, y: 0 })} aria-label="Walk right" type="button">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
