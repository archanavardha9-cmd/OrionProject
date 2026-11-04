import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, List, Search, X } from 'lucide-react'
import { floors, floorLabel } from '../../data/floors'
import { stores, findStore, searchStores } from '../../data/stores'
import MallWalkthrough from '../../components/3d/MallWalkthrough'
import './explorer.css'

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const routeStoreSlug = searchParams.get('store')
  const routeStore = routeStoreSlug ? findStore(routeStoreSlug) : null
  const [floor, setFloor] = useState(() => (routeStore ? Number(routeStore.floor) : 0))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [directoryOpen, setDirectoryOpen] = useState(false)

  const activeFloor = routeStore ? Number(routeStore.floor) : floor
  const activeStore = routeStore
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
    const matches = searchStores(query)
    return matches.filter((store) =>
      store.floor === activeFloor && (category === 'All' || store.category === category)
    )
  }, [query, activeFloor, category])

  const closeStore = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const selectStore = useCallback((store) => {
    if (!store) {
      closeStore()
      return
    }
    setSearchParams({ store: store.slug })
    setFloor(Number(store.floor))
    setCategory(store.category)
    setDirectoryOpen(false)
  }, [closeStore, setSearchParams])

  const changeFloor = useCallback((nextFloor) => {
    setSearchParams({}, { replace: true })
    setFloor(Number(nextFloor))
    setCategory('All')
    setQuery('')
  }, [setSearchParams])

  return (
    <div className="mall-explorer-page">
      <header className="mall-explorer-header">
        <div className="mall-explorer-header-copy">
          <p className="mall-explorer-eyebrow">ORION MALL <span /> INTERACTIVE DIRECTORY</p>
          <h1>Explore the mall<span>.</span></h1>
          <p>Choose a level, look around, and find a shop. This concept walkthrough uses sample directory data.</p>
        </div>
        <Link to="/stores" className="mall-explorer-directory-link">
          Store directory <ArrowUpRight size={16} />
        </Link>
      </header>

      <nav className="mall-explorer-floor-tabs" aria-label="Choose a mall floor">
        {floors.map((item) => (
          <button
            key={item.id}
            className={activeFloor === item.number ? 'active' : ''}
            onClick={() => changeFloor(item.number)}
            aria-pressed={activeFloor === item.number}
          >
            <span className="mall-floor-level-label">{item.label}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <section className="mall-explorer-shell" aria-label="Interactive mall explorer">
        <div className="mall-explorer-toolbar">
          <button
            className={`mall-explorer-directory-toggle ${directoryOpen ? 'active' : ''}`}
            onClick={() => setDirectoryOpen((open) => !open)}
            aria-expanded={directoryOpen}
            aria-controls="explorer-directory-panel"
            type="button"
          >
            {directoryOpen ? <X size={16} /> : <List size={16} />}
            {directoryOpen ? 'Close directory' : 'Browse shops'}
            <span>{floorStores.length}</span>
          </button>
          <p>{floorInfo?.name} <span>&middot;</span> {floorInfo?.wing}</p>
        </div>

        <div className={`mall-explorer-workspace ${directoryOpen ? 'directory-open' : ''}`}>
          <section className="mall-explorer-stage" aria-label={`${floorInfo?.name} 3D mall walkthrough`}>
            <MallWalkthrough
              floor={activeFloor}
              selectedStore={activeStore}
              onSelectStore={selectStore}
              onChangeFloor={changeFloor}
              mode="full"
              height="100%"
            />
          </section>

          {directoryOpen && (
            <aside className="mall-explorer-directory" id="explorer-directory-panel" aria-label="Shop directory">
              <div className="mall-directory-panel-heading">
                <div>
                  <span className="mall-directory-panel-kicker">{floorLabel(activeFloor)} FLOOR</span>
                  <h2>Find a shop</h2>
                </div>
                <button onClick={() => setDirectoryOpen(false)} aria-label="Close directory" type="button">
                  <X size={18} />
                </button>
              </div>
              <label className="mall-directory-search">
                <Search size={16} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search shops or categories"
                  aria-label="Search shops on this floor"
                />
              </label>
              <div className="mall-directory-categories" aria-label="Shop categories">
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
              </p>
              <div className="mall-directory-shop-list">
                {visibleStores.map((store) => (
                  <button
                    key={store.id}
                    className={`mall-directory-shop ${activeStore?.id === store.id ? 'selected' : ''}`}
                    onClick={() => selectStore(store)}
                    type="button"
                  >
                    <span className="mall-directory-shop-name">{store.name}</span>
                    <span className="mall-directory-shop-meta">{store.category} <span>&middot;</span> {store.unit}</span>
                    <span className="mall-directory-shop-floor">{floorLabel(store.floor)}</span>
                  </button>
                ))}
                {visibleStores.length === 0 && (
                  <p className="mall-directory-empty">No destinations match this search on {floorInfo?.name}.</p>
                )}
              </div>
              <p className="mall-directory-data-note">Shop and location details are conceptual sample data.</p>
            </aside>
          )}
        </div>
      </section>
    </div>
  )
}
