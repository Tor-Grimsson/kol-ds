# @kolkrabbi/kol-shell

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
