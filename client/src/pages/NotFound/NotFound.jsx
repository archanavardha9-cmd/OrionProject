import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageTransition from '../../components/layout/PageTransition'

export default function NotFoundPage() {
  return (
    <PageTransition>
      <section className="not-found-page">
        <div className="not-found-copy">
          <p className="eyebrow"><span className="eyebrow-line" />A LITTLE DETOUR</p>
          <h1>This isn&rsquo;t<br /><em>the way.</em></h1>
          <p>The page you&rsquo;re looking for has moved, or may not exist yet. Let&rsquo;s find your way back.</p>
          <Link className="button button-dark" to="/">Back to the beginning <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </PageTransition>
  )
}
