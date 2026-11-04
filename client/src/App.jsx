import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import './App.css'

const AdminPage = lazy(() => import('./AdminPage'))

import HomePage from './pages/Home/Home'
import StoresPage from './pages/Stores/Stores'
import StoreDetailsPage from './pages/StoreDetails/StoreDetails'
import DiningPage from './pages/Dining/Dining'
import EventsPage from './pages/Events/Events'
import EventDetailsPage from './pages/EventDetails/EventDetails'
import OffersPage from './pages/Offers/Offers'
import EntertainmentPage from './pages/Entertainment/Entertainment'
import VisitPage from './pages/Visit/Visit'
import NotFoundPage from './pages/NotFound/NotFound'
import ExplorerPage from './features/mall-explorer/Explorer'

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
  const storeSlug = location.pathname.startsWith('/stores/') ? location.pathname.slice('/stores/'.length) : null
  const eventSlug = location.pathname.startsWith('/events/') ? location.pathname.slice('/events/'.length) : null
  const title = pageTitles[location.pathname]
    || (storeSlug ? `${storeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} — Orion Mall Gorakhpur`
      : eventSlug ? `${eventSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} — Orion Mall Gorakhpur`
        : location.pathname === '/admin' || isAdmin ? 'Mall Administration — Orion'
          : 'Find Your Way — Orion Mall Gorakhpur')

  useEffect(() => {
    document.title = title
    window.scrollTo(0, 0)
  }, [location.pathname, title])

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={location.pathname === '/explore' ? 'route-main route-main-explore' : 'route-main'}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorerPage />} />
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
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return <BrowserRouter><RoutedExperience /></BrowserRouter>
}
