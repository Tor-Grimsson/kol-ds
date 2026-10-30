import { brandToc } from '@kolkrabbi/kol-styleguide'
import { VOYAGER } from 'voyager-fixture'
import { FRAMES } from '../../../showcase/src/nav/placements.js'

/* EACH LAYOUT'S NAV, AS ITS APPS USE IT (LayoutsAppPages, 2026-10-29 — user: *"no pages use section headings? or sub pages
 * to sections"*). The groups are placements.js's; how they show is each frame's: the site rail's categories, a foldernote
 * with its CategoryPage overview, group labels and section rows (`/page#section`, lit by scroll); the app rail's section
 * rows; the shell's spaces and sidebar tree; the website's takeover links. */

export const frameOf = (id) => FRAMES.find((x) => x.id === id)
export const first = (f) => `/${f.id}/${f.pages[0]}`
export const groupOf = (f, page) => f.groups.find((g) => g.pages.includes(page))

/* every page by its own glyph — a rail of identical glyphs reads as nothing */
export const PAGE_ICON = {
  HubHome: 'home-01', HubSettings: 'settings-01', HubDev: 'code', StudioCreate: 'nav-create', StudioDetail: 'info',
  CatalogPage: 'grid', SettingsScaffold: 'slider-01', EditorShell: 'edit', MediaLibrary: 'image', Decks: 'desktop',
  Notes: 'journal', DeckEditor: 'layers', PrintStudio: 'file', MetricsDashboard: 'stat-chart-a', ChessAnalysisLayout: 'chess-rook',
  ResumeLibrary: 'library', ResumeSource: 'database', ResumeTreatment: 'columns', KitPreview: 'layout',
  SiteHero: 'home-02', CategoryPage: 'folder', PageHero: 'maximize', SectionText: 'type', PageSection: 'rows', Brand: 'book-open',
  BrandGuide: 'roadmap', MarkdownPage: 'file', DocumentIndex: 'view-list', A4Pages: 'copy', DocumentationReader: 'book-open',
  SearchPage: 'search', ExhibitOverview: 'grid-3x3', ExhibitPage: 'target', StackHero: 'journal', ArticleHeader: 'type-02',
  StickyNavCard: 'pushpin', ContentCollection: 'grid', FeaturedCarousel: 'video', FeatureSplit: 'columns', NewsletterBand: 'email-01',
  CtaGlobal: 'arrow-upright', ProductDetailLayout: 'tablet', PrintsGrid: 'image', TypefaceSpecimenPage: 'font-01',
  FontViewerSection: 'aa', FoundryOpentypeFeatures: 'italic-a', FoundryTypefaceDetails: 'info', FoundryTypefacePairing: 'type',
  TimeSet: 'stopwatch',
}
export const GROUP_ICON = {
  home: 'home-02', brand: 'book-open', pages: 'rows', documents: 'folder', resume: 'library', tools: 'grid', hub: 'home-01',
  studio: 'nav-create', media: 'image', docs: 'book-open', exhibit: 'target', stack: 'journal', prints: 'image', foundry: 'font-01',
}

/* the brand book's chapters as the rail's section rows, grouped as the book groups them (site-hub's) */
const BRAND_GROUPS = [
  { label: 'Brand overview', ids: ['about', 'key-messages', 'voice', 'look'] },
  { label: 'Logos', ids: ['logos-concept', 'logos-types'] },
  { label: 'Foundations', ids: ['color', 'typography'] },
]
const chapters = (path) => {
  const rows = brandToc(VOYAGER.brand, 'brand').map((c) => ({ to: `${path}#${c.id}`, label: c.label }))
  const byId = Object.fromEntries(rows.map((r) => [r.to.split('#')[1], r]))
  const used = new Set()
  const groups = BRAND_GROUPS.map((g) => ({ label: g.label, children: g.ids.filter((id) => byId[id]).map((id) => { used.add(id); return byId[id] }) })).filter((g) => g.children.length)
  const left = rows.filter((r) => !used.has(r.to.split('#')[1]))
  return left.length ? [...groups, { label: 'More', children: left }] : groups
}

/* the cards a foldernote's overview (CategoryPage) shows for its pages */
const CARDS = {
  MarkdownPage: { eyebrow: 'Document', body: 'A markdown file as a page: Voyager’s Field Manual brief, with its table and notes.' },
  DocumentIndex: { eyebrow: 'Index', body: 'A folder of documents as contents cards.' },
  A4Pages: { eyebrow: 'Print', body: 'The same brief on A4 sheets, one in view at a time.' },
}
const MOOD = VOYAGER.assets.MOOD

/* SiteLayout's tree: Home a link, Brand a foldernote with its chapters as section rows under group labels, Documents a
   foldernote whose overview is CategoryPage, the rest categories of pages */
export function siteTree(f) {
  return f.groups.map((g) => {
    const page = (p) => `/${f.id}/${p}`
    if (g.id === 'home') return { id: g.id, label: g.label, icon: GROUP_ICON.home, to: page(g.pages[0]) }
    if (g.id === 'brand') return { id: g.id, label: g.label, icon: GROUP_ICON.brand, to: page('Brand'), pages: [...chapters(page('Brand')), { label: 'Guide', children: [{ to: page('BrandGuide'), label: 'Brand guide' }] }] }
    if (g.id === 'documents') return {
      id: g.id, label: g.label, icon: GROUP_ICON.documents, to: page('CategoryPage'),
      lede: 'Voyager’s documents, three ways: a page, an index, A4 sheets.',
      pages: g.pages.filter((p) => p !== 'CategoryPage').map((p, i) => ({ to: page(p), label: p, card: { ...CARDS[p], media: MOOD[(i + 1) % MOOD.length]?.url } })),
    }
    return { id: g.id, label: g.label, icon: GROUP_ICON[g.id] ?? 'folder', pages: g.pages.map((p) => ({ to: page(p), label: p })) }
  })
}

/* AppShell's rail: a section row per group, its pages under it */
export const appItems = (f) => f.groups.map((g) => ({ icon: GROUP_ICON[g.id] ?? 'folder', path: `#${g.id}`, label: g.label, sub: g.pages.map((p) => ({ icon: PAGE_ICON[p] ?? 'file', path: `/${f.id}/${p}`, label: p })) }))

/* ShellLayout: the groups are its spaces (the header's tabs), a group's pages its sidebar */
export const shellRoutes = (f) => f.groups.map((g) => ({ id: g.id, label: g.label, path: `/${f.id}/~${g.id}`, children: g.pages.map((p) => ({ id: p, label: p, path: `/${f.id}/${p}` })) }))
