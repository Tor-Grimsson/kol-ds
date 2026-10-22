import { useState } from 'react'
import { Dropdown, Input } from '@kolkrabbi/kol-component'
import { DEFAULT_TYPE_SCALE, TYPE_RATIOS, typeScale } from './typeScale.js'

/* taxonomy-ok: organism — the type-scale generator: base + ratio controls over a spec row and a live sample per step */

/**
 * TypeScaleLab — a modular type scale to try ratios on.
 *
 * Carried from kol-atlas's Typography page (2026-10-20). A base size and a musical ratio set every
 * step (`typeScale.js`); each row is a spec label (role · token · face · weight · size · line height)
 * over a live sample. The faces are the BRAND's, passed in — the lab never sets KOL's type.
 *
 * @param {Object}   value     `{ base, ratio }` — controlled; omit for internal
 * @param {Function} onChange  `(next) => void`
 * @param {Object}   faces     `{ display, heading, text }` — `{ family, label, weight }` each
 * @param {Object}   samples   `{ headline, text }` — the sample strings
 * @param {string}   className classes on the root
 */
const LABEL = 'kol-helper-10 tracking-widest text-meta uppercase'
const FACES = {
  display: { family: 'var(--kol-font-family-sans-narrow)', label: 'Right Grotesk Narrow', weight: 500 },
  heading: { family: 'var(--kol-font-family-sans-compact)', label: 'Right Grotesk Compact', weight: 500 },
  text: { family: 'var(--kol-font-family-sans)', label: 'Right Grotesk', weight: 400 },
}
const SAMPLES = {
  headline: 'The quick brown fox jumps over the lazy dog',
  text: 'A modular scale sets every size from one base and one ratio, so the steps keep the same proportion from the smallest note to the largest headline.',
}

export default function TypeScaleLab({ value: valueProp, onChange, faces = FACES, samples = SAMPLES, className = '' }) {
  const [own, setOwn] = useState(DEFAULT_TYPE_SCALE)
  const value = valueProp ?? own
  const set = (patch) => { const next = { ...value, ...patch }; if (valueProp === undefined) setOwn(next); onChange?.(next) }
  const r = TYPE_RATIOS.find((x) => x.id === value.ratio) ?? TYPE_RATIOS[3]
  const face = (k) => ({ ...FACES[k], ...faces[k] })

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      <div className="flex max-w-[724px] flex-col gap-2">
        <h3 className="m-0 kol-sans-heading-04 text-emphasis">{r.label} {r.note}</h3>
        <p className="m-0 kol-sans-body-02 text-fg-80">{r.about}</p>
      </div>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <div className="flex flex-col gap-2"><span className={LABEL}>Base</span><Input type="number" size="sm" unit="px" chars={4} value={value.base} onChange={(e) => { const v = Number(e.target.value); if (v >= 8 && v <= 32) set({ base: v }) }} /></div>
        <div className="flex flex-col gap-2"><span className={LABEL}>Ratio</span><Dropdown size="sm" value={r.id} onChange={(v) => set({ ratio: v })} options={TYPE_RATIOS.map((x) => ({ value: x.id, label: `${x.label} · ${x.note}` }))} /></div>
      </div>
      {/* the spec rows keep their columns on a phone and scroll sideways */}
      <div className="overflow-x-auto overscroll-x-contain"><div className="min-w-[720px]">
        {typeScale(value).map((s) => {
          const f = face(s.face)
          return (
            <div key={s.id} className="border-t border-fg-08 py-5">
              <div className="mb-3 grid grid-cols-[120px_minmax(0,1.6fr)_minmax(0,2fr)_repeat(3,minmax(0,1fr))] items-center gap-x-6">
                <span className={LABEL}>{s.role}</span>
                <code className="kol-doc-code-inline justify-self-start whitespace-nowrap">--type-{s.id}</code>
                <span className={LABEL}>{f.label}</span>
                <span className={LABEL}>W: {f.weight}</span>
                <span className={LABEL}>S: <span className="normal-case">{s.size}px</span></span>
                <span className={LABEL}>LH: <span className="normal-case">{s.lh}px</span></span>
              </div>
              <p className="m-0 truncate text-emphasis" style={{ fontFamily: f.family, fontWeight: f.weight, fontSize: s.size, lineHeight: `${s.lh}px` }}>
                {s.face === 'text' ? samples.text : samples.headline}
              </p>
            </div>
          )
        })}
      </div></div>
    </div>
  )
}
