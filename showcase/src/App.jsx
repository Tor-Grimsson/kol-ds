import { Routes, Route, Navigate } from 'react-router-dom'
import { TagModeProvider, DocumentationReader } from '@kolkrabbi/kol-workshop'
import { VAULT, VAULT_MODULES, TAG_INVENTORY, vaultDocHref } from './nav/vault.js'
import Home from './pages/Home'
import Foundations from './pages/Foundations'
import FoundationsColor from './pages/FoundationsColor'
import FoundationsTypography from './pages/FoundationsTypography'
import Icons from './pages/Icons'
import ComponentPage from './pages/ComponentPage'
import Components from './pages/Components'
import Blocks from './pages/Blocks'
import BlockPage from './pages/BlockPage'
import BlockPreview from './pages/BlockPreview'
import Sets from './pages/Sets'
import SetPage from './pages/SetPage'
import SetPreview from './pages/SetPreview'
import WorkshopDocsPreview from './pages/WorkshopDocsPreview'
import Lobby from './pages/Lobby'
import References from './pages/References'
import ReferenceNode from './pages/ReferenceNode'
import SearchResults from './pages/SearchResults'
import Quarantine from './pages/Quarantine'
import Demo from './pages/Demo'
import ShellChrome from './lib/ShellChrome.jsx'
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
export default function App() {
  return (
    <Routes>
      {/* Chrome-less by contract — iframe sources + dev mirrors */}
      <Route path="/blocks/preview/:slug" element={<BlockPreview />} />
      <Route path="/sets/preview/:slug" element={<SetPreview />} />

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
        <Route path="/foundations" element={<Foundations />} />
        <Route path="/foundations/color" element={<FoundationsColor />} />
        <Route path="/foundations/typography" element={<FoundationsTypography />} />
        <Route path="/icons" element={<Icons />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/blocks/:slug" element={<BlockPage />} />
        <Route path="/sets" element={<Sets />} />
        <Route path="/sets/:slug" element={<SetPage />} />
        {/* The holding page. Every route above stays mounted while its category
          * is quarantined — the gate is on the sidebar, not on the router, so a
          * held page is reachable by link and by ⌘K and can be checked. */}
        <Route path="/quarantine" element={<Quarantine />} />
        {/* The reference graph — generated from usage-index + token-index. */}
        <Route path="/references" element={<References />} />
        <Route path="/references/:name" element={<ReferenceNode />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/docs/shell-and-layout" element={<MdxDoc module={ShellLayoutDoc} />} />
        <Route path="/docs/menus" element={<MdxDoc module={MenusDoc} />} />
        <Route path="/docs/loaders" element={<MdxDoc module={LoadersDoc} />} />
        <Route path="/docs/type-roles" element={<MdxDoc module={TypeRolesDoc} />} />
        {/* THE VAULT — docs/ rendered by the packaged reader, frontmatter and
          * all. Documentation is a SYSTEM: its own top-level URL space. */}
        <Route path="/documentation" element={<Navigate to={VAULT.length ? vaultDocHref(VAULT[0].id) : '/'} replace />} />
        <Route
          path="/documentation/:docId"
          element={
            <DocumentationReader
              inventory={VAULT}
              modules={VAULT_MODULES}
              docHref={vaultDocHref}
              routes={{ docsIndex: '/documentation', components: '/components' }}
            />
          }
        />
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
