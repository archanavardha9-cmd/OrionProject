import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import { events } from '../../data/events'
import PageTransition from '../../components/layout/PageTransition'

export default function EventsPage() {
  return (
    <PageTransition>
      <div className="events-page">
        <section className="events-masthead">
          <div className="events-masthead-copy">
            <p className="eyebrow"><span className="eyebrow-line" />THE ORION CALENDAR</p>
            <h1>Make a little<br /><em>room for more.</em></h1>
            <p>Find mall happenings here when new dates and details are announced.</p>
          </div>
          <div className="events-hero-art">
            <img src="/images/homepage/mall-events.webp" alt="The Orion Mall atrium" className="events-hero-image" />
            <span className="events-hero-stamp">ORION<br />MOMENTS</span>
          </div>
        </section>
        <section className="events-empty-state">
          <span><CalendarDays size={23} /></span>
          <div>
            <p className="eyebrow">NOTHING ON THE CALENDAR JUST YET</p>
            <h2>{events.length ? 'The next moment is near.' : 'New moments are on their way.'}</h2>
            <p>No events have been announced. Check back for confirmed dates and details.</p>
            <Link to="/stores" className="text-link">Explore the directory <ArrowUpRight size={16} /></Link>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
