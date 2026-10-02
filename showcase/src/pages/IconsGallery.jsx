import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ContentFilters, ContentCollection, ContentCard, ContentRow, ViewToggle, Dropdown, Divider } from '@kolkrabbi/kol-component'
import { PageHeader } from '@kolkrabbi/kol-component'
import { useTheme } from '@kolkrabbi/kol-framework'
import { DocHeader } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import ChapterHome from '../lib/ChapterHome.jsx'
import { Icon, KOL_ICON_SET_INTERFACE, KOL_ICON_SET_SIGNAL, getCut } from '@kolkrabbi/kol-icons'
import { KeylineBg } from '../lib/icon-controls.jsx'

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

/* The glyph is drawn ONCE at its native 128 and the size control scales it
 * from the centre of the placeholder (user 2026-08-27) — no re-render per
 * size, and the keyline guide scales with it. */
const NATIVE = 128
const SIZES = [16, 20, 24, 32, 48, 64, 128].map((v) => ({ value: v, label: String(v) }))
const GROUNDS = [
  { value: 'dark', label: 'Dark ground', icon: 'mode-toggle-01' },
  { value: 'light', label: 'Light ground', icon: 'brightness' },
]
/* the guide is a TEXT strip in the layout strip's own voice (user 2026-08-27:
 * "GUIDE CLEAR in the same style as ICONS on the left") — the bare strip only
 * exists inside ContentFilters, so its classes are mirrored here verbatim */
const GUIDE = [{ value: true, label: 'GUIDE' }, { value: false, label: 'CLEAR' }]

/* TYPE — Stroke | Solid, the set's own fact (kol-icons ≥0.24.0 `getCut`, IconSetCut
 * 2026-08-27 — user: "TYPE (stroke solid)? then TAGS"). Chip labels are cased here. */
const CUT_LABEL = { stroke: 'Stroke', solid: 'Solid' }
const TYPES = ['Stroke', 'Solid']
const LAYOUTS = [{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }]

/* The card's media: the specimen ground (fixed, like the DS gallery's — a
 * light or dark plate the theme never touches) with the glyph centred on it.
 * SQUARE by its own aspect (user: "6 columns square graphic placeholder") —
 * the card runs `ratio="auto"` so this box, not the catalog's A4 frame, sets
 * the height; a card ratio that yields a square only at one column width is
 * not a square. */
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

  const bgLight = ground === 'light'

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
        tone="sunken"
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
        layoutOptions={LAYOUTS}
        layoutClassName="kol-helper-12"
        defaultLayout="grid"
        trailingActions={
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-6">
              <Dropdown tone="sunken" options={SIZES} value={size} onChange={setSize} className="w-24" />
              <ViewToggle tone="sunken" variant="icon" options={GROUNDS} viewMode={ground} onViewChange={setGroundOverride} />
              <Divider variant="vertical" />
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
            /* a tile floor of 160 — the catalog's own `minColumn`; the 320 default gave ONE column at
             * 1280 (W8, 2026-09-30) */
            <ContentCollection form={list ? 'list' : 'grid'} cols={6} minCol="160px">
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
                  plateRule={false}
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
