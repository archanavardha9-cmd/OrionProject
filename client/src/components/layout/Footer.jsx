import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

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

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">✳</span>
            <span>
              ORION<small>GORAKHPUR</small>
            </span>
          </Link>
          <p>A place to gather.<br />A little closer to everything.</p>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">DISCOVER</span>
            {links.slice(0, 4).map(([label, path]) => (
              <Link key={path} to={path}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <span className="footer-label">PLAN YOUR VISIT</span>
            {links.slice(4).map(([label, path]) => (
              <Link key={path} to={path}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <span className="footer-label">FIND US</span>
            <span>Gorakhpur, Uttar Pradesh</span>
            <Link to="/visit">Visitor information <ArrowUpRight size={13} /></Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {currentYear} Orion Mall Gorakhpur</span>
        <Link to="/visit">Visitor information <ArrowUpRight size={13} /></Link>
      </div>
    </footer>
  )
}
