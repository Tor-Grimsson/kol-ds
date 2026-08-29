import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContentFilters, ContentCollection, ContentCard, ContentRow, ViewToggle, Dropdown, Divider } from '@kolkrabbi/kol-component'
import { PageHeader } from '@kolkrabbi/kol-shell'
import { useTheme } from '@kolkrabbi/kol-framework'
import { Icon, KOL_ICON_SET_V1, getCut } from '@kolkrabbi/kol-icons'
import { KeylineBg } from '../lib/icon-controls.jsx'

/**
 * IconsBrand — kol-website brand's `/icons` gallery, ported VERBATIM into the
 * showcase (user 2026-08-27: "brand/icons is a much nicer icon display … serve
 * 2 pages/versions") so the two can be compared side by side: `/icons` is the
 * showcase's grouped list, `/icons/brand` is the app-tier catalog page brand
 * built — PageHeader, ContentFilters (TYPE · TAGS, the gallery's own controls on
 * the inverse tone), ContentCollection six across, ContentCard catalog with the
 * glyph on a fixed ground, ContentRow catalog as the list. Only the imports are
 * adapted (brand's PageSection / usePageTitle / KeylineBg → the showcase's
 * frame and icon-controls); the rendering is class-for-class brand's
 * `apps/brand/src/pages/IconsGallery.jsx`.
 */
const DEFAULT_SET = 'kol-icon-set-v1'

export const ICON_SETS = {
  'kol-icon-set-v1': {
    label: 'kol-icon-set-v1',
    title: 'Icons',
    groups: KOL_ICON_SET_V1,
  },
}

const ORDER = ['chevron', 'arrow', 'arrow-diagonal', 'caret', 'add-remove', 'transfer', 'traffic', 'nav', 'singletons',
  'layout', 'files', 'device', 'components', 'code', 'tools', 'notify', 'eye-lock', 'atomic',
  'shape-primitives', 'shape-forms', 'misc']
const LABELS = { 'add-remove': 'Add / remove', 'eye-lock': 'Eye · lock', 'shape-primitives': 'Shape primitives', 'shape-forms': 'Shape forms' }
const label = (f) => LABELS[f] ?? f.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

/* The glyph is drawn ONCE at its native 128 and the size control scales it
 * from the centre of the placeholder (user 2026-08-27) — no re-render per
 * size, and the keyline guide scales with it. */
const NATIVE = 128
const SIZES = [16, 20, 24, 32, 48, 64, 128].map((v) => ({ value: v, label: String(v) }))
const GROUNDS = [
  { value: 'dark', label: 'Dark ground', icon: 'mode-toggle-01' },
  { value: 'light', label: 'Light ground', icon: 'brightness' },
]
const GUIDE = [{ value: true, label: 'GUIDE' }, { value: false, label: 'CLEAR' }]

const CUT_LABEL = { stroke: 'Stroke', solid: 'Solid' }
const TYPES = ['Stroke', 'Solid']
const LAYOUTS = [{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }]

function Glyph({ name, size, bgLight, guide }) {
  return (
    <div
      className="w-full aspect-square flex items-center justify-center"
      style={{ background: bgLight ? '#FFFFFF' : '#0E0E11', color: bgLight ? '#0E0E11' : '#FFFFFF' }}
    >
      <span
        className="relative block shrink-0"
        style={{ width: NATIVE, height: NATIVE, transform: `scale(${size / NATIVE})` }}
      >
        {guide && <KeylineBg bgLight={bgLight} />}
        <Icon name={name} size={NATIVE} />
      </span>
    </div>
  )
}

export default function IconsBrand() {
  const meta = ICON_SETS[DEFAULT_SET]

  /* the ground follows the app theme until the toggle names one (user 2026-08-27) */
  const { theme } = useTheme()
  const [groundOverride, setGroundOverride] = useState(null)
  const ground = groundOverride ?? theme
  const [guide, setGuide] = useState(false)
  const [size, setSize] = useState(NATIVE)
  const [copied, setCopied] = useState(null)

  const copy = (name) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  const orderedFolders = useMemo(() => Object.keys(meta.groups).sort((a, b) => {
    const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b)
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b)
  }), [meta])

  const items = useMemo(
    () => orderedFolders.flatMap((folder) =>
      meta.groups[folder].map((name) => ({ name, group: label(folder), folder, type: CUT_LABEL[getCut(name)] ?? 'Stroke' }))),
    [orderedFolders, meta],
  )

  const bgLight = ground === 'light'

  return (
    <section id="icons-brand">
      <PageHeader
        size="sm"
        voice="mono"
        title={meta.title}
        subtitle={`${items.length} icons across ${orderedFolders.length} groups (${meta.label}), resolved straight from the package (@kolkrabbi/kol-icons). Single stroke cut, currentColor. Click any icon to copy its name.`}
      />
      <p className="kol-mono-12 text-meta -mt-2 mb-6">
        Brand's gallery, ported verbatim — compare with <Link className="kol-link underline" to="/icons">the showcase's grouped list</Link>.
      </p>

      <ContentFilters
        tone="sunken"
        items={items}
        title="Icons"
        totalCount={items.length}
        searchKeys={['name']}
        filterGroups={[
          { label: 'Type', key: 'type', values: TYPES },
          { label: 'Tags', key: 'group', values: orderedFolders.map(label) },
        ]}
        mutuallyExclusiveFilters={['type', 'group']}
        showCountOnlyWhenFiltering
        layoutOptions={LAYOUTS}
        layoutClassName="kol-helper-14"
        defaultLayout="grid"
        trailingActions={<Dropdown tone="sunken" options={SIZES} value={size} onChange={setSize} className="w-20" />}
        belowActions={
          <div className="flex items-center gap-4">
            <ViewToggle tone="sunken" variant="icon" options={GROUNDS} viewMode={ground} onViewChange={setGroundOverride} />
            <Divider variant="vertical" />
            <div className="flex items-center gap-4">
              {GUIDE.map((o) => (
                <span
                  key={o.label}
                  onClick={() => setGuide(o.value)}
                  aria-pressed={guide === o.value}
                  className={`kol-helper-14 cursor-pointer select-none ${guide === o.value ? 'text-oq-96' : 'text-oq-48 hover:text-oq-64'}`}
                  style={{ letterSpacing: 1 }}
                >
                  {o.label}
                </span>
              ))}
            </div>
          </div>
        }
        renderItem={(rows, _view, layout) => {
          const list = layout === 'list'
          return (
            <ContentCollection form={list ? 'list' : 'grid'} cols={6}>
              {rows.map((item) => list ? (
                <ContentRow
                  key={item.name}
                  variant="catalog"
                  title={copied === item.name ? 'copied!' : item.name}
                  detail={item.group}
                  onClick={() => copy(item.name)}
                />
              ) : (
                <ContentCard
                  key={item.name}
                  variant="catalog"
                  ratio="auto"
                  title={copied === item.name ? 'copied!' : item.name}
                  detail={item.group}
                  media={<Glyph name={item.name} size={size} bgLight={bgLight} guide={guide} />}
                  onClick={() => copy(item.name)}
                />
              ))}
            </ContentCollection>
          )
        }}
      />
    </section>
  )
}
