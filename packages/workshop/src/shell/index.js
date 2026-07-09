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
