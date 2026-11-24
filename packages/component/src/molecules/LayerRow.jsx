import { IconLoader } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import TreeRow from './TreeRow.jsx'

/* taxonomy-ok: molecule — TreeRow (molecule) + Button (atom) + kol-icons's Icon. */

/**
 * LayerRow — A layer in a layers list: glyph · name · eye · lock. `Orbit field` (float-everything W8 row 119,
 * 2026-11-04 — kol-float--style 48:3546). `TreeRow` at `xs` (26, a 14 glyph, the 11 name) with two toggles at its end:
 * the eye (`visible` · `onToggleVisible`) and the lock (`locked` · `onToggleLock`), each drawn only when its handler is
 * given (PropertyRail's selected line has an eye and no lock, plan-2026-11-12-float-rails-figma W8.1). The toggles stay
 * on oq-64 and go oq-96 under the pointer; a hidden layer's name drops to fg-48 and its eye shows `eye-off`. `selected`
 * lifts the row to fg-12 with its name at full emphasis and its glyphs on oq-96, fill only (the LayerStack selected row, the user's pick 2026-11-12;
 * it was fg-16).
 *
 * `variant="head"` is the same part as the selected object's line at the top of an inspector (PropertyRail's `selected`,
 * plan-2026-11-12-float-rails-figma W8.1, the user: *"'select' why is this not a component?!?!"*; decided for his review):
 * no row inset and no lift, the 18 glyph at oq-64, the name in `kol-float-panel` at the emphasis ink, the eye and the lock
 * float ghost sm Buttons.
 *
 * @param {'row'|'head'} [variant='row']
 * @param {string}    [icon='layers']
 * @param {ReactNode} name
 * @param {boolean}   [selected]
 * @param {boolean}   [visible=true] · {Function} [onToggleVisible]
 * @param {boolean}   [locked=false] · {Function} [onToggleLock]
 * @param {number}    [depth=0]
 * @param {Function}  [onClick]
 * @param {string}    [className]
 */
export default function LayerRow({ variant = 'row', icon = 'layers', name, selected = false, visible = true, onToggleVisible, locked = false, onToggleLock, depth = 0, onClick, className = '' }) {
  if (variant === 'head') {
    const btn = (label, glyph, on, fn) => <Button variant="float" tone="ghost" size="sm" iconOnly={glyph} aria-label={label} aria-pressed={on} onClick={fn} />
    return (
      <div className={`flex items-center gap-2 ${className}`.trim()}>
        <IconLoader name={icon} size={18} className="shrink-0 text-oq-64" />
        <span className="kol-float-panel text-emphasis min-w-0 flex-1 truncate">{name}</span>
        {onToggleVisible && btn(visible ? 'Hide' : 'Show', visible ? 'eye-on' : 'eye-off', visible, onToggleVisible)}
        {onToggleLock && btn(locked ? 'Unlock' : 'Lock', locked ? 'lock' : 'unlock', locked, onToggleLock)}
      </div>
    )
  }
  const ctl = (label, glyph, on, fn) => (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={on}
      onClick={(e) => { e.stopPropagation(); fn() }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); fn() } }}
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]"
    >
      <IconLoader name={glyph} size={12} />
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
      className={`gap-2 pr-1.5 ${selected ? '!bg-(--kol-fg-12) !text-(--kol-fg-emphasis) [&_svg]:!text-(--kol-oq-96)' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      trailing={(onToggleVisible || onToggleLock) && (
        <span className="flex shrink-0 items-center">
          {onToggleVisible && ctl(visible ? 'Hide layer' : 'Show layer', visible ? 'eye-on' : 'eye-off', !visible, onToggleVisible)}
          {onToggleLock && ctl(locked ? 'Unlock layer' : 'Lock layer', locked ? 'lock' : 'unlock', locked, onToggleLock)}
        </span>
      )}
    />
  )
}
