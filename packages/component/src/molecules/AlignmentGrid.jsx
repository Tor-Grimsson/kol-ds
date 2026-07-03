import Button from '../atoms/Button.jsx'

/**
 * AlignmentGrid — a six-cell alignment row: horizontal start/center/end then
 * vertical start/center/end, each a quiet icon Button that emits an
 * `(axis, mode)` alignment intent. Driven off a static config array (the
 * default 6, overridable via `items`). Presentation only — the consumer wires
 * `onAlign` to whatever "align these" means in its context (align a box to the
 * canvas bounds, align a multi-selection's common bbox, …).
 *
 * Ported from the brand editor's AlignmentPanel with the store coupling
 * dropped (per lobby spec): `useComposeState().alignSelected` → an `onAlign`
 * prop; the hand-rolled `kol-btn-quiet` buttons → DS `Button` (quiet +
 * iconOnly) so the DS owns the button atom; `EditorIcon` → the DS Icon
 * (through Button).
 *
 * [icon-gap] The source's `align-h-{start,center,end}` / `align-v-{start,
 * center,end}` glyph names are NOT in the loader. Remapped to the closest
 * existing loader glyphs (stroke/layout): `align-horizontal-{left,center,
 * right}` and `align-vertical-{top,center,bottom}`. Same six align marks,
 * different names — no visual gap.
 *
 * @param {(axis:'h'|'v', mode:'start'|'center'|'end') => void} onAlign  fired on cell click
 * @param {Array} items  [{ axis, mode, icon, title }] cells (default the standard 6)
 */
const ALIGN_BUTTONS = [
  { axis: 'h', mode: 'start',  icon: 'align-horizontal-left',   title: 'Align left' },
  { axis: 'h', mode: 'center', icon: 'align-horizontal-center', title: 'Align horizontal center' },
  { axis: 'h', mode: 'end',    icon: 'align-horizontal-right',  title: 'Align right' },
  { axis: 'v', mode: 'start',  icon: 'align-vertical-top',      title: 'Align top' },
  { axis: 'v', mode: 'center', icon: 'align-vertical-center',   title: 'Align vertical center' },
  { axis: 'v', mode: 'end',    icon: 'align-vertical-bottom',   title: 'Align bottom' },
]

export default function AlignmentGrid({ onAlign, items = ALIGN_BUTTONS }) {
  return (
    <div className="grid grid-cols-6 gap-1">
      {items.map((b) => (
        <Button
          key={`${b.axis}-${b.mode}`}
          quiet
          iconOnly={b.icon}
          iconSize={16}
          onClick={() => onAlign?.(b.axis, b.mode)}
          title={b.title}
          aria-label={b.title}
          className="w-full"
          style={{ height: 28, padding: 6 }}
        />
      ))}
    </div>
  )
}
