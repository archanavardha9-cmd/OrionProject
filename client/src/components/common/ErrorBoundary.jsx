import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false, message: '' }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' }
  }

  componentDidCatch(error) {
    // Keep a console trace for debugging; UI stays recoverable.
    console.error(error)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback({ error: new Error(this.state.message), reset: () => this.setState({ hasError: false, message: '' }) })
      return (
        <div className="route-loading" role="alert" style={{ minHeight: 240, padding: 24, textAlign: 'center', display: 'grid', placeItems: 'center', gap: 12 }}>
          <div>
            <strong>This section could not load.</strong>
            <p style={{ margin: '8px 0 0', opacity: 0.8 }}>{this.state.message}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="button button-outline" onClick={() => this.setState({ hasError: false, message: '' })}>Try again</button>
            <Link className="button button-dark" to="/">Go home</Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
