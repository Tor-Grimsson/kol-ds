/**
 * Kbd — A key cap for a shortcut. a key cap: one key or chord (↵, ⌘K, Esc) shown as an affordance.
 * Replaces the two hand-rolled <kbd> chips (SearchInput's shortcut hint and
 * the search modal footer) that had drifted apart (2026-09-30). A plate, so it
 * takes oq — never fg (icons-use-oq law).
 *
 * aria-hidden by default: a cap is a hint beside a label, not the label.
 *
 * @param {'sm'|'md'} size  sm = inside a control (16px, helper-10) ·
 *                          md = beside helper-12 text (20px)
 * @param {string}    icon  kol-icons name drawn before the children — a key
 *                          with a symbol (↵ `corner-down-left`, ⌘ `command`)
 *                          is a GLYPH, never a typed character in the mono face.
 *                          It follows the cap: 10 in `sm`, 12 in `md` (2026-10-02 —
 *                          it was 12 in both, so in the small ⌘K cap the ⌘ outgrew the K)
 * @param {'default'|'kolbox'} variant  `kolbox` (plan-2026-11-18-kolbox-system W31.2, 2026-11-18): kolbox's cap carried
 *                          class for class, the same sizes in kolbox's mono steps (sm 10 / 14, md 12 / 16), no gap; chrome
 *                          in kol-theme `.kol-kbd--kolbox`.
 * @param {boolean}   onAccent  kolbox only: on a lit accent row the cap takes the on-accent ink over a 15% wash of it.
 *
 * KbdKeys (a member of Kbd): a drawn shortcut ('⌘⇧S') split into one cap per key, each modifier its own and the rest
 * one key; ⌘ is the `command` glyph. `keys`, `size`, `onAccent`, `variant`, `className`.
 */
import { IconLoader } from '@kolkrabbi/kol-icons'

const SIZE = {
  sm: 'h-4 min-w-4 px-1 kol-helper-10',
  md: 'h-5 min-w-5 px-1.5 kol-helper-12',
}
const GLYPH = { sm: 10, md: 12 }
/* kolbox: the same boxes, its type in the theme rule */
const KOLBOX_SIZE = { sm: 'h-4 min-w-4 px-1', md: 'h-5 min-w-5 px-1.5' }

export default function Kbd({ size = 'md', icon, variant = 'default', onAccent = false, className = '', children, ...rest }) {
  if (variant === 'kolbox') {
    return (
      <kbd
        aria-hidden="true"
        className={`kol-kbd--kolbox kol-kbd--kolbox-${size}${onAccent ? ' kol-kbd--kolbox-on-accent' : ''} inline-flex shrink-0 items-center justify-center ${KOLBOX_SIZE[size] ?? KOLBOX_SIZE.md} ${className}`.trim()}
        {...rest}
      >
        {icon && <IconLoader name={icon} size={GLYPH[size] ?? GLYPH.md} className="kol-kolbox-icon shrink-0" />}
        {children}
      </kbd>
    )
  }
  return (
    <kbd
      aria-hidden="true"
      className={`inline-flex items-center justify-center gap-0.5 shrink-0 rounded-[var(--kol-radius-2)] bg-oq-08 text-oq-64 ${SIZE[size] ?? SIZE.md} ${className}`.trim()}
      {...rest}
    >
      {icon && <IconLoader name={icon} size={GLYPH[size] ?? GLYPH.md} />}
      {children}
    </kbd>
  )
}

/* '⌘⇧S' → ['⌘', '⇧', 'S'] */
const keysOf = (s) => {
  const m = String(s).match(/^[⌘⇧⌥⌃]*/)[0]
  const rest = String(s).slice(m.length)
  return [...m, ...(rest ? [rest] : [])]
}

export function KbdKeys({ keys, size, onAccent, variant, className = '' }) {
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center gap-0.5 ${className}`} data-keys={keys}>
      {keysOf(keys).map((k, i) => (
        k === '⌘'
          ? <Kbd key={i} size={size} variant={variant} onAccent={onAccent} icon="command" />
          : <Kbd key={i} size={size} variant={variant} onAccent={onAccent}>{k}</Kbd>
      ))}
    </span>
  )
}
