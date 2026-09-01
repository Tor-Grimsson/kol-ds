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
 * `cols` is the PAGE's call (ContentCollectionCols, kol-website 2026-08-27 —
 * user: "translate that to something usable, consistent"): every filtered grid
 * on the website was ruled as a COLUMN COUNT (`/stack`: one below md, three
 * from md), and back-solving a `min` that happens to yield three on the
 * container ladder is a number nobody picked. `cols={N}` says the count;
 * `min` stays the default for the fluid wall above. Literal class strings —
 * a class built at runtime is never emitted.
 *
 * @param {string}  form     'grid' | 'list'
 * @param {string}  min      grid track minimum, card form (default 320px) — the FLUID wall's floor.
 *                           Emitted as `min(<value>, 100%)`, so it can never demand a column wider
 *                           than its container (ContentGridMinColumnWidth, 2026-08-31)
 * @param {string}  minCol   the floor a `cols` track may not go under. DEFAULTS TO `min` (320px), so
 *                           the count path and the fluid path share one ruled minimum and raising
 *                           `min` raises both (ContentCollectionMinColumnWidth, kol-chess
 *                           2026-08-31). `cols` is a CEILING now, not a command: the wall takes up
 *                           to N columns and drops one rather than let a track go under this.
 *
 *                           WHY NOT A HIGHER DEFAULT. The filer measured a roster row clipping on
 *                           7 of 10 rows at 324 and 3 of 10 at 373, which argues for ~360 — but that
 *                           is a number about a ROW two truncated lines tall, and this floor governs
 *                           every kind. 320 is the width this DS has already ruled as the narrowest
 *                           acceptable track and lived with; applying it to the `cols` path is
 *                           carrying an existing ruling across, where 360 would be a new estate-wide
 *                           law made from one page's evidence. A wall whose content needs more says
 *                           so: `minCol="360px"`.
 * @param {number|object} cols  OPT-IN column count, grid form. A number: 1 below
 *                           md, N from md (1–6). A map per breakpoint
 *                           (`{ md: 3, xl: 4 }` — sm · md · lg · xl · 2xl): 1
 *                           below the first rung, each rung's count from there
 *                           (ContentCollectionColsResponsive, 2026-08-27 —
 *                           user: "can we make it 4 in the biggest breakpoint?").
 *                           Wins over `min`; the list form ignores it
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
/* literal per rung × count — a class built at runtime is never emitted */
/* THE COUNT IS A CEILING NOW, NOT A COMMAND (ContentCollectionMinColumnWidth,
 * kol-chess 2026-08-31). `cols` used to emit `grid-cols-N` and take N columns
 * whatever they measured, which is how a WIDER screen came to clip MORE text:
 * kol-chess's roster ran 1 column at 350 on a phone and 2 columns at 324 at
 * 768 — narrower tracks on a bigger viewport, 7 rows of 10 clipping at both.
 *
 * So the rungs publish a VARIABLE instead of a track list, and one static
 * template below turns it into "at most N, and never narrower than the floor".
 * Literal class strings, as before — a class built at runtime is never emitted
 * by Tailwind's scanner, and arbitrary-property utilities are no exception. */
const COLS_AT = {
  sm:  { 1: 'sm:[--kol-wall-cols:1]',  2: 'sm:[--kol-wall-cols:2]',  3: 'sm:[--kol-wall-cols:3]',  4: 'sm:[--kol-wall-cols:4]',  5: 'sm:[--kol-wall-cols:5]',  6: 'sm:[--kol-wall-cols:6]' },
  md:  { 1: 'md:[--kol-wall-cols:1]',  2: 'md:[--kol-wall-cols:2]',  3: 'md:[--kol-wall-cols:3]',  4: 'md:[--kol-wall-cols:4]',  5: 'md:[--kol-wall-cols:5]',  6: 'md:[--kol-wall-cols:6]' },
  lg:  { 1: 'lg:[--kol-wall-cols:1]',  2: 'lg:[--kol-wall-cols:2]',  3: 'lg:[--kol-wall-cols:3]',  4: 'lg:[--kol-wall-cols:4]',  5: 'lg:[--kol-wall-cols:5]',  6: 'lg:[--kol-wall-cols:6]' },
  xl:  { 1: 'xl:[--kol-wall-cols:1]',  2: 'xl:[--kol-wall-cols:2]',  3: 'xl:[--kol-wall-cols:3]',  4: 'xl:[--kol-wall-cols:4]',  5: 'xl:[--kol-wall-cols:5]',  6: 'xl:[--kol-wall-cols:6]' },
  '2xl': { 1: '2xl:[--kol-wall-cols:1]', 2: '2xl:[--kol-wall-cols:2]', 3: '2xl:[--kol-wall-cols:3]', 4: '2xl:[--kol-wall-cols:4]', 5: '2xl:[--kol-wall-cols:5]', 6: '2xl:[--kol-wall-cols:6]' },
}
const colsClasses = (cols) => {
  const map = typeof cols === 'number' ? { md: cols } : cols
  if (!map || typeof map !== 'object') return ''
  const rungs = Object.keys(COLS_AT).map((bp) => COLS_AT[bp][map[bp]]).filter(Boolean)
  return rungs.length ? ['[--kol-wall-cols:1]', ...rungs].join(' ') : ''
}

export default function ContentCollection({
  form = 'grid',
  min = '320px',
  minCol,
  cols,
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

  const colsCls = form !== 'list' ? colsClasses(cols) : ''
  return (
    <ul
      key={form}
      className={`m-0 list-none p-0 ${colsCls} ${className}`.replace(/\s+/g, ' ').trim()}
      style={{
        /* the ROW's md step is a container query (kol-theme .kol-row) and nothing
         * declared a container until 2026-08-27 (WorkListingRowsAndFilters) — the
         * wall is one, so a row inside it steps on the wall's own width */
        containerType: 'inline-size',
        display: 'grid',
        /* the classes no longer carry tracks — they set `--kol-wall-cols` and this
         * ONE static template reads it, so the count and the floor cannot disagree */
        gridTemplateColumns: colsCls
          /* AT MOST N, AND NEVER NARROWER THAN THE FLOOR. `auto-fill` counts the
           * tracks; the track size is the LARGER of the floor and an even 1/N
           * share, so the wall takes N columns while they fit and drops one the
           * moment a share would go under the floor. `min(100%, …)` is the guard
           * that keeps a single narrow container from overflowing — without it a
           * 350px phone gets one 360px track and a horizontal scrollbar.
           * All of it is CSS: no measurement, no observer, and it works inside
           * the container query this wall already establishes. */
          ? `repeat(auto-fill, minmax(min(100%, max(${minCol ?? min}, calc((100% - (var(--kol-wall-cols, 1) - 1) * ${g}) / var(--kol-wall-cols, 1)))), 1fr))`
          : form === 'list'
            /* minmax(0, 1fr), never a bare 1fr (= minmax(auto, 1fr)): a truncated
           * nowrap line handed its min-content width to the track and a /work row
           * measured 3586px in a 1232px wall (CollectionItemMinWidth, 2026-08-27) */
          /* `min(<fixed>, 100%)`, never a bare fixed track (ContentGridMinColumnWidth,
             * kol-website 2026-08-31). `minmax(352px, 1fr)` DEMANDS 352 whatever the
             * container is, so in a 302px column the track wins and the nearest
             * overflow-x ancestor starts scrolling sideways — `main` scrolled 342 to
             * 372 on /workshop while the page itself never overflowed, which is why it
             * was reported as a broken gutter. Identical above the breakpoint,
             * collapses to the container below it. A content grid may never demand a
             * column wider than what it is in. */
          ? (listMin ? `repeat(auto-fill, minmax(min(${listMin}, 100%), 1fr))` : 'minmax(0, 1fr)')
            : `repeat(auto-fill, minmax(min(${min}, 100%), 1fr))`,
        gap: g,
      }}
    >
      {items.map((child, i) =>
        child == null ? null : (
          <li
            key={child.key ?? i}
            /* min-w-0 on every item: a grid item's min-width is auto by default,
             * and auto = min-content, which is exactly what a truncated line must
             * not get to claim */
            className={`min-w-0 ${animate ? 'kol-collection-item' : ''}`.trim()}
            style={animate ? { animationDelay: `${i * 40}ms` } : undefined}
          >
            {child}
          </li>
        ),
      )}
    </ul>
  )
}
