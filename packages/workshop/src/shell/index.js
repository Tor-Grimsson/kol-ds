/**
 * @kolkrabbi/kol-workshop — shell.
 *
 * The docs-system shell: two-row header, collapsible nav sidebar, mobile
 * drawer, and the layout shell that wires them to react-router. ShellLayout
 * owns the TOC / full-height / TOC-collapsed contexts that pages register
 * against.
 */
export { default as ShellLayout } from './ShellLayout.jsx'
export { ShellTocContext, ShellFullHeightContext, ShellTocCollapsedContext } from './ShellLayout.jsx'
export { default as ShellSidebar } from './ShellSidebar.jsx'
/* RailSection — THE rail ladder. Every rail header at every rung comes from
 * here, in both rails; see the file header for why a class alone was not
 * enough. `pnpm validate:rails` R4 asserts it. */
export { default as RailSection } from './RailSection.jsx'
/* RailRow — THE L3 rail row. The look lives in `.shell-nav-item`; this owns the
 * markup so nine hand-written utility stacks cannot come back. R4 asserts it. */
export { default as RailRow } from './RailRow.jsx'
/* RightRail — THE right rail, one component for every route. It replaced two
 * that disagreed about which sections exist, which is why sections used to
 * appear and vanish. The section set is fixed and unconditional. */
export { default as RightRail } from './RightRail.jsx'
