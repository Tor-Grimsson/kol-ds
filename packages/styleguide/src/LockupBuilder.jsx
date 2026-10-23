import { useState } from 'react'
import { Input, Label, SegmentedToggle } from '@kolkrabbi/kol-component'
import Lockup from './Lockup.jsx'

/* taxonomy-ok: organism — the live lockup builder: name / descriptor / variant / scale controls beside a Lockup stage, preset rows below */

/**
 * LockupBuilder — Build a product lockup from a name. Type a product name, add descriptors, pick a variant and scale; the presets run a
 * brand's naming levels through the same Lockup.
 *
 * Carried from kol-atlas `components/lockup/LiveLockup.jsx` (2026-10-20); the parent, the mark, the
 * face and the presets are the brand's, passed in.
 *
 * @param {string}    parent    the parent brand name
 * @param {ReactNode} mark      the mark (see Lockup)
 * @param {string}    font      CSS font-family for the names
 * @param {Object}    presets   `{ [level]: string[] }` — e.g. `{ Products: ['Hosting', …] }`
 * @param {string}    className classes on the root
 */
const VARIANTS = [{ value: 'horizontal', label: 'Horizontal' }, { value: 'hero', label: 'Hero' }, { value: 'wordmark', label: 'Wordmark' }]
const SCALES = ['sm', 'md', 'lg', 'xl'].map((s) => ({ value: s, label: s.toUpperCase() }))

const Field = ({ label, children }) => <div className="flex flex-col gap-2"><Label>{label}</Label>{children}</div>

export default function LockupBuilder({ parent = 'Brand', mark, font, presets = {}, className = '' }) {
  const first = Object.values(presets)[0]?.[0] ?? ''
  const [s, setS] = useState({ product: first, descriptor: '', descriptor2: '', variant: 'horizontal', scale: 'lg' })
  const set = (patch) => setS((p) => ({ ...p, ...patch }))
  const brand = { parent, mark, font }

  return (
    <div className={`flex flex-col gap-6 ${className}`.trim()}>
      <div className="grid gap-6 md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="flex flex-col gap-5 self-start rounded-lg border border-fg-08 p-5">
          <Field label="Product name"><Input value={s.product} onChange={(e) => set({ product: e.target.value })} placeholder="e.g. Hosting" /></Field>
          <Field label="Descriptor"><Input value={s.descriptor} onChange={(e) => set({ descriptor: e.target.value })} placeholder="e.g. IS, EU" /></Field>
          {s.variant === 'hero' && <Field label="Descriptor 2"><Input value={s.descriptor2} onChange={(e) => set({ descriptor2: e.target.value })} placeholder="e.g. Solution" /></Field>}
          <Field label="Variant"><SegmentedToggle size="sm" value={s.variant} onChange={(v) => set({ variant: v })} options={VARIANTS} /></Field>
          <Field label="Scale"><SegmentedToggle size="sm" value={s.scale} onChange={(v) => set({ scale: v })} options={SCALES} /></Field>
        </div>
        <div className="flex min-h-[320px] items-center justify-center overflow-auto rounded-lg border border-fg-08 text-emphasis">
          <Lockup {...brand} {...s} />
        </div>
      </div>
      {Object.entries(presets).map(([group, names]) => (
        <div key={group}>
          <Label>{group}</Label>
          <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
            {names.map((n) => (
              <button key={n} type="button" onClick={() => set({ product: n, descriptor: '', variant: 'horizontal' })}
                className="flex min-h-[96px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-fg-08 text-left text-emphasis hover:bg-fg-04">
                <Lockup {...brand} product={n} scale="sm" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
