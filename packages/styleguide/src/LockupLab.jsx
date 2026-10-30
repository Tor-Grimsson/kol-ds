import { useLayoutEffect, useRef, useState } from 'react'
import { Input, SettingsSections } from '@kolkrabbi/kol-component'
import { DEFAULT_LOCKUP_LAB, LOCKUP_CASES, LOCKUP_GRID, LOCKUP_PARTS, LOCKUP_SHAPES, LOCKUP_SUB_PRESETS, LOCKUP_TYPES, lockupLab } from './lockupLab.js'
import LabWindow, { LabHistory, useLabValue } from './lab/LabWindow.jsx'

/* taxonomy-ok: organism — the lockup generator in the lab window: type, shape and text in the rail, the lockup on the stage */

/**
 * LockupLab — A branded house's lockup, generated from its parts. Was LockupBuilder (sm → xl and horizontal · hero ·
 * wordmark, which the user ruled out: *"its about the lockup of shapes not size"*); rebuilt from the branded-house sheets
 * (BrandLabToolWindow, kol-atlas 2026-10-29 — `lockupLab.js`): the parts (logo, company wordmark, product wordmark,
 * sub-category, optional), the five lockup types, the ratios of the company and sub-category to the product, clip to
 * baseline, the sheet's part grid, the logo shape.
 *
 *   rail     Lockup (type, logo shape, grid, clip) · Text (each part, the presets) · Ratio (sizes and weights)
 *   stage    the lockup, drawn by BrandLockup
 *   output   the parts as a table, and every lockup type by the same BrandLockup
 *
 * @param {Object}    value     `{ type, shape, parent, product, sub, optional, parentRatio, subRatio, … }` — controlled; omit for internal
 * @param {Function}  onChange  `(next) => void`
 * @param {ReactNode} mark      the brand's mark, for the `mark` shape
 * @param {string}    font      CSS font-family for the wordmarks
 * @param {Object}    presets   `{ [category]: string[] }` — product names by naming level, picked into the product
 * @param {string}    className classes on the root
 */
const CASE = { none: 'none', upper: 'uppercase' }
const dd = (list) => list.map((x) => ({ value: x.id, label: x.label }))

function Shape({ shape, mark }) {
  if (shape === 'mark' && mark) return <span className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full">{mark}</span>
  const s = {
    square: <rect width="24" height="24" />,
    rounded: <rect width="24" height="24" rx="5.5" />,
    circle: <circle cx="12" cy="12" r="12" />,
    diamond: <rect x="3.5" y="3.5" width="17" height="17" transform="rotate(45 12 12)" />,
  }[shape] ?? <rect width="24" height="24" rx="5.5" />
  return <svg viewBox="0 0 24 24" className="block h-full w-full" fill="currentColor" aria-hidden="true">{s}</svg>
}

/**
 * BrandLockup — One branded-house lockup, drawn from a LockupLab value. The tool's stage and its output both draw with it.
 * The logo takes the height of the text beside it (the company line and the product line when both show), so the shapes
 * lock up whatever the ratios.
 *
 * @param {Object}    value   a LockupLab value
 * @param {string}    type    a lockup type id (default the value's)
 * @param {number}    size    the product wordmark's size, px — the output's, never the lockup's
 * @param {ReactNode} mark    the brand's mark · @param {string} font the wordmarks' family
 */
export function BrandLockup({ value, type, size = 64, mark, font = 'var(--kol-font-family-sans)' }) {
  const l = lockupLab({ ...value, ...(type ? { type } : {}) }, size)
  const part = (id) => l.parts.find((p) => p.id === id)
  const grid = (id) => (l.grid ? { background: `${LOCKUP_GRID[id]}B3` } : undefined)
  /* CLIP TO BASELINE: each line trimmed to its cap height and baseline (`text-box`), so the lines and the logo meet at the
   * letters, not at the line box */
  const text = (p) => ({ fontFamily: font, fontSize: p.size, fontWeight: p.weight, textTransform: CASE[p.case], lineHeight: l.clip ? 1 : 1.2, ...(l.clip ? { textBox: 'trim-both cap alphabetic' } : null), whiteSpace: 'nowrap' })
  const m = part('mark'), parent = part('parent'), product = part('product')
  const tail = ['sub', 'optional'].map(part).filter(Boolean)
  /* the logo is as tall as the text beside it — measured, since a square sized by its sibling's height has no CSS answer */
  const textRef = useRef(null)
  const [markPx, setMarkPx] = useState(m?.size ?? 0)
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el || !m) return undefined
    const read = () => setMarkPx(Math.round(el.getBoundingClientRect().height))
    read()
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [m?.size, l.clip, l.type.id])
  return (
    <div className="inline-flex items-end" style={{ gap: size * 0.22 }}>
      {m && <span className="block shrink-0" style={{ width: markPx, height: markPx, ...grid('mark') }}><Shape shape={l.shape} mark={mark} /></span>}
      <span ref={textRef} className="flex flex-col justify-end" style={{ gap: size * 0.1 }}>
        {parent && <span className="self-start" style={{ ...text(parent), ...grid('parent') }}>{parent.text}</span>}
        <span className="flex items-baseline" style={{ gap: size * 0.18 }}>
          {product && <span style={{ ...text(product), ...grid('product') }}>{product.text}</span>}
          {tail.map((p) => <span key={p.id} style={{ ...text(p), ...grid(p.id) }}>{p.text}</span>)}
        </span>
      </span>
    </div>
  )
}

export default function LockupLab({ value: valueProp, onChange, mark, font, presets = {}, className = '' }) {
  const h = useLabValue(valueProp, onChange, DEFAULT_LOCKUP_LAB)
  const { value, set } = h
  const l = lockupLab(value)
  const [tab, setTab] = useState('lockup')
  const categories = Object.keys(presets)
  const [category, setCategory] = useState(categories[0])
  /* THE SETTINGS RAIL'S ROWS (review 4): typed rows where the DS has a word (choice, switch, slider); a text field is the
   * one `render` row */
  const field = (key, placeholder) => () => <Input size="sm" value={value[key] ?? ''} placeholder={placeholder} onChange={(e) => set({ [key]: e.target.value })} className="w-full" />
  const tabs = [
    { id: 'lockup', label: 'Lockup', content: (
      <SettingsSections divided sections={[{ label: 'Lockup', rows: [
        { id: 'type', label: 'Lockup type', type: 'choice', value: l.type.id, onChange: (v) => set({ type: v }), options: dd(LOCKUP_TYPES) },
        { id: 'shape', label: 'Logo shape', type: 'choice', value: l.shape, onChange: (v) => set({ shape: v }), options: dd(mark ? LOCKUP_SHAPES : LOCKUP_SHAPES.filter((x) => x.id !== 'mark')) },
        { id: 'grid', label: 'Grid', type: 'switch', on: l.grid, onChange: (on) => set({ grid: on }) },
        { id: 'clip', label: 'Clip to baseline', type: 'switch', on: l.clip, onChange: (on) => set({ clip: on }) },
      ] }]} />
    ) },
    { id: 'text', label: 'Text', content: (
      <SettingsSections divided sections={[
        { label: 'Text', rows: [
          { id: 'parent', label: 'Company', align: 'fill', render: field('parent') },
          { id: 'product', label: 'Product', align: 'fill', render: field('product') },
          { id: 'sub', label: 'Sub-category', align: 'fill', render: field('sub') },
          { id: 'optional', label: 'Optional', align: 'fill', render: field('optional', 'Ltd.') },
        ] },
        { label: 'Presets', rows: [
          ...(categories.length ? [
            { id: 'level', label: 'Naming level', type: 'choice', value: category, onChange: setCategory, options: categories.map((x) => ({ value: x, label: x })) },
            { id: 'preset', label: 'Product', type: 'choice', value: presets[category]?.includes(value.product) ? value.product : '', onChange: (v) => v && set({ product: v }), options: [{ value: '', label: 'Typed' }, ...(presets[category] ?? []).map((x) => ({ value: x, label: x }))] },
          ] : []),
          { id: 'subPreset', label: 'Sub-category', type: 'choice', value: LOCKUP_SUB_PRESETS.includes(value.sub) ? value.sub : '', onChange: (v) => v && set({ sub: v }), options: [{ value: '', label: 'Typed' }, ...LOCKUP_SUB_PRESETS.map((x) => ({ value: x, label: x }))] },
        ] },
      ]} />
    ) },
    { id: 'ratio', label: 'Ratio', content: (
      <SettingsSections divided sections={[
        /* EVERY TEXT PART GETS THE SAME THREE (the user, 2026-10-30: *"why do you get UPPERCASE toggle for one thing and not another"*):
         * size to the product (the product is the base), weight, case — company, product, sub-category, optional alike */
        { label: 'Size to product', rows: [
          { id: 'pr', label: 'Company %', type: 'slider', labelWidth: 112, min: 10, max: 100, step: 2, value: Math.round(l.parentRatio * 100), onChange: (v) => set({ parentRatio: v / 100 }) },
          { id: 'sr', label: 'Sub-category %', type: 'slider', labelWidth: 112, min: 10, max: 100, step: 2, value: Math.round(l.subRatio * 100), onChange: (v) => set({ subRatio: v / 100 }) },
          { id: 'or', label: 'Optional %', type: 'slider', labelWidth: 112, min: 10, max: 100, step: 2, value: Math.round(l.optionalRatio * 100), onChange: (v) => set({ optionalRatio: v / 100 }) },
        ] },
        { label: 'Weight', rows: [
          { id: 'pw', label: 'Company', type: 'slider', labelWidth: 112, min: 100, max: 900, step: 100, value: l.parentWeight, onChange: (v) => set({ parentWeight: v }) },
          { id: 'w', label: 'Product', type: 'slider', labelWidth: 112, min: 100, max: 900, step: 100, value: l.productWeight, onChange: (v) => set({ productWeight: v }) },
          { id: 'sw', label: 'Sub-category', type: 'slider', labelWidth: 112, min: 100, max: 900, step: 100, value: l.subWeight, onChange: (v) => set({ subWeight: v }) },
          { id: 'ow', label: 'Optional', type: 'slider', labelWidth: 112, min: 100, max: 900, step: 100, value: l.optionalWeight, onChange: (v) => set({ optionalWeight: v }) },
        ] },
        { label: 'Case', rows: [
          { id: 'pc', label: 'Company', type: 'choice', value: l.parentCase, onChange: (v) => set({ parentCase: v }), options: dd(LOCKUP_CASES) },
          { id: 'c', label: 'Product', type: 'choice', value: l.productCase, onChange: (v) => set({ productCase: v }), options: dd(LOCKUP_CASES) },
          { id: 'sc', label: 'Sub-category', type: 'choice', value: l.subCase, onChange: (v) => set({ subCase: v }), options: dd(LOCKUP_CASES) },
          { id: 'oc', label: 'Optional', type: 'choice', value: l.optionalCase, onChange: (v) => set({ optionalCase: v }), options: dd(LOCKUP_CASES) },
        ] },
      ]} />
    ) },
  ]

  const at = lockupLab(value, 100)
  return (
    <LabWindow
      className={className}
      title="Lockup Lab"
      tabs={tabs}
      tab={tab}
      onTabChange={setTab}
      actions={<LabHistory h={h} />}
      output={{
        columns: [
          { header: 'Part', accessor: 'part' },
          { header: 'Text', accessor: 'text' },
          { header: 'Size', accessor: 'size', render: (r) => (r.size ? `${r.size}%` : '') },
          { header: 'Weight', accessor: 'weight' },
          { header: 'Case', accessor: 'kase' },
        ],
        rows: at.parts.map((p) => ({ id: p.id, part: LOCKUP_PARTS.find((x) => x.id === p.id).label, text: p.id === 'mark' ? LOCKUP_SHAPES.find((s) => s.id === l.shape)?.label : p.text, size: p.size, weight: p.weight ?? '', kase: p.case ? LOCKUP_CASES.find((c) => c.id === p.case)?.label : '' })),
        extra: (
          /* every lockup type, by the stage's own renderer */
          <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
            {LOCKUP_TYPES.map((t) => (
              <div key={t.id} className="flex flex-col gap-3">
                <span className="kol-mono-12 text-meta">{t.label}</span>
                <span className="text-emphasis"><BrandLockup value={value} type={t.id} size={40} mark={mark} font={font} /></span>
              </div>
            ))}
          </div>
        ),
      }}
    >
      {/* THE LOCKUP FILLS THE STAGE (the user, 2026-10-30: *"WHY IS THE LOGO TINY"*): drawn at 64 and scaled to 80 % of the stage's width or 60 % of its height, whichever binds */}
      <FitStage>
        <BrandLockup value={value} size={64} mark={mark} font={font} />
      </FitStage>
    </LabWindow>
  )
}

/* FitStage — scales its one child to the stage: 80 % of the width, 60 % of the height, whichever binds; remeasured on resize */
function FitStage({ children }) {
  const outer = useRef(null), inner = useRef(null)
  const [k, setK] = useState(1)
  useLayoutEffect(() => {
    const fit = () => {
      const o = outer.current, i = inner.current
      if (!o || !i) return
      const w = i.offsetWidth, h = i.offsetHeight
      if (!w || !h) return
      setK(Math.max(0.25, Math.min((o.clientWidth * 0.8) / w, (o.clientHeight * 0.6) / h)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(outer.current)
    ro.observe(inner.current)
    return () => ro.disconnect()
  }, [children])
  return (
    <div ref={outer} className="flex h-full min-h-[200px] items-center justify-center overflow-hidden text-emphasis">
      <div ref={inner} className="inline-flex" style={{ transform: `scale(${k})`, transformOrigin: 'center' }}>{children}</div>
    </div>
  )
}
