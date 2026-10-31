import { Menu } from './Menu.jsx'
import { Tooltip } from '../utilities/Popover.jsx'

/* the hit box per control rung: a field's height, a narrow width; the dot inside it */
const SIZE = {
  xs: 'w-4 h-[22px] [--bd-dot:6px]',
  sm: 'w-5 h-[26px] [--bd-dot:7px]',
  md: 'w-6 h-8 [--bd-dot:8px]',
}

/**
 * ParamBindDot — Show a param is bound and open its menu. the small dot beside a param row: hollow at rest,
 * filled in the accent once the param is bound (modulated); a click opens a menu of actions.
 *
 * Lobby ParamBindDot (kol-fxr, 2026-10-31): fxr's `params/BindDot.jsx` was a raw `<button>` dot and a
 * hand-wired PopoverPanel beside every animatable row. This is that dot on KOL's `Menu` — the menu panel,
 * rows and dismissal are the Menu family's, so `items` take every Menu row key (`checked`, `divider`,
 * `heading`, `icon`, `disabled`…), not just `{ label, onClick }`.
 *
 * ON THE CONTROL RAMP. The hit box is a field's height at the same `size` (xs 22 · sm 26 · md 32) and narrow,
 * so it sits in a `SettingsRow`'s trailing slot level with the control. The dot itself: xs 6 · sm 7 · md 8.
 *
 * STATES (the icon ink law — oq, never fg): at rest a hollow ring in oq-48, hover lifts it to oq-80, bound
 * fills it and its ring in the accent. Open, the ring holds its hover ink. The `mode` names what it is bound
 * to — it rides the tooltip and the accessible name.
 *
 *   <ParamBindDot bound={isBound} mode="LFO" label="Opacity" items={[
 *     { label: 'Constant', checked: !isBound, onClick: unbind },
 *     { label: 'LFO', checked: mode === 'lfo', onClick: () => bind('lfo') },
 *   ]} />
 *
 * @param {boolean} [bound=false] - The param is bound (modulated) — fills the dot in the accent
 * @param {string} [mode] - What it is bound to ("LFO", "Keyframes"…) — shown in the tooltip and the name while bound
 * @param {Array<Object>} [items=[]] - The menu rows — `{ label, onClick }` and every other Menu row key
 * @param {string} [label] - The param's name, for the accessible name ("Modulate Opacity")
 * @param {string} [tooltip] - Overrides the tooltip (default "Modulate", or "Bound · <mode>" while bound)
 * @param {'xs'|'sm'|'md'} [size='sm'] - The control rung — the hit box matches a field of this size
 * @param {'start'|'end'} [align='end'] - The menu's edge against the dot
 * @param {number} [minWidth=180] - The menu's minimum width
 * @param {string} [className] - Extra classes on the trigger
 */
export default function ParamBindDot({
  bound = false,
  mode,
  items = [],
  label,
  tooltip,
  size = 'sm',
  align = 'end',
  minWidth = 180,
  className = '',
}) {
  const tip = tooltip ?? (bound ? (mode ? `Bound · ${mode}` : 'Bound') : 'Modulate')
  const name = [`Modulate${label ? ` ${label}` : ''}`, bound && mode ? `(${mode})` : ''].filter(Boolean).join(' ')
  return (
    <Menu align={align} minWidth={minWidth} items={items} trigger={({ open, props }) => (
      <Tooltip label={open ? null : tip}>
        <button
          type="button"
          aria-label={name}
          {...props}
          className={[
            'kol-param-bind-dot group inline-flex shrink-0 items-center justify-center p-0 border-0 bg-transparent cursor-pointer rounded-[var(--kol-radius-xs)] outline-none',
            'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--kol-focus-ring-quiet)]',
            SIZE[size] ?? SIZE.sm,
            className,
          ].filter(Boolean).join(' ')}
        >
          <span
            aria-hidden="true"
            className={`block rounded-full border-[1.5px] border-solid transition-colors size-[var(--bd-dot)] ${bound
              ? 'bg-[var(--kol-accent-primary)] border-[var(--kol-accent-primary)]'
              : `bg-transparent group-hover:border-[var(--kol-oq-80)] ${open ? 'border-[var(--kol-oq-80)]' : 'border-[var(--kol-oq-48)]'}`}`}
          />
        </button>
      </Tooltip>
    )} />
  )
}
