import { useState } from 'react'
import { SettingsSections } from '@kolkrabbi/kol-component'
import { DEFAULT_TYPE_LAB, TYPE_CASES, TYPE_FACES, TYPE_INKS, TYPE_RATIOS, TYPE_STEPS, typeLab, typeLabCss } from './typeLab.js'
import LabWindow, { CopyAction, LabHistory, useLabValue } from './lab/LabWindow.jsx'

/* taxonomy-ok: organism — the type generator in the lab window: scale, steps and roles in the rail, the samples on the stage */

/**
 * TypeLab — A brand's type, generated. A base size and a musical ratio set every step; each step's line height is the
 * brand's to tune; sixteen roles sit on the steps, each with its face, weight, tracking, case and ink (`typeLab.js`).
 *
 * In the lab window (BrandLabToolWindow, 2026-10-29 — LabWindow): the rail's tabs are Scale (base, ratio, what the ratio
 * is for), Steps (each step's line-height factor) and Roles (one role at a time); the stage draws a step per line, or
 * the roles while Roles is open, every sample one line and truncated; the output under the window is the table of roles
 * and the CSS. The faces are the BRAND's, passed in — the lab never sets KOL's type.
 *
 * @param {Object}   value     `{ base, ratio, leading, roles }` — controlled; omit for internal
 * @param {Function} onChange  `(next) => void`
 * @param {Object}   faces     `{ display, heading, text, mono }` — `{ family, label, weight }` each
 * @param {string}   sample    the sample line
 * @param {string}   className classes on the root
 */
const FACES = {
  display: { family: 'var(--kol-font-family-sans-narrow)', label: 'Right Grotesk Narrow', weight: 500 },
  heading: { family: 'var(--kol-font-family-sans-compact)', label: 'Right Grotesk Compact', weight: 500 },
  text: { family: 'var(--kol-font-family-sans)', label: 'Right Grotesk', weight: 400 },
  mono: { family: 'var(--kol-font-family-mono)', label: 'JetBrains Mono', weight: 400 },
}
const SAMPLE = 'The quick brown fox jumps over the lazy dog'
const INK = { emphasis: 'var(--kol-fg-emphasis)', strong: 'var(--kol-fg-strong)', lede: 'var(--kol-fg-lede)', body: 'var(--kol-fg-body)', meta: 'var(--kol-fg-meta)' }
const CASE = { none: 'none', upper: 'uppercase', lower: 'lowercase', title: 'capitalize' }
const CASE_LABEL = { none: 'As typed', upper: 'Uppercase', lower: 'Lowercase', title: 'Title case' }
const cap = (s) => s[0].toUpperCase() + s.slice(1)

/* one sample line: its spec on the left, the text in its own settings, one line, truncated */
function SampleRow({ spec, style, text }) {
  return (
    <div className="grid grid-cols-[132px_minmax(0,1fr)] items-baseline gap-6 border-b border-oq-08 py-4">
      <span className="truncate kol-mono-12 text-meta">{spec}</span>
      <span className="block truncate" style={style}>{text}</span>
    </div>
  )
}

export default function TypeLab({ value: valueProp, onChange, faces = FACES, sample = SAMPLE, className = '' }) {
  const h = useLabValue(valueProp, onChange, DEFAULT_TYPE_LAB)
  const { value, set } = h
  const t = typeLab(value)
  const face = (k) => ({ ...FACES[k], ...faces[k] })
  /* which tab and which role are open is the window's, not the brand's — never in the value or its history */
  const [tab, setTab] = useState('scale')
  const [roleId, setRoleId] = useState('h1')
  const role = t.roles.find((r) => r.id === roleId) ?? t.roles[0]
  const setRole = (patch) => set({ roles: { ...value.roles, [role.id]: { ...value.roles?.[role.id], ...patch } } })
  const css = typeLabCss(value, { faces })

  /* THE SETTINGS RAIL'S ROWS (review 4): typed rows — a slider with its readout, a choice — in eyebrow sections */
  const tabs = [
    { id: 'scale', label: 'Scale', content: (
      <SettingsSections divided sections={[{ label: 'Scale', note: t.ratio.about, rows: [
        { id: 'base', label: 'Base', type: 'slider', min: 8, max: 32, step: 1, value: value.base, onChange: (v) => set({ base: v }) },
        { id: 'ratio', label: 'Ratio', type: 'choice', value: t.ratio.id, onChange: (v) => set({ ratio: v }), options: TYPE_RATIOS.map((x) => ({ value: x.id, label: `${x.label} ${x.note}` })) },
      ] }]} />
    ) },
    { id: 'steps', label: 'Steps', content: (
      <SettingsSections divided sections={[{ label: 'Line height', rows: t.steps.map((s) => (
        { id: s.id, label: s.role, type: 'slider', min: 0.8, max: 2.4, step: 0.05, value: s.k, formatValue: (v) => v.toFixed(2), displayWidth: 4, onChange: (k) => set({ leading: { ...value.leading, [s.id]: k } }) }
      )) }]} />
    ) },
    { id: 'roles', label: 'Roles', content: (
      <SettingsSections divided sections={[
        { label: 'Role', rows: [{ id: 'role', label: 'Role', type: 'choice', value: role.id, onChange: setRoleId, options: t.roles.map((r) => ({ value: r.id, label: r.label })) }] },
        { label: role.label, rows: [
          { id: 'step', label: 'Step', type: 'choice', value: role.step, onChange: (v) => setRole({ step: v }), options: TYPE_STEPS.map((x) => ({ value: x.id, label: x.role })) },
          { id: 'face', label: 'Face', type: 'choice', value: role.face, onChange: (v) => setRole({ face: v }), options: TYPE_FACES.map((f) => ({ value: f, label: face(f).label })) },
          { id: 'weight', label: 'Weight', type: 'slider', min: 100, max: 900, step: 100, value: role.weight, onChange: (w) => setRole({ weight: w }) },
          { id: 'tracking', label: 'Tracking %', type: 'slider', min: -10, max: 30, step: 0.5, value: Math.round(role.tracking * 1000) / 10, displayWidth: 4, onChange: (p) => setRole({ tracking: p / 100 }) },
          { id: 'case', label: 'Case', type: 'choice', value: role.case, onChange: (v) => setRole({ case: v }), options: TYPE_CASES.map((x) => ({ value: x, label: CASE_LABEL[x] })) },
          { id: 'ink', label: 'Ink', type: 'choice', value: role.ink, onChange: (v) => setRole({ ink: v }), options: TYPE_INKS.map((i) => ({ value: i, label: cap(i) })) },
        ] },
      ]} />
    ) },
  ]

  return (
    <LabWindow
      className={className}
      title="Type Lab"
      tabs={tabs}
      tab={tab}
      onTabChange={setTab}
      actions={<><LabHistory h={h} /><CopyAction text={css} /></>}
      output={{
        columns: [
          { header: 'Role', accessor: 'label', sortable: true },
          { header: 'Step', accessor: 'step', render: (r) => TYPE_STEPS.find((x) => x.id === r.step)?.role ?? r.step },
          { header: 'Face', accessor: 'faceLabel' },
          { header: 'Size', accessor: 'size', sortable: true, render: (r) => `${r.size}/${r.lh}` },
          { header: 'Weight', accessor: 'weight' },
          { header: 'Tracking', accessor: 'tracking', render: (r) => `${Math.round(r.tracking * 1000) / 10}%` },
          { header: 'Case', accessor: 'case', render: (r) => CASE_LABEL[r.case] },
          { header: 'Ink', accessor: 'ink', render: (r) => cap(r.ink) },
        ],
        rows: t.roles.map((r) => ({ ...r, faceLabel: face(r.face).label })),
        css,
        filename: 'brand-type.css',
      }}
    >
      {tab === 'roles'
        ? t.roles.map((r) => {
          const f = face(r.face)
          return (
            <SampleRow key={r.id} spec={`${r.label} ${r.size}/${r.lh}`} text={r.id === role.id ? `${r.label}, ${SAMPLE.toLowerCase()}` : sample}
              style={{ fontFamily: f.family, fontWeight: r.weight, fontSize: r.size, lineHeight: `${r.lh}px`, letterSpacing: `${r.tracking}em`, textTransform: CASE[r.case], color: INK[r.ink] }} />
          )
        })
        : t.steps.map((s) => {
          const f = face(s.face)
          return <SampleRow key={s.id} spec={`${s.id} ${s.size}/${s.lh}`} text={sample} style={{ fontFamily: f.family, fontWeight: f.weight, fontSize: s.size, lineHeight: `${s.lh}px`, color: 'var(--kol-fg-emphasis)' }} />
        })}
    </LabWindow>
  )
}
