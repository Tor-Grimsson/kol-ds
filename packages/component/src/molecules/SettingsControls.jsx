import Input from '../atoms/Input.jsx'
import Button from '../atoms/Button.jsx'
import ToggleSwitch from '../atoms/ToggleSwitch.jsx'
import Dropdown from './Dropdown.jsx'
import Slider from './Slider.jsx'
import TabsRow from './TabsRow.jsx'
import LabeledControl from './LabeledControl.jsx'

/* taxonomy-ok: molecule — the settings window's composite parts, each built from shipped float atoms */

/**
 * The SETTINGS parts — what the generator settings window (`ModalDialog variant="settings"`) draws that is MORE than one
 * base control (plan-2026-11-12-one-header W6.1; the user, P9: *"whats the point of taking a base, and wrapping it and
 * adding nothing"*). A plain row is `LabeledControl variant="float"` around the base itself — `Slider variant="float"
 * readout="input"`, `Dropdown variant="float"`, `Input variant="float"`, `TabsRow variant="float"`, a bare float
 * `ToggleSwitch` in a `horizontal` row — never a Settings* part. What stays here composes several:
 *
 *   SettingsGrid      the two-up grid a group lays its rows in
 *   SettingsPoint     an X / Y pair of float Inputs (the prefix names the axis)
 *   SettingsRamp      an A→B row, `LabeledControl variant="float" horizontal`: value A · curve · value B (float Input ·
 *                     float Dropdown · float Input); `SettingsRampHead` the VALUE A · CURVE · VALUE B row over them
 *   SettingsLights    a list of points — X · Y · radius · intensity float Inputs · delete — and Add light
 *   SettingsFieldMap  the field's gradient strip: FIELD MAP over a 26 strip (`background`) and two captions
 *   (SettingsDisclosure lives beside LabeledControlSection in organisms/SettingsPanel.jsx)
 *
 * Retired 2026-11-12 (deprecated aliases on the retirement ledger, each now rendering its base): SettingsCell →
 * LabeledControl · SettingsSlider → Slider float `readout="input"` · SettingsRange → Slider `dual` · SettingsSelect →
 * Dropdown float · SettingsSegmented → TabsRow float · SettingsToggle → LabeledControl `horizontal` + ToggleSwitch ·
 * SettingsText → Input float. Their originals: `_tmp/2026-11-12-one-header/SettingsControls.before.jsx`.
 *
 * `disabled` on a part dims it to 40% and takes it out of the tab order (a control whose engine param does not exist yet).
 */

const LABEL = 'text-[10px] leading-[12px] text-oq-64 font-(family-name:--kol-font-family-float)'
const INK = 'text-[11px] leading-[13px] text-fg-96 font-(family-name:--kol-font-family-float)'
/* a float Dropdown filling its cell */
const FILL = 'w-full [&_.kol-dd-trigger]:w-full [&_.kol-dd-trigger]:justify-between'
const num = (s, fallback) => { const n = parseFloat(String(s).replace(',', '.')); return Number.isFinite(n) ? n : fallback }

/* a disabled part: a fieldset disables every input and button inside it natively */
const Dim = ({ disabled, className = '', children, ...rest }) => (
  <fieldset disabled={disabled || undefined} aria-disabled={disabled || undefined} {...rest}
    className={`min-w-0 m-0 p-0 border-0 ${disabled ? 'opacity-40' : ''} ${className}`.trim()}>
    {children}
  </fieldset>
)

export const SettingsGrid = ({ className = '', children }) => <div className={`grid grid-cols-2 gap-x-3 gap-y-[7px] ${className}`.trim()}>{children}</div>

export function SettingsPoint({ value = [0.5, 0.5], onChange, min, max, disabled, 'aria-label': ariaLabel }) {
  const [x, y] = value
  const clamp = (n) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
  const field = (axis, v, set) => (
    <Input variant="float" size="sm" prefix={axis} value={String(v)} disabled={disabled} aria-label={`${ariaLabel ?? 'Point'} ${axis}`}
      onCommit={(s) => set(clamp(num(s, v)))} width="100%" />
  )
  return (
    <Dim disabled={disabled} className="grid grid-cols-2 gap-2">
      {field('X', x, (n) => onChange?.([n, y]))}
      {field('Y', y, (n) => onChange?.([x, n]))}
    </Dim>
  )
}

/* the head over a ramp table: an empty label column (the float label width), then the three columns */
export const SettingsRampHead = () => (
  <div className="grid grid-cols-[var(--kol-float-label-w)_minmax(0,87fr)_minmax(0,122fr)_minmax(0,87fr)] gap-x-2 pb-0.5" aria-hidden="true">
    <span />
    {['Value A', 'Curve', 'Value B'].map((t) => <span key={t} className={`${LABEL} uppercase text-center`}>{t}</span>)}
  </div>
)

export function SettingsRamp({ label, value = { a: 0, b: 1, curve: 'linear' }, onChange, curves = [], disabled, partial, ...rest }) {
  const set = (k) => (v) => onChange?.({ ...value, [k]: v })
  const box = (k) => (
    <Input variant="float" size="sm" value={String(value[k])} aria-label={`${label} value ${k.toUpperCase()}`} disabled={disabled || partial?.[k]}
      onCommit={(s) => set(k)(num(s, value[k]))} width="100%" className={partial?.[k] ? 'opacity-40' : ''} />
  )
  return (
    <Dim disabled={disabled} {...rest}>
      <LabeledControl variant="float" horizontal label={label}>
        <div className="grid grid-cols-[minmax(0,87fr)_minmax(0,122fr)_minmax(0,87fr)] gap-x-2 items-center">
          {box('a')}
          <div className={partial?.curve ? 'opacity-40' : ''}>
            <Dropdown variant="float" size="sm" value={value.curve} onChange={set('curve')} options={curves} ariaLabel={`${label} curve`} disabled={disabled || partial?.curve} className={FILL} />
          </div>
          {box('b')}
        </div>
      </LabeledControl>
    </Dim>
  )
}

export function SettingsLights({ value = [], onChange, disabled }) {
  const set = (i, k, n) => onChange?.(value.map((l, j) => (j === i ? { ...l, [k]: n } : l)))
  const cell = (i, k, v, label) => (
    <Input variant="float" size="sm" value={String(v)} aria-label={`Light ${i + 1} ${label}`} width="100%"
      onCommit={(s) => set(i, k, num(s, v))} />
  )
  return (
    <Dim disabled={disabled} className="flex flex-col gap-1">
      <div className="grid grid-cols-[repeat(4,minmax(0,1fr))_28px] gap-x-2 pb-0.5" aria-hidden="true">
        {['X', 'Y', 'Radius', 'Intensity'].map((t) => <span key={t} className={`${LABEL} uppercase`}>{t}</span>)}
        <span />
      </div>
      {value.map((l, i) => (
        <div key={i} className="grid grid-cols-[repeat(4,minmax(0,1fr))_28px] gap-x-2 items-center">
          {cell(i, 'x', l.x, 'X')}{cell(i, 'y', l.y, 'Y')}{cell(i, 'radius', l.radius, 'radius')}{cell(i, 'intensity', l.intensity, 'intensity')}
          <Button variant="float" tone="ghost" size="sm" iconOnly="trash" aria-label={`Delete light ${i + 1}`} onClick={() => onChange?.(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <Button variant="float" tone="ghost" size="sm" className="self-start" onClick={() => onChange?.([...value, { x: 0.5, y: 0.5, radius: 0.3, intensity: 1 }])}>+ Add light</Button>
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

/* ── retired 2026-11-12: each renders its base; on the retirement ledger until no repo imports it ─────────────────── */

/** @deprecated 2026-11-12 — `LabeledControl variant="float"` around the control (`col-span-2` for a wide cell) */
export function SettingsCell({ label, span = 1, disabled, className = '', children, ...rest }) {
  return (
    <Dim disabled={disabled} className={`${span === 2 ? 'col-span-2' : ''} ${className}`.trim()} {...rest}>
      <LabeledControl variant="float" label={label}>{children}</LabeledControl>
    </Dim>
  )
}

/** @deprecated 2026-11-12 — `Slider variant="float" readout="input"` (`format` → `formatValue`) */
export function SettingsSlider({ value, onChange, min = 0, max = 1, step = 0.01, format, disabled, 'aria-label': ariaLabel }) {
  return <Slider variant="float" readout="input" value={value} onChange={onChange} min={min} max={max} step={step} formatValue={format} disabled={disabled} aria-label={ariaLabel} />
}

/** @deprecated 2026-11-12 — `Slider variant="dual"` (`value` / `value2`, the formatted values as `label1` / `label2`) */
export function SettingsRange({ value = [0, 1], onChange, min = 0, max = 1, step = 0.01, format = (v) => String(v), disabled, 'aria-label': ariaLabel }) {
  const [a, b] = value
  return (
    <Slider variant="dual" value={a} value2={b} min={min} max={max} step={step} disabled={disabled} aria-label={ariaLabel} label1={format(a)} label2={format(b)}
      onChange={(v) => onChange?.([Math.min(v, b), b])} onChange2={(v) => onChange?.([a, Math.max(v, a)])} />
  )
}

/** @deprecated 2026-11-12 — `Dropdown variant="float"` */
export function SettingsSelect({ value, onChange, options = [], disabled, ariaLabel, className = '' }) {
  return <Dropdown variant="float" size="sm" value={value} onChange={onChange} options={options} ariaLabel={ariaLabel} disabled={disabled} className={`${FILL} ${className}`.trim()} />
}

/** @deprecated 2026-11-12 — `TabsRow variant="float"` */
export function SettingsSegmented({ value, onChange, options = [], ariaLabel }) {
  return <TabsRow variant="float" size="xs" tabs={options} value={value} onChange={onChange} ariaLabel={ariaLabel} className="w-full [&>*]:flex-1" />
}

/** @deprecated 2026-11-12 — `LabeledControl variant="float" horizontal` around a bare `ToggleSwitch variant="float"` */
export function SettingsToggle({ label, checked, onChange, disabled }) {
  return (
    <LabeledControl variant="float" horizontal label={label} labelWidth="fit-content" className={disabled ? 'opacity-40' : ''}>
      <ToggleSwitch variant="float" checked={!!checked} onChange={onChange} aria-label={label} disabled={disabled} />
    </LabeledControl>
  )
}

/** @deprecated 2026-11-12 — `Input variant="float"` */
export function SettingsText({ value, onChange, onCommit, type = 'text', placeholder, disabled, 'aria-label': ariaLabel, className = '' }) {
  return (
    <Input variant="float" size="sm" type={type} value={value ?? ''} placeholder={placeholder} aria-label={ariaLabel} disabled={disabled} width="100%" className={className}
      onChange={onChange ? (e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value) : undefined} onCommit={onCommit} />
  )
}
