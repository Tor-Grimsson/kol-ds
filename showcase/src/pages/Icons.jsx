import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DocHeader from '../lib/DocHeader.jsx'
import { Icon, ICON_INDEX, ICON_ENTRIES } from '@kolkrabbi/kol-loader'
import { Button, ContentFilters } from '@kolkrabbi/kol-component'
import { SegGroup, KeylineBg } from '../lib/icon-controls.jsx'
import DocLayout from '../lib/DocLayout.jsx'

/**
 * Icons — the KOL icon inventory. Ported from the brand app's /icons page
 * (apps/brand/src/pages/Icons.jsx); only the data source is swapped — instead
 * of globbing raw SVGs we render the loader's <Icon> component, enumerating
 * from ICON_ENTRIES / ICON_INDEX (the loader's real on-disk inventory — 862
 * icons, not the stale 341-name ICONS registry). Control bar = the brand
 * app's SegGroup row; search / category filter / count / grid-list = ContentFilters.
 */

const SIZES = [16, 20, 24, 32, 48, 64]
const CATEGORIES = Object.keys(ICON_INDEX)
const ICON_ITEMS = ICON_ENTRIES.map((e) => ({ name: e.name, category: e.folder }))

function Tile({ name, size, variant, bgLight, gridOverlay, copied, onCopy }) {
  const cell = size + 16
  return (
    <button type="button" onClick={() => onCopy(name)} title={name} className="flex flex-col items-center gap-1">
      <div
        className="relative flex items-center justify-center rounded-sm"
        style={{
          width: cell,
          height: cell,
          background: bgLight ? '#FFFFFF' : '#0E0E11',
          color: bgLight ? '#0E0E11' : '#FFFFFF',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {gridOverlay && <KeylineBg bgLight={bgLight} />}
        <span className="relative" style={{ zIndex: 1 }}>
          <Icon name={name} size={size} variant={variant} />
        </span>
      </div>
      <div className="kol-helper-10 text-fg-80 truncate w-full text-center px-1">
        {copied ? 'copied!' : name}
      </div>
    </button>
  )
}

export default function Icons() {
  const [bgLight, setBgLight] = useState(false)
  const [size, setSize] = useState(24)
  const [variant, setVariant] = useState('stroke')
  const [gridOverlay, setGridOverlay] = useState(false)
  const [copied, setCopied] = useState(null)
  const navigate = useNavigate()

  const copy = (name) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  const filterGroups = useMemo(() => [{ label: 'Category', key: 'category', values: CATEGORIES }], [])

  // Re-group the filtered flat list into category sections, sorted by size.
  const renderItems = (filtered, viewMode) => {
    const map = {}
    for (const it of filtered) (map[it.category] ??= []).push(it.name)
    const sections = Object.entries(map).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    if (sections.length === 0) return <p className="kol-sans-body-01 text-meta">no icons match.</p>

    return sections.map(([cat, names]) => (
      <section key={cat} className="mb-12">
        <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-fg-08">
          <h2 className="kol-helper-14 text-fg-96">{cat}</h2>
          <span className="kol-helper-10 text-fg-48" style={{ fontVariantNumeric: 'tabular-nums' }}>{names.length}</span>
        </div>

        {viewMode === 'list' ? (
          <div className="flex flex-col">
            {names.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => copy(name)}
                className="flex items-center gap-4 py-2 border-b border-fg-04 hover:bg-fg-02 text-left"
              >
                <span
                  className="flex items-center justify-center shrink-0 rounded-sm"
                  style={{ width: 32, height: 32, background: bgLight ? '#FFFFFF' : '#0E0E11', color: bgLight ? '#0E0E11' : '#FFFFFF' }}
                >
                  <Icon name={name} size={20} variant={variant} />
                </span>
                <span className="kol-mono-12 text-fg-80">{copied === name ? 'copied!' : name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(64, size + 28)}px, 1fr))` }}>
            {names.map((name) => (
              <Tile key={name} name={name} size={size} variant={variant} bgLight={bgLight} gridOverlay={gridOverlay} copied={copied === name} onCopy={copy} />
            ))}
          </div>
        )}
      </section>
    ))
  }

  return (
    <DocLayout wide>
      <DocHeader
        eyebrow="KOL · Icons"
        title="Icon library"
        lede={`${ICON_ENTRIES.length} icons across ${CATEGORIES.length} categories, from @kolkrabbi/kol-loader. Toggle stroke / fill and size; click any icon to copy its name.`}
      />
      <div>
      <Button variant="primary" iconRight="arrow-right" onClick={() => navigate('/icons/variants')}>
        View variants
      </Button>

      {/* Display controls — ported SegGroup row (BG · SIZE · STYLE · GRID) */}
      <div className="flex items-center flex-wrap gap-6 mt-8 mb-6">
        <SegGroup label="BG" options={[{ value: false, label: 'DARK' }, { value: true, label: 'LIGHT' }]} value={bgLight} onChange={setBgLight} />
        <SegGroup label="SIZE" options={SIZES.map((v) => ({ value: v, label: String(v) }))} value={size} onChange={setSize} />
        <SegGroup label="STYLE" options={[{ value: 'stroke', label: 'STROKE' }, { value: 'solid', label: 'FILL' }]} value={variant} onChange={setVariant} />
        <SegGroup label="GRID" options={[{ value: false, label: 'OFF' }, { value: true, label: 'ON' }]} value={gridOverlay} onChange={setGridOverlay} />
      </div>

      {/* Search + category filter + count + grid/list — the real ContentFilters */}
      <ContentFilters
        items={ICON_ITEMS}
        title="Icons"
        totalCount={ICON_ITEMS.length}
        filterGroups={filterGroups}
        renderItem={renderItems}
        searchKeys={['name']}
        viewModeOptions={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
        defaultViewMode="grid"
        showCountOnlyWhenFiltering
      />
      </div>
    </DocLayout>
  )
}
