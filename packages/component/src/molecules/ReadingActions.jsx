import Button from '../atoms/Button.jsx'

/* taxonomy-ok: molecule — float Buttons in one capsule */

/**
 * ReadingActions — What to do with the selected passage. `Highlight · Note · Copy · ···` (float-everything W11 row 147,
 * 2026-11-04 — kol-float--style W2.9 `Selected passage actions`). A 40 capsule on `surface-secondary` holding sm float
 * buttons in the quiet tone, each glyph (oq) and its word, the More ··· last as an icon-only round. Floats over the
 * selection; the consumer places it.
 *
 * @param {Array}    [actions]  `[{ id, label, icon, onClick? }]` (default Highlight · Note · Copy)
 * @param {Function} [onAction] `(id) => void`, after the action's own `onClick`
 * @param {Function} [onMore]   the ··· press; unset, no ···
 * @param {string}   [className]
 */
const DEFAULT_ACTIONS = [
  { id: 'highlight', label: 'Highlight', icon: 'highlighter' },
  { id: 'note', label: 'Note', icon: 'pencil' },
  { id: 'copy', label: 'Copy', icon: 'copy' },
]

export default function ReadingActions({ actions = DEFAULT_ACTIONS, onAction, onMore, className = '' }) {
  return (
    <div role="toolbar" aria-label="Passage" className={`inline-flex h-10 items-center gap-1 rounded-full bg-surface-secondary px-1.5 ${className}`.trim()}>
      {actions.map((a) => (
        <Button key={a.id} variant="float" tone="ghost" size="sm" iconLeft={a.icon} onClick={() => { a.onClick?.(); onAction?.(a.id) }}>{a.label}</Button>
      ))}
      {onMore && <Button variant="float" tone="ghost" size="sm" iconOnly="more" aria-label="More" onClick={onMore} className="ml-auto" />}
    </div>
  )
}
