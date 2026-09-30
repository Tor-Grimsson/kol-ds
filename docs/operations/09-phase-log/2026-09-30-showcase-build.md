---
title: Showcase build
type: log
status: active
created: 2026-09-30
updated: 2026-09-30
description: The audit built — categories, homes, rails, cards
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[../03-showcase/05-audit-names-and-homes|The audit]]"
  - "[[2026-09-30-phase-log-and-audit|The audit run]]"
---

# Showcase build

**Run:** 2026-09-30, two goals — the first until the usage limit, the second overnight while the user slept · **Plan:** [[_files/plan-2026-09-29-phase-log-and-showcase-review|plan-2026-09-29-phase-log-and-showcase-review]] · **State:** built and published (theme 0.157.0 → 0.158.0 · component 0.230.0 · framework 0.46.0 → 0.47.0 · workshop 0.31.0 → 0.32.0 · icons 0.29.1 → 0.30.0 · design-editor 0.17.0 → 0.18.0 · foundry 0.11.0 · shell 0.59.1 · six comment-only bumps); git is the user's

## Phases

| Phase | Docs | What was done |
|---|---|---|
| Display names | [[../../documentation/00-overview/05-names\|Names]] | `Action Button`, not `ActionButton`, on every human surface — the 2026-08-01 ruling, wired |
| Categories | [[../../documentation/03-components/00-taxonomy\|Taxonomy]] | every package on the atomic ladder (47 components had no category); Order by Atomic · Function · Package; `TIERS` required again |
| Placement | [[../../documentation/03-components/02-placement\|Placement]] | CloseButton → atom, ContextMenu → molecule, four overlays → utilities, PortalFooter → organism, `ColorLoader` → `IntroLoader` (alias on the ledger) |
| Sets and blocks | [[../../documentation/00-overview/05-names\|Names]] | a set page per package (`/sets/family/<dir>`); blocks get chapters from their category |
| Homes | [[../../documentation/00-overview/05-names\|Names]] | markdown homes with frontmatter for every space and tier; a label opens its home, the chevron expands; `F` shows the frontmatter |
| Styles and Docs | [[../../documentation/04-compositions/02-shells\|Shells]] | Docs = Documentation + Operations; the guides, foundations and icon sets moved to a Styles space, each naming its source |
| Apps | [[../../documentation/04-compositions/16-app-anatomy\|App anatomy]] | the layers drawn as nested containers (`CompositionDiagram`), a home per layer, app pages tagged |
| Tags | [[../../documentation/04-compositions/04-workshop-system\|Workshop system]] | the right rail shows the page's own tags, grouped by namespace; empty chapters hidden; folded categories show counts |
| Rails | [[../../documentation/04-compositions/04-workshop-system\|Workshop system]] | `[` `]` hide the rails, `C` folds every chapter, pin a page to keep it in the rail, drag a rail's edge to resize |
| Tools | [[../../documentation/00-overview/05-names\|Names]] | Development gains Tag graph, Tags, Index, Packages (a page per package from its `package.json` + changelog) and the Lobby read like a record |
| Component page | [[../../documentation/03-components/00-taxonomy\|Taxonomy]] | frontmatter first on every page; Dropdown, Input, Segmented Toggle, Textarea take a Variant picker; Curve Overlay a State picker; index cards scale a too-big demo down |
| Chrome | [[../../documentation/04-compositions/04-workshop-system\|Workshop system]] | one-word tooltips; icon buttons wear the KOL focus ring; a portalled panel hides with its trigger; the hamburger only below the desktop width |
| Pages | [[../../documentation/00-overview/05-names\|Names]] | Home: buttons centred, Apps added, the live wall on the first screen; accent white; `color` spelled one way; `EmptyState` back; `ResultRow` |
| Cards | [[../../documentation/04-compositions/12-section-system\|Section system]] | a new space: 18 website cards — heroes, text and image (left, right, centred, above), CTAs, signup, features, FAQ, content cards |
| Editor | [[../../documentation/04-compositions/14-design-editor-system\|Design-editor system]] | the ten align, rotate and flip glyphs redrawn; bucket thumbnails in Assets; one look for a boolean |
| Breakpoints | [[../../documentation/08-breakpoints/INDEX\|Breakpoints]] | 31 routes at 320 · 390 · 768 · 1024: no horizontal overflow; tag chips and tabs raised to the touch floor |

## Decisions

Rulings by the user are marked *user*. Everything marked *agent* was decided while the user slept — built,
reversible and listed here to be reviewed.

| Decision | By |
|---|---|
| The nine audit rulings taken on the recommendations — *"assume i go with recommendation"* | user |
| Accent white; one-word tooltips; search rows in both variants, underline the default; nested containers a documented pattern; `color` spelled one way | user |
| Frontmatter first, hidden by default on a home; every level has a markdown home | user |
| A packages home with a page per package and its changelog; each icon set a Set | user |
| **Cards is a space, not a Blocks chapter** — a block is shells and tools, a set is a package family, a card is one page section; it reuses the Blocks machinery | agent |
| **Guides went to Styles, not into Docs chapters** — the Docs tree shows markdown only (the 2026-08-01 ruling), and a guide is a live page | agent |
| **Tooltip and Popover panel stay in Utilities** — atoms import Tooltip, and it is only ever worn | agent |
| **Header right side = search · settings · theme.** GitHub is a row in Settings › Links; the hamburger shows only below `lg` (new `menuBelowLg`, off by default) | agent |
| **The settings drawer was not changed** — shared by every app, and *"layout is wrong"* never said what | agent |
| **Rails resize by dragging; the icon strip was not built** — there is no icon per chapter to draw | agent |
| **The ten glyphs were redrawn** — bars 5 tall and wider, a solid axis that never crosses a bar, a dashed flip axis visible at 16px, doubled arrowheads; the old files are at `_tmp/2026-09-30-glyph-redraw-before/` | agent |
| **Asset thumbnails come from the host's media client** — its first store, its first twelve images, click to insert; drag-to-canvas was not built (the canvas has no drop target) | agent |
| **A boolean is a switch everywhere** — label left, switch right; the Off/On strip stays only where two named states are given | agent |
| **Package pages are built at runtime** from `package.json` and `CHANGELOG.md` — the frontmatter and the body are what shipped, nothing typed twice | agent |
| **`color` sweep left ids, archives, changelogs, quotes and the editor's labels alone** — those are not prose | agent |
| **The tier tag follows a component when it moves** (`sync-mdx-frontmatter`) instead of freezing at the old one | agent |

## Corrections

The user caught it the next morning: the showcase's settings drawer was hand-built while the DS ships the approved one (`SettingsPanel`, media's Display settings and Trash). The same mistake — UI built fresh without checking what the DS already ships — was made six more times in this run. No gate catches it: the gates check written rules, not *"a shipped component already does this"*. Swapped the same day (theme 0.159.0 · framework 0.48.0 · workshop 0.33.0 · design-editor 0.19.0):

| Built fresh | Now |
|---|---|
| the shell's settings drawer — `ShellDrawer` + an eyebrow + undivided rows | `SettingsPanel variant="drawer"` + `SettingsSections divided`, as media |
| a local rail grip that also persisted the width (against the 2026-09-03 ruling) | `useDragResize` + `.kol-rail-grab`, SideNav's and EditorShell's gesture; width lasts the session |
| `ResultRow`, a new search row | kol-component's `ContentRow` (article, no cover); `ResultRow` deprecated on the ledger |
| a button grid for the editor's asset thumbnails | `AssetGrid` + `MediaTile`, the media library's grid item |
| hand-built link lists on Tags, Packages, set families, Styles | `Tag` chips and `Table` |
| `CompositionDiagram` in a second look beside Shell &amp; Layout's own boxes | one component in Shell &amp; Layout's look; that page draws through it |
| Round 3's settings mock (A vs a hand-built B) | the wrong comparison — the answer was `SettingsPanel`; Round 3 says so |

## Open

- Open questions Round 3 and Round 4 (Development › Records › Open questions) wait for your look: the settings drawer, the rail icon strip, and the redrawn glyphs.
- Editor #15 (primary hover) shipped 2026-09-03 — check it by eye on Round 3.
- Real-device touch: emulation cannot judge thumb reach.
- The header's typed brand label is 24px tall on touch, and inline text links in lists are 16px — left alone (inline links are exempt from the tap-target rule).
