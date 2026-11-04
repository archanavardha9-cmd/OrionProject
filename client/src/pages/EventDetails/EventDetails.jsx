import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react'
import { findEvent } from '../../data/events'
import { floorLabel } from '../../data/stores'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import PageTransition from '../../components/layout/PageTransition'

function NotFoundInline() {
  return (
    <section className="not-found-inline">
      <div className="not-found-copy">
        <p className="eyebrow"><span className="eyebrow-line" />A LITTLE DETOUR</p>
        <h1>This isn&rsquo;t<br /><em>the way.</em></h1>
        <p>The event you&rsquo;re looking for isn&rsquo;t listed.</p>
        <Link className="button button-dark" to="/events">Back to events <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  )
}

export default function EventDetailsPage() {
  const { slug } = useParams()
  const event = findEvent(slug)
  if (!event) return <NotFoundInline />

  return (
    <PageTransition>
      <article className="event-detail-page">
        <Link to="/events" className="back-link"><ArrowLeft size={15} /> ALL EVENTS</Link>
        <div className="event-detail-art">
          <ImageWithFallback
            src={event.image}
            alt={event.title}
            className="event-detail-image"
          />
          <span>ORION / MOMENTS</span>
        </div>
        <div className="event-detail-copy">
          <p className="eyebrow">{event.type} &middot; {event.date}</p>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <span className="event-location"><MapPin size={14} />{event.location} &middot; {floorLabel(event.floor)}</span>
          <p className="page-disclaimer">Dates and participation details to be confirmed.</p>
          <a className="text-link" href="/visit">Plan your visit <ArrowUpRight size={14} /></a>
        </div>
      </article>
    </PageTransition>
  )
}
