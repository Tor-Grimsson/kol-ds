import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ContentFilters, ContentCollection, ContentRow, ViewToggle, Dropdown, Divider, IconPlate, IconToggle } from '@kolkrabbi/kol-component'
import { TabStrip } from '@kolkrabbi/kol-shell'
import { PageHeader } from '@kolkrabbi/kol-component'
import { DocHeader } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import ChapterHome from '../lib/ChapterHome.jsx'
import { Icon, KOL_ICON_SET_INTERFACE, KOL_ICON_SET_SIGNAL, getCut } from '@kolkrabbi/kol-icons'

/* Icon-set registry — BOTH shipped sets (kol-icons ≥0.25.0): interface is app
 * chrome, signal is the instrument vocabulary. The route's `:set` segment
 * names one; a route that carries none falls back to interface.
 *
 * The group index comes FROM the package (`KOL_ICON_SET_INTERFACE`, built by
 * import.meta.glob over the SVG folder) — never a hand-transcribed name list.
 * A transcription drifts the moment an icon is added; this cannot. */
const DEFAULT_SET = 'kol-icon-set-interface'

export const ICON_SETS = {
  'kol-icon-set-interface': {
    label: 'kol-icon-set-interface',
    title: 'Interface',
    groups: KOL_ICON_SET_INTERFACE,
  },
  'kol-icon-set-signal': {
    label: 'kol-icon-set-signal',
    title: 'Signal',
    groups: KOL_ICON_SET_SIGNAL,
  },
}

/* The gallery's own group order and display names — folder slugs are the data,
 * these are what a reader sees on the filter chips. */
const ORDER = ['chevron', 'arrow', 'arrow-diagonal', 'caret', 'add-remove', 'transfer', 'traffic', 'nav', 'singletons',
  'layout', 'files', 'device', 'components', 'code', 'tools', 'notify', 'eye-lock', 'atomic',
  'shape-primitives', 'shape-forms', 'misc']
const LABELS = { 'add-remove': 'Add / remove', 'eye-lock': 'Eye · lock', 'shape-primitives': 'Shape primitives', 'shape-forms': 'Shape forms' }
const label = (f) => LABELS[f] ?? f.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
const byOrder = (a, b) => {
  const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b)
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b)
}
/* a set's groups in gallery order — the rail's rows and the group pages (W3, 2026-09-30: every
 * group gets a page) */
export const iconGroups = (setKey) => Object.keys(ICON_SETS[setKey]?.groups ?? {}).sort(byOrder).map((folder) => ({ folder, label: label(folder), count: ICON_SETS[setKey].groups[folder].length }))

/* FIT is the default (2026-10-09 — user: "why is the guide and icons not using the available space?
 * hard to visualise margins like this"): the 24 grid spans the whole tile, so the keylines read
 * edge to edge; a number still shows the glyph at that px */
const SIZES = [{ value: 'fit', label: 'Fit' }, ...[16, 20, 24, 32, 48, 64, 128].map((v) => ({ value: v, label: String(v) }))]
const GROUNDS = [
  { value: 'dark', label: 'Dark ground', icon: 'mode-toggle-01' },
  { value: 'light', label: 'Light ground', icon: 'brightness' },
]
/* TYPE — Stroke | Solid, the set's own fact (kol-icons ≥0.24.0 `getCut`, IconSetCut
 * 2026-08-27 — user: "TYPE (stroke solid)? then TAGS"). Chip labels are cased here. */
const CUT_LABEL = { stroke: 'Stroke', solid: 'Solid' }
const TYPES = ['Stroke', 'Solid']
const LAYOUTS = [{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }]

/* THE TILE IS THE GALLERY'S OWN (2026-10-17 — user: "only fit uses the container correctly … the zoom
 * hover is wrong … I think the problem is the card you are using"). `ContentCard catalog` brought a frame,
 * an image-led hover zoom and a title that wrapped or cut the name. The tile is now the DS plate — the box
 * IS the size, guide and glyph fill it (`IconPlate`, kol-component) — with the whole name and its group
 * under it, in the catalog card's own voices. Click copies the name; nothing moves on hover. */
/* The name steps down with the plate so the column can follow the size and the name still never breaks
 * mid-word: each floor is the set's longest unbroken run with its hyphen (`highlighter-`) measured at that
 * type, +2 (mono: 6 · 7.2 · 8.4 px a character). */
const nameType = (size) => (size !== 'fit' && size <= 20 ? ['kol-mono-10', 74] : size !== 'fit' && size <= 24 ? ['kol-mono-12', 89] : ['kol-mono-14', 103])

function Tile({ item, size, ground, guide, copied, onCopy }) {
  return (
    <div>
      <button type="button" onClick={() => onCopy(item.name)} className="flex w-full flex-col items-start gap-3 text-left cursor-pointer focus-visible:outline-1 focus-visible:outline-offset-2">
        <IconPlate size={size === 'fit' ? 'fill' : size} ground={ground} guide={guide}>
          <Icon name={item.name} size={size === 'fit' ? '100%' : size} />
        </IconPlate>
        <span className="flex flex-col gap-1">
          <span className={`${nameType(size)[0]} text-emphasis`}>{copied === item.name ? 'copied!' : item.name}</span>
          <span className="kol-mono-10 text-meta">{item.group}</span>
        </span>
      </button>
    </div>
  )
}

/* The LIST row's thumb follows the size control too (2026-10-17 — user: "list completely ignores
 * dropdown size scaling"); Fit keeps the row's own square. */
function RowGlyph({ name, size, ground, guide }) {
  return (
    <IconPlate size={size === 'fit' ? 'fill' : size} ground={ground} guide={guide}>
      <Icon name={name} size={size === 'fit' ? 20 : size} />
    </IconPlate>
  )
}

/**
 * IconsGallery — THE icons page: `/icons` carries no segment and takes the
 * default set; `/icons/:set` names one.
 *
 * PORTED VERBATIM from kol-website `apps/brand/src/pages/IconsGallery.jsx`
 * (user 2026-08-27: "brand/icons is a much nicer icon display"; made THE
 * page 2026-09-02 when the showcase's own grouped list was retired for
 * hand-rolling chrome the DS ships). Only the imports are adapted — brand's
 * page frame, title hook and keyline component → a plain section and the
 * showcase's icon-controls — plus two deliberate deviations, both in the
 * header cluster: a SET Dropdown (the showcase ships two sets and the picker
 * has to be visible, not only a URL), and brand's stub settings button
 * dropped (an empty onClick is not a control). And one for the phone: the
 * cluster WRAPS and the size Dropdown is `w-24`, not brand's `w-48` — at 390
 * the row measured 364px in a 342px track and scrolled `main` sideways; the
 * values are two or three digits, the width was a wide-header aesthetic.
 * Everything else is class-for-class.
 *
 * The app tier's catalog page, as kol-monitor / kol-mirror / kol-fxr render it
 * (user 2026-08-27): the shell `PageHeader`, `ContentFilters` (title · filter ·
 * search, the gallery's own controls in the header's right slot, LIST / GRID
 * under the divider), `ContentCollection` six across, `ContentCard catalog`
 * with the glyph in the media slot, its name as the title and its group as
 * the detail; the list form is `ContentRow catalog`. The folder groups are
 * filter chips, one at a time — no per-group sections, no dividers.
 *
 * The controls are the one thing the family does not own, and they ride the
 * seam kol-r2b2's FileList uses for its own: ground and guide are icon
 * `ViewToggle`s, size is a `Dropdown`.
 */
export default function IconsGallery() {
  const { set, group } = useParams()
  const meta = ICON_SETS[set ?? DEFAULT_SET]

  /* light ground by default (2026-10-09 — user: "make light ground default"; it followed the app
   * theme from 2026-08-27) */
  const [ground, setGround] = useState('light')
  const [guide, setGuide] = useState(false)
  const [layout, setLayout] = useState('grid')
  const [size, setSize] = useState('fit')
  const [copied, setCopied] = useState(null)

  const copy = (name) => {
    navigator.clipboard?.writeText(name).catch(() => {})
    setCopied(name)
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200)
  }

  const orderedFolders = useMemo(() => {
    if (!meta) return []
    /* a group's page shows that group only (W3, 2026-09-30) */
    return Object.keys(meta.groups).filter((f) => !group || f === group).sort(byOrder)
  }, [meta, group])

  /* `group` carries the DISPLAY label so the chips read as the gallery always
   * labelled them ("Add / remove", not "add-remove"). */
  const items = useMemo(
    () => orderedFolders.flatMap((folder) =>
      meta.groups[folder].map((name) => ({ name, group: label(folder), folder, type: CUT_LABEL[getCut(name)] ?? 'Stroke' }))),
    [orderedFolders, meta],
  )

  /* /icons IS THE ICONS HOME (2026-09-30): it rendered the default set a second time */
  if (!set) {
    return <ChapterHome home="icons" title="Sets" noteHeader="Holds" items={Object.entries(ICON_SETS).map(([k, x]) => ({ to: `/icons/${k}`, label: x.title, note: `${Object.keys(x.groups).length} groups · ${Object.values(x.groups).flat().length} icons` }))} />
  }

  if (!meta || (group && !meta.groups[group])) {
    return (
      <section id="icons-gallery">
        <PageHeader size="sm" voice="mono" title="Unknown set" />
        <p className="kol-mono-12 text-fg-48 mt-6">No icon set named “{set}”{group ? ` with a group “${group}”` : ''}.</p>
      </section>
    )
  }

  return (
    <section id={`icons-${set ?? DEFAULT_SET}`} className="flex flex-col gap-10 pb-24">
      {/* ONE HEADER (W8, 2026-09-30 — user: "icons could and should also fix the layout, its clashing
        * content filters and a specific style setup for entire page"). The page stacked TWO headers —
        * the gallery's own (title, a SET picker, size, a theme toggle) over ContentFilters' (title,
        * filter, search, ground, guide) — and split its controls between them. Now the page's title
        * is its home (a group page: a DocHeader), and every control rides the one filter row. The
        * set picker went: the rail and the Icons home list the sets; the theme toggle went: the
        * shell header has the one. */}
      {group
        ? <DocHeader eyebrow={meta.title} title={label(group)} lede={`${items.length} icons in the ${label(group)} group. Click any icon to copy its name.`} />
        : <HomeDoc key={set ?? DEFAULT_SET} id={set ?? DEFAULT_SET} />}

      <ContentFilters
        items={items}
        title="Icons"
        totalCount={items.length}
        searchKeys={['name']}
        /* TYPE first — the short group takes the first column; TAGS flows after it */
        filterGroups={[
          { label: 'Type', key: 'type', values: TYPES },
          ...(group ? [] : [{ label: 'Tags', key: 'group', values: orderedFolders.map(label) }]),
        ]}
        mutuallyExclusiveFilters={['type', 'group']}
        showCountOnlyWhenFiltering
        layout={layout}
        onLayoutChange={setLayout}
        /* ONE CONTROL ROW (2026-10-17 — user: "guide clear could just be a iconframe toggle … then we can
         * move list / grid there instead … in the bigger size"): size · ground · guide │ LIST GRID, and no
         * strip under the divider */
        trailingActions={
          <div className="flex items-center gap-6">
            <Dropdown tone="primary" options={SIZES} value={size} onChange={setSize} className="w-24" />
            <ViewToggle tone="primary" variant="icon" options={GROUNDS} viewMode={ground} onViewChange={setGround} />
            <IconToggle icon="grid" label="Guide" title="Keyline guide" pressed={guide} onChange={setGuide} size="md" />
            <Divider variant="vertical" />
            <TabStrip options={LAYOUTS} value={layout} onChange={setLayout} tracked />
          </div>
        }
        renderItem={(rows) => {
          const list = layout === 'list'
          /* A NUMBER SIZES THE COLUMN (user 2026-10-17: "go from 5 columns to what is relative to the
           * size"): the column is twice the plate, never under the name's floor; Fit keeps six across */
          const cols = size === 'fit' ? { cols: 6, minCol: '160px' } : { min: `${Math.max(size * 2, nameType(size)[1])}px` }
          return list ? (
            <ContentCollection form="list">
              {rows.map((item) => (
                <ContentRow
                  key={item.name}
                  variant="catalog"
                  title={copied === item.name ? 'copied!' : item.name}
                  detail={item.group}
                  thumb={size === 'fit' ? undefined : size}
                  minHeight={size === 'fit' ? undefined : Math.max(36, size + 8)}
                  media={<RowGlyph name={item.name} size={size} ground={ground} guide={guide} />}
                  onClick={() => copy(item.name)}
                />
              ))}
            </ContentCollection>
          ) : (
            <ContentCollection form="grid" {...cols}>
              {rows.map((item) => <Tile key={item.name} item={item} size={size} ground={ground} guide={guide} copied={copied} onCopy={copy} />)}
            </ContentCollection>
          )
        }}
      />
    </section>
  )
}
