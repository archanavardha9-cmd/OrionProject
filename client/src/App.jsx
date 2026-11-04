import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter, SiteHeader } from './components/SiteChrome'
import { demoEvents, demoStores } from './data'
import {
  DiningPage, EventDetailsPage, EventsPage, ExplorePage, EntertainmentPage, HomePage,
  NotFoundPage, OffersPage, StoreDetailsPage, StoresPage, VisitPage,
} from './pages/Pages'
import './App.css'

const AdminPage = lazy(() => import('./AdminPage'))

const pageTitles = {
  '/': 'Orion Mall Gorakhpur — More Than Shopping',
  '/explore': 'Explore the Mall — Orion Mall Gorakhpur',
  '/stores': 'Store Directory — Orion Mall Gorakhpur',
  '/dining': 'Dining — Orion Mall Gorakhpur',
  '/events': 'Events — Orion Mall Gorakhpur',
  '/offers': 'Offers — Orion Mall Gorakhpur',
  '/entertainment': 'Entertainment — Orion Mall Gorakhpur',
  '/visit': 'Plan Your Visit — Orion Mall Gorakhpur',
}

function RoutedExperience() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const store = location.pathname.startsWith('/stores/')
    ? demoStores.find((item) => item.slug === location.pathname.slice('/stores/'.length))
    : null
  const event = location.pathname.startsWith('/events/')
    ? demoEvents.find((item) => item.slug === location.pathname.slice('/events/'.length) || item._id === location.pathname.slice('/events/'.length))
    : null
  const title = pageTitles[location.pathname]
    || (location.pathname.startsWith('/stores/') ? `${store?.name || 'Store Details'} — Orion Mall Gorakhpur`
      : location.pathname.startsWith('/events/') ? `${event?.title || 'Event Details'} — Orion Mall Gorakhpur`
        : location.pathname === '/admin' || isAdmin ? 'Mall Administration — Orion'
          : 'Find Your Way — Orion Mall Gorakhpur')

  useEffect(() => {
    document.title = title
    window.scrollTo(0, 0)
  }, [location.pathname, title])

  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main className={location.pathname === '/explore' ? 'route-main route-main-explore' : 'route-main'}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/:slug" element={<StoreDetailsPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetailsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/entertainment" element={<EntertainmentPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="/admin/*" element={<Suspense fallback={<div className="scene-loader admin-loader">Opening administration</div>}><AdminPage /></Suspense>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && <SiteFooter />}
    </>
  )
}

export default function App() {
  return <BrowserRouter><RoutedExperience /></BrowserRouter>
}
