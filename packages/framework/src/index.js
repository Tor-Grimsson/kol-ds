/**
 * @kol/framework — shared KOL app shell.
 *
 * Site chrome (sidenav, page layout, theme toggle, footer, the page kit) consumed across
 * apps. SideNav takes its nav data as props (navTree) so the tree stays
 * app-local. CSS lives in src/styles: kol-framework.css
 * and kol-brand-color.css.
 */

/* the site frame — `SiteLayout` (2026-10-24, named for the rail variant it frames); `PageLayout` and `AppShell` are
 * its earlier names, aliases on the retirements ledger */
export { default as SiteLayout, default as PageLayout, default as AppShell } from './SiteLayout.jsx'
export { ShellTocContext, ShellTocCollapsedContext } from './SiteLayout.jsx'
export { default as SideNav } from './SideNav.jsx'
/* MOVED to kol-component 2026-09-03 (editor-set-is-behind-its-source): its
 * EditorShell needs the same rails and cannot import this package. Re-exported
 * here under the name it has always had — this specifier stays valid. */
export { useDragResize } from '@kolkrabbi/kol-component'
export { default as ShellHeader, HEADER_ICON } from './ShellHeader.jsx'
export { default as ThemeToggle } from './ThemeToggle.jsx'
export { useTheme, applyTheme, getInitialTheme, THEME_STORAGE_KEY, THEME_BOOT_SCRIPT } from './theme.js'
/* the app loader's runtime half — the build half is `loaderApp()` in `@kolkrabbi/kol-framework/vite` */
export { hideLoaderApp } from './loaderApp.js'
export { default as Layout } from './Layout.jsx'
export { default as PageSection } from './PageSection.jsx'
export { default as PortalFooter } from './PortalFooter.jsx'
export { default as ScrollToTop } from './ScrollToTop.jsx'
export { default as PageHero, default as BrandHero, default as SubPageHero } from './PageHero.jsx'
/* a site's landing — the full-screen image, wash, mark and name (ArticleRendererHomeHeroSelection, 2026-10-28) */
export { default as SiteHero } from './SiteHero.jsx'
export { default as CategoryPage } from './CategoryPage.jsx'
/* the document page (plan-2026-10-28-document W5.2): a markdown file as `.kol-sheet`, the hover card for its links,
 * a folder of files as page rows */
export { default as MarkdownPage } from './MarkdownPage.jsx'
export { default as LinkPreview } from './LinkPreview.jsx'
export { default as documentTabs } from './documentTabs.js'
export { default as documentFiles } from './documentFiles.js'
export { default as documentLibrary, matchOriginals, kindAndTitle, libraryLinks, KINDS as DOCUMENT_KINDS, LANGS as DOCUMENT_LANGS } from './documentLibrary.js'

/* a website's frame — kolkrabbi.io's top bar, takeover menu, footer and cursor layer, carried verbatim
 * (LayoutsAndWebsiteLayout, 2026-10-28); what the site says comes in as props. Its intro is kol-foundry's
 * `WebsiteIntroLoader` (drawn by TextPressure); its ASCII cursor is kol-component's `AsciiCursor`. */
export { default as WebsiteLayout } from './website/WebsiteLayout.jsx'
export { default as WebsiteNavbar } from './website/Navbar.jsx'
export { default as TakeoverMenu } from './website/TakeoverMenu.jsx'
export { default as WebsiteFooter } from './website/Footer.jsx'
export { default as RouteLoader } from './website/RouteLoader.jsx'
export { CursorProvider, useCursor } from './website/CursorContext.jsx'
export { default as CursorOverlay } from './website/CursorOverlay.jsx'
export { default as CursorTrail } from './website/CursorTrail.jsx'
export { WorkViewProvider, useWorkView } from './website/WorkViewContext.jsx'
