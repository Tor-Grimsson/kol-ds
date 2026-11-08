import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'
import ButtonGroup from './ButtonGroup.jsx'
import ToggleSwitch from '../atoms/ToggleSwitch.jsx'
import Dropdown from './Dropdown.jsx'
import Slider from './Slider.jsx'

/* taxonomy-ok: molecule — the settings window's controls, each a shipped atom in the window's dense look */

/**
 * The SETTINGS controls — the generator settings window's rows (plan-2026-11-05-float-editor W7.2; his frame 12:2282,
 * `Dialog variant="settings"`). His look, one rung: a 28 field on the primary surface behind an oq-16 rule, a 5 round,
 * Inter 11 (readouts JetBrains Mono 10); a label above in Inter 10 at oq-64. Every part is a shipped control dressed for
 * the window — Slider, the dual Slider, Dropdown, SegmentedToggle, ToggleSwitch, Input — not a second set.
 *
 *   SettingsGroup      a titled block (Inter 12 semibold) with a note at its right; `children` its rows; groups are
 *                      ruled apart (`ruled`, default true)
 *   SettingsCell       a labelled cell (`label` over the control) — a group lays them two-up (`SettingsGrid`)
 *   SettingsSlider     the boxed slider: the float track and a mono readout (`format`)
 *   SettingsRange      two handles on one track (From / To) — the dual Slider, boxed, both readouts
 *   SettingsSelect     the boxed Dropdown (`options` `[{ value, label }]`)
 *   SettingsSegmented  the boxed SegmentedToggle (Rows / Columns), the lit cell on oq-16
 *   SettingsToggle     ToggleSwitch with its words
 *   SettingsText       the boxed Input (text or number)
 *   SettingsPoint      an X / Y pair of number fields
 *   SettingsRamp       an A→B row: label · value A · curve · value B (`SettingsRampHead` the VALUE A · CURVE · VALUE B row)
 *   SettingsLights     a list of points — X · Y · radius · intensity · delete — and Add light
 *   SettingsFieldMap   the field's gradient strip: FIELD MAP over a 26 strip (`background`) and two captions
 *   SettingsDisclosure a group that starts closed (› More geometry … its note)
 *
 * `disabled` on any of them dims it to 40% and takes it out of the tab order (a control whose engine param does not
 * exist yet). Keyboard is each shipped part's own: ← / → on a slider and on the segmented, Enter / Space on a select.
 */

const FIELD = 'h-7 w-full min-w-0 rounded-[5px] border border-oq-16 bg-surface-primary'
const INK = 'text-[11px] leading-[13px] text-fg-96 font-(family-name:--kol-font-family-float)'
const LABEL = 'text-[10px] leading-[12px] text-oq-64 font-(family-name:--kol-font-family-float)'
const MONO = 'font-(family-name:--kol-font-family-mono) text-[10px] leading-[12px] text-fg-96'

/* a disabled control: a fieldset disables every input and button inside it natively */
const Dim = ({ disabled, className = '', children, ...rest }) => (
  <fieldset disabled={disabled || undefined} aria-disabled={disabled || undefined} {...rest}
    className={`min-w-0 m-0 p-0 ${className.includes('border-oq-16') ? '' : 'border-0'} ${disabled ? 'opacity-40' : ''} ${className}`.trim()}>{children}</fieldset>
)

export function SettingsGroup({ title, note, ruled = true, className = '', children }) {
  return (
    <section className={`flex flex-col ${ruled ? 'pb-[22px] mb-[18px] border-b border-oq-16 last:border-b-0 last:mb-0' : ''} ${className}`.trim()}>
      {(title || note) && (
        <header className="flex items-baseline justify-between gap-4 pr-3 pb-[15px]">
          {title && <h3 className="text-[12px] leading-[15px] font-semibold text-fg-96 font-(family-name:--kol-font-family-float)">{title}</h3>}
          {note && <span className={LABEL}>{note}</span>}
        </header>
      )}
      {children}
    </section>
  )
}

export const SettingsGrid = ({ className = '', children }) => <div className={`grid grid-cols-2 gap-x-3 gap-y-[7px] ${className}`.trim()}>{children}</div>

export function SettingsCell({ label, span = 1, disabled, className = '', children, ...rest }) {
  return (
    <Dim disabled={disabled} className={`flex flex-col gap-1.5 ${span === 2 ? 'col-span-2' : ''} ${className}`.trim()} {...rest}>
      {label && <span className={LABEL}>{label}</span>}
      {children}
    </Dim>
  )
}

export function SettingsSlider({ value, onChange, min = 0, max = 1, step = 0.01, format = (v) => String(v), disabled, 'aria-label': ariaLabel }) {
  return (
    <Dim disabled={disabled} className={`${FIELD} flex items-center gap-3 pl-[9px] pr-2`}>
      <Slider variant="float" readout="none" value={value} onChange={onChange} min={min} max={max} step={step} disabled={disabled}
        aria-label={ariaLabel} className="flex-1 min-w-0 [&_.kol-slider-float]:h-4" />
      <span className={`${MONO} w-[52px] shrink-0 tabular-nums`}>{format(value)}</span>
    </Dim>
  )
}

export function SettingsRange({ value = [0, 1], onChange, min = 0, max = 1, step = 0.01, format = (v) => String(v), disabled, 'aria-label': ariaLabel }) {
  const [a, b] = value
  return (
    <Dim disabled={disabled} className={`${FIELD} flex items-center gap-2 px-2`}>
      <span className={`${MONO} shrink-0 tabular-nums`}>{format(a)}</span>
      <Slider variant="dual" value={a} value2={b} min={min} max={max} step={step} aria-label={ariaLabel}
        onChange={(v) => onChange?.([Math.min(v, b), b])} onChange2={(v) => onChange?.([a, Math.max(v, a)])}
        label1="" label2="" className="flex-1 min-w-0" />
      <span className={`${MONO} shrink-0 tabular-nums`}>{format(b)}</span>
    </Dim>
  )
}

export function SettingsSelect({ value, onChange, options = [], disabled, ariaLabel, className = '' }) {
  return (
    <Dim disabled={disabled} className="w-full">
      <Dropdown value={value} onChange={onChange} options={options} ariaLabel={ariaLabel} size="sm"
        className={`w-full [&_.kol-dd-trigger]:w-full [&_.kol-dd-trigger]:!h-7 [&_.kol-dd-trigger]:!rounded-[5px] [&_.kol-dd-trigger]:!border [&_.kol-dd-trigger]:!border-(--kol-oq-16) [&_.kol-dd-trigger]:!bg-(--kol-surface-primary) [&_.kol-dd-trigger]:!px-2 [&_.kol-dd-trigger]:!text-[11px] [&_.kol-dd-trigger]:!font-normal [&_.kol-dd-trigger]:!text-(--kol-fg-96) [&_.kol-dd-trigger]:font-(family-name:--kol-font-family-float) [&_.kol-dd-trigger]:justify-between [&_.kol-dd-caret]:text-(--kol-oq-64) ${className}`.trim()} />
    </Dim>
  )
}

export function SettingsSegmented({ value, onChange, options = [], disabled, ariaLabel }) {
  return (
    <Dim disabled={disabled} className={`${FIELD} p-0.5`}>
      <ButtonGroup layout="joined" value={value} onChange={onChange} options={options} ariaLabel={ariaLabel} size="sm"
        className="!flex w-full h-full !border-0 !bg-transparent !p-0 gap-0 [&_.kol-seg-cell]:flex-1 [&_.kol-seg-cell]:h-full [&_.kol-seg-cell]:!rounded-[3px] [&_.kol-seg-cell]:!border-0 [&_.kol-seg-cell]:!bg-transparent [&_.kol-seg-cell]:!text-[10px] [&_.kol-seg-cell]:!text-(--kol-oq-64) [&_.kol-seg-cell]:font-(family-name:--kol-font-family-float) [&_.kol-seg-cell.is-active]:!bg-(--kol-oq-16) [&_.kol-seg-cell.is-active]:!text-(--kol-fg-96) [&_.kol-seg-cell.is-active]:font-medium" />
    </Dim>
  )
}

export function SettingsToggle({ label, checked, onChange, disabled }) {
  return (
    <Dim disabled={disabled} className="flex items-center gap-2 h-7">
      <ToggleSwitch checked={!!checked} onChange={onChange} aria-label={label} disabled={disabled} />
      {label && <span className={INK}>{label}</span>}
    </Dim>
  )
}

export function SettingsText({ value, onChange, onCommit, type = 'text', placeholder, disabled, 'aria-label': ariaLabel, className = '' }) {
  return (
    <Dim disabled={disabled} className="w-full">
      <Input variant="outline" size="sm" type={type} value={value ?? ''} placeholder={placeholder} aria-label={ariaLabel}
        onChange={onChange ? (e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value) : undefined}
        onCommit={onCommit} disabled={disabled}
        className={`${FIELD} !px-2 !py-0 [&_input]:text-[11px] [&_input]:text-(--kol-fg-96) [&_input]:font-(family-name:--kol-font-family-float) ${className}`.trim()} />
    </Dim>
  )
}

export function SettingsPoint({ value = [0.5, 0.5], onChange, min, max, step = 0.01, disabled, 'aria-label': ariaLabel }) {
  const [x, y] = value
  const clamp = (n) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
  const field = (axis, v, set) => (
    <label className={`${FIELD} flex items-center gap-1.5 px-2`}>
      <span className={LABEL} aria-hidden="true">{axis}</span>
      <input type="number" value={v} min={min} max={max} step={step} disabled={disabled} aria-label={`${ariaLabel ?? 'Point'} ${axis}`}
        onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) set(clamp(n)) }}
        className={`${INK} w-full min-w-0 bg-transparent border-0 p-0 focus:outline-none tabular-nums`} />
    </label>
  )
  return (
    <Dim disabled={disabled} className="grid grid-cols-2 gap-2">
      {field('X', x, (n) => onChange?.([n, y]))}
      {field('Y', y, (n) => onChange?.([x, n]))}
    </Dim>
  )
}

export const SettingsRampHead = () => (
  <div className="grid grid-cols-[88px_minmax(0,87fr)_minmax(0,122fr)_minmax(0,87fr)] gap-x-2 pb-0.5" aria-hidden="true">
    <span />
    {['Value A', 'Curve', 'Value B'].map((t) => <span key={t} className={`${LABEL} uppercase text-center`}>{t}</span>)}
  </div>
)

export function SettingsRamp({ label, value = { a: 0, b: 1, curve: 'linear' }, onChange, curves = [], disabled, partial, ...rest }) {
  const set = (k) => (v) => onChange?.({ ...value, [k]: v })
  const num = (k) => (
    <input type="number" value={value[k]} aria-label={`${label} value ${k.toUpperCase()}`} disabled={disabled || partial?.[k]}
      onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) set(k)(n) }}
      className={`${FIELD} ${INK} px-2 focus:outline-none focus-visible:shadow-[var(--kol-float-focus)] tabular-nums ${partial?.[k] ? 'opacity-40' : ''}`} />
  )
  return (
    <Dim disabled={disabled} className="grid grid-cols-[88px_minmax(0,87fr)_minmax(0,122fr)_minmax(0,87fr)] gap-x-2 items-center" {...rest}>
      <span className={`${INK} !text-(--kol-oq-64)`}>{label}</span>
      {num('a')}
      <div className={partial?.curve ? 'opacity-40' : ''}>
        <SettingsSelect value={value.curve} onChange={set('curve')} options={curves} ariaLabel={`${label} curve`} disabled={disabled || partial?.curve} />
      </div>
      {num('b')}
    </Dim>
  )
}

export function SettingsLights({ value = [], onChange, disabled }) {
  const set = (i, k, n) => onChange?.(value.map((l, j) => (j === i ? { ...l, [k]: n } : l)))
  const cell = (i, k, v, label, step = 0.01) => (
    <input type="number" value={v} step={step} aria-label={`Light ${i + 1} ${label}`}
      onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n)) set(i, k, n) }}
      className={`${FIELD} ${INK} px-2 focus:outline-none focus-visible:shadow-[var(--kol-float-focus)] tabular-nums`} />
  )
  return (
    <Dim disabled={disabled} className="flex flex-col gap-1">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_28px] gap-x-2 pb-0.5" aria-hidden="true">
        {['X', 'Y', 'Radius', 'Intensity'].map((t) => <span key={t} className={`${LABEL} uppercase`}>{t}</span>)}
        <span />
      </div>
      {value.map((l, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_28px] gap-x-2 items-center">
          {cell(i, 'x', l.x, 'X')}{cell(i, 'y', l.y, 'Y')}{cell(i, 'radius', l.radius, 'radius')}{cell(i, 'intensity', l.intensity, 'intensity')}
          <Button tone="ghost" quiet size="xs" iconOnly="trash" aria-label={`Delete light ${i + 1}`} onClick={() => onChange?.(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" onClick={() => onChange?.([...value, { x: 0.5, y: 0.5, radius: 0.3, intensity: 1 }])}
        className={`${INK} self-start h-7 px-2 rounded-[5px] hover:bg-(--kol-oq-08) focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]`}>+ Add light</button>
    </Dim>
  )
}

export function SettingsFieldMap({ background, left, right, label = 'Field map' }) {
  return (
    <div className="flex flex-col">
      <span className={`${LABEL} uppercase pb-[9px]`}>{label}</span>
      <div className="h-[26px] rounded-[4px] bg-surface-primary" style={{ background }} role="img" aria-label={`${label}: ${left ?? ''}`} />
      <div className="flex justify-between gap-2 pt-2.5 pr-6">
        <span className={INK}>{left}</span>
        <span className={`${LABEL} !text-(--kol-fg-64)`}>{right}</span>
      </div>
    </div>
  )
}

export function SettingsDisclosure({ label, note, open, onToggle, children }) {
  return (
    <section className="flex flex-col">
      <button type="button" aria-expanded={!!open} onClick={() => onToggle?.(!open)}
        className="flex items-center gap-[11px] h-[19px] pr-3 text-left rounded focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)]">
        <span aria-hidden="true" className={`text-[16px] leading-[19px] text-oq-64 transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
        <span className={`${INK} font-medium`}>{label}</span>
        {note && <span className={`${LABEL} ml-auto`}>{note}</span>}
      </button>
      {open && <div className="pt-4 flex flex-col gap-[7px]">{children}</div>}
    </section>
  )
}
