import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpRight, Coffee, Utensils } from 'lucide-react'
import { diningCategories, searchDining } from '../../data/dining'
import { floors, floorLabel } from '../../data/floors'
import { mallInfo } from '../../data/mallInfo'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import Button from '../../components/common/Button'
import PageTransition from '../../components/layout/PageTransition'

export default function DiningPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [floor, setFloor] = useState('All')

  const visible = useMemo(() => {
    return searchDining(query).filter((s) => {
      if (category !== 'All' && s.category !== category) return false
      if (floor !== 'All' && Number(s.floor) !== Number(floor)) return false
      return true
    })
  }, [query, category, floor])

  return (
    <PageTransition>
      <div className="dining-page">
        <section className="destination-hero dining-destination">
          <div className="destination-copy">
            <p className="eyebrow"><span className="eyebrow-line" />GOOD FOOD, GOOD COMPANY</p>
            <h1>A table for<br /><em>every mood.</em></h1>
            <p>Slow coffee, long lunches, a little something sweet. Find the flavour that feels right today.</p>
            <div className="destination-meta">
              <span><Coffee size={15} /> CAF&eacute;S &amp; COFFEE</span>
              <span><Utensils size={15} /> RESTAURANTS</span>
            </div>
          </div>
          <div className="dining-hero-art">
            <ImageWithFallback
              src="/images/dining/restaurant.webp"
              alt="Dining destinations at Orion Mall"
              className="dining-hero-image"
            />
            <span className="dining-hero-tag">COME AS YOU ARE / STAY A LITTLE</span>
          </div>
        </section>

        <section className="destination-content">
          <div className="section-title">
            <div>
              <p className="eyebrow">SOMETHING GOOD IS WAITING</p>
              <h2>Pull up<br /><em>a chair.</em></h2>
            </div>
            <p className="section-blurb">Explore our dining destinations, from a quick pick-me-up to a meal worth making time for.</p>
          </div>
          <div className="directory-toolbar">
            <div className="directory-search">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a restaurant or caf&eacute;"
                aria-label="Search dining"
              />
            </div>
            <label className="directory-floor">
              FLOOR
              <select value={floor} onChange={(e) => setFloor(e.target.value)}>
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
            {diningCategories.map((item) => (
              <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="directory-result-count">
            <span>VENUES / {String(visible.length).padStart(2, '0')}</span>
            <span>{floor === 'All' ? 'ALL FLOORS' : `${floorLabel(floor)} FLOOR`}</span>
          </div>
          <div className="dining-venue-list">
            {visible.map((venue, index) => (
              <Link key={venue.id} to={`/stores/${venue.slug}`} className="dining-venue">
                <span className="dining-venue-count">0{index + 1}</span>
                <span className="venue-art">
                  <ImageWithFallback
                    src={venue.image}
                    alt={venue.name}
                    className="venue-art-image"
                  />
                </span>
                <span className="dining-venue-name">
                  {venue.name}
                  <small>{venue.category} &middot; {floorLabel(venue.floor)} &middot; {venue.unit}</small>
                </span>
                <span className="round-arrow"><ArrowUpRight size={17} /></span>
              </Link>
            ))}
            {visible.length === 0 && (
              <div className="empty-directory">
                <Search size={28} />
                <p>No dining venues match your filters.</p>
                <Button variant="ghost" onClick={() => { setQuery(''); setCategory('All'); setFloor('All') }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          <p className="page-disclaimer">{mallInfo.note}</p>
        </section>

        <div className="dining-note-strip">
          <span>&lowast;</span>
          <p>Good food is better together.</p>
          <Link to="/visit">Plan your visit <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </PageTransition>
  )
}
