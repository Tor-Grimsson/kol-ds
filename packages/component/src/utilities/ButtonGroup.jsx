/**
 * ButtonGroup — responsive layout wrapper for a group of Buttons: stacked
 * full-width on mobile, horizontal row from `sm` up, aligned left / center /
 * right. Pure layout — children compose at the call site and render as-is
 * (nothing is cloned, no props injected); all button behavior lives on each
 * Button. `center` (default) hugs its content and self-centers; `left` /
 * `right` stay full-width block. Alignment classes come from static lookup
 * maps of complete literals — never interpolated — so Tailwind's scanner
 * sees them.
 *
 * @param {'left'|'center'|'right'} align horizontal alignment + container layout mode (default 'center')
 * @param {string}    title     optional heading rendered above the group, authored at the call site
 * @param {string}    className extra container classes (appended) — note this lands on the OUTER
 *   container, not the flex row that carries the gap; the gap is responsive by default (8 stacked,
 *   16 as a row) rather than reachable, so there is nothing to reach for.
 * @param {ReactNode} children  the Buttons
 */

const CONTAINER = {
  left: 'flex flex-col w-full',
  center: 'flex sm:inline-flex flex-col w-full sm:w-auto sm:mx-auto',
  right: 'flex flex-col w-full',
}

const JUSTIFY = {
  left: 'sm:justify-start',
  center: 'sm:justify-center',
  right: 'sm:justify-end',
}

export default function ButtonGroup({ align = 'center', title, className = '', children }) {
  return (
    <div className={[CONTAINER[align] || CONTAINER.center, className].filter(Boolean).join(' ')}>
      {title && <h3 className="kol-sans-heading-05 text-emphasis mb-6">{title}</h3>}
      <div
        className={[
          /* THE GAP IS TWO JOBS, NOT ONE (ButtonGroupResponsiveGap, kol-website
           * 2026-08-31). The group changes axis at `sm`, so a single `gap-4` was
           * doing horizontal separation between two side-by-side buttons AND
           * vertical separation between two full-width stacked ones. Those do not
           * want the same number: 16 reads too open stacked (user: "16 is way too
           * big, at least lets see 8 or 12"), and 8 is what looks right on device.
           * A responsive default rather than a prop — the stacked case IS the
           * narrow viewport, so the value is pickable once instead of per
           * consumer. The row keeps today's 16 and nothing moves at `sm` and up. */
          'flex flex-col gap-2 sm:flex-row sm:gap-4 sm:items-center',
          JUSTIFY[align] || JUSTIFY.center,
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
