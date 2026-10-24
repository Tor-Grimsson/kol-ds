import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CategoryPage, SiteLayout } from '@kolkrabbi/kol-framework'
import { Button, PageHeader, useScrollSpy } from '@kolkrabbi/kol-component'
import { BrandAssets, BrandBook, brandToc } from '@kolkrabbi/kol-styleguide'
import { VOYAGER } from 'voyager-fixture'
import { Boards, Compare, RESEARCH_CARDS, Sheet } from './research/ResearchPages.jsx'

/* THE SITE HUB — the site-rail shape around a client's brand site, the review surface for the sites that share it
 * (brand.kolkrabbi.io, brand.<client>.*; plan-2026-10-24-site-hub). kol-framework's `PageLayout` with the grouped
 * `NavRail variant="site"` (SideNav) on VOYAGER, the fake client: Home (the landing hero), Brand (the chapter book,
 * its chapters as the rail's sub-rows), Assets (the files), Research (W4: a comparison, a document, a board gallery
 * — the shapes of a research page), and the rest of the rail as rows so the tree reads whole. The layout and a few pages; which rows, in what order, and what every page looks like is his (plan W2).
 * Nothing on screen is drawn here — the rail, the frame, the book and the hero's voices are the packages'.
 *
 * Routing is the browser's, as every site runs:  /  home · /brand · /brand#<chapter> · /assets · /assets#<section> ·
 * /research · /research/compare · /research/sheet · /research/boards · /<row> */

const { brand, logoSources, assets, business } = VOYAGER

/* a raw SVG mark, sized by its box (apps/brand's Mark) */
const Mark = ({ id, className = 'w-full h-full' }) => (
  <span className={`inline-flex items-center justify-center text-emphasis [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto ${className}`} dangerouslySetInnerHTML={{ __html: logoSources[id] ?? '' }} />
)

/* the book's chapters as the rail's sub-rows — the same list the book's own index reads (brandToc) */
const anchors = (page, path) => brandToc(brand, page).map((s) => ({ to: `${path}#${s.id}`, label: s.label }))

/* GROUPS WITHIN A PAGE (user 2026-10-24, another-creation's STYLEGUIDE): a `{ label, children }` node among a
   category's pages is a group header over its rows — the rail's own shape, opt-in, no prop. Brand's chapters are
   sections of one page, grouped as the book groups them — every chapter in a group, none loose. */
const BRAND_GROUPS = [
  { label: 'Brand overview', ids: ['about', 'key-messages', 'voice', 'look'] },
  { label: 'Logos', ids: ['logos-concept', 'logos-types'] },
  { label: 'Foundations', ids: ['color', 'typography'] },
]
const grouped = (rows, groups) => {
  const byId = Object.fromEntries(rows.map((r) => [r.to.split('#')[1], r]))
  const used = new Set()
  const out = groups.map((g) => ({ label: g.label, children: g.ids.filter((id) => byId[id]).map((id) => { used.add(id); return byId[id] }) })).filter((g) => g.children.length)
  const left = rows.filter((r) => !used.has(r.to.split('#')[1]))
  if (left.length) throw new Error(`ungrouped chapters: ${left.map((r) => r.label).join(', ')} — the grouped rail is used whole or not at all`)
  return out
}

/* TWO LEVELS: a category is a grouping label, a page is a route; Home is the one category that is itself a link.
 * The shape is kol-website apps/brand's NAV_TREE (sidebars.config.js), the rows below Assets as link rows. */
const NAV = [
  { id: 'home', label: 'Home', icon: 'home-01', to: '/' },
  /* Brand is a FOLDERNOTE with every chapter in a group — the grouped system used whole (user 2026-10-24: "you cant have a
     solo section 'overview' that doesnt conform to the system, the system has to be used whole sale or not at all") */
  { id: 'brand', label: 'Brand', icon: 'book-open', to: '/brand', pages: grouped(anchors('brand', '/brand'), BRAND_GROUPS) },
  { id: 'assets', label: 'Assets', icon: 'folder', pages: [{ to: '/assets', label: 'Overview' }, ...anchors('assets', '/assets')] },
  /* the Research category (W4): three shapes of a research page. THE FOLDERNOTE (user 2026-10-24): `to` on the category
     makes its row a page of its own — CategoryPage, read from this tree, a page row's `card` putting it on the overview —
     and the row discloses on the way in; no Overview sub-row */
  { id: 'research', label: 'Research', icon: 'bookmark', to: '/research', lede: 'Three shapes of a research page: a comparison, a document, a board gallery.', pages: [
    { to: '/research/compare', label: 'Compare', card: RESEARCH_CARDS.compare },
    { to: '/research/sheet', label: 'Sheet', card: RESEARCH_CARDS.sheet },
    { to: '/research/boards', label: 'Boards', card: RESEARCH_CARDS.boards },
  ] },
  /* the rest of the rail — a row each, on a placeholder page, so the tree reads whole; which rows is his (plan W2) */
  { id: 'slide-deck', label: 'Slide deck', icon: 'maximize', to: '/slide-deck' },
  { id: 'library', label: 'Library', icon: 'library', to: '/library' },
  { id: 'notes', label: 'Notes', icon: 'edit', to: '/notes' },
  { id: 'editor', label: 'Editor', icon: 'desktop', to: '/editor' },
  { id: 'monitor', label: 'Monitor', icon: 'monitor', to: '/monitor' },
  { id: 'icons', label: 'Icons', icon: 'grid', to: '/icons' },
]

/* ── Home: the landing hero — kol-website apps/brand's Landing, class-for-class, on VOYAGER's mood and marks ── */
function Home() {
  const navigate = useNavigate()
  const mood = assets.MOOD[0]
  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img src={mood.url} alt="" className="w-full h-full object-cover" style={{ objectPosition: 'center' }} />
      </div>
      {/* the site's hero overlay (landing.css): the inverse ink over the photo, so the text reads in either theme — the
          variable flips with the theme, the mix is inline (Tailwind first, no app CSS) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none bg-[color-mix(in_srgb,var(--kol-surface-on-inverse)_32%,transparent)]" aria-hidden="true" />

      <div className="relative z-[1] flex flex-col items-center gap-10 px-8 text-center">
        <div className="w-[clamp(140px,16vw,220px)] text-emphasis">
          <Mark id="logomark" />
        </div>

        <h1 className="kol-prose-display uppercase">{brand.meta.name}</h1>

        <p className="kol-prose-tagline">{business.BRAND_INFO.labels.manifesto}</p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Button tone="primary" size="md" onClick={() => navigate('/brand')}>Styleguide</Button>
        </div>
      </div>
    </section>
  )
}

/* a rail row whose page is the site's own — the row is on the rail so the tree reads whole */
const Placeholder = ({ label }) => (
  <div className="kol-page">
    <PageHeader title={label} subtitle="A row on the rail. The page is the site's own." size="sm" voice="mono" />
  </div>
)

/* the opening section of each chaptered page — the brand book's hero, the assets page's overview (kol-styleguide's
   BOOK_SECTIONS / ASSET_SECTIONS first ids) */
const OPENERS = { '/brand': 'hero', '/assets': 'assets-overview' }

/* the frame: PageLayout + the rail, with the chapter rows lit by scroll (kol-website apps/brand's BrandLayout, carried) */
function Frame() {
  const { pathname, hash } = useLocation()

  /* Section categories (Brand, Assets): every rail row whose `to` is a hash on the current path is an anchor on this
     page — spy them so the row lights as you scroll. Bare-route rows light when no section is in view. */
  const leaves = (rows) => rows.flatMap((r) => (r.children ? leaves(r.children) : [r]))
  /* the page's OPENING section is spied first (user 2026-10-24: at the top of the page the spy's edge lock named the
     first chapter, so Overview never lit): the bare route row is the opener's row — lit at the top, until the first
     chapter takes over */
  const opener = OPENERS[pathname]
  const sectionIds = [
    ...(opener ? [opener] : []),
    ...leaves(NAV.flatMap((c) => c.pages ?? [])).map((p) => p.to.split('#')).filter(([path, h]) => path === pathname && h).map(([, h]) => h),
  ]
  const activeId = useScrollSpy(sectionIds)
  const isActive = (to) => {
    const [path, h] = to.split('#')
    return path === pathname && (h ? h === activeId : !activeId || activeId === opener)
  }

  /* a rail row with an anchor lands on its chapter; a route lands at the top */
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  /* Home is the image page — the hero owns its ground, no wash (the sites' line). No credit box under the rail
     (user 2026-10-24: "I dont think we need the credit below"). */
  return <SiteLayout navTree={NAV} sideNav={{ isActive, footer: false }} pageWash={pathname === '/' ? undefined : 'var(--kol-fg-02)'} />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Frame />}>
          <Route path="/" element={<Home />} />
          <Route path="/brand" element={<BrandBook brand={brand} logoSources={logoSources} />} />
          <Route path="/assets" element={<BrandAssets brand={brand} logoSources={logoSources} />} />
          <Route path="/research" element={<CategoryPage navTree={NAV} id="research" />} />
          <Route path="/research/compare" element={<Compare />} />
          <Route path="/research/sheet" element={<Sheet />} />
          <Route path="/research/boards" element={<Boards />} />
          {NAV.filter((c) => c.to && c.to !== '/').map((c) => <Route key={c.id} path={c.to} element={<Placeholder label={c.label} />} />)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
