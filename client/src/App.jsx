import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

const AdminPage = lazy(() => import('./AdminPage'))
const ExplorerPage = lazy(() => import('./features/mall-explorer/Explorer'))

import HomePage from './pages/Home/Home'
import StoreSpacePage from './pages/StoreSpace/StoreSpace'
import DiningPage from './pages/Dining/Dining'
import EventsPage from './pages/Events/Events'
import EventDetailsPage from './pages/EventDetails/EventDetails'
import OffersPage from './pages/Offers/Offers'
import EntertainmentPage from './pages/Entertainment/Entertainment'
import VisitPage from './pages/Visit/Visit'
import NotFoundPage from './pages/NotFound/NotFound'
import './styles/redesign.css'

const pageTitles = {
  '/': 'Orion Mall Gorakhpur — More Than Shopping',
  '/explore': 'Explore the Mall — Orion Mall Gorakhpur',
  '/stores': 'Stores — Orion Mall Gorakhpur',
  '/dining': 'Dining — Orion Mall Gorakhpur',
  '/events': 'Events — Orion Mall Gorakhpur',
  '/offers': 'Offers — Orion Mall Gorakhpur',
  '/entertainment': 'Entertainment — Orion Mall Gorakhpur',
  '/visit': 'Plan Your Visit — Orion Mall Gorakhpur',
}

function StoreRedirect() {
  const [searchParams] = useSearchParams()
  const qs = searchParams.toString()
  return <Navigate to={qs ? `/stores?${qs}` : '/stores'} replace />
}

function RoutedExperience() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const [searchParams] = useSearchParams()
  const storeSlug = searchParams.get('slug')
  const eventSlug = location.pathname.startsWith('/events/') ? location.pathname.slice('/events/'.length) : null
  const title = pageTitles[location.pathname]
    || (storeSlug && location.pathname === '/stores' ? 'Stores — Orion Mall Gorakhpur'
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
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<div className="route-loading" role="status">Opening the mall experience</div>}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorerPage />} />
              <Route path="/stores" element={<StoreSpacePage />} />
              <Route path="/store" element={<StoreRedirect />} />
              <Route path="/dining" element={<DiningPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:slug" element={<EventDetailsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/entertainment" element={<EntertainmentPage />} />
              <Route path="/visit" element={<VisitPage />} />
              <Route path="/admin/*" element={<Suspense fallback={<div className="scene-loader admin-loader">Opening administration</div>}><AdminPage /></Suspense>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}

export default function App() {
  return <BrowserRouter><RoutedExperience /></BrowserRouter>
}
