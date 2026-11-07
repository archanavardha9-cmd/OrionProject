import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, Layers3, Search, X } from 'lucide-react'
import { floors, floorLabel } from '../../data/floors'
import { stores, findStore, searchStores } from '../../data/stores'
import MallWalkthrough from '../../components/3d/MallWalkthrough'
import './explorer.css'

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const routeStore = findStore(searchParams.get('store'))
  const [floor, setFloor] = useState(() => routeStore?.floor ?? 0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const activeFloor = routeStore?.floor ?? floor
  const floorInfo = floors.find((item) => item.number === activeFloor)

  const floorStores = useMemo(
    () => stores.filter((store) => store.floor === activeFloor),
    [activeFloor]
  )
  const floorCategories = useMemo(
    () => ['All', ...new Set(floorStores.map((store) => store.category))],
    [floorStores]
  )
  const visibleStores = useMemo(() => {
    if (query.trim()) return searchStores(query)
    return floorStores.filter((store) => category === 'All' || store.category === category)
  }, [category, floorStores, query])
  const highlightedStoreIds = useMemo(
    () => category !== 'All' || query.trim()
      ? visibleStores.filter((store) => store.floor === activeFloor).map((store) => store.id)
      : [],
    [activeFloor, category, query, visibleStores]
  )

  const selectStore = (store) => {
    if (!store) {
      setSearchParams({}, { replace: true })
      return
    }
    setFloor(store.floor)
    setCategory('All')
    setQuery('')
    setSearchParams({ store: store.slug })
  }

  const changeFloor = (nextFloor) => {
    setSearchParams({}, { replace: true })
    setFloor(nextFloor)
    setCategory('All')
    setQuery('')
  }

  const clearSelection = () => setSearchParams({}, { replace: true })

  return (
    <div className="mall-explorer-page">
      <header className="mall-explorer-header">
        <div className="mall-explorer-header-copy">
          <p className="mall-explorer-eyebrow">ORION MALL <span /> {floors.length} LEVELS</p>
          <h1>Find your next stop.</h1>

          <p>Move your cursor to look around, choose a floor, then select a storefront or directory result to find a destination.</p>
        </div>
            <Link to="/stores" className="mall-explorer-directory-link">
              Stores <ArrowUpRight size={17} />
            </Link>

      </header>

      <section className="mall-explorer-shell" aria-label="Interactive mall explorer">
        <div className="mall-explorer-toolbar">
          <button
            className="mall-explorer-directory-toggle"
            type="button"
            aria-expanded={sidebarOpen}
            aria-controls="mall-explorer-directory"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            {sidebarOpen ? <ChevronLeft size={18} aria-hidden="true" /> : <ChevronRight size={18} aria-hidden="true" />}
            <span>{sidebarOpen ? 'Hide directory' : 'Show directory'}</span>
          </button>
          <div className="mall-explorer-floor-summary">
            <span className="mall-explorer-level">{floorLabel(activeFloor)}</span>
            <p>{floorInfo?.name}<span>&middot;</span>{floorInfo?.wing}</p>
          </div>
          <span className="mall-explorer-count">{floorStores.length} destinations</span>
        </div>

        <div className={`mall-explorer-workspace ${sidebarOpen ? '' : 'directory-collapsed'}`}>
          <aside
            id="mall-explorer-directory"
            className="mall-explorer-directory"
            aria-label="Shop directory"
            aria-hidden={!sidebarOpen}
            inert={!sidebarOpen}
          >
            <div className="mall-directory-panel-heading">
              <div>
                <span className="mall-directory-panel-kicker">{floorLabel(activeFloor)} FLOOR</span>
                <h2>Find a place</h2>
              </div>
              <Layers3 size={20} aria-hidden="true" />
            </div>
            <nav className="mall-explorer-floor-tabs" aria-label="Choose a mall floor">
              {floors.map((item) => (
                <button
                  key={item.id}
                  className={activeFloor === item.number ? 'active' : ''}
                  onClick={() => changeFloor(item.number)}
                  aria-pressed={activeFloor === item.number}
                  type="button"
                >
                  <span className="mall-floor-level-label">{item.label}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
            <label className="mall-directory-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search all stores"
                aria-label="Search all stores"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search" type="button">
                  <X size={15} />
                </button>
              )}
            </label>
            <div className="mall-directory-categories" aria-label="Categories on this floor">
              {floorCategories.map((item) => (
                <button
                  key={item}
                  className={category === item ? 'active' : ''}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mall-directory-result-count">
              {visibleStores.length} {visibleStores.length === 1 ? 'destination' : 'destinations'}
              {query && <span> across all floors</span>}
            </p>
            <div className="mall-directory-shop-list">
              {visibleStores.map((store) => (
                <button
                  key={store.id}
                  className={`mall-directory-shop ${routeStore?.id === store.id ? 'selected' : ''}`}
                  onClick={() => selectStore(store)}
                  type="button"
                >
                  <span className="mall-directory-shop-name">{store.brand}</span>
                  <span className="mall-directory-shop-meta">{store.category}</span>
                  <span className="mall-directory-shop-floor">
                    {floorLabel(store.floor)} <ArrowUpRight size={13} />
                  </span>
                </button>
              ))}
              {visibleStores.length === 0 && (
                <p className="mall-directory-empty">No destinations match this search.</p>
              )}
            </div>
          </aside>

          <div className="mall-explorer-scene-wrap">
            <div className="mall-explorer-scene-note">
              <span className="scene-note-dot" />
              Interactive 3D mall · storefront positions are illustrative
            </div>
            <section className="mall-explorer-stage" aria-label={`${floorInfo?.name} architectural walkthrough`}>
              <MallWalkthrough
                floor={activeFloor}
                selectedStore={routeStore}
                highlightedStoreIds={highlightedStoreIds}
                onSelectStore={(store) => store ? selectStore(store) : clearSelection()}
                onChangeFloor={changeFloor}
                mode="full"
                height="100%"
              />
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}
