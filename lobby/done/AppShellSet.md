---
component: AppShellSet
source: kol-monitor/src/components/AppLayout.jsx#L1-L21 + kol-mirror/src/components/AppLayout.jsx#L1-L23 (full inventory per piece below)
staged: 2026-08-14
status: draft
deps: [Button, Icon (via iconComponent seam), Tag, Divider, ThemeToggle, Logomark]
---

# AppShellSet

## Purpose

The shared application shell — rail + layout + home/library/settings page scaffolds — currently hand-copied between **kol-monitor** ("Monitor") and **kol-mirror** ("Hall of Mirrors"), with more consumers planned. This is a **bundled set**, not one component: the pieces compose into one coherent app chrome and should version together.

**Placement recommendation (consumer's, DS decides):** a **sibling package** — working name `@kolkrabbi/kol-shell` — NOT a kol-framework variant. kol-framework's surface (SideNav, footer, heroes) is *site* chrome; this set is *application* chrome. Different register, different growth rate (more consumers → more page archetypes → own version line). The set composes kol-framework's ThemeToggle where it overlaps — consumed, not duplicated. Note: kol-framework's `SideNav` takes a two-level `navTree` (`{id, label, icon, to?, pages?}`); this rail is deliberately flat `{icon, path, label}` — they are different components, not variants of each other.

## Why a set, and why now — the drift is already shipped

Two independent repo sweeps (2026-08-14) found:

- kol-mirror's rail carries the literal comment "Ported from kol-monitor's NavSidebar" (`NavRail.jsx:9`); its PageHeader "Ported verbatim" (`PageHeader.jsx:1`); its ShortcutsOverlay "Copied from kol-monitor" (`:2-3`).
- kol-monitor's `ContentFilters.jsx:11` docstring still references a *third* product's surfaces ("Collections, Specimens, Typefaces, Work") — this shell has been copy-ported at least twice already.
- **Both repos share the same dead import** (`ViewToggle` in `ContentFilters.jsx:5`) and **the same light-theme bug** (`GridCard` hardcodes `borderTop: '1px solid rgba(255,255,255,0.06)'` — monitor `GridCard.jsx:52`, mirror `GridCard.jsx:38`).
- The nav-active ruling is implemented **two different ways** for the same visual result: monitor via inline `backgroundColor` (`NavSidebar.jsx:36`, no `aria-current`), mirror via `aria-current="page"` + a consumer CSS override of DS canon (`mirror-overrides.css:65-68`).
- **Each repo has internally drifted duplicate shortcut tables** (overlay vs settings page: monitor 16 vs 14 rows, mirror's two copies disagree on row wording).
- Both repos carry the identical `./src/*` pnpm patch on kol-framework solely to deep-import ThemeToggle/theme.js past the barrel.

## The set — piece inventory

### 1. AppShell (layout root)

- **Anatomy:** `NavHiddenContext.Provider` → `<NavRail hidden={navHidden} …/>` + `<div style={{marginLeft: navHidden ? 0 : 48}}>{outlet/children}</div>`. No header, no footer. Identical 21/23-line files in both repos.
- **Source:** monitor `src/components/AppLayout.jsx:6-18` · mirror `src/components/AppLayout.jsx:16-21` (+ `navHidden.js:6-7` split for react-refresh).
- **Props:** `navItems`, `bottomItems`, `logomark: {svgUrl, title}`, children (or router `Outlet` — keep router-agnostic: accept children, let the consumer place `<Outlet/>`).
- **Recreation notes:** the `48` is hardcoded in two places per repo — mint a token (`--kol-shell-rail-width: 48px`) read by both rail and offset. Export `useNavHidden` — full-bleed routes (monitor's rack, mirror's studio) flip it at runtime; this is a load-bearing seam, keep it a context.

### 2. NavRail + RailItem

- **Anatomy:** fixed left rail — `position: fixed; inset-block: 0; width: 48; zIndex 70`, `bg-surface-tertiary border-r border-fg-04`, `paddingTop: 16, gap: 8`, flex column. Top: clickable Logomark (`size 20`, → `/`). Then nav items, `flex: 1` spacer, `<ThemeToggle label={false}/>`, bottom items (Settings).
- **Item shape (the data contract, both repos):** `{ icon: string, path: string, label: string }` — icon resolved through the consumer's `Icon` via the DS Button's existing `iconComponent` seam.
- **RailItem:** `<Button iconOnly={icon} iconSize={20} variant="nav" size="md"/>`; active match `path === '/' ? pathname === path : pathname.startsWith(path)`.
- **The active-state ruling (user, 2026-08-12) — must be carried natively:** ink `--kol-oq-96` in **every** state (DS's rest `--kol-oq-64` is overridden in both repos); hover = the `--kol-oq-04` wash; active route = **that wash held on**; never `selected`/`pressed`. Current DS canon (`kol-components-atoms.css:322-324`) only brightens ink on `[aria-current="page"]` — the set (or a kol-theme bump beside it) should make `aria-current="page"` render the held wash + oq-96 ink so both consumers delete their overrides. Mirror's mechanism (semantic `aria-current` + CSS) is the right one; monitor's inline style dies on adoption.
- **Source:** monitor `NavSidebar.jsx:8-65` · mirror `NavRail.jsx:14-67`.
- **Recreation notes:** rail z-index should join the DS ladder (`--kol-z-nav` tier), not raw `70` — mirror already uses the tokens elsewhere, monitor uses raw numbers.

### 3. PageShell (page scaffold primitive)

- **Anatomy:** `padding: '48px 48px'; min-height (or height): 100vh; display: flex; flex-direction: column` + `bg-surface-primary`.
- **Why:** currently re-declared **by hand on every page** — 6 pages in monitor (`HomePage.jsx:73`, `LibraryPage.jsx:72`, `CreatePage.jsx:133`, `SettingsPage.jsx:127`, both detail pages), 4 in mirror. The single most-duplicated block in both shells.
- **Props:** `scroll` (min-height:100vh + natural scroll) vs `fixed` (height:100vh + inner `flex:1 overflow:auto` — the settings idiom). Full-bleed slot for embeds that break the gutter (monitor's `margin: '0 -48px'` rack bleed, `CreatePage.jsx:219`).

### 4. PageHeader

- **Anatomy:** `h1.text-fg-96.kol-heading-sm` + subtitle `p`, block `marginBottom: 40`.
- **Divergence to reconcile:** monitor subtitle = `kol-text-sm`; mirror = `text-fg-48 kol-mono-14`. Pick one (mirror's mono reads as the newer voice); consumer overrides via className if needed.
- **Also:** both Settings pages *re-implement this markup inline* because their title is tab-driven (`SettingsPage.jsx:128-133` monitor, `:105-110` mirror) — the recreated component just takes `title`/`subtitle` as values, which kills that fork.
- **Source:** monitor `src/components/PageHeader.jsx` (8 lines) · mirror same, "ported verbatim".

### 5. ContentFilters (the catalog organism)

- **Anatomy (279 lines, near-identical in both):** header row (title + count `"N of M"` gated by `showCountOnlyWhenFiltering`) · filter-chip panel (`Tag size="md"`, active `border-fg-32` / rest `border-fg-08`, groups `{label, key, values}`, `mutuallyExclusiveFilters`, active set = `Set` of `"key:value"`) · **expanding pill search** (28px circle → 200px field, width 600ms + bg 400ms `cubic-bezier(0.16,1,0.3,1)`, Escape/blur collapse, `searchKeys` default `['label','name','title','type']`) · view-mode spans · layout toggle spans (uppercase, `letterSpacing: 1`) · `renderItem(filteredItems, viewMode, layout)` render-prop.
- **Source:** monitor `src/components/organisms/filters/ContentFilters.jsx` · mirror `src/components/organisms/ContentFilters.jsx`.
- **Recreation notes:** it does four jobs; consider splitting into FilterBar + the render slot on recreation — but keep the one-organism API if splitting breaks the simple consumer story. Drop the dead `ViewToggle` import (both repos). The view-mode span strip and the settings tab strip (piece 7) are the same idiom — extract one `TabStrip` atom (`kol-helper-14`, active `text-fg-96`, rest `text-fg-32 hover:text-fg-48`) and use it in both places.
- **Grid geometry law (both repos, both pages):** grid = `repeat(6, 1fr)` gap 24 · list = `repeat(4, 1fr)` gap 8. Belongs beside this organism as a documented default (or a `CardGrid` helper), not re-typed per page.

### 6. GridCard

- **Anatomy:** default = **A4 card** `aspectRatio: '1 / 1.41421'`, `borderRadius 4`, `bg-fg-04 hover:bg-surface-tertiary border border-fg-04`, 300ms `cubic-bezier(0.16,1,0.3,1)`; clipped preview pane on top; bottom label plate `bg-surface-primary` `padding '12px 16px'` — title `kol-helper-14 text-fg-96`, detail `kol-helper-8 text-fg-32`. `variant="list"` = 36px row, `bg-surface-tertiary hover:bg-fg-04 rounded border border-fg-04`, title `kol-helper-12 text-fg-64`.
- **Monitor-only extra:** `expanded` state — `span 2`/`span 2` (2×2 in the 6-col grid), `row-reverse`, preview `flex: 0 0 50%`, `expandedContent` pane; neighbour-hiding computed consumer-side. Include as an opt-in variant; the hide-set math stays consumer.
- **Preview fits (monitor `components.css:20-37`):** `--natural` `scale(0.5)` · `--compact` `scale(0.3)` · `--cover` `object-fit: cover`, `transform-origin: top left` — ship with the card.
- **DROP on recreation:** the hardcoded `borderTop: '1px solid rgba(255,255,255,0.06)'` (both repos) → a `--kol-fg-*` token. This is a live light-theme bug in two shipped apps.
- **Source:** monitor `src/components/atoms/GridCard.jsx` · mirror same path.

### 7. SettingsScaffold

- **Anatomy (identical idiom, both repos):** tab strip (see TabStrip, piece 5) driven by `TABS`/`TAB_META` (per-tab title + subtitle feed the header) · `<Divider className="mb-6"/>` · body `flex:1 overflow:auto` · sections: `h2.text-fg-80.kol-helper-16` `marginBottom: 16`, rows `flex gap-12` with **label column `width: 160, flexShrink: 0`** (`text-fg-48 kol-helper-12`), value `text-fg-32 kol-helper-12`; `alignItems: center` for control rows, `baseline` for text rows.
- **Data-driven:** sections/rows/tabs are content — props, not markup. The one standard control: `<ThemeToggle fill="subtle" size="sm"/>` in the Display row (identical incl. the "on a page the toggle IS a button" comment in both repos).
- **Shortcuts single-source:** both repos hand-maintain the shortcut list twice (settings + overlay) and both pairs have drifted. The scaffold's Shortcuts section and the ShortcutsOverlay (piece 9) must render from **one consumer-supplied array**.
- **Source:** monitor `src/pages/SettingsPage.jsx` · mirror `src/pages/SettingsPage.jsx`. The 160px label-row idiom also appears in monitor's `ColorPickerPage.jsx:10` — it's a de-facto standard, name it (`LabelRow`).

### 8. WalkthroughPanel

- **Anatomy:** absolutely-centred card — `top/left 50%`, `translate(-50%,-50%)`, `maxWidth: 960`, `zIndex: 10` — chevron Buttons either side, text column + illustration pane, last step `{actions: true}` renders CTA Buttons. Steps = hardcoded 6-entry array in both repos; becomes a `steps` prop (illustration as a render slot — monitor uses an SVG glob loader, mirror a JPEG).
- **Source:** monitor `HomePage.jsx:11-45, 80-135` · mirror `HomePage.jsx:18-55, 84-136`.

### 9. ShortcutsOverlay

- **Anatomy:** the shared backdrop idiom — `fixed inset-0 bg-fg-inverse-08` + `backdropFilter: blur(2px)` + centred panel (`padding 24, borderRadius 4`), 2-col pairs grid `gap '10px 62px'`, Esc + backdrop-click close. `shortcuts` = `[{keys, label}]` prop (see single-source note in piece 7).
- **Source:** monitor `src/overlays/ShortcutsOverlay.jsx` · mirror `src/components/overlays/ShortcutsOverlay.jsx` ("copied from kol-monitor").
- **Recreation notes:** the backdrop idiom itself repeats across 3 monitor overlays — worth a `Scrim` primitive. Use `--kol-z-*` tokens (mirror does; monitor's raw `z-50` currently sits *below* its own rail's 70 — a live stacking bug the tokens prevent).

## Out of scope (stays per-app)

- Domain surfaces: monitor's rack/⌘K module palette (needs rack context), mirror's studio sidebar/MobileDrawer/MobileHeader, detail pages.
- Accent bindings (`--kol-accent-primary` teal etc.), jack tokens, product names, logomark files, nav arrays, walkthrough/shortcut/settings *content* — all props or consumer CSS.
- monitor's TouchDeviceOverlay — generic in principle ("Desktop recommended" + localStorage dismissal), but mirror solves touch in CSS; leave it consumer-side for now, revisit if a third consumer wants it.
- Theme boot re-stamp (`main.jsx` applyTheme before first paint, both repos) — 4 lines, document as the canonical snippet in the set's README rather than shipping a helper.

## Adoption payoff (why both consumers bump on ship)

Both repos delete: their rail + layout + PageHeader + ContentFilters + GridCard + ShortcutsOverlay copies, their nav-active CSS/inline overrides, and — if the set package deep-imports or re-exports ThemeToggle properly — potentially the `./src/*` kol-framework pnpm patch both repos carry today. kol-mirror additionally deletes its dead Workshop* shell (broken `@kol/ui` imports) in the same sweep.

## Resolution — 🟢 closed 2026-08-14

Shipped **@kolkrabbi/kol-shell 0.1.0** (registry-verified) — sibling package as
recommended, NOT a kol-framework variant — plus **theme 0.41.0** (the chrome:
`kol-components-shell.css`) and **framework 0.20.0** (`./src/*` subpath exports
— the pnpm patch both consumers carry dies on the bump).

- All 9 pieces recreated from the twin sources: `AppShell` + `NavRail` +
  `useNavHidden` (context in its own file, react-refresh), `PageShell`/`PageBleed`,
  `PageHeader` (mirror's mono voice), `ContentFilters` + `TabStrip` (the extracted
  strip idiom), `GridCard` (monitor's full cut incl. `expanded` + previewFit),
  `SettingsScaffold`/`SettingsSection`/`LabelRow`, `WalkthroughPanel` (steps as
  content), `ShortcutsOverlay` (`shortcuts` prop — single-source), `Logomark`.
- Router-agnostic (`currentPath` + `onNavigate`); icons via Button's
  `iconComponent` seam; tokens minted: `--kol-shell-rail-width`,
  `--kol-shell-page-pad`.
- **The 2026-08-12 active-wash ruling carried natively**, scoped to
  `.kol-shell-rail` (ink oq-96 every state; `aria-current="page"` = the oq-04
  wash held on) — the global `.kol-btn-nav[aria-current]` brightness-only rule
  (0.11.7, site navs) untouched.
- Shipped drift fixed on recreation: dead `ViewToggle` import, GridCard's white
  `borderTop` light-theme bug → `border-fg-04`, `capitalize`/`uppercase`
  transforms dropped (no-auto-casing law; labels authored at the call site),
  rail `z-70` → `--kol-z-sticky` (above content, BELOW overlay/modal — the
  ticket's `--kol-z-nav` at 1000 would put the rail above modals, the same
  stacking bug mirrored), mirror's `bg-container-secondary` hover (a class no
  theme defines) → `bg-fg-04`.
- Docs: `docs/documentation/04-compositions/11-shell-system.md` · ARCHITECTURE
  §3 eleventh package · roster/classification entries (3 namesake exemptions:
  AppShell/ContentFilters/GridCard are different components sharing names
  across tiers, both stay on the roster).

📌 Remainders are the consumers': kol-monitor + kol-mirror adopt (delete local
copies → `_tmp/`, swap to `aria-current`, single-source shortcut arrays, retire
the kol-framework pnpm patch); mirror also sweeps its dead Workshop* shell.
