import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import ColorSwatch from './ColorSwatch'
import Input from '../atoms/Input'
import { usePopover, PopoverPanel } from '../atoms/Popover'

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
 *   refs            — [{ value, label, hex }] pre-resolved palette entries →
 *                     popover mode
 *   locked          — lock overlay pinned visible, aria-pressed on the swatch
 *   onToggleLock    — () => void — swatch click toggles the lock
 *   tokenName       — resolved token readout (kol-helper-10) → grid mode
 *   disabled        — opacity-30 + pointer-events-none + aria-disabled
 *   unused          — muted slot: transparent swatch, label/token drop to
 *                     text-meta/text-subtle, input dims
 *   transparentTone — TransparentX stroke tone for the null/unused swatch:
 *                     'warning' (default) | 'error' | 'info' | 'success'
 */
export default function ColorInputRow({
  value,
  onChange,
  label,
  hideLabel = false,
  refs,
  locked = false,
  onToggleLock,
  tokenName,
  disabled = false,
  unused = false,
  transparentTone = 'warning',
  className = '',
}) {
  const hasRefs = Array.isArray(refs) && refs.length > 0
  const isLockToggle = !hasRefs && typeof onToggleLock === 'function'
  const isGrid = tokenName != null
  const labelVisible = label != null && !hideLabel

  /* Display resolution: when the current value is a refs entry, the swatch and
   * input show the entry's pre-resolved hex; otherwise value IS the hex. */
  const activeRef = hasRefs ? refs.find((r) => r.value === value) : undefined
  const displayHex = activeRef?.hex ?? value ?? null
  const digits = (displayHex ?? '').replace(/^#/, '').toUpperCase()
  const showTransparent = unused || displayHex == null
  const subtitle = displayHex == null ? 'None' : (activeRef?.label ?? '#' + digits)

  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 4 })

  const chip = (size) => (
    <ColorSwatch
      hex={showTransparent ? null : displayHex}
      size={size}
      showTransparent={showTransparent}
      transparentTone={transparentTone}
      hoverable={false}
    />
  )

  /* Swatch cell — popover trigger (refs), lock toggle (onToggleLock), or a
   * plain preview chip. The lock overlay is a SIBLING of the swatch: inside
   * it, ColorSwatch's overflow-hidden radius clip would cut the glyph off. */
  const swatchCell = hasRefs ? (
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
    <button
      type="button"
      onClick={onToggleLock}
      aria-pressed={locked}
      title={locked ? 'Unlock' : 'Lock'}
      className="group relative inline-flex h-6 w-6 shrink-0"
    >
      {chip('stretch')}
      <span
        aria-hidden="true"
        className={`absolute inset-0 inline-flex items-center justify-center rounded-[2px] transition-opacity bg-fg-absolute-48 text-white pointer-events-none ${
          locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <Icon name={locked ? 'lock' : 'unlock'} size={12} />
      </span>
    </button>
  ) : (
    chip(24)
  )

  const labelCls = `kol-helper-12 truncate ${unused ? 'text-meta' : 'text-emphasis'}`

  const hexInput = (
    <Input
      variant="filled"
      size="sm"
      prefix="#"
      chars={6}
      maxLength={6}
      uppercase
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
          <span className={`kol-helper-10 truncate ${unused ? 'text-subtle' : 'text-meta'}`}>
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
      {hasRefs && (
        <PopoverPanel
          popover={popover}
          panel={false}
          focus={false}
          className="bg-surface-secondary border border-fg-08 rounded p-2 shadow-lg"
          style={{ minWidth: 200 }}
        >
          <div className="grid grid-cols-6 gap-1">
            {refs.map((entry) => (
              <ColorSwatch
                key={entry.value}
                hex={entry.hex}
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
        </PopoverPanel>
      )}
    </>
  )
}
