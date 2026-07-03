import DemoStage from './DemoStage.jsx'

/**
 * CollectionPreview — the BARE render of one collection item at
 * `<previewBase>/:slug` (the shadcn /view/<block> model). Two jobs: the src of
 * the viewer's resizable <iframe>, and the "open standalone" page. No chrome —
 * a `full` item fills the viewport edge-to-edge (product UI); other stages
 * centre on the surface the way they'd sit on a real page.
 */
export default function CollectionPreview({ slug, getItem }) {
  const entry = getItem(slug)

  if (!entry) {
    return (
      <div className="flex h-dvh items-center justify-center bg-surface-primary">
        <p className="kol-mono-13 text-meta">No entry named “{slug}”.</p>
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

  /* m-auto (not items/justify-center): centers when the content fits, but
   * degrades to scrollable from the start edge when it overflows — flex
   * centering would crop the overflowing start. */
  return (
    <div className="flex min-h-dvh w-full overflow-auto bg-surface-primary p-6">
      <div className="m-auto">
        <DemoStage entry={entry} />
      </div>
    </div>
  )
}
