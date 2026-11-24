import {
  Button as KButton, ButtonGroup as KButtonGroup, ToggleSwitch as KToggleSwitch, Dropdown as KDropdown,
  Slider as KSlider, Input as KInput, Textarea as KTextarea, ViewToggle as KViewToggle,
  TabsRow, LabeledControl as KLabeledControl, SettingsRow as KSettingsRow, LabeledControlSection as KLabeledControlSection, AccordionPanel as KAccordionPanel, Tooltip,
} from '@kolkrabbi/kol-component'
import { useChrome } from './chrome'

/* THE SHARED PARAM PARTS IN THE FLOAT LOOK (the user, 2026-11-12: *"why are we not using the FLOAT STYLE"*). Labs' params
 * (LabsParams, AutoControls, the effect / loop / kinetic panels, the footer) draw kol-component's app controls. Under
 * `ChromeContext 'float'` each of these takes its float variant instead; under EditorShell / LabsView (chrome null) they
 * pass straight through, so those chromes are untouched. The shared parts import these names from here, not from
 * kol-component. */

/* the deprecated Button variants that are tones (Button.jsx) — the float button takes the ground as `tone` */
const VARIANT_TONE = { primary: 'primary', secondary: 'inverted', outline: 'outline', ghost: 'ghost', grey: 'grey', control: 'ghost' }

export function Button({ variant, tone, size, ...p }) {
  if (useChrome() !== 'float' || variant === 'bare' || variant === 'float') return <KButton variant={variant} tone={tone} size={size} {...p} />
  const t = tone ?? VARIANT_TONE[variant] ?? (variant === 'danger' ? 'danger' : 'secondary')
  return <KButton variant="float" tone={t} size="sm" {...p} />
}

/* a choice inside a float panel is the float text tabs (TabsRow float, PropertyRail's own) — never the capsule track, whose
   surface and shadow are a float of their own; a row with no value is plain float buttons */
function FloatChoice({ options = [], value, onChange, ariaLabel, className = '' }) {
  if (value == null) return (
    <div className={`flex flex-wrap gap-1 ${className}`.trim()}>
      {options.map((o) => <KButton key={o.value} variant="float" tone="secondary" size="sm" iconLeft={o.icon} disabled={o.disabled} aria-label={o.ariaLabel} onClick={() => onChange?.(o.value)}>{o.label}</KButton>)}
    </div>
  )
  return <TabsRow variant="float" size="xs" tabs={options} value={value} onChange={onChange} ariaLabel={ariaLabel} className={className} />
}

/* BINARY IS A TOGGLE (plan-2026-11-12-float-system W2.3; the user: *"USE FUCKING TOGGLE WHEN option is BINARY"*): under the
 * float chrome a two-option choice whose states are off and on (Invert, Background, Orbit, a schema's Off / On segmented)
 * draws a ToggleSwitch float at the cell's end. A pair of named things (Clip / Visible, Rows / Columns) stays a choice.
 * The rule lives here, so the app chromes (LabsView, EditorShell) keep their Off / On strip. */
const isOnOff = (options = []) => options.length === 2 && options.every((o) => /^(off|on)$/i.test(String(o.value))) && options.some((o) => /^on$/i.test(String(o.value)))
function FloatOnOff({ options, value, onChange, ariaLabel, className = '' }) {
  const on = options.find((o) => /^on$/i.test(String(o.value))).value
  const off = options.find((o) => o.value !== on).value
  return (
    <span className={`flex w-full items-center justify-end ${className.replace(/\bw-full\b/g, '')}`.trim()}>
      <KToggleSwitch variant="float" checked={value === on} onChange={(v) => onChange?.(v ? on : off)} aria-label={ariaLabel} />
    </span>
  )
}

export function ButtonGroup({ variant, tone, size, ...p }) {
  if (useChrome() !== 'float' || p.layout !== 'joined') return <KButtonGroup variant={variant} tone={tone} size={size} {...p} />
  if (isOnOff(p.options)) return <FloatOnOff options={p.options} value={p.value} onChange={p.onChange} ariaLabel={p.ariaLabel} className={p.className} />
  return <FloatChoice options={p.options} value={p.value} onChange={p.onChange} ariaLabel={p.ariaLabel} className={p.className} />
}

export function ToggleSwitch({ variant, ...p }) {
  return <KToggleSwitch variant={useChrome() === 'float' ? 'float' : variant} {...p} />
}

export function Dropdown({ variant, size, ...p }) {
  if (useChrome() !== 'float') return <KDropdown variant={variant} size={size} {...p} />
  return <KDropdown variant="float" size="sm" {...p} />
}

export function Slider({ variant, ...p }) {
  /* dual · scrub · panel are their own shapes; the plain track takes the float one */
  const float = useChrome() === 'float' && (!variant || variant === 'minimal')
  return <KSlider variant={float ? 'float' : variant} {...p} />
}

export function Input({ variant, size, ...p }) {
  if (useChrome() !== 'float') return <KInput variant={variant} size={size} {...p} />
  /* the float field's own inset is wider than the app's; the caller sizes number boxes in `ch` */
  return <KInput variant="float" size="sm" {...p} className={`!px-2 ${p.className ?? ''}`.trim()} />
}

export function Textarea({ variant, size, ...p }) {
  if (useChrome() !== 'float') return <KTextarea variant={variant} size={size} {...p} />
  return <KTextarea variant="float" size="sm" {...p} />
}

/* ViewToggle's text strip is the float text tabs; its icon rounds already have a float variant */
export function ViewToggle({ variant, options = [], viewMode, onViewChange, size, className, ...p }) {
  if (useChrome() !== 'float') return <KViewToggle variant={variant} options={options} viewMode={viewMode} onViewChange={onViewChange} size={size} className={className} {...p} />
  if (variant === 'icon') return <KViewToggle variant="float" options={options} viewMode={viewMode} onViewChange={onViewChange} className={className} {...p} />
  if (isOnOff(options)) return <FloatOnOff options={options} value={viewMode} onChange={onViewChange} ariaLabel={p.ariaLabel} className={className} />
  return <FloatChoice options={options} value={viewMode} onChange={onViewChange} className={className} />
}

/* under the float chrome the label column is the spec's (`--kol-float-label-w`), whatever column the app chrome set */
export function LabeledControl({ variant, labelWidth, ...p }) {
  const float = useChrome() === 'float' && !variant
  return <KLabeledControl variant={float ? 'float' : variant} labelWidth={float && labelWidth !== 'auto' ? undefined : labelWidth} {...p} />
}

/* SettingsRow's anatomy (kol-component SettingsPanel) with the float label: the hint role, as written — no uppercase */
export function SettingsRow({ label, hint, align = 'end', labelWidth = 160, text = false, stack = false, children }) {
  if (useChrome() !== 'float') return <KSettingsRow label={label} hint={hint} align={align} labelWidth={labelWidth} text={text} stack={stack}>{children}</KSettingsRow>
  const cell = `flex min-h-6 items-center w-full ${align === 'fill' ? '' : 'justify-end'}`.trim()
  return (
    <KLabeledControl variant="float" horizontal={!stack} text={text} label={label} labelWidth={labelWidth === 'auto' ? 'auto' : undefined}>
      {hint ? <Tooltip label={hint} triggerClassName={cell}>{children}</Tooltip> : <span className={cell}>{children}</span>}
    </KLabeledControl>
  )
}

/* the section head in the float panel role (LayerInspector's float heads), the rest as kol-component draws it. Under the
 * float chrome it is kol-component's float LabeledControlSection (plan-2026-11-12-float-rails-figma W10.1, the one section:
 * PARAMETERS, LINES), the label 8 over the rows on the label's 18 line */
export function LabeledControlSection({ label, divided = false, rowGap = 2, children, className = '' }) {
  if (useChrome() !== 'float') return <KLabeledControlSection label={label} divided={divided} rowGap={rowGap} className={className}>{children}</KLabeledControlSection>
  return (
    /* no `divided` in the float: the section never pads or rules itself — the space between sections is the stack's gap
       (plan-2026-11-12-one-header W10.1, P15: *"super random padding that controls spacing?? why not controlled GAP??"*) */
    <KLabeledControlSection variant="float" gap={2} rowGap={rowGap === 1 ? 1 : 2} label={label && <span className="kol-float-label leading-[18px] text-fg-emphasis">{label}</span>}
      className={className}>
      {children}
    </KLabeledControlSection>
  )
}

/* the accordion's title in the float panel role */
export function AccordionPanel({ title, ...p }) {
  const float = useChrome() === 'float'
  return <KAccordionPanel title={float && typeof title === 'string' ? <span className="kol-float-label text-fg-emphasis">{title}</span> : title} {...p} />
}
