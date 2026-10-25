import { LabeledControlSection, SettingsChoice, SettingsRow, SettingsSwitch } from './SettingsPanel.jsx'
import Slider from '../molecules/Slider.jsx'

/* A STRING VALUE WEARS THE DS'S CLASS (user 2026-10-24, on Mirror's settings rail: *"YOU ARE USING A HELPER text for
 * paragraphs"* — *"THIS SHOULDNT BE POSSIBLE if you were using a preset"*). A consumer that hands rows as data never
 * picks a text class: a plain `value` is drawn in `kol-mono-12 text-body`, the file rail's and the shortcut rows' voice.
 * A node passed as `value` is the consumer's and stays as given. */
const isText = (v) => typeof v === 'string' || typeof v === 'number'
const textValue = (v) => <span className="kol-mono-12 text-body">{v}</span>
/* a section's `note` — a sentence or two under the eyebrow, before the rows (Mirror's Memory, Monitor's Patches): mono-12
 * in the meta ink, the panel's own intro voice. It wraps — the helper law is about helper text, and this is not helper */
const notes = (note) => (Array.isArray(note) ? note : [note]).map((n, i) => <p key={i} className="kol-mono-12 text-meta">{n}</p>)
/* the typed controls — the DS's, in the surface's tone; `render` stays the escape hatch for a control the DS has no word for */
const control = (row) => {
  if (row.type === 'choice') return <SettingsChoice options={row.options ?? []} value={row.value} onChange={row.onChange} ariaLabel={row.ariaLabel ?? (typeof row.label === 'string' ? row.label : undefined)} />
  if (row.type === 'switch') return <SettingsSwitch on={!!row.on} onChange={row.onChange} disabled={row.disabled} disabledHint={row.disabledHint} label={row.ariaLabel ?? (typeof row.label === 'string' ? row.label : undefined)} />
  /* a slider row (review 2, 2026-10-25 — the Stage's parameters in H): the DS Slider across the value column, the track
   * fluid, the readout the DS Input at a fixed `displayWidth` (3 chars) so every row's track and chip align (his review:
   * *"sliders should be using the space better and we have input component"*); `min` · `max` · `step` · `value` ·
   * `onChange` · `formatValue` · `defaultValue` are the Slider's. Its label column is 80 unless a width is given — the
   * track takes the rest (*"why cant the slider use the space available"*); the chip is `preset="rail"`, 8 at the sides */
  if (row.type === 'slider') return <Slider className="w-full" readout="input" displayWidth={row.displayWidth ?? 3} readoutPreset="rail" min={row.min} max={row.max} step={row.step} value={row.value} onChange={row.onChange} formatValue={row.formatValue} defaultValue={row.defaultValue} disabled={row.disabled} aria-label={row.ariaLabel ?? (typeof row.label === 'string' ? row.label : undefined)} />
  if (row.render) return row.render()
  return isText(row.value) ? textValue(row.value) : row.value
}
/* a typed row's cell: a choice fills the value column, a switch sits at its end, text sits on the baseline */
const rowAlign = (row, fallback) => row.align ?? (row.type === 'choice' || row.type === 'slider' ? 'fill' : fallback)

/**
 * SettingsSections — settings rows AS DATA, rendered once.
 *
 * The one component a consumer grabs for a settings body (user, 2026-09-03:
 * *"lets normalise a component they can grab"*). The estate had the PIECES —
 * `LabeledControlSection` for the eyebrow-headed section, `SettingsRow` for the
 * 160px label column — and every surface looped over them itself: kol-fxr's
 * `AppSettingsSections`, the settings page, the drawer, the shortcuts sheet.
 * Four hand-written loops over one anatomy is how the sheet ended up with a
 * plain `text-fg-32` heading and `fg-96` combos while the page two clicks away
 * had eyebrows and `fg-32`.
 *
 * THE SECTIONS ARE A VALUE, so one declaration feeds every frame that shows
 * them — the page, the drawer over what you are looking at, and a sheet:
 *
 *   const sections = [
 *     { label: 'Canvas', rows: [
 *       { label: 'Default aspect', render: () => <SettingsChoice … /> },
 *       { label: 'Autoplay',       render: () => <SettingsSwitch … /> },
 *     ] },
 *   ]
 *
 *   <SettingsPanel open={open} onClose={close}><SettingsSections sections={sections} /></SettingsPanel>
 *   <SettingsScaffold renderContent={() => <SettingsSections sections={visible} />} />
 *
 * A row is `{ label, render, align?, id? }` — `render` returns the control, so
 * the CONTROL stays the consumer's and this owns only the anatomy. A row may
 * also carry a plain `value` instead of `render` when the right cell is just
 * text (a keyboard combo, a version string), which is what lets the shortcuts
 * sheet and the settings page's shortcut block be the same call.
 *
 * TYPED ROWS (user 2026-10-24, on FXR's rail drawing its own sunken dropdown beside the reference's: *"we are literally
 * avoiding this custom per repo shit"*): a row names its CONTROL as data and this draws it — `{ type: 'choice', options,
 * value, onChange, ariaLabel? }` is a `SettingsChoice`, `{ type: 'switch', on, onChange, disabled?, disabledHint? }` a
 * `SettingsSwitch`, `{ type: 'slider', min, max, step, value, onChange }` the DS `Slider` (review 2, 2026-10-25) — in
 * the surface's tone, never the consumer's. The Hub's rail takes typed rows and refuses `render`.
 *
 * `divided` puts the hairline above a section — pass it on EVERY section, the
 * first included: the rule is `.kol-section--divided + .kol-section--divided`,
 * so the first draws nothing and skipping it just costs the next its line.
 *
 * @param {Array<{label?: string, note?: string|string[], rows?: Array<{label: ReactNode, type?: 'choice'|'switch'|'slider', options?: Array, value?: ReactNode, on?: boolean, onChange?: Function, min?: number, max?: number, step?: number, formatValue?: Function, defaultValue?: number, displayWidth?: number, render?: Function, hint?: string, align?: string, labelWidth?: number|'auto', text?: boolean, id?: string}>, rowGap?: number}>} sections - The settings body, in order (`hint` → SettingsRow's hint; `note` a sentence or two under the eyebrow; a string `value` is drawn in the DS's mono-12 and sits on the baseline; `type: 'choice'` / `'switch'` / `'slider'` rows are drawn here — a slider is the DS Slider across the value column, fluid track + the Input readout at `displayWidth` chars (3, `preset="rail"`), its label column 80 unless set; `min` · `max` · `step` · `value` · `onChange`)
 * @param {boolean} [divided=false] - Hairline above each section
 * @param {number|'auto'} [labelWidth] - Default label column for every row — `'auto'` makes the label yield and the control hug, which is what a narrow column or a nowrap value needs
 * @param {string} [align] - Default row alignment passed to `SettingsRow`
 * @param {string} [className] - Extra classes on the wrapper
 */
export default function SettingsSections({ sections = [], divided = false, labelWidth, align, className = '' }) {
  return (
    <div className={`kol-settings-sections flex flex-col gap-6 ${className}`.trim()}>
      {sections.map((sec, i) => (
        <LabeledControlSection key={sec.label ?? i} label={sec.label} divided={divided} rowGap={sec.rowGap}>
          {sec.note != null && notes(sec.note)}
          {(sec.rows ?? []).map((row, j) => (
            <SettingsRow
              key={row.id ?? row.label ?? j}
              label={row.label}
              hint={row.hint}
              align={rowAlign(row, align)}
              labelWidth={row.labelWidth ?? labelWidth ?? (row.type === 'slider' ? 80 : undefined)}
              text={row.text ?? (!row.render && !row.type && isText(row.value))}
            >
              {control(row)}
            </SettingsRow>
          ))}
        </LabeledControlSection>
      ))}
    </div>
  )
}
