import { Routes, Route } from 'react-router-dom'
import ShellLayout from '../workshop/shell/ShellLayout.jsx'
import WorkshopSidebarContent from '../workshop/shell/WorkshopSidebarContent.jsx'
import '../workshop/shell/shell.css'

const BASE_PATH = '/workshop-preview'

/* Sample route tree — 3 groups with children so the collapsible groups + counts
 * render. Paths resolve to /workshop-preview/<path> via the shell's basePath. */
const PREVIEW_ROUTES = [
  {
    id: 'foundations',
    label: 'Foundations',
    icon: 'layout',
    path: '',
    children: [
      { id: 'colors', label: 'Colors', path: 'foundations/colors' },
      { id: 'typography', label: 'Typography', path: 'foundations/typography' },
      { id: 'spacing', label: 'Spacing', path: 'foundations/spacing' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'copy',
    children: [
      { id: 'buttons', label: 'Buttons', path: 'components/buttons' },
      { id: 'inputs', label: 'Inputs', path: 'components/inputs' },
      { id: 'menus', label: 'Menus', path: 'components/menus' },
      { id: 'toggles', label: 'Toggles', path: 'components/toggles' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    icon: 'book-open',
    children: [
      { id: 'forms', label: 'Forms', path: 'patterns/forms' },
      { id: 'navigation', label: 'Navigation', path: 'patterns/navigation' },
    ],
  },
]

/* "On this page" entries — ids match the h2 ids in SampleContent, so the
 * shell's DocsToc IntersectionObserver tracks the active heading. */
const SAMPLE_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'usage', label: 'Usage' },
]

const SampleContent = () => (
  <article className="max-w-3xl">
    <h1 className="text-2xl font-medium mb-4">Workshop shell preview</h1>
    <p className="text-fg-64 mb-10">
      This page mounts the workshop shell ported from kol-monorepo: header with
      section tabs, collapsible navigation sidebar, search overlay (Cmd+K), and
      the right rail with an &ldquo;On this page&rdquo; TOC plus quick actions.
    </p>

    <h2 id="overview" className="text-lg font-medium mt-10 mb-3">Overview</h2>
    <p className="text-fg-64 mb-4">
      The shell is its own chrome: a fixed full-viewport layout with a sticky
      two-row header, a scrollable content well, and up to two side rails. The
      left rail lists route groups with item counts; the right rail carries
      page-level content registered through the shell&rsquo;s TOC context or the
      defaultTocContent prop.
    </p>
    <p className="text-fg-64 mb-4">
      Scroll this page to watch the TOC highlight follow the visible section.
      The dock-left and dock-right buttons in the tab row collapse each rail
      independently; the hamburger toggles both at once on desktop and opens
      the drawer on mobile.
    </p>

    <h2 id="anatomy" className="text-lg font-medium mt-10 mb-3">Anatomy</h2>
    <p className="text-fg-64 mb-4">
      Row one of the header holds the Kolkrabbi wordmark, the brand logo, the
      search trigger, and the theme toggle. Row two holds the section tabs
      generated from the top-level route groups. Below, a max-width grid places
      the navigation column, the main column, and the TOC column.
    </p>
    <p className="text-fg-64 mb-4">
      Each navigation group is collapsible; the group header shows a chevron
      and a child count. Items are NavLinks with an active state driven by the
      current location.
    </p>

    <h2 id="behavior" className="text-lg font-medium mt-10 mb-3">Behavior</h2>
    <p className="text-fg-64 mb-4">
      Cmd+K (or Ctrl+K, or Alt+B) opens the search overlay, which flattens the
      route tree into searchable items and highlights the matched substring.
      Enter jumps to the first result; Escape closes the overlay.
    </p>
    <p className="text-fg-64 mb-4">
      Below the lg breakpoint the sidebar moves into a portal drawer with a
      backdrop; body scroll locks while it is open. The active route&rsquo;s
      group auto-expands when the location changes.
    </p>

    <h2 id="usage" className="text-lg font-medium mt-10 mb-3">Usage</h2>
    <p className="text-fg-64 mb-4">
      Pages render into the shell through the router Outlet. A page can push
      its own right-rail content via ShellTocContext, request full-height mode
      via ShellFullHeightContext, or start with the TOC collapsed via
      ShellTocCollapsedContext.
    </p>
    <p className="text-fg-64 mb-4">
      In this preview every child path renders this same sample document, so
      any sidebar item can be clicked to exercise the active states without
      wiring real pages.
    </p>
  </article>
)

/* Standalone preview: the shell is its own chrome. ShellLayout renders pages
 * through <Outlet />, so it is mounted as a layout route with an index child
 * and a catch-all child. Wire the app route as /workshop-preview/* so child
 * paths (sidebar items) reach this page. */
const WorkshopPreview = () => (
  <Routes>
    <Route
      element={
        <ShellLayout
          routes={PREVIEW_ROUTES}
          basePath={BASE_PATH}
          brandLogoSrc="/favicon/favicon-kol-ds.svg"
          brandLogoAlt="KOL"
          defaultTocContent={<WorkshopSidebarContent sections={SAMPLE_TOC} />}
        />
      }
    >
      <Route index element={<SampleContent />} />
      <Route path="*" element={<SampleContent />} />
    </Route>
  </Routes>
)

export default WorkshopPreview
