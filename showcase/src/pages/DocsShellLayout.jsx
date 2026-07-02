import { Link } from 'react-router-dom'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import PreviewCard from '../lib/PreviewCard.jsx'
import ApiTable from '../lib/ApiTable.jsx'
import { DEMOS } from '../lib/demos-registry.js'
import { DOC_DATA } from '../lib/component-docs.js'

/**
 * Docs · Shell & Layout — the home for the pieces that are NOT components in
 * the traditional sense (route wrappers, behaviors) and for how the shell
 * composes. shadcn model: meta material lives in Docs, never in the
 * components list.
 */

const TOC = [
  { id: 'composition', label: 'The composition' },
  { id: 'layout', label: 'Layout' },
  { id: 'appshell', label: 'AppShell' },
  { id: 'sidenav', label: 'SideNav' },
  { id: 'scrolltotop', label: 'ScrollToTop' },
  { id: 'docs-shell', label: 'The docs shell (this site)' },
]

/* Honest structural diagram — labeled boxes, not a fake screenshot. */
function Box({ label, children, className = '' }) {
  return (
    <div className={`rounded-[var(--kol-radius-sm)] border border-fg-16 p-3 ${className}`}>
      <p className="kol-mono-12 text-emphasis mb-2">{label}</p>
      {children}
    </div>
  )
}

function CompositionDiagram() {
  return (
    <Box label="<Layout>  — route-level root frame">
      <div className="flex flex-col gap-2">
        <div className="rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16 px-3 py-1.5 kol-mono-12 text-meta">
          {'<ScrollToTop />'} — render-null behavior
        </div>
        <Box label="<main> · <Outlet />">
          <Box label="<AppShell>  — portal chrome (per route group)">
            <div className="flex gap-2">
              <div className="w-28 shrink-0 rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16 px-2 py-4 kol-mono-12 text-meta">
                {'<SideNav />'}
              </div>
              <div className="flex-1 rounded-[var(--kol-radius-sm)] border border-dashed border-fg-16 px-2 py-4 kol-mono-12 text-meta">
                {'<Outlet />'} — pages
              </div>
            </div>
            <p className="kol-mono-12 text-meta mt-2">+ mobile drawer · ModalProvider</p>
          </Box>
        </Box>
      </div>
    </Box>
  )
}

export default function DocsShellLayout() {
  return (
    <DocLayout toc={TOC}>
      <DocHeader
        eyebrow="Docs"
        title="Shell & Layout"
        lede="How a KOL app is framed: Layout is the route-level root, AppShell is the portal chrome nested inside it, SideNav is the navigation rail, ScrollToTop is a render-null behavior. These aren't components in the traditional sense — they're documented here instead of the components list."
      />

      <DocSection
        id="composition"
        title="The composition"
        lede="The nesting, as used by the brand app: Layout wraps every route; AppShell wraps the route groups that carry portal chrome."
      >
        <CompositionDiagram />
      </DocSection>

      <DocSection
        id="layout"
        title="Layout"
        lede="The outermost route wrapper: mounts ScrollToTop, renders pages through <Outlet /> inside a min-height column, and shows ExitPreview on client-site routes. No props — it's wiring, not UI."
      >
        <pre className="kol-mono-12 overflow-x-auto rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-04 px-3 py-2.5 text-fg">{DOC_DATA.Layout.usage}</pre>
      </DocSection>

      <DocSection
        id="appshell"
        title="AppShell"
        lede="The portal chrome: SideNav + mobile drawer (hamburger, backdrop, Escape) + ModalProvider around the route Outlet. Give it a navTree and an active-page resolver."
      >
        <pre className="kol-mono-12 overflow-x-auto rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-04 px-3 py-2.5 text-fg">{DOC_DATA.AppShell.usage}</pre>
        <ApiTable rows={DOC_DATA.AppShell.api} />
      </DocSection>

      <DocSection
        id="sidenav"
        title="SideNav"
        lede="The sticky navigation rail — grouped tree, route + anchor leaves, scroll-spy, collapsible. It's a real visual component: live below, full page at Components → SideNav."
      >
        <PreviewCard entry={DEMOS.SideNav} minH="min-h-[24rem]" />
        <Link to="/components/side-nav" className="kol-mono-12 text-meta hover:text-emphasis transition-colors w-fit">
          Full SideNav component page →
        </Link>
      </DocSection>

      <DocSection
        id="scrolltotop"
        title="ScrollToTop"
        lede="Render-null behavior: on route change scrolls to top; on hash change smooth-scrolls to the anchor. Mount once inside the router (Layout already does)."
      >
        <pre className="kol-mono-12 overflow-x-auto rounded-[var(--kol-radius-sm)] border border-fg-08 bg-fg-04 px-3 py-2.5 text-fg">{DOC_DATA.ScrollToTop.usage}</pre>
      </DocSection>

      <DocSection
        id="docs-shell"
        title="The docs shell (this site)"
        lede="This site's own chrome — TopBar, DocSidebar (flat A→Z), the content column, and the on-this-page rail — is the shadcn-reference shell, app-local in showcase/src/lib (DocLayout.jsx, TopBar.jsx). The workshop shell (kol-monorepo /workshop) is the second reference shell, queued for import. Registry + comparison: docs/shells/01-reference-shells.md. Promotion into @kolkrabbi/kol-framework is the plan once both stabilise."
      />
    </DocLayout>
  )
}
