import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Compass } from 'lucide-react'
import { findStore, floorLabel, stores } from '../../data/stores'
import { floors } from '../../data/floors'
import PageTransition from '../../components/layout/PageTransition'

export default function StoreDetailsPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const store = findStore(slug)
  if (!store) return <NotFoundPage />

  const fromExplorer = searchParams.get('from') === 'explore'
  const floorInfo = floors.find((floor) => floor.number === store.floor)
  const related = stores
    .filter((item) => item.id !== store.id && (item.category === store.category || item.floor === store.floor))
    .slice(0, 4)

  return (
    <PageTransition>
      <div className="store-detail-page">
        <Link
          to={fromExplorer ? `/explore?store=${store.slug}` : '/stores'}
          className="back-link"
        >
          <ArrowLeft size={16} /> {fromExplorer ? 'EXPLORER' : 'DIRECTORY'}
        </Link>
        <section className="store-detail-hero">
          <div className="store-detail-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{store.category} <span>·</span> {floorLabel(store.floor)}</p>
            <h1>{store.brand}</h1>
            <p>{store.description}</p>
            <div className="store-detail-actions">
              <Link className="button button-dark" to={`/explore?store=${store.slug}`}>
                Find this destination <Compass size={17} />
              </Link>
              <Link className="button button-outline" to="/visit">Plan your visit <ArrowUpRight size={16} /></Link>
            </div>
          </div>
          <div className="store-detail-architecture" aria-hidden="true">
            <span className="store-detail-monogram">{store.brand.slice(0, 1)}</span>
            <span className="detail-floor-stamp">{floorLabel(store.floor)}<small>FLOOR</small></span>
            <span className="detail-location-stamp">{floorInfo?.name}</span>
          </div>
        </section>

        <section className="store-detail-info">
          <div>
            <span className="eyebrow">DIRECTORY DETAILS</span>
            <h2>One more<br /><em>good find.</em></h2>
          </div>
          <div className="store-facts">
            <div><span>BRAND</span><strong>{store.brand}</strong></div>
            <div><span>CATEGORY</span><strong>{store.category}</strong></div>
            <div><span>FLOOR</span><strong>{floorLabel(store.floor)} · {floorInfo?.name}</strong></div>
            <p>Shop number and precise in-floor position have not been provided.</p>
          </div>
        </section>

        <section className="related-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">KEEP DISCOVERING</p>
              <h2>Nearby in the<br /><em>directory.</em></h2>
            </div>
            <Link to="/stores" className="text-link">View all destinations <ArrowUpRight size={15} /></Link>
          </div>
          <div className="related-store-grid">
            {related.map((item) => (
              <Link key={item.id} to={`/stores/${item.slug}`} className="related-store-card">
                <span>{floorLabel(item.floor)} · {item.category}</span>
                <strong>{item.brand}</strong>
                <small>{item.description}</small>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

function NotFoundPage() {
  return (
    <section className="not-found-inline">
      <div className="not-found-copy">
        <p className="eyebrow"><span className="eyebrow-line" />A LITTLE DETOUR</p>
        <h1>This destination<br /><em>isn’t listed.</em></h1>
        <p>Browse the current Orion Mall Gorakhpur directory to find a place.</p>
        <Link className="button button-dark" to="/stores">Open the directory <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  )
}
