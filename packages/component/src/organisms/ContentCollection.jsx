import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

/**
 * ContentCollection — the container half of the content-card system: the
 * grid/list switch plus the motion that belongs to it. Animation lives in
 * the wrapper — the only place it can (06-content-card-system.md §6);
 * cards never animate themselves.
 *
 * Children are ContentItem / ContentCard / ContentRow (or anything). The
 * collection owns the enter stagger, keyed to `form` so the switch re-runs
 * it. Uses the house curve (--kol-ease-house).
 *
 * ponytail: form switch re-mounts with a stagger, no FLIP — add FLIP
 * (measure → invert → play) when a consumer needs card↔row to tween.
 *
 * BOTH FORMS ARE GRIDS (user call 2026-08-15: *"layout always wraps the items
 * in a grid, at least 99% of the time"*) — but a LIST IS ONE COLUMN. That is
 * what a list is on a page: one entry per line, full width, fields laid across
 * it. kol-website's /work listing is exactly that, and so is every listing
 * anyone has built. A multi-column wall of rows is not a list, it is a wall.
 *
 * (kol-monitor's `repeat(4, 1fr)` list is a dense file-browser cut, not the
 * general case — a consumer that wants it passes `listMin`.)
 *
 * The GRID's count derives from the wall's OWN width, never the viewport, and
 * never a fixed track count — 05-layout-systems.md, the card-wall law: *"the
 * shell rails eat width that viewport breakpoints can't see, so a forced count
 * compresses every card"* (user call 2026-08-09). Hence `auto-fill` +
 * `minmax()`, with the law's minimum as the default — written in PX, not rem
 * (user ruling 2026-08-15). A track width is a LAYOUT measure, not type: rem
 * ties it to the root font-size, so a user bumping their browser text size
 * silently re-counts the columns of every wall in the estate.
 *
 * @param {string}  form     'grid' | 'list'
 * @param {string}  min      grid track minimum, card form (default 320px)
 * @param {string}  listMin  OPT-IN: makes the list multi-column too, for a dense
 *                           file-browser cut. Unset = one full-width column
 * @param {number}  gap      px between items. UNSET reads the token for the
 *                           form — `--kol-gap-wall-grid` (24) or
 *                           `--kol-gap-wall-list` (8) — the same treatment
 *                           `--kol-pad-card-*` gets, and for the same reason:
 *                           these two numbers were re-typed as a ternary at
 *                           nine call sites. Pass a number only to differ
 * @param {boolean} stagger  enter animation on/off (reduced motion wins)
 */
export default function ContentCollection({
  form = 'grid',
  min = '320px',
  listMin,
  gap,
  stagger = true,
  children,
  className = '',
}) {
  const reduced = usePrefersReducedMotion()
  const animate = stagger && !reduced
  const items = Array.isArray(children) ? children.flat() : [children]
  /* ruled 2026-08-15 — the shipped 24/8 are TOKENS now, so `gap` is only passed
   * when a consumer genuinely differs from the house. A number still wins. */
  const g = gap != null
    ? `${gap}px`
    : `var(--kol-gap-wall-${form === 'list' ? 'list' : 'grid'})`

  return (
    <ul
      key={form}
      className={`m-0 list-none p-0 ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: form === 'list'
          ? (listMin ? `repeat(auto-fill, minmax(${listMin}, 1fr))` : '1fr')
          : `repeat(auto-fill, minmax(${min}, 1fr))`,
        gap: g,
      }}
    >
      {items.map((child, i) =>
        child == null ? null : (
          <li
            key={child.key ?? i}
            className={animate ? 'kol-collection-item' : undefined}
            style={animate ? { animationDelay: `${i * 40}ms` } : undefined}
          >
            {child}
          </li>
        ),
      )}
    </ul>
  )
}
