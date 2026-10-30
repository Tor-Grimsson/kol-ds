import { useState } from 'react'
import { SettingsSections } from '@kolkrabbi/kol-component'
import { LAYOUT_COMPONENTS, COMBO_LAYOUTS } from './comboLayouts.jsx'
import { COMBO_ROLES, DEFAULT_COMBO_LAB, comboLab, comboLabCss } from './comboLab.js'
import { colorLab } from './colorLab.js'
import LabWindow, { CopyAction, LabHistory, useLabValue } from './lab/LabWindow.jsx'

/* taxonomy-ok: organism — the combination lab in the lab window: layout, mark and parts in the rail, the layout on the stage */

/**
 * ComboLab — Color Lab's palette, combined. It generates no colours of its own (BrandLabToolWindow, kol-atlas 2026-10-29 —
 * the user: *"why would combo lab output palette and not the color lab?"*): it takes Color Lab's value, gives each of the
 * 60/30/10 composition's parts a palette colour — from their jobs by default, reassignable — draws them in a layout, and
 * checks each part on the light and the dark ground. Unbranded: the mark slot is an empty shape unless a `logo` is passed.
 *
 *   rail     Layout (the layout, the mark slot) · Parts (which colour plays each part)
 *   output   the parts as a table with their contrast, and the CSS
 *
 * @param {Object}    color     Color Lab's value (or its `colorLab` result) — the palette it combines
 * @param {Object}    value     `{ layout, logo, assign }` — controlled; omit for internal
 * @param {Function}  onChange  `(next) => void`
 * @param {ReactNode} logo      the brand's mark for the mark slot; absent, a plain shape
 * @param {string}    className classes on the root
 */
/* the empty mark: a rounded square in the part's ink — the slot is shown without dressing it as anyone's brand */
const PLAIN_MARK = <span className="block aspect-square w-full rounded-[22%] bg-current" />
const PART_LABEL = { primary: 'Primary', secondary: 'Secondary', light: 'Light', dark: 'Dark', accent: 'Accent' }
const ratioText = (r) => (Math.floor(r * 10) / 10).toFixed(1)

/** @deprecated 2026-10-29 — DEFAULT_COMBO_LAB (the combo lab no longer holds a palette; Color Lab's is combined) */
export const DEFAULT_PALETTE = { id: 'kolkrabbi', label: 'Kolkrabbi', primary: '#FFCF33', secondary: '#AD5038', light: '#FAF7F0', dark: '#222D3D', accent: '#DF760B' }

export default function ComboLab({ color, value: valueProp, onChange, logo, className = '' }) {
  const h = useLabValue(valueProp, onChange, DEFAULT_COMBO_LAB)
  const { value, set } = h
  const c = color?.swatches ? color : colorLab(color)
  const combo = comboLab(value, c)
  const [tab, setTab] = useState('layout')
  const Layout = LAYOUT_COMPONENTS[combo.layout] ?? LAYOUT_COMPONENTS[COMBO_LAYOUTS[0].id]
  const css = comboLabCss(value, c)
  const colourOptions = c.swatches.map((s) => ({ value: String(s.index), label: s.roleLabel }))

  /* THE SETTINGS RAIL'S ROWS (review 4) */
  const tabs = [
    { id: 'layout', label: 'Layout', content: (
      <SettingsSections divided sections={[{ rows: [
        { id: 'layout', label: 'Preset', type: 'choice', value: combo.layout, onChange: (v) => set({ layout: v }), options: COMBO_LAYOUTS.map((l) => ({ value: l.id, label: l.label })) },
        { id: 'mark', label: logo ? 'Brand mark' : 'Mark slot', type: 'switch', on: !!combo.logo, onChange: (on) => set({ logo: on }) },
      ] }]} />
    ) },
    { id: 'parts', label: 'Parts', content: (
      <SettingsSections divided sections={[{ label: 'Parts', rows: COMBO_ROLES.map((p) => (
        { id: p, label: PART_LABEL[p], type: 'choice', value: String(combo.parts.find((x) => x.id === p).index), onChange: (v) => set({ assign: { ...value.assign, [p]: Number(v) } }), options: colourOptions }
      )) }]} />
    ) },
  ]

  return (
    <LabWindow
      className={className}
      title="Combo Lab"
      tabs={tabs}
      tab={tab}
      onTabChange={setTab}
      actions={<><LabHistory h={h} /><CopyAction text={css} /></>}
      output={{
        columns: [
          { header: 'Part', accessor: 'name', render: (r) => <span className="flex items-center gap-3"><span className="size-4 shrink-0 rounded-[3px] border border-oq-12" style={{ background: r.hex }} />{r.name}</span> },
          { header: 'Colour', accessor: 'colour' },
          { header: 'Hex', accessor: 'hex' },
          { header: 'On light', accessor: 'onLight', render: (r) => `${r.onLight} ${r.gradeLight}` },
          { header: 'On dark', accessor: 'onDark', render: (r) => `${r.onDark} ${r.gradeDark}` },
        ],
        rows: combo.parts.map((p) => ({ id: p.id, name: PART_LABEL[p.id], colour: `${p.index + 1} ${c.swatches[p.index]?.roleLabel ?? ''}`, hex: p.hex, onLight: ratioText(p.onLight), gradeLight: p.gradeLight, onDark: ratioText(p.onDark), gradeDark: p.gradeDark })),
        css,
        filename: 'brand-combo.css',
      }}
    >
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-[1200px]">
          <Layout palette={combo.palette} logo={combo.logo ? (logo ?? PLAIN_MARK) : null} />
        </div>
      </div>
    </LabWindow>
  )
}
