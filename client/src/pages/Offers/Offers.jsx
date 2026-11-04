import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { offers } from '../../data/events'
import { mallInfo } from '../../data/mallInfo'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import PageTransition from '../../components/layout/PageTransition'

export default function OffersPage() {
  return (
    <PageTransition>
      <div className="offers-page">
        <section className="offers-masthead">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />A LITTLE SOMETHING EXTRA</p>
            <h1>Good things<br /><em>come around.</em></h1>
            <p>Small reasons to treat yourself, discover a new favourite, or make your day feel a little different.</p>
          </div>
          <div className="offer-orbit-art">
            <ImageWithFallback
              src={offers[0]?.image || '/images/offers/new-season.svg'}
              alt={offers[0]?.title || 'Offer'}
              className="offer-orbit-image"
            />
            <span>THE ORION EDIT / 01</span>
          </div>
        </section>

        <section className="offers-list-section">
          <div className="section-title">
            <div>
              <p className="eyebrow">THE CURRENT EDIT</p>
              <h2>Worth a<br /><em>closer look.</em></h2>
            </div>
            <p className="section-blurb">A selection of illustrative offers. Participating venues, dates, and terms are to be confirmed.</p>
          </div>
          <div className="offer-list">
            {offers.map((offer, index) => (
              <article key={offer.id} className="offer-row">
                <span className="offer-row-num">0{index + 1}</span>
                <span className="offer-thumb">
                  <ImageWithFallback
                    src={offer.image}
                    alt={offer.title}
                    className="offer-thumb-image"
                  />
                </span>
                <div>
                  <span className="offer-row-category">{offer.category} &middot; SAMPLE OFFER</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <small>{offer.valid}</small>
                </div>
                <Link
                  to={
                    offer.category === 'Dining'
                      ? '/dining'
                      : offer.category === 'Entertainment'
                        ? '/entertainment'
                        : '/stores'
                  }
                  className="offer-row-link"
                  aria-label={`Discover ${offer.category}`}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </article>
            ))}
          </div>
          <p className="page-disclaimer">{mallInfo.note}</p>
        </section>
      </div>
    </PageTransition>
  )
}
