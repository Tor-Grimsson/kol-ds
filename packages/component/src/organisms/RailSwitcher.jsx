import { forwardRef } from 'react'
/* taxonomy-ok: organism — nests Tooltip (utility) and IconLoader (atom) in a full-height Rail of its own. */
import { IconLoader } from '@kolkrabbi/kol-icons'
import { Tooltip } from '../utilities/Popover.jsx'

/**
 * RailSwitcher — the narrow Rail at the far left that switches spaces (plan-2026-11-20-kolbox-everything-left W1.1). Top
 * to bottom: the mark (it opens the host's main menu), a divider, the spaces, and the foot rows at the bottom. Measured
 * on Figma's own navigation bar in Chrome 2026-11-20, and again by the rig 2026-11-23 (plan-2026-11-23-editor-measured-
 * against-figma W2, _tmp/2026-11-23-editor-diff): 48 wide plus its 1 edge line (49), the mark a 32 square at 8 in and 8
 * down (4 padding round its glyph); the divider 16 by 1 under it. Each space is a 48 by 40 row, the full width, 4 above
 * and below, the rows touching, the first at 56; its lit and hover wash a 32 tile centred in it (the kit's track radius).
 * The glyph is drawn at 20: Figma's read 10 to 14 inside their 24 box, the set's at 20 draws 12 to 15.
 * The host owns the list: a space is added by adding a row.
 *
 * @param {'kolbox'} variant  the one look so far: kolbox's panel, its edge line (`--kol-kolbox-line`), the lit tile a neutral wash
 *   (the field fill) with the plain ink, Figma's way (plan-2026-11-23-editor-measured-against-figma W4: the accent is kept for
 *   the primary button, the active tool and selection).
 * @param {string}   markIcon      the mark's glyph (your icons), plain, no tile fill (W4)
 * @param {string}   [markLabel]   its tooltip and name (default "Main menu")
 * @param {boolean}  [markOpen]    the main menu is open (the tile stays lit)
 * @param {Function} [onMark]      a press on the mark
 * @param {Array}    items  the spaces [{ value, icon, label }]
 * @param {Array}    [foot] the rows at the foot [{ value?, icon, label, onClick? }]
 * @param {string}   [value]  the current space's value (lit)
 * @param {Function} [onSelect]  called with the pressed row (a space, or a foot row without its own onClick)
 * The mark's element is the forwarded ref, so a host anchors its menu on it.
 */
const tile = 'inline-flex size-8 items-center justify-center rounded-track'
const rowCls = 'group flex h-10 w-12 shrink-0 items-center justify-center gap-0.5 py-1'
const focus = 'outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-accent'

function Row({ row, lit, onSelect }) {
  return (
    <Tooltip variant="kolbox" asChild label={row.label}>
      <button type="button" aria-label={row.label} aria-current={lit ? 'page' : undefined} data-space={row.value}
        onClick={() => (row.onClick ? row.onClick() : onSelect?.(row))}
        className={`${rowCls} ${focus}`}>
        <span className={`${tile} ${lit ? 'bg-field text-text' : 'text-text group-hover:bg-field'}`}><IconLoader name={row.icon} size={18} /></span>
      </button>
    </Tooltip>
  )
}

const RailSwitcher = forwardRef(function RailSwitcher({ variant = 'kolbox', markIcon = 'wave', markLabel = 'Main menu', markOpen = false, onMark, items = [], foot = [], value, onSelect, className = '', ...rest }, ref) {
  return (
    <nav aria-label="Spaces" data-rail-switcher={variant}
      className={`relative flex h-full w-(--kol-kolbox-rail-w-collapsed) shrink-0 flex-col items-start bg-panel pt-2 pb-1 after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-(--kol-kolbox-line) ${className}`.trim()} {...rest}>
      <Tooltip variant="kolbox" asChild label={markLabel}>
        <button ref={ref} type="button" aria-label={markLabel} aria-haspopup="menu" aria-expanded={markOpen} onClick={onMark} data-mark
          className={`${tile} ml-2 shrink-0 p-1 text-text hover:bg-field ${markOpen ? 'bg-field' : ''} ${focus}`}>
          <IconLoader name={markIcon} size={18} />
        </button>
      </Tooltip>
      <span aria-hidden className="mx-4 mt-2 mb-[7px] h-px w-4 shrink-0 bg-(--kol-kolbox-line)" data-rail-switcher-divider />
      <div className="flex flex-col">{items.map((r) => <Row key={r.value} row={r} lit={r.value === value} onSelect={onSelect} />)}</div>
      {foot.length > 0 && <div className="mt-auto flex flex-col">{foot.map((r) => <Row key={r.value ?? r.label} row={r} lit={r.value != null && r.value === value} onSelect={onSelect} />)}</div>}
    </nav>
  )
})

export default RailSwitcher
