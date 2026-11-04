import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { events } from '../../data/events'
import { mallInfo } from '../../data/mallInfo'
import ImageWithFallback from '../../components/common/ImageWithFallback'
import PageTransition from '../../components/layout/PageTransition'

export default function EventsPage() {
  const [active, setActive] = useState(0)
  const event = events[active]

  return (
    <PageTransition>
      <div className="events-page">
        <section className="events-masthead">
          <div className="events-masthead-copy">
            <p className="eyebrow"><span className="eyebrow-line" />A REASON TO STAY A LITTLE LONGER</p>
            <h1>What&rsquo;s on<br /><em>at Orion.</em></h1>
            <p>From seasonal celebrations to the simple joy of getting together, find a moment to make your own.</p>
          </div>
          <div className="events-hero-art">
            <ImageWithFallback
              src={events[0]?.image || '/images/events/season-of-light.svg'}
              alt={events[0]?.title || 'Orion event'}
              className="events-hero-image"
            />
            <span className="events-hero-stamp">THE ORION<br />CALENDAR</span>
          </div>
        </section>

        <section className="events-featured">
          <div className="event-selector">
            {events.map((item, index) => (
              <button
                key={item.id}
                className={active === index ? 'active' : ''}
                onClick={() => setActive(index)}
              >
                <span>0{index + 1}</span>
                <b>{item.title}</b>
                <small>{item.date}</small>
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.article
              className="event-selected"
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="event-selected-art">
                <ImageWithFallback
                  src={event.image}
                  alt={event.title}
                  className="event-selected-image"
                />
                <span>{String(active + 1).padStart(2, '0')}</span>
              </div>
              <div className="event-selected-copy">
                <p className="eyebrow">{event.type} &middot; {event.date}</p>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <span className="event-location"><MapPin size={14} />{event.location}</span>
                <Link to={`/events/${event.slug}`} className="text-link">Discover this event <ArrowUpRight size={14} /></Link>
              </div>
            </motion.article>
          </AnimatePresence>
        </section>

        <section className="events-calendar">
          <div>
            <span className="eyebrow">THE ORION CALENDAR</span>
            <h2>Make a little<br /><em>room for more.</em></h2>
          </div>
          <div className="calendar-note">
            <Clock3 size={20} />
            <p>Dates and event details are being confirmed. Check back soon for the latest from Orion Mall Gorakhpur.</p>
            <Link to="/visit">Visitor information <ArrowUpRight size={14} /></Link>
          </div>
        </section>
        <p className="page-disclaimer">{mallInfo.note}</p>
      </div>
    </PageTransition>
  )
}
