import { Component } from 'react'

/**
 * Degrades a crashing live demo to a quiet note instead of taking down the
 * whole gallery — the mined usage reference below it still renders.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return <div className="kol-type-mono-xs text-meta opacity-60">live demo unavailable — see usage below</div>
    }
    return this.props.children
  }
}
