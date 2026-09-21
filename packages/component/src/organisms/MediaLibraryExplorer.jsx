import { useState } from 'react'
import Divider from '../atoms/Divider.jsx'
import { MediaLibraryBrowse, MediaLibraryLibrary } from './MediaLibraryPages.jsx'

/**
 * MediaLibraryExplorer — the browse tree and the file wall as TWO VIEWS OF ONE
 * SURFACE, which is what `MediaLibraryPages` has called them in its own comments
 * since 2026-09-04 while shipping them as two pages a consumer stacks by hand.
 *
 * WHAT WAS WRONG WITH THE STACK (kol-r2b2, the apps-tier ticket):
 *   - Both pages rendered ALWAYS, the browser at a fixed 800px, so the wall and
 *     the upload drop zone sat below the fold. Pressing Upload scrolled you past
 *     a full-height browser to reach the target.
 *   - Both rendered `LibraryHeader`, so the consumer passed `header={false}` to
 *     suppress a duplicate wordmark, bucket dropdown and gear.
 *   - Both printed a stats line, so the consumer passed `stats={false}` too.
 *   - Both called `useBucketLibrary`, so one bucket was listed twice into two
 *     object lists that could disagree.
 *   - Every shared seam had to be handed to both by the consumer, which is the
 *     divergence-defect family the pages' own comments document at length.
 *
 * WHAT THIS DOES: holds the view, mounts exactly one page, and hands it the
 * seams once. One page mounted means one header, one stats line, one listing and
 * one body — every symptom above falls out of that rather than being patched.
 *
 * WHAT IT DOES NOT DO: it does not hoist `useBucketLibrary` into itself. The two
 * pages keep their own state, so switching views re-lists the bucket and drops
 * column scroll position and selection. Against this repo's fixture that is
 * free; against a live bucket it is a 30s-cached GET. Hoisting the hook and the
 * header into a true shared parent is the deeper fix and it is a rewrite of both
 * page bodies — worth doing, not worth blocking the surface on.
 *
 * `prefix` stays OWNED BY THE CONSUMER (it already was), so the folder you are
 * in survives the switch even though the page instance does not.
 *
 * ADDITIVE. `variant="browse"` and `variant="library"` are untouched, so
 * kol-r2b2 and kol-client-olina keep rendering exactly what they render today.
 */

const VIEWS = [
  { value: 'browse', label: 'BROWSE' },
  { value: 'files', label: 'FILES' },
]

export default function MediaLibraryExplorer({
  view: viewProp,
  onViewChange,
  defaultView = 'browse',
  headerActions,
  className = '',
  ...pageProps
}) {
  const [ownView, setOwnView] = useState(defaultView)
  const view = viewProp ?? ownView
  const setView = (v) => { setOwnView(v); onViewChange?.(v) }

  /* The switch rides `headerActions` rather than being a fourth thing in the
   * header's own markup: the header already has a slot for consumer chrome, and
   * putting the view control there keeps it beside the bucket dropdown where
   * every reference product puts it. The consumer's own actions follow it.
   *
   * HIDDEN BELOW `md`. At 390 the header carries a wordmark, a bucket dropdown
   * and up to four icons; adding a two-segment strip pushed the strip off the
   * right edge and truncated the wordmark to three glyphs. The pages already
   * take the mobile tab pill (`tabs` / `activeTab` / `onTabChange`), which is
   * the same control for the same question — so the phone keeps the pill and
   * the desktop keeps the strip, rather than both competing for one row.
   *
   * BARE TEXT, NOT A `SegmentedToggle`. This surface already has a switch
   * idiom and uses it twice — ROW·COLUMN on the crumb line and SELECT·FLAT on
   * the filter bar are both `kol-helper-14`, `oq-96` active over `oq-48` at
   * rest, letterspacing 1, no frame. A boxed toggle put a bordered chip next to
   * an unbordered dropdown and two unbordered switches, which read as a style
   * break because it was one. Same control, third instance, same treatment.
   *
   * AND IT SITS LAST, RIGHT OF A DIVIDER. The crumb row directly beneath this
   * header reads `[list][columns] │ ROW COLUMN` — icons, divider, text switch.
   * Placed before the icons the header mirrored the row under it, which is the
   * same inconsistency in a different direction. Icons left, divider, text
   * right; two rows, one arrangement. It rides `headerTrailing` rather than
   * `headerActions` because the gear is rendered by the header itself and the
   * switch has to clear it. */
  /* THE GAPS ARE THE CRUMB ROW'S, MEASURED: `gap-6` (24px) around the divider,
   * `gap-4` (16px) between the two labels. Built flat at gap-4 throughout, the
   * divider sat 8px too tight against the icons and the row below it did not
   * line up with the row above. Two nested containers, same two numbers. */
  /* `ml-4` IS NOT DECORATION. The divider needs 24px on BOTH sides to match the
   * crumb row, where its own `gap-6` container supplies both. Here the LEFT gap
   * comes from the header's `gap-2` between this group and the gear — 8px — so
   * the divider sat tight against the icons and open against the text. 8 + 16
   * puts it back on 24. */
  const trailing = (
    <span className="max-md:hidden flex items-center gap-6 ml-4">
      <Divider variant="vertical" />
      <span className="flex items-center gap-4">
        {VIEWS.map((opt) => (
          <span key={opt.value} role="button" onClick={() => setView(opt.value)}
            aria-pressed={view === opt.value}
            className={`kol-helper-14 cursor-pointer select-none ${view === opt.value ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'}`}
            style={{ letterSpacing: 1 }}>
            {opt.label}
          </span>
        ))}
      </span>
    </span>
  )

  const shared = { ...pageProps, headerActions, headerTrailing: trailing, className }

  /* `header` and `stats` are NOT forwarded and NOT accepted. One surface prints
   * one header and one count; a consumer suppressing either is the workaround
   * this component exists to delete. */
  return view === 'files'
    ? <MediaLibraryLibrary {...shared} />
    : <MediaLibraryBrowse {...shared} />
}
