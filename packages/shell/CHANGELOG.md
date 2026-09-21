# @kolkrabbi/kol-shell

## 0.51.0 — 2026-09-03

- **`ShortcutsOverlay` and `TouchDeviceOverlay` wear `.kol-overlay-scrim`**
  (overlay-scrim-outliers, kol-client-olina; user, opening the shortcuts
  sheet: *"wow where does this scrim come from? local?"*). Both drew their own
  — an 8 % inverse wash plus a 2px blur — after the 2026-09-01 no-blur ruling
  and the one-tint-48 class. `TouchDeviceOverlay`'s literal `zIndex: 100` is
  `var(--kol-z-modal)`.

## 0.50.0 — 2026-09-03

- **`CatalogPage preset="shelf"`** (slide-variant-and-shelf-preset,
  kol-client-olina; user, after building /slide-deck by hand: *"this is a
  look I DO NOT want to do this again… this is a layout SET"* · *"freeze this
  so I can use AS IS again"*). The whole page as one word: `capped`, 3 tracks
  on a 280 floor, `slide` card and row (component 0.178.0), stacked list,
  `kol-tone-secondary` on the root, the All / Recent view strip. `toCard`
  returns the deck's fields and handlers — `title date bytes count cover href
  onNavigate onDownload onFavourite onDelete favourited` — and the page
  renders the slots (the media admin's idiom: download on the image, star and
  trash on the plate, `SizeOrDownload` on the size); the consumer writes no
  JSX for actions. `catalog` is today's defaults, byte-identical. Explicit
  props win over the preset. Peer: component ≥0.178.0.

## 0.49.0 — 2026-09-03

- **`CatalogPage maxColumns`** (default 6, the ruling) — the grid's ceiling as
  a prop, read by the observer in place of the literal (kol-client-olina
  2026-09-03; user, on a three-deck shelf at five tracks: *"why are the cards
  so small? they could use 2 columns each"*). Olina had raised `minColumn` to
  force three, which is backwards — the floor is a minimum, never a count.

## 0.48.0 — 2026-09-03

- **`CatalogPage` measures its track count and publishes it as
  `--kol-catalog-n`** (with theme 0.138.0). 0.46.0 + theme 0.137.0 had the
  theme compute it with `round()` over a length ÷ length, which Firefox
  rejects: every catalog rendered ONE full-width column (user: *"is this
  supposed to be a joke? huge card"*). A ResizeObserver on the grid now
  computes `min(6, floor((W + 24) / (minColumn + 24)))` — the same number the
  old `auto-fill` resolved to — and the theme's grid and filter-row rules
  read it with a fallback of 6. Peer: theme ≥0.138.0; pair the two.

## 0.47.0 — 2026-09-03

- **`CatalogPage` forwards the whole contract of what it composes** (user
  2026-09-03: *"why wouldn't we as standard practice ALLOW VARIANT CHANGE EVERY
  TIME WE USE THOSE CONTENT CARDS?"*). Five tickets on this file in one day
  were one defect — a key missing from `toCard` because no earlier consumer
  had needed it (`ratio`, `trailingActions`, `rowVariant`, `date` / `size`,
  the list container). `toCard`'s return is now SPREAD onto `ContentCard` /
  `ContentRow`: every prop either takes is reachable per card, including the
  ones not written yet; `variant` per card beats the page's **`cardVariant`**
  (new, default `catalog`) / `rowVariant`; `fit` keeps `cover`. The `file`
  row's `date` · `size` · `meta` · `selected` arrive this way (user, on a deck
  row beside the media admin's: *"this is NOT file row"* — two of its slots
  never reached it). **`listLayout`**: `grid` (default — monitor's four-across)
  | `stack` (one row per line, the media library's shape). Default-preserving
  throughout.

## 0.46.0 — 2026-09-03

- **`CatalogPage` draws its grid with `.kol-catalog-grid`** (theme 0.137.0)
  instead of an inline `auto-fill`, and sets `--kol-catalog-min` from
  `minColumn` on the page — so `ContentFilters`' first group reads the same
  track count the grid renders (CatalogFilterFirstGroupTrackCount,
  kol-client-olina): on a capped page the group sits over the first card
  again. Same tracks at every width as before. Peer: theme ≥0.137.0.

## 0.45.0 — 2026-09-03

- **`CatalogPage rowVariant`** (kol-client-olina 2026-09-03). The list branch
  rendered `ContentRow variant="catalog"` — the 36px GridCard row, `thumb: 0` —
  so the `media` and `ratio` 0.44.0 forwarded reached a row that cannot draw
  them (user, on the bare row: *"ugly ugly ugly"*). `rowVariant` picks the row:
  `catalog` (default — every app-tier list stays exactly where
  CatalogPageMonitorParity ruled it) | `file` (the 48px thumb row), so a
  catalog whose grid shows a cover shows the same cover small in its list.
  A prop, not the literal: three apps' lists were ruled on the bare row and
  did not ask to move.

## 0.44.0 — 2026-09-03

- **`CatalogPage trailingActions` · `minColumn` · list rows with media**
  (kol-client-olina 2026-09-03, on /slide-deck — reviewed from a kol-link edit,
  shipped through the gates here). `trailingActions` fills the header's right
  slot — the one `MediaLibrary` uses for SELECT / FLAT; the page had no way to
  reach it, so every catalog rendered an empty slot beside the divider (user:
  *"that field SHOULD NEVER BE EMPTY"*). `minColumn` (default 160, today's
  number) is the grid track's floor — a shelf of three decks at 160 was three
  slivers and a void; olina passes 280; the six-track ceiling still applies.
  The list branch passes `media` and `ratio` to `ContentRow`, which already
  took both — a deck row rendered as title and detail with no thumbnail.
  Peer: theme ≥0.136.0 (the capped tier's vertical rung).

## 0.43.0 — 2026-09-03

- **`PageShell width`** (two-page-scaffolds-one-job, kol-client-olina) — `bleed`
  (default, the app tier: fills the window) | `capped` (the site tier:
  `--kol-container-max`, centred). The one real difference between a shell
  page and a `.kol-page`, and a prop now so a site adopting `CatalogPage` does
  not silently get app geometry; `CatalogPage` forwards it. The geometry is
  `.kol-shell-page` (theme 0.135.0) instead of an inline style object —
  inline is the `style` prop only — and `PageBleed` is `.kol-shell-page-bleed`.
  Gutter: `--kol-shell-page-pad` now aliases the estate's one page ladder.
  Peer: theme ≥0.135.0.

## 0.42.0 — 2026-09-03

- **`CatalogPage` forwards `ratio`** (catalogpage-card-ratio, kol-client-olina).
  `toCard` carried `fit` but not `ratio`, so every catalog in the estate was
  locked to `catalog`'s A4 with no seam at any level — a consumer with a 16:9
  deck had to leave the page and hand-roll the grid it was shipped to end.
  `ratio={c.ratio}` beside the `fit` that was already there; unset falls
  through to the variant's default, so nothing existing moves. Per card, not
  per page — `fit`'s own argument: one catalog mixes shapes.

## 0.41.0 — 2026-09-03

- **`PageHeader` is no longer exported — import it from `@kolkrabbi/kol-component`**
  (page-header-one-masthead). Same component, same props, plus the new
  `register`. Not re-exported and not aliased: `kol-shell` declares
  `@kolkrabbi/kol-component` as a peer at `>=0.127.0`, so every consumer already
  has it and the migration is one import path. `SettingsScaffold` and
  `CatalogPage` compose it across the seam and are unchanged for callers.
  Recorded in `docs/operations/01-release/04-retirements.md`.
  **Requires `@kolkrabbi/kol-component@>=0.174.0`.**

## 0.40.0 — 2026-09-02

- **A rung's tap decides the drawer, not only the route change**
  (ShellDrawerCloseOnSamePath, kol-monitor 2026-09-02). A rung whose path is
  the one already shown — Create tapped on `/create`, "new case" — changes no
  pathname, so the route effect never fired and the drawer stayed open over
  the page. The rail's `onNavigate` wrapper now sets the drawer to the tapped
  path's rule before delegating: `drawerOpenOn` rungs keep it open, every
  other rung closes it, same path or not. The route effect stays for deep
  links and the fold.

## 0.39.0 — 2026-09-02

- **The touch opener is the grab strip itself — no disc, no chevron**
  (RailGrabTapIsALine, kol-monitor 2026-09-02; user: *"it was a thicker line"*
  · *"who decided it should be a chevron?"*). 0.38.0's `.kol-rail-grab-tap`
  disc was the DS agent's shape, not the ruling; it is gone. The strip stays a
  `<button>` (`aria-expanded`, Enter/Space) and under a coarse pointer the
  theme (kol-theme 0.128.0) widens it and shows its pill thick at rest — the
  same line a fine pointer drags. A press with no travel toggles, as it always
  did. Fine pointers see nothing new.

## 0.38.0 — 2026-09-01

- **`touch="shell"` can be opened by a thumb** (ShellRailCollapsedWithTapOpen,
  kol-mirror 2026-09-01; the user's ruling read right this time — *"i means
  collapsed variant not expanded"*). `shell` is the only mode that keeps the
  48px rail visible, and its only opener was the grab strip: 8px on the line,
  visible on pointer proximity. A thumb never hovers, so on a phone the rail
  could not be opened at all. The strip is a `<button>` now — `aria-label`,
  `aria-expanded`, Enter/Space toggle — carrying `.kol-rail-grab-tap`, a 24px
  disc the theme shows ONLY under `(pointer: coarse)` (kol-theme 0.123.0); a
  press with no travel already toggled, it just had no target. Fine pointers
  see nothing new: the ruled grab stays. The snap seam takes a target now
  (`snapOpenRef.current(false)` closes). Per-route policy is the consumer's:
  `touch={isHome ? 'shell' : 'drawer'}`, as the showcase set now does.

## 0.37.1 — 2026-09-01

- **Fixes 0.37.0: the drawer trigger did nothing.** `drawerOpenOn = []` was a
  fresh array every render sitting in the route effect's deps, so the effect
  re-ran on every render and closed the drawer straight after every tap —
  every consumer taking the default lost its mobile navigation
  (ShellDrawerOpenOnUnstableDep, kol-mirror 2026-09-01; found by the user on
  his phone). The default is a module-level constant now, and the effect is
  keyed on the resolved boolean rather than the array, so a consumer's inline
  `['/']` is safe too. 0.37.0 deprecated. Swept the file: no other
  array/object default sits in a dep array (`navKeys` already keys on a joined
  string).

## 0.37.0 — 2026-09-01

- **`AppShell drawerOpenOn` — the drawer opens on entering a listed route**
  (ShellDrawerOpenOnRoute, kol-mirror 2026-09-01; user: *"the rail should load
  open on home, not everywhere"*). `drawerOpen` was internal state with no way
  in, so a consumer could not say that a home which IS navigation should arrive
  with the rail out. `drawerOpenOn={['/']}` — paths matched like the rail's
  active row (`'/'` exact, else prefix) — and the existing route effect opens
  on entry to one of them instead of closing; every other path keeps
  close-on-navigate. One effect, mount + fold + navigation alike. Above
  `drawerBelow` the list is inert. Default `[]` — nothing moves for a consumer
  that does not pass it.

## 0.36.0 — 2026-09-01

- **`SettingsShortcuts`' six columns are a ceiling, not a command.** The fourth
  home of the cols-as-command defect (SettingsShortcutsGridColumns, kol-mirror
  2026-09-01) — `grid-cols-6` computed six 18px tracks in a 350px row at 390,
  every group a column of single characters. The 0.33.0 idiom, applied once
  more: `repeat(auto-fill, minmax(min(100%, max(150px, sixth-share)), 1fr))` —
  no track under 150 (the widest label and combo in the estate), none wider
  than the container, so the count falls out of the width: two at 390, six on
  the desk, where nothing moves. Below `md` the grid flows by row — the
  column-first two-row shape stays a desk ruling, because with a fixed row
  count the extra groups would spill into implicit columns off the right
  edge. Gap `gap-x-6 md:gap-x-12` (the ContentFiltersMobileGaps rung; 48px was
  17% of the row). No consumer change.

## 0.35.0 — 2026-09-01

- **`touch="drawer"` opens from the LEFT again — 0.34.0 mirrored the panel to
  reposition a button.** The ruling behind `ShellDrawerOnRight` said *"hamburger
  menu location"*; its subject was the trigger, and the whole of drawer mode was
  mirrored to move it. NavRail pins `left-0 border-r` in both modes now (one
  className, no conditional), and the theme's off-canvas transform is `-100%`
  again. The trigger keeps 0.34.0's `top-right, both states` — that is the part
  that fixes the reported defect: it used to translate by the drawer width and
  ride the panel's trailing edge, landing the open X at x 252–284 on a 390
  screen. Pinned to the far corner it never meets a left-hand panel, so the
  2026-08-31 travel rule stays retired. Also kept from 0.34.0: the scrim is a
  button. No consumer change — `touch="drawer"` is the only prop involved.
  (ShellDrawerSideCorrection, kol-chess; pairs with kol-theme 0.121.0)

## 0.34.0 — 2026-09-01

- **`touch="drawer"` opens from the RIGHT** (user ruling: the close must not
  land mid-screen). NavRail pins right-0 with a left border in drawer mode,
  the trigger is fixed top-right in both states, and the trigger-travel rule
  is retired — it was the left side's cure. Desktop rail untouched. Needs
  kol-theme 0.120.0. (ShellDrawerOnRight, kol-chess)
- **The drawer scrim is a `<button>`, not a div** — the OverlayScrimTapDismiss
  line, third instance: iOS Safari does not bubble tap-clicks from
  non-interactive elements, and this scrim exists only on touch devices.

## 0.33.0 — 2026-09-01

- **CatalogPage's cols is a ceiling, not a command** — the third home of the
  defect ContentCollectionMinColumnWidth and ContentGridMinColumnWidth closed,
  unreachable by either because the grid was drawn inline: `repeat(6, 1fr)`
  computed six 29px slivers at 390. Same idiom as ContentCollection now — up
  to 6 (grid) / 4 (list) columns, no track under the floor (160 grid / 240
  list) and none wider than the container. Desktop's sixth-share clears the
  floor, so nothing moves there; the 2×2 expanded-card neighbour math stays a
  six-column ruling. (CatalogPageMobileColumns, kol-monitor)
- **SettingsShortcuts' label yields for real** — `labelWidth="auto"` (needs
  kol-component 0.151.0): the row's fixed 160px label in the grid's ~176px
  columns left the combo cell 4px, so EVERY combo painted into the 48px column
  gap and the first one longer than the gap (`⌥ then 1–5`) reached the
  neighbour's labels. The label truncates, the combo hugs, an over-long combo
  clips at its own column edge. (SettingsShortcutsComboOverflow, kol-monitor)

## 0.32.0 — 2026-09-01

- **Logomark sanitizes fetched SVG before inlining** — `<style>` and `<script>`
  stripped, `on*` attributes dropped (DOMParser, regex fallback for
  unparseable markup), at cache time. An SVG document may legitimately carry
  its own `<style>` — a theme-aware favicon does — but inlined, that `<style>`
  is DOCUMENT-GLOBAL: a consumer pointing `svgUrl` at its favicon put OS-keyed
  ink on every `<svg>` in the app and the symptom surfaced two packages away
  as "the theme toggle is broken". A mark that needs its own styling inlines
  it as attributes. Logomark is the estate's only fetched-SVG inliner (swept);
  the fetch → innerHTML boundary also earns the script/handler strip.
  (LogomarkInlineStyleLeak, kol-chess)

## 0.31.0 — 2026-08-31

- **`AppShell touch="drawer"`** — below `drawerBelow` (default 768) the rail goes
  off-canvas, hands its width back to the content, and a trigger brings it in
  over a scrim. Tapping a destination closes it. At 390 the 48px rail is 12.3% of
  the viewport, and `railToggleKey` could not help because it is a KEY: a phone
  has no keyboard, so on the device where the rail costs most it could not be
  dismissed at all. `bare` was the only other way to reclaim the width and it
  throws navigation away entirely.
- The breakpoint is a WIDTH, not a pointer test — an iPad is coarse and has room,
  a narrow desktop window is fine-pointered and does not.
- **The route-change effect is now mode-aware.** `setNavHidden(false)` on every
  navigation is right for `railToggleKey` and backwards for a drawer; it also made
  `navHidden` unusable as a consumer seam, since child effects run before parent
  effects and a consumer's hide was overwritten in the same commit.
- **`NavRail drawer`** — no grab strip, no drag, no `--kol-shell-rail-width`
  writes on `:root`, rows always labelled, and the rail sizes from
  `--kol-shell-drawer-width` (default 240px). That inline token was the reason a
  consumer needed two `!important`s to fold the rail themselves.
  (ShellRailNoDrawerOnMobile, kol-chess)

## 0.6.1 — 2026-08-15

- `PageHeader`'s eyebrow is **uppercase on `kol-helper-12`** — an eyebrow is
  single-line chrome, which is the whole definition of the helper ramp, and it
  carries its own tracking. Ink off `fg-48` (under half the ink, read as
  disabled) onto `oq-64`; the subtitle moves with it.

## 0.6.0 — 2026-08-15

**`PageHeader` is a real masthead.**

- **A `size` scale**, because two different things were being called a page
  header: `sm` = `kol-sans-heading-03` (app chrome, a titled panel), `md` =
  `kol-sans-display-03` (the default page masthead), `lg` =
  `kol-sans-display-02` (a landing or section opener). heading-03 alone was too
  quiet to open a page.
- **An `eyebrow` slot** — the small label above the title (kol-website's
  "USE CASES"). Self-hides when unset, so an app page passes nothing.
- `subtitle` self-hides too, and the block owns its own rhythm in one `<header>`
  instead of two loose siblings with margins.

**Breaking-ish:** the default `size` is `md`, so existing pages get a larger
title than 0.5.0 gave them. Pass `size="sm"` to keep the compact app heading.

## 0.5.0 — 2026-08-15

- **`PageHeader`'s title had no type at all.** It wore `kol-heading-sm`, a
  retired t-shirt stop with NO rule anywhere in kol-theme — so every page title
  in every shell app fell through to the browser's default `h1`. Mapped to
  `kol-sans-heading-03` (32px), the same way the dead `kol-mono-sm` and
  `kol-helper-lg` stops were mapped. **This visibly changes every page heading.**

## 0.4.1 — 2026-08-15

- `GridCard` reads `var(--kol-ease-house)` instead of hardcoding
  `cubic-bezier(0.16, 1, 0.3, 1)`. The token changed in kol-theme 0.44.0
  (expo → balanced).

## 0.4.0 — 2026-08-15

### Minor Changes

- **`ShortcutsOverlay` takes a sectioned array.** Two forms now, detected on
  shape:

  ```
  flat       [{ label, keys }]                    — unchanged, as shipped
  sectioned  [{ section, items: [{label, keys}] }] — headings between groups
  ```

  The flat form renders **exactly** as before, so no existing caller moves.

  Filed as `ShortcutsOverlaySections` from kol-fxr, whose keymap is grouped
  (Edit · Selection · Layer · Tools · View) and whose `shortcutsBySection()`
  already emits this shape. Flattening it to adopt this component would have
  dropped the grouping, so that consumer kept a 99-line local overlay — the
  exact duplication this component exists to end.

  **One grid, not nested ones.** Headings span both columns
  (`gridColumn: 1 / -1`) so every `keys` cell stays on one axis; a grid per
  section would let each group compute its own column width and the keys
  would stagger down the panel.

  `keys` remains a display string and is still never bound — this component
  shows a keymap, it does not own one.

## 0.3.0 — 2026-08-15

⚠️ **BREAKING — `ContentFilters` is removed from this package.** Import it from
`@kolkrabbi/kol-component`, where it has shipped as an organism since 2026-08-01.

This package's copy was a **recreation of a component that already existed**. The
0.1.0 lift rebuilt it from the kol-monitor/kol-mirror twins without checking the
DS for the original, and 0.1.1 → 0.2.0 — four publishes in one day — tuned the
duplicate. Every layout ruling from those rounds now lives on the real organism
(kol-component 0.44.0); nothing was lost by retiring this.

What did **not** carry over: rendering filter values through `TabStrip`. A
multi-select, handler-carrying, active/rest chip is a `Tag` — the atom whose own
header states the law ("a Tag with no handler is a Pill wearing the wrong name").
Building a second one under another name in another package is precisely the
duplication kol-shell was created to end. `renderFilterValue` goes with it: a
per-consumer value renderer is divergence as an API.

- `ContentFilters` — removed. Quarantined in `_tmp/`, not deleted.
- `renderFilterValue` / `labelClassName` — removed with it. They shipped in 0.2.0
  and lived less than an hour.
- `TabStrip` — **stays**, single-select only. `SettingsScaffold` uses it for real
  tabs; the `Set` multi-select form added in 0.1.2 is gone with the fork.

**Migration:** change the import. `ContentFilters` keeps `filterGroups`,
`renderItem`, `viewModeOptions`, `layoutOptions`, `defaultLayout`, `headerActions`,
`showCountOnlyWhenFiltering`, `searchKeys` and `iconComponent`. Consumers that
uppercased filter values by hand should stop — `.kol-tag` does the casing.

## 0.2.0 — 2026-08-15

**Two rendering seams on `ContentFilters` — additive, nothing moves on bump.**

Three publishes in one day (0.1.1 → 0.1.3) went into re-deciding how a filter value
and a group label should look: chips, then bare strip items, then outlined pills.
None of those is a design-system question — it is what a given app's filter bar
should look like, and the user's ruling ended it: _"this component should not have
problems SHIPPING props… make the fucking content filters FLEXIBLE."_

- `renderFilterValue?: (value, isActive, toggle) => node` — renders one filter
  value. Default is the 0.1.3 strip item. A consumer wanting small outlined pills
  authors them and passes them through; no publish here.
- `labelClassName?: string` — the group label's class. **REPLACES, never stacks**,
  per the 2026-07-30 law: two equal-specificity type classes on one element are
  decided by sheet order, so a stacking seam renders differently in two consumers
  with no version difference. Same contract as `ListingCard`'s `titleClassName`.

Defaults reproduce 0.1.3 exactly, so kol-mirror does not move. Minor, not patch —
this is new public API.

## 0.1.3 — 2026-08-15

Second QA round on the same ticket — two rulings from kol-monitor's live check of
0.1.2. The below-divider position and always-visible strip from 0.1.2 stand.

- `ContentFilters` — a filter group is a **column**: label on top, values beneath.
  0.1.2 put label and values inline on one row, which is not the ruled layout.
- `ContentFilters` — **the filter line carries exactly TWO ink states**, the strip's
  own: active `text-fg-96`, rest `text-fg-32` (hover `text-fg-48`). Nothing on that
  line gets a third. The group label was `text-fg-48` and untracked — it now wears
  the full strip idiom (`kol-helper-12`, 1px tracking) at the **rest** ink, and the
  `Clear all` button drops from `text-fg-48` to the same rest recipe. A selected tag
  value lights up exactly like a selected GRID.
- `ContentFilters` — the below-divider block is now `items-start`, which pins the
  layout strip to the **label row** so values hang beneath it. Values wrap.

Consumers author group labels in the case they want rendered (`TAGS`, `CATEGORY`);
no `text-transform` here, same as the strip items.

## 0.1.2 — 2026-08-15

`ShellHeaderFilterRefinements` reopened by kol-monitor on the user's verdict — 0.1.1
read the ticket's "at the divider level" as the header row _above_ the divider. It is
the row below it. The h1 gap fix from 0.1.1 stands.

- `ContentFilters` — the LIST/GRID layout strip now renders in **one row below the
  divider, right-aligned, always visible**, never in the header row. Filter groups
  share that same row on the left and appear only while the filter toggle is open,
  so an expanded group no longer moves the strip.
- `ContentFilters` — filter values wear the **LIST/GRID strip idiom** (`kol-helper-12`,
  1px tracking, `text-fg-96` active / `text-fg-32` rest) instead of `Tag` chips, with
  the group label inline on the same line. This supersedes 0.1.1's `size="sm"` chip
  fix — there are no chips here now, and the `Tag` import is gone.
- `TabStrip` — `value` accepts a **`Set`** for a multi-select strip, alongside the
  scalar single-select form. Filter values needed per-value active state; copying the
  active/rest classes into a second component is the drift that produced the two
  divergent shells this package was built to end.

**No auto-casing was added.** The ruling asked for values styled like `LIST`/`GRID`;
those render uppercase because the consumer _authors_ them uppercase. `text-transform`
stays off per the DS law — a consumer wanting uppercase tag values authors them so.

## 0.1.1 — 2026-08-15

First adoption-QA round from kol-monitor (`ShellHeaderFilterRefinements`) — three
corrections, all in shell files with no consumer seam to fix them:

- `PageHeader` — the h1's 8px gap to the subtitle, dropped when the component was
  recreated from monitor's local copy, restored **inline on the h1** rather than in
  `kol-heading-sm`: margin in a shared type class leaks estate-wide.
- `ContentFilters` — filter tag chips were hardcoded `size="md"`; they are dense
  chrome and now render `sm`.
- `ContentFilters` — the LIST/GRID layout toggle moved up to the divider row,
  right-aligned beside the count. It previously rendered after the collapsible
  filter block, so expanding a group pushed it down the page. Filter groups stay
  below the divider in left-aligned columns — that layout is now the contract.

## 0.1.0 — 2026-08-14

- Initial release — the application shell set lifted from the hand-copied twins in
  kol-monitor and kol-mirror (AppShellSet lobby brief): `AppShell` + `NavRail` +
  `useNavHidden`, `PageShell`/`PageBleed`, `PageHeader`, `ContentFilters`, `TabStrip`,
  `GridCard`, `SettingsScaffold`/`SettingsSection`/`LabelRow`, `WalkthroughPanel`,
  `ShortcutsOverlay`, `Logomark`. Router-agnostic (`currentPath` + `onNavigate`);
  icons via the `iconComponent` seam; chrome in kol-theme ≥0.41.0
  (`kol-components-shell.css`).
- Shipped drift from the source repos fixed on recreation: the shared dead `ViewToggle`
  import, the `GridCard` hardcoded white `borderTop` (light-theme bug in both apps) →
  `border-fg-04`, monitor's list-detail `text-transform: capitalize` and the strips'
  `uppercase` (no auto-casing law), the rail's raw `z-70` → `--kol-z-sticky`, and the
  2026-08-12 active-wash ruling carried natively via `aria-current="page"` so both
  consumers delete their overrides.
