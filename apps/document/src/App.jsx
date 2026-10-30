import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { SiteLayout, MarkdownPage, LinkPreview, documentLibrary } from '@kolkrabbi/kol-framework'
import { AppShell } from '@kolkrabbi/kol-shell'
import { MenuItem, TabsRow } from '@kolkrabbi/kol-component'
import { TABS, CLIENT, LINK_CARDS, tabPath, docSource, REVIEW_MODULES, assetUrl, cardImage } from 'document-fixture'
import { parseDocsMarkdown, splitFrontmatter } from '@kolkrabbi/kol-markdown'
import { DocumentIndex, DocumentLibrary, DocumentView } from '@kolkrabbi/kol-styleguide'
import { LIBRARY_MODULES, LIBRARY_FILES, LIBRARY_ROOT } from 'voyager-fixture/library'

/* THE DOCUMENT SPACE (plan-2026-10-28-document W3) — kol-atlas's documents as pages. THE LAYOUT (user 2026-10-28, on
 * review): the site rail on the left, kol-atlas's tabs header on top of the page (the client's name, a tabs row with the
 * groups as menus at its right end), the sheet under it — and NO right rail. A switch shows the same pages in AppShell.
 * Nothing on screen is drawn here but the trees: the frame, the tabs, the menus, the page and the cards are the
 * packages' (MarkdownPage is born in this app and moves to kol-framework after his review).
 *
 * Routes are the browser's:  /  → /project · /<tab id> · /assets · /reference (the folders, their document over their pages) ·
 * /reviews · /reviews/<folder>/<name> */

const RAIL_KEY = 'document:rail'
const loadRail = () => { try { return localStorage.getItem(RAIL_KEY) === 'app' ? 'app' : 'site' } catch { return 'site' } }

/* ── the corpus as rows ── */
const byId = Object.fromEntries(TABS.map((t) => [t.id, t]))
const byFile = Object.fromEntries(TABS.map((t) => [t.file.replace(/\.md$/, ''), t]))
const top = TABS.filter((t) => !t.group && !t.parent)                 // Overview · Project · Plan
const single = TABS.filter((t) => t.group && !t.folder && !TABS.some((f) => f.folder && f.group === t.group))  // Quote
const folders = TABS.filter((t) => t.folder)                           // Assets · Reference
const inGroup = (g) => TABS.filter((t) => t.group === g && !t.folder)
const children = (id) => TABS.filter((t) => t.parent === id)

const REVIEW_FOLDERS = [['reviews', 'Brands'], ['branding/reviews', 'Branding'], ['guides/reviews', 'Guides']]
const reviewName = (p) => p.replace(/^\.\/research\//, '').replace(/\.md$/, '')
const reviews = Object.keys(REVIEW_MODULES).sort().map((p) => { const name = reviewName(p); const folder = name.slice(0, name.lastIndexOf('/')); return { name, folder, slug: name.slice(name.lastIndexOf('/') + 1), to: `/reviews/${name}` } })

/* THE LIBRARY (DocumentLibraryAndBoardParts, kol-website 2026-10-29): VOYAGER's press, letters and poster beside their
 * originals, read by kol-framework's documentLibrary and drawn by kol-styleguide's DocumentLibrary — the table per
 * folder, Quick Look on the originals, the markdown download. /library · /library/<folder> · /library/<folder>/<file> */
const LIBRARY = documentLibrary(LIBRARY_MODULES, { base: 'library', root: LIBRARY_ROOT, files: LIBRARY_FILES })

const ICON = { overview: 'file', project: 'library', plan: 'grid', quote: 'download', assets: 'folder', reference: 'bookmark' }
const row = (t) => ({ to: tabPath(t), label: t.title })
/* a page with entries is a group in the rail: the page first, its entries under it */
const withEntries = (t) => (children(t.id).length ? { label: t.title, children: [row(t), ...children(t.id).map(row)] } : row(t))

const NAV = [
  ...top.map((t) => ({ id: t.id, label: t.title, icon: ICON[t.id] ?? 'file', to: tabPath(t) })),
  ...single.map((t) => ({ id: t.id, label: t.title, icon: ICON[t.id] ?? 'file', to: tabPath(t) })),
  ...folders.map((f) => ({ id: f.group.toLowerCase(), label: f.group, icon: ICON[f.group.toLowerCase()] ?? 'folder', to: tabPath(f), pages: inGroup(f.group).map(withEntries) })),
  { id: 'library', label: 'Library', icon: 'folder', to: '/library', pages: LIBRARY.pages },
  { id: 'reviews', label: 'Reviews', icon: 'book-open', to: '/reviews', pages: REVIEW_FOLDERS.map(([folder, label]) => ({ label, children: reviews.filter((r) => r.folder === folder).map((r) => ({ to: r.to, label: r.slug })) })) },
]
/* the app rail is flat: one row per top-level thing */
const APP_ITEMS = NAV.map((n) => ({ icon: n.icon, path: n.to, label: n.label }))

/* ── links inside a document: kol-atlas's `#page`, `#page--section`, `.md` files; the rest as written ── */
const resolveLink = (url) => {
  if (/^https?:|^mailto:/.test(url)) return url
  if (url.startsWith('#')) {
    /* kol-atlas's `#page`, `#page--section`, `#page--section--file`; a bare `#section` stays on the page */
    const [page, section] = url.slice(1).split('--')
    if (byId[page]) return `${tabPath(byId[page])}${section ? `#a-${section}` : ''}`
    return `#a-${page}`
  }
  const file = url.replace(/^\.\//, '').replace(/\.md(#.*)?$/, '')
  const hit = Object.keys(byFile).find((f) => f.endsWith(file))
  return hit ? tabPath(byFile[hit]) : url
}

/* ── link previews (kol-atlas's previews.js, on the parsed corpus): a page's title, intro and thumbnail; a section's heading,
 * first paragraph and first image, its page's thumbnail when it has none ── */
const plainText = (tokens = []) => tokens.map((t) => t.content ?? t.text ?? '').join('')
const firstPara = (blocks) => blocks.find((b) => b.type === 'paragraph')
const firstMedia = (blocks) => blocks.find((b) => b.type === 'media')?.items?.[0]?.file
const PREVIEWS = Object.fromEntries(TABS.map((t) => {
  const parsed = parseDocsMarkdown(splitFrontmatter(docSource(t.file) ?? '').body)
  const all = [...parsed.introBlocks, ...parsed.sections.flatMap((s) => s.blocks)]
  const pageFile = parsed.thumb || firstMedia(all)
  const page = { title: parsed.introBlocks.find((b) => b.type === 'heading1')?.content ?? t.title, text: plainText(firstPara(parsed.introBlocks)?.tokens), file: pageFile, site: t.title }
  const sections = {}
  parsed.sections.forEach((s) => {
    sections[s.id] = { title: s.heading, text: plainText(firstPara(s.blocks)?.tokens), file: s.thumb || firstMedia(s.blocks) || pageFile, site: t.title }
    /* a ### is a link target too (Media's categories): its heading, and the text and first image before the next ### */
    s.blocks.forEach((b, i) => {
      if (b.type !== 'heading3') return
      const until = s.blocks.slice(i + 1, s.blocks.findIndex((x, j) => j > i && x.type === 'heading3') >>> 0 || undefined)
      sections[b.id] = { title: b.content, text: plainText(firstPara(until)?.tokens), file: firstMedia(until) || s.thumb || pageFile, site: t.title }
    })
  })
  return [t.id, { page, sections, file: t.file }]
}))
const byPath = Object.fromEntries(TABS.map((t) => [tabPath(t), t.id]))
/* a document's images: its own by file, a web link card's shot by URL */
const assetOf = (file) => (name) => (/^https?:/.test(name) ? cardImage(name) : assetUrl(file, name))
const cardFor = (a) => {
  const href = a.getAttribute('href') || ''
  if (/^https?:/.test(href)) {
    /* an outside link: the card kol-atlas stored for that URL (link-cards.json) */
    const c = LINK_CARDS[href]
    return c ? { title: c.title, text: c.note || c.description, image: cardImage(href), site: c.site, href } : null
  }
  if (/^mailto:/.test(href)) return null
  const [path, hash] = href.split('#')
  const id = path ? byPath[path] : byPath[location.pathname]
  const P = id && PREVIEWS[id]
  if (!P) return null
  const section = hash?.replace(/^a-/, '')
  const d = section ? P.sections[section] : P.page
  if (!d) return null
  const image = d.file ? assetUrl(P.file, d.file) : null
  return { title: d.title, text: d.text, image, graphic: /\.(svg|png)$/i.test(d.file ?? ''), site: section ? d.site : undefined, href }
}

/* ── pages ── */
/* a folder's rows: its pages, an entry under its parent's name */
const tabRows = (list, part) => list.map((t) => ({ id: t.id, to: tabPath(t), label: t.parent ? byId[t.parent]?.title : undefined, title: t.title, part }))

/* no right rail (his ruling): a page draws no TOC unless its frame asks for one through the Outlet context (the app frame, the DS rail) */
const useToc = () => useOutletContext()?.toc ?? false

function Doc({ tab }) {
  const toc = useToc()
  const t = tab ?? byId[useParams().id]
  if (!t) return <Navigate to="/" replace />
  return <MarkdownPage key={t.id} source={docSource(t.file)} numbered={t.numbered} toc={toc} linkNotes={t.notes} resolveLink={resolveLink} assetUrl={assetOf(t.file)} />
}

/* a folder: its own overview document, then its pages as cards */
function Folder({ group }) {
  const navigate = useNavigate()
  const folder = folders.find((f) => f.group === group)
  const rows = tabRows(inGroup(group).flatMap((t) => [t, ...children(t.id)]), group)
  return (
    <>
      <Doc tab={folder} />
      <DocumentIndex rows={rows} onNavigate={navigate} />
    </>
  )
}

 function Reviews() {
  const navigate = useNavigate()
  const rows = reviews.map((r) => ({ id: r.name, to: r.to, title: r.slug, part: REVIEW_FOLDERS.find(([f]) => f === r.folder)?.[1] }))
  return <DocumentIndex title="Research reviews" lede="kol-atlas's research-data reviews: a verdict, the claims checked against their sources, the sources." rows={rows} onNavigate={navigate} />
}

function Review() {
  const toc = useToc()
  const { '*': name } = useParams()
  const src = REVIEW_MODULES[`./research/${name}.md`]
  if (!src) return <Navigate to="/reviews" replace />
  return <MarkdownPage key={name} source={src} toc={toc} resolveLink={resolveLink} assetUrl={assetOf('')} />
}

/* THE CELL PROPS (OverviewTocAndLibraryIcons, kol-website 2026-10-29): `?assets=icon|icon-label` and `?lang=chips|icon` draw
 * the library with kol-icons' file glyphs and a Tag per language, beside today's label and text at the bare URL */
function Library() {
  const navigate = useNavigate()
  const toc = useToc()
  const id = useParams()['*'] ?? ''
  const q = new URLSearchParams(useLocation().search)
  const cells = { assetsView: q.get('assets') ?? undefined, langView: q.get('lang') ?? undefined }
  const row = LIBRARY.rows.find((r) => r.id === id)
  if (row) return <DocumentView row={row} library={LIBRARY} toc={toc} assetsView={cells.assetsView} />
  const folder = LIBRARY.folders.find((f) => f.id === id)
  if (id && !folder) return <Navigate to="/library" replace />
  return <DocumentLibrary library={LIBRARY} folder={folder?.id} onNavigate={navigate} {...cells} />
}

/* ── the frames ── */
/* kol-atlas's tabs header on DS parts, on top of every page: the client's name, TabsRow for the plain tabs, the groups as
 * MenuItems at the row's right end (their rows are links). A group reads as selected when one of its pages is open. */
const plainClick = (e) => !(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)
function TabsHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const plain = [...top, ...single].map((t) => ({ id: tabPath(t), label: t.title }))
  const groups = [
    ...folders.map((f) => ({ label: f.group, rows: [{ to: tabPath(f), label: 'Overview' }, ...inGroup(f.group).flatMap((t) => [t, ...children(t.id)]).map((t) => ({ to: tabPath(t), label: t.parent ? `— ${t.title}` : t.title }))] })),
    { label: 'Reviews', rows: [{ to: '/reviews', label: 'All reviews' }, ...reviews.map((r) => ({ to: r.to, label: r.slug }))] },
  ]
  const open = (g) => g.rows.some((r) => pathname === r.to)
  return (
    <div className="kol-page pb-0 flex flex-col gap-4">
        <h1 className="kol-prose-display-md m-0">{CLIENT}</h1>
        <div className="flex items-end gap-6 border-b border-fg-12">
          <TabsRow tabs={plain} value={plain.find((t) => t.id === pathname)?.id ?? ''} onChange={navigate} ariaLabel="Pages" className="!border-0" />
          <div className="ml-auto flex items-end gap-6">
            {groups.map((g) => (
              <MenuItem key={g.label} label={g.label} align="end" size="sm" buttonClassName={`kol-mono-12 !rounded-none !px-0 border-b-2 ${open(g) ? 'border-fg-100 text-emphasis' : 'border-transparent text-body'}`} panelClassName="min-w-[220px]">
                {g.rows.map((r) => (
                  <a key={r.to} href={r.to} role="menuitem" data-menu-item className={`kol-menu-btn kol-helper-12 flex h-8 w-full items-center px-3 no-underline ${pathname === r.to ? 'text-emphasis' : 'text-body hover:text-emphasis'}`}
                    onClick={(e) => { if (!plainClick(e)) return; e.preventDefault(); navigate(r.to) }}>{r.label}</a>
                ))}
              </MenuItem>
            ))}
          </div>
        </div>
    </div>
  )
}

/* the site rail, the tabs header above the page, no TOC rail (the pages publish none) */
function SiteFrame() {
  return <SiteLayout navTree={NAV} sideNav={{ footer: false }} pageWash="var(--kol-fg-02)" header={<TabsHeader />} />
}

function AppFrame() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const current = APP_ITEMS.find((i) => pathname === i.path || pathname.startsWith(`${i.path}/`))?.path ?? pathname
  return (
    <AppShell items={APP_ITEMS} currentPath={current} onNavigate={navigate} railToggleKey={'\\'}>
      {/* the pages carry their own `.kol-page` inset, so no PageShell here; the same tabs header; the TOC is the DS rail */}
      <TabsHeader />
      <Outlet context={{ toc: 'rail' }} />
    </AppShell>
  )
}

export default function App() {
  const [rail, setRail] = useState(loadRail)
  const pick = (v) => { setRail(v); try { localStorage.setItem(RAIL_KEY, v) } catch { /* storage blocked */ } }
  const Frame = rail === 'app' ? AppFrame : SiteFrame
  const options = useMemo(() => [{ value: 'site', label: 'Site' }, { value: 'app', label: 'App' }], [])
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Frame />}>
          <Route path="/" element={<Navigate to="/project" replace />} />
          {folders.map((f) => <Route key={f.id} path={tabPath(f)} element={<Folder group={f.group} />} />)}
          <Route path="/library/*" element={<Library />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/*" element={<Review />} />
          <Route path="/:id" element={<Doc />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <LinkPreview cardFor={cardFor} />
      {/* the frame switch — apps/shell's rail axis, one toggle */}
      <div className="fixed bottom-3 right-3 z-[3]">
        <TabsRow variant="text" size={12} tracked tabs={options} value={rail} onChange={pick} ariaLabel="Frame" />
      </div>
    </BrowserRouter>
  )
}
