import { useState } from 'react'
import { Link } from 'react-router-dom'
import DocHeader from '../lib/DocHeader.jsx'
import { Icon, ICON_ENTRIES } from '@kolkrabbi/kol-loader'
import { SegGroup, KeylineBg } from '../lib/icon-controls.jsx'
import DocLayout from '../lib/DocLayout.jsx'

/**
 * Icons · Variants — ported from the brand app's /icons/variants page.
 * One card per icon: solid | stroke | stroke-on-grid, with name + category.
 */

const SIZES = [16, 20, 24, 32, 48, 64]

// Unique icons with their first category, from the real inventory.
const UNIQUE = (() => {
  const seen = new Set()
  const out = []
  for (const { name, folder } of ICON_ENTRIES) {
    if (seen.has(name)) continue
    seen.add(name)
    out.push({ name, category: folder })
  }
  return out
})()

function Cell({ name, variant, size, bgLight, grid, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ minHeight: 88, background: bgLight ? '#FFFFFF' : '#0E0E11', color: bgLight ? '#0E0E11' : '#FFFFFF' }}
    >
      {grid && <KeylineBg bgLight={bgLight} />}
      <span className="relative" style={{ zIndex: 1 }}>
        <Icon name={name} size={size} variant={variant} />
      </span>
    </div>
  )
}

export default function IconsVariants() {
  const [size, setSize] = useState(32)
  const [bgLight, setBgLight] = useState(false)

  return (
    <DocLayout wide>
      <DocHeader
        eyebrow="KOL · Icons"
        title="Icon variants"
        lede={`Every icon in both cuts — solid, stroke, and stroke on the keyline grid. ${UNIQUE.length} icons.`}
      />
      <div>
      <Link
        to="/icons"
        className="inline-flex items-center gap-2 kol-helper-12 text-fg-80 border border-fg-16 hover:border-fg-40 rounded-sm px-3 py-2 transition-colors"
      >
        ← Back to inventory
      </Link>

      <div className="flex items-center flex-wrap gap-6 mt-8 mb-8">
        <SegGroup label="BG" options={[{ value: false, label: 'DARK' }, { value: true, label: 'LIGHT' }]} value={bgLight} onChange={setBgLight} />
        <SegGroup label="SIZE" options={SIZES.map((v) => ({ value: v, label: String(v) }))} value={size} onChange={setSize} />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {UNIQUE.map(({ name, category }) => (
          <div key={name} className="flex flex-col border border-fg-08 rounded-sm overflow-hidden">
            <div className="grid grid-cols-3">
              <Cell name={name} variant="solid" size={size} bgLight={bgLight} grid={false} className="border-r border-fg-08" />
              <Cell name={name} variant="stroke" size={size} bgLight={bgLight} grid={false} className="border-r border-fg-08" />
              <Cell name={name} variant="stroke" size={size} bgLight={bgLight} grid />
            </div>
            <div
              className="grid grid-cols-3 border-t border-fg-04 kol-helper-10 text-fg-48 text-center"
              style={{ letterSpacing: 1, textTransform: 'uppercase' }}
            >
              <span className="py-1.5 border-r border-fg-04">Solid</span>
              <span className="py-1.5 border-r border-fg-04">Stroke</span>
              <span className="py-1.5">Grid</span>
            </div>
            <div className="flex items-center justify-between border-t border-fg-08 px-3 py-2">
              <span className="kol-helper-12 text-fg-80 truncate">{name}</span>
              <span className="kol-helper-10 text-fg-48">{category}</span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </DocLayout>
  )
}
