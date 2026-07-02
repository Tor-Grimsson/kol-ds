import ErrorBoundary from './ErrorBoundary.jsx'

/**
 * DemoStage — the ONE presentation contract for every demo render.
 *
 * A demo file exports `default` (the demo) and optionally
 * `export const stage = 'hug' | 'sm' | 'md' | 'lg' | 'full'`.
 * The stage owns layout (centering, width cap, gap); the demo owns only
 * component usage. Used by the component-page preview, the Home wall, the
 * /components index cards, and blocks — same render everywhere.
 *
 *   hug  — intrinsic-size content, centred (buttons, badges, toggles)
 *   sm/md/lg — full-width column capped at 20/28/40rem (fields, panels)
 *   full — stretches to the canvas (tables, heroes, footers)
 */

const STAGE = {
  hug: 'flex flex-wrap items-center justify-center gap-4',
  sm: 'w-full max-w-[20rem] flex flex-col gap-4',
  md: 'w-full max-w-[28rem] flex flex-col gap-4',
  lg: 'w-full max-w-[40rem] flex flex-col gap-4',
  full: 'w-full',
}

export default function DemoStage({ entry }) {
  const C = entry?.Component
  if (!C) return null
  return (
    <div className={STAGE[entry.stage] ?? STAGE.hug}>
      <ErrorBoundary><C /></ErrorBoundary>
    </div>
  )
}
