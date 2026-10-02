import ErrorBoundary from './ErrorBoundary.jsx'

/**
 * PreviewStage — the ONE presentation contract for every preview render.
 *
 * A preview file exports `default` (the preview) and optionally
 * `export const stage = 'hug' | 'sm' | 'md' | 'lg' | 'full'`.
 * The stage owns layout (centering, width cap, gap); the preview owns only
 * component usage. Used by the component-page preview, the Home wall, the
 * /components index cards, and blocks — same render everywhere.
 *
 *   hug  — intrinsic-size content, centred (buttons, badges, toggles)
 *   sm/md/lg — full-width column capped at 20/28/40rem (fields, panels)
 *   full — stretches to the canvas (tables, heroes, footers)
 */

/* mx-auto: capped stages centre themselves so they behave in any w-full
 * parent (CollectionPreview) as well as in parents that centre for them. */
const STAGE = {
  hug: 'flex flex-wrap items-center justify-center gap-4',
  sm: 'w-full max-w-[20rem] mx-auto flex flex-col gap-4',
  md: 'w-full max-w-[28rem] mx-auto flex flex-col gap-4',
  lg: 'w-full max-w-[40rem] mx-auto flex flex-col gap-4',
  full: 'w-full',
}

/* `variant` / `size` are threaded straight through to the preview component. A
 * preview opts in by exporting `variants` / `sizes` (see PreviewCard's toolbar
 * pickers); previews that don't simply ignore the props, so this is additive for
 * all ~180 of them. */
export default function PreviewStage({ entry, variant, tone, size, state }) {
  const C = entry?.Component
  if (!C) return null
  return (
    <div className={STAGE[entry.stage] ?? STAGE.hug}>
      <ErrorBoundary><C variant={variant} tone={tone} size={size} state={state} /></ErrorBoundary>
    </div>
  )
}
