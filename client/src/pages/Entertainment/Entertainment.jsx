import { Link } from 'react-router-dom'
import { ArrowUpRight, Clapperboard, Gamepad2 } from 'lucide-react'
import { entertainment } from '../../data/entertainment'
import { floorLabel, floorName } from '../../data/floors'
import PageTransition from '../../components/layout/PageTransition'

const destinationImages = {
  3: '/images/entertainment/gaming.webp',
  4: '/images/entertainment/cinema.webp',
}

export default function EntertainmentPage() {
  return (
    <PageTransition>
      <div className="entertainment-page">
        <section className="entertainment-hero">
          <div className="entertainment-copy">
            <p className="eyebrow"><span className="eyebrow-line" />PLAY, WATCH, REPEAT</p>
            <h1>Make a day<br /><em>of the good stuff.</em></h1>
            <p>Bowling, arcade simulators, VR, indoor cricket and the big-screen experience—all in the directory, on the floors they belong.</p>
            <div className="entertainment-tags">
              <span><Gamepad2 size={16} /> F3 · GAME ZONE</span>
              <span><Clapperboard size={16} /> F4 · CINEMA</span>
            </div>
          </div>
          <div className="entertainment-hero-art">
            <img src="/images/entertainment/cinema.webp" alt="Cinema interior" className="entertainment-hero-image" />
            <span className="cinema-side-label">TAKE YOUR SEAT</span>
          </div>
        </section>

        <section className="entertainment-destinations">
          <div className="section-title">
            <div>
              <p className="eyebrow">YOUR NEXT SCENE</p>
              <h2>Make it<br /><em>an experience.</em></h2>
            </div>
            <p className="section-blurb">{entertainment.length} entertainment destinations across two floors.</p>
          </div>
          <div className="entertainment-cards">
            {entertainment.map((store) => (
              <Link key={store.id} to={`/stores/${store.slug}`} className="entertainment-card">
                <div className="ent-card-art">
                  <img src={destinationImages[store.floor]} alt="" className="ent-card-art-image" loading="lazy" />
                  <small>{floorLabel(store.floor)} · {floorName(store.floor)}</small>
                </div>
                <div className="entertainment-card-copy">
                  <span>{store.category}</span>
                  <h3>{store.brand}</h3>
                  <p>{store.description}</p>
                  <span className="entertainment-card-link">Destination details <ArrowUpRight size={16} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
