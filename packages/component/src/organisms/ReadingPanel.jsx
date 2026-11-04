import Button from '../atoms/Button.jsx'
import TabsRow from '../molecules/TabsRow.jsx'

/* taxonomy-ok: organism — the reader's side sheet: header, fold, chip track, body */

const TRACK = 'w-full rounded-full bg-[var(--kol-float-well)] p-1 [&>button]:flex-1 [&>button]:justify-center'

/**
 * ReadingPanel — The reader's side sheet: Notes and Reading behind one track (float-everything W11 rows 150 · 151,
 * 2026-11-04 — kol-float--style W2.9 `Contextual reading panel`). A 320 sheet on `surface-secondary` at the sheet
 * radius (`--kol-float-menu-r`), 20 in: the title in `kol-float-body-lg` with the fold ⌃ (a quiet float round) at the
 * end, the float chip track under it (fg-16 on the well, the halves equal), then the body — `ReadingNotes` or
 * `ReadingSettings` as `children`. No hairline edge.
 *
 * @param {string}    [title]    default `Reading panel`
 * @param {Array}     [tabs]     `[{ value, label }]` (default Notes · Reading)
 * @param {string}    [tab]      · {Function} [onTab] `(value) => void`
 * @param {Function}  [onFold]   the ⌃ press; unset, none
 * @param {ReactNode} children   the open side's body
 * @param {number}    [width]    default 320
 * @param {string}    [className]
 */
const TABS = [{ value: 'notes', label: 'Notes' }, { value: 'reading', label: 'Reading' }]

export default function ReadingPanel({ title = 'Reading panel', tabs = TABS, tab = 'notes', onTab, onFold, children, width = 320, className = '' }) {
  return (
    <aside className={`flex flex-col rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-5 ${className}`.trim()} style={{ width }} aria-label={title}>
      <div className="flex h-7 items-center justify-between">
        <span className="kol-float-body-lg text-fg-emphasis">{title}</span>
        {onFold && <Button variant="float" tone="ghost" size="sm" iconOnly="chevron-up" aria-label="Fold" onClick={onFold} className="-mr-1.5" />}
      </div>
      <TabsRow variant="float" size="xs" overflow="wrap" tabs={tabs} value={tab} onChange={onTab} ariaLabel={title} className={`mt-4 ${TRACK}`} />
      <div className="mt-6">{children}</div>
    </aside>
  )
}
