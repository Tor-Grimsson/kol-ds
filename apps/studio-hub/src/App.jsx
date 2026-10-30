import { useEffect, useState } from 'react'
import { AppStudio, CatalogPage, StudioCreate, StudioCreateAction, StudioDetail } from '@kolkrabbi/kol-shell'
import { Button, CanvasStudio, downloadBlob, useMediaQuery } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import { createFixtureClient } from 'media-fixture'
import { cover, title } from './covers.js'

/* THE STUDIO HUB — the workstation shape around a studio, the review surface for the apps that share it
 * (fxr, mirror, monitor; plan-2026-10-23 § 3.2). kol-shell's `AppStudio` with every slot filled on dummy
 * data: Home (the data contract — your files, New, Walkthrough), Library (the files and the parts), Create
 * (a catalog of parts beside the case on the studio canvas, monitor's page made once), Studio (the canvas
 * full-bleed), the Chrome section (the rail shape proposed for fxr: enter Chrome for Editor, Labs,
 * Randomiser and Morph; Labs folds its fields), and the
 * pinned foot: Media (the DS modal library over the media fixture), Sign in (a dummy session), Settings.
 * Everything on screen except the dummy data is the Studio. Dark by default, installable to a phone's home
 * screen, served with --host so a phone on the LAN opens it.
 *
 * Routing is the hash, so a reload lands where you were:  #/  home · #/library · #/create · #/studio ·
 * #/chrome/… · #/settings */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const APP = {
  name: 'Studio',
  subtitle: 'The workstation shape around a studio',
  logomark,
  /* the reference is dark-first (AppHubDefaultTheme, 2026-10-24): reset and the toggle's system land on dark, not the OS */
  defaultTheme: 'dark',
  about: 'The reference for the Studio hub — the pages every studio app has around its canvas: Home, Library, Create, the studio itself, Media, Sign in and Settings. The parts and the files are placeholders; the shape is the product.',
  links: [
    { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
    { label: 'Reference', url: 'https://monitor.kolkrabbi.io', text: 'monitor.kolkrabbi.io' },
  ],
  /* the rail's Docs tab (SettingsRailDocsTab, 2026-10-24): an app's explanatory prose as data, out of Settings' notes */
  docs: [
    { label: 'Home and Library', paragraphs: ['Home is the user\'s saves, every card the same: title, date, size, the cover with its download, the cog and the trash. The Library is what the app ships, its presets and its parts, on the same card.'] },
    { label: 'Create', paragraphs: ['Create is the case view and the parts view on one page. A part inserts into the case; the case keeps the zoom readout in its bottom bar.'] },
  ],
}

/* ── the dummy data: real images, real-looking files ───────────────────────────────────── */
const DAY = 86400000
const TAGS = ['loop', 'poster', 'social', 'test']
const PATCHES = ['70s', 'breathing', 'burst', 'color-cycle', 'color-steps', 'dither', 'echo-trail', 'filmstrip', 'kaleidoscope', 'kraftwerk', 'life', 'magneto', 'matrix', 'melody']

/* fourteen files, so RECENT shows its cap of twelve and SAVED every one; the last one has no cover on purpose, so the
 * placeholder is on the page once */
const SEED = PATCHES.map((slug, i) => ({
  id: slug,
  name: title(slug),
  updatedAt: Date.parse('2026-10-23T12:00:00Z') - i * DAY,
  bytes: 900 + i * 1370,
  cover: i === PATCHES.length - 1 ? undefined : cover(i),
  /* the file's images (FileRailImages, 2026-10-24): the rail's Files section; the last file holds none yet */
  images: i === PATCHES.length - 1 ? [] : [{ id: 'cover', src: cover(i), label: 'Cover' }],
  kind: i % 2 ? 'draft' : 'final',
  tags: [TAGS[i % TAGS.length], ...(i % 3 === 0 ? [TAGS[(i + 1) % TAGS.length]] : [])],
  note: i % 2 ? '' : `Patched for the ${['Mengi', 'Iðnó', 'Harpa', 'Gaukurinn'][i % 4]} show. Slow the clock before the second row.`,
  details: [{ label: 'Modules', value: 4 + (i % 9) }, { label: 'Connections', value: 2 + (i % 7) }],
}))

/* THE LIBRARY IS WHAT THE APP SHIPS (user 2026-10-24: *"home now would only show USER saved patches, which are different
 * from LIBRARY saves, which are more like system saves. what app ships with"*): PATCHES — ten shipped patches, system
 * saves, not Home's — and PARTS — the rack's modules. Every one is THE card with every field and icon (user 2026-10-24:
 * *"EVERY CARD HAS THE SAME FIELDS AND ICONS … NON NEGOTIABLE"*): title · date · size · cover with download · cog · trash;
 * there is no part card. A card opens its page — `/library/patch/<id>` · `/library/part/<id>` (StudioDetail) — never
 * the studio. */
const SHIP_DATE = Date.parse('2026-10-19T12:00:00Z')
const SHIPPED_NAMES = ['mesh', 'orbit', 'pulse', 'quad', 'ribbon', 'scan', 'slit', 'strobe', 'tunnel', 'weave']
const SHIPPED = SHIPPED_NAMES.map((slug, i) => ({
  id: slug, kind: 'patch', name: title(slug), updatedAt: SHIP_DATE - i * DAY, bytes: 1200 + i * 910, cover: cover(i + 40), images: [{ id: 'cover', src: cover(i + 40), label: 'Cover' }],
  tags: [TAGS[(i + 1) % TAGS.length]], note: '', details: [{ label: 'Modules', value: 3 + (i % 7) }, { label: 'Connections', value: 2 + (i % 5) }],
  description: `A shipped patch — ${title(slug)} runs ${3 + (i % 7)} modules into the output. The shape is the product; the patch is a placeholder.`,
}))
const CATEGORIES = ['control', 'generators', 'display', 'utility', 'math']
const MODULE_TYPES = ['attenuator', 'channel', 'clock', 'clockDiv', 'colorize', 'comparator', 'console', 'constant', 'delay', 'dither', 'envelope', 'expression', 'filter', 'generator', 'input', 'joystick', 'kaleidoscope', 'lfo', 'life', 'logic', 'magneto', 'master', 'maths', 'mixer', 'monitor', 'mult', 'noise', 'oscilloscope', 'output', 'patch', 'pen', 'perf', 'playback', 'power', 'quantizer', 'ramp', 'raster', 'recorder', 'reverb', 'rgb', 'routing', 'scope', 'sequencer', 'switch', 'transform', 'vca', 'waveform', 'window']
const PARTS = MODULE_TYPES.map((type, i) => ({
  id: type, kind: 'part', type, name: title(type),
  category: CATEGORIES[i % CATEGORIES.length], u_label: i % 4 === 0 ? '1U' : '3U', hp: 4 + (i % 5) * 2,
  updatedAt: SHIP_DATE - i * DAY, bytes: 400 + i * 37, cover: `/previews/modules/${type}.png`, images: [{ id: 'front', src: `/previews/modules/${type}.png`, label: 'Front' }], tags: [CATEGORIES[i % CATEGORIES.length]], note: '',
  details: [{ label: 'Category', value: title(CATEGORIES[i % CATEGORIES.length]) }, { label: 'Width', value: `${4 + (i % 5) * 2}HP` }, { label: 'Height', value: i % 4 === 0 ? '1U' : '3U' }],
  description: `${title(type)} — a module of the ${CATEGORIES[i % CATEGORIES.length]} category, ${4 + (i % 5) * 2}HP wide. A placeholder definition; the page's shape is the product.`,
}))
const PART_GROUPS = [
  { label: 'Category', key: 'category', values: CATEGORIES, exclusive: true },
  { label: 'Size', key: 'u_label', values: ['1U', '3U'], exclusive: true },
]

/* the case on the canvas — rows of module tiles; a dummy of the rack's case, not the rack */
const ROW_H = { '1u': 64, '3u': 192 }
function Case({ rows, name }) {
  return (
    <div className="inline-flex flex-col gap-2 rounded-[var(--kol-radius-sm)] border border-fg-12 bg-surface-secondary p-2" style={{ minWidth: 640 }}>
      <div className="kol-helper-10 text-fg-48 px-1">{name}</div>
      {rows.length === 0 && <div className="kol-mono-12 text-fg-32 px-1 py-6">No rows yet. Add one from the bar below.</div>}
      {rows.map((row) => (
        <div key={row.id} className="flex items-stretch gap-1 rounded-[var(--kol-radius-xs)] bg-surface-primary p-1" style={{ minHeight: ROW_H[row.height] + 8 }}>
          {row.modules.map((type, i) => (
            <img key={`${type}-${i}`} src={`/previews/modules/${type}.png`} alt={title(type)} style={{ height: ROW_H[row.height], width: 'auto', display: 'block', borderRadius: 'var(--kol-radius-xs)' }} />
          ))}
          {row.modules.length === 0 && <div className="kol-helper-10 text-fg-32 px-2 self-center">Empty {row.height.toUpperCase()} row</div>}
        </div>
      ))}
    </div>
  )
}

/* placeholder settings — the app's own rows, AS DATA */
const DEFAULTS = { aspect: '4:5', autoplay: false, grid: true }

/* a quicksheet, not a novel (review 2, § 6.2): every label two or three words */
const SHORTCUTS = [
  { section: 'Navigate', items: [
    { id: 'home', label: 'Pages', combo: '⌥ 1–9' },
    { id: 'settings', label: 'Settings', combo: ',' },
    { id: 'rail', label: 'Hide rail', combo: '\\' },
    { id: 'search', label: 'Search', combo: '⌘ K' },
  ] },
  { section: 'Canvas', items: [
    { id: 'pan', label: 'Pan', combo: 'Space + drag' },
    { id: 'zoom', label: 'Zoom', combo: '⌘ scroll' },
    { id: 'zoom-reset', label: 'Reset view', combo: '⌘ 0' },
    { id: 'grid', label: 'Grid', combo: 'G' },
    { id: 'lock', label: 'Lock', combo: 'L' },
    { id: 'fps', label: 'Frame rate', combo: 'F' },
  ] },
  { section: 'Help', items: [{ id: 'sheet', label: 'Every shortcut', combo: 'S' }] },
]

const fixtureClient = createFixtureClient()

const CHROMES = [
  { path: '/chrome/editor', icon: 'desktop', label: 'Editor' },
  { path: '/chrome/labs', icon: 'globe', label: 'Labs', sub: [
    /* Effects carries two dummy groups, so a leaf section folds on screen (review 2, § 4.1): Labs ENTERS (its rows carry
     * `sub`), Effects FOLDS (its rows carry none) */
    { path: '/chrome/labs/effects', icon: 'filter', label: 'Effects', sub: [
      { path: '/chrome/labs/effects/blur', icon: 'drop', label: 'Blur' },
      { path: '/chrome/labs/effects/glow', icon: 'brightness', label: 'Glow' },
    ] },
    { path: '/chrome/labs/generate', icon: 'refresh', label: 'Generate' },
    { path: '/chrome/labs/vector', icon: 'layers', label: 'Vector' },
    { path: '/chrome/labs/composition', icon: 'grid', label: 'Composition' },
  ] },
  { path: '/chrome/randomiser', icon: 'refresh', label: 'Randomiser' },
  { path: '/chrome/morph', icon: 'swap', label: 'Morph' },
]

function Placeholder({ name, text }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-oq-24">
      <Icon name={name} size={64} />
      <span className="kol-mono-12 text-meta">{text}</span>
    </div>
  )
}

const withPage = (row, text) => ({ ...row, children: <div className="p-12"><Placeholder name={row.icon} text={text ?? `${row.label}, a placeholder`} /></div>, sub: row.sub?.map((s) => withPage(s)) })

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }

  /* the files live here; the verbs write them and the Hub re-draws */
  const [files, setFiles] = useState(SEED)
  const [signedIn, setSignedIn] = useState(false)
  const [prefs, setPrefs] = useState(DEFAULTS)
  /* the settings tiers, flipped live from the drawer so he sees all three (review 2, § 6.3) */
  const [tier, setTier] = useState({ page: false, filters: false })
  /* the phone nav, bar or drawer — both ship (review 2, § 7.1); his pick survives a reload */
  const [phoneNav, setPhoneNavState] = useState(() => { try { const v = localStorage.getItem('studio-hub:phone-nav'); return ['bar', 'pill', 'drawer'].includes(v) ? v : 'pill' } catch { return 'pill' } })
  const setPhoneNav = (v) => { setPhoneNavState(v); try { localStorage.setItem('studio-hub:phone-nav', v) } catch { /* storage blocked */ } }
  /* how a rail section opens — enter (fxr's labs) or fold (the other apps), both shown for review */
  /* the rack fits the phone's height on open (user 2026-10-23); the desktop keeps 100 % */
  const phone = useMediaQuery('(max-width: 767px)')
  const [railSections, setRailSectionsState] = useState(() => { try { return localStorage.getItem('studio-hub:rail-sections') === 'fold' ? 'fold' : 'enter' } catch { return 'enter' } })
  const setRailSections = (v) => { setRailSectionsState(v); try { localStorage.setItem('studio-hub:rail-sections', v) } catch { /* storage blocked */ } }
  /* fxr's quick links above the catalog on a phone — an option, off for monitor and mirror (review 2, § 7.2) */
  const [quickLinks, setQuickLinks] = useState(false)
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }))
  const [libView, setLibView] = useState('patches')
  /* the shipped lists as this device's library — every verb writes them, like the saves (2026-10-24) */
  const [shipped, setShipped] = useState(SHIPPED)
  const [parts, setParts] = useState(PARTS)

  /* the case under construction — Create and Studio draw the same one */
  const [caseName, setCaseName] = useState('Untitled')
  const [caseDescription, setCaseDescription] = useState('Design a new case')
  const [rows, setRows] = useState([{ id: 'r1', height: '3u', modules: ['clock', 'lfo', 'mixer'] }])
  const [rowsOpen, setRowsOpen] = useState(false)
  const [showCase, setShowCase] = useState(true)
  const [canvasView, setCanvasView] = useState({ zoom: 1, x: 0, y: 0 })
  const addRow = (height) => setRows((rs) => [...rs, { id: `r${Date.now().toString(36)}`, height, modules: [] }])
  const place = (part) => setRows((rs) => {
    const want = part.u_label === '1U' ? '1u' : '3u'
    const i = rs.findIndex((r) => r.height === want)
    if (i < 0) return [...rs, { id: `r${Date.now().toString(36)}`, height: want, modules: [part.type] }]
    return rs.map((r, j) => (j === i ? { ...r, modules: [...r.modules, part.type] } : r))
  })

  const home = {
    files,
    onOpen: () => navigate('/studio'),
    onDownload: (f) => downloadBlob(new Blob([JSON.stringify(f, null, 2)], { type: 'application/json' }), `${f.name}.json`),
    onRename: (f, name) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, name, updatedAt: Date.now() } : x))),
    onDuplicate: (f) => setFiles((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
    onRemove: (f) => setFiles((fs) => fs.filter((x) => x.id !== f.id)),
    onTags: (f, tags) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, tags } : x))),
    onNote: (f, note) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, note } : x))),
    /* the rail's Files section (FileRailImages, 2026-10-24): the cover and back are PICKED from the file's images (`null`
     * when the image that was it is removed); upload and × hand the whole list back */
    onCover: (f, src) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, cover: src } : x))),
    onBack: (f, src) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, back: src } : x))),
    onImages: (f, next) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, images: next } : x))),
    filterGroups: [{ label: 'Kind', key: 'kind', values: ['draft', 'final'], exclusive: true }],
    action: { label: 'New', onClick: () => navigate('/create') },
    /* quick links on the phone (review 2, § 7.2): fxr's chromes as four doors above the rows, when he turns them on */
    /* SIGNED OUT (HubHomeSignedOut, 2026-10-28, fxr's frames A2 · B2): no files until you sign in — a live stage behind, the
     * mark, the round + with Sign in, the chromes as the pill (the dock on a desk). The stand-in stage is a slow gradient; fxr
     * passes its generator's canvas */
    signedOut: !signedIn,
    stage: <div className="h-full w-full" style={{ background: 'radial-gradient(60% 50% at 70% 40%, var(--kol-color-blue-400, #222d3d), transparent), radial-gradient(40% 40% at 25% 70%, var(--kol-color-orange-300, #c4622d), transparent)', opacity: 0.55 }} />,
    chromes: CHROMES.map((c) => ({ icon: c.icon, label: c.label, onPress: () => navigate(c.path) })),
    ...(quickLinks && { touch: { label: 'Select chrome', doors: CHROMES.map((c) => ({ icon: c.icon, label: c.label, onPress: () => navigate(c.path) })) } }),
  }

  /* the walkthrough as DATA (2026-10-24): a `cover` the Hub draws, and the Get started actions as `{ label, onClick }` —
   * the Hub draws the buttons and closes the walkthrough before each handler */
  const walkthrough = [
    { title: '1. Home', text: ['Your files, newest first. New starts a case; the cog on a file opens its name, tags and details.'], cover: cover(20) },
    { title: '2. Create', text: ['A catalog of parts beside the case. Insert a part, add a row, zoom the canvas.'], cover: cover(21) },
    { title: '3. Studio', text: ['The canvas, full-bleed. Space drags, ⌘ scroll zooms, G grids, L locks.'], cover: cover(22) },
    { title: 'Get started', actions: [{ label: 'New case', onClick: () => navigate('/create') }] },
  ]

  /* THE ONE CARD for everything the Library and Create list — a shipped patch, a part — with every field and icon; the
   * verbs write the shipped lists the way Home's write the saves. A click opens the item's page (3.2). */
  const setOf = (f) => (f.kind === 'part' ? setParts : setShipped)
  const edit = (f, patch) => setOf(f)((fs) => fs.map((x) => (x.id === f.id ? { ...x, ...patch } : x)))
  const shipCard = (f) => ({
    key: f.id, title: f.name, date: f.updatedAt, size: f.bytes, media: f.cover, back: f.back, images: f.images, tags: f.tags, details: f.details,
    onTags: (tags) => edit(f, { tags }),
    note: f.note, onNote: (note) => edit(f, { note }),
    /* the rail's picks and writes over the file's images (FileRailImages) */
    onCover: (src) => edit(f, { cover: src }),
    onBack: (src) => edit(f, { back: src }),
    onImages: (next) => edit(f, { images: next }),
    verbs: {
      rename: (name) => edit(f, { name, updatedAt: Date.now() }),
      duplicate: () => setOf(f)((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
      remove: () => setOf(f)((fs) => fs.filter((x) => x.id !== f.id)),
    },
    download: () => downloadBlob(new Blob([JSON.stringify({ ...f, cover: undefined }, null, 2)], { type: 'application/json' }), `${f.name}.json`),
    onClick: () => navigate(f.kind === 'part' ? `/library/part/${f.id}` : `/library/patch/${f.id}`),
  })

  /* THE DETAIL PAGE — StudioDetail, the reference the apps' module and patch pages are read against (3.1): ‹ Back as a
   * text link, the prose column, the preview, the actions as data */
  const detail = (() => {
    const m = /^\/library\/(patch|part)\/([^/]+)$/.exec(path)
    if (!m) return null
    const [, kind, id] = m
    const item = (kind === 'part' ? parts : shipped).find((x) => x.id === id)
    if (!item) return <StudioDetail notFound={{ title: kind === 'part' ? 'Part not found' : 'Patch not found', subtitle: id }} />
    return (
      <StudioDetail
        back={{ onClick: () => (window.history.length > 1 ? window.history.back() : navigate('/library')) }}
        title={item.name}
        subtitle={kind === 'part' ? `${item.hp}HP — ${item.u_label} — ${title(item.category)}` : `${item.details[0].value} modules, ${item.details[1].value} connections`}
        description={item.description}
        sections={[
          ...(kind === 'part' ? [{ label: 'Controls', rows: [{ kind: 'Knob', label: 'Rate', value: 'Oscillator frequency', hint: '0.1–20 Hz' }, { kind: 'Input', label: 'sync', value: 'Phase reset on rising edge', hint: 'scalar' }, { kind: 'Output', label: 'out', value: 'Value 0–100', hint: 'scalar' }] }] : []),
          { label: 'Specifications', rows: item.details.map((d) => ({ label: `${d.label}: ${d.value}` })) },
          ...(item.tags?.length ? [{ label: 'Tags', text: item.tags.join(', ') }] : []),
        ]}
        preview={{ src: typeof item.cover === 'string' ? item.cover : cover(0), alt: item.name, contain: kind === 'part' }}
        actions={kind === 'part' ? [{ label: 'Insert', onClick: () => { place(item); navigate('/create') } }] : [{ label: 'Load', onClick: () => navigate('/studio') }]}
      />
    )
  })()

  /* THE SIGN-IN PAGE's stand-in (`signIn.page`, 2026-10-29) — outside the Hub, as fxr's /signin sits; the reference accepts anyone */
  if (path === '/signin') {
    return (
      <div className="min-h-dvh flex flex-col items-start justify-center gap-6 p-16 bg-surface-primary">
        <span className="kol-eyebrow text-body">Sign in</span>
        <p className="kol-mono-12 text-meta">The app's own sign-in page, where every Sign in the Hub draws lands.</p>
        <div className="flex gap-2">
          <Button size="md" onClick={() => { setSignedIn(true); navigate('/') }}>Sign in</Button>
          <Button size="md" tone="grey" onClick={() => navigate('/')}>Back</Button>
        </div>
      </div>
    )
  }

  return (
    <AppStudio
      app={APP}
      currentPath={path}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      walkthrough={walkthrough}
      home={home}
      library={{
        children: detail ?? (
          <CatalogPage
            key={libView}
            preset="app"
            header={{ title: 'Library', subtitle: 'The patches the app ships with, and the parts a case is made from' }}
            items={libView === 'patches' ? shipped : parts}
            views={[{ value: 'patches', label: 'PATCHES' }, { value: 'parts', label: 'PARTS' }]}
            view={libView}
            onViewChange={setLibView}
            filtersTitle={libView === 'patches' ? 'All Patches' : 'All Parts'}
            filterGroups={libView === 'patches' ? [{ label: 'Tags', key: 'tags', values: TAGS }] : PART_GROUPS.map(({ exclusive: _x, ...g }) => g)}
            filtersProps={libView === 'patches' ? undefined : { mutuallyExclusiveFilters: ['category', 'u_label'] }}
            toCard={shipCard}
          />
        ),
      }}
      create={{
        shell: false,
        children: (
          <StudioCreate
            header={{ title: caseName, subtitle: caseDescription, onTitleChange: setCaseName, onSubtitleChange: setCaseDescription }}
            parts={parts}
            partGroups={PART_GROUPS}
            toCard={shipCard}
            onPlace={place}
            labels={{ parts: 'PARTS', partsTitle: 'All Parts', case: 'CASE', caseTitle: 'Case' }}
            caseCount={rows.reduce((n, r) => n + r.modules.length, 0)}
            showCase={showCase}
            view={canvasView}
            onViewChange={setCanvasView}
            caseControls={rowsOpen ? (
              <div className="flex items-start justify-between gap-6 pb-6">
                <div className="flex items-center gap-2">
                  <Button size="sm" tone="grey" onClick={() => addRow('1u')}>Add 1U row</Button>
                  <Button size="sm" tone="grey" onClick={() => addRow('3u')}>Add 3U row</Button>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {rows.map((r, i) => (
                    <Button key={r.id} size="sm" tone="grey" iconRight="trash" onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}>{`Row ${i + 1}, ${r.height.toUpperCase()}`}</Button>
                  ))}
                </div>
              </div>
            ) : null}
            caseActions={(
              <>
                <StudioCreateAction icon="row" label="Rows" pressed={rowsOpen} onClick={() => setRowsOpen((v) => !v)} />
                <StudioCreateAction icon="grid" label="Case preview" pressed={showCase} onClick={() => setShowCase((v) => !v)} />
              </>
            )}
            caseLink={{ label: 'Open in Studio', onClick: () => navigate('/studio') }}
          >
            <Case rows={rows} name={caseName} />
          </StudioCreate>
        ),
      }}
      use={{
        path: '/studio', label: 'Studio', icon: 'nav-rack',
        children: (
          <div className="flex h-dvh flex-col">
            <CanvasStudio className="flex-1" view={canvasView} onViewChange={setCanvasView} fit={phone}>
              <div style={{ padding: 48 }}><Case rows={rows} name={caseName} /></div>
            </CanvasStudio>
          </div>
        ),
      }}
      pages={[
        /* the Chrome section — the rail shape proposed for fxr (plan § 3.5), shown as a dummy for his ruling */
        withPage({ path: '/chrome', icon: 'desktop', label: 'Chrome', sub: CHROMES }, 'Chrome, the point of entry. Enter it for Editor, Labs, Randomiser and Morph.'),
      ]}
      /* the Hub's Dev row, on every rail on a dev server even with nothing in it (user 2026-10-24: "its not optional") */
      dev={{ tabs: [] }}
      media={{ client: fixtureClient }}
      signIn={{
        signedIn,
        /* an account (HubAccountRow, 2026-10-28): signed out the Hub asks email + password; signed in the row is the user and
         * opens the profile — the reference app has no profile page, so its stand-in signs out */
        user: { name: 'Tór' },
        /* the account is a tab in the settings rail (SettingsAccountTab, 2026-10-29): no `onProfile`, so the account row
         * opens Settings on Account — the reference app's rows, and Sign out in the tab's foot */
        account: {
          sections: [{ label: 'Profile', rows: [{ label: 'Name', value: 'Tór' }, { label: 'Library', value: 'Synced on this device' }] }],
          footer: { label: 'Sign out', onPress: () => setSignedIn(false) },
        },
        onPress: (creds) => setSignedIn(creds != null) /* the reference app accepts any email and password */,
        /* SIGN IN IS A PAGE (HubSignedOutGutterAndSeams, 2026-10-29): every Sign in the Hub draws — the rail's foot row, the
         * signed-out +, the phone's More — opens the app's own page instead of the dialog (fxr's /signin, frame C) */
        page: '/signin',
      }}
      /* THE ROWS ARE TYPED DATA (2026-10-24): the Hub draws every control in the rail's tone — no app writes a Dropdown */
      settings={{
        sections: [
          { label: 'Defaults', rows: [
            { label: 'Default aspect', type: 'choice', options: ['1:1', '4:5', '16:9'].map((v) => ({ value: v, label: v })), value: prefs.aspect, onChange: set('aspect') },
            { label: 'Show grid', type: 'switch', on: prefs.grid, onChange: set('grid') },
          ] },
          { label: 'Transport', rows: [
            { label: 'Autoplay', type: 'switch', on: prefs.autoplay, onChange: set('autoplay') },
          ] },
          /* the review's own switches — what the Hub can be, not what a studio app needs */
          { label: 'Review', rows: [
            { label: 'Settings page', type: 'switch', on: tier.page, onChange: (v) => setTier((t) => ({ page: v, filters: v && t.filters })) },
            { label: 'Filters', type: 'switch', on: tier.filters, disabled: !tier.page, disabledHint: 'Needs the settings page', onChange: (v) => setTier((t) => ({ ...t, filters: v })) },
            { label: 'Rail sections', type: 'choice', options: [{ value: 'enter', label: 'Enter' }, { value: 'fold', label: 'Fold' }], value: railSections, onChange: setRailSections },
            { label: 'Phone nav', type: 'choice', options: [{ value: 'bar', label: 'Bar' }, { value: 'pill', label: 'Pill' }, { value: 'drawer', label: 'Drawer' }], value: phoneNav, onChange: setPhoneNav },
            { label: 'Quick links on the phone', labelWidth: 200, type: 'switch', on: quickLinks, onChange: setQuickLinks },
          ] },
        ],
        tone: 'secondary',
        themeIn: 'drawer',
        drawer: { onReset: () => setPrefs(DEFAULTS) },
        page: tier.page,
        filters: tier.filters,
      }}
      /* the bar steps aside for the tools: the studio and the chromes take the full height on a phone (review 2, § 7.1) */
      shell={{ railSections, touch: phoneNav }}
    />
  )
}
