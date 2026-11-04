import Button from '../atoms/Button.jsx'
import Dropdown from './Dropdown.jsx'
import QuantityInput from './QuantityInput.jsx'
import TabsRow from './TabsRow.jsx'

/* taxonomy-ok: molecule — float Dropdowns, QuantityInput, TabsRow and Button under mono labels */

const TRACK = 'w-full rounded-full bg-[var(--kol-float-well)] p-1 [&>button]:flex-1 [&>button]:justify-center'

/**
 * ReadingSettings — How the text is set: the Reading side of `ReadingPanel` (float-everything W11 row 151, 2026-11-04 —
 * kol-float--style W2.9 `Contextual reading panel · Reading`). Each setting under a `kol-float-ruler` label (uppercase,
 * fg-64), 24 between: the theme pick (`themes` — a row of kol-styleguide `ThemeTile`s; kol-component cannot import
 * it), the face as a float Dropdown, the size as the float QuantityInput (`22 px`), leading and width as float
 * Dropdowns, the page flow as the float chip track (Scroll · Pages, fg-16 on the well), and `Reset defaults` as the
 * secondary float capsule. Every control is a shipped float part, worn whole.
 *
 * @param {ReactNode} [themes]   the theme row
 * @param {string}    [font]     · {Array} [fonts] `[{ value, label }]` · {Function} [onFont]
 * @param {number}    [size]     px · {Function} [onSize] · {number} [minSize] (12) · {number} [maxSize] (40)
 * @param {string}    [leading]  · {Array} [leadings] · {Function} [onLeading]
 * @param {string}    [width]    · {Array} [widths] · {Function} [onWidth]
 * @param {string}    [flow]     · {Array} [flows] (default Scroll · Pages) · {Function} [onFlow]
 * @param {Function}  [onReset]  · {string} [resetLabel] default `Reset defaults`
 * @param {Object}    [labels]   the heads: `{ theme, font, size, leading, width, flow }`
 * @param {string}    [className]
 */
const LABELS = { theme: 'Theme', font: 'Font', size: 'Text size', leading: 'Line height', width: 'Reading width', flow: 'Page flow' }
const FLOWS = [{ value: 'scroll', label: 'Scroll' }, { value: 'pages', label: 'Pages' }]

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="kol-float-ruler uppercase text-fg-64">{label}</span>
      {children}
    </div>
  )
}

export default function ReadingSettings({ themes, font, fonts = [], onFont, size = 22, onSize, minSize = 12, maxSize = 40, leading, leadings = [], onLeading, width, widths = [], onWidth, flow = 'scroll', flows = FLOWS, onFlow, onReset, resetLabel = 'Reset defaults', labels: l = {}, className = '' }) {
  const L = { ...LABELS, ...l }
  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      {themes && <Field label={L.theme}><div className="flex gap-2">{themes}</div></Field>}
      {fonts.length > 0 && <Field label={L.font}><Dropdown variant="float" size="md" options={fonts} value={font} onChange={onFont} className="w-full" /></Field>}
      <Field label={L.size}><QuantityInput variant="float" unit="px" ariaLabel="text size" value={size} onChange={onSize} min={minSize} max={maxSize} className="w-full" /></Field>
      {leadings.length > 0 && <Field label={L.leading}><Dropdown variant="float" size="md" options={leadings} value={leading} onChange={onLeading} className="w-full" /></Field>}
      {widths.length > 0 && <Field label={L.width}><Dropdown variant="float" size="md" options={widths} value={width} onChange={onWidth} className="w-full" /></Field>}
      <Field label={L.flow}><TabsRow variant="float" size="xs" overflow="wrap" tabs={flows} value={flow} onChange={onFlow} ariaLabel={L.flow} className={TRACK} /></Field>
      {onReset && <Button variant="float" tone="secondary" size="lg" onClick={onReset} className="mt-4 w-full justify-center">{resetLabel}</Button>}
    </div>
  )
}
