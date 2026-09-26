/**
 * @kolkrabbi/kol-shell — the KOL application shell set.
 *
 * Lifted 2026-08-14 from the hand-copied twins in kol-monitor ("Monitor") and
 * kol-mirror ("Hall of Mirrors") — AppShellSet lobby brief. App chrome, not
 * site chrome: kol-framework's SideNav/footer/heroes are the site register;
 * this is the rail (a collapsed kol-framework SideNav since 0.13.0 —
 * RailSideNavPixelParity) + the page scaffolds an application is built from.
 *
 * Router-agnostic: no react-router dependency — pass `currentPath` +
 * `onNavigate` and render your router's element as children.
 */
export { default as AppShell } from './AppShell.jsx'
export { NavHiddenContext, useNavHidden } from './navHidden.js'
export { SettingsToggleContext, useSettingsToggle } from './settingsToggle.js'
export { default as NavRail } from './NavRail.jsx'
export { default as PageShell, PageBleed } from './PageShell.jsx'
/* PageHeader MOVED to @kolkrabbi/kol-component 2026-09-03 (page-header-one-masthead).
 * Not re-exported: every kol-shell consumer already has kol-component as a peer,
 * so the import path changes and nothing else. See docs retirements. */
/* ContentFilters is NOT exported here — it lives in @kolkrabbi/kol-component,
 * where it always did. This package shipped a recreated duplicate 0.1.0–0.2.0;
 * retired 2026-08-15, quarantined in _tmp/. Import it from kol-component. */
export { default as TabStrip } from './TabStrip.jsx'
export { default as SettingsScaffold } from './SettingsScaffold.jsx'
export { default as WalkthroughPanel } from './WalkthroughPanel.jsx'
export { default as ShortcutsOverlay } from './ShortcutsOverlay.jsx'
export { default as Logomark } from './Logomark.jsx'
// the app tier, shipped once (ShellHomeSystem, kol-fxr 2026-08-27)
export { default as CatalogPage } from './CatalogPage.jsx'
export { default as SettingsShortcuts } from './SettingsShortcuts.jsx'
export { default as SettingsLinks, SettingsColophon } from './SettingsLinks.jsx'
export { default as TouchDeviceOverlay, useTouchPrimary } from './TouchDeviceOverlay.jsx'
// the Hub — Shell + Home + Settings + keys, made once (the app anatomy, 2026-09-26)
export { default as AppHub } from './AppHub.jsx'
export { default as HubHome } from './HubHome.jsx'
export { default as HubSettings } from './HubSettings.jsx'
