import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DocHeader } from '@kolkrabbi/kol-workshop'
import { Icon, KOL_ICON_SET_V1, KOL_ICON_SET_SIGNAL } from '@kolkrabbi/kol-icons'
import { SegGroup, KeylineBg } from '../lib/icon-controls.jsx'

/**
 * Icons — the gallery for BOTH shipped sets (v1 · signal, kol-icons ≥0.25.0),
 * switched with SET; THE icons page since the legacy gallery died 2026-07-28.
 * DOGFOODS the package: groups come from
 * the package's own inventories and each icon renders via the package
 * `<Icon>`, which resolves the set from `packages/icons/src/kol-icon-set-v1/`.
 * Proves the set ships + resolves from the package (not a showcase-local glob).
 */

const ORDER = ['chevron', 'arrow', 'arrow-diagonal', 'caret', 'add-remove', 'transfer', 'traffic', 'nav', 'singletons',
  'layout', 'files', 'device', 'components', 'code', 'tools', 'notify', 'eye-lock', 'atomic',
  'shape-primitives', 'shape-forms', 'misc']
const LABELS = { 'add-remove': 'Add / remove', 'eye-lock': 'Eye · lock', 'shape-primitives': 'Shape primitives', 'shape-forms': 'Shape forms' }
const label = (f) => LABELS[f] ?? f.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

const ordered = (index) => Object.keys(index).sort((a, b) => {
  const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b)
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b)
})
const total = (index) => Object.values(index).reduce((n, l) => n + l.length, 0)

/* TWO SETS (kol-icons ≥0.25.0): v1 is app chrome, signal is the instrument
 * vocabulary. One gallery with a switch rather than two pages — the sets share
 * every control, and seeing them apart is the point of the switch. */
const SETS = {
  v1:     { index: KOL_ICON_SET_V1,     label: 'V1', name: 'kol-icon-set-v1' },
  signal: { index: KOL_ICON_SET_SIGNAL, label: 'SIGNAL', name: 'kol-icon-set-signal' },
}

const SIZES = [16, 20, 24, 32, 48, 64, 128]

function Row({ name, size, bgLight, gridOverlay, copied, onCopy }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(name)}
      title={name}
      className="flex items-end w-full gap-4 py-2 border-b border-fg-04 hover:bg-fg-02 text-left p-0"
    >
      <span
        className="relative flex items-center justify-center shrink-0 rounded-sm"
        style={{
          width: size,
          height: size,
          background: bgLight ? '#FFFFFF' : '#0E0E11',
          color: bgLight ? '#0E0E11' : '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span className="relative" style={{ zIndex: 1, width: size, height: size }}>
          {gridOverlay && <KeylineBg bgLight={bgLight} />}
          <Icon name={name} size={size} />
        </span>
      </span>
      <span className="flex-1 flex items-baseline gap-4">
        <span className="kol-helper-10 text-subtle">{copied === name ? 'copied!' : name}</span>
      </span>
    </button>
  )
}

function GroupList({ folder, items, ...rowProps }) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3 mb-3 pb-2 border-b border-fg-08">
        <h2 className="kol-helper-14 text-fg-96">{label(folder)}</h2>
        <span className="kol-helper-10 text-fg-48" style={{ fontVariantNumeric: 'tabular-nums' }}>{items.length}</span>
        <span className="kol-helper-10 text-fg-48 ml-auto">{folder}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-10">
        {items.map((name) => (
          <Row key={name} name={name} {...rowProps} copied={rowProps.copied === name} onCopy={rowProps.onCopy} />
        ))}
      </div>
    </section>
  )
}

export default function Icons() {
  const [bgLight, setBgLight] = useState(true)
  const [size, setSize] = useState(24)
  const [gridOverlay, setGridOverlay] = useState(false)
  const [copied, setCopied] = useState(null)

  const copy = (name) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  const [setKey, setSetKey] = useState('v1')
  const set = SETS[setKey]
  const folders = useMemo(() => ordered(set.index), [set])
  const rowProps = useMemo(() => ({ size, bgLight, gridOverlay, copied, onCopy: copy }), [size, bgLight, gridOverlay, copied])

  return (
    <>
      <DocHeader
        eyebrow="KOL · Icons"
        title="Icons"
        lede={`${total(set.index)} icons across ${folders.length} groups (${set.name}), resolved straight from the package (@kolkrabbi/kol-icons). Single stroke cut, currentColor. Click any icon to copy its name.`}
      />

      <p className="kol-mono-12 text-meta mt-4">
        Compare with <Link className="kol-link underline" to="/icons/brand">brand's gallery</Link> — the app-tier catalog page, ported verbatim.
      </p>
      <div className="flex items-center flex-wrap gap-6 mt-8 mb-10">
        <SegGroup label="SET" options={Object.entries(SETS).map(([k, v]) => ({ value: k, label: v.label }))} value={setKey} onChange={setSetKey} />
        <SegGroup label="BG" options={[{ value: false, label: 'DARK' }, { value: true, label: 'LIGHT' }]} value={bgLight} onChange={setBgLight} />
        <SegGroup label="SIZE" options={SIZES.map((v) => ({ value: v, label: String(v) }))} value={size} onChange={setSize} />
        <SegGroup label="GRID" options={[{ value: false, label: 'OFF' }, { value: true, label: 'ON' }]} value={gridOverlay} onChange={setGridOverlay} />
      </div>

      {folders.map((folder) => (
        <GroupList key={`${setKey}-${folder}`} folder={folder} items={set.index[folder]} {...rowProps} />
      ))}
    </>
  )
}
