import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['Explore', '/explore'],
  ['Stores', '/stores'],
  ['Dining', '/dining'],
  ['Events', '/events'],
  ['Offers', '/offers'],
  ['Entertainment', '/entertainment'],
  ['Visit', '/visit'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isExploring = pathname === '/explore'

  return (
    <header className="site-header">
      <Link
        className="brand"
        to="/"
        aria-label="Orion Mall Gorakhpur home"
        onClick={() => setOpen(false)}
      >
        <span className="brand-mark">✳</span>
        <span>
          ORION<small>GORAKHPUR</small>
        </span>
      </Link>
      <nav className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        {links.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/explore'}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}
        <Link
          className="mobile-nav-cta"
          to={isExploring ? '/' : '/explore'}
          onClick={() => setOpen(false)}
        >
          {isExploring ? 'Exit explorer' : 'Enter the mall'}
          {isExploring ? <ArrowLeft size={15} /> : <ArrowUpRight size={15} />}
        </Link>
      </nav>
      <Link className="header-cta" to={isExploring ? '/' : '/explore'}>
        {isExploring ? 'Exit explorer' : 'Explore the mall'}
        {isExploring ? <ArrowLeft size={15} /> : <ArrowUpRight size={15} />}
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  )
}
