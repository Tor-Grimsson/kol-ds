import { Routes, Route, useLocation } from 'react-router-dom'
import { Brand, BrandGuide, A4Pages, PrintStudio } from '@kolkrabbi/kol-styleguide'
import { GUIDE_SECTIONS } from '@kolkrabbi/kol-brand-template'
import { SiteHero, PageHero, PageSection, CategoryPage, MarkdownPage } from '@kolkrabbi/kol-framework'
import { ContentCard, ContentCollection } from '@kolkrabbi/kol-component'
import { DocumentationReader } from '@kolkrabbi/kol-workshop'
import { buildInventory } from '@kolkrabbi/kol-markdown'
import { frontmatter } from '@kolkrabbi/kol-print'
import { ResumeTreatment } from '@kolkrabbi/kol-resume'
import { VOYAGER, VOYAGER_GUIDE } from 'voyager-fixture'
import BRIEF from 'voyager-fixture/documents/field-manual-brief.md?raw'
import { VoyagerResume } from '../../../showcase/src/lib/resumeFixture.jsx'
/* the chess apparatus inside its consumer's exact wrapper — the showcase's set, not its iframed preview */
import ChessApparatus from '../../../showcase/src/sets/chess-apparatus.jsx'
import { FRAMES } from '../../../showcase/src/nav/placements.js'
import { siteTree } from './nav.js'

/* A PAGE, AS ITS APPS USE IT — the package component on VOYAGER's fixture, never redrawn here. Most pages are the
 * showcase's own preview (showcase/src/previews/<Name>.jsx), loaded once and kept. A preview that is a SPECIMEN — a fixed
 * height, an iframe, a placeholder box, a demo prop (a Back link with no parent), another app's frame around it, a parser
 * probe for content — renders here as the apps render it instead (LayoutsAppPages, 2026-10-29). */
const previews = import.meta.glob('../../../showcase/src/previews/*.jsx')
const previewOf = (name) => previews[`../../../showcase/src/previews/${name}.jsx`]

const { brand, logoSources, business, assets } = VOYAGER
const INFO = business.BRAND_INFO
const Mark = ({ id = 'logomark' }) => <span className="inline-flex size-full items-center justify-center text-emphasis [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:w-auto" dangerouslySetInnerHTML={{ __html: logoSources[id] ?? '' }} />
const STUDIO = { studio: INFO.legal.entity, designer: INFO.identity.founder, address: `${INFO.studio.street}, ${INFO.studio.postcode}`, contacts: [INFO.contact.web, INFO.contact.email] }
const { fm: BRIEF_FM } = frontmatter(BRIEF)
const BRIEF_META = { project: BRIEF_FM.project, slug: 'field-manual', client: BRIEF_FM.client, dates: BRIEF_FM.dates }
const DOCS = buildInventory({ './field-manual-brief.md': BRIEF })
const SITE = FRAMES.find((f) => f.id === 'site')
const ROUTES = [
  ['Vatnajökull Traverse', 'Glacier', 'Six days across the ice cap, hut to hut, with a rope team of five.'],
  ['Westfjords Coast', 'Small boat', 'Fjord to fjord by small boat, landing where the road does not reach.'],
  ['Faroe Ridge Walk', 'Ridge', 'The islands’ spine in four days, with the sea on both sides.'],
]

const DIRECT = {
  /* the landing at full height, as site-hub's Home renders it */
  SiteHero: () => <SiteHero image={{ src: assets.MOOD[0]?.url }} mark={<Mark />} title={brand.meta.name} tagline={INFO.labels?.manifesto} />,
  /* the opening band of a page reached from the rail — no parent, so no Back (the preview's `backTo` is a demo prop) */
  PageHero: () => <PageHero label={INFO.legal.entity} title="Field Manual 2027" lede="Routes, drills and kit lists in three parts, each keyed to a colour a guide can find in a storm." mark={<span className="block size-24"><Mark /></span>} />,
  /* a section filled as a page fills it, not a dashed placeholder box */
  PageSection: () => (
    <PageSection label="02 — Routes" title="This season’s routes" body="Three of the twelve routes the manual covers, each with its terrain and how long it runs.">
      <ContentCollection min="260px">
        {ROUTES.map(([title, eyebrow, body], i) => <ContentCard key={title} variant="article" ratio="16 / 9" media={<img src={assets.MOOD[(i + 1) % assets.MOOD.length]?.url} alt="" className="size-full object-cover" />} eyebrow={eyebrow} title={title} body={body} />)}
      </ContentCollection>
    </PageSection>
  ),
  /* the Documents foldernote's own overview — read from the site rail's tree, as site-hub's Research is */
  CategoryPage: () => <CategoryPage navTree={siteTree(SITE)} id="documents" />,
  /* the whole document, scrolling its full length, its TOC published to the frame's rail */
  MarkdownPage: () => <MarkdownPage source={BRIEF} numbered linkNotes />,
  /* one sheet in view at a time, centred, paged (QuickLookFrame's nav) */
  A4Pages: () => (
    <div data-theme="light" className="flex justify-center py-10 px-4">
      <A4Pages label={BRIEF_FM.title} paged><MarkdownPage source={BRIEF} numbered linkNotes toc={false} /></A4Pages>
    </div>
  ),
  /* the print tool filling its frame, as apps/print runs it, on a real Voyager document */
  PrintStudio: () => <div className="h-dvh min-h-0"><PrintStudio studio={STUDIO} meta={BRIEF_META} markdown={BRIEF} /></div>,
  /* brand-hub's preview mounts the whole app, its own SiteLayout around it — here the tool alone, book ⇄ assets */
  Brand: () => <Brand brand={brand} logoSources={logoSources} />,
  BrandGuide: () => <BrandGuide brand={VOYAGER_GUIDE} sections={GUIDE_SECTIONS} logoSources={logoSources} />,
  ChessAnalysisLayout: ChessApparatus,
  /* the reader on Voyager's brief, its TOC in the frame's right rail */
  DocumentationReader: () => <DocumentationReader inventory={DOCS} modules={{ './field-manual-brief.md': BRIEF }} docId={DOCS[0]?.id} showFrontmatter docHref={(id) => `#${id}`} routes={{ docsIndex: '#', components: '#' }} />,
  /* a treatment by its route — the Rail treatment, at the route the kit reads (`resume/t/:slug`, under this page's URL) */
  ResumeTreatment: function Treatment() {
    const { pathname } = useLocation()
    return (
      <VoyagerResume>
        <Routes location={{ pathname: `${pathname.replace(/\/$/, '')}/resume/t/rail`, search: '', hash: '', state: null, key: 'layouts' }}>
          <Route path="resume/t/:slug" element={<ResumeTreatment />} />
        </Routes>
      </VoyagerResume>
    )
  },
}

/* pages that only run against a document an app owns — said plainly, with where they run */
const ELSEWHERE = {
  DeckEditor: 'The deck editor opens inside Decks, on a deck — open Decks in this layout and pick one. It runs in apps/presentation.',
  FontViewerSection: 'The variable-font viewer needs a font and the deferred font-viewer engine; it has no specimen yet. It runs on kolkrabbi.io/foundry.',
}

/* LOADING — a page's module loads once and is kept; `peek` answers synchronously when it already has, so a page that has
   loaded never flashes, and the app keeps the previous page on screen until the next one is ready */
const cache = {}
const pending = {}
export function peekPage(name) {
  if (cache[name]) return cache[name]
  if (DIRECT[name]) return (cache[name] = { Component: DIRECT[name] })
  if (!previewOf(name)) return (cache[name] = { note: ELSEWHERE[name] ?? `${name} has no specimen yet.` })
  return null
}
export function loadPage(name) {
  const hit = peekPage(name)
  if (hit) return Promise.resolve(hit)
  return (pending[name] ??= previewOf(name)().then((m) => (cache[name] = { Component: m.default })))
}
