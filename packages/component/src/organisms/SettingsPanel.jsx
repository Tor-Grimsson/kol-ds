import Button from '../atoms/Button.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import Divider from '../atoms/Divider.jsx'
import IconFrame from '../atoms/IconFrame.jsx'
import LabeledControl from '../molecules/LabeledControl.jsx'
import ToggleSwitch from '../atoms/ToggleSwitch.jsx'
import ShellDrawer from '../molecules/ShellDrawer.jsx'
import FullscreenOverlay from '../utilities/FullscreenOverlay.jsx'
import { Tooltip } from '../utilities/Popover.jsx'

/**
 * SettingsPanel — a settings surface for the thing you are looking at: you
 * change how a list looks WHILE looking at it, so it is a slide-over (or an
 * overlay), never a route (SettingsPanel, kol-r2b2 2026-08-26 — the
 * per-bucket display settings: kinds allow-list, structure, loading, layout).
 *
 * TWO PRESENTATIONS, ONE ANATOMY (the user's ask): `variant="drawer"` is a
 * right-anchored sheet over a scrim, `variant="overlay"` the same panel
 * centred. Only the shell differs; header · intro · sections · footer are the
 * same nodes in both. Neither shell is built here — the drawer IS ShellDrawer
 * (scrim, Escape, focus trap, scroll lock, focus return, the × control) and
 * the overlay IS FullscreenOverlay (scrim, Escape, backdrop dismiss, scroll
 * lock, the corner ×). The source had none of that: scrim click was the only
 * exit, no Escape, no trap, no lock, and a hand-typed `rgba(0,0,0,0.6)` scrim
 * where the DS already owned one.
 *
 * The CONTROLS are the DS controls, not the source's word-buttons: a switch
 * row is `ToggleSwitch`, a choice row is a `Dropdown` (2026-08-27) — the source's
 * segmented variant was flagged by the user as the thing to fix here, not to
 * copy. Sections are the DS `Section` (pass `divided` on every one and the
 * hairline lands between siblings on its own).
 *
 * Text casing is authored at the call site (no text-transform) — the source
 * mixed `Show kinds` / `on` / `grid` in one panel; write them how they should read.
 *
 * @param {boolean}  open      mounted and shown (default true — the parent
 *                             usually conditionally renders it)
 * @param {'drawer'|'overlay'} variant  presentation
 * @param {number|string} width  panel width (default 380)
 * @param {string}   title     header line 1
 * @param {string}   subtitle  header line 2 (the approved drawer passes none)
 * @param {string}   intro     a note under the header (the approved drawer passes none)
 * @param {Function} onClose   × · scrim · Escape
 * @param {ReactNode} footer   the foot slot — `SettingsFooter` is the default shape
 * @param {ReactNode} children the sections
 */
export default function SettingsPanel({
  open = true,
  variant = 'drawer',
  width = 380,
  title,
  subtitle,
  intro,
  onClose,
  footer,
  children,
  className = '',
}) {
  const header = (
    <div className="flex min-w-0 flex-col">
      {/* THE APP REGISTER (SettingsPanelChromeAndColumnPreview, kol-r2b2 2026-08-27 —
        * user: "all wrong font styles"): the collection beside the panel is the
        * reference — helper-14 uppercase titles, the eyebrow for section labels,
        * mono-12 rows and hints. No mono-10 anywhere. */}
      {title && <span className="kol-helper-14 uppercase text-emphasis">{title}</span>}
      {subtitle && <span className="kol-mono-12 text-meta">{subtitle}</span>}
    </div>
  )
  const body = (
    <>
      {intro && <p className="kol-mono-12 text-meta">{intro}</p>}
      <div className="flex flex-col gap-5">{children}</div>
      {footer && <div className="mt-2">{footer}</div>}
    </>
  )

  if (variant === 'overlay') {
    if (!open) return null
    return (
      <FullscreenOverlay open onClose={onClose}>
        {/* the corner × rides the sheet at --kol-spacing-3; the panel reserves
          * that lane on top (the .kol-media-picker precedent) instead of the
          * control moving */}
        <div
          className={`kol-overlay-panel flex flex-col gap-4 p-6 pt-12 ${className}`}
          style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto' }}
        >
          {header}
          {body}
        </div>
      </FullscreenOverlay>
    )
  }

  return (
    /* THE APPROVED DRAWER (SettingsPanelApproved, kol-r2b2 2026-08-27 — user: "LOCK
       THIS"): no edge, no shadow, a Divider under the header, the sections.
       THE SCRIM IS BACK (settings-drawer-has-no-surface, kol-client-olina
       2026-09-03). `backdrop={false}` stood here from 2026-08-30; the drawer
       paints `bg-surface-primary`, the same token as the page, so the scrim was
       the only thing separating them — with it off the panel was invisible and
       the controls floated in the right third of the screen. */
    <ShellDrawer open={open} onClose={onClose} side="right" width={width} header={header} className={className} edge={false} shadow={false}>
      <div className="flex flex-col gap-4"><Divider />{body}</div>
    </ShellDrawer>
  )
}

/**
 * SettingsRow — a `LabeledControl inline` (SettingsPanelApproved, 2026-08-27):
 * uppercase label (`kol-helper-10` tracked, meta ink) in a 160px column, the
 * control fills the rest. A switch sits at the far right (`align="end"`, the
 * default); a dropdown fills the row (`align="fill"`). No hint sentences on the
 * page — `hint` rides the control's DS `Tooltip` (a native `title` until
 * 2026-09-22, kol-client-olina). `labelWidth="auto"` passes through
 * to LabeledControl: the label flexes and truncates, the control hugs — for a
 * row living in a column narrower than the 160px label default
 * (SettingsShortcutsComboOverflow, kol-monitor 2026-09-01).
 */
export function SettingsRow({ label, hint, align = 'end', labelWidth = 160, children }) {
  return (
    <LabeledControl inline label={typeof label === 'string' ? label.toUpperCase() : label} labelWidth={labelWidth}>
      {hint
        ? <Tooltip label={hint} triggerClassName={`inline-flex w-full ${align === 'fill' ? '' : 'justify-end'}`.trim()}>{children}</Tooltip>
        : <span className={`inline-flex w-full ${align === 'fill' ? '' : 'justify-end'}`.trim()}>{children}</span>}
    </LabeledControl>
  )
}

/** SettingsSwitch — the row's on/off control: the DS ToggleSwitch, bare, sm.
 *  `disabledHint` rides a DS `Tooltip` so a switch that cannot act says why;
 *  inside a row's `hint` it wins while hovered, as the native `title` did. */
export function SettingsSwitch({ on = false, onChange, disabled = false, disabledHint, label, title }) {
  const tip = title ?? (disabled ? disabledHint : undefined)
  const toggle = (
    <ToggleSwitch
      size="sm"
      checked={on}
      onChange={onChange}
      disabled={disabled}
      aria-label={label}
    />
  )
  return tip ? <Tooltip label={tip}>{toggle}</Tooltip> : toggle
}

/** LabeledControlSection — a section of LabeledControls: the EYEBROW
 *  (`kol-eyebrow text-fg-80`) standing apart from the rows (gap-3), the rows in
 *  their own stack — `rowGap` 1 for switch rows (24 tall already), 2 for
 *  dropdown rows. `divided` = a hairline above (between sections).
 *  Was `SettingsSection` until 2026-08-27 (LabeledControlSection, kol-r2b2 —
 *  user ruling: it named the place it was first used, not what it is; kol-fxr
 *  took it for a params rail the same day). RENAMED, NO ALIAS — the render is
 *  the 0.104.0 locked composition, untouched. */
export function LabeledControlSection({ label, divided = false, rowGap = 2, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${divided ? 'kol-section--divided' : ''} ${className}`.replace(/\s+/g, ' ').trim()}>
      {label && <p className="kol-eyebrow text-fg-80">{label}</p>}
      <div className={`flex flex-col ${rowGap === 1 ? 'gap-1' : 'gap-2'}`}>{children}</div>
    </div>
  )
}

/** SettingsChoice — the row's one-of-N control: the DS Dropdown, sm · primary
 *  (SettingsPanelEyebrowAndDropdowns — user: "put the toggles inside a dropdown,
 *  because it's super messy like it is"). Options are values or `{ value, label }`;
 *  width is the call site's (`className="w-40"`).
 *
 *  `tone` · `size` · `variant` pass through (kol-fxr 2026-08-28): they were
 *  hardcoded, so a settings page ruled sunken could not be told — and kol-fxr
 *  rebuilt this same Dropdown in a local `ChoiceRow`, which is the exact
 *  duplication this component exists to prevent. A component that wraps another
 *  has to forward the wrapped one's seams or it becomes a wall. */
export function SettingsChoice({ options = [], value, onChange, ariaLabel, tone = 'default', size = 'sm', variant = 'primary', className = '' }) {
  const opts = options.map((o) => (o != null && typeof o === 'object' ? o : { value: o, label: String(o) }))
  return <Dropdown size={size} variant={variant} tone={tone} value={value} onChange={onChange} options={opts} className={`w-full ${className}`.trim()} aria-label={ariaLabel} />
}

/* THE CONTROL CHIP (SettingsPanelCompliance, user 2026-08-27: "WROOOONG" on the
 * 0.98.0 Tag pills): `.kol-control` sm on kol-mono-12, filled when on, meta ink
 * when off, the count in meta after the label — the SAME string ContentFilters'
 * kind chips, ViewToggle's text variant and the SELECT / FLAT strip wear. No
 * Tag, no uppercase, no inverse. */
export const CHIP_CLS = 'kol-control kol-control-sm kol-mono-12'
export const chipCls = (on) => `${CHIP_CLS} ${on ? 'kol-control--filled' : 'text-meta hover:text-emphasis'}`

/**
 * SettingsMulti — a many-of-N control as ONE Dropdown (SettingsPanelApproved,
 * 2026-08-27 — the kinds row): the trigger reads `N of M <noun>`, every entry
 * toggles and `✓` marks the ones that are on. No grouping.
 * @param {Array}  options   [{ value, label }]
 * @param {Array|Set} selected
 * @param {Function} onToggle (value) => void
 * @param {string} noun      the trigger's noun (default 'kinds')
 */
export function SettingsMulti({ options = [], selected = [], onToggle, noun = 'kinds', tone = 'default', size = 'sm', className = '' }) {
  const on = selected instanceof Set ? selected : new Set(selected)
  const opts = [
    { value: '__summary', label: `${on.size} of ${options.length} ${noun}` },
    ...options.map((o) => ({ value: o.value, label: `${on.has(o.value) ? '✓ ' : ''}${o.label ?? String(o.value)}` })),
  ]
  return <Dropdown size={size} variant="primary" tone={tone} value="__summary" options={opts} onChange={(v) => (v === '__summary' ? null : onToggle?.(v))} className={`w-full ${className}`.trim()} />
}

/**
 * SettingsChipRow — a wrap of toggle chips with optional counts (an
 * allow-list: every chip sets a default, never a gate). `allChip` puts an
 * "all" chip first — the same control chip, filled when every option is on
 * (SettingsPanelEyebrowAndDropdowns — user: "Show all in ghost mode? makes no
 * sense"); `onAll(nextAllOn)` fires when it is clicked.
 * @param {Array}  options   [{ value, label, count? }]
 * @param {Array|Set} selected  the values that are on
 * @param {Function} onToggle  (value) => void
 * @param {boolean|string} allChip  render the "all" chip (a string = its label)
 * @param {Function} onAll     (nextAllOn: boolean) => void
 */
export function SettingsChipRow({ options = [], selected = [], onToggle, allChip = false, onAll }) {
  const on = selected instanceof Set ? selected : new Set(selected)
  const allOn = options.length > 0 && options.every((o) => on.has(o.value))
  return (
    <div className="flex flex-wrap gap-1">
      {allChip && (
        <button type="button" aria-pressed={allOn} onClick={() => onAll?.(!allOn)} className={chipCls(allOn)}>
          {typeof allChip === 'string' ? allChip : 'all'}
        </button>
      )}
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={on.has(o.value)}
          onClick={() => onToggle?.(o.value)}
          className={chipCls(on.has(o.value))}
        >
          {o.label ?? String(o.value)}
          {o.count > 0 && <span className="text-meta"> {o.count}</span>}
        </button>
      ))}
    </div>
  )
}

/** SettingsFooter — a Divider, then one `IconFrame refresh` (primary · sm) at the
 *  right = reset to defaults (SettingsPanelApproved, 2026-08-27). No status word,
 *  no text button. `customised` is accepted for compatibility and unused.
 *
 *  `children` ride the SAME row, before reset (BrowsePageRulingsAndSeams,
 *  kol-r2b2 2026-09-02): a consumer wanting one more control in that footer had
 *  no way in, so kol-r2b2 ran a `MutationObserver` on `document.body` watching
 *  for `[aria-label="Reset to defaults"]` and portalled a theme chip into its
 *  parent — a copy string in a `querySelector`, watching the whole document, to
 *  place one button. The slot is the seam that ends it.
 *
 *  `gap-2` on the row (user 2026-08-28): `flex justify-end` with no gap is right
 *  for one control and wrong for two — the chip and the reset icon touched. */
export function SettingsFooter({ onReset, resetLabel = 'Reset to defaults', children }) {
  return (
    <div className="flex flex-col gap-4">
      <Divider />
      <div className="flex justify-end items-center gap-2">
        {children}
        {onReset && (
          <Tooltip label={resetLabel}>
            <IconFrame name="refresh" variant="primary" size="sm" onClick={onReset} aria-label={resetLabel} />
          </Tooltip>
        )}
      </div>
    </div>
  )
}
