import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DocHeader from '../lib/DocHeader.jsx'
import { Icon, ICON_ENTRIES, SOLID_ICON_ENTRIES } from '@kolkrabbi/kol-loader'
import { ContentFilters } from '@kolkrabbi/kol-component'
import { SegGroup, KeylineBg } from '../lib/icon-controls.jsx'
import DocLayout from '../lib/DocLayout.jsx'

/**
 * Icons · Variants — ported from the brand app's /icons/variants page
 * (apps/brand/src/pages/IconsVariants.jsx). One card per icon: solid | stroke
 * | stroke-on-grid. The page's job is finding MIRROR GAPS between the two
 * cuts — a "—" cell means that cut isn't drawn yet; the Mirror filter
 * isolates stroke-only / solid-only entries. Data comes from the loader's
 * keys-only inventories instead of the brand app's raw globs.
 */

const SIZES = [16, 24, 32, 48, 64]

// Union of the stroke + solid inventories keyed folder/name, with mirror status.
const strokeKeys = new Set(ICON_ENTRIES.map((e) => `${e.folder}/${e.name}`))
const solidKeys = new Set(SOLID_ICON_ENTRIES.map((e) => `${e.folder}/${e.name}`))
const ITEMS = [...new Set([...strokeKeys, ...solidKeys])]
  .map((id) => {
    const slash = id.lastIndexOf('/')
    const folder = id.slice(0, slash)
    const name = id.slice(slash + 1)
    const s = strokeKeys.has(id)
    const d = solidKeys.has(id)
    return { id, name, folder, mirror: s && d ? 'both' : s ? 'stroke-only' : 'solid-only' }
  })
  .sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name))

const mirroredCount = ITEMS.filter((i) => i.mirror === 'both').length

function Cell({ name, variant, size, bgLight, grid, missing, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        aspectRatio: '1',
        background: bgLight ? '#FFFFFF' : '#0E0E11',
        color: bgLight ? '#0E0E11' : '#FFFFFF',
      }}
    >
      {grid && <KeylineBg bgLight={bgLight} />}
      {missing ? (
        <span className="kol-helper-10 text-fg-32">—</span>
      ) : (
        <span className="relative" style={{ zIndex: 1 }}>
          <Icon name={name} size={size} variant={variant} />
        </span>
      )}
    </div>
  )
}

function Card({ item, size, bgLight }) {
  const hasStroke = item.mirror !== 'solid-only'
  const hasSolid = item.mirror !== 'stroke-only'
  return (
    <div className="flex flex-col border border-fg-08 rounded-sm overflow-hidden">
      <div className="grid grid-cols-3">
        <Cell name={item.name} variant="solid" size={size} bgLight={bgLight} grid={false} missing={!hasSolid} className="border-r border-fg-08" />
        <Cell name={item.name} variant="stroke" size={size} bgLight={bgLight} grid={false} missing={!hasStroke} className="border-r border-fg-08" />
        <Cell name={item.name} variant={hasStroke ? 'stroke' : 'solid'} size={size} bgLight={bgLight} grid />
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
        <span className="kol-helper-12 text-fg-80 truncate" title={item.name}>{item.name}</span>
        <span className="kol-helper-10 text-fg-48">{item.folder}</span>
      </div>
    </div>
  )
}

export default function IconsVariants() {
  const [size, setSize] = useState(48)
  const [bgLight, setBgLight] = useState(false)

  const folders = useMemo(() => [...new Set(ITEMS.map((i) => i.folder))].sort(), [])

  const filterGroups = useMemo(
    () => [
      { label: 'Category', key: 'folder', values: folders },
      { label: 'Mirror', key: 'mirror', values: ['both', 'stroke-only', 'solid-only'] },
    ],
    [folders],
  )

  const renderItems = (filteredItems) => (
    <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {filteredItems.map((item) => (
        <Card key={item.id} item={item} size={size} bgLight={bgLight} />
      ))}
    </div>
  )

  return (
    <DocLayout wide>
      <DocHeader
        eyebrow="KOL · Icons"
        title="Solid · stroke · stroke on grid"
        lede={`${ITEMS.length} icons — ${mirroredCount} fully mirrored (both stroke + solid), from @kolkrabbi/kol-loader. Use the Mirror filter to find gaps (stroke-only / solid-only). A "—" cell means that cut isn't drawn yet.`}
      />
      <div>
        <div className="flex items-center flex-wrap gap-6 mb-6">
          <Link to="/icons" className="kol-helper-12 text-fg-64 hover:text-fg-96">← back to inventory</Link>
          <SegGroup
            label="BG"
            options={[{ value: false, label: 'DARK' }, { value: true, label: 'LIGHT' }]}
            value={bgLight}
            onChange={setBgLight}
          />
          <SegGroup
            label="SIZE"
            options={SIZES.map((v) => ({ value: v, label: String(v) }))}
            value={size}
            onChange={setSize}
          />
        </div>

        <ContentFilters
          items={ITEMS}
          title="Variants"
          totalCount={ITEMS.length}
          filterGroups={filterGroups}
          renderItem={renderItems}
          searchKeys={['name', 'folder']}
          showCountOnlyWhenFiltering
        />
      </div>
    </DocLayout>
  )
}
