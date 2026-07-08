import { useMemo, useState } from 'react'
import DocHeader from '../lib/DocHeader.jsx'
import { Icon, KOL_ICON_SET_V1 } from '@kolkrabbi/kol-icons'
import { SegGroup, KeylineBg } from '../lib/icon-controls.jsx'
import DocLayout from '../lib/DocLayout.jsx'

/**
 * IconsV1 — the kol-icon-set-v1 gallery, DOGFOODING the package: groups come from
 * the package's `KOL_ICON_SET_V1` inventory and each icon renders via the package
 * `<Icon>`, which resolves the set from `packages/icons/src/kol-icon-set-v1/`.
 * Proves the set ships + resolves from the package (not a showcase-local glob).
 */

const ORDER = ['chevron', 'arrow', 'caret', 'add-remove', 'transfer', 'traffic', 'nav', 'singletons',
  'layout', 'files', 'device', 'components', 'code', 'tools', 'notify', 'eye-lock', 'atomic',
  'shape-primitives', 'shape-forms', 'misc']
const LABELS = { 'add-remove': 'Add / remove', 'eye-lock': 'Eye · lock', 'shape-primitives': 'Shape primitives', 'shape-forms': 'Shape forms' }
const label = (f) => LABELS[f] ?? f.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

const orderedFolders = Object.keys(KOL_ICON_SET_V1).sort((a, b) => {
  const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b)
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b)
})
const TOTAL = Object.values(KOL_ICON_SET_V1).reduce((n, l) => n + l.length, 0)

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

export default function IconsV1() {
  const [bgLight, setBgLight] = useState(true)
  const [size, setSize] = useState(24)
  const [gridOverlay, setGridOverlay] = useState(false)
  const [copied, setCopied] = useState(null)

  const copy = (name) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  const rowProps = useMemo(() => ({ size, bgLight, gridOverlay, copied, onCopy: copy }), [size, bgLight, gridOverlay, copied])

  return (
    <DocLayout wide>
      <DocHeader
        eyebrow="KOL · Icons"
        title="kol-icon-set-v1"
        lede={`The v1 icon set — ${TOTAL} icons across ${orderedFolders.length} groups, resolved straight from the package (@kolkrabbi/kol-icons). Single stroke cut, currentColor. Click any icon to copy its name.`}
      />

      <div className="flex items-center flex-wrap gap-6 mt-8 mb-10">
        <SegGroup label="BG" options={[{ value: false, label: 'DARK' }, { value: true, label: 'LIGHT' }]} value={bgLight} onChange={setBgLight} />
        <SegGroup label="SIZE" options={SIZES.map((v) => ({ value: v, label: String(v) }))} value={size} onChange={setSize} />
        <SegGroup label="GRID" options={[{ value: false, label: 'OFF' }, { value: true, label: 'ON' }]} value={gridOverlay} onChange={setGridOverlay} />
      </div>

      {orderedFolders.map((folder) => (
        <GroupList key={folder} folder={folder} items={KOL_ICON_SET_V1[folder]} {...rowProps} />
      ))}
    </DocLayout>
  )
}
