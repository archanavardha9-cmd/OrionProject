import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { offers } from '../../data/events'
import PageTransition from '../../components/layout/PageTransition'

export default function OffersPage() {
  return (
    <PageTransition>
      <div className="offers-page">
        <section className="offers-masthead">
          <div className="offers-masthead-copy">
            <p className="eyebrow"><span className="eyebrow-line" />THE ORION EDIT</p>
            <h1>Good things<br /><em>come around.</em></h1>
            <p>Offers will appear here when participating stores share confirmed details.</p>
          </div>
          <div className="offer-orbit-art">
            <img src="/images/homepage/mall-atrium.webp" alt="The mall atrium" className="offer-orbit-image" />
            <span>DISCOVER / YOUR WAY</span>
          </div>
        </section>
        <section className="offers-empty-state">
          <span><Sparkles size={23} /></span>
          <div>
            <p className="eyebrow">{offers.length ? 'THE CURRENT EDIT' : 'NO OFFERS PUBLISHED'}</p>
            <h2>{offers.length ? 'A little something extra.' : 'The next good thing is coming.'}</h2>
            <p>There are no confirmed offers to share right now. Explore the stores and dining destinations in the meantime.</p>
            <div className="offers-empty-links">
              <Link to="/stores" className="button button-dark">Explore stores <ArrowUpRight size={16} /></Link>
              <Link to="/dining" className="text-link">Find dining <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
