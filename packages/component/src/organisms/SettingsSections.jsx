import { LabeledControlSection, SettingsRow } from './SettingsPanel.jsx'

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
 * `divided` puts the hairline above a section — pass it on EVERY section, the
 * first included: the rule is `.kol-section--divided + .kol-section--divided`,
 * so the first draws nothing and skipping it just costs the next its line.
 *
 * @param {Array<{label?: string, rows: Array<{label: ReactNode, render?: Function, value?: ReactNode, hint?: string, align?: string, labelWidth?: number|'auto', id?: string}>, rowGap?: number}>} sections - The settings body, in order (`hint` → SettingsRow's hint)
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
          {sec.rows.map((row, j) => (
            <SettingsRow
              key={row.id ?? row.label ?? j}
              label={row.label}
              hint={row.hint}
              align={row.align ?? align}
              labelWidth={row.labelWidth ?? labelWidth}
            >
              {row.render ? row.render() : row.value}
            </SettingsRow>
          ))}
        </LabeledControlSection>
      ))}
    </div>
  )
}
