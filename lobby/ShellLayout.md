---
component: ShellLayout
source: kol-monorepo/apps/web/src/components/shell/ShellLayout.jsx#L1-L163
date: 2026-07-03
status: draft
deps: [ShellHeader, ShellSidebar, ShellDrawer, ShellSearchOverlay]
---

# ShellLayout

## Purpose
The app-shell orchestrator: a fixed, full-viewport chrome that stacks a sticky `ShellHeader`, a three-column content grid (collapsible left nav / main content / right TOC rail), an off-canvas `ShellDrawer` for mobile nav, and a `ShellSearchOverlay` command palette. It owns all shell-level open/collapse state, the Cmd/Ctrl-K wiring, and three React contexts that let the rendered page drive the right rail and full-height mode. This is the centerpiece the other five shell components plug into — the DS's answer to the missing app-shell layout.

## Anatomy
```
<ShellTocContext.Provider value={setTocContent}>          ← page → right-rail content
 <ShellFullHeightContext.Provider value={setIsFullHeight}> ← page → fill-viewport opt-in
  <ShellTocCollapsedContext.Provider value={setTocCollapsed}> ← page → start TOC collapsed
   <div class="fixed inset-0 flex flex-col bg-surface-primary text-auto">
     <ShellHeader … />                                    ← sticky top bar + section tabs
     <div class="flex-1 overflow-hidden">
       <div class="h-full overflow-y-auto" scrollbarGutter:stable>   (overflow-hidden when fullHeight)
         <div class="mx-auto w-full max-w-[1800px] px-4 md:px-5 lg:px-6 pb-16">
           <div class="shell-content-grid grid gap-8 {gridCols}" data-layout={layoutType}>
             <NavColumn>   (hidden lg:block, sticky top-8)  ← renderSidebar() ?? <ShellSidebar/>
             <MainColumn>  (w-full min-w-0)                 ← <Suspense><Outlet/></Suspense>
             <TocColumn>   (hidden lg:block, sticky top-8)  ← effectiveTocContent
     <ShellDrawer isOpen={isNavDrawerOpen}> … sidebar …     ← portalled, mobile only
     <ShellSearchOverlay isOpen={isSearchOpen} … />
```
`NavColumn` / `MainColumn` / `TocColumn` are three local sub-components (L23-L46). Columns are `hidden lg:block shrink-0 pt-6 md:pt-6 lg:pt-8`; their inner wrapper is `sticky top-8 max-h-[calc(100vh-8rem)] overflow-y-auto` (nav also carries `shell-sidebar-sticky`).

## Variants
Layout adapts by which rails are visible (`data-layout` = `nav-toc` | `nav` | `toc` | `none`):
- **nav-toc** — `lg:grid-cols-[256px_minmax(0,1fr)] xl:grid-cols-[256px_minmax(0,1fr)_160px]` (TOC only appears at `xl`).
- **nav** — `lg:grid-cols-[256px_minmax(0,1fr)]`.
- **toc** — `xl:grid-cols-[minmax(0,1fr)_160px]`.
- **none** — no grid template (single column).
- **full-height** (`isFullHeight`, via context) — outer scroll becomes `overflow-hidden`, container drops `pb-16` for `h-full`, main flexes to fill and forces its first child to stretch (`[&>*]:flex-1 [&>*]:flex [&>*]:flex-col [&>*]:min-h-0`). For iframe/embed pages.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| routes | array | `[]` | route tree fed to header tabs, sidebar, and search fallback |
| basePath | string | `'/'` | base for all route/section path resolution |
| brandLogoSrc | string | — | optional consumer brand logo (passed through to header) |
| brandLogoAlt | string | `''` | alt text for the brand logo |
| renderSidebar | fn(`{ onNavigate }`) → node | — | render-prop to override the default `ShellSidebar` (drawer variant gets `onNavigate` to auto-close) |
| searchItems | array | — | pre-flattened search index; if omitted the overlay flattens `routes` |
| defaultTocContent | node | — | right-rail content when the page registers none |

## States & interactions
- **State owned:** `isNavDrawerOpen`, `navCollapsed`, `tocCollapsed`, `isSearchOpen`, `tocContent`, `isFullHeight`.
- **Cmd/Ctrl-K** → `setIsSearchOpen(true)` (preventDefault). **Alt-B** → same (secondary binding). Window `keydown` listener, mounted once (L56-L68).
- **Hamburger (`onMenuOpen`)** is breakpoint-aware: at `≥1024px` it toggles *both* `navCollapsed` and `tocCollapsed` together; below `1024px` it opens the drawer (`matchMedia('(min-width: 1024px)')`, L96-L103).
- **`onNavToggle`** toggles left nav only; **`onTocToggle`** toggles TOC only (passed to header, and only when `hasToc`).
- **TOC registration:** `effectiveTocContent = tocContent ?? defaultTocContent`; `hasToc` gates the TOC column and the header's TOC toggle.
- **Active-route** handling lives in the children (`ShellSidebar`/`ShellHeader` NavLinks), not here.
- No focus-trap here — the drawer and overlay each manage their own dismissal.

## Styling
- Tailwind utilities throughout; KOL tokens `bg-surface-primary`, `text-auto`, `text-fg-48` (Suspense fallback). Fixed shell (`fixed inset-0`), inner scroll region uses `scrollbarGutter: 'stable'` to avoid layout shift.
- **Contexts exposed (keep — this is the public seam):**
  - `ShellTocContext` (value = `setTocContent`) — page calls it in a layout effect to mount/unmount right-rail content.
  - `ShellFullHeightContext` (value = `setIsFullHeight`) — page opts into fill-viewport mode.
  - `ShellTocCollapsedContext` (value = `setTocCollapsed`) — page requests the TOC start collapsed.
- Transitions: none of its own; collapse is instant show/hide of columns.
- **App-specific bits to DROP / convert:**
  - `Outlet` + `Suspense` from **react-router-dom** (L2, L122-L124) — the main slot is hardwired to the router. Convert to a `children` (or `content`) slot so the DS shell is router-agnostic; keep the `Suspense` boundary as an optional wrapper.
  - Magic numbers `256px` (nav) / `160px` (TOC) / `1800px` (max-width) / `top-8` / `100vh-8rem` are tuned to the KOL header height — expose as tokens or props (`navWidth`, `tocWidth`, `maxWidth`) so a different header height doesn't break the sticky offsets.
  - `shell-content-grid` / `shell-sidebar-sticky` are app CSS hooks — re-tier into DS CSS or drop if the grid template + sticky are fully expressible inline.

## Dependencies
- **ShellHeader**, **ShellSidebar**, **ShellDrawer**, **ShellSearchOverlay** (sibling shell components, all being lobbied).
- **react-router-dom** `Outlet` — to be replaced by a slot (see DROP list).
- React `createContext` / `useState` / `useEffect` / `Suspense`.

## Recreation notes
- Tier: **organism** (top-level layout/nav orchestrator).
- Prop seams to keep as props: `routes`, `basePath`, `brandLogoSrc`/`brandLogoAlt`, `renderSidebar`, `searchItems`, `defaultTocContent`. Add `children`/`content` to replace `Outlet`.
- Keep the three contexts verbatim — they are the extension mechanism pages depend on; re-export them from the DS package so consumers can `useContext(ShellTocContext)`.
- Compose the sibling DS shell primitives (header/sidebar/drawer/overlay) rather than re-rolling; this component is pure orchestration + state + grid math.
- Keep the breakpoint-aware hamburger behavior (desktop = collapse rails, mobile = drawer) and the Cmd/Ctrl-K + Alt-B bindings — but let the key combo be a prop if the DS wants configurable shortcuts.
- The `256px`/`160px`/`1800px` grid constants should become DS layout tokens so the shell is reusable across apps with different header chrome.
