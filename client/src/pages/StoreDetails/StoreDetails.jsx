import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, MapPin, ArrowUpRight } from 'lucide-react'
import { findStore, floorLabel, stores } from '../../data/stores'
import { floors } from '../../data/floors'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import PageTransition from '../../components/layout/PageTransition'

export default function StoreDetailsPage() {
  const { slug } = useParams()
  const store = findStore(slug)
  if (!store) return <NotFoundPage />

  const floorInfo = floors.find((f) => f.number === store.floor)
  const related = stores
    .filter((item) => item.id !== store.id && (item.category === store.category || item.floor === store.floor))
    .slice(0, 4)

  return (
    <PageTransition>
      <div className="store-detail-page">
        <Link to="/stores" className="back-link"><ArrowLeft size={15} /> ALL DESTINATIONS</Link>
        <section className="store-detail-hero" style={{ '--store-color': store.color || '#9b8268' }}>
          <div className="store-detail-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{store.category} &middot; {floorLabel(store.floor)}</p>
            <h1>{store.name}<br /><em>has a place here.</em></h1>
            <p>{store.description}</p>
            <div className="store-detail-actions">
              <a className="button button-dark" href={`/explore?store=${store.slug}`}>
                Find it in the mall <Compass size={16} />
              </a>
              <a className="button button-outline" href="/visit">Plan your visit <ArrowUpRight size={15} /></a>
            </div>
          </div>
          <div className="store-detail-architecture">
            <ImageWithFallback
              src={store.image}
              alt={store.name}
              className="store-detail-image"
            />
            <span className="detail-floor-stamp">{floorLabel(store.floor)}<small>FLOOR</small></span>
            <span className="detail-location-stamp"><MapPin size={13} />{store.unit}</span>
          </div>
        </section>
        <section className="store-detail-info">
          <div>
            <span className="eyebrow">YOUR VISIT</span>
            <h2>A good place<br /><em>to begin.</em></h2>
          </div>
          <div className="store-facts">
            <div>
              <span>CATEGORY</span>
              <strong>{store.category}</strong>
            </div>
            <div>
              <span>FLOOR</span>
              <strong>{floorLabel(store.floor)} &middot; {floorInfo?.name}</strong>
            </div>
            <div>
              <span>UNIT</span>
              <strong>{store.unit}</strong>
            </div>
            <div>
              <span>STORE HOURS</span>
              <strong>Mall opening hours</strong>
            </div>
            <p>
              {store.isVerified ? 'Verified mall directory information.' : 'Illustrative directory content for this frontend preview. Confirm details before your visit.'}
            </p>
          </div>
        </section>
        <section className="related-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">KEEP DISCOVERING</p>
              <h2>Close to<br /><em>your next stop.</em></h2>
            </div>
            <Link to="/stores" className="text-link">View store directory <ArrowUpRight size={14} /></Link>
          </div>
          <div className="storefront-grid">
            {related.map((item, index) => (
              <Link key={item.id} to={`/stores/${item.slug}`} className="storefront-card">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="storefront-card-image"
                />
                <span className="storefront-card-floor">{floorLabel(item.floor)}</span>
                <strong>{item.name}</strong>
                <small>{item.category} &middot; {item.unit}</small>
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
        <h1>This isn&rsquo;t<br /><em>the way.</em></h1>
        <p>The destination you&rsquo;re looking for isn&rsquo;t in the directory.</p>
        <Link className="button button-dark" to="/stores">Back to the directory <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  )
}
