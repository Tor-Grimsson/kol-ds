---
title: Shell system
type: reference
status: canonical
created: 2026-08-14
updated: 2026-10-24
description: The application shell and its page scaffolds
aliases:
  - shell
  - kol-shell
  - app shell
  - nav rail
sources:
  - packages/shell/src/index.js
  - packages/shell/README.md
tags:
  - domain/compositions
  - domain/app-shell
related:
  - "[[../00-overview/01-package-topology|package topology]]"
  - "[[02-shells|reference shells]]"
  - "[[09-dashboards-system|dashboards system]]"
  - "[[12-section-system|section system]]"
  - "[[16-app-anatomy|app anatomy]]"
---

# Shell system — `@kolkrabbi/kol-shell`

The **application** shell set — the rail (a collapsed kol-framework `SideNav`
since 0.13.0), the AppShell layout root, and the page scaffolds an app is
built from. Lifted 2026-08-14 from the
hand-copied twins in kol-monitor ("Monitor") and kol-mirror ("Hall of
Mirrors"), whose copies had already drifted (shared dead import, shared
light-theme `GridCard` border bug, the same active-state ruling implemented
two different ways, twice-maintained shortcut lists disagreeing in both).

**The rail is the flat 48px column** (RailFlatGrabOpen, user ruling 2026-08-28 —
*"the div structure is super simple ok … it's 1 div parent and everything is just
in that container"*). This **reverses** the 2026-08-28 morning ruling that made
it a collapsed kol-framework `SideNav` (shell 0.13.0–0.15.0): on the rail that
replaced it the user's shape was *"impossible"* to reach. `NavRail` is one fixed
div — every child a direct child of it — and `AppShell` offsets the content by
`margin-left: var(--kol-shell-rail-width)`, the one live variable the rail
writes. **`kol-framework.css` is no longer required by the shell.**

**Grab to open** (*"when you grab it should not move the icons one pixel, only
reveal the title, and a chevron to see sub categories"* · *"when it opens it
should push the main content inside"*): the pill on the rail's edge — kol-r2b2's,
verbatim — drags the width between 48 and the rail's own open width,
`--kol-shell-rail-open` in kol-theme (264, 320 from 1536; until 2026-10-22 it read
kol-framework's `--kol-sidenav-w`, so apps without kol-framework.css opened at 264
everywhere), snaps to the nearer on release, toggles on a click. Every row is
`[32px rung][label][chevron]` clipped by its own width, so the icon column never
moves; the label is revealed by the clip and the content column follows the same
variable. **The rail has three presets** (2026-10-24, `NavRail preset`): `app` the studio rail described here, `site` the brand rail (brand.kolkrabbi.io), `workshop` the workshop rail (ui.kolkrabbi.io, kol-workshop's ShellSidebar registered under the name). `AppShell rail` names one and passes nothing else about the rail. **Sections, two word pairs** (2026-10-23, against fxr's labs rail; the words ruled 2026-10-24): an item with `sub` is a section. A section **expands** (`sections="expand"`) — its rows open under it in place as FULL rows, the same 20px glyph, `kol-helper-12` and oq-96 ink, each level 38px in so a child's glyph starts on its parent's label column — and **collapses**. A section **enters** (`sections="enter"`, the `app` preset's) — its rows replace the list under a Back row — and **exits** on Back. One rule decides which: a section whose rows hold sections of their own enters; a section whose rows are leaves expands. Chrome enters, Labs enters, Effects expands. The 12px-glyph, oq-64 L2 row of 2026-08 is retired. Nothing auto-expands. A sub row with no `icon` renders label-only on the label column.

`settings` and `themeToggle` left with the SideNav rail: Settings is a
`bottomItems` rung whose open/close is the consumer's `onNavigate`, and the
theme toggle lives on the settings page.

```js
import {
  AppShell, NavRail, useNavHidden,
  PageShell, PageBleed,
  ContentFilters, TabStrip, GridCard,
  SettingsScaffold, LabeledControlSection, LabelRow,
  WalkthroughPanel, ShortcutsOverlay (lives in kol-component since 0.228.0, re-exported), Logomark,
} from '@kolkrabbi/kol-shell'
```

## Contracts

**The rail's list fades at its foot (kol-shell 0.61.0, 2026-10-02).** `NavRail`'s rows sit in their own scroll region between the mark and the pinned bottom rows; a list longer than the window scrolls and runs out under a 3rem fade — the workshop rail's mask — instead of being cut by the edge. `fade` (default `true`) on `NavRail`, `railFade` on `AppShell`; `false` draws the list plain.

**`NavRail` lives in kol-component (2026-10-22, the one nav rail).** `NavRail`, `Logomark` and `RailSlotProvider` / `useRailSlot` moved out of kol-shell, which re-exports all of them — every import from `@kolkrabbi/kol-shell` keeps working. `NavRail variant="site"` is the site sidebar that was kol-framework's `SideNav`, carried class-for-class; `SideNav` is now that variant under its old name, on the retirement ledger, with react-router and the ThemeToggle wired in. A site needs no kol-shell for its sidebar — the `PageHeader` precedent.

**How a section opens is opt-in (kol-shell, 2026-10-06 · 2026-10-22).** Two independent choices, both off by default:

| Choice | Prop | Default | Opt-in |
|---|---|---|---|
| A section expands in place or enters under a Back row | `sections` on `NavRail` (`expand` · `enter`), the `app` preset's is `enter`; `railSections` on `AppShell` overrides | the rule: rows that hold sections enter, leaf rows expand |
| A section is also a page — a **folder note** | `to` on the section item | no `to` — the row only folds or enters | `to` — icon and label open the page, the chevron alone folds or enters (`RailSection`'s `to` split in kol-workshop) |

**Active icon is ink (kol-theme, 2026-10-22).** The site rail's active row icon is `var(--kol-sidenav-active-icon, var(--kol-surface-on-primary))` — no accent. A repo that wants a colour sets `--kol-sidenav-active-icon` on `:root`; nothing else needs overriding.

- **Router-agnostic** — `currentPath` + `onNavigate` props; render the
  router's element as children. No react-router dependency.
- **Icons** — resolved through the consumer's registry via Button's
  `iconComponent` seam; `ContentFilters` needs `filter` + `search` (in the DS
  set; the seam accepts any renderer).
- **Chrome in kol-theme** — `kol-components-shell.css`:
  `--kol-shell-rail-width` is **live** (theme ≥0.80.0) — the sidenav's width in
  its current state, `0px` while hidden — for consumers that offset a fixed
  element by it; `--kol-shell-page-pad` (48px);
  `.kol-shell-card-preview--{natural|compact|cover}`. The rail's own geometry,
  collapse and active rules are the sidenav's (kol-framework.css, the
  `.kol-sidenav-hop` atoms). `.kol-shell-rail` and the 2026-08-12 rail
  active-state rules retired with it.
- **`CatalogPage preset`** (shell ≥0.50.0, slide-variant-and-shelf-preset — user:
  *"this is a layout SET, I do NOT want to do this again"*): the whole page as
  one word. `catalog` is the defaults; `shelf` is a shelf of slide decks —
  capped, 3 tracks on a 280 floor, the `slide` card and row (component ≥0.178.0),
  stacked list, `kol-tone-secondary` on the root, the All / Recent view strip —
  and `toCard` returns fields and handlers (`bytes count cover onDownload
  onFavourite onDelete favourited`) while the page renders the slots. `app`
  (shell ≥0.75.0) is an app's saved files — the `app` card and row, three list
  columns, and the page's one Rename · Duplicate · Delete menu; `toCard` returns
  `verbs download menuItems date size media meta`. Opt-in. Explicit props win
  over a preset.
- **`StudioCreate`** (shell ≥0.77.0, plan-2026-10-23 § 3.4 — reference monitor): Create as a catalog of parts beside
  the case on the studio canvas, monitor's page made once. A page fixed on the case view and scrolling on the parts
  view; an editable masthead; `ContentFilters` with CASE ⇄ PARTS (`labels`), the parts' groups (`partGroups`, `exclusive`
  per group), LIST and GRID on `CatalogGrid` with `ContentCard` / `ContentRow variant="catalog"` (the Catalog's own grid,
  card and row — studio-hub review 2), Insert as the card's and the row's `actions` (an `ActionButton` in the plate,
  `onPlace`); the case on kol-component's `CanvasStudio` under the
  whole-page dot grid; the masthead is `PageHeader level="app"` with both editable fields on `SECTION_TEXT_LEVELS.app`'s
  title and lede classes (2026-10-23), the same header as Library's; a bottom bar with the zoom readout, the consumer's `caseActions` and `caseLink`. The case
  model, Add row and Set HP (`caseControls`), the parts and the workbench stay the consumer's; a consumer with its own
  viewport on `CanvasStudio` renders it through `canvas({ gridRef, view, onViewChange })`. `AppStudio`'s `create`
  slot takes it as children with `shell: false`.
- **`CatalogGrid`** (shell ≥0.77.0, studio-hub review 2 § 3.1): the catalog grid lifted out of `CatalogPage` — the
  measured track count (up to 6, never under 160, gap 24, `--kol-catalog-n` on the grid and reported through
  `onColumns`), `.kol-catalog-grid`, and the list grid (`listColumns`, never under 240; or `listLayout="stack"`).
  `CatalogPage` and `StudioCreate` both draw on it, so Create's parts and a Library's measure the same.
- **`StudioDetail`** (shell ≥0.78.0, plan home-library-detail-one-card § 3.1): the page a Library card opens — a module, a
  patch, a file — made once from data: `back` (a TEXT LINK `‹ Back` in the masthead's eyebrow, history back by default —
  never a pill, user 2026-10-24: *"what back is this"*), `title` · `subtitle` (`SectionText level="app"`), `description`
  (sentences), `sections` of rows `{ kind?, label, value?, hint? }` or `text`, `code` (the first lines, "View full source"
  in an overlay with download), `preview` (an image with click-to-expand, or the consumer's node — a rendered module
  front), `actions` `[{ label, onClick }]` as DS Buttons under a hairline, `notFound`. Routes are one scheme on every
  app: `/library/module/<id>` and `/library/patch/<id>`; a patch card opens its page, Load lives there. The prose is
  `kol-mono-12`, the section labels `kol-helper-14` — kol-monitor's page of 2026-09-02 was the source.
- **`CatalogPage mode`** (shell ≥0.77.0): `fixed` is the app tier's default (the `app` and `catalog` presets), `scroll` the site tier's (`capped`, `shelf`) — the page at the viewport's height, the
  catalog scrolling in its own region to the page's edge; Home's New and Walkthrough in the masthead's round button and its sheet (the phone More's rows, 2026-10-23), no foot row
  (plan-2026-10-23 § 4.12, his idea, shown on `apps/studio-hub` as Home B).
- **Grid geometry (documented default):** catalog grid = **up to** six tracks,
  gap 24 · list = up to four, gap 8 — a CEILING WITH A FLOOR, the same law
  `ContentCollection` carries (2026-09-01): the floor is `CatalogPage
  minColumn` (default 160) and the ceiling `maxColumns` (default 6, shell
  ≥0.49.0 — a three-deck shelf passes 3; the floor is a minimum, never a count — a 26-tile catalog's number; a shelf of three decks
  ), and no grid may take a track narrower than the floor. Six holds from
  1080px of container (160 × 6 + 24 × 5); a `width="capped"` page at 1280 is a
  920 container and renders FIVE at ~165 (measured, kol-client-olina
  2026-09-03). That is the law working, not the page failing — the six was
  ruled on monitor's full-bleed desktop, the floor is what keeps a narrower
  grid from slivers. The grid is `.kol-catalog-grid` (theme ≥0.138.0), the count is
  MEASURED by `CatalogPage` and published as `--kol-catalog-n` (a CSS-only
  count shipped in 0.137.0 and rendered one column in Firefox), and
  `ContentFilters`' first group reads the SAME number, so it sits over the first
  card at every width, not only at six. Corrected 2026-09-03: this line used to read
  `repeat(6, 1fr)` as if the count were fixed. `trailingActions`
  fills the header's right slot (`MediaLibrary`'s SELECT / FLAT slot) — never
  empty beside the divider (user, 2026-09-03). **A composition forwards the whole
  contract of what it composes** (user ruling 2026-09-03): `toCard`'s return is
  spread onto `ContentCard` / `ContentRow`, so every prop either takes is
  reachable per card — `media`, `ratio`, `date`, `size`, `meta`, `tags`,
  `selected`, `variant`, and the ones not written yet; `cardVariant` /
  `rowVariant` set the variant per page, `variant` per card beats them;
  `listLayout` is `grid` (four across, the ruling) or `stack` (one per line);
  `rowVariant` picks the row — `catalog` (default,
  the 36px no-thumb row the app tier was ruled on) or `file` (the 48px thumb
  row) for a catalog whose grid shows a cover. `width="capped"` also takes `.kol-page`'s 64px
  vertical rung (theme ≥0.136.0), so a capped catalog sits level with the
  `PageSection` pages beside it.
- **Shortcuts single-source:** one consumer array feeds both
  `ShortcutsOverlay` and the settings page's `LabelRow` map.
- **`AppShell navKeys`** (shell ≥0.12.0, user ruling 2026-08-28): Option+1…9
  navigates to the rail's nth **row** through `onNavigate` — never while typing,
  Option not Command (⌘1–9 is the browser's), matched on `e.code`. With a
  `logomark` that is the mark (`/`) then the items, the order on screen; without
  one, `items[n-1]` (shell ≥0.19.0 — until then it counted `items` only, so ⌥1
  landed on the second rung). Off by default; monitor · mirror · fxr pass it.
- **`PageHeader` left for `kol-component`** (component 0.174.0, 2026-09-03,
  page-header-one-masthead): the app-shell tier is rails, drawers and the
  portal frame, and a site with no shell could not take the masthead without
  the whole package. Same props plus `register`; kol-shell does not re-export
  it — the import path is the whole migration. Its contract (`actions` on the
  sub-line's baseline at no height, `subtitleMaxWidth`, `--kol-page-header-mb`)
  lives in [[12-section-system|section system]].
- **`PageShell` is a class, one gutter, one tier prop** (shell ≥0.43.0, theme
  ≥0.135.0 — two-page-scaffolds-one-job, kol-client-olina 2026-09-03): the
  geometry is `.kol-shell-page` (+ `--fixed`, `--capped`) in
  `kol-components-shell.css`, inline only for the `style` prop, so a consumer
  has a selector to reach. `--kol-shell-page-pad` aliases `--kol-pad-section-x`
  — the estate's ONE page-content ladder (20 · 32 · 48), which `.kol-page`
  already wore; the shell's own clamp had agreed with it only at 48 and stays
  as the fallback for a theme-only consumer. **`width`** is the tier: `bleed`
  (default) fills the window — the app tier; `capped` takes
  `--kol-container-max` and centres — the site tier. That is the one real
  difference between a shell page and a `.kol-page`, and `CatalogPage`
  forwards it so a site adopting the shipped catalog page does not silently
  get app geometry. Whether the two scaffolds stay two components after this
  is recorded as an open question, not ruled.
- **`PageShell` reserves the scrollbar gutter** (shell ≥0.18.0,
  PageShellScrollbarGutter): a page's content width used to depend on whether it
  scrolled — `scroll` mode gives the viewport scrollbar's width up, `fixed`
  keeps it — which is invisible until something downstream is measured in
  container units. `.kol-filters-first` is `calc((100cqw - 120px) / 6)`, so a
  scrollbar divided by six into the first filter group. One catalog column now
  means one thing on every surface of an app.
- **`useNavHidden`** — load-bearing seam: full-bleed routes (monitor's rack,
  mirror's studio) hide the rail at runtime and render their own nav header.
- **The page background steps up from a primary back (ShellPageWash, user
  ruling 2026-08-27 — shell ≥0.11.0):** `AppShell`'s content wrapper paints
  `surface-primary` always — the back of the back, in every app — and takes
  `pageWash` (a CSS color, e.g. `'var(--kol-fg-12)'`, default none), set as
  `--kol-shell-page-wash` on that wrapper; `PageShell` paints
  `var(--kol-shell-page-wash, var(--kol-surface-primary))`, and a page root
  that is not `PageShell` reads the same variable. It is a **transparent wash
  over primary, not a surface swap**: `secondary` is the module faceplate, and
  an opaque `oq-*` is the same pixel but hides the structure — the wash steps
  the lightness up and keeps it. Unset renders exactly as before. A prop rather
  than a token each app binds, because fxr's stylesheet is imports-only by rule.
  **One owner per pixel (2026-09-03):** the variable means what is LEFT to
  paint. `AppShell` hands the wash down and `PageShell` paints it; kol-framework's
  `SiteLayout` paints it on its own plane and hands down `transparent`, so a
  `PageShell` inside that frame paints nothing over it — both painting made
  `fg-02` render as two 0.02 layers on olina's /slide-deck. It is not
  `--kol-tone-ground`: the wash is a translucent film, the ground is the opaque
  color a floating surface paints, and CSS cannot flatten one into the other.

## App tier

Since 2026-09-29. Three decisions the apps review made once, in the Shell, so no app makes them again. The layers
they sit in are [[16-app-anatomy|the app anatomy]]'s.

**The phone.** `AppShell touch` is the touch policy, and under `drawerBelow` (768) two of its
values take the rail off the screen:

| `touch` | under 768 | for |
|---|---|---|
| `bar` | a **bottom bar** (`PhoneNav`, on kol-component's `MobileTabBar`): up to five destinations, else four + **More** — a sheet with the rest and Settings. The content pads by `--kol-shell-bar-h` | an app whose destinations are pages — the Hub's default |
| `pill` | the bar in `TabsRow`'s **pill shape** (2026-10-23, iOS Files beside it): rounded, centred, floated `TABBAR_PILL_INSET` (16px) off the edge, hugging its tabs, 28px glyphs, the active tab a filled pill; the same rows, the same More — and **the fold**: on More the bar folds into one round × at its right end, the sheet hugging its words beside it, bottoms on one line, in the pill's chrome; the ×, the scrim or a pick unfolds it. It FLOATS: the page runs under it (`--kol-shell-bar-h` is 0), and a scroll region's end and a fixed foot clear it by `--kol-shell-bar-clear` | the Hub reviewed beside `bar` — studio-hub's default |
| `drawer` | the rail off-canvas behind a hamburger, in over a scrim | an app whose rail carries a tool's own rows — the editor's labs categories ride it |
| `shell` (default) · `bare` · `overlay` | the rail regardless · no shell on a coarse pointer · the touch-device notice | older consumers, unchanged |

**The pill's look is a variant** (kol-shell 0.85.0, 2026-10-28 — *"if we only ship props then each repo has to tune to the same settiings and we get drift"*): `PhoneNav variant` — `nav` (no hairline, no shadow, the circle; `AppShell navVariant`'s default), `panel` (frame E: on top, foldable, More keeps the panel open), `transport` (the shadow; `TransportPill`'s look). `PHONE_NAV_VARIANTS` is the table; a prop still overrides. **More is the whole nav** — every rail row, the pinned foot included, then the page's actions — filtered by `moreItems` (paths, or a predicate). **`dock`** (kol-shell 0.86.0) is the pill on a desk — md and up, at the content's bottom-left (64 in from the rail, 64 up), no More. **A signed-out Home** (`home.signedOut`, or `home.stage` with no files) has no catalog: the `stage` full-bleed behind, the mark top-left alone, the round + with New, Walkthrough and Sign in, `home.chromes` as the dock on a desk and as the pill on a phone, where More lists the rail — frames A2 · B2 of fxr's plan 44.

Both phone navs ship (2026-10-23 — *"fxr on mobile uses the bottom a lot … we should ship both versions"*). The
bar's labels wear the rail's row type and ink — `kol-helper-12 uppercase`, oq-64 at rest, oq-96 on the route, the
20px glyph — from one constant (`hooks/railRow.js`) that `NavRail` and `TabsRow`'s phone tab both read.
`barHiddenOn` (paths) lets the bar step aside for a tool: on one, the bar unmounts and `--kol-shell-bar-h` is 0,
so the canvas takes the full height (studio-hub: `/studio` and under `/chrome`). Below `md` a `CatalogPage`
draws rows — the preset's row, no LIST / GRID strip (`phoneLayout="grid"` opts back) — and `HubHome`'s
`touch.doors` are an opt-in 2 × 2 of large buttons above them (`CatalogPage lead`; fxr's chromes). `PageShell`'s
heights are `100dvh` with `100vh` as the fallback, so a fixed page's foot sits above iOS Safari's chrome.

No app fixes its own phone nav: the hamburger over a masthead's controls (media-hub) was the bug
that made this the Shell's job. `barItems` overrides what the bar lists; `shell` lives in
`apps/shell` with ten placeholder pages, so More is always exercised.

**The masthead.** `AppShell masthead` — `display` (the display voice, no description: MEDIA,
CURVES) or `mono` (the mono title with its description) — is the app's ONE header voice, read from
context by every page inside: `PageHeader`, the Hub's Home and Settings, `CatalogPage`, a tool's
own title. **No default** (the user, revising D3): unset, every page renders as its own props say,
so a bump moves nobody's headers — fxr · mirror · monitor stay mono. A Catalog with no Shell takes
`header.masthead` itself. A page that overrides the app's voice is the thing the render gate is
for. **Superseded for `PageHeader` 2026-10-18** (kol-component 0.276.0): it ignores the masthead and
renders the one Round 11 header; `CatalogPage`, the Hub's pages, Settings, Dev and AppStudio's create page
default to its `app` level (display-01 at 46 / 60 — kol-shell 0.72.0, kol-component 0.279.0).

**The Hub is opt-in, page by page.** `AppHub` = the Shell + the standard pages around a tool:

| page | prop | without it |
|---|---|---|
| Home — a `CatalogPage` on `preset="app"`, drawn by `HubHome` from DATA: `files` (with `tags` and `details`), the handlers, `filterGroups`, `action` (HubHomeContract, 2026-10-23 — no `toCard`, no passthrough, files only, the app row three across; the cog opens the file's info rail; see [[16-app-anatomy\|app anatomy]]) (the mark goes here) | `home` | no Home: `homePath` renders the tool and the mark goes there (media-hub: the column browser IS the app) |
| Settings, pinned at the rail's foot — three tiers, opt-in (2026-10-23): the rail (default; `SettingsPanel` over `sections` as TYPED rows — `type: 'choice' | 'switch'`, a text `value`, a section's `note`; the Hub draws every control and string, no JSX reaches it (2026-10-24); the tab row is exactly Settings · Shortcuts · About · Repo, the three drawn by the Hub on every app, no app tab; the theme toggle (kol-framework's, drawn by the Hub) and a live reset — the theme back to the system, then the app's — in its footer; no route), `page: true` (`HubSettings` at `settingsPath`, two columns from `lg`, no filter bar, the gear opens the drawer), `filters: true` (the page keeps its filter bar, tabs and search) | `settings` | no row, no route, no `,` key |
| the shortcuts sheet, every section open on arrival and Collapse all folding them (2026-10-23) | `shortcuts` + `shortcutsKey` (`s`; `null` = off) | an empty sheet |
| the walkthrough | `walkthrough` (Home's button) | no button |
| the search modal on ⌘K / Ctrl+K, one `CommandOverlay` over Files (Home's `files`, Enter opens), Pages (the rail) and Shortcuts (the keymap as folds, every one open on arrival, the footer reading Collapse all) (2026-10-23) | always on; `home.files` fills Files | Pages and Shortcuts only |
| Media, a row at the rail's foot opening `MediaLibrary variant="picker"` — the column browser with the preview pane, Cancel and Use, mirror's — over the app's client (2026-10-23) | `media` (`{ client, accept?, onSelect? }`) | no row |
| Sign in, the user row at the foot (a person while out, a cloud while in); the Hub asks in the DS dialog — the password prompt, then `onPress(password)`; signed in, the sign-out confirm, then `onPress(null)` (fxr's flow, 2026-10-23) | `signIn` (`{ signedIn, onPress(password \| null) }`) | no row |

The Hub mounts `ModalProvider` (2026-10-23): the file rail's Delete confirm, the Rename prompt and the Sign in
prompt are the DS dialog on every Hub; a consumer's own provider above it keeps working.

When a tool sits in a Hub, its own settings gear hands over to the Hub's page (`onOpenSettings`) —
one settings object, one place. Alone, a tool keeps its gear.

No `kol-helper-*` on a sentence — `pnpm validate:helper-text` (in `pnpm validate`, 2026-10-23) fails on an element
whose literal class carries a helper and whose own literal text runs five words, holds a sentence break or ends with a
period, or on a helper told to wrap ([[../01-foundations/03-typography|typography]], the fault line).

Every exported view has to be mounted somewhere a person can open it — `pnpm validate:views`
(V1). A Shell feature with no app to show it on is a feature nobody checks.

## Stays per-app

Domain surfaces (rack, studio, detail pages), accent bindings, product names,
logomark files, nav arrays, walkthrough/shortcut/settings **content**,
touch-device gates. Data and copy are consumer-injected — the set never
fetches.
