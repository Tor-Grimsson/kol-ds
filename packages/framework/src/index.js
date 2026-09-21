/**
 * @kol/framework — shared KOL app shell.
 *
 * Site chrome (sidenav, page layout, theme toggle, footer, the page kit) consumed across
 * apps. SideNav takes its nav data as props (navTree) so the tree stays
 * app-local. CSS lives in src/styles: kol-framework.css
 * and kol-brand-color.css.
 */

export { default as PageLayout, default as AppShell } from './PageLayout.jsx'
export { ShellTocContext, ShellTocCollapsedContext } from './PageLayout.jsx'
export { default as SideNav } from './SideNav.jsx'
/* MOVED to kol-component 2026-09-03 (editor-set-is-behind-its-source): its
 * EditorShell needs the same rails and cannot import this package. Re-exported
 * here under the name it has always had — this specifier stays valid. */
export { useDragResize } from '@kolkrabbi/kol-component'
export { default as ShellHeader, HEADER_ICON } from './ShellHeader.jsx'
export { default as ThemeToggle } from './ThemeToggle.jsx'
export { useTheme, applyTheme, getInitialTheme, THEME_STORAGE_KEY, THEME_BOOT_SCRIPT } from './theme.js'
export { default as Layout } from './Layout.jsx'
export { default as PageSection } from './PageSection.jsx'
export { default as PortalFooter } from './PortalFooter.jsx'
export { default as ScrollToTop } from './ScrollToTop.jsx'
export { default as PageHero, default as BrandHero, default as SubPageHero } from './PageHero.jsx'
