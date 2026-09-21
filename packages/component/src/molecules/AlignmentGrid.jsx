import { Icon } from '@kolkrabbi/kol-icons'
import SegmentedToggle from '../atoms/SegmentedToggle.jsx'
import { glyphSize } from '../hooks/glyphLadders.js'

/**
 * AlignmentGrid — the align control: TWO three-way strips, X and Y.
 *
 * Rebuilt on `SegmentedToggle` 2026-09-03 (`editor-chrome-review`, the user's
 * own pass over the running editor: *"alignment isnt using segmentedtoggle?"*).
 * It was six bare quiet icon Buttons in one `grid-cols-6` — six loose controls
 * where the thing itself is two three-way choices, which is what a segmented
 * strip is for. The shape had been ruled on `editor-set-is-behind-its-source`
 * and the PRESS TREATMENT was the open question; his reaction answered it.
 *
 * MOMENTARY, NOT A SELECTION. `value={null}` puts the strip in its stateless
 * mode: no cell is ever lit, because "align left" is an action you fire, not a
 * state the object is in — the object's alignment is not a property this reads
 * back. The press is the cell's own `:active`, drawn in the theme
 * (`.kol-seg-cell:active`), which is why no `tone` or `pressed` prop was minted
 * for it: `tone` is the GROUND axis and says nothing about a momentary press.
 *
 * @param {(axis:'h'|'v', mode:'start'|'center'|'end') => void} onAlign - Fired on press
 * @param {Array} items - `[{ axis, mode, icon, title }]` cells (default the standard 6, three per axis)
 * @param {'xs'|'sm'|'md'|'lg'} size - The strips' rung (default 'sm')
 * @param {string} className - Extra classes on the wrapper
 */
const ALIGN_BUTTONS = [
  { axis: 'h', mode: 'start',  icon: 'align-horizontal-left',   title: 'Align left' },
  { axis: 'h', mode: 'center', icon: 'align-horizontal-center', title: 'Align horizontal center' },
  { axis: 'h', mode: 'end',    icon: 'align-horizontal-right',  title: 'Align right' },
  { axis: 'v', mode: 'start',  icon: 'align-vertical-top',      title: 'Align top' },
  { axis: 'v', mode: 'center', icon: 'align-vertical-center',   title: 'Align vertical center' },
  { axis: 'v', mode: 'end',    icon: 'align-vertical-bottom',   title: 'Align bottom' },
]

export default function AlignmentGrid({ onAlign, items = ALIGN_BUTTONS, size = 'sm', className = '' }) {
  const strip = (axis) => items.filter((b) => b.axis === axis)

  return (
    <div className={`kol-alignment-grid flex flex-col gap-1 ${className}`.trim()}>
      {['h', 'v'].map((axis) => {
        const cells = strip(axis)
        if (!cells.length) return null
        return (
          <SegmentedToggle
            key={axis}
            variant="filled"
            size={size}
            /* stateless: never lit, the press IS the feedback */
            value={null}
            ariaLabel={axis === 'h' ? 'Align horizontally' : 'Align vertically'}
            /* the cell's `label` takes a NODE, so the glyph needs no new prop
             * on SegmentedToggle — and the glyph size comes from the ADJACENT
             * ladder, never a number typed here */
            options={cells.map((b) => ({
              value: `${b.axis}-${b.mode}`,
              label: <Icon name={b.icon} size={glyphSize(size)} />,
              ariaLabel: b.title,
            }))}
            onChange={(v) => {
              const cell = cells.find((b) => `${b.axis}-${b.mode}` === v)
              if (cell) onAlign?.(cell.axis, cell.mode)
            }}
          />
        )
      })}
    </div>
  )
}
