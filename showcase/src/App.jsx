import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TagModeProvider, DocumentationReader } from '@kolkrabbi/kol-workshop'
import { VAULT, VAULT_MODULES, TAG_INVENTORY, vaultDocHref, PHASE_LOG_INDEX } from './nav/vault.js'
import Home from './pages/Home'
import Lookup, { Start } from './pages/Lookup'
import DemoPreview from './pages/DemoPreview'
import Foundations from './pages/Foundations'
import FoundationsHome from './pages/FoundationsHome'
import FoundationsColor from './pages/FoundationsColor'
import FoundationsTypography from './pages/FoundationsTypography'
import FoundationsTones from './pages/FoundationsTones'
import IconsGallery from './pages/IconsGallery'
import ComponentPage from './pages/ComponentPage'
import Components, { TierHome, FunctionHome } from './pages/Components'
import Blocks from './pages/Blocks'
import BlockPage from './pages/BlockPage'
import BlockPreview from './pages/BlockPreview'
import Sets from './pages/Sets'
import SetPage from './pages/SetPage'
import SetPreview from './pages/SetPreview'
import Cards from './pages/Cards'
import CardPage from './pages/CardPage'
import CardPreview from './pages/CardPreview'
import Library, { Composition, Collection } from './pages/Library'
import WorkshopDocsPreview from './pages/WorkshopDocsPreview'
import Lobby from './pages/Lobby'
import References from './pages/References'
import ReferenceNode from './pages/ReferenceNode'
import Search from './pages/Search'
import DocsIndex from './pages/DocsIndex'
import StylesIndex from './pages/StylesIndex'
import GuidesHome from './pages/GuidesHome'
import GroupBy from './pages/GroupBy'
import Development from './pages/Development'
import { TagGraphPage, TagsPage, IndexPage } from './pages/DevTools'
import Packages, { PackagePage, PackageTier, PackageChangelog } from './pages/Packages'
import { DevTools, DevRecords } from './pages/DevChapters'
import OpenQuestions, { OpenQuestionsRound } from './pages/OpenQuestions'
import Quarantine from './pages/Quarantine'
import Demo from './pages/Demo'
import Apps, { AppLayer } from './pages/Apps'
import AppHome from './pages/AppHome'
import ShellChrome from './lib/ShellChrome.jsx'
import { useFrontmatter } from './lib/frontmatter.jsx'
import MdxDoc from './lib/MdxDoc.jsx'
/* MDX docs — the page IS the document (shadcn model). One import per doc for
 * now; a glob-driven route lands when the rest convert. */
import * as TypeRolesDoc from './docs/type-roles.mdx'
import * as MenusDoc from './docs/menus.mdx'
import * as LoadersDoc from './docs/loaders.mdx'
import * as ShellLayoutDoc from './docs/shell-and-layout.mdx'

/**
 * ONE chrome, mounted ONCE (2026-07-30). Every page below ShellChrome is
 * content only — no page imports a layout. The old model (11 pages importing
 * DocLayout, 3 importing TopBar) put the same decision in fourteen files and
 * they drifted; the industry-standard shape is a layout route with pages
 * rendering into its Outlet, which is what this is.
 *
 * Bare routes stay OUTSIDE the layout: the block/set previews are the src of
 * the resizable iframes and must render chrome-less by definition.
 */
/* the vault reader with the page's frontmatter toggle (`F`, 2026-09-30) */
function VaultReader({ docsIndex = '/docs' }) {
  const show = useFrontmatter('page')
  return (
    <DocumentationReader
      inventory={VAULT}
      modules={VAULT_MODULES}
      docHref={vaultDocHref}
      routes={{ docsIndex, components: '/components' }}
      showFrontmatter={show}
    />
  )
}

/* a moved subtree keeps its tail (2026-09-30) */
function MovedRedirect({ from, to }) {
  const { pathname } = useLocation()
  return <Navigate to={pathname.replace(from, to)} replace />
}

/* /docs/<guide> → /styles/<guide>: the guides moved to Styles on 2026-09-30 */
function GuideRedirect() {
  const { pathname } = useLocation()
  return <Navigate to={pathname.replace(/^\/docs\//, '/styles/')} replace />
}

export default function App() {
  return (
    <Routes>
      {/* Chrome-less by contract — iframe sources + dev mirrors */}
      <Route path="/modules/preview/:slug" element={<BlockPreview />} />
      {/* a framed component demo, bare (2026-10-01 — demos-registry `frame`) */}
      <Route path="/components/preview/:name" element={<DemoPreview />} />
      {/* BLOCKS → MODULES (2026-10-01, user ruling: "we need another name for Blocks, thats shadcn
          lingo" · "I like modules more"). The old URLs redirect, tail kept. */}
      <Route path="/blocks/*" element={<MovedRedirect from="/blocks" to="/modules" />} />
      <Route path="/sets/preview/:slug" element={<SetPreview />} />
      <Route path="/cards/preview/:slug" element={<CardPreview />} />

      {/* TagModeProvider wraps the WHOLE shell, not just the vault route: the
        * reader portals its sidebar into the shell's TOC rail (ShellTocContext),
        * so a route-scoped provider left that rail outside the context and
        * every tag click hit the noop fallback (wave-4 parity). */}
      <Route
        element={
          /* TAG_INVENTORY, not VAULT: the graph reads what the provider is
           * given, and given VAULT alone it could only draw the 46 markdown
           * docs — the 66 component pages were invisible to it however well
           * they were tagged. */
          <TagModeProvider inventory={TAG_INVENTORY} docHref={vaultDocHref}>
            <ShellChrome />
          </TagModeProvider>
        }
      >
        {/* TagModeGate is GONE (user ruling 2026-08-01). It existed to mount a
          * SECOND overlay beside the palette; the tag browser is the palette's
          * expanded body now, so the shell mounts it once and there is nothing
          * left to gate. One surface, one mount. */}
        <Route path="/" element={<Home />} />
        {/* the chapter has its own page and Tokens its own URL (W3, 2026-09-30) */}
        <Route path="/foundations" element={<FoundationsHome />} />
        <Route path="/foundations/tokens" element={<Foundations />} />
        <Route path="/foundations/color" element={<FoundationsColor />} />
        <Route path="/foundations/typography" element={<FoundationsTypography />} />
        <Route path="/foundations/tones" element={<FoundationsTones />} />
        {/* THE icons page is brand's gallery (IconsGallery, 2026-09-02) — `/icons`
          * takes the default set, `/icons/:set` names one; the old comparison
          * URL keeps working */}
        <Route path="/icons/brand" element={<Navigate to="/icons" replace />} />
        {/* the Interface set was `kol-icon-set-v1` until 2026-09-30 (W8) */}
        <Route path="/icons/kol-icon-set-v1/*" element={<MovedRedirect from="/icons/kol-icon-set-v1" to="/icons/kol-icon-set-interface" />} />
        <Route path="/icons/:set?" element={<IconsGallery />} />
        <Route path="/icons/:set/:group" element={<IconsGallery />} />
        {/* THE LIBRARY'S PARENTS (2026-09-30) — the header tabs Composition and Collection, and
          * the Library over both */}
        <Route path="/library" element={<Library />} />
        <Route path="/composition" element={<Composition />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/group-by" element={<GroupBy />} />
        <Route path="/components/tier/:tier" element={<TierHome />} />
        <Route path="/components/function/:fn" element={<FunctionHome />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
        <Route path="/modules" element={<Blocks />} />
        <Route path="/modules/category/:cat" element={<Blocks />} />
        <Route path="/modules/:slug" element={<BlockPage />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/cards/category/:cat" element={<Cards />} />
        <Route path="/cards/:slug" element={<CardPage />} />
        <Route path="/sets" element={<Sets />} />
        {/* a single-package set is that package's page (2026-09-30, the library taxonomy) */}
        <Route path="/sets/family/*" element={<MovedRedirect from="/sets/family" to="/packages" />} />
        <Route path="/sets/:slug" element={<SetPage />} />
        {/* The holding page. Every route above stays mounted while its category
          * is quarantined — the gate is on the sidebar, not on the router, so a
          * held page is reachable by link and by ⌘K and can be checked. */}
        <Route path="/quarantine" element={<Quarantine />} />
        {/* The reference graph — generated from usage-index + token-index. */}
        <Route path="/references" element={<References />} />
        <Route path="/references/:name" element={<ReferenceNode />} />
        {/* ONE route for the home and the results (`/search` · `/search/results`): two routes
          * remounted the page between them, and the box dropped a keystroke on the way */}
        <Route path="/search/:view?" element={<Search />} />
        <Route path="/search/tags" element={<TagsPage />} />
        <Route path="/search/graph" element={<TagGraphPage />} />
        <Route path="/search/index" element={<IndexPage />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/tier/:tier" element={<PackageTier />} />
        <Route path="/packages/:dir" element={<PackagePage />} />
        <Route path="/packages/:dir/changelog" element={<PackageChangelog />} />
        <Route path="/development" element={<Development />} />
        <Route path="/development/tools" element={<DevTools />} />
        <Route path="/development/records" element={<DevRecords />} />
        {/* moved 2026-09-30 — the old URLs redirect */}
        <Route path="/development/tag-graph" element={<Navigate to="/search/graph" replace />} />
        <Route path="/development/tags" element={<Navigate to="/search/tags" replace />} />
        <Route path="/development/index" element={<Navigate to="/search/index" replace />} />
        <Route path="/development/packages/*" element={<MovedRedirect from="/development/packages" to="/packages" />} />
        {/* The phase log — docs/operations/09-phase-log/ read by the same reader as the vault,
          * in the Development space (vaultDocHref sends its ids here). */}
        <Route path="/development/log" element={<Navigate to={vaultDocHref(PHASE_LOG_INDEX.id)} replace />} />
        <Route path="/development/log/:docId" element={<VaultReader docsIndex="/development/log" />} />
        <Route path="/development/open-questions" element={<OpenQuestions />} />
        <Route path="/development/open-questions/:round" element={<OpenQuestionsRound />} />
        {/* Library › Lookup — the vault's lookup pages, rendered in the Library space (2026-10-01) */}
        <Route path="/library/start" element={<Start />} />
        <Route path="/library/start/:docId" element={<VaultReader docsIndex="/library/start" />} />
        <Route path="/library/lookup" element={<Lookup />} />
        <Route path="/library/lookup/:docId" element={<VaultReader docsIndex="/library/lookup" />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/layer/:layer" element={<AppLayer />} />
        {/* an app's HOME — its spec. Singular: `/apps/<name>/` is the app itself (its own build) */}
        <Route path="/app/:name" element={<AppHome />} />
        <Route path="/docs" element={<DocsIndex />} />
        {/* STYLES (2026-09-30) — the guides moved here from Docs; the old URLs redirect */}
        <Route path="/styles" element={<StylesIndex />} />
        <Route path="/styles/guides" element={<GuidesHome />} />
        <Route path="/styles/shell-and-layout" element={<MdxDoc module={ShellLayoutDoc} />} />
        <Route path="/styles/menus" element={<MdxDoc module={MenusDoc} />} />
        <Route path="/styles/loaders" element={<MdxDoc module={LoadersDoc} />} />
        <Route path="/styles/type-roles" element={<MdxDoc module={TypeRolesDoc} />} />
        {['shell-and-layout', 'menus', 'loaders', 'type-roles'].map((g) => <Route key={g} path={`/docs/${g}`} element={<GuideRedirect />} />)}
        {/* THE VAULT — docs/ rendered by the packaged reader, frontmatter and
          * all. Documentation is a SYSTEM: its own top-level URL space. */}
        {/* the Docs space's root is its index; the old door stays a redirect */}
        <Route path="/documentation" element={<Navigate to="/docs" replace />} />
        <Route path="/documentation/:docId" element={<VaultReader />} />
        {import.meta.env.DEV && <Route path="/lobby/*" element={<Lobby />} />}
      </Route>
      {/* THE workshop route — live dogfood of @kolkrabbi/kol-workshop (shell +
          docs viewer). The vendored-shell /workshop-preview twin was deleted
          in the 2026-07-15 de-fork; one shell, consumed from the package. */}
      <Route path="/workshop-docs/*" element={<WorkshopDocsPreview />} />
      {/* Maintainer tooling — dev server only, never the deployed site
          (2026-07-15 audit P1-3): the repo-root lobby/ work queue and the
          chess-consumer mirror (1:1 stand-in for the kol-chess app). */}
      {import.meta.env.DEV && <Route path="/demo" element={<Demo />} />}
    </Routes>
  )
}
