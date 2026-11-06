import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { stores, floorLabel, searchStores, categories } from '../../data/stores'
import { floors } from '../../data/floors'
import { floorName } from '../../data/floors'
import PageTransition from '../../components/layout/PageTransition'

export default function StoresPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [floor, setFloor] = useState(searchParams.get('floor') || 'All')

  const visible = useMemo(
    () => searchStores(query).filter((store) =>
      (category === 'All' || store.category === category)
      && (floor === 'All' || store.floor === Number(floor))
    ),
    [category, floor, query]
  )

  return (
    <PageTransition>
      <div className="directory-page">
        <header className="directory-hero">
          <div className="directory-hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" />THE ORION DIRECTORY</p>
            <h1>Good finds,<br /><em>on every floor.</em></h1>
            <p>From the first look to the last stop, find the right place across all six levels of Orion Mall Gorakhpur.</p>
          </div>
          <div className="directory-hero-art" aria-label={`${stores.length} listed destinations`}>
            <span className="directory-hero-count">{stores.length}<small>DESTINATIONS</small></span>
            <span className="directory-art-floor">G / F1 / F2 / F3 / F4 / F5</span>
          </div>
        </header>

        <section className="directory-content" aria-label="Store directory">
          <div className="directory-heading">
            <div>
              <span className="eyebrow">SHOP BY NAME, CATEGORY OR LEVEL</span>
              <h2>Every destination.<br /><em>One clear view.</em></h2>
            </div>
            <p>{visible.length} {visible.length === 1 ? 'result' : 'results'} from the supplied directory</p>
          </div>

          <div className="directory-toolbar">
            <label className="directory-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a store, category or description"
                aria-label="Search stores"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search" type="button">
                  <X size={17} />
                </button>
              )}
            </label>
            <label className="directory-filter">
              <span>FLOOR</span>
              <select value={floor} onChange={(event) => setFloor(event.target.value)}>
                <option value="All">All levels</option>
                {floors.map((item) => (
                  <option value={item.number} key={item.id}>{item.label} · {item.name}</option>
                ))}
              </select>
            </label>
            <label className="directory-filter">
              <span>CATEGORY</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="directory-floor-summary">
            {floors.map((item) => {
              const count = visible.filter((store) => store.floor === item.number).length
              return (
                <button
                  type="button"
                  key={item.id}
                  className={floor === String(item.number) ? 'active' : ''}
                  onClick={() => setFloor(floor === String(item.number) ? 'All' : String(item.number))}
                >
                  <span>{item.label}</span>
                  <strong>{item.name}</strong>
                  <small>{count} {count === 1 ? 'place' : 'places'}</small>
                </button>
              )
            })}
          </div>

          <div className="directory-card-grid">
            {visible.map((store) => (
              <Link className="directory-store-card" to={`/store?slug=${store.slug}`} key={store.id}>
                <div className="directory-card-top">
                  <span className="directory-card-mark">{store.brand.slice(0, 1)}</span>
                  <span className="directory-card-floor">{floorLabel(store.floor)} · {floorName(store.floor)}</span>
                  <ArrowUpRight size={17} />
                </div>
                <span className="directory-row-category">{store.category}</span>
                <strong>{store.brand}</strong>
                <p>{store.description}</p>
              </Link>
            ))}
            {visible.length === 0 && (
              <div className="empty-directory">
                <Search size={28} />
                <p>No destinations match those filters.</p>
                <button type="button" onClick={() => { setQuery(''); setCategory('All'); setFloor('All') }}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
