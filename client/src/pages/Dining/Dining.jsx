import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, Utensils } from 'lucide-react'
import { dining, diningCategories, searchDining } from '../../data/dining'
import { floors, floorLabel, floorName } from '../../data/floors'
import PageTransition from '../../components/layout/PageTransition'

export default function DiningPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [floor, setFloor] = useState('All')

  const visible = useMemo(
    () => searchDining(query).filter((store) =>
      (category === 'All' || store.category === category)
      && (floor === 'All' || store.floor === Number(floor))
    ),
    [category, floor, query]
  )

  return (
    <PageTransition>
      <div className="dining-page">
        <section className="destination-hero dining-destination">
          <div className="destination-copy">
            <p className="eyebrow"><span className="eyebrow-line" />A GOOD REASON TO GATHER</p>
            <h1>Make room<br /><em>for something good.</em></h1>
            <p>Quick bites on F3, cafes on F4, and a lounge above it all. Find your table across three dining levels.</p>
            <div className="destination-meta">
              <span><Utensils size={16} /> {dining.length} DINING DESTINATIONS</span>
              <span>F3 / F4 / F5</span>
            </div>
          </div>
          <div className="dining-hero-art">
            <img src="/images/dining/foodcourt.webp" alt="The central atrium at Orion Mall" className="dining-hero-image" />
            <span className="dining-hero-tag">QUICK BITES TO LINGER-LONGER MEALS</span>
          </div>
        </section>

        <section className="destination-content" aria-label="Dining directory">
          <div className="section-title">
            <div>
              <p className="eyebrow">THE DINING DIRECTORY</p>
              <h2>Find your<br /><em>kind of table.</em></h2>
            </div>
            <p className="section-blurb">Every venue here comes from the same floor-by-floor directory.</p>
          </div>
          <div className="directory-toolbar">
            <label className="directory-search">
              <Search size={18} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dining destinations" aria-label="Search dining" />
            </label>
            <label className="directory-filter">
              <span>FLOOR</span>
              <select value={floor} onChange={(event) => setFloor(event.target.value)}>
                <option value="All">All dining floors</option>
                {floors.filter((item) => dining.some((store) => store.floor === item.number)).map((item) => (
                  <option value={item.number} key={item.id}>{item.label} · {item.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="directory-categories">
            {diningCategories.map((item) => (
              <button type="button" className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="dining-venue-grid">
            {visible.map((store, index) => (
              <Link key={store.id} to={`/stores?slug=${store.slug}`} className={`dining-venue dining-venue-${index % 3}`}>
                <span className="dining-venue-count">{floorLabel(store.floor)}</span>
                <span className="dining-venue-type">{store.category}</span>
                <strong>{store.brand}</strong>
                <p>{store.description}</p>
                <small>{floorName(store.floor)}</small>
                <span className="round-arrow"><ArrowUpRight size={17} /></span>
              </Link>
            ))}
            {visible.length === 0 && <p className="empty-directory">No dining destinations match those filters.</p>}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
