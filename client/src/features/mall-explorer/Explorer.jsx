import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Compass, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
import { floors, floorLabel } from '../../data/floors'
import { stores, findStore, searchStores, categories } from '../../data/stores'
import MallScene from '../../components/3d/MallScene'
import LoadingScreen from '../../components/layout/LoadingScreen'
import Button from '../../components/common/Button'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import './explorer.css'

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const routeStoreSlug = searchParams.get('store')
  const routeStore = routeStoreSlug ? findStore(routeStoreSlug) : null

  const [floor, setFloor] = useState(() => (routeStore ? Number(routeStore.floor) : 0))
  const [selected, setSelected] = useState(routeStore || null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [focusKey, setFocusKey] = useState(0)

  const matches = useMemo(() => searchStores(query), [query])
  const filtered = useMemo(() => {
    return matches.filter(
      (s) =>
        (category === 'All' || s.category === category) &&
        s.floor === Number(floor)
    )
  }, [matches, category, floor])

  const activeStore = routeStore || selected
  const activeFloor = routeStore ? Number(routeStore.floor) : floor

  const selectStore = (store) => {
    setSearchParams({ store: store.slug })
    setFloor(Number(store.floor))
    setSelected(store)
    setQuery('')
    setCategory('All')
    setFocusKey((v) => v + 1)
  }

  const changeFloor = (number) => {
    setSearchParams({})
    setFloor(number)
    setSelected(null)
    setQuery('')
    setCategory('All')
  }

  const closeStore = () => {
    setSearchParams({})
    setSelected(null)
  }

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') {
        closeStore()
      }
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [closeStore])

  const floorInfo = floors.find((f) => f.number === activeFloor)

  return (
    <div className="explore-page">
      <div className="explore-header">
        <div className="explore-header-copy">
          <p className="eyebrow"><span className="eyebrow-line" />THE ORION MALL EXPLORER</p>
          <h1>Find your<br /><em>way around.</em></h1>
          <p className="explore-header-copy-text">
            Choose a level, discover a destination, and get closer to where you want to be.
          </p>
        </div>
        <div className="explore-header-actions">
          <Button variant="outline" onClick={() => setSearchParams({})}>
            <X size={14} /> Clear selection
          </Button>
        </div>
      </div>

      <div className="explorer-workspace">
        <aside className="explorer-rail">
          <span className="rail-caption">CHOOSE A LEVEL</span>
          <div className="rail-floors" aria-label="Mall floors">
            {floors.map((item) => (
              <button
                key={item.number}
                className={activeFloor === item.number ? 'active' : ''}
                onClick={() => changeFloor(item.number)}
                aria-pressed={activeFloor === item.number}
              >
                <b>{item.label}</b>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
          <div className="floor-description">
            <span>{floorLabel(activeFloor)} / ORION</span>
            <p>{floorInfo?.description}</p>
            {floorInfo?.image && (
              <div className="floor-preview">
                <ImageWithFallback
                  src={floorInfo.image}
                  alt={`${floorInfo.name} floor`}
                  className="floor-preview-image"
                />
              </div>
            )}
          </div>
          <div className="interaction-guide">
            <span className="rail-caption">A QUICK GUIDE</span>
            <p><i>01</i>Drag to look around</p>
            <p><i>02</i>Click a storefront</p>
            <p><i>03</i>Choose a floor to travel</p>
            <small>On touchscreens, swipe across the scene. Press Esc to close details.</small>
          </div>
          <div className="rail-footer">
            <Button variant="ghost" size="small" onClick={() => setFocusKey((v) => v + 1)}>
              <Compass size={14} /> Reset view
            </Button>
          </div>
        </aside>

        <section className="explorer-scene-shell" aria-label="Interactive three-dimensional mall directory">
          <div className="explorer-scene-top">
            <span><MapPin size={14} />{floorInfo?.name} LEVEL</span>
            <span>GORAKHPUR &middot; INDIA</span>
          </div>
          <div className="explorer-toolbar">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Find a store or category"
              ariaLabel="Search stores in the explorer"
            />
            <button className="toolbar-filters" onClick={() => {}}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
          <div className="explorer-search-results">
            {query && (
              <div className="search-list">
                {matches.length ? (
                  matches.slice(0, 8).map((store) => (
                    <button
                      key={store.id}
                      onClick={() => selectStore(store)}
                      className={store.id === activeStore?.id ? 'active' : ''}
                    >
                      <span>
                        <strong>{store.name}</strong>
                        <small>{store.category}</small>
                      </span>
                      <span>{floorLabel(store.floor)} <ArrowRight size={12} /></span>
                    </button>
                  ))
                ) : (
                  <p>No destinations match that search.</p>
                )}
              </div>
            )}
          </div>
          <Suspense fallback={<LoadingScreen label="Opening the mall" />}>
            <MallScene
              stores={stores}
              floors={floors}
              floor={activeFloor}
              selectedStore={activeStore}
              onSelectStore={selectStore}
              focusKey={focusKey}
            />
          </Suspense>
          <div className="explorer-scene-hint">
            <span className="drag-icon">&#8596;</span>DRAG TO LOOK AROUND
            <span className="hint-dot" />
            CLICK A STOREFRONT
          </div>
          {activeStore && (
            <StorePanel
              store={activeStore}
              onClose={closeStore}
              onNavigate={() => setFocusKey((v) => v + 1)}
              onSelectStore={selectStore}
            />
          )}
          <span className="scene-illustrative-label">
            CONCEPTUAL 3D DIRECTORY &middot; FLOOR LAYOUTS ARE ILLUSTRATIVE
          </span>
        </section>
      </div>

      <div className="explorer-directory">
        <div className="directory-header">
          <h2>Destinations on {floorInfo?.name}</h2>
          <div className="directory-controls">
            <span className="filter-label">CATEGORY</span>
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? 'active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="directory-count">
          <span>DESTINATIONS / {String(filtered.length).padStart(2, '0')}</span>
          <span>{floorLabel(activeFloor)} FLOOR</span>
        </div>
        <div className="directory-list">
          {filtered.map((store) => (
            <a
              key={store.id}
              href={`/stores/${store.slug}`}
              className={`directory-row ${store.id === activeStore?.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                selectStore(store)
              }}
            >
              <div className="directory-row-thumb">
                <ImageWithFallback
                  src={store.image}
                  alt={store.name}
                  className="directory-row-thumb-image"
                />
              </div>
              <div className="directory-row-info">
                <strong>{store.name}</strong>
                <span>{store.category} &middot; {store.unit}</span>
              </div>
              <div className="directory-row-floor">
                <b>{floorLabel(store.floor)}</b>
                <small>{store.floor === activeFloor ? 'This floor' : 'Another level'}</small>
              </div>
              <ArrowRight size={13} />
            </a>
          ))}
          {filtered.length === 0 && (
            <div className="empty-directory">
              <Search size={28} />
              <p>No destinations on this level match your filters.</p>
              <Button variant="ghost" onClick={() => { setQuery(''); setCategory('All'); setFloor('All') }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="explorer-bottom-note">
        <span>&#10033;</span>
        <p>
          This is a conceptual preview, not a measured mall plan. Store names, floor labels, and
          locations are illustrative content for this frontend.
        </p>
      </div>
    </div>
  )
}

function SearchBar({ value, onChange, placeholder, ariaLabel }) {
  return (
    <div className="search-bar-wrap">
      <Search size={17} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  )
}

function StorePanel({ store, onClose, onNavigate, onSelectStore }) {
  const related = stores.filter(
    (s) => s.floor === store.floor && s.id !== store.id
  ).slice(0, 3)

  return (
    <aside className="explorer-store-panel">
      <button className="panel-dismiss" onClick={onClose} aria-label="Close store details">
        <X size={20} />
      </button>
      <span className="eyebrow">YOUR NEXT STOP</span>
      <span className="store-panel-category">{store.category} &middot; {floorLabel(store.floor)}</span>
      <h2>{store.name}</h2>
      <p>{store.description}</p>
      <span className="panel-location"><MapPin size={14} />{store.unit} &middot; {store.floor}</span>
      <div className="store-panel-actions">
        <Button variant="dark" asChild component="a" href={`/stores/${store.slug}`}>
          View details
        </Button>
        <Button variant="outline" onClick={onNavigate}>
          <Compass size={14} /> Navigate to store
        </Button>
      </div>
      <div className="related-stores">
        <span>ALSO ON THIS FLOOR</span>
        {related.map((s) => (
          <button key={s.id} onClick={() => onSelectStore(s)}>
            {s.name}<ArrowRight size={12} />
          </button>
        ))}
      </div>
    </aside>
  )
}
