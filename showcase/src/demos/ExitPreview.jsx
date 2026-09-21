import { ExitPreview } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * ExitPreview is the escape hatch out of a preview surface, worn as CMS
 * draft-mode chrome. It is ROUTER-AGNOSTIC: the default renders a plain
 * `<a href="/">`, and a consumer inside a router passes its link component
 * (`linkComponent={Link}`) for client-side nav — react-router-dom used to be a
 * module-level import here, which made kol-component unbuildable without it.
 * The `.kol-exit-preview` classes carry the whole look, including
 * `position: fixed; bottom: 24px; left: 24px; z-index: 9999`, because in its
 * real home it floats over a client site.
 *
 * That is exactly why this demo used to show an EMPTY card with a stray black ×
 * parked in the corner of the viewport: `position: fixed` escapes every ancestor
 * that isn't a containing block, so the component left the preview entirely and
 * overlaid the whole page — on `/components` too, where the index grid mounts
 * every demo it scrolls past.
 *
 * `transform: translateZ(0)` makes this wrapper a containing block for fixed
 * descendants, so the button lands where the demo says it does. The component is
 * unchanged and still floats for real consumers; only the demo is scoped. A
 * preview that cannot show its own component is not a preview.
 */
export default function ExitPreviewDemo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="relative h-24 w-56 overflow-hidden rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-02"
        style={{ transform: 'translateZ(0)' }}
      >
        <ExitPreview />
      </div>
      <span className="kol-helper-12 text-fg-48">
        Router-agnostic · floats bottom-left of its containing block · clicking navigates to the site root
      </span>
    </div>
  )
}
