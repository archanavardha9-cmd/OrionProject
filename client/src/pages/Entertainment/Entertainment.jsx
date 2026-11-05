import { Link } from 'react-router-dom'
import { ArrowUpRight, Clapperboard, Sparkles } from 'lucide-react'
import { entertainment } from '../../data/entertainment'
import { floorLabel } from '../../data/stores'
import { mallInfo } from '../../data/mallInfo'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import PageTransition from '../../components/layout/PageTransition'

export default function EntertainmentPage() {
  return (
    <PageTransition>
      <div className="entertainment-page">
        <section className="entertainment-hero">
          <div className="entertainment-copy">
            <p className="eyebrow"><span className="eyebrow-line" />A LITTLE MORE TIME TOGETHER</p>
            <h1>Stay for<br /><em>the good part.</em></h1>
            <p>The curtain rises. The lights soften. There&rsquo;s always room for one more story.</p>
            <div className="entertainment-tags">
              <span><Clapperboard size={15} /> CINEMA</span>
              <span><Sparkles size={15} /> FAMILY FUN</span>
            </div>
          </div>
          <div className="entertainment-hero-art">
            <ImageWithFallback
              src="/images/entertainment/cinema.webp"
              alt="Entertainment destinations at Orion Mall"
              className="entertainment-hero-image"
            />
            <span className="cinema-side-label">TAKE YOUR SEAT</span>
          </div>
        </section>

        <section className="entertainment-destinations">
          <div className="section-title">
            <div>
              <p className="eyebrow">PLAY YOUR WAY</p>
              <h2>Pick your<br /><em>next scene.</em></h2>
            </div>
            <p className="section-blurb">Entertainment destinations with details to be confirmed by the mall.</p>
          </div>
          <div className="entertainment-cards">
            {entertainment.map((store, index) => (
              <Link key={store.id} to={`/stores/${store.slug}`} className="entertainment-card">
                <div className="ent-card-art">
                  <ImageWithFallback
                    src={store.image}
                    alt={store.name}
                    className="ent-card-art-image"
                  />
                  <small>{floorLabel(store.floor)} / {store.unit}</small>
                </div>
                <div>
                  <span>{store.category}</span>
                  <h3>{store.name}</h3>
                  <p>{store.description}</p>
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ))}
          </div>
          <p className="page-disclaimer">{mallInfo.note}</p>
        </section>
      </div>
    </PageTransition>
  )
}
