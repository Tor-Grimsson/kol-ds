import { useMemo, useRef } from 'react'
import { cssColorHex, resolveColor } from '../engine.js'
import { Button, Input, Tooltip } from '@kolkrabbi/kol-component'

/* The right rail's small shared pieces (moved out of Properties.jsx, round 3, 2.1, so the per-type sections share them). */

/* a 16 icon button: the rail's header and section actions (Figma IconButton, row/icon 16). Its hover and lit frame is
   the kit's 24 (`--kol-kolbox-ctl`; his "look at the gap should be the same as other gaps", 2026-11-19). A control
   works, or is dimmed with its reason: `reason` disables it and the tooltip says why (a control with no `onClick` must
   carry one) */
export const Act = ({ className = '', icon, label, lit, reason, ...props }) => {
  const btn = <Button variant="kolbox" iconOnly={icon} aria-label={label} pressed={lit} {...props} disabled={!!reason || props.disabled} className={`size-4! rounded-xs ${className}`}/>
  return reason ? <Tooltip variant="kolbox" label={reason}>{btn}</Tooltip> : btn
}
/* a group of controls dimmed with its reason (one tooltip over the group); the fieldset disables every control in it */
export const Dim = ({ reason, children }) => (
  <Tooltip variant="kolbox" label={reason}>
    <span data-dimmed="" className="flex w-full min-w-0 opacity-40 [&_*]:pointer-events-none">
      <fieldset disabled className="contents">{children}</fieldset>
    </span>
  </Tooltip>
)
/* the reasons a control is dimmed, said once */
export const WHY = {
  locked: 'The layer is locked',
}
export const pct = (v) => `${Math.round((v ?? 1) * 100)}%`
export const num = (raw) => { const n = parseFloat(raw); return Number.isFinite(n) ? n : null }

/* a theme variable is read where the engine's canvas reads it (as apps/minimal's Inspector does) */
export function shown(value, palette) {
  const r = resolveColor(value, palette)
  const m = typeof r === 'string' && /^var\((--[^,)]+)/.exec(r)
  if (!m) return r
  const box = document.querySelector('[data-canvas] .kol-design-editor')
  /* as a hex, whatever the theme declares (a color-mix under KOL's default theme showed raw, R1) */
  return (box && cssColorHex(r, box)) || null
}

/* a number cell: shows the value with its unit; kolbox's field keys (Input's `onCommit`): Enter or leaving commits,
   Escape restores, the arrows step 1 and 10. Text that is not a number is dropped and the value stays */
export function Field({ value, onCommit, lead, icon, trailing, ...rest }) {
  return (
    <Input variant="kolbox"
      prefix={lead}
      iconLeft={icon}
      {...(typeof trailing === 'string' ? { suffix: trailing } : { slotRight: trailing })}
      value={value}
      onCommit={(text) => { const n = num(text); if (n != null) onCommit?.(n) }}
      className="w-full"
      hug
      {...rest}
    />
  )
}

/* two cells and a 16 icon at the right: the sidebar's 88, 88 and 16 (Figma plan 8.1) */
export const Row3 = ({ children }) => <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">{children}</div>
export const Narrow = ({ className = '', icon, label, lit, ...props }) => <Button variant="kolbox" iconOnly={icon} aria-label={label} pressed={lit} {...props} className={`w-4! ${className}`}/>

/* a cell with its name over it, for a two-up row whose fields need their words (the real RuleRow's Section labels) */
export const Cell = ({ label, children }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-1">
    <span className="truncate text-help text-muted">{label}</span>
    {children}
  </div>
)

/* an anchor at the rail's outer edge, level with a row: a panel opens beside the rail, never over it (inside a panel
   that already stands beside the rail, beside that panel) */
export function useBeside() {
  const ref = useRef(null)
  const anchor = useMemo(() => ({
    getBoundingClientRect() {
      const row = ref.current?.getBoundingClientRect()
      const rail = ref.current?.closest('[data-kolbox-popover], [data-rail]')?.getBoundingClientRect()
      return { left: rail?.left ?? 0, right: rail?.left ?? 0, top: row?.top ?? 0, bottom: row?.top ?? 0 }
    },
    contains: (t) => !!ref.current?.contains(t),
  }), [])
  return [ref, anchor]
}
