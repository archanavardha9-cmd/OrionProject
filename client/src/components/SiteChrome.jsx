import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowDownRight, ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['Explore', '/explore'],
  ['Stores', '/stores'],
  ['Dining', '/dining'],
  ['Events', '/events'],
  ['Offers', '/offers'],
  ['Entertainment', '/entertainment'],
  ['Visit', '/visit'],
]
const currentYear = new Date().getFullYear()

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isExploring = pathname === '/explore'
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Orion Mall Gorakhpur home" onClick={() => setOpen(false)}>
        <span className="brand-mark">✳</span>
        <span>ORION<small>GORAKHPUR</small></span>
      </Link>
      <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
        {links.map(([label, path]) => (
          <NavLink key={path} to={path} end={path === '/explore'} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
        <Link className="mobile-nav-cta" to={isExploring ? '/' : '/explore'} onClick={() => setOpen(false)}>{isExploring ? 'Exit explorer' : 'Enter the mall'}{isExploring ? <ArrowLeft size={15} /> : <ArrowUpRight size={15} />}</Link>
      </nav>
      <Link className="header-cta" to={isExploring ? '/' : '/explore'}>{isExploring ? 'Exit explorer' : 'Explore the mall'}{isExploring ? <ArrowLeft size={15} /> : <ArrowUpRight size={15} />}</Link>
      <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="brand footer-brand" to="/"><span className="brand-mark">✳</span><span>ORION<small>GORAKHPUR</small></span></Link>
          <p>A place to gather.<br />A little closer to everything.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">DISCOVER</span>{links.slice(0, 4).map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}</div>
          <div><span className="footer-label">PLAN YOUR VISIT</span>{links.slice(4).map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}</div>
          <div><span className="footer-label">FIND US</span><span>Gorakhpur, Uttar Pradesh</span><span>Exact address to be confirmed</span><Link to="/visit">Visitor information <ArrowUpRight size={13} /></Link><span className="footer-label footer-label-spaced">SOCIAL & LEGAL</span><span>Social channels to be confirmed</span><span>Privacy & terms to be confirmed</span></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {currentYear} Orion Mall Gorakhpur</span>
        <span>Sample content shown for experience preview</span>
        <Link to="/visit">Contact & visitor information <ArrowDownRight size={13} /></Link>
      </div>
    </footer>
  )
}
