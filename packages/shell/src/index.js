/**
 * @kolkrabbi/kol-shell — the KOL application shell set.
 *
 * Lifted 2026-08-14 from the hand-copied twins in kol-monitor ("Monitor") and
 * kol-mirror ("Hall of Mirrors") — AppShellSet lobby brief. App chrome, not
 * site chrome: kol-framework's SideNav/footer/heroes are the site register;
 * this is the fixed 48px rail + page scaffolds an application is built from.
 *
 * Router-agnostic: no react-router dependency — pass `currentPath` +
 * `onNavigate` and render your router's element as children.
 */
export { default as AppShell } from './AppShell.jsx'
export { NavHiddenContext, useNavHidden } from './navHidden.js'
export { default as NavRail } from './NavRail.jsx'
export { default as PageShell, PageBleed } from './PageShell.jsx'
export { default as PageHeader } from './PageHeader.jsx'
/* ContentFilters is NOT exported here — it lives in @kolkrabbi/kol-component,
 * where it always did. This package shipped a recreated duplicate 0.1.0–0.2.0;
 * retired 2026-08-15, quarantined in _tmp/. Import it from kol-component. */
export { default as TabStrip } from './TabStrip.jsx'
export { default as GridCard } from './GridCard.jsx'
export { default as SettingsScaffold, SettingsSection, LabelRow } from './SettingsScaffold.jsx'
export { default as WalkthroughPanel } from './WalkthroughPanel.jsx'
export { default as ShortcutsOverlay } from './ShortcutsOverlay.jsx'
export { default as Logomark } from './Logomark.jsx'
