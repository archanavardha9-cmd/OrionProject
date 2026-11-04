import { useState, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight, Clock3, MapPin, ParkingCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mallInfo as demoMall } from '../../data/mallInfo'
import { stores, floorLabel } from '../../data/stores'
import { events } from '../../data/events'
import { offers } from '../../data/events'
import HeroScene from '../../three/HeroScene'
import MallWalkthrough from '../../components/3d/MallWalkthrough'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import Button from '../../components/common/Button'
import SectionHeading from '../../components/common/SectionHeading'
import PageTransition from '../../components/layout/PageTransition'
import './home.css'

const categories = [
  'Fashion',
  'Lifestyle',
  'Beauty',
  'Jewellery',
  'Electronics',
  'Dining',
  'Entertainment',
]

const categoryDetails = {
  Fashion: {
    title: 'Contemporary Luxury & Haute Couture',
    desc: 'Explore curated fashion flagships, international labels, and premium Indian occasion wear tailored for discerning tastes.',
    image: '/images/homepage/fashion-lifestyle.webp',
    link: '/stores?category=Fashion',
  },
  Lifestyle: {
    title: 'Refined Living & Home Accents',
    desc: 'From artisan home fragrances to hand-picked interior décor and daily essentials designed to elevate your living spaces.',
    image: '/images/homepage/offers-promo.webp',
    link: '/stores?category=Lifestyle',
  },
  Beauty: {
    title: 'Prestige Cosmetics & Wellness',
    desc: 'Indulge in bespoke skincare consultations, world-renowned fragrances, and relaxing salon rituals for complete rejuvenation.',
    image: '/images/homepage/mall-atrium.webp',
    link: '/stores?category=Beauty',
  },
  Jewellery: {
    title: 'Timeless Gold, Solitaires & Watches',
    desc: 'Celebrate your most cherished milestones with masterful diamond craftsmanship, heritage gold, and Swiss chronographs.',
    image: '/images/homepage/fashion-lifestyle.webp',
    link: '/stores?category=Jewellery',
  },
  Electronics: {
    title: 'State-of-the-Art Connected Tech',
    desc: 'Experience tomorrow’s innovation today with next-generation smart acoustics, mobile flagships, and premium home theater systems.',
    image: '/images/homepage/mall-atrium.webp',
    link: '/stores?category=Electronics',
  },
  Dining: {
    title: 'Culinary Artistry & Grand Cafés',
    desc: 'From slow morning espresso roasts and artisanal bakeries to vibrant regional delicacies and leisurely rooftop dinners.',
    image: '/images/homepage/dining-experience.webp',
    link: '/dining',
  },
  Entertainment: {
    title: 'Cinematic Spectacles & Immersive Play',
    desc: 'Luxurious multiplex auditoriums, thrilling VR arcades, and family leisure zones designed for laughter and lasting memories.',
    image: '/images/homepage/entertainment-zone.webp',
    link: '/entertainment',
  },
}

const featured = stores.slice(0, 4)

// ── Iconic Destinations data ─────────────────────────────────
const iconicDestinations = [
  {
    id: 'fashion-lifestyle',
    eyebrow: 'FASHION & LIFESTYLE',
    title: 'Style, Elevated.',
    description:
      'From contemporary everyday wear to premium occasion fashion — explore flagship boutiques, curated accessories, fine jewellery, and beauty across multiple floors.',
    image: '/images/homepage/fashion-lifestyle.webp',
    link: '/stores?category=Fashion',
    linkLabel: 'Explore Fashion',
    accent: '#c8a96a',
  },
  {
    id: 'food-dining',
    eyebrow: 'FOOD & DINING',
    title: 'Gather Around the Table.',
    description:
      'Artisanal cafés, gourmet restaurants, vibrant food courts, and rooftop terraces — Orion\u2019s dining floor is a celebration of flavour for every occasion.',
    image: '/images/homepage/dining-experience.webp',
    link: '/dining',
    linkLabel: 'Discover Dining',
    accent: '#b87d4b',
  },
  {
    id: 'entertainment-family',
    eyebrow: 'ENTERTAINMENT & FAMILY',
    title: 'Make Room for Play.',
    description:
      'Luxurious multiplex cinema, thrilling gaming arcades, bowling alleys, and immersive VR zones — world-class entertainment designed for the whole family.',
    image: '/images/homepage/entertainment-zone.webp',
    link: '/entertainment',
    linkLabel: 'See Entertainment',
    accent: '#8c7347',
  },
  {
    id: 'everyday-essentials',
    eyebrow: 'EVERYDAY ESSENTIALS',
    title: 'Everything You Need.',
    description:
      'FreshMart Grocery, City Care Pharmacy, banking services, and everyday conveniences — all thoughtfully placed for effortless, complete shopping visits.',
    image: '/images/homepage/mall-atrium.webp',
    link: '/stores',
    linkLabel: 'View Directory',
    accent: '#6b7c5c',
  },
]

export default function HomePage() {
  const [category, setCategory] = useState(categories[0])

  const diningVenues = useMemo(
    () =>
      stores
        .filter((s) =>
          ['Dining', 'Cafe', 'Restaurant', 'Food Court', 'Dessert', 'Beverage'].includes(s.category)
        )
        .slice(0, 2),
    []
  )

  const activeCategoryData = categoryDetails[category] || categoryDetails.Fashion

  return (
    <PageTransition>
      <div className="home-page">
        {/* HERO SECTION */}
        <section className="home-hero">
          <div className="home-hero-visual" aria-hidden="true">
            <HeroScene />
          </div>
          <div className="hero-vignette" />
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">
              <span className="eyebrow-line" />
              THE PREMIER LIFESTYLE DESTINATION
            </p>
<h1>
  <span>More Than Shopping.</span>
  <em>A World of Experiences.</em>
</h1>
            <p>
              Welcome to Orion Mall Gorakhpur — where architectural grandeur meets premier shopping,
              exquisite dining, and world-class entertainment across four magnificent levels.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/explore">
                Explore 3D Mall <ArrowUpRight size={16} />
              </Link>
              <Link className="button button-quiet" to="/stores">
                Browse Directory <ArrowDownRight size={16} />
              </Link>
            </div>
          </motion.div>

          <div className="hero-coordinates">
            <span>26&deg; 45&rsquo; N</span>
            <span className="coord-sep" />
            <span>83&deg; 22&rsquo; E</span>
            <span className="coord-sep" />
            <span>GORAKHPUR, INDIA</span>
          </div>
          <div className="hero-side-caption">
            ORION DESTINATION
            <br />
            A CELEBRATION OF REFINED LIVING
          </div>
          <Link className="hero-scroll" to="/explore" aria-label="Scroll to discover">
            <span>SCROLL TO DISCOVER</span>
            <span className="scroll-line" />
          </Link>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-label="Orion Mall, Gorakhpur Highlights">
          <div className="ticker-track">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                FLAGSHIP BOUTIQUES <b>&lowast;</b> GOURMET TERRACES <b>&lowast;</b> MULTIPLEX CINEMA <b>&lowast;</b> GRAND ATRIUM <b>&lowast;</b> GORAKHPUR, INDIA <b>&lowast;</b>
              </span>
            ))}
          </div>
        </div>

        {/* 01. INTRO / ABOUT SECTION */}
        <section className="about-section home-section-gutter">
          <div className="about-grid">
            <motion.div
              className="about-image-wrap"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
            >
              <ImageWithFallback
                src="/images/homepage/mall-atrium.webp"
                alt="Grand Atrium at Orion Mall Gorakhpur"
                className="about-image"
              />
              <span className="about-image-label">THE GRAND ATRIUM &middot; LEVEL 0</span>
            </motion.div>
            <div className="about-content">
              <p className="eyebrow">
                <span className="eyebrow-line" />
                CONTEMPORARY EXCELLENCE
              </p>
              <h2>
                Crafted for unforgettable<br />
                <em>moments together.</em>
              </h2>
              <p>
                Conceived as a luminous sanctuary in the heart of eastern Uttar Pradesh, Orion Mall brings together over 60 premier retail boutiques, a curated chef-driven dining terrace, and high-energy entertainment for families and visionaries alike.
              </p>
              <div className="about-stats">
                <div>
                  <strong>60+</strong>
                  <span>Curated Brands</span>
                </div>
                <div>
                  <strong>4</strong>
                  <span>Spacious Levels</span>
                </div>
                <div>
                  <strong>1000+</strong>
                  <span>Parking Spaces</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02. INTERACTIVE 3D PREVIEW */}
        <section className="preview-section home-section-gutter">
          <SectionHeading
            number="01"
            eyebrow="IMMERSIVE NAVIGATION"
            title={
              <>
                Step inside<br />
                <em>the atrium.</em>
              </>
            }
            copy="Take a look inside the mall, then open the full Explorer to find shops and move between floors."
            to="/explore"
            linkLabel="Explore Mall"
          />
          <div className="preview-shell">
            <div className="preview-toolbar">
              <span>
                <span className="live-dot" /> LIVE 3D WALKTHROUGH PREVIEW
              </span>
              <span>DRAG TO LOOK AROUND</span>
            </div>
            <div className="preview-canvas">
              <MallWalkthrough mode="preview" height="100%" />
              <Link className="preview-open-button" to="/explore">
                Explore Mall <ArrowUpRight size={15} />
              </Link>
            </div>
            <p className="preview-disclaimer">{demoMall.note}</p>
          </div>
        </section>

        {/* 03. DISCOVER CATEGORIES */}
        <section className="discover-section home-section-gutter">
          <SectionHeading
            number="02"
            eyebrow="CURATED EDITS"
            title={
              <>
                A universe of<br />
                <em>delights.</em>
              </>
            }
            copy="Move seamlessly from high-fashion salons and jewelry parlours to leisurely terrace dining and cinematic entertainment."
            to="/stores"
            linkLabel="Browse All Categories"
          />
          <div className="discover-layout">
            <div className="category-rail" role="tablist" aria-label="Mall categories">
              {categories.map((item, index) => (
                <button
                  key={item}
                  role="tab"
                  aria-selected={category === item}
                  className={category === item ? 'category-tab active' : 'category-tab'}
                  onClick={() => setCategory(item)}
                >
                  <span>0{index + 1}</span>
                  {item}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
            <div className="category-stage-wrap">
              <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="category-stage"
                >
                  <ImageWithFallback
                    src={activeCategoryData.image}
                    alt={`${category} at Orion Mall`}
                    className="category-stage-image"
                  />
                  <div className="category-overlay-card">
                    <p className="eyebrow">{category.toUpperCase()} COLLECTION</p>
                    <h3>{activeCategoryData.title}</h3>
                    <p>{activeCategoryData.desc}</p>
                    <Link to={activeCategoryData.link} className="stage-cta">
                      EXPLORE {category.toUpperCase()} <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 04. ICONIC DESTINATIONS */}
        <IconicDestinations />

        {/* 05. DINING HIGHLIGHT */}
        <section className="dining-home-section home-section-gutter">
          <div className="dining-home-art">
            <ImageWithFallback
              src="/images/homepage/dining-experience.webp"
              alt="Gourmet Dining at Orion Mall"
              className="dining-home-art-image"
            />
            <span className="art-index">LEVEL 2 &middot; GOURMET TERRACE</span>
          </div>
          <div className="dining-home-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              AN INVITATION TO TASTE
            </p>
            <h2>
              Gather around<br />
              <em>the table.</em>
            </h2>
            <p>
              Whether it is a morning coffee blend at an artisanal café, an intimate family dinner, or quick handcrafted street bites, our dining floor is an ode to gastronomic pleasure.
            </p>
            <div className="dining-mini-list">
              {diningVenues.map((store) => (
                <Link key={store.id} to={`/stores/${store.slug}`} className="dining-mini-link">
                  <span>
                    {store.name}
                    <small>
                      {store.category} &middot; {floorLabel(store.floor)}
                    </small>
                  </span>
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
            <Button asChild component={Link} to="/dining" variant="dark">
              Explore All Dining
            </Button>
          </div>
        </section>

        {/* 06. EVENTS HIGHLIGHT */}
        <section className="events-home-section home-section-gutter">
          <SectionHeading
            number="04"
            eyebrow="EXCITING CALENDAR"
            title={
              <>
                Make a day<br />
                <em>of it.</em>
              </>
            }
            copy="Seasonal installations, live musical performances, and pop-up makers markets crafted to bring our community closer."
            to="/events"
            linkLabel="View All Events"
          />
          <div className="event-feature">
            <div className="event-feature-art">
              <ImageWithFallback
                src="/images/homepage/mall-events.webp"
                alt={events[0]?.title || 'Orion Mall Event'}
                className="event-feature-image"
              />
            </div>
            <div className="event-feature-copy">
              <p className="eyebrow">UP NEXT &middot; {events[0]?.dateLabel || 'THIS WEEKEND'}</p>
              <h3>{events[0]?.title || 'The Grand Seasonal Gala'}</h3>
              <p>
                {events[0]?.description ||
                  'Join us for live acoustic ensembles, bespoke culinary tastings, and seasonal celebrations under the illuminated atrium skylights.'}
              </p>
              <span className="event-location">
                <MapPin size={14} />
                {events[0]?.location || 'The Grand Atrium, Level 0'}
              </span>
              <Link to={`/events/${events[0]?.slug}`} className="text-link">
                Discover event details <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* 07. OFFERS BANNER */}
        <section className="offer-home-section home-section-gutter">
          <div className="offer-art">
            <ImageWithFallback
              src="/images/homepage/offers-promo.webp"
              alt="Exclusive Offers & Promotions"
              className="offer-art-image"
            />
          </div>
          <div className="offer-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              SPECIAL PRIVILEGES
            </p>
            <h2>
              Good things<br />
              <em>come around.</em>
            </h2>
            <p>
              {offers[0]?.description ||
                'Enjoy exclusive seasonal rewards, boutique previews, and dining privileges from premier brands throughout the season.'}
            </p>
            <Link to="/offers" className="text-link">
              Explore all seasonal offers <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="offer-index">03 / SPECIAL PRIVILEGES</div>
        </section>

        {/* 08. ENTERTAINMENT SECTION */}
        <section className="entertainment-home-section home-section-gutter">
          <div className="entertainment-backdrop">
            <ImageWithFallback
              src="/images/homepage/entertainment-zone.webp"
              alt="Entertainment at Orion Mall"
              className="entertainment-backdrop-image"
            />
          </div>
          <div className="entertainment-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              WHERE MEMORIES ARE MADE
            </p>
            <h2>
              Make room<br />
              <em>for play.</em>
            </h2>
            <p>
              Immerse yourself in world-class cinema projection, bowling alleys, and interactive VR simulations designed for the child in everyone.
            </p>
            <Link to="/entertainment" className="text-link">
              Discover entertainment <ArrowUpRight size={14} />
            </Link>
          </div>
          <span className="entertainment-caption">LEVEL 3 &middot; THE ENTERTAINMENT BLOCK</span>
        </section>

        {/* 09. PLAN YOUR VISIT */}
        <section className="visit-home-section home-section-gutter">
          <div className="visit-home-card">
            <div className="visit-home-art">
              <ImageWithFallback
                src="/images/homepage/hero-mall-exterior.webp"
                alt="Orion Mall Gorakhpur Grand Entrance"
                className="visit-home-art-image"
              />
              <span>GORAKHPUR &middot; UTTAR PRADESH</span>
            </div>
            <div className="visit-home-copy">
              <p className="eyebrow">
                <span className="eyebrow-line" />
                CONCIERGE &amp; ARRIVAL
              </p>
              <h2>
                See you<br />
                <em>around.</em>
              </h2>
              <div className="visit-facts">
                <span>
                  <MapPin size={15} />
                  {demoMall.address}
                </span>
                <span>
                  <Clock3 size={15} />
                  Mon - Sun: 10:00 AM &ndash; 10:00 PM
                </span>
                <span>
                  <ParkingCircle size={15} />
                  Multi-level dedicated basement parking with EV charging
                </span>
              </div>
              <Link to="/visit" className="text-link">
                Plan your complete journey <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

function getFeaturedStoreImage(store) {
  if (store.category === 'Fashion') return '/images/homepage/fashion-lifestyle.webp'
  if (store.category === 'Beauty') return '/images/homepage/mall-atrium.webp'
  if (store.category === 'Jewellery') return '/images/homepage/offers-promo.webp'
  return '/images/homepage/fashion-lifestyle.webp'
}

// ── Tilt hook for 3D card effect ─────────────────────────────
function useTilt() {
  const ref = useRef(null)

  const handleMove = useCallback((e) => {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -6
    const rotY = ((x - cx) / cx) * 6
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`
  }, [])

  const handleLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }
  }, [])

  return { ref, handleMove, handleLeave }
}

// ── Individual destination card ───────────────────────────────
function DestinationCard({ dest, index }) {
  const { ref, handleMove, handleLeave } = useTilt()
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.div
      className="icdest-card-wrap"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={dest.link}
        className="icdest-card"
        ref={prefersReduced ? null : ref}
        onMouseMove={prefersReduced ? undefined : handleMove}
        onMouseLeave={prefersReduced ? undefined : handleLeave}
      >
        {/* image layer */}
        <div className="icdest-img-wrap">
          <img
            src={dest.image}
            alt={dest.title}
            className="icdest-img"
            loading="lazy"
            decoding="async"
          />
          <div className="icdest-img-overlay" />
        </div>

        {/* content layer */}
        <div className="icdest-content">
          <span className="icdest-eyebrow" style={{ '--accent': dest.accent }}>
            {dest.eyebrow}
          </span>
          <h3 className="icdest-title">{dest.title}</h3>
          <p className="icdest-desc">{dest.description}</p>
          <span className="icdest-cta">
            {dest.linkLabel} <ArrowUpRight size={14} />
          </span>
        </div>

        {/* index badge */}
        <span className="icdest-index">0{index + 1}</span>
      </Link>
    </motion.div>
  )
}

// ── Iconic Destinations section ───────────────────────────────
function IconicDestinations() {
  return (
    <section className="icdest-section">
      <div className="icdest-inner home-section-gutter">
        <motion.div
          className="icdest-heading-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="icdest-heading-left">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              ICONIC DESTINATIONS
            </p>
            <h2>
              More to love,<br />
              <em>at every turn.</em>
            </h2>
          </div>
          <div className="icdest-heading-right">
            <p>
              Four distinct worlds under one grand roof — curated fashion, acclaimed dining, immersive entertainment, and everyday convenience, all crafted for a premium experience.
            </p>
            <Link to="/stores" className="text-link">
              Explore full directory <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>

        <div className="icdest-grid">
          {iconicDestinations.map((dest, i) => (
            <DestinationCard key={dest.id} dest={dest} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
