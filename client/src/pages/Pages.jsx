import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Clapperboard, Coffee,
  Compass, Gem, MapPin, ParkingCircle, Search, Shirt, Sparkles, Smartphone, Utensils,
} from 'lucide-react'
import { demoEvents, demoFloors, demoMall, demoOffers, demoServices, demoStores, floorLabel } from '../data'

const MallScene = lazy(() => import('../MallScene'))
const HeroScene = lazy(() => import('../three/HeroScene'))
const VisualStage = lazy(() => import('../three/VisualStage'))
const PageTransition = ({ children }) => <div className="page-transition route-enter">{children}</div>
const Reveal = ({ children, className = '', delay = 0 }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
    {children}
  </motion.div>
)
const SceneLoader = ({ label = 'Preparing the experience' }) => <div className="scene-loader" role="status"><span className="loader-orbit" />{label}</div>
const Visual = (props) => <Suspense fallback={<div className={`visual-stage visual-stage-fallback ${props.className || ''}`} aria-hidden="true" />}><VisualStage {...props} /></Suspense>
const categories = ['Fashion', 'Lifestyle', 'Beauty', 'Jewellery', 'Electronics', 'Dining', 'Entertainment']

function PageLead({ label, title, copy, light = false }) {
  return (
    <header className={`page-lead${light ? ' page-lead-light' : ''}`}>
      <p className="eyebrow"><span className="eyebrow-line" />{label}</p>
      <h1>{title}</h1>
      {copy && <p className="page-lead-copy">{copy}</p>}
    </header>
  )
}

function TextLink({ to, children, light = false }) {
  return <Link className={`text-link${light ? ' text-link-light' : ''}`} to={to}>{children}<ArrowUpRight size={16} /></Link>
}

function SectionTitle({ number, eyebrow, title, copy, to, linkLabel }) {
  return (
    <div className="section-title">
      <div><p className="eyebrow"><span className="eyebrow-line" />{eyebrow}</p><h2>{title}</h2></div>
      <div className="section-title-aside"><span className="section-number">{number}</span><p>{copy}</p>{to && <TextLink to={to}>{linkLabel}</TextLink>}</div>
    </div>
  )
}

function CategoryStage({ category }) {
  const visuals = {
    Fashion: { icon: Shirt, title: 'Find your point of view', color: '#b78f77', shape: 'sculpture-fashion' },
    Lifestyle: { icon: Sparkles, title: 'Small things, thoughtfully found', color: '#8b937e', shape: 'sculpture-lifestyle' },
    Beauty: { icon: Sparkles, title: 'Make a moment for yourself', color: '#bb9c78', shape: 'sculpture-beauty' },
    Jewellery: { icon: Gem, title: 'The details that stay with you', color: '#b59a61', shape: 'sculpture-jewellery' },
    Electronics: { icon: Smartphone, title: 'Meet what comes next', color: '#7c8b91', shape: 'sculpture-electronics' },
    Dining: { icon: Utensils, title: 'Make room for another course', color: '#a87659', shape: 'sculpture-dining' },
    Entertainment: { icon: Clapperboard, title: 'Stay for the good part', color: '#94756c', shape: 'sculpture-entertainment' },
  }
  const item = visuals[category] || visuals.Fashion
  return (
    <Visual className={`category-stage ${item.shape}`} variant="category" category={category} accent={item.color} label={`${category} discovery environment rendered in three dimensions`} />
  )
}

function StorefrontCard({ store, index = 0 }) {
  return (
    <Link className={`storefront-card storefront-card-${index % 3}`} to={`/stores/${store.slug}`} style={{ '--store-color': store.color || '#e68e79' }}>
      <Visual className="storefront-art" variant="storefront" accent={store.color} label={`Three-dimensional storefront environment for ${store.name}`} />
      <span className="storefront-signage">{store.name}</span>
      <span className="storefront-floor">{floorLabel(store.floor)} / {store.category}</span>
      <div className="storefront-caption"><div><span>{store.category}</span><h3>{store.name}</h3></div><span className="round-arrow"><ArrowUpRight size={17} /></span></div>
    </Link>
  )
}

function HomePage() {
  const [floor, setFloor] = useState(0)
  const [selected, setSelected] = useState(null)
  const [category, setCategory] = useState(categories[0])
  const featured = demoStores.slice(0, 3)
  const dining = demoStores.filter((store) => ['Dining', 'Café'].includes(store.category)).slice(0, 2)

  return (
    <PageTransition>
      <div className="home-page">
        <section className="home-hero">
          <div className="home-hero-visual" aria-hidden="true"><Suspense fallback={<div className="hero-3d-fallback" />}><HeroScene /></Suspense></div>
          <div className="hero-vignette" />
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" />A NEW WAY TO MEET</p>
            <h1><span>More Than Shopping.</span><br /><em>A World of Experiences.</em></h1>
            <p>Discover fashion, dining, entertainment, and unforgettable moments at Orion Mall Gorakhpur.</p>
            <div className="hero-actions"><Link className="button button-dark" to="/explore">Explore the Mall <ArrowUpRight size={16} /></Link><Link className="button button-quiet" to="/stores">Discover what’s inside <ArrowDownRight size={16} /></Link></div>
          </div>
          <div className="hero-coordinates"><span>26° 45' N</span><i /><span>83° 22' E</span></div>
          <div className="hero-side-caption">GORAKHPUR<br />A PLACE TO GATHER</div>
          <Link className="hero-scroll" to="/explore"><span>SCROLL TO DISCOVER</span><span className="scroll-line" /></Link>
        </section>

        <div className="ticker" aria-label="Orion Mall, a place to gather">
          <div className="ticker-track">{Array.from({ length: 4 }, (_, index) => <span key={index}>A PLACE TO GATHER <b>✳</b> GOOD THINGS HAPPEN HERE <b>✳</b> GORAKHPUR, INDIA <b>✳</b></span>)}</div>
        </div>

        <section className="preview-section page-gutter">
          <Reveal><SectionTitle number="01" eyebrow="STEP INSIDE" title={<>A little closer<br /><em>to everything.</em></>} copy="Take a first look around. Choose a level, find a storefront, and discover your own way through." to="/explore" linkLabel="Enter full explorer" /></Reveal>
          <Reveal delay={0.08}>
            <div className="preview-shell">
              <div className="preview-toolbar"><span><i className="live-dot" /> LIVE MALL PREVIEW</span><span>DRAG TO LOOK AROUND · SELECT A STOREFRONT</span><Link to="/explore">FULL EXPLORER <ArrowUpRight size={13} /></Link></div>
              <div className="preview-canvas">
                <Suspense fallback={<SceneLoader label="Building the atrium" />}><MallScene stores={demoStores} floors={demoFloors} floor={floor} selectedStore={selected} onSelectStore={setSelected} /></Suspense>
                <div className="preview-floor-selector" aria-label="Preview floor selector">{demoFloors.map((item) => <button key={item.number} className={floor === item.number ? 'active' : ''} onClick={() => { setFloor(item.number); setSelected(null) }} aria-pressed={floor === item.number}>{item.label}</button>)}</div>
                <div className="preview-location"><MapPin size={14} /><span>{demoFloors.find((item) => item.number === floor)?.name} · Gorakhpur</span></div>
                {selected && <div className="preview-selection"><button aria-label="Close selected store" onClick={() => setSelected(null)}>×</button><span>{selected.category} · {floorLabel(selected.floor)}</span><strong>{selected.name}</strong><Link to={`/stores/${selected.slug}`}>Discover store <ArrowUpRight size={14} /></Link></div>}
                <Link className="preview-enter" to="/explore">ENTER THE FULL EXPLORER <ArrowUpRight size={15} /></Link>
              </div>
              <p className="preview-disclaimer">{demoMall.note}</p>
            </div>
          </Reveal>
        </section>

        <section className="discover-section page-gutter">
          <Reveal><SectionTitle number="02" eyebrow="A WORLD IN ONE PLACE" title={<>Find a new<br /><em>favourite.</em></>} copy="Move from a little retail therapy to a long lunch, a last-minute gift, or a story on the big screen." to="/stores" linkLabel="Explore all destinations" /></Reveal>
          <div className="discover-layout">
            <div className="category-rail" role="tablist" aria-label="Discover mall categories">{categories.map((item, index) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(item)}><span>0{index + 1}</span>{item}<ArrowUpRight size={14} /></button>)}</div>
            <AnimatePresence mode="wait"><motion.div key={category} className="category-stage-wrap" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28 }}><CategoryStage category={category} /><Link to={category === 'Dining' ? '/dining' : category === 'Entertainment' ? '/entertainment' : '/stores'} className="stage-cta">DISCOVER {category.toUpperCase()} <ArrowUpRight size={14} /></Link></motion.div></AnimatePresence>
          </div>
        </section>

        <section className="featured-section page-gutter">
          <Reveal><SectionTitle number="03" eyebrow="A FEW PLACES TO BEGIN" title={<>Good things,<br /><em>all around.</em></>} copy="A small edit of sample destinations. Find your way to each one, or browse the whole directory." to="/stores" linkLabel="Browse all stores" /></Reveal>
          <div className="featured-retail-composition">
          <Visual variant="stores" stores={featured} label="A three-dimensional promenade of featured mall storefronts" />
          <div className="featured-retail-list">{featured.map((store, index) => <Link key={store._id} to={`/stores/${store.slug}`}><span>0{index + 1} / {store.category}</span><strong>{store.name}</strong><small>{floorLabel(store.floor)} · {store.location}</small><ArrowUpRight size={16} /></Link>)}</div>
          </div>
        </section>

        <section className="dining-home-section page-gutter">
          <div className="dining-home-art"><Visual variant="dining" label="A warm, dimensional dining table with plated dishes and softly lit restaurant surroundings" /><span className="art-index">A TABLE FOR EVERY MOOD / 02</span></div>
          <div className="dining-home-copy"><p className="eyebrow"><span className="eyebrow-line" />STAY FOR SOMETHING GOOD</p><h2>Gather around<br /><em>the table.</em></h2><p>From a quick coffee to an unhurried meal, make a little room for the moments that bring everyone together.</p><div className="dining-mini-list">{dining.map((store) => <Link key={store._id} to={`/stores/${store.slug}`}><span>{store.name}<small>{store.category} · {floorLabel(store.floor)}</small></span><ArrowUpRight size={15} /></Link>)}</div><TextLink to="/dining">Explore dining</TextLink></div>
        </section>

        <section className="events-home-section page-gutter">
          <Reveal><SectionTitle number="04" eyebrow="WHAT'S HAPPENING" title={<>Make a day<br /><em>of it.</em></>} copy="Seasonal moments, familiar faces, and new reasons to stay a little longer." to="/events" linkLabel="See all events" /></Reveal>
          <div className="event-feature">
            <div className="event-feature-art"><Visual variant="events" label="A sculptural three-dimensional event installation in Orion's atrium" /><span className="event-art-label">ORION / GATHER</span><span className="event-art-index">01</span></div>
            <div className="event-feature-copy"><p className="eyebrow">UP NEXT · {demoEvents[0].date}</p><h3>{demoEvents[0].title}</h3><p>{demoEvents[0].description}</p><span className="event-location"><MapPin size={14} />{demoEvents[0].location}</span><TextLink to={`/events/${demoEvents[0].slug}`}>Discover the event</TextLink></div>
          </div>
        </section>

        <section className="offer-home-section page-gutter">
          <div className="offer-art"><Visual variant="offers" label="A floating three-dimensional gift box, shopping bag, and campaign objects" /></div>
          <div className="offer-copy"><p className="eyebrow"><span className="eyebrow-line" />A LITTLE EXTRA</p><h2>Good things<br /><em>come around.</em></h2><p>{demoOffers[0].description}</p><TextLink to="/offers">Explore offers</TextLink></div>
          <div className="offer-index">03 / A LITTLE EXTRA</div>
        </section>

        <section className="entertainment-home-section">
          <div className="entertainment-backdrop"><Visual variant="entertainment" label="A dimensional cinema and play environment with luminous screens and seating" /></div>
          <div className="entertainment-copy page-gutter"><p className="eyebrow"><span className="eyebrow-line" />THE GOOD PART</p><h2>Make room<br /><em>for play.</em></h2><p>One more game. One more story. A little more time together.</p><TextLink to="/entertainment">Discover entertainment</TextLink></div>
          <span className="entertainment-caption">A LITTLE MORE TIME TOGETHER</span>
        </section>

        <section className="visit-home-section page-gutter">
          <Reveal>          <div className="visit-home-card"><div className="visit-home-art"><Visual variant="visit" label="A welcoming three-dimensional mall entrance with garden trees and arrival plaza" /><span>GORAKHPUR / INDIA</span></div><div className="visit-home-copy"><p className="eyebrow"><span className="eyebrow-line" />PLAN YOUR VISIT</p><h2>See you<br /><em>around.</em></h2><div className="visit-facts"><span><MapPin size={15} />{demoMall.address}</span><span><Clock3 size={15} />{demoMall.hours}</span><span><ParkingCircle size={15} />{demoMall.parking}</span></div><TextLink to="/visit">Everything you need to know</TextLink></div></div></Reveal>
        </section>
      </div>
    </PageTransition>
  )
}

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const routeStore = demoStores.find((store) => store.slug === searchParams.get('store')) || null
  const [floor, setFloor] = useState(() => routeStore ? Number(routeStore.floor) : 0)
  const [selected, setSelected] = useState(routeStore)
  const [query, setQuery] = useState('')
  const [focusKey, setFocusKey] = useState(0)
  const matches = useMemo(() => demoStores.filter((store) => `${store.name} ${store.category}`.toLowerCase().includes(query.trim().toLowerCase())), [query])
  const activeStore = routeStore || selected
  const activeFloor = routeStore ? Number(routeStore.floor) : floor
  const selectStore = (store) => {
    setSearchParams({ store: store.slug })
    setFloor(Number(store.floor))
    setSelected(store)
    setQuery('')
    setFocusKey((value) => value + 1)
  }
  const changeFloor = (number) => {
    setSearchParams({})
    setFloor(number)
    setSelected(null)
  }
  const closeStore = () => { setSearchParams({}); setSelected(null) }
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchParams({})
        setSelected(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [setSearchParams])

  return (
    <PageTransition>
      <div className="explore-page">
        <div className="explore-heading"><div><p className="eyebrow"><span className="eyebrow-line" />THE ORION MALL EXPLORER</p><h1>Find your<br /><em>way around.</em></h1></div><div className="explore-heading-note"><span className="live-dot" /> INTERACTIVE MALL PREVIEW <p>Choose a level, discover a storefront, and get a little closer to where you want to be.</p></div></div>
        <div className="explorer-workspace">
          <aside className="explorer-rail">
            <span className="rail-caption">CHOOSE A LEVEL</span>
            <div className="rail-floors" aria-label="Mall floors">{demoFloors.map((item) => <button key={item.number} className={activeFloor === item.number ? 'active' : ''} onClick={() => changeFloor(item.number)} aria-pressed={activeFloor === item.number}><b>{item.label}</b><span>{item.name}</span></button>)}</div>
            <div className="floor-description"><span>{floorLabel(activeFloor)} / ORION</span><p>{demoFloors.find((item) => item.number === activeFloor)?.description}</p></div>
            <div className="interaction-guide"><span className="rail-caption">A QUICK GUIDE</span><p><i>01</i>Drag to look around</p><p><i>02</i>Click a storefront</p><p><i>03</i>Choose a floor to travel</p><small>On touchscreens, swipe across the scene. Press Esc to close details.</small></div>
          </aside>
          <section className="explorer-scene-shell" aria-label="Interactive three-dimensional mall map">
            <div className="explorer-scene-top"><span><MapPin size={14} />{demoFloors.find((item) => item.number === activeFloor)?.name} LEVEL</span><span>GORAKHPUR · INDIA</span></div>
            <Suspense fallback={<SceneLoader label="Opening the mall" />}><MallScene stores={demoStores} floors={demoFloors} floor={activeFloor} selectedStore={activeStore} onSelectStore={selectStore} focusKey={focusKey} /></Suspense>
            <div className="explorer-search">
              <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a store or category" aria-label="Search stores in the explorer" /><kbd>⌕</kbd></label>
              {query && <div className="search-results">{matches.length ? matches.slice(0, 6).map((store) => <button key={store._id} onClick={() => selectStore(store)}><span><strong>{store.name}</strong><small>{store.category}</small></span><span>{floorLabel(store.floor)} <ArrowUpRight size={13} /></span></button>) : <p>No sample stores match that search.</p>}</div>}
            </div>
            <div className="explorer-scene-hint"><span className="drag-icon">↔</span>DRAG TO LOOK AROUND <i /> CLICK A STOREFRONT</div>
            <AnimatePresence>{activeStore && <motion.aside className="explorer-store-panel" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 18 }}>
              <button className="panel-dismiss" onClick={closeStore} aria-label="Close store details">×</button><span className="eyebrow">YOUR NEXT STOP</span><span className="store-panel-category">{activeStore.category} · {floorLabel(activeStore.floor)}</span><h2>{activeStore.name}</h2><p>{activeStore.description}</p><span className="panel-location"><MapPin size={14} />{activeStore.location}</span><div className="store-panel-actions"><Link className="button button-dark" to={`/stores/${activeStore.slug}`}>View details <ArrowUpRight size={15} /></Link><button className="button button-outline" onClick={() => setFocusKey((value) => value + 1)}>Navigate to store <Compass size={15} /></button></div><div className="related-stores"><span>ALSO NEARBY</span>{demoStores.filter((store) => store.floor === activeStore.floor && store._id !== activeStore._id).slice(0, 2).map((store) => <button key={store._id} onClick={() => selectStore(store)}>{store.name}<ArrowRight size={13} /></button>)}</div>
            </motion.aside>}</AnimatePresence>
            <span className="scene-illustrative-label">ILLUSTRATIVE 3D PREVIEW · FLOOR LABELS ARE SAMPLE CONTENT</span>
          </section>
        </div>
        <div className="explorer-bottom-note"><span>✳</span><p>This is an illustrative preview, not a measured mall plan. Store names, floor labels, and locations are sample content.</p><Link to="/visit">Plan a visit <ArrowUpRight size={14} /></Link></div>
      </div>
    </PageTransition>
  )
}

function StoresPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [floor, setFloor] = useState('All')
  const categoriesList = ['All', ...new Set(demoStores.map((store) => store.category))]
  const visible = demoStores.filter((store) => {
    const term = `${store.name} ${store.category} ${store.description}`.toLowerCase()
    return term.includes(query.toLowerCase()) && (category === 'All' || store.category === category) && (floor === 'All' || Number(store.floor) === Number(floor))
  })
  return (
    <PageTransition><div className="directory-page">
      <div className="directory-hero"><div><PageLead label="THE ORION DIRECTORY" title={<>Find your<br /><em>favourite.</em></>} copy="A thoughtful place to begin. Search a name, choose a category, and follow your own kind of day." /></div>      <div className="directory-hero-art"><Visual variant="stores" stores={demoStores.slice(0, 3)} label="An illuminated three-dimensional retail promenade previewing Orion's sample storefronts" /><span>12<br /><small>SAMPLE<br />DESTINATIONS</small></span><i className="directory-map-pin"><MapPin /></i></div></div>
      <div className="directory-content">
        <div className="directory-scene-intro"><div><span className="eyebrow">A PLACE FOR EVERY POINT OF VIEW</span><h2>Walk the<br /><em>shopfronts.</em></h2></div><p>Browse a visual first look at the sample retail mix, then use the directory below to filter by category and floor.</p></div>
        <div className="directory-storefront-stage"><Visual variant="stores" stores={visible.slice(0, 3)} label="A changing three-dimensional storefront scene reflecting the current store results" />{visible.slice(0, 3).map((store, index) => <Link key={store._id} to={`/stores/${store.slug}`} className={`directory-stage-link directory-stage-link-${index}`}><span>0{index + 1} · {floorLabel(store.floor)}</span><strong>{store.name}</strong><ArrowUpRight size={15} /></Link>)}</div>
        <div className="directory-toolbar"><label className="directory-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a store, category, or idea" aria-label="Search stores" />{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label><label className="directory-floor">FLOOR <select value={floor} onChange={(event) => setFloor(event.target.value)}><option value="All">All levels</option>{demoFloors.map((item) => <option value={item.number} key={item.number}>{item.label} · {item.name}</option>)}</select></label></div>
        <div className="directory-categories">{categoriesList.map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="directory-result-count"><span>DESTINATIONS / {String(visible.length).padStart(2, '0')}</span><span>{floor === 'All' ? 'ALL FLOORS' : `${floorLabel(floor)} FLOOR`}</span></div>
        <div className="directory-list">{visible.map((store, index) => <Link className="directory-row" to={`/stores/${store.slug}`} key={store._id}><span className="directory-row-index">0{index + 1}</span><span className="directory-row-name">{store.name}<small>{store.description}</small></span><span className="directory-row-category">{store.category}</span><span className="directory-row-floor"><b>{floorLabel(store.floor)}</b><small>{store.location}</small></span><ArrowUpRight className="directory-row-arrow" size={18} /></Link>)}</div>
        {!visible.length && <div className="empty-directory"><Search size={24} /><p>No places found just yet.</p><button onClick={() => { setQuery(''); setCategory('All'); setFloor('All') }}>Clear filters</button></div>}
      </div>
      <p className="directory-disclaimer">{demoMall.note}</p>
    </div></PageTransition>
  )
}

function StoreDetailsPage() {
  const { slug } = useParams()
  const store = demoStores.find((item) => item.slug === slug)
  if (!store) return <NotFoundPage />
  const related = demoStores.filter((item) => item._id !== store._id && (item.category === store.category || item.floor === store.floor)).slice(0, 3)
  return (
    <PageTransition><div className="store-detail-page">
      <Link to="/stores" className="back-link"><ArrowLeft size={15} /> ALL DESTINATIONS</Link>
      <section className="store-detail-hero" style={{ '--store-color': store.color }}>
        <div className="store-detail-copy"><p className="eyebrow"><span className="eyebrow-line" />{store.category} · {floorLabel(store.floor)}</p><h1>{store.name}<br /><em>has a place here.</em></h1><p>{store.description}</p><div className="store-detail-actions"><Link className="button button-dark" to={`/explore?store=${store.slug}`}>Find it in the mall <Compass size={16} /></Link><Link className="button button-outline" to="/visit">Plan your visit <ArrowUpRight size={15} /></Link></div></div>
        <div className="store-detail-architecture"><Visual variant="storefront" accent={store.color} label={`Three-dimensional shop interior and storefront concept for ${store.name}`} /><span className="detail-floor-stamp">{floorLabel(store.floor)}<small>FLOOR</small></span><span className="detail-location-stamp"><MapPin size={13} />{store.location}</span></div>
      </section>
      <section className="store-detail-info"><div><span className="eyebrow">YOUR VISIT</span><h2>A good place<br /><em>to begin.</em></h2></div><div className="store-facts"><div><span>CATEGORY</span><strong>{store.category}</strong></div><div><span>FLOOR</span><strong>{floorLabel(store.floor)} · {demoFloors.find((item) => item.number === store.floor)?.name}</strong></div><div><span>LOCATION</span><strong>{store.location}</strong></div><div><span>STORE HOURS</span><strong>To be confirmed</strong></div><p>Sample store information is shown for this frontend preview. Please confirm details before your visit.</p></div></section>
      <section className="related-section"><div className="section-title"><div><p className="eyebrow">KEEP DISCOVERING</p><h2>Close to<br /><em>your next stop.</em></h2></div><TextLink to="/stores">View store directory</TextLink></div><div className="storefront-grid">{related.map((item, index) => <StorefrontCard key={item._id} store={item} index={index} />)}</div></section>
    </div></PageTransition>
  )
}

function DiningPage() {
  const venues = demoStores.filter((store) => ['Dining', 'Café'].includes(store.category))
  return (
    <PageTransition><div className="dining-page">
      <section className="destination-hero dining-destination"><div className="destination-copy"><PageLead label="GOOD FOOD, GOOD COMPANY" title={<>A table for<br /><em>every mood.</em></>} copy="Slow coffee, long lunches, a little something sweet. Find the flavour that feels right today." /><div className="destination-meta"><span><Coffee size={15} /> CAFÉS & COFFEE</span><span><Utensils size={15} /> RESTAURANTS</span></div></div><div className="dining-hero-art"><Visual variant="dining" label="A rendered dining table with crafted food, ceramics, glassware, and warm restaurant lighting" /><span>COME AS YOU ARE / STAY A LITTLE</span></div></section>
      <section className="destination-content"><div className="section-title"><div><p className="eyebrow">SOMETHING GOOD IS WAITING</p><h2>Pull up<br /><em>a chair.</em></h2></div><p className="section-blurb">Explore our sample dining destinations, from a quick pick-me-up to a meal worth making time for.</p></div><div className="dining-venue-list">{venues.map((venue, index) => <Link to={`/stores/${venue.slug}`} className="dining-venue" key={venue._id}><span className="dining-venue-count">0{index + 1}</span><span className="venue-art" style={{ '--store-color': venue.color }}><Visual variant="dining" accent={venue.color} label={`Three-dimensional dining scene for ${venue.name}`} /></span><span className="dining-venue-name">{venue.name}<small>{venue.category} · {floorLabel(venue.floor)} · {venue.location}</small></span><span className="round-arrow"><ArrowUpRight size={17} /></span></Link>)}</div><p className="page-disclaimer">{demoMall.note}</p></section>
      <div className="dining-note-strip"><span>✳</span><p>Good food is better together.</p><Link to="/visit">Plan your visit <ArrowUpRight size={14} /></Link></div>
    </div></PageTransition>
  )
}

function EventsPage() {
  const [active, setActive] = useState(0)
  const event = demoEvents[active]
  return (
    <PageTransition><div className="events-page">
      <section className="events-masthead"><div className="events-masthead-copy"><PageLead label="A REASON TO STAY A LITTLE LONGER" title={<>What's on<br /><em>at Orion.</em></>} copy="From seasonal celebrations to the simple joy of getting together, find a moment to make your own." /></div><div className="events-hero-art"><Visual variant="events" label="A colorful three-dimensional atrium installation made for Orion's seasonal gatherings" /><span className="events-hero-stamp">THE ORION<br />CALENDAR</span></div></section>
      <section className="events-featured"><div className="event-selector">{demoEvents.map((item, index) => <button key={item._id} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span>0{index + 1}</span><b>{item.title}</b><small>{item.date}</small><ArrowUpRight size={14} /></button>)}</div><AnimatePresence mode="wait"><motion.article className="event-selected" key={event._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="event-selected-art"><Visual variant="events" accent={['#ef8b79', '#d2a753', '#9d89d1'][active]} label={`Three-dimensional ${event.title} installation concept`} /><i>{String(active + 1).padStart(2, '0')}</i></div><div className="event-selected-copy"><p className="eyebrow">{event.type} · {event.date}</p><h2>{event.title}</h2><p>{event.description}</p><span className="event-location"><MapPin size={14} />{event.location}</span><TextLink to={`/events/${event.slug}`}>Discover this event</TextLink></div></motion.article></AnimatePresence></section>
      <section className="events-calendar"><div><span className="eyebrow">THE ORION CALENDAR</span><h2>Make a little<br /><em>room for more.</em></h2></div><div className="calendar-note"><Clock3 size={20} /><p>Dates and event details are being confirmed. Check back soon for the latest from Orion Mall Gorakhpur.</p><Link to="/visit">Visitor information <ArrowUpRight size={14} /></Link></div></section>
      <p className="page-disclaimer">{demoMall.note}</p>
    </div></PageTransition>
  )
}

function EventDetailsPage() {
  const { slug } = useParams()
  const event = demoEvents.find((item) => item.slug === slug || item._id === slug)
  if (!event) return <NotFoundPage />
  return <PageTransition><article className="event-detail-page"><Link to="/events" className="back-link"><ArrowLeft size={15} /> ALL EVENTS</Link><div className="event-detail-art"><Visual variant="events" label={`Immersive event sculpture inspired by ${event.title}`} /><span>ORION / MOMENTS</span></div><div className="event-detail-copy"><p className="eyebrow">{event.type} · {event.date}</p><h1>{event.title}</h1><p>{event.description}</p><span className="event-location"><MapPin size={14} />{event.location} · {floorLabel(event.floor)}</span><p className="page-disclaimer">Dates and participation details to be confirmed.</p><TextLink to="/visit">Plan your visit</TextLink></div></article></PageTransition>
}

function OffersPage() {
  return (
    <PageTransition><div className="offers-page">
      <section className="offers-masthead"><div><PageLead label="A LITTLE SOMETHING EXTRA" title={<>Good things<br /><em>come around.</em></>} copy="Small reasons to treat yourself, discover a new favourite, or make your day feel a little different." /></div><div className="offer-orbit-art"><Visual variant="offers" label="Floating 3D gift boxes, a shopping bag, and polished campaign objects" /><span>THE ORION EDIT / 01</span></div></section>
      <section className="offers-list-section"><div className="section-title"><div><p className="eyebrow">THE CURRENT EDIT</p><h2>Worth a<br /><em>closer look.</em></h2></div><p className="section-blurb">A selection of illustrative offers. Participating venues, dates, and terms are to be confirmed.</p></div><div className="offer-list">{demoOffers.map((offer, index) => <article className="offer-row" key={offer._id}><span className="offer-row-num">0{index + 1}</span><span className={`offer-thumb offer-thumb-${index}`}><Visual variant={index === 0 ? 'dining' : index === 1 ? 'stores' : 'entertainment'} accent={['#df9470', '#e68e79', '#8a72c2'][index]} label={`Three-dimensional ${offer.category.toLowerCase()} offer campaign visual`} /></span><div><span className="offer-row-category">{offer.category} · SAMPLE OFFER</span><h3>{offer.title}</h3><p>{offer.description}</p><small>{offer.valid}</small></div><Link to={offer.category === 'Dining' ? '/dining' : offer.category === 'Entertainment' ? '/entertainment' : '/stores'} aria-label={`Discover ${offer.category}`}><ArrowUpRight size={18} /></Link></article>)}</div><p className="page-disclaimer">{demoMall.note}</p></section>
    </div></PageTransition>
  )
}

function EntertainmentPage() {
  return (
    <PageTransition><div className="entertainment-page">
      <section className="entertainment-hero"><div className="entertainment-copy"><PageLead label="A LITTLE MORE TIME TOGETHER" title={<>Stay for<br /><em>the good part.</em></>} copy="The curtain rises. The lights soften. There’s always room for one more story." /><div className="entertainment-tags"><span><Clapperboard size={15} /> CINEMA</span><span><Sparkles size={15} /> FAMILY FUN</span></div></div><div className="entertainment-hero-art"><Visual variant="entertainment" label="A three-dimensional cinema environment with a luminous screen, cinematic light beams, and velvet seating" /><span className="cinema-side-label">TAKE YOUR SEAT</span></div></section>
      <section className="entertainment-destinations"><div className="section-title"><div><p className="eyebrow">PLAY YOUR WAY</p><h2>Pick your<br /><em>next scene.</em></h2></div><p className="section-blurb">Sample entertainment destinations with details that will be confirmed by the mall.</p></div><div className="entertainment-cards">{demoStores.filter((store) => store.category === 'Entertainment').map((store, index) => <Link to={`/stores/${store.slug}`} className="entertainment-card" key={store._id}><div className={`ent-card-art ent-card-art-${index}`}><Visual variant={index ? 'entertainment' : 'play'} accent={index ? '#8a72c2' : '#e789a5'} label={index ? 'Three-dimensional cinema scene with a luminous screen' : 'Three-dimensional family play environment with a carousel and colorful play blocks'} /><small>{floorLabel(store.floor)} / {store.location}</small></div><div><span>{store.category}</span><h3>{store.name}</h3><p>{store.description}</p><ArrowUpRight size={16} /></div></Link>)}</div><p className="page-disclaimer">{demoMall.note}</p></section>
    </div></PageTransition>
  )
}

function VisitPage() {
  const [copied, setCopied] = useState(false)
  const copyLocation = async () => {
    try {
      await navigator.clipboard.writeText(demoMall.address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error('Unable to copy the sample address.', error)
    }
  }
  return (
    <PageTransition><div className="visit-page">
      <section className="visit-masthead"><div className="visit-masthead-copy"><PageLead label="WE'LL SAVE YOU A PLACE" title={<>Come on<br /><em>over.</em></>} copy="Getting here should be easy. Find the essentials for planning your visit, with confirmed details to follow." /></div><div className="visit-architecture"><Visual variant="visit" label="A welcoming three-dimensional architectural entrance with glass, garden trees, warm light, and a public arrival plaza" /><span>ORION / GORAKHPUR</span></div></section>
      <section className="visit-information"><div className="visit-address-card"><span className="eyebrow">FIND ORION</span><MapPin size={24} /><h2>A place to<br /><em>gather.</em></h2><p>{demoMall.address}</p><div className="visit-address-actions"><a className="button button-dark" href="https://maps.google.com/?q=Orion+Mall+Gorakhpur" target="_blank" rel="noreferrer">Open map <ArrowUpRight size={15} /></a><button className="button button-outline" onClick={copyLocation}>{copied ? 'Copied' : 'Copy address'}</button></div><small>Map search is a placeholder until the verified location is supplied.</small></div><div className="visit-faqs">{[['Opening hours', demoMall.hours, Clock3], ['Getting here', 'Directions and public transport information to be confirmed.', Compass], ['Parking', demoMall.parking, ParkingCircle], ['Visitor services', demoServices.map((item) => item.name).join(' · '), Sparkles], ['Contact', demoMall.phone, MapPin]].map(([title, detail, Icon]) => <details key={title}><summary><span><Icon size={17} />{title}</span><b>+</b></summary><p>{detail}</p></details>)}</div></section>
      <section className="visit-cta-strip"><div><p className="eyebrow">YOUR DAY, YOUR WAY</p><h2>Find the places<br /><em>you'll love.</em></h2></div><TextLink to="/explore">Explore the mall</TextLink></section>
      <p className="page-disclaimer">{demoMall.note}</p>
    </div></PageTransition>
  )
}

function NotFoundPage() {
  return <PageTransition><section className="not-found-page"><div className="not-found-visual"><Suspense fallback={<SceneLoader label="Finding your way" />}><HeroScene compact /></Suspense><span>404 / DESTINATION UNKNOWN</span></div><div className="not-found-copy"><p className="eyebrow"><span className="eyebrow-line" />A LITTLE DETOUR</p><h1>This isn't<br /><em>the way.</em></h1><p>The page you’re looking for has moved, or may not exist yet. Let’s find your way back.</p><Link className="button button-dark" to="/">Back to the beginning <ArrowUpRight size={16} /></Link></div></section></PageTransition>
}

export {
  HomePage, ExplorePage, StoresPage, StoreDetailsPage, DiningPage, EventsPage,
  EventDetailsPage, OffersPage, EntertainmentPage, VisitPage, NotFoundPage,
}
