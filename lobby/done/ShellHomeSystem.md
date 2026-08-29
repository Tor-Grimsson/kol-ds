---
component: ShellHomeSystem
source: kol-fxr/src/pages/HomePage.jsx · LibraryPage.jsx · SettingsPage.jsx · AppLayout.jsx (2026-08-27 state)
staged: 2026-08-27
status: draft
deps: [PageShell, PageHeader, ContentFilters, ContentCard, ContentRow, SettingsScaffold, SettingsSection, AppShell, ThemeToggle, Button]
---

# ShellHomeSystem — the app tier fxr · mirror · monitor share, shipped once

## Purpose

Home · Library · Settings under the `AppShell` rail is ONE system three apps
write by hand. On 2026-08-27 kol-fxr was rebuilt to match kol-monitor's home
page by page; the result is the reference. Everything below was needed to get
there and belongs in the DS so mirror and monitor consume it instead of
carrying copies. Ordered by weight.

## The items

### 1. `CatalogPage` scaffold (kol-shell)
`PageHeader` → `ContentFilters` (title · filter · search · RECENT/SAVED strip
in the header, LIST/GRID below the divider) → `renderItem` grid: cards
`repeat(6, 1fr)` gap 24 / rows `repeat(4, 1fr)` gap 8, `ContentCard` /
`ContentRow variant="catalog"` → bottom action row (`Button variant="grey"
size="md"`, `marginTop: 48`, `alignSelf: flex-start`).
fxr `HomePage.jsx` and `LibraryPage.jsx` are this page twice (~80 lines each);
monitor `HomePage.jsx` is it a third time on `GridCard`. Seams: `items`,
`filterGroups`, `views` (RECENT/SAVED semantics are the consumer's — fxr sorts
by `savedAt`), `toCard(item) → { title, detail, media, actions, onClick }`,
`actions` (the bottom row), `walkthrough` steps (monitor's panel toggle).

### 2. `SettingsShortcuts` molecule (kol-shell)
Input: the `[{ section, items: [{ id, label, combo }] }]` array
`ShortcutsOverlay` already accepts. Render: `grid grid-cols-6 grid-rows-2
grid-flow-col gap-x-12 gap-y-6` — six columns, two sections per column,
column-first — each section an eyebrow label (`kol-eyebrow`, strong ink,
8px under) over `LabelRow`s. fxr `SettingsPage.jsx` `SettingsContent`;
monitor renders the same data as a flat list.

### 3. Title voice + seams — `PageHeaderMonoTitle` (CLOSED same day: kol-shell 0.7.0–0.7.2 · kol-theme 0.67.0; adopted in fxr — listed for completeness)
`PageHeader` needs a mono voice (JetBrains 32 / 500, the app masthead);
`SettingsScaffold` must forward it; `SettingsSection` needs a title seam —
ruled `fg-96` on `kol-helper-14` (the tab strip's role), currently baked
`text-fg-80 kol-helper-16`. fxr carries three wrapper overrides
(`className="[&>h1]:font-mono"`, a `contents` div with `[&_h1]` / `[&_h2]`
utilities) until this lands.

### 4. `.kol-eyebrow` drops its baked colour
`kol-type-roles.css:285` — `color: var(--kol-fg-64)` on the role. It loads
after every ink utility in the same layer, so `text-strong` beside it loses.
Type roles set type, not ink (`kol-helper-14` sets none). Consumers that
relied on the 64 pass `text-body`.

### 5. Catalog card, image-led hover
A catalog card with real media should zoom (`kol-media-zoom`, 1.06) and step
its frame `fg-04 → fg-16` on hover. Today the variant only steps its fill to
`surface-tertiary`, which drowns the `fg-04` border, and `MEDIA.catalog` has
no zoom; fxr passes `zoom` + `className="hover:border-fg-16"` on every card.
Default, or one flag (`imageLed`).

### 6. Catalog card `detail` single-line by default
`kol-mono-10` wraps; three cards with 1/3/2-line blurbs land their plates at
different heights and the media misaligns. fxr passes
`detailClass="kol-mono-10 text-meta truncate"` everywhere. Truncate in the ramp.

### 7. `nav-*` rail glyphs into kol-icons
`nav-library` · `nav-settings` · `nav-rack` · `nav-create` (24px, 1.5 stroke,
`currentColor`) live in kol-monitor `src/icons/svg/00-rack/`; fxr copied two
into `src/icons/` and runs `registerIcons()` at boot. Both rails should run
on the packaged set with no registration.

### 8. `AppShell`: rail toggle key + touch policy
(a) a key that toggles `navHidden` and a reset on route change — fxr binds
`\` once in `AppLayout.jsx` (`RailToggleKey`), monitor does it through its
sidebar. Prop: `railToggleKey`. (b) touch-primary devices: monitor has a
local `TouchDeviceOverlay`, fxr renders the routes with NO shell when
`isMobileDevice() && !wantsDesktop()`. `AppShell` should own the policy.

### 9. Theme boot snippet from kol-framework
The no-flash `<script>` in `index.html` (stamp `data-theme` from
`localStorage['kol-theme']` when light/dark, else nothing) is hand-written per
app against the framework's own key. Ship it — a documented snippet or a
string export.

### 10. `SettingsLinks` (About / Repo)
Both apps hand-write the same link list (label `kol-helper-12 text-fg-32`
width 72 · external `<a>` `text-fg-64 hover:text-fg-96 hover:underline`) and
the same "Kolkrabbi Vinnustofa / 2026" footer under `SettingsScaffold`. One
molecule, or presets on the scaffold.

### 11. Neutral `::selection` for the app tier
`kol-framework.css:36` paints selection `--kol-accent-primary` (brand yellow).
An app is not a site; fxr overrides with `selection:bg-fg-24
selection:text-[inherit]` on `#root`. A framework flag or an app-tier default.

### 12. kol-component `opentype.js` peer
`^1.3.4`; consumers are on 2.0.0 and `pnpm install` warns every time. Allow 2.x.

### 13. Logomark from kol-brand
`favicon-01.svg` (the raven, `currentColor`) is copied repo to repo
(`public/svg/favicon-01.svg` in monitor and fxr). Serve it from kol-brand.

## Recreation notes

kol-fxr on 2026-08-27 is the reference render for 1, 2, 5, 6, 8, 10. Nothing
here is a new pattern — every item is a thing three apps already do by hand.
Deprecated `GridCard` / `TabStrip` are not imported by fxr any more; the DS
retires them on its own clock.

## ✅ RESOLUTION — 2026-08-27 · kol-shell 0.8.0 · kol-component 0.99.0 · kol-theme 0.68.0 · kol-icons 0.20.0 · kol-framework 0.28.0 · kol-brand 0.1.3 · kol-foundry 0.8.1

All thirteen. (1) CatalogPage in kol-shell — PageHeader → ContentFilters (view strip in the header, LIST/GRID below) → the grid (cards repeat(6,1fr) gap 24 / rows repeat(4,1fr) gap 8, ContentCard / ContentRow catalog) → the action row; toCard(item, { view, layout }) is the contract, walkthrough the panel. (2) SettingsShortcuts — six columns × two, column-first, eyebrow over LabelRows. (3) shipped earlier today (shell 0.7.0–0.7.2). (4) .kol-eyebrow carries no ink — text-strong wins beside it (measured 0.8). (5) a catalog card with media zooms 1.06 and steps its frame fg-04 → fg-16 on hover by default (measured). (6) catalog detail truncates in the ramp. (7) nav-create/home/library/rack/settings in kol-icons — no registerIcons. (8) AppShell railToggleKey (never while typing; rail returns on route change) + touch='bare' (no shell on coarse pointer unless localStorage kol-desktop='1') / 'overlay' (TouchDeviceOverlay promoted). (9) THEME_BOOT_SCRIPT exported from kol-framework. (10) SettingsLinks + SettingsColophon. (11) .kol-app-shell ::selection neutral — AppShell wraps its tree. (12) opentype.js peer ^1.3.4 || ^2.0.0 on component + foundry. (13) kol-brand/svg/favicon-01.svg. Rendered on the showcase: catalog page with the mono masthead, strip, 6/4 columns, hover, truncation; shortcuts grid; links.

**Remainder here:** none — kol-fxr bump everything listed; HomePage/LibraryPage → CatalogPage with toCard; SettingsPage → SettingsShortcuts + SettingsLinks + SettingsColophon; AppLayout → AppShell railToggleKey='\\' touch='bare' and delete RailToggleKey + the mobile gate; drop registerIcons and src/icons; index.html <script>${THEME_BOOT_SCRIPT}</script> (or paste it); drop the selection override; logomark from @kolkrabbi/kol-brand/svg/favicon-01.svg; delete the [&>h1]/[&_h1] wrappers.

