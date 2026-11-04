import { Icon } from '@kolkrabbi/kol-icons'
import TreeRow from './TreeRow.jsx'

/* taxonomy-ok: molecule — TreeRow (molecule) + kol-icons's Icon. */

/**
 * LayerRow — A layer in a layers list: glyph · name · eye · lock. `Orbit field` (float-everything W8 row 119,
 * 2026-11-04 — kol-float--style 48:3546). `TreeRow` at `xs` (26, a 14 glyph, the 11 name) with two toggles at its end:
 * the eye (`visible` · `onToggleVisible`) and the lock (`locked` · `onToggleLock`). The toggles stay on oq-64 and go
 * oq-96 under the pointer; a hidden layer's name drops to fg-48 and its eye shows `eye-off`. `selected` lifts the row
 * to fg-16.
 *
 * @param {string}    [icon='layers']
 * @param {ReactNode} name
 * @param {boolean}   [selected]
 * @param {boolean}   [visible=true] · {Function} [onToggleVisible]
 * @param {boolean}   [locked=false] · {Function} [onToggleLock]
 * @param {number}    [depth=0]
 * @param {Function}  [onClick]
 * @param {string}    [className]
 */
export default function LayerRow({ icon = 'layers', name, selected = false, visible = true, onToggleVisible, locked = false, onToggleLock, depth = 0, onClick, className = '' }) {
  const ctl = (label, glyph, on, fn) => (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={on}
      onClick={(e) => { e.stopPropagation(); fn?.() }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); fn?.() } }}
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]"
    >
      <Icon name={glyph} size={12} />
    </span>
  )
  return (
    <TreeRow
      size="xs"
      icon={icon}
      label={<span className={visible ? undefined : 'text-fg-48'}>{name}</span>}
      active={selected}
      depth={depth}
      onClick={onClick}
      className={`gap-2 pr-1.5 ${className}`.trim()}
      trailing={(
        <span className="flex shrink-0 items-center">
          {ctl(visible ? 'Hide layer' : 'Show layer', visible ? 'eye-on' : 'eye-off', !visible, onToggleVisible)}
          {ctl(locked ? 'Unlock layer' : 'Lock layer', locked ? 'lock' : 'unlock', locked, onToggleLock)}
        </span>
      )}
    />
  )
}
