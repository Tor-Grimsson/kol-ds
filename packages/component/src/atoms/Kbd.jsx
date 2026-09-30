/**
 * Kbd — a key cap: one key or chord (↵, ⌘K, Esc) shown as an affordance.
 * Replaces the two hand-rolled <kbd> chips (SearchInput's shortcut hint and
 * the palette footer) that had drifted apart (2026-09-30). A plate, so it
 * takes oq — never fg (icons-use-oq law).
 *
 * aria-hidden by default: a cap is a hint beside a label, not the label.
 *
 * @param {'sm'|'md'} size  sm = inside a control (16px, helper-10) ·
 *                          md = beside helper-12 text (20px)
 * @param {string}    icon  kol-icons name drawn before the children — a key
 *                          with a symbol (↵ `corner-down-left`, ⌘ `command`)
 *                          is a GLYPH, never a typed character in the mono face
 */
import { Icon } from '@kolkrabbi/kol-icons'

const SIZE = {
  sm: 'h-4 min-w-4 px-1 kol-helper-10',
  md: 'h-5 min-w-5 px-1.5 kol-helper-12',
}

export default function Kbd({ size = 'md', icon, className = '', children, ...rest }) {
  return (
    <kbd
      aria-hidden="true"
      className={`inline-flex items-center justify-center gap-0.5 shrink-0 rounded-[var(--kol-radius-xs)] bg-oq-08 text-oq-64 ${SIZE[size] ?? SIZE.md} ${className}`.trim()}
      {...rest}
    >
      {icon && <Icon name={icon} size={12} />}
      {children}
    </kbd>
  )
}
