import { Component } from 'react'
import Button from '../atoms/Button.jsx'

/**
 * ErrorBoundary — class error boundary (boundaries can't be hooks). Catches
 * render errors in its subtree and swaps in a centered full-screen fallback
 * ("Something went wrong") with two recovery actions: retry in place and go
 * home. A dev-only error/stack panel renders on Vite dev builds
 * (`import.meta.env.DEV`) — prod users never see a stack. Wrap app regions
 * so a single crash can't blank the whole app.
 *
 * @param {ReactNode} children  the guarded subtree
 * @param {string}    homeHref  "Go home" destination (default '/')
 * @param {Function}  fallback  ({ error, errorInfo, reset }) => ReactNode — replaces the built-in fallback screen
 * @param {Function}  onReset   called after "Try again" clears the error state
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onReset?.()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { error, errorInfo } = this.state
    if (this.props.fallback) {
      return this.props.fallback({ error, errorInfo, reset: this.handleReset })
    }

    return (
      <div className="min-h-screen w-full flex items-center justify-center px-8 bg-surface-primary">
        <div className="max-w-[600px] space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="kol-sans-display-02">Something went wrong</h1>
            <p className="kol-mono-16 opacity-70">
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>
          </div>

          {import.meta.env.DEV && error && (
            <div className="text-left p-6 rounded overflow-auto max-h-[300px] bg-surface-secondary">
              <p className="kol-mono-12 font-bold mb-2">Error Details (dev only):</p>
              <pre className="kol-mono-12 whitespace-pre-wrap break-all">
                {error.toString()}
                {errorInfo?.componentStack}
              </pre>
            </div>
          )}

          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="primary" onClick={this.handleReset}>Try again</Button>
            <Button variant="secondary" href={this.props.homeHref ?? '/'}>Go home</Button>
          </div>
        </div>
      </div>
    )
  }
}
