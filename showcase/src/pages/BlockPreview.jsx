import { useParams } from 'react-router-dom'
import DemoStage from '../lib/DemoStage.jsx'
import { getBlock } from '../lib/blocks-registry.js'

/**
 * BlockPreview — the BARE render of a single block at /blocks/preview/:slug
 * (the shadcn /view/<block> model). Two jobs: (1) the src of the resizable
 * <iframe> in BlockViewer; (2) the "open in new tab" page. No TopBar, no
 * padding, no frame — a `full` block fills the viewport edge-to-edge so it
 * reads as product UI; panel blocks (sm/md/lg/hug) centre on the surface the
 * way they'd sit on a real page.
 */
export default function BlockPreview() {
  const { slug } = useParams()
  const entry = getBlock(slug)

  if (!entry) {
    return (
      <div className="flex h-dvh items-center justify-center bg-surface-primary">
        <p className="kol-mono-13 text-meta">No block named “{slug}”.</p>
      </div>
    )
  }

  if (entry.stage === 'full') {
    const C = entry.Component
    return (
      <div className="h-dvh w-full overflow-auto bg-surface-primary">
        <C />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-surface-primary p-6">
      <DemoStage entry={entry} />
    </div>
  )
}
