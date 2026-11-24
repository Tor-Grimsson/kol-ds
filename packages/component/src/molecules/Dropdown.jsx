import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { toneClass } from '../utilities/tone.js'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { MenuList } from './MenuList.jsx'
import { Menu } from './Menu.jsx'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'
import { glyphSize, indicatorSize } from '../hooks/glyphLadders.js'

/**
 * Dropdown — Pick one value from a list. trigger IS button chrome (2026-07-08 chrome law).
 *
 * The trigger emits `kol-btn kol-btn-{variant} kol-btn-{size}` so it renders
 * pixel-identical to a Button of the same variant/size — fills, hover,
 * active, focus ring all come from the button rules in kol-theme.
 * `.kol-dd-*` classes only add trigger layout + the open/panel fusion.
 *
 *   variant unset (default)     — the tone of the nearest `kol-tone-*` wrapper,
 *     else primary (tone-is-the-ground-axis, 2026-09-03)
 *   variant="primary"           — filled trigger; open panel continues the
 *     same fill (one piece: no border, no gap, hairline divider inside)
 *   variant="grey"              — oq-12 filled trigger (opaque per the fill
 *                                 law); panel continues it
 *   tone="inverse"              — the dark chip (`fg-ab-24`) for a washed
 *                                 plane, the panel continuing it (ControlToneInverse,
 *                                 kol-website 2026-08-27); same prop on ViewToggle · Input
 *   variant="raised"            — RETIRING (2026-10-31): an alias of `tone="faint"`, the oq-06 tone it only ever
 *                                 differed by. Use the tone.
 *   variant="outline"           — bordered trigger; open panel carries the
 *     same border, trigger's bottom edge acts as the divider
 *   variant="float"             — the float select (float-everything W2 row 25 · W4 row 54, 2026-11-04): the
 *     trigger a `kol-btn-float` capsule on the float well (a `tone` still wins), the float heights by `size`
 *     (sm 28 · md 36 · lg 44); its list opens 8 under it on `--kol-float-list-r`, the trigger's width, 34 rows
 *     in Inter, no hairline. Still rest and open only. The caret is the float spec's chevron for the trigger's size
 *     (`--kol-float-chev-*`, 12 at sm — plan-2026-11-12-float-system W3.1); in the list hover is the only fill, the
 *     current row carries its dot and no fill (`--kol-float-row-hover` · `-row-selected`).
 *
 * Legacy aliases (pre-law variants, kept so call-sites don't break):
 *   default → primary · subtle → primary · minimal → outline
 *
 * Size: dropdowns are `sm` at EVERY viewport unless the consumer passes an
 * explicit `size` prop (user law 2026-07-28 — desktop is sm, always, and
 * smaller viewports never resolve larger than desktop). The old auto-ramp
 * (lg ≥1024 / md ≥768 / sm below) is gone.
 *
 * An action menu (rows as data under a trigger) is `Menu` (the Menu* family, 2026-10-31), not this.
 */

/* xs (ControlsXsRung, 2026-09-01): the panel rung, opt-in by prop — the default stays sm (2026-07-28 law) */
const SIZE_TYPE = { xs: 'kol-mono-8', sm: 'kol-mono-12', md: 'kol-mono-14', lg: 'kol-mono-16' }
/* THE LIST IS THE TRIGGER'S, CONTINUED (2026-10-02 — user: *"the list has different padding then the
 * button"*). Two things were off at every size but one. The rows were set in `kol-helper-12`
 * whatever the trigger wore, and the helper is wider — "Newest first" fitted its trigger and was
 * cut off in its own row. And the rows sat 4px in from the trigger's text, because the list pads
 * itself by 4 on top of the row's padding. So: the row wears the trigger's face, and its side
 * padding is the trigger's (8 · 12 · 16 · 20) less the list's 4. */
const ROW_PAD = { xs: 'px-1', sm: 'px-2', md: 'px-3', lg: 'px-4' }
/* …AND THE TRIGGER'S HEIGHT (same day — user: *"is it always the same regardless of size?"*). It was:
 * 32px rows at sm · md · lg whatever the trigger stood (26 · 32 · 40), 20 at xs. A row is the
 * trigger's box now, on the control ramp (22 · 26 · 32 · 40 — `--kol-ctl-*`, so the touch rung and
 * a hardware panel move rows and trigger together). */
const ROW_H = { xs: 'h-[var(--kol-ctl-xs)]', sm: 'h-[var(--kol-ctl-sm)]', md: 'h-[var(--kol-ctl-md)]', lg: 'h-[var(--kol-ctl-lg)]' }
const ROW = { xs: `kol-mono-8 ${ROW_PAD.xs} ${ROW_H.xs}`, sm: `kol-mono-12 ${ROW_PAD.sm} ${ROW_H.sm}`, md: `kol-mono-14 ${ROW_PAD.md} ${ROW_H.md}`, lg: `kol-mono-16 ${ROW_PAD.lg} ${ROW_H.lg}` }
/* Caret size comes from the INDICATOR ladder (glyphLadders.js) — the private
 * map that lived here was a transcription of ADJACENT, which is the wrong
 * ladder for a decoration: it put a caret one rung HEAVIER than the label
 * beside it (2026-08-09 user call). */

const LEGACY_VARIANTS = { default: 'primary', subtle: 'primary', minimal: 'outline' }

/* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 4, 2026-11-18): kolbox's Dropdown carried line for line,
 * the chrome in kol-theme `.kol-dd--kolbox`. The closed field with the 12 chevron at the right: a button that opens
 * `Menu variant="kolbox"` OVER itself (28.5: the chosen row on the field, the left edges together, at least as wide as
 * the field, flipped to the field's right edge near the window's, 4 from it), with a check on the current option.
 * `options` strings or `{ value, label }`; `onChange` gets the value as a string. Enter, Space or ArrowDown opens; in the
 * menu the arrows move, Enter picks, a letter jumps, Escape closes; focus comes back to the field.
 *   size   sm (unset) the 28 field; xs the 24 filter (Home's), no fill, Figma's filter measured (plan-2026-11-23-editor-
 *          measured-against-figma W7): the value 8 in, the chevron's glyph 5 after it and 7 off the right edge
 *   tone   unset: the outlined field, the oq-24 line only (the master's default), the line the accent while open or
 *          focused; `grey`: the unbordered field (oq-16 at sm, bare at xs), padding 12 left and 4 right, the chevron 4
 *          after the value, so it hugs its value (the top rail's zoom)
 *   menu   a trigger for its own overlay instead of the option list (the zoom's): menu({ anchor, open, onClose }) is drawn
 *          in place of the Menu, and the field reads `value` as it is
 *   ariaLabel  what it chooses, as KOL's Dropdown; other props (disabled, data-*) land on the button
 *   Folio on kolbox (2026-11-22): a number option's value reaches `onChange` as a number (every other as a string); a
 *   `value` no option holds is shown as it is; `align` (folio's) is read and dropped, the list lies over its field */
function DropdownKolbox({ size, tone, value, options = [], onChange, menu, ariaLabel, align: _align, className = '', variant, ...rest }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const outlined = tone !== 'grey'
  const xs = size === 'xs'
  /* `{ divider: true }` starts a new group (Menu draws the line between groups); a `{ heading }` is not a row here */
  const all = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)).filter((o) => !o?.heading)
  const opts = all.filter((o) => !o?.divider)
  /* a value that no option holds (a node, or an action's name: Folio's Heading, Save to bucket) is shown as it is */
  const current = opts.find((o) => String(o.value) === String(value)) ?? (value != null && value !== '' && opts.length ? { label: value } : opts[0]) ?? { label: value }
  const close = () => { setOpen(false); ref.current?.focus({ preventScroll: true }) }
  const groups = [[]]
  /* the check column only when the field holds one of its options (an action list, Folio's Save to bucket, has none) */
  const held = opts.includes(current)
  for (const o of all) {
    if (o.divider) { if (groups.at(-1).length) groups.push([]); continue }
    const on = o === current
    groups.at(-1).push({ label: o.label, value: o.value, check: held ? on : undefined, highlighted: on })
  }
  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        data-kol-dropdown=""
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(e) => {
          /* the field's own keys, kept from the page's shortcuts as a native select's are */
          if (!['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) return
          e.preventDefault(); e.stopPropagation()
          if (e.key !== 'ArrowUp') setOpen(true)
        }}
        className={`kol-dd--kolbox${outlined ? ' kol-dd--kolbox-outlined' : ''}${outlined && open ? ' is-open' : ''}${!outlined && !xs ? ' kol-dd--kolbox-filled' : ''} relative flex min-w-0 cursor-pointer items-center disabled:cursor-default disabled:opacity-40 ${xs ? 'h-6 bg-transparent' : 'h-(--kol-kolbox-ctl)'} text-left outline-none ${outlined ? (xs ? 'gap-0.5 border pr-[3px] pl-[7px]' : 'gap-2 border px-2') : 'gap-1 pr-1 pl-3 focus-visible:outline-1'} ${className}`}
        {...rest}
      >
        <span className="min-w-0 flex-1 truncate">{current?.label}</span>
        <KolboxGlyph name="chevron-down" className="kol-dd-caret--kolbox pointer-events-none" />
      </button>
      {menu ? menu({ anchor: ref, open, onClose: close }) : <Menu
        variant="kolbox"
        anchor={ref}
        open={open}
        onClose={close}
        onSelect={(row) => onChange?.(typeof row.value === 'number' ? row.value : String(row.value))}
        groups={groups}
        placement="over"
        aria-label={ariaLabel}
        minWidth={ref.current?.offsetWidth}
      />}
    </>
  )
}

/* `variant="folio"` (Folio migration batch B, 2026-11-22): Folio's Choice carried class for class, the chrome in kol-theme
 * `.kol-dd--folio`. The button is as wide as its text (its type is the caller's or the row's), the ⌄ after it; the list
 * opens under it in place (never portalled, so it keeps the frame's `data-folio-*`), the current row green with its ✓.
 * Esc or a press outside closes. `options` `{ value, label }` (a label may be a node; `value` reaches `onChange` as it
 * is), `ariaLabel`, `disabled`, `className` (the button's). Folio's own word: `align` left (unset), right, bottom-left,
 * bottom-right: the list's edge and side. */
function DropdownFolio({ value, options = [], onChange, ariaLabel, disabled, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const off = (e) => { if (!box.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('mousedown', off); addEventListener('keydown', esc)
    return () => { removeEventListener('mousedown', off); removeEventListener('keydown', esc) }
  }, [open])
  const current = options.find((o) => o.value === value)?.label ?? value
  return (
    <span ref={box} className="relative inline-flex">
      <button type="button" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} disabled={disabled} onClick={() => setOpen(!open)} className={`kol-dd--folio inline-flex items-center gap-[4px] rounded-[3px] disabled:cursor-default ${className}`}>
        {current}{!disabled && <span aria-hidden className="kol-dd-caret--folio">⌄</span>}
      </button>
      {open && (
        <span role="listbox" aria-label={ariaLabel} className={`kol-dd-list--folio absolute z-50 flex min-w-[160px] flex-col rounded-[3px] border py-[4px] ${/right/.test(align) ? 'right-0' : 'left-0'} ${/bottom/.test(align) ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'}`}>
          {options.map((o) => (
            <button key={o.value} type="button" role="option" aria-selected={o.value === value} onClick={() => { setOpen(false); onChange?.(o.value) }} className={`kol-dd-option--folio${o.value === value ? ' is-current' : ''} flex items-center gap-[8px] whitespace-nowrap px-[12px] py-[7px] text-left`}>
              <span aria-hidden className="kol-dd-check--folio inline-flex size-[16px] shrink-0 items-center justify-center">{o.value === value ? '✓' : ''}</span>{o.label}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}

const Dropdown = (props) => (props.variant === 'kolbox' ? <DropdownKolbox {...props} /> : props.variant === 'folio' ? <DropdownFolio {...props} /> : <DropdownOn {...props} />)

const DropdownOn = ({
  options = [],
  value,
  onChange,
  size,
  variant,
  tone = 'default',
  /* DropdownGhostWidthAndListHeight (kol-mirror 2026-08-28 — user, on the
   * studio's 30-option Source picker in a ~300px shelf: "1 it's way too tall,
   * 2 it's not fitting"):
   *   `maxRows`   how many rows the panel shows before the list scrolls
   *               (default 10). Popover's size middleware clamps the panel to
   *               the VIEWPORT, which does nothing for a 30-row slab opened at
   *               the top of a tall page — and its inline maxHeight cannot be
   *               overridden from a consumer stylesheet, so the ceiling is ours.
   *   `rowHeight` the row pitch (number = px, or any CSS length) for a chrome
   *               whose own rows are shorter than the h-8 rung. Inline on the
   *               row, because `h-8` is a utility and a rule cannot out-rank it.
   * Both write variables on the panel that `.kol-dd-list` reads. */
  maxRows = 10,
  rowHeight,
  /* `onOptionHover(value | null)` (DropdownOptionHoverPreview, kol-mirror
   * 2026-08-28): the pointer entering a row reports its value, leaving reports
   * `null` — so a picker over a VISUAL setting can preview the hovered option
   * live and revert on leave. mirror's blend-mode picker applies the hovered
   * mode to the composite: you scrub 16 modes against the actual image instead
   * of committing to each one to look at it. The same case is every picker over
   * easing curves, palettes, filters, fonts — the DS owns the panel, only the
   * consumer knows what to preview, so this reports and nothing else.
   *
   * `null` fires ON CLOSE too, and that half is load-bearing: a panel dismissed
   * while a row is hovered would otherwise leave the consumer previewing
   * forever. It never fires while closed — a closed dropdown has no rows. */
  onOptionHover,
  /* OPTIONS may carry more than `{ value, label }`: `icon` puts a glyph in the
   * row's line box (ADJACENT ladder — it sits beside a label), and `shortcut`
   * prints on every row that is NOT the current one, the tick taking that slot
   * when it is. Both were added for the tool-palette idiom and are general —
   * a menu of tools and a menu of anything else want the same two columns. */
  /* ICON-ONLY TRIGGER — an icon name, or a pre-rendered node dropped in where
   * the glyph goes. The trigger becomes the pinned square (`kol-btn-icon`) at
   * the current size, with no label, no ghost widths and no caret; the panel
   * still sizes to its own rows rather than the trigger. This is what a tool
   * rail needs, and its absence is why kol-fxr's ToolPalette hand-rolls a
   * trigger out of `PopoverPanel` + `usePopover` at a bespoke 36/22 instead of
   * importing anything (`editor-set-is-behind-its-source`, 2026-09-03). */
  iconOnly,
  /* A mark drawn INSIDE the trigger box, over the glyph — the tool-palette
   * corner fold is the case. Kept a slot rather than a boolean so the square
   * has one implementation and the drawing stays the caller's. */
  triggerAdornment,
  defaultOpen = false,
  /* `stayOpen` — a click outside does not close the list (the trigger and Esc still do). For a
   * surface where the open list is the thing being looked at while other controls are worked:
   * the showcase's preview, with its toolbar pickers beside it (user 2026-10-02: *"can we
   * disclude the preview from that behaviour?"*). */
  stayOpen = false,
  /* `ariaLabel` — what the dropdown CHOOSES (DropdownAriaLabel, kol-fxr 2026-10-13: a Color pane's
   * Hue · Wheel · HSL · RGB picker read as "Hue, popup button", no word for what it picks). Same name
   * as SegmentedToggle's. An aria-label replaces the button's text, so the current value rides along
   * after it — "Color view, Hue" — and is still announced. */
  ariaLabel,
  /* `multiple` — many-of-N (SettingsMulti, metric 2026-10-31 — user: *"some werid bastardisation of multiselect"*).
   * `value` is an array or Set, every row toggles (`onChange(value)` per click) and carries the check while on, the
   * list stays open, and the trigger reads `label` — no fake summary row, no ✓ typed into labels. */
  multiple = false,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  /* the trigger's tone reaches the portalled panel through `Menu` (it copies `--kol-tone-*` on open) */
  const triggerRef = useRef(null)
  /* …AND SO IS A ZOOM (2026-10-02, kol-monitor's rack — user: *"what about the dropdown in general?
   * its kinda wrong no"*). A trigger inside a zoomed surface (the rack at 80%) is drawn smaller,
   * but the portalled list was not: it kept its full-size type inside a panel pinned to the
   * trigger's SHRUNKEN width, so the names were cut off — 18 of monitor's 40 presets at 80%, all
   * of them at 50%. The trigger's scale is its drawn width over its layout width; the list's
   * content takes the same zoom, so trigger and list stay one piece at any scale. */
  const [scale, setScale] = useState(1)
  const [inPanel, setInPanel] = useState(false)
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return
    const laid = triggerRef.current.offsetWidth
    const s = laid ? triggerRef.current.getBoundingClientRect().width / laid : 1
    setScale(Math.abs(s - 1) > 0.01 ? s : 1)
    /* and the panel it opened from: a hardware plate keeps its desk sizes on touch, and the
     * portalled list would otherwise take the touch rung its trigger skipped */
    setInPanel(!!triggerRef.current.closest('.kol-hw-panel'))
  }, [isOpen])

  // sm everywhere unless explicitly overridden (see docblock size law).
  const resolvedSize = size || 'sm'

  /* `variant="raised"` retires into `tone="faint"` (2026-10-31) — the alias, until nobody passes it */
  if (variant === 'raised') { variant = undefined; tone = 'faint' }
  const resolvedVariant = LEGACY_VARIANTS[variant] || variant
  const float = resolvedVariant === 'float'

  /* The panel is `Menu fused` (plan-2026-10-31-menu-engine W1.3): below the trigger, never flipped (the fused edge
   * assumes below), the trigger's width, a listbox. */

  /* Width belongs to the CALL SITE (2026-08-09 user call — "width without any
   * regard to context"). The viewport-keyed resize listener that handed every
   * dropdown a fixed width by window size is gone: default is hug-content,
   * and the consumer sizes it through className exactly as on Input. The open
   * panel follows the trigger via matchReferenceWidth either way. */

  const handleSelect = (option) => {
    onChange?.(option.value)
    if (!multiple) setIsOpen(false)
  }

  /* the hover report, and the close that ends it. `hovered` is a ref, not
   * state — the preview is the consumer's business and re-rendering the panel
   * on every row crossed would be a render per pointermove for nothing. */
  const hovered = useRef(null)
  const reportHover = (v) => {
    if (hovered.current === v) return
    hovered.current = v
    onOptionHover?.(v)
  }
  useEffect(() => {
    if (isOpen || hovered.current == null) return
    hovered.current = null
    onOptionHover?.(null)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  /* `{ divider: true }` in `options` draws a hairline between groups (FoundationsTones, 2026-09-26 —
   * user: none on top, the filled tones in order, outline and ghost apart). It is never a choice:
   * the lookup, the fallback and the trigger's width all read the choices only. */
  /* `{ heading: 'Variant' }` names the list (2026-10-01 — user: "first item 'variant' then divider
   * then the list"): a row that says what the dropdown sets, never a choice. */
  const choices = options.filter((opt) => !opt?.divider && !opt?.heading)
  const picked = multiple ? (value instanceof Set ? value : new Set(value ?? [])) : null
  const currentOption = multiple ? { label } : choices.find((opt) => opt.value === value) || choices[0]

  /* A clamped list (Popover caps the panel to the viewport) can open with the
   * checked row past the fold — scroll it into reach. Keyboard focus after
   * that scrolls natively; the list's children are the option buttons 1:1. */
  const listRef = useRef(null)
  useEffect(() => {
    if (!isOpen) return
    const idx = options.findIndex((opt) => !opt?.divider && !opt?.heading && opt.value === currentOption?.value)
    listRef.current?.children[idx]?.scrollIntoView({ block: 'nearest' })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const triggerCls = [
    'kol-btn',
    /* grey is dropdown-only chrome (2026-07-15) — no kol-btn-* class so it
     * never leaks into Button's variant set */
    resolvedVariant === 'grey' ? 'kol-dd-trigger--grey' : resolvedVariant === 'raised' ? 'kol-dd-trigger--raised' : resolvedVariant && `kol-btn-${resolvedVariant}`,
    `kol-btn-${resolvedSize}`,
    /* a float trigger types itself (Inter 500 at the float size) */
    !float && SIZE_TYPE[resolvedSize],
    'kol-dd-trigger',
    float && 'kol-dd-trigger--float',
    /* ICON-ONLY: the pinned square from Button's own class, so a tool-rail
     * dropdown is the same box as the icon button beside it at every rung
     * (editor-set-is-behind-its-source, kol-fxr 2026-09-03 — its ToolPalette
     * hand-rolls a trigger out of PopoverPanel + usePopover precisely because
     * this mode did not exist). No label, no ghost widths, no caret. */
    iconOnly && 'kol-btn-icon kol-dd-trigger--icon',
    isOpen && 'kol-dd-trigger--open',
    /* the dark chip on a washed plane; the panel continues it (ControlToneInverse, 2026-08-27) */
    toneClass(tone),
  ].filter(Boolean).join(' ')

  const trig = ({ props }) => (
      <button
        ref={triggerRef}
        {...props}
        type="button"
        className={triggerCls}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel ? [ariaLabel, currentOption?.label].filter((t) => typeof t === 'string' && t).join(', ') : undefined}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {iconOnly ? (
          /* the glyph comes from the SOLO ladder — an icon alone in a pinned
           * square — never from a call-site number */
          typeof iconOnly === 'string'
            ? <IconLoader name={iconOnly} size={glyphSize(resolvedSize, true)} />
            : iconOnly
        ) : (
          <>
            {/* every option's label rides along hidden so the trigger is as wide
              * as its widest value — the panel matches the trigger's width, so
              * trigger and list stay one piece at every selection */}
            <span className="kol-dd-label">
              <span>{currentOption?.label}</span>
              {choices.map((option) => (
                <span key={option.value} className="kol-dd-ghost" aria-hidden="true">
                  {option.label}
                </span>
              ))}
              {multiple && <span className="kol-dd-ghost" aria-hidden="true">{label}</span>}
            </span>
            {/* chrome lives in .kol-dd-caret (trailing edge + open-state flip) —
              * keyed off the trigger's data-state, no inline styles */}
            <IconLoader name="chevron-down" size={float ? `var(--kol-float-chev-${resolvedSize === 'md' || resolvedSize === 'lg' ? resolvedSize : 'sm'})` : indicatorSize(resolvedSize)} className="kol-dd-caret" />
          </>
        )}
        {/* a consumer's own trigger mark — the tool-palette corner fold rides
            here so the square keeps ONE implementation */}
        {triggerAdornment}
      </button>
  )

  /* the options as MenuList rows (plan-2026-11-07-menu-system W1.1 — rows are mapped in MenuList only) */
  const headingCls = `${resolvedSize === 'xs' ? 'kol-mono-8' : 'kol-helper-12'} ${ROW_H[resolvedSize] ?? ROW_H.sm} ${ROW_PAD[resolvedSize] ?? ROW_PAD.sm} flex shrink-0 items-center text-meta`
  const items = options.map((option, i) => {
    if (option?.divider) return { divider: true, key: `divider-${i}` }
    if (option?.heading) return { heading: option.heading, key: `heading-${i}` }
    const isActive = multiple ? picked.has(option.value) : option.value === currentOption?.value
    return {
      key: option.value,
      /* NO HOVER STATE ANYWHERE ON A DROPDOWN (user 2026-08-28) — the indicator marks the current value. */
      hover: false,
      size: resolvedSize,
      /* a float row is the float list's (`.kol-menu-panel--float .kol-menu-row`), whatever the trigger's rung; the
       * current one carries its dot and no fill (W3.1, P2: "it dosnt highlight selected, only hover") */
      rowClass: float ? `kol-menu-row${isActive ? ' kol-menu-row--current' : ''}` : (ROW[resolvedSize] ?? ROW.sm),
      height: rowHeight,
      onPointerEnter: onOptionHover ? () => reportHover(option.value) : undefined,
      onPointerLeave: onOptionHover ? () => reportHover(null) : undefined,
      onClick: () => handleSelect(option),
      /* The current row's mark is the INDICATOR, always — • for the one pick, ✓ (the check icon) for each
       * row on in a `multiple` (plan-2026-10-31-menu-engine W2). An option's own `shortcut` shows on the
       * rows that are not current — the tool-palette idiom (editor-set-is-behind-its-source, 2026-09-03). */
      indicator: isActive ? (multiple ? 'check' : 'dot') : undefined,
      shortcut: isActive ? undefined : option.shortcut,
      /* an option's leading glyph — the ADJACENT ladder, because it sits in a line box beside a label, never the solo rung */
      label: option.icon ? (
        <>
          <span className="shrink-0 inline-flex items-center" style={{ marginRight: 'var(--kol-spacing-2)' }}>
            <IconLoader name={option.icon} size={glyphSize(resolvedSize)} />
          </span>
          {option.label}
        </>
      ) : option.label,
    }
  })

  return (
    <Menu
      fused
      role="listbox"
      open={isOpen}
      onOpenChange={setIsOpen}
      stayOpen={stayOpen}
      closeOnSelect={!multiple}
      rootClassName={`kol-dd-root relative inline-block align-middle ${className}`}
      trigger={trig}
      variant={float ? 'float' : undefined}
      offset={float ? 8 : undefined}
      panelClassName={`${resolvedVariant && !float ? `kol-dd-panel--${resolvedVariant}` : ''} ${toneClass(tone)} ${inPanel ? 'kol-hw-panel' : ''}`.replace(/\s+/g, ' ').trim()}
      panelStyle={{
        '--kol-dd-max-rows': maxRows ?? 10,
        /* a row is the trigger's height; the panel's max-height reads it */
        '--kol-dd-row-h': rowHeight == null ? `var(--kol-ctl-${resolvedSize})` : typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight,
      }}
    >
        {/* THE HAIRLINE UNDER THE TRIGGER, ALWAYS (2026-10-02 — user: *"I see it sometimes and sometimes
          * not"*). One rule: an open dropdown has the line. */}
        <div className="kol-dd-div" />

        <div ref={listRef} className="kol-dd-list flex flex-col gap-[var(--kol-spacing-0-5)]" role="listbox" aria-multiselectable={multiple || undefined} style={scale !== 1 ? { zoom: scale } : undefined}>
          <MenuList items={items} dividerClassName="my-1" headingClassName={headingCls} />
        </div>
    </Menu>
  )
}

export default Dropdown
