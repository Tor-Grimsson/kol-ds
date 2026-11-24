import { useMemo, useRef, useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import ColorSwatch from './ColorSwatch.jsx'
import Input, { selectOnFirstPress, useKolboxField } from '../atoms/Input.jsx'
import FieldPair from './FieldPair.jsx'
import { usePopover, PopoverPanel, Tooltip } from '../utilities/Popover.jsx'

/**
 * ColorInputRow — swatch chip + `#` hex input row. The single merged form of
 * the brand editor's ColorField (layer color assignment: palette-ref popover
 * behind the swatch) and SwatchRow (palette-slot editing: lock toggle +
 * token-name column) — one core with additive slots instead of two
 * overlapping molecules. Supersedes both lobby briefs (lobby/ColorField.md,
 * lobby/SwatchRow.md).
 *
 * Modes (additive on the core swatch + hex input):
 *   refs          — the swatch becomes a popover trigger over a 6-column grid
 *                   of palette entries. Entries arrive PRE-RESOLVED
 *                   ({ value, label, hex }) — no `palette:` string convention,
 *                   no resolver seam; the app keeps its own resolution logic.
 *                   Picking a cell fires onChange(entry.value) and closes.
 *   lock          — `onToggleLock` makes the swatch the lock toggle: a sibling
 *                   absolute overlay span (NOT inside the swatch — its
 *                   overflow-hidden would clip it) shows the lock/unlock glyph,
 *                   pinned visible when locked, on hover otherwise. Ignored
 *                   when `refs` is set — the swatch has one click affordance.
 *   tokenName     — adds the resolved-token readout column and switches the
 *                   row from a flex row to the fixed 4-column grid
 *                   (24px / label / token / input).
 *
 * The hex input is normalized per SwatchRow: value renders as bare UPPER
 * digits behind the `#` prefix, and every keystroke emits
 * onChange('#' + digits.toUpperCase()) — the `.toUpperCase()` is value
 * normalization, not copy casing. SwatchRow's dead `edited` prop is dropped;
 * `transparentTone` is an explicit prop, never inferred from the label.
 * Composition only — no color math, no store coupling.
 *
 * Props:
 *   value           — current color: '#RRGGBB', a refs entry's `value`, or
 *                     null (renders the transparent "None" swatch)
 *   onChange        — (next: string) => void — '#'+UPPER hex on typing, or
 *                     entry.value on a palette pick
 *   label           — row label (kol-helper-12); also prefixes aria-labels
 *   hideLabel       — suppress the visible label (aria keeps it)
 *   refs            — [{ value, label, hex? }] palette entries → popover mode.
 *                     `hex` may be omitted when `resolveRef` is supplied
 *   resolveRef      — (value) => hex — the RESOLVER SEAM. Without it, every
 *                     entry must arrive pre-resolved and a `palette:accent`
 *                     value cannot be shown at all: the swatch has no hex and
 *                     the subtitle prints the raw ref. With it, a consumer
 *                     keeps its own palette and this row renders live against
 *                     it (editor-set-is-behind-its-source, kol-fxr 2026-09-03 —
 *                     its ColorField takes `palette` and calls `resolveColor`)
 *   autoValue       — the THEME state's value, typically a `var(--kol-*)`
 *                     token that flips with light/dark. Set, the popover
 *                     offers a Theme button; unset, it does not — a field with
 *                     no auto value has no theme to fall back to
 *   size            — control rung for the hex input, 'xs'|'sm'|'md'|'lg'
 *                     (default 'sm'). A rail renders a dozen of these and the
 *                     rung is the rail's decision, not each row's
 *   locked          — lock overlay pinned visible, aria-pressed on the swatch
 *   onToggleLock    — () => void — swatch click toggles the lock
 *   tokenName       — resolved token readout (kol-helper-10) → grid mode
 *   disabled        — opacity-30 + pointer-events-none + aria-disabled
 *   unused          — muted slot: transparent swatch, label/token drop to
 *                     text-meta/text-subtle, input dims
 *   transparentTone — TransparentX stroke tone for the null/unused swatch:
 *                     'warning' (default) | 'error' | 'info' | 'success'
 */
function ColorInputRowDefault({
  value,
  onChange,
  label,
  hideLabel = false,
  refs,
  resolveRef,
  autoValue,
  size = 'sm',
  locked = false,
  onToggleLock,
  tokenName,
  disabled = false,
  unused = false,
  transparentTone = 'warning',
  className = '',
}) {
  const hasRefs = Array.isArray(refs) && refs.length > 0
  /* The popover carries the ref grid AND the quick states, so a field with no
   * palette but an `autoValue` still gets one — that is the whole Theme/None
   * affordance and it has nowhere else to live. */
  const hasPopover = hasRefs || autoValue != null
  const isLockToggle = !hasPopover && typeof onToggleLock === 'function'
  const isGrid = tokenName != null
  const labelVisible = label != null && !hideLabel

  /* A value is one of FOUR kinds, and the row has to tell them apart before it
   * can render anything: a literal hex, a palette REF the consumer resolves, a
   * themed `var(--kol-*)` token that flips with light/dark, or null — None.
   * The first port only understood the first and the last. */
  const isVar = typeof value === 'string' && value.startsWith('var(')
  const isNone = value == null

  /* Display resolution: a refs entry shows its own hex, `resolveRef` resolves
   * anything else the consumer owns (a `palette:` ref, a token), and a bare
   * hex IS the value. `hex` on the entry still wins, so a pre-resolved list
   * needs no resolver and nothing existing moves. */
  const resolve = (v) => {
    if (v == null) return null
    const entry = hasRefs ? refs.find((r) => r.value === v) : undefined
    return entry?.hex ?? resolveRef?.(v) ?? (typeof v === 'string' && v.startsWith('#') ? v : null)
  }
  const activeRef = hasRefs ? refs.find((r) => r.value === value) : undefined
  const displayHex = resolve(value)
  /* A themed token renders LIVE in the swatch but has no meaningful hex to
   * print, so the field shows its placeholder rather than a resolved literal
   * the user cannot have typed. */
  const digits = isVar || isNone ? '' : (displayHex ?? '').replace(/^#/, '').toUpperCase()
  const showTransparent = unused || (isNone && !isVar)
  const subtitle = isNone
    ? 'None'
    : isVar
      ? 'Theme'
      : (activeRef?.label ?? (displayHex ? '#' + digits : String(value)))

  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 4 })

  const chip = (swatchSize) => (
    <ColorSwatch
      /* a themed token goes STRAIGHT to the swatch — `var(--kol-x)` is a live
       * paint, and resolving it to a literal would freeze it out of the theme */
      hex={showTransparent ? null : (isVar ? value : displayHex)}
      size={swatchSize}
      showTransparent={showTransparent}
      transparentTone={transparentTone}
      hoverable={false}
    />
  )

  /* Swatch cell — popover trigger (refs), lock toggle (onToggleLock), or a
   * plain preview chip. The lock overlay is a SIBLING of the swatch: inside
   * it, ColorSwatch's overflow-hidden radius clip would cut the glyph off. */
  const swatchCell = hasPopover ? (
    <button
      type="button"
      ref={popover.refs.setReference}
      {...popover.getReferenceProps()}
      aria-label={`${label ?? 'Color'}: ${subtitle}`}
      className="inline-flex items-center shrink-0"
    >
      {chip(24)}
    </button>
  ) : isLockToggle ? (
    <Tooltip label={locked ? 'Unlock' : 'Lock'} asChild>
    <button
      type="button"
      onClick={onToggleLock}
      aria-pressed={locked}
      className="group relative inline-flex h-6 w-6 shrink-0"
    >
      {chip('stretch')}
      <span
        aria-hidden="true"
        className={`absolute inset-0 inline-flex items-center justify-center rounded-[var(--kol-radius-2)] transition-opacity bg-fg-ab-48 text-white pointer-events-none ${
          locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <IconLoader name={locked ? 'lock' : 'unlock'} size={12} />
      </span>
    </button>
    </Tooltip>
  ) : (
    chip(24)
  )

  /* leading-normal: truncate's overflow clip cuts mono descenders on
   * kol-helper's 1-em line box (MenuItemDescenderClip sweep, 2026-08-12). */
  const labelCls = `kol-helper-12 truncate leading-normal ${unused ? 'text-meta' : 'text-emphasis'}`

  const hexInput = (
    <Input
      variant="filled"
      size={size}
      prefix="#"
      chars={6}
      maxLength={6}
      placeholder={isVar ? 'auto' : '–'}
      value={digits}
      onChange={(e) => onChange?.('#' + e.target.value.replace(/^#/, '').toUpperCase())}
      disabled={disabled}
      aria-label={label ? `${label} hex` : 'Hex color'}
      className={unused ? 'opacity-50' : ''}
    />
  )

  const stateCls = `items-center gap-2 ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className}`

  return (
    <>
      {isGrid ? (
        <div
          className={`grid ${stateCls}`}
          style={{ gridTemplateColumns: '24px 1fr 1fr 1fr' }}
          aria-disabled={disabled || undefined}
        >
          {swatchCell}
          <span className={labelCls}>{labelVisible ? label : ''}</span>
          <span className={`kol-helper-10 truncate leading-normal ${unused ? 'text-subtle' : 'text-meta'}`}>
            {tokenName}
          </span>
          {hexInput}
        </div>
      ) : (
        <div className={`flex ${stateCls}`} aria-disabled={disabled || undefined}>
          {swatchCell}
          {labelVisible && <span className={`${labelCls} flex-1 min-w-0`}>{label}</span>}
          {hexInput}
        </div>
      )}
      {hasPopover && (
        <PopoverPanel
          popover={popover}
          panel={false}
          focus={false}
          className="bg-surface-secondary border border-fg-08 rounded p-2 flex flex-col gap-2 shadow-lg"
          style={{ minWidth: 200 }}
        >
          {hasRefs && (
            <div className="grid grid-cols-6 gap-1">
              {refs.map((entry) => (
                <ColorSwatch
                  key={entry.value}
                  hex={entry.hex ?? resolveRef?.(entry.value) ?? null}
                  size="fill"
                  selected={entry.value === value}
                  title={entry.label}
                  onClick={() => {
                    onChange?.(entry.value)
                    setOpen(false)
                  }}
                />
              ))}
            </div>
          )}
          {/* QUICK STATES. Theme (the auto value — a token that flips with
              light/dark) is offered only where the field HAS one; None is
              always available, because clearing a color is not a palette
              decision. Both were dropped in the first port, which is what left
              `value == null` renderable but unreachable. */}
          <div className="flex items-center gap-2">
            {autoValue != null && (
              <button
                type="button"
                onClick={() => { onChange?.(autoValue); setOpen(false) }}
                aria-pressed={isVar}
                className="flex items-center gap-1.5 kol-helper-12 text-fg-64 rounded px-1.5 h-6 border border-fg-08"
              >
                <ColorSwatch hex={resolve(autoValue) ?? autoValue} size={14} hoverable={false} />
                Theme
              </button>
            )}
            <button
              type="button"
              onClick={() => { onChange?.(null); setOpen(false) }}
              aria-pressed={isNone}
              className="flex items-center gap-1.5 kol-helper-12 text-fg-64 rounded px-1.5 h-6 border border-fg-08"
            >
              <ColorSwatch
                hex="#FFFFFF"
                size={14}
                showTransparent
                transparentTone={transparentTone}
                hoverable={false}
              />
              None
            </button>
          </div>
        </PopoverPanel>
      )}
    </>
  )
}

/* ── kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18) ─────────────────────────────────────────────────
 * kolbox's FillRow (Figma 84:12831), carried from apps/kolbox/src/ui/FillRow.jsx: one joined field (oq-16, radius 4, no
 * outline) holding the hex segment (the 16 swatch and the hex in Inter 11, padding 6 and 8, gap 8) and, after a 1px
 * gap in the rail ground (1 by 22, W16.5), the opacity segment (the value mono 11 and "%" muted, 8 in, the % 16 after the
 * value and 4 off the end); with `actions` the row is FieldPair
 * kolbox's: the field over both field columns of the rail's grid, the actions on its icon columns (R3.1). The
 * swatch opens the caller's color overlay through `onSwatch` (with `lit` while it is open), or else the row's own
 * `picker` (ColorPickerPopover variant="kolbox": this row is a molecule and cannot import the organism, so the caller
 * hands it in), beside the rail level with the swatch. The hex is edited in place (one press selects it, a short hex grows on Enter or blur: `expandHex`); a value that is not a plain hex shows
 * `resolved` on the swatch and its own text in the field. `opacity` 0 to 100 through `onOpacity` (read-only without it);
 * null draws no opacity segment. `clearable`: emptying the hex commits null (an optional color, unset). `hidden` (the paint's eye is off) dims the opacity value; the color stays readable. `label` names the row's parts for a reader; this look draws no label. */
const HEX_KOLBOX = /^[0-9a-f]{6}$/i
/* a short hex grows on commit: 1 character six times, 2 three times, 3 each doubled; 6 as written; anything else is null */
export function expandHex(raw) {
  const d = String(raw ?? '').trim().replace(/^#/, '')
  if (!/^[0-9a-f]+$/i.test(d)) return null
  if (d.length === 1) return d.repeat(6)
  if (d.length === 2) return d.repeat(3)
  if (d.length === 3) return [...d].map((c) => c + c).join('')
  return d.length === 6 ? d : null
}
function ColorInputRowKolbox({ label, value, resolved, onChange, onSwatch, opacity, onOpacity, actions, lit = false, hidden = false, clearable = false, picker: Picker }) {
  const hex = HEX_KOLBOX.test(String(value ?? '').replace('#', '')) ? String(value).replace('#', '').toUpperCase() : null
  const swatch = resolved ?? (hex ? `#${hex}` : null)
  const swatchRef = useRef(null)
  const [picking, setPicking] = useState(false)
  /* the row's own picker opens beside the rail (never over it), level with the swatch; outside a rail, beside the swatch */
  const anchor = useMemo(() => ({
    getBoundingClientRect() {
      const sw = swatchRef.current?.getBoundingClientRect()
      const rail = swatchRef.current?.closest('[data-rail]')?.getBoundingClientRect()
      return rail ? { left: rail.left, right: rail.left, top: sw.top, bottom: sw.top } : sw
    },
    contains: (t) => !!swatchRef.current?.contains(t),
  }), [])
  /* the hex and the opacity are kolbox's fields (Input's useKolboxField): Escape restores, the opacity's arrows step */
  const hexField = useKolboxField(hex ?? String(value ?? ''), (text) => {
    if (clearable && !text) { if (value) onChange?.(null); return }
    const d = expandHex(text)
    if (d) onChange?.(`#${d.toLowerCase()}`)
  }, { step: false })
  const op = opacity == null ? null : Math.round(opacity)
  const opField = useKolboxField(op, (text) => { const n = parseFloat(text); if (Number.isFinite(n)) onOpacity?.(Math.min(100, Math.max(0, n))) })
  const field = (
      <div className={`kol-color-row-field flex h-(--kol-kolbox-ctl) min-w-0 flex-1 items-stretch${lit || picking ? ' is-lit' : ''}`} data-fill-field>
        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2 pl-1.5" data-fill-hex>
          <Tooltip variant="kolbox" asChild label={label}>
          <button
            ref={swatchRef}
            type="button"
            aria-label={`${label}: ${swatch ?? hexField.value}`}
            aria-expanded={onSwatch ? lit : picking}
            className="kol-color-row-swatch relative size-3.5 shrink-0 outline-none focus-visible:outline-solid focus-visible:outline-1"
            style={{ background: swatch ?? 'transparent' }}
            onClick={(e) => (onSwatch ? onSwatch(e) : setPicking((o) => !o))}
          />
          </Tooltip>
          <input
            className="kol-color-row-hex min-w-0 flex-1 self-stretch bg-transparent uppercase outline-none"
            aria-label={`${label} hex`}
            {...hexField}
            onMouseDown={selectOnFirstPress}
          />
        </div>
        {op != null && (
          <>
            {/* Figma's pair (W16.5): a 1 by 22 gap in the rail's ground; the number 8 in, the % 16 after it and 4 off the end */}
            <span className="kol-color-row-rule my-px w-px shrink-0" />
            <label className="flex shrink-0 items-center gap-4 self-stretch pr-1 pl-2" data-fill-opacity>
              <input
                aria-label={`${label} opacity`}
                readOnly={!onOpacity}
                {...opField}
                onMouseDown={selectOnFirstPress}
                className="kol-color-row-opacity field-sizing-content min-w-0 self-stretch bg-transparent outline-none"
              />
              <span className="kol-color-row-unit">%</span>
            </label>
          </>
        )}
      </div>
  )
  const picker = !onSwatch && Picker && (
        <Picker
          variant="kolbox"
          anchor={anchor}
          open={picking}
          onClose={() => setPicking(false)}
          color={swatch && HEX_KOLBOX.test(swatch.replace('#', '')) ? swatch : undefined}
          opacity={op ?? 100}
          onChange={({ value: v, opacity: o }) => { onChange?.(v.toLowerCase()); if (op != null && o !== op) onOpacity?.(o) }}
        />
      )
  const root = `kol-color-row--kolbox min-w-0 flex-1 ${hidden ? 'is-hidden' : ''}`
  /* with actions the row is a rail row: the field spans the grid's two field columns, the actions sit on its icon
     columns (FieldPair kolbox, R3.1); alone it is a field that fills its cell */
  return actions
    ? <><FieldPair variant="kolbox" span className={root} data-fill-row first={field} trailing={actions} />{picker}</>
    : <div className={`${root} flex h-(--kol-kolbox-ctl) items-center`} data-fill-row>{field}{picker}</div>
}

/* ── folio (Folio batch C, 2026-11-22): Folio's SwatchRow, carried class for class. The swatch (the `picker`,
 * ColorPickerPopover variant="folio", handed in as kolbox's is: a molecule cannot import the organism), the `label`
 * (12 / 16 medium, taking the room) and the hex (mono 12 / 16, capitals, Folio's muted ink), 12 apart. `swatches`
 * ([name, hex]) go to the picker; `onChange(hex)`. Chrome in kol-theme `.kol-color-row--folio`. ── */
function ColorInputRowFolio({ label, value, swatches, onChange, picker: Picker }) {
  return (
    <div className="kol-color-row--folio flex w-full items-center gap-[12px]">
      {Picker && <Picker variant="folio" label={label} color={value} swatches={swatches} onChange={onChange} />}
      <p className="kol-color-row-label min-w-0 flex-1 truncate">{label}</p>
      <p className="kol-color-row-value shrink-0 uppercase">{value}</p>
    </div>
  )
}

export default function ColorInputRow(props) {
  if (props.variant === 'folio') return <ColorInputRowFolio {...props} />
  return props.variant === 'kolbox' ? <ColorInputRowKolbox {...props} /> : <ColorInputRowDefault {...props} />
}
