import { useParams, Navigate, Link } from 'react-router-dom'
import LandingWall from '../lib/LandingWall.jsx'
import { Table } from '@kolkrabbi/kol-component'
import HomeDoc from '../lib/HomeDoc.jsx'
import { DocSection } from '@kolkrabbi/kol-workshop'
import CompositionDiagram from '../lib/CompositionDiagram.jsx'

/**
 * Apps — the door to the apps tier (docs/operations/07-apps-tier), GROUPED BY LAYER (apps review
 * 2026-09-29 — the user: *"instead of just an incoherent dump of all apps without a single tier
 * indicator"*). The layer table is the app anatomy's (docs/documentation/04-compositions/
 * 16-app-anatomy.md); every app has a home at `/app/<name>` with its spec — never `/apps/<name>/`,
 * which is the app itself (its own Vite build in this site's output, a full page load).
 */

export const LAYERS = [
  { id: 'engine', label: 'Engine', what: 'Plain JS, no UI — parse, index, rank. Its app is a lab: input in, what the engine reads out.', lives: 'kol-markdown · kol-search' },
  { id: 'shell', label: 'Shell', what: 'The frame — the rail, the layout root, the nav keys, the phone bar.', lives: 'kol-shell AppShell + NavRail · kol-workshop ShellLayout' },
  { id: 'hub', label: 'Hub', what: 'The standard pages around the work — Home, Settings, the shortcuts sheet, the walkthrough. Opt-in, page by page. The Studio is the Hub plus the workstation pages — Library · Create · Use.', lives: 'kol-shell AppHub · AppStudio' },
  { id: 'catalog', label: 'Catalog', what: 'The ContentFilters page — masthead, filter + search, views, LIST · GRID, the cards.', lives: 'kol-shell CatalogPage' },
  { id: 'tool', label: 'Tool', what: 'The work itself. <tool> is the tool alone; <tool>-hub is Shell + Hub + the same tool.', lives: 'each tool’s own package' },
  { id: 'fixture', label: 'Fixture', what: 'Fake, mutable data and the wiring hooks the apps share — no page of their own; apps/fixtures shows every one as data.', lives: 'apps/media-fixture · apps/workshop-fixture · apps/voyager-fixture · apps/fixtures' },
]

const PWA = 'a web manifest with display: standalone + the Apple meta tags (public/apps/<name>.webmanifest)'

/* layers = what the app is built from; packages = the KOL packages it takes; optIns = the
 * features it turns on; consumer = what a repo sets to ship the same thing */
export const APPS = [
  { name: 'markdown', layer: 'engine', port: 5184, what: 'The markdown engine alone — a doc beside what kol-markdown reads from it: rendered, frontmatter, structure, tags, inventory.',
    layers: ['Engine'], packages: ['kol-markdown', 'kol-workshop'], optIns: ['fixture: workshop-fixture'], consumer: 'Depend on @kolkrabbi/kol-markdown; it is plain ESM — no Vite, no React needed.' },
  { name: 'search', layer: 'engine', port: 5185, run: 'search-app', what: 'Everything search — the ⌘K search modal, the results page with reasons and facets, / focus, and the tag graph.',
    layers: ['Engine', 'Tool frame'], packages: ['kol-search', 'kol-component (ShellSearchOverlay)', 'kol-workshop (TagGraph)'], optIns: ['search engine', 'tag system', 'node graph', 'fixture: workshop-fixture'], consumer: 'Depend on @kolkrabbi/kol-search; index your items with createIndex, query with search, graph with tagGraph.' },
  { name: 'shell', layer: 'shell', port: 5186, what: 'The Shell alone — the rail, the layout root, the nav keys and the phone bar, around ten placeholder pages.',
    layers: ['Shell'], packages: ['kol-shell'], optIns: ['phone bar (touch="bar")', 'nav keys'], consumer: 'AppShell with items + bottomItems; touch="bar" for the phone bar, masthead for the app’s one header voice.' },
  { name: 'workshop', layer: 'shell', port: 5183, what: 'The workshop shell alone — header, rails, search modal, tag browser and reader over an invented corpus.',
    layers: ['Shell (the docs shell)'], packages: ['kol-workshop', 'kol-markdown', 'kol-search'], optIns: ['search engine', 'tag system', 'fixture: workshop-fixture'], consumer: 'kol-workshop ShellLayout; content is injected, the package never globs docs itself.' },
  { name: 'hub', layer: 'hub', port: 5176, what: 'The Hub alone, around a placeholder tool — Home, Settings, the shortcuts sheet and the walkthrough.',
    layers: ['Shell', 'Hub', 'Catalog (Home)'], packages: ['kol-shell'], optIns: ['home', 'settings', 'walkthrough', 'phone bar'], consumer: 'AppHub with app, items, and whichever of home / settings the app has — both are opt-in.' },
  { name: 'studio', layer: 'hub', port: 5190, what: 'The Studio alone, around placeholder pages — the workstation fxr · mirror · monitor each hand-build: Home · Library · Create · Use · Stage · Settings.',
    layers: ['Shell', 'Hub', 'Catalog (Home, Library)'], packages: ['kol-shell'], optIns: ['home', 'library', 'create', 'use', 'pages', 'settings', 'walkthrough', 'phone bar'],
    consumer: 'AppStudio with app, home, and the slots the app has — library · create · use · pages · settings; each renames with { path, label, icon }. Mono unless masthead="display".',
    routes: [
      { path: '#/', what: 'Home — RECENT · SAVED, New patch, Walkthrough (HubHome)' },
      { path: '#/library', what: 'Library — the patches and the modules (CatalogPage)' },
      { path: '#/create', what: 'Create — a PageHeader over the composer' },
      { path: '#/use', what: 'Use — the tool, full-bleed, no wash' },
      { path: '#/stage', what: 'Stage — an opt-in page (monitor’s)' },
      { path: '#/settings', what: 'Settings (HubSettings)' },
    ] },
  { name: 'catalog', layer: 'catalog', port: 5189, what: 'The Catalog alone — the ContentFilters page on the kol-search engine, with the masthead option.',
    layers: ['Catalog'], packages: ['kol-shell', 'kol-component', 'kol-search'], optIns: ['search engine', 'masthead: display | mono'], consumer: 'CatalogPage with items + toCard; outside a Shell pass header.masthead.' },
  { name: 'media', layer: 'tool', port: 5173, what: 'The media tool alone — the column browser, rows and grid over the fixture bucket.',
    layers: ['Tool'], packages: ['kol-component (MediaLibrary)', 'kol-media-client', 'kol-search'], optIns: ['search engine', 'PWA', 'fixture: media-fixture'], consumer: `A client over your bucket (kol-media-client); for home-screen install, ${PWA}.` },
  { name: 'media-hub', layer: 'tool', port: 5175, what: 'Media as it ships — Shell + Hub + the media tool. One settings place; the phone bar.',
    layers: ['Shell', 'Hub (Settings)', 'Tool'], packages: ['kol-shell', 'kol-component', 'kol-media-client', 'kol-search'], optIns: ['search engine', 'settings', 'phone bar', 'PWA', 'fixture: media-fixture'], consumer: `AppHub around MediaLibrary with onOpenSettings → your settings route; ${PWA}.` },
  { name: 'notes', layer: 'tool', port: 5177, what: 'The notes tool alone — opens on a blank note; the list is #list.',
    layers: ['Tool'], packages: ['kol-notes', 'kol-markdown'], optIns: ['PWA', 'fixture: media-fixture'], consumer: `Notes with a client (listNotes · loadNote · saveNote · deleteNote) and open={NEW_NOTE} to land blank; ${PWA}.` },
  { name: 'notes-hub', layer: 'tool', port: 5187, what: 'Notes on the Hub — Write (a blank note) and Notes (the list) on one rail.',
    layers: ['Shell', 'Hub', 'Tool'], packages: ['kol-shell', 'kol-notes'], optIns: ['phone bar', 'PWA', 'fixture: media-fixture'], consumer: `AppHub around Notes; ${PWA}.` },
  { name: 'presentation', layer: 'tool', port: 5178, what: 'The deck tool alone — opens on a blank deck in the editor; the shelf is #list.',
    layers: ['Tool'], packages: ['kol-deck'], optIns: ['PWA', 'fixture: media-fixture'], consumer: `Decks with a client (listDecks · loadDeck · saveDeck · deleteDeck), layouts, and open={NEW_DECK} to land blank; ${PWA}.` },
  { name: 'presentation-hub', layer: 'tool', port: 5188, what: 'Presentation on the Hub — Edit (a blank deck) and Decks (the shelf) on one rail.',
    layers: ['Shell', 'Hub', 'Tool'], packages: ['kol-shell', 'kol-deck'], optIns: ['phone bar', 'PWA', 'fixture: media-fixture'], consumer: `AppHub around Decks; ${PWA}.` },
  { name: 'brand', layer: 'tool', port: 5179, what: 'The brand catalogue — every building block a brand is made of, one page each, on VOYAGER, in kol-framework’s brand-book frame.',
    layers: ['Shell (PageLayout, the brand-book frame)', 'Tool (the brand blocks)'], packages: ['kol-styleguide', 'kol-framework (PageLayout)'], optIns: ['PWA', 'fixture: voyager-fixture'],
    consumer: `PageLayout with a navTree, and the kol-styleguide blocks over your manifest — Swatch · ColorAnatomy · ComboLab · TypeBlock · LogoCard · LogoScaling · the stationery mocks · AssetTable · MoodTile; ${PWA}.`,
    routes: [
      { path: '/colour/ramps · swatches · anchors · combinations', what: 'Swatch per stop, the anchors large, ColorAnatomy per role, ComboLab' },
      { path: '/type/families · scale', what: 'TypeBlock per family (Playfair included), the scale' },
      { path: '/logo/displays · clearspace · scaling', what: 'LogoCard per mark, the construction diagrams, LogoScaling' },
      { path: '/stationery/business-card · set', what: 'BusinessCardFront/Back, Envelope · Letterhead · EmailSignature, the carried files' },
      { path: '/assets/downloads · imagery · business', what: 'AssetTable per file group, mood and graphics, the business-data tables' },
    ] },
  { name: 'brand-hub', layer: 'tool', port: 5193, what: 'A client’s home on VOYAGER — the brand book and its assets (kol-styleguide’s Brand), with notes · decks · media as opt-in tools and the editor as an opt-in app.',
    layers: ['Shell', 'Hub (Settings)', 'Tool (Brand)', 'Tools (opt-in)'], packages: ['kol-shell', 'kol-styleguide', 'kol-notes', 'kol-deck', 'kol-component (MediaLibrary)'], optIns: ['notes', 'decks', 'media', 'editor (app)', 'settings', 'phone bar', 'fixture: voyager-fixture', 'fixture: media-fixture'],
    consumer: 'AppHub around Brand over your manifest; each tool a rail row the client turns on in Settings. What a brand.<domain> site is made of.',
    routes: [
      { path: '#/ · #/assets', what: 'The book and the assets (Brand)' },
      { path: '#/notes · #/decks · #/media', what: 'The opt-in tools, on the fixture bucket' },
      { path: '#/editor', what: 'The editor — an app of its own, opened beside' },
      { path: '#/settings', what: 'Which opt-ins this client has' },
    ] },
  { name: 'panels', layer: 'tool', port: 5191, what: 'Parameter panels alone — the editor’s own AutoControls over its own schemas: categories → sub-categories → a panel, its tabs, sections, labeled controls and modulation dots, as the rail and as the inspector.',
    layers: ['Shell', 'Tool (the panel layer of design-editor)'], packages: ['design-editor (source)', 'kol-shell', 'kol-component'], optIns: ['phone drawer'],
    consumer: 'Nothing to install — the panels are design-editor internals; this app is where their layout is iterated before labs, the generator, the inspector and the drawer see it.',
    routes: [
      { path: '#/effects/<category>', what: 'The effect catalogue — every filter’s params (FILTERS through flatCategories)' },
      { path: '#/generators/<entry>', what: 'The generative tree — every preset on its loop’s schema' },
      { path: '#/inspector/<type>', what: 'The compositor’s layer schemas — photo · shape · text · pattern' },
    ] },
  { name: 'editor', layer: 'tool', port: 5180, what: 'The design editor alone — every chrome the package exports, on one rail, over the fixture bucket and the fake D1.',
    layers: ['Shell', 'Tool'], packages: ['design-editor', 'kol-shell'], optIns: ['phone drawer (touch="drawer")', 'fixture: media-fixture'],
    consumer: 'The one built package — install @kolkrabbi/design-editor; mount <DesignEditor /> for the editor, or route to LabsView · MobileView · OutputView after setMediaClient / setSettingsStore.',
    routes: [
      { path: '/', what: 'The editor — the compositor (DesignEditor)' },
      { path: '/labs', what: 'Labs — one source under a params rail; its categories ride the app rail (LabsView)' },
      { path: '/randomiser', what: 'The randomiser — two tools: Generator, and Effects (the input media first, kept while you browse effects) (MobileView)' },
      { path: '/core', what: 'The editor with no layer packs — what @kolkrabbi/design-editor/core gives a consumer (a full load)' },
      { path: '/output', what: 'The chromeless output window, no rail (OutputView)' },
    ] },
  { name: 'controls', layer: 'tool', port: 5181, what: 'The controls reference — the parametric set, the app controls and the panels built from them.',
    layers: ['Tool frame (a reference page)'], packages: ['kol-hardware', 'kol-component'], optIns: [], consumer: 'kol-hardware for instrument panels; kol-component for app controls.' },
  { name: 'curves', layer: 'tool', port: 5182, what: 'The envelope generator alone — a value over time as an equation or an ADSR envelope, on one signal engine.',
    layers: ['Tool'], packages: ['kol-hardware (./signal)'], optIns: ['PWA'], consumer: `kol-hardware’s EnvelopeGenerator over ./signal; ${PWA}.` },
  { name: 'rack', layer: 'tool', port: 5194, what: 'The rack test bed — a case with a 3U and a 1U row, modules with headers, labeled controls in both heights, and the touch hold that opens ParamSheet.',
    layers: ['Tool'], packages: ['kol-hardware', 'kol-component (Knob · Slider · LabeledControl)'], optIns: [], consumer: 'RackCase · RackRow · RackSlot around ModuleFrame; routing, the registry and audio stay in your repo. Pass onHold to open your own sheet.' },
  { name: 'mixer', layer: 'tool', port: 5195, what: 'The mixer test bed — a row of channel strips with their knobs and sliders, and the same touch hold.',
    layers: ['Tool'], packages: ['kol-hardware', 'kol-component (Knob · Slider · LabeledControl)'], optIns: [], consumer: 'ChannelStrip with your controls in its slots; what they do stays in your repo. Pass onHold to open your own sheet.' },
  { name: 'media-fixture', layer: 'fixture', what: 'The fake bucket, the fake D1 (notes, decks, settings) and the wiring hooks every media, notes, deck and brand app shares.',
    layers: ['Fixture'], packages: ['kol-media-client', 'kol-component', 'kol-deck'], optIns: [], consumer: 'Nothing — it stands in for the repo’s own client. Its verbs are the contract the real client meets.' },
  { name: 'workshop-fixture', layer: 'fixture', what: 'An invented corpus — spaces, a component tree, vault docs with frontmatter and tags — for the workshop, markdown and search apps.',
    layers: ['Fixture'], packages: ['kol-markdown', 'kol-search'], optIns: [], consumer: 'Nothing — it stands in for the repo’s own content.' },
  { name: 'voyager-fixture', layer: 'fixture', what: 'VOYAGER, the fake client — marks, stationery, deck, diagrams, graphics, mood and Playfair carried from the client template; a brand manifest in kol-brand’s shape; invented business data in the client sites’ shape.',
    layers: ['Fixture'], packages: ['(none — data and files)'], optIns: [], consumer: 'Nothing — it stands in for a client’s own brand package: the manifest is what kol-styleguide’s Brand renders, the business data is what a client site hand-carries today.' },
  { name: 'fixtures', layer: 'fixture', port: 5192, what: 'Every fixture on one page — media · workshop · voyager behind one dropdown, what each holds shown as data.',
    layers: ['Fixture (a lab)'], packages: ['kol-component', 'kol-shell'], optIns: ['fixture: media-fixture', 'fixture: workshop-fixture', 'fixture: voyager-fixture'],
    consumer: 'Nothing — it is where you check what an app will be handed before you open the app.',
    routes: [
      { path: '#media/buckets · files · library', what: 'The buckets, a bucket’s files, the notes and decks' },
      { path: '#workshop/docs · components · spaces', what: 'The corpus, the component catalogue, the spaces' },
      { path: '#voyager/files · brand · business', what: 'The carried files, the manifest (meta, ramps, logos, type), the business tables' },
    ] },
]

const layerOf = (id) => LAYERS.find((l) => l.id === id)

const appColumns = [
  { accessor: 'name', header: 'App', render: (r) => <a id={r.name} href={`/app/${r.name}`} className="kol-link underline scroll-mt-20">{r.name}</a> },
  { accessor: 'what', header: 'What it is', className: 'kol-table-cell-meta-strong' },
  { accessor: 'run', header: 'Local', render: (r) => (r.port ? <code>pnpm {r.run ?? r.name}</code> : '—') },
]

/* EVERY APP, FIRST (the showcase review W21, 2026-09-30 — user: "apps: show a table first"): one
 * table of all of them with their layer, before the diagram explains the layers */
const allColumns = [
  { accessor: 'name', header: 'App', render: (r) => <a href={`/app/${r.name}`} className="kol-link underline">{r.name}</a> },
  { accessor: 'layer', header: 'Layer', render: (r) => <Link to={layerHref(r.layer)} className="kol-link underline">{layerOf(r.layer).label}</Link> },
  appColumns[1],
  appColumns[2],
]

/* THE NESTING, drawn (2026-09-30, open questions Round 1 Q5): each box opens its layer's page. */
const layerHref = (id) => `/apps/layer/${id}`
const NESTING = {
  label: 'An app',
  children: [
    { label: 'Hub — Home · Settings · the S sheet · walkthrough (the Studio adds Library · Create · Use)', to: layerHref('hub'), children: [
      { label: 'Shell — rail · layout root · nav keys · phone bar', to: layerHref('shell'), row: true, children: [
        { label: 'Catalog — masthead · filter · views · cards', to: layerHref('catalog') },
        { label: 'Tool — the work itself', to: layerHref('tool') },
      ] },
    ] },
    { label: 'Underneath', row: true, children: [
      { label: 'Engine — plain JS', to: layerHref('engine') },
      { label: 'Fixture — fake data', to: layerHref('fixture') },
    ] },
  ],
}

function LayerApps({ id }) {
  return (
    <Table
      width="column"
      className="mt-4"
      caption={layerOf(id).label}
      columns={appColumns}
      rows={APPS.filter((a) => a.layer === id).map((a) => ({ ...a, id: a.name }))}
    />
  )
}

/* a layer's home — its markdown page, then its apps */
export function AppLayer() {
  const { layer } = useParams()
  if (!LAYERS.some((l) => l.id === layer)) return <Navigate to="/apps" replace />
  return (
    <>
      <HomeDoc key={layer} id={`layer-${layer}`} />
      <div className="mt-10"><DocSection id="apps" title="Apps"><LayerApps id={layer} /></DocSection></div>
    </>
  )
}

export default function Apps() {
  return (
    <>
      <HomeDoc id="apps" />
      <div className="mt-10">
        <DocSection id="all-apps" title="All apps">
          <Table width="column" columns={allColumns} rows={APPS.map((a) => ({ ...a, id: a.name }))} />
        </DocSection>
      </div>
      {/* THE WALL (2026-10-01): every app as a card, the landing's format — after the table, which stays first */}
      <div className="mt-12">
        <DocSection id="wall" title="Every app">
          <LandingWall items={APPS.map((a) => ({ key: a.name, label: `${a.name} · ${layerOf(a.layer).label}`, to: `/app/${a.name}`, node: (
            <div className="flex flex-col gap-3">
              <p className="kol-doc-body text-body">{a.what}</p>
              <p className="kol-helper-10 text-meta">{a.packages.join(' · ')}</p>
            </div>
          ) }))} />
        </DocSection>
      </div>
      <CompositionDiagram className="mt-12" node={NESTING} />
      {LAYERS.map((l) => (
        <section key={l.id} className="mt-12">
          <h2 id={`layer-${l.id}`} className="kol-doc-eyebrow scroll-mt-20">{l.label}</h2>
          <LayerApps id={l.id} />
        </section>
      ))}
    </>
  )
}
