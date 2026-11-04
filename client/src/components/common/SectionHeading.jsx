import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SectionHeading({
  number,
  eyebrow,
  title,
  copy,
  to,
  linkLabel,
  className = '',
}) {
  return (
    <div className={`section-title ${className}`.trim()}>
      <div>
        <p className="eyebrow">
          <span className="eyebrow-line" />
          {eyebrow}
        </p>
        <h2>{title}</h2>
      </div>
      <div className="section-title-aside">
        {number && <span className="section-number">{number}</span>}
        {copy && <p>{copy}</p>}
        {to && (
          <Link className="text-link" to={to}>
            {linkLabel || 'Discover'}<ArrowUpRight size={16} />
          </Link>
        )}
      </div>
    </div>
  )
}
