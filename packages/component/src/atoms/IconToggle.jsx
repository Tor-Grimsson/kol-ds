import { Icon } from '@kolkrabbi/kol-icons'
import { SOLO } from '../hooks/glyphLadders.js'
import { Tooltip } from '../utilities/Popover.jsx'

/* taxonomy-ok: atom — one control, Icon + the DS Tooltip */

/**
 * IconToggle — an icon-only toggle: the icon is the control, the state is its INK, the name is the
 * tooltip (IconToggle, kol-mirror 2026-10-15 — user: *"why is everything in brackets icon AND TEXT?
 * all of this is also listed in shortcuts so? … because we want to minimise noise"*).
 *
 * The interactive twin of `IconFrame`: no ground, no border, no pressed fill. `IconFrame` has no
 * states by law and `ToggleBracket` is text, so neither fits; `Button pressed` paints the inverted
 * fill, which is the tool-palette idiom and too loud for studio chrome. It owns `.kol-icon-toggle`
 * for the same reason IconFrame owns its classes — nothing of `kol-btn-*` to inherit.
 *
 * Ink on the `oq` ladder (icons-use-oq law): on 96 · off 32 · off-hover 64 · disabled 12;
 * `tone="danger"` puts the ON ink on `--ui-error` (mirror's Lock: a locked view reads as a warning).
 * Square on the size ladder (xs 22 · sm 26 · md 32), glyph on the solo ladder.
 *
 * @param {boolean} pressed       state → `aria-pressed`
 * @param {Function} onChange     `(next) => void`
 * @param {string} icon           icon when off (and on, without `iconOn`)
 * @param {string} [iconOn]       icon when on (Lock: `unlock` → `lock`)
 * @param {string} label          `aria-label` — required, there is no visible text
 * @param {string} [title]        tooltip, default `label` (mirror: "Lock the view (L)")
 * @param {'default'|'danger'} [tone='default']
 * @param {'xs'|'sm'|'md'} [size='sm']
 * @param {boolean} [disabled]
 */
export default function IconToggle({
  pressed = false,
  onChange,
  icon,
  iconOn,
  label,
  title,
  tone = 'default',
  size = 'sm',
  disabled = false,
  iconComponent: IconCmp = Icon,
  className = '',
  ...rest
}) {
  const cls = `kol-icon-toggle kol-icon-toggle-${size}${tone === 'danger' ? ' kol-icon-toggle-danger' : ''} ${className}`.trim()
  return (
    <Tooltip label={title ?? label} triggerClassName="inline-flex shrink-0">
      <button
        type="button"
        className={cls}
        aria-pressed={pressed}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!pressed)}
        {...rest}
      >
        <IconCmp name={pressed && iconOn ? iconOn : icon} size={SOLO[size] ?? SOLO.sm} />
      </button>
    </Tooltip>
  )
}
