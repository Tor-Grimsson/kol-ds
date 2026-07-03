import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-loader'
import ColorSwatch from './ColorSwatch'
import Input from '../atoms/Input'
import LabeledControl from '../atoms/LabeledControl'
import { usePopover, PopoverPanel } from '../atoms/Popover'

const HEX6 = /^[0-9A-F]{6}$/

/** '#f0a' / 'F0A' / '#ff00aa' → 'FF00AA'; anything unparseable → null. */
function normalizeDigits(raw) {
  if (typeof raw !== 'string') return null
  let d = raw.replace(/^#/, '').trim().toUpperCase()
  if (/^[0-9A-F]{3}$/.test(d)) d = d.replace(/./g, (c) => c + c)
  return HEX6.test(d) ? d : null
}

/**
 * ColorInputRow — swatch chip + `#` hex input row. The single merged form of
 * the brand editor's ColorField (layer color assignment: palette-ref popover
 * behind the swatch) and SwatchRow (palette-slot editing: trailing extras) —
 * one core, optional trailing affordances instead of two overlapping
 * molecules.
 *
 * The input keeps a local draft while typing and commits on blur/Enter:
 * digits are filtered to hex as typed, shorthand `F0A` expands to `FF00AA`,
 * and only a valid 6-digit hex fires `onChange('#RRGGBB')` — invalid drafts
 * revert to the current value. Picking a palette-ref swatch fires the ref's
 * (pre-resolved) hex and closes the popover.
 *
 * Composition only — no color math, no store coupling. Palette entries come
 * in pre-resolved via `paletteRefs`; the app-side `resolveColor`/PALETTE_REFS
 * and `tokenNameFor` seams stay in the consumer. SwatchRow's `edited` prop
 * was dead in the source render and is dropped ([dead-prop] handled);
 * `transparentTone` is an explicit prop, not inferred from the label string.
 *
 * @param {string|null} value           current color, '#RRGGBB' (3-digit accepted, normalized); null → transparent "None" swatch
 * @param {Function}    onChange        (hex: string) => void — normalized '#RRGGBB' on commit or palette pick
 * @param {string}      label           optional label; when set the row wraps in LabeledControl
 * @param {Array}       paletteRefs     [{ id, label, value }] pre-resolved entries → swatch becomes a popover trigger with a ref grid (omit for a plain preview chip)
 * @param {Function}    onRemove        () => void — renders a trailing remove (×) button
 * @param {ReactNode}   trailing        extra trailing affordances (lock toggle, token name, …)
 * @param {number}      swatchSize      chip size in px (default 24)
 * @param {string}      transparentTone TransparentX stroke tone for the null-value swatch: 'warning' (default) | 'error' | 'info' | 'success'
 * @param {string}      inputVariant    Input chrome: 'filled' (default) | 'ghost' | 'outline'
 * @param {boolean}     disabled        dims the row, blocks pointer, aria-disabled
 */
export default function ColorInputRow({
  value,
  onChange,
  label,
  paletteRefs,
  onRemove,
  trailing,
  swatchSize = 24,
  transparentTone = 'warning',
  inputVariant = 'filled',
  disabled = false,
  className = '',
}) {
  const digits = normalizeDigits(value)
  const hasRefs = Array.isArray(paletteRefs) && paletteRefs.length > 0

  /* Local typing draft, re-synced whenever the controlled value changes
   * (render-time reset — no effect, no flicker). */
  const [draft, setDraft] = useState(digits ?? '')
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setDraft(normalizeDigits(value) ?? '')
  }

  const [open, setOpen] = useState(false)
  const popover = usePopover({ open, onOpenChange: setOpen, placement: 'bottom-start', offset: 4 })

  const commit = () => {
    const next = normalizeDigits(draft)
    if (next == null) {
      setDraft(digits ?? '') // invalid or empty → revert, never emit
      return
    }
    setDraft(next)
    if (next !== digits) onChange?.('#' + next)
  }

  const pick = (ref) => {
    onChange?.('#' + (normalizeDigits(ref.value) ?? ''))
    setOpen(false)
  }

  /* Swatch subtitle for the trigger's aria-label: the matching ref's label
   * when the value is a palette color, else the hex, else 'None'. */
  const refLabel = hasRefs
    ? paletteRefs.find((r) => normalizeDigits(r.value) === digits)?.label
    : undefined
  const subtitle = digits == null ? 'None' : (refLabel ?? '#' + digits)

  const swatch = (
    <ColorSwatch
      hex={digits ? '#' + digits : null}
      size={hasRefs ? 'stretch' : swatchSize}
      showTransparent={digits == null}
      transparentTone={transparentTone}
      hoverable={false}
    />
  )

  const row = (
    <div
      className={`flex items-center gap-2 ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className}`}
      aria-disabled={disabled || undefined}
    >
      {hasRefs ? (
        <button
          type="button"
          ref={popover.refs.setReference}
          {...popover.getReferenceProps()}
          aria-label={`${label ?? 'Color'}: ${subtitle}`}
          className="inline-flex items-center shrink-0"
          style={{ width: swatchSize, height: swatchSize }}
        >
          {swatch}
        </button>
      ) : (
        swatch
      )}
      <Input
        variant={inputVariant}
        size="sm"
        prefix="#"
        chars={6}
        maxLength={6}
        uppercase
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 6))}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit() }}
        disabled={disabled}
        aria-label={label ? `${label} hex` : 'Hex color'}
      />
      {trailing}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          title="Remove"
          className="inline-flex items-center justify-center w-6 h-6 shrink-0 rounded text-meta hover:text-emphasis hover:bg-fg-08 transition-colors"
        >
          <Icon name="x" size={12} />
        </button>
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
            {paletteRefs.map((ref) => (
              <ColorSwatch
                key={ref.id}
                hex={'#' + (normalizeDigits(ref.value) ?? '')}
                size="fill"
                selected={normalizeDigits(ref.value) === digits && digits != null}
                title={ref.label}
                onClick={() => pick(ref)}
              />
            ))}
          </div>
        </PopoverPanel>
      )}
    </div>
  )

  return label ? <LabeledControl label={label}>{row}</LabeledControl> : row
}
