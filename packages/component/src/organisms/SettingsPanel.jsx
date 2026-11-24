import { Children, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import Dropdown from '../molecules/Dropdown.jsx'
import CloseButton from '../molecules/CloseButton.jsx'
import Divider from '../atoms/Divider.jsx'
import IconFrame from '../atoms/IconFrame.jsx'
import LabeledControl from '../molecules/LabeledControl.jsx'
import ToggleSwitch from '../atoms/ToggleSwitch.jsx'
import Rail from './Rail.jsx'
import FullscreenOverlay from '../molecules/FullscreenOverlay.jsx'
import ModalShell from '../molecules/ModalShell.jsx'
import { Tooltip } from '../utilities/Popover.jsx'
import { RailHeader } from './RailKit.jsx'

/**
 * SettingsPanel — Settings beside the thing they change. a settings surface for the thing you are looking at: you
 * change how a list looks WHILE looking at it, so it is a slide-over (or an
 * overlay), never a route (SettingsPanel, kol-r2b2 2026-08-26 — the
 * per-bucket display settings: kinds allow-list, structure, loading, layout).
 *
 * TWO PRESENTATIONS, ONE ANATOMY (the user's ask): `variant="rail"` is a
 * right-anchored rail over a scrim, `variant="overlay"` the same content
 * centred. Only the shell differs; header · intro · sections · footer are the
 * same nodes in both. Neither shell is built here — the rail IS `Rail`
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
 * @param {'rail'|'overlay'} variant  presentation — `rail` (default) or `overlay`, the only two names (user 2026-10-18);
 *                                     `drawer` is the old name of `rail`, still accepted
 * @param {'app'|'site'} tier   THE RAIL'S TIER (RailKit, kol-monitor 2026-10-24; default `app`): its width and padding are
 *                            the tier's tokens, the same the page rails read — `app` 320, `site` 380, the overlay inset.
 *                            The 380 of 2026-08-27 is the site tier's; an app's settings rail is as wide as its other rails
 * @param {'settings'|'page'} role  THE RAIL'S ROLE (RailRoles, 2026-10-25; default `settings`): `page` for a page's own settings rail
 *                            (monitor's Stage, Rack — H), which is this same shell under the page's key; `Rail role` carries it
 * @param {number|string} width  width — overrides the tier's for the rail; the ⌘K overlay's 32rem for the overlay
 * @param {string}   title     header line 1
 * @param {string}   subtitle  header line 2 (the approved drawer passes none)
 * @param {string}   intro     a note under the header (the approved drawer passes none)
 * @param {Function} onClose   × · scrim · Escape
 * @param {ReactNode} footer   the foot slot — `SettingsFooter` is the default shape
 * @param {ReactNode} headerActions  controls on the header line, before the × (the file rail's edit pencil, 2026-10-23)
 * @param {boolean}  backdrop  the rail's scrim — unset, THE ROLE decides (review 2, 2026-10-25: `settings` dims and locks the page,
 *                            `page` does not — *"H does not include dark overlay, that is only settings"*). `false`
 *                            is the Rail's own: the panel alone, no scrim, no scroll lock, no focus trap — a PAGE-LEVEL rail
 *                            over a live page, the bottom rail's setup (SettingsPanelBackdrop, kol-monitor 2026-10-24: the
 *                            rack's and the stage's settings open over the running picture and its keys keep working).
 *                            `rail` only; the overlay keeps its scrim
 * @param {'over'|'push'} mode  the Rail's own (default `over`): `over` slides over the page, `push` sits in the layout and
 *                            pushes it — inline, no scrim, no trap. Forwarded with `backdrop` (same ticket); `rail` only
 * @param {ReactNode} children the sections
 */
export default function SettingsPanel({
  open = true,
  variant = 'rail',
  tier = 'app',
  role = 'settings',
  width: widthProp,
  title,
  subtitle,
  intro,
  onClose,
  footer,
  headerActions,
  backdrop,
  mode = 'over',
  children,
  className = '',
}) {
  /* THE APP REGISTER (SettingsPanelChromeAndColumnPreview, kol-r2b2 2026-08-27 — user: "all wrong font styles"): the
   * collection beside the panel is the reference — helper-14 uppercase titles, the eyebrow for section labels, mono-12
   * rows and hints. The header is the kit's `RailHeader` (RailKit, 2026-10-24): the same node every page rail wears. */
  const header = <RailHeader title={title} subtitle={subtitle} actions={headerActions} />
  const body = (
    <>
      {intro && <p className="kol-mono-12 text-meta">{intro}</p>}
      <div className="flex flex-col gap-5">{children}</div>
    </>
  )

  if (variant === 'overlay') {
    if (!open) return null
    /* THE DRAWER'S ANATOMY IN A CENTRED PANEL (user 2026-10-18: *"wrong width wrong close placement, header is
     * bullshit"*): the ⌘K overlay's width, the × on the header's own line as the rail has it, a Divider under the
     * header — it was 380 wide with the × floating in a lane above the title and nothing under the header */
    const width = widthProp ?? 'min(32rem, calc(100vw - 32px))'
    return (
      <FullscreenOverlay open scrim closeButton={false} onClose={onClose}>
        {/* the panel is ModalShell's (W2.2, 2026-11-08) — the lift and the one modal radius; ShortcutsOverlay draws here */}
        <ModalShell
          className={`p-[var(--kol-pad-overlay)] ${className}`}
          style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto' }}
          header={(
            <div className="mb-6 flex items-center gap-4">
              <div className="min-w-0 flex-1">{header}</div>
              <CloseButton onClick={onClose} hover={false} className="shrink-0" />
            </div>
          )}
        >
          <div className="flex flex-col gap-4"><Divider />{body}{footer && <div className="mt-2">{footer}</div>}</div>
        </ModalShell>
      </FullscreenOverlay>
    )
  }

  /* no 380 here any more: the width is the tier's token unless the caller sets one (RailKit) */
  const width = widthProp
  return (
    /* THE APPROVED DRAWER (SettingsPanelApproved, kol-r2b2 2026-08-27 — user: "LOCK
       THIS"): no edge, no shadow, the Rail's hairline under the header, the sections.
       THE SCRIM IS BACK (settings-drawer-has-no-surface, kol-client-olina
       2026-09-03). `backdrop={false}` stood here from 2026-08-30; the drawer
       paints `bg-surface-primary`, the same token as the page, so the scrim was
       the only thing separating them — with it off the panel was invisible and
       the controls floated in the right third of the screen.
       `backdrop` FORWARDS (SettingsPanelBackdrop, kol-monitor 2026-10-24): the default keeps olina's scrim; a page-level
       rail passes `false` and gets the Rail's own no-scrim setup — the page keeps running under it. */
    <Rail role={role} open={open} onClose={onClose} side="right" variant={tier} width={width} header={header} className={className} edge={false} shadow={false} closeHover={false} backdrop={backdrop} mode={mode}
      /* the foot is the Rail's pinned slot now (RailKit): reset and the verbs stay in reach while the sections scroll */
      footer={footer}>
      {/* the hairline under the header is the Rail's now (the standard header, 2026-10-25) — every rail has it */}
      <div className="flex flex-col gap-4">{body}</div>
    </Rail>
  )
}

/**
 * SettingsRow — One labelled setting. a `LabeledControl horizontal` (SettingsPanelApproved, 2026-08-27):
 * uppercase label (`kol-helper-10` tracked, meta ink) in a 160px column, the
 * control fills the rest. A switch sits at the far right (`align="end"`, the
 * default); a dropdown fills the row (`align="fill"`). No hint sentences on the
 * page — `hint` rides the control's DS `Tooltip` (a native `title` until
 * 2026-09-22, kol-client-olina). `labelWidth="auto"` passes through
 * to LabeledControl: the label flexes and truncates, the control hugs — for a
 * row living in a column narrower than the 160px label default
 * (SettingsShortcutsComboOverflow, kol-monitor 2026-09-01). `text` is a row whose value is text — the same label,
 * on the baseline, as tall as its text (LabeledControl's `text`; SettingsRowMonoBaseline, kol-monitor 2026-10-18).
 * `stack` puts the label ABOVE the value, both at the row's start — a dated entry read as a bulletin (metric's
 * Deploys tab, Round 3 2026-10-31: *"date above the text"*); `labelWidth` and `align` do nothing there.
 */
export function SettingsRow({ label, hint, align = 'end', labelWidth = 160, text = false, stack = false, children }) {
  if (stack) align = 'fill'
  return (
    <LabeledControl horizontal={!stack} text={text} label={typeof label === 'string' ? label.toUpperCase() : label} labelWidth={labelWidth}>
      {hint
        ? <Tooltip label={hint} triggerClassName={`flex min-h-6 items-center w-full ${align === 'fill' ? '' : 'justify-end'}`.trim()}>{children}</Tooltip>
        /* `flex`, not `inline-flex`: an inline box rode the label's text baseline and sat 5px low (2026-10-31) */
        : <span className={`flex min-h-6 items-center w-full ${align === 'fill' ? '' : 'justify-end'}`.trim()}>{children}</span>}
    </LabeledControl>
  )
}

/** SettingsSwitch — An on/off setting. the row's on/off control: the DS ToggleSwitch, bare, sm.
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

/** LabeledControlSection — A titled section of labelled controls. a section of LabeledControls: the EYEBROW
 *  (`kol-eyebrow text-fg-80`) standing apart from the rows (gap-3), the rows in
 *  their own stack — `rowGap` 1 for switch rows (24 tall already), 2 for
 *  dropdown rows. `divided` = a hairline above (between sections).
 *  Was `SettingsSection` until 2026-08-27 (LabeledControlSection, kol-r2b2 —
 *  user ruling: it named the place it was first used, not what it is; kol-fxr
 *  took it for a params rail the same day). RENAMED, NO ALIAS — the render is
 *  the 0.104.0 locked composition, untouched.
 *
 *  `variant="float"` — the one float section (plan-2026-11-12-float-rails-figma W10.1, the user: *"this should be a
 *  component with slots that has multiple items?"*): a `head` (the `label`, any node, a string in the float label role,
 *  and `end`, a + button or a meta, at the far end) over the items (children, any number). PropertyRail's sections and
 *  subheads, ReadingContents' chapters and NavRail float's groups all draw it. The head renders only when a label or an
 *  end is given, the items only when there are any. `gap` is head to items, `rowGap` items to items, each a spacing step
 *  (0.5 · 1 · 1.5 · 2 · 3) or `'module'` (`--kol-float-module-gap`); float defaults 3 (12) and 2 (8). `as` the element
 *  (`nav` for a list of links), the rest of the props on it. */
const GAP = { 0.5: 'gap-0.5', 1: 'gap-1', 1.5: 'gap-1.5', 2: 'gap-2', 3: 'gap-3', module: 'gap-[var(--kol-float-module-gap)]' }
const SETTINGS_GAP = { 3: 'gap-3', 4: 'gap-4', settings: 'gap-[7px]' }
/* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18): kolbox's RailSection (Figma 27:9309),
 * carried from apps/kolbox/src/ui/RailSection.jsx. A 1px rule at the section's top, then the head: a 40 row, the `label`
 * 16 in, its `end` actions (24 boxes) 4 apart and 8 off the right edge; 4 to the rows, inset 16, 8 apart; 16 under them.
 * With no rows it is the rule and the head alone (41 high). Measured on Figma's own rails (plan-2026-11-23-editor-
 * measured-against-figma W3: Pages, Layers, Page, Styles and Export headers are 40, label 16 in); closed is not empty, so its title and
 * its actions keep the full ink (his "I thought text were white", R3.2).
 * THE RAIL'S ONE GRID (plan-2026-11-19-kolbox-whats-left R3.1): in a Rail the rows' tracks are set here, once, as
 * `--kol-kolbox-row-cols`: two field columns and two 16 icon columns, 8 apart (76, 76, 16, 16 in the 240 rail; his
 * design's Stroke row, 149:26890). FieldPair and ColorInputRow kolbox lay out on it; the head's actions sit at the right
 * of the head (above); LabeledControl kolbox's 76 label is the first field column. */
function LabeledControlSectionKolbox({ label, end, className = '', children }) {
  const rows = Children.toArray(children)
  const open = rows.length > 0
  return (
    <section
      className={`kol-section--kolbox relative flex flex-col gap-1 pt-px ${open ? 'pb-4' : ''} before:absolute before:inset-x-0 before:top-0 before:h-px ${className}`}
      data-rail-section={label ?? ''}
    >
      {(label || end) && (
        <header className="flex h-10 items-center pr-2 pl-4">
          <h3 className="kol-section-title--kolbox min-w-0 flex-1 truncate">{label}</h3>
          {end && <span className="flex shrink-0 items-center gap-1">{end}</span>}
        </header>
      )}
      {open && <div className="flex flex-col gap-2 px-4 in-data-rail:[--kol-kolbox-row-cols:minmax(0,1fr)_minmax(0,1fr)_var(--kol-spacing-4)_var(--kol-spacing-4)]">{rows}</div>}
    </section>
  )
}

/* `variant="folio"` (Folio batch C, 2026-11-22): Folio's SettingGroup, carried class for class. The `label` (12 / 17
 * medium, Folio's ink) 12 over its rows, the rows 8 apart. Chrome in kol-theme `.kol-section--folio`. */
function LabeledControlSectionFolio({ label, className = '', children }) {
  return (
    <div className={`kol-section--folio flex flex-col gap-[12px] ${className}`.trim()}>
      <p className="kol-section-title--folio">{label}</p>
      <div className="flex flex-col gap-[8px]">{children}</div>
    </div>
  )
}

export function LabeledControlSection(props) {
  if (props.variant === 'folio') return <LabeledControlSectionFolio {...props} />
  return props.variant === 'kolbox' ? <LabeledControlSectionKolbox {...props} /> : <LabeledControlSectionBody {...props} />
}
function LabeledControlSectionBody({ label, end, variant, divided = false, gap, rowGap, collapsible = false, open, defaultOpen = true, onToggle, as: Tag = 'div', children, className = '', ...rest }) {
  const [ownOpen, setOwnOpen] = useState(defaultOpen)
  /* `variant="settings"` (plan-2026-11-12-float-rails-figma W13.1): the generator settings window's group — the head is
   * the title (a string in Inter 12 semibold) with `end` (the note) at its right on one baseline, 15 over the items;
   * `divided` rules it off from the next group (22 under the items, an oq-16 rule, 18 to the next; the last none).
   * `gap` 3 · 4 replaces the 15; `rowGap` 3 · 4 · 'settings' (7) spaces the items, unset they sit flush. */
  if (variant === 'settings') {
    const items = Children.toArray(children)
    const hasLabel = label != null && label !== false && label !== ''
    return (
      <Tag data-labeled-control-section="" className={`flex flex-col ${SETTINGS_GAP[gap] ?? 'gap-[15px]'} ${divided ? 'pb-[22px] mb-[18px] border-b border-oq-16 last:border-b-0 last:mb-0' : ''} ${className}`.replace(/\s+/g, ' ').trim()} {...rest}>
        {(hasLabel || end) && (
          <div className="flex items-baseline justify-between gap-4 pr-3">
            {hasLabel && (typeof label === 'string' ? <h3 className="text-[12px] leading-[15px] font-semibold text-fg-96 font-(family-name:--kol-font-family-float)">{label}</h3> : label)}
            {end && (typeof end === 'string' ? <span className="text-[10px] leading-[12px] text-oq-64 font-(family-name:--kol-font-family-float)">{end}</span> : end)}
          </div>
        )}
        {items.length > 0 && <div className={`flex flex-col ${SETTINGS_GAP[rowGap] ?? ''}`.trim()}>{items}</div>}
      </Tag>
    )
  }
  if (variant === 'float') {
    const items = Children.toArray(children)
    const hasLabel = label != null && label !== false && label !== ''
    const head = hasLabel && (typeof label === 'string' ? <span className="kol-float-label text-oq-64">{label}</span> : label)
    /* `collapsible` (plan-2026-11-12-one-header W10.1): the head is the toggle, ONE indicator — the 12 chevron at its right
     * end (⌄ open, › closed), the Header's chevron; `open` controlled or `defaultOpen`, `onToggle(open)`. `end` sits before
     * the chevron and must not be interactive. The items hide while closed. */
    const isOpen = !collapsible || (open ?? ownOpen)
    const toggle = () => { const next = !isOpen; if (open === undefined) setOwnOpen(next); onToggle?.(next) }
    return (
      <Tag data-labeled-control-section="" data-open={collapsible ? String(isOpen) : undefined} className={`flex flex-col ${GAP[gap ?? 3]} ${className}`.trim()} {...rest}>
        {collapsible ? (
          <button type="button" aria-expanded={isOpen} onClick={toggle}
            className="flex w-full items-center gap-2 text-left rounded-sm cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
            <span className="flex min-w-0 flex-1 items-center">{head}</span>
            {end}
            <IconLoader name={isOpen ? 'chevron-down' : 'chevron-right'} size="var(--kol-float-chev-sm)" className="shrink-0 text-oq-64" />
          </button>
        ) : (hasLabel || end) && (
          <div className="flex items-center justify-between">
            {head}
            {end}
          </div>
        )}
        {isOpen && items.length > 0 && <div className={`flex flex-col ${GAP[rowGap ?? 2]}`}>{items}</div>}
      </Tag>
    )
  }
  rowGap ??= 2
  return (
    <div className={`flex flex-col gap-3 ${divided ? 'kol-section--divided' : ''} ${className}`.replace(/\s+/g, ' ').trim()}>
      {label && <p className="kol-eyebrow text-fg-80">{label}</p>}
      <div className={`flex flex-col ${rowGap === 1 ? 'gap-1' : 'gap-2'}`}>{children}</div>
    </div>
  )
}

/** SettingsChoice — A one-of-many setting. the row's one-of-N control: the DS Dropdown, sm · primary
 *  (SettingsPanelEyebrowAndDropdowns — user: "put the toggles inside a dropdown,
 *  because it's super messy like it is"). Options are values or `{ value, label }`;
 *  width is the call site's (`className="w-40"`).
 *
 *  `tone` · `size` · `variant` pass through (kol-fxr 2026-08-28): they were
 *  hardcoded, so a settings page ruled sunken could not be told — and kol-fxr
 *  rebuilt this same Dropdown in a local `ChoiceRow`, which is the exact
 *  duplication this component exists to prevent. A component that wraps another
 *  has to forward the wrapped one's seams or it becomes a wall. */
/* `variant` UNSET by default (the Hub review, 2026-09-26): a forced `primary` blocked the
 * tone of a `kol-tone-*` wrapper, so a sunken settings page drew a light well in every row
 * unless the row said `tone="sunken"` itself. Unset, Dropdown takes the wrapper's tone and
 * falls back to primary — the same render wherever there is no wrapper. */
export function SettingsChoice({ options = [], value, onChange, ariaLabel, tone = 'default', size = 'sm', variant, className = '' }) {
  const opts = options.map((o) => (o != null && typeof o === 'object' ? o : { value: o, label: String(o) }))
  return <Dropdown size={size} variant={variant} tone={tone} value={value} onChange={onChange} options={opts} className={`w-full ${className}`.trim()} ariaLabel={ariaLabel} />
}

/* THE CONTROL CHIP (SettingsPanelCompliance, user 2026-08-27: "WROOOONG" on the
 * 0.98.0 Tag pills): `.kol-control` sm on kol-mono-12, filled when on, meta ink
 * when off, the count in meta after the label — the SAME string ContentFilters'
 * kind chips, ViewToggle's text variant and the SELECT / FLAT strip wear. No
 * Tag, no uppercase, no inverse. */
export const CHIP_CLS = 'kol-control kol-control-sm kol-mono-12'
export const chipCls = (on) => `${CHIP_CLS} ${on ? 'kol-control--filled' : 'text-meta hover:text-emphasis'}`

/**
 * SettingsMulti — A many-of-many setting in one dropdown. a many-of-N control as ONE Dropdown (SettingsPanelApproved,
 * 2026-08-27 — the kinds row): the trigger reads `N of M <noun>`, every entry
 * toggles with the list held open, the check icon marks the ones that are on (Dropdown `multiple`). No grouping.
 * @param {Array}  options   [{ value, label }]
 * @param {Array|Set} selected
 * @param {Function} onToggle (value) => void
 * @param {string} noun      the trigger's noun (default 'kinds')
 * @param {string} variant   passed to the Dropdown like `SettingsChoice`'s — unset inherits the page's
 *                           tone. It was hard-coded `primary` until 2026-09-29, so on a sunken settings
 *                           page it was the one lighter dropdown in the section.
 */
export function SettingsMulti({ options = [], selected = [], onToggle, noun = 'kinds', tone = 'default', size = 'sm', variant, className = '' }) {
  const on = selected instanceof Set ? selected : new Set(selected)
  const opts = options.map((o) => ({ value: o.value, label: o.label ?? String(o.value) }))
  return <Dropdown multiple label={`${on.size} of ${options.length} ${noun}`} size={size} variant={variant} tone={tone} value={on} options={opts} onChange={(v) => onToggle?.(v)} className={`w-full ${className}`.trim()} />
}

/**
 * SettingsChipRow — A row of toggle chips. a wrap of toggle chips with optional counts (an
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

/** SettingsFooter — Reset settings to their defaults. one `IconFrame refresh` (primary · sm) at the
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
export function SettingsFooter({ onReset, resetLabel = 'Reset to defaults', resetDisabled = false, children }) {
  return (
    /* no Divider here since 2026-10-25: the rule is the Rail's foot band, full width */
    <div className="kol-ink-step flex justify-end items-center gap-2">
        {children}
        {/* `resetDisabled`: the control stays in its place, dimmed and inert — one footer shape on every rail, whether or
          * not the app has preferences to reset yet (user 2026-10-24: *"standardise what goes in"*) */}
        {(onReset || resetDisabled) && (
          <Tooltip label={resetDisabled ? 'Nothing to reset' : resetLabel}>
            <IconFrame name="refresh" variant="nav" size="sm" onClick={resetDisabled ? undefined : onReset} aria-label={resetLabel} aria-disabled={resetDisabled || undefined} className={resetDisabled ? 'opacity-40 pointer-events-none' : ''} />
          </Tooltip>
        )}
      </div>
  )
}

/** @deprecated 2026-11-12 — `LabeledControlSection variant="settings"` (on the retirement ledger) */
export function SettingsGroup({ title, note, ruled = true, className = '', children }) {
  return <LabeledControlSection variant="settings" label={title} end={note} divided={ruled} className={className}>{children}</LabeledControlSection>
}

/** SettingsDisclosure — the settings window's group that starts closed (`Dialog variant="settings"`, W7.2):
 *  `LabeledControlSection variant="settings"` whose label is the toggle — the 12 chevron, the title, its note right
 *  (plan-2026-11-12-float-rails-figma W13.1; it typed a 16px › until then). Lives here beside the section it draws. */
export function SettingsDisclosure({ label, note, open, onToggle, children }) {
  const head = (
    <button type="button" aria-expanded={!!open} onClick={() => onToggle?.(!open)}
      className="flex flex-1 items-center gap-[11px] h-[19px] text-left rounded focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
      {/* the chevron is the 12 token (LAW 9), never a typed › */}
      <IconLoader name="chevron-right" size="var(--kol-float-chev-sm)" className={`shrink-0 text-oq-64 transition-transform ${open ? 'rotate-90' : ''}`} />
      <span className={`text-[11px] leading-[13px] text-fg-96 font-(family-name:--kol-font-family-float) font-medium`}>{label}</span>
      {note && <span className={`text-[10px] leading-[12px] text-oq-64 font-(family-name:--kol-font-family-float) ml-auto`}>{note}</span>}
    </button>
  )
  return (
    <LabeledControlSection variant="settings" label={head} gap={4} rowGap="settings">
      {open ? children : null}
    </LabeledControlSection>
  )
}
