import { useParams } from 'react-router-dom'
import { DEMOS } from '../lib/demos-registry.js'
import ErrorBoundary from '../lib/ErrorBoundary.jsx'

/** DemoPreview — /components/preview/:name, a framed demo on a bare page (the iframe's src). The
 *  demo owns the whole viewport: a fixed rail, a 100vh scaffold or an overlay lands here, not over
 *  the showcase. */
export default function DemoPreview() {
  const { name } = useParams()
  const C = DEMOS[name]?.Component
  if (!C) return <p className="kol-mono-14 text-meta p-6">No demo named “{name}”.</p>
  return <div className="min-h-dvh w-full bg-surface-primary"><ErrorBoundary><C /></ErrorBoundary></div>
}
