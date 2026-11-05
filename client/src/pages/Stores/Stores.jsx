import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, ArrowUpRight } from 'lucide-react'
import { stores, floorLabel, searchStores, categories } from '../../data/stores'
import { floors } from '../../data/floors'
import { mallInfo } from '../../data/mallInfo'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import Button from '../../components/common/Button'
import SectionHeading from '../../components/common/SectionHeading'
import PageTransition from '../../components/layout/PageTransition'

export default function StoresPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [floor, setFloor] = useState('All')

  const term = searchParams.get('q') || query
  const cat = searchParams.get('category') || category
  const fl = searchParams.get('floor') || floor

  const visible = useMemo(() => {
    return searchStores(term).filter((s) => {
      if (cat !== 'All' && s.category !== cat) return false
      if (fl !== 'All' && Number(s.floor) !== Number(fl)) return false
      return true
    })
  }, [term, cat, fl])

  const categoriesList = ['All', ...categories.filter((c) => c !== 'All')]

  return (
    <PageTransition>
      <div className="directory-page">
        <div className="directory-hero">
          <div>
            <SectionHeading
              eyebrow="THE ORION DIRECTORY"
              title={<>Find your<br /><em>favourite.</em></>}
              copy="Search a name, choose a category or floor, and follow your own kind of day."
            />
          </div>
          <div className="directory-hero-art">
            <ImageWithFallback
              src="/images/mall/atrium.webp"
              alt="Orion Mall atrium directory preview"
              className="directory-hero-image"
            />
            <span className="directory-hero-count">
              {stores.length}<br />
              <small>DESTINATIONS</small>
            </span>
          </div>
        </div>

        <div className="directory-content">
          <div className="directory-scene-intro">
            <div>
              <span className="eyebrow">A PLACE FOR EVERY POINT OF VIEW</span>
              <h2>Walk the<br /><em>shopfronts.</em></h2>
            </div>
            <p>Browse a visual first look at the retail mix, then filter the directory by category and floor.</p>
          </div>

          <div className="directory-storefront-stage">
            {stores.slice(0, 3).map((store, index) => (
              <Link
                key={store.id}
                to={`/stores/${store.slug}`}
                className={`directory-stage-link directory-stage-link-${index}`}
              >
                <span>0{index + 1} &middot; {floorLabel(store.floor)}</span>
                <strong>{store.name}</strong>
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>

          <div className="directory-toolbar">
            <div className="directory-search">
              <Search size={18} />
              <input
                value={term}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a store, category, or idea"
                aria-label="Search stores"
              />
              {term && (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  &times;
                </button>
              )}
            </div>
            <label className="directory-floor">
              FLOOR
              <select
                value={fl}
                onChange={(e) => setFloor(e.target.value)}
              >
                <option value="All">All levels</option>
                {floors.map((item) => (
                  <option value={item.number} key={item.number}>
                    {item.label} &middot; {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="directory-categories">
            {categoriesList.map((item) => (
              <button
                className={cat === item ? 'active' : ''}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="directory-result-count">
            <span>DESTINATIONS / {String(visible.length).padStart(2, '0')}</span>
            <span>{fl === 'All' ? 'ALL FLOORS' : `${floorLabel(fl)} FLOOR`}</span>
          </div>

          <div className="directory-list">
            {visible.map((store, index) => (
              <Link
                className="directory-row"
                to={`/stores/${store.slug}`}
                key={store.id}
              >
                <span className="directory-row-index">0{index + 1}</span>
                <span className="directory-row-name">
                  {store.name}
                  <small>{store.description}</small>
                </span>
                <span className="directory-row-category">{store.category}</span>
                <span className="directory-row-floor">
                  <b>{floorLabel(store.floor)}</b>
                  <small>{store.location || store.unit}</small>
                </span>
                <ArrowUpRight className="directory-row-arrow" size={18} />
              </Link>
            ))}
            {!visible.length && (
              <div className="empty-directory">
                <Search size={28} />
                <p>No places found just yet.</p>
                <Button variant="ghost" onClick={() => { setQuery(''); setCategory('All'); setFloor('All') }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          <p className="directory-disclaimer">{mallInfo.note}</p>
        </div>
      </div>
    </PageTransition>
  )
}
