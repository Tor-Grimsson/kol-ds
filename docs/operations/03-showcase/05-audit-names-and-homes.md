---
title: Names and homes audit
type: audit
status: archived
created: 2026-09-30
updated: 2026-09-30
description: What things are called, where they live
tags:
  - domain/showcase
  - audience/agency-internal
related:
  - "[[INDEX|Showcase]]"
  - "[[04-surface-rules|Surface rules]]"
  - "[[../09-phase-log/2026-09-30-phase-log-and-audit|Phase log entry]]"
---

# Names and homes audit

> **Built 2026-09-30.** Every ruling below was taken on the recommendation and built; the decisions the build itself took are in [[../09-phase-log/2026-09-30-showcase-build|Showcase build]]. Kept as the record of what was found.

The user's showcase review of 2026-09-29, point by point, with a proposed solution for each.
**Nothing here is built.** The user rules on each item; the rulings become the build plan.
Visual calls are not argued in prose — they link to live specimens on
[Open questions](/development/open-questions).

Sources: `plan-2026-09-29-phase-log-and-showcase-review.md` (W2), a sweep of all 321 top-level
components read from the live registry (`showcase/src/nav/registry.js`), and the
[[../09-phase-log/INDEX|phase log]] for what was already ruled.

## Summary

The categories are three rulings that were never reconciled, and two more that were never wired:

| Ruling | Date | What it did | State |
|---|---|---|---|
| Flat packages classify by **ownership** — *"a shell piece is not an atom"* | 2026-07-30 | Workshop · Dashboards · Chess · Foundry · Styleguide · Content · Store became component categories | live — the categories you see |
| **Atoms paint and stand alone**; one Utilities group for what has no face | 2026-08-09 | 13 files → `utilities/` | live, then drifted (see Placement) |
| The **space table** — Components · Blocks · Sets · Docs · Apps · Development | 2026-09-28 | per-space rails | live |
| Rail rows show **display names** — *"Create Button"*, *"Section Label. Two words."* | 2026-08-01 · 08-09 | `labelFromSlug` written | **never wired** |
| A folded category shows its **count** | 2026-09-28 | left rail only | **right rail missed** |

And one hole nobody ruled: **47 components are in no category at all** — kol-shell (16),
kol-hardware (18), kol-deck (9) and kol-notes (4) have no entry in `CATEGORY_ORDER`, so the
Components rail drops them. That is the gap between the rail's `(274)` and the 321 the registry holds.

## Vocabulary

**Proposal: one conventions doc** — `docs/documentation/00-overview/` gets a *Names* page, and every
term below is a searchable heading in it, so ⌘K on *"rail levels"*, *"set"* or *"hub"* lands on it.
The terms already exist; they are scattered across `02-shells.md`, `16-app-anatomy.md` and the
registries.

| Term | Meaning | Written today in |
|---|---|---|
| Space | a header tab — Components · Blocks · Sets · Docs · Apps · Development | `02-shells` § space table |
| Category | a rail's top level — the eyebrow (`COMPONENTS`, `RECORDS`) | `02-shells` § rail vocabulary |
| Chapter | the second level — `Atoms (32)`, a count, a chevron | same |
| Page | the third level — a link | same |
| Section | a row in the right rail — a heading on the page | same |
| Component | one export with a face | `03-components/00-taxonomy` |
| Utility | one export with no face of its own | same |
| Block | *proposal below* | `blocks-registry.js` docblock |
| Set | *proposal below* | `sets-registry.js` docblock |
| Engine · Shell · Hub · Catalog · Tool · Fixture · Studio | the app layers | `16-app-anatomy` |
| Guide · Specimen | *proposal below* | `shell-nav.js` comments only |

## Homes

**Finding.** A space root is a hand-built page (`Components.jsx`, `Blocks.jsx`, `DocsIndex.jsx`,
`Development.jsx`); a chapter has a home only in Docs, where `INDEX.md` opens on the chapter header
(the 2026-08-02 ruling). Atoms, Blocks, Sets and the Apps layers have none.

**Proposal.** Every level has a home, and every home is markdown with frontmatter — so it is
tagged, searchable and pinnable like any doc:

| Level | Example | What it explains |
|---|---|---|
| Space | `/components` | the atomic system in KOL, and how the space is ordered |
| Chapter | `/components/atoms` | what an atom is, the two tests, what sits on the edge |
| Chapter | `/components/molecules` | how atoms nest into a molecule |
| Space | `/docs` | the markdown engine and the two categories |
| Chapter | Apps › Shell | what the layer is, which apps prove it |

Clicking a Category or Chapter **label** opens its home; the **chevron** only expands. Frontmatter
is hidden by default on a home and shown with a shortcut (W4).

## Categories

**Finding.** `/components` mixes two axes in one list: atomic tiers for `kol-component`, and
ownership for every other package (the 2026-07-30 ruling). Framework splits in two
(`Framework · Chrome`, `Framework · Structure`) for six components.

**Proposal — one axis per place:**

1. **Components** groups by atomic tier only: **Atoms · Molecules · Organisms**, then the one
   no-face category. Every flat-package component gets a tier too, so a chess board and a
   knob sit where a reader of atomic design would look for them. **Reverses 2026-07-30.**
2. **Order by** (the existing Group by control, grown): *Tier* (default) · *Function* (exists) ·
   *Package*. Package is the ownership view, kept — as a view, not the default.
3. **Package groupings are Sets** (see Blocks & sets). Chess, Foundry, Store, Dashboards,
   Styleguide, Content, Workshop, Shell, Hardware, Deck, Notes each get a set page listing the
   package's components with its composed apparatus. That answers *"aren't many of these
   technically sets?"* — yes.
4. **The no-face category.** The 2026-08-09 ruling named it Utilities (*"make a utility
   category"*, *"GROUP THIS TOGETHER"*). The review of 2026-09-29 floated *function · engine ·
   data · chrome · layout*. **Needs the user:** keep *Utilities*, or rename it. One group
   either way.

## Placement

The sweep, 321 components. Three kinds of fault:

**Utilities that paint and stand alone** — filed by the file they live in, not by what they are:

| Component | Why it is filed there | Proposal |
|---|---|---|
| `Tooltip` · `PopoverPanel` | exported from `utilities/Popover.jsx` | Tooltip → molecule, PopoverPanel → member of Popover |
| `CloseButton` | its file sits in `utilities/` | atom — an × you can see and press |
| `ContextMenu` | its file sits in `utilities/` | molecule — a menu of rows |

**Atoms that paint only onto something else** — the 2026-08-09 Test 2 (*"stands alone"*):

| Component | Preview today | Proposal |
|---|---|---|
| `PathNodeOverlay` | none | no-face category, or a member of the editor's canvas |
| `CropOverlay` | none — the card prints its name | same |
| `SelectionOverlay` · `CurveOverlay` | render, over a hand-drawn target | **needs the user** — boundary call #3 ruled CurveOverlay an atom on 2026-08-09 |

**Named or placed wrong:**

| Component | Finding | Proposal |
|---|---|---|
| `ColorLoader` | the website's intro curtain (a TextPressure wordmark); lives in **kol-foundry** because it drives a live font; the name says *color*; the preview does not replay | rename (the name is the user's); organism; the demo gets a replay |
| `PortalFooter` | `Framework · Chrome` | organism — and the Footers block is `PortalFooter` composed, so the two pages link |
| `AudioPlayer` · `EmblaNav` · `RowMenuButton` · `VideoSheet` + 10 organisms (MediaLibrary, CanvasRuler…) | no preview — a visual tier that cannot be judged | each gets a demo or moves to the no-face category |

The full per-component table is regenerated at build time; the rule it enforces is
`validate:taxonomy` check 4, widened from `atoms/` to every visual tier.

## Blocks & sets

**Finding.** Today a **block** is *"a composed, copy-pasteable UI section"* and a **set** is *"a
full apparatus you'd drop in whole"* — both render through the same responsive preview, so the
difference is size, not kind. The blocks already carry eleven `meta.category` values (sidenav,
footer, hero, toolbar…) that the rail ignores; the sets carry nine.

**Proposal — the user's original intent, written down:**

| | Is | Holds | Rail |
|---|---|---|---|
| **Set** | a family — every component one package or domain ships, shown together | the components, then the apparatus composed from them | one page per package |
| **Block** | a composition of shells and tools, and how it breakpoints | sidenavs, headers, footers, heroes, panels, toolbars | chapters from the existing `meta.category` |

Vocabulary follows the package names, since the package is the code's truth: the set is
*Foundry* (docs link it from Typography), *Styleguide* (linked from Brand).

## Docs space

**Finding.** Docs holds four sections: **Guides** (four MDX pages), **Specimens** (five live
pages), Documentation and Operations. Guides and Specimens are not in `docs/` — they are React
pages, which is why they have no chapter, no count and no home.

**Proposal.**
1. **Docs = Documentation + Operations**, each with its home (the markdown engine explained).
2. **Guides fold into their chapters** as slot pages — Shell & Layout → Compositions, Menus →
   Components, Loaders → Icons, Type roles → Foundations. The mechanism exists (`CHAPTER_PAGES`,
   emptied on 2026-08-01 so the tree mirrors disk).
3. **Specimens become a Styles space** — color, typography, tones, icons, foundations — the
   reference lookup, each page naming the CSS and JSX it reads. Content that needs no page of its
   own becomes sections with a count and a TOC (Color → Brand aliases · Brand ramps · Cream
   ramp). **Needs the user:** the space, and its name.

## Apps

**Finding.** `/apps` explains the layers as stacked tables; the hierarchy is only in the prose.
The right rail's Tags read `(0)` because no app page carries frontmatter.

**Proposal.** The layers drawn as nested containers, the way Shell & Layout draws its
composition — see [Q5 · Apps nesting](/development/open-questions/2026-09-30#q5). Name the pattern
(*composition diagram*) so Blocks and Sets reuse it. Each layer gets a markdown home (Homes),
which gives the apps tags.

## Tags

**Finding.**
- Nested tags **are a law** — the kol-docs framework (`.kol/docs-framework/03-tag-taxonomy.md`):
  every tag is `namespace/leaf`, from a closed set of ten namespaces.
- The right rail lists the page's own tags, then the **space's** top tags
  (`ShellChrome.jsx:77`). A page with none — `/docs/menus` — still shows ten, none of them its own.
- The rail prints the full path, so `domain/components/atoms` truncates.

**Proposal.**
1. The law stays in the data; the display changes — the rail groups by namespace and prints the
   leaf (`Domain` → `components` · `workflow`).
2. The rail shows the page's own tags only. The space's top tags move to the space home and the
   search page, where a way in belongs.
3. **Needs the user:** whether the namespace law itself should loosen (it is a dotfiles-level
   framework rule, shared with every repo).

## Rails

Findings for W3, measured:

| Finding | Where | Proposal |
|---|---|---|
| Blocks, Sets, Guides, Specimens list pages straight under the category — no chapters | `ShellChrome.jsx` `one()` | chapters from `meta.category` (Blocks), packages (Sets) |
| The right rail's folded `THIS PAGE` / `LINKS` show no count | `RightRail.jsx:104,116` pass no `count` | pass it — `RailSection` already draws it |
| `Related (0)` renders | `RightRail.jsx` | a chapter with nothing in it does not render |
| Components shows only its own category | `componentTreeRoutes` | focusing a chapter folds the others; nothing is isolated |

## Frontmatter

**Finding.** Two page templates, two orders. A component with an MDX file (73 of 321) renders
through `MdxDoc` — frontmatter first, then the title (Button). One without renders through
`ComponentPage.jsx` — title, description, preview, *then* a frontmatter block with no title, type,
status or tags (ActionButton, PathNodeOverlay).

**Proposal.** One order for both, set in `ComponentPage.jsx`: frontmatter first, carrying title ·
type · status · tags from the registry. Hidden by default on homes, shown on component pages, a
shortcut toggles it.

## Display names

**Finding.** Ruled 2026-08-01 (*"Create a space between CreateButton.jsx"*), planned 2026-08-09 as
Wave D (*"Section Label. Two words."*), never built. `labelFromSlug('SectionLabel')` returns
`Section Label` and is called for vault categories only.

**Proposal.** The registry carries `displayName` beside `name`; every human-facing surface reads
it — rail, index cards, page title, pager, search. Imports and snippets keep `ActionButton`.

## Tools

**Finding.** The tag graph is a quick action on the right rail and nothing else; there is no tag
list; there is no index of every page; the search page opens only from Enter in the palette.

**Proposal.** Development › Tools gets **Tag graph**, **Tags** (every tag with its count, each
opening `/search?q=#tag`) and **Index** (every page A→Z, by space). Search keeps its doors (⌘K,
`/`, Enter) and gains a rail row.

## Visual calls

Laid out live on [Open questions](/development/open-questions), one round per page:

| # | Question | Answer (2026-09-30) | Plan item |
|---|---|---|---|
| [Q1](/development/open-questions/2026-09-30#q1) | the accent | **white** | W6.2 |
| [Q2](/development/open-questions/2026-09-30#q2) | the dark green | dropped | — |
| [Q3](/development/open-questions/2026-09-30#q3) | search result rows | title up rejected; [Round 2](/development/open-questions/2026-09-30-b): both, as variants of one row component — underline default | W6.5 |
| [Q4](/development/open-questions/2026-09-30#q4) | tooltip copy | **one word** | W5.2 |
| [Q5](/development/open-questions/2026-09-30#q5) | apps as nested containers | **yes** — documented as a way of visual communication | W2.10 |

## Rulings

**Taken 2026-09-30 on the recommendations** (the user: *"assume i go with recommendation"* — build, review, iterate after). Recommended answers in brackets:

1. Components by atomic tier only, package as an Order-by view — reverses 2026-07-30. [yes]
2. The no-face category: keep *Utilities*, or its new name. [keep Utilities; fix its contents]
3. `SelectionOverlay` · `CurveOverlay` — atoms, or the no-face category. [no-face category]
4. `ColorLoader`'s new name. [`IntroLoader`]
5. Set = a package family; Block = shells and tools and how they breakpoint. [yes]
6. Docs = Documentation + Operations; Guides into chapters; a Styles space (and its name). [yes — Styles]
7. Tags — the rail shows own tags only, grouped by namespace; whether the namespace law loosens. [yes; the law stays]
8. Development › Tools gains Tag graph, Tags, Index. [yes]
9. Packages and icons homes (plan W2.13–14) — one page per package with its changelog; each icon set a Set. [yes]
