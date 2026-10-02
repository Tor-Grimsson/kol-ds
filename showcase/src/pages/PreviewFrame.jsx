import { useParams } from 'react-router-dom'
import { PREVIEWS } from '../lib/previews-registry.js'
import ErrorBoundary from '../lib/ErrorBoundary.jsx'

/** PreviewFrame — /components/preview/:name, a framed preview on a bare page (the iframe's src). The
 *  preview owns the whole viewport: a fixed rail, a 100vh scaffold or an overlay lands here, not over
 *  the showcase. */
export default function PreviewFrame() {
  const { name } = useParams()
  const C = PREVIEWS[name]?.Component
  if (!C) return <p className="kol-mono-14 text-meta p-6">No preview named “{name}”.</p>
  return <div className="min-h-dvh w-full bg-surface-primary"><ErrorBoundary><C /></ErrorBoundary></div>
}
