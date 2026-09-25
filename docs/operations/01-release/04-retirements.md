---
title: Retirements
type: reference
status: active
created: 2026-08-26
updated: 2026-09-25
audience: internal
description: Every shipped alias and when it drops
tags:
  - domain/release
  - audience/agency-internal
  - provider/npm
related:
  - "[[INDEX|release pipeline]]"
  - "[[02-shipped-packages|shipped packages]]"
  - "[[../../documentation/03-components/06-content-card-system|content card system]]"
---

# Retirements

Every alias the packages ship — an old name kept so a consumer's next bump does not break — with its replacement and the date it was deprecated. **This table is enforced, not remembered:** `pnpm validate:retirements` reads the barrels, and `pnpm retirements` prints who in the estate still imports each one.

## Rules

- **R1** — every alias the barrels ship has a row here, and every row names an alias the barrels still ship. No unlisted alias, no ghost row.
- **R2** — an alias is **dropped when no repo imports it**, decided by grepping the estate (`~/dev/projects/kol-*` + this repo's showcase and workbench), never by waiting for a major.
- **R3** — an alias older than **30 days** that nobody imports is drop-ready, and the gate **fails** until it is removed: drop the export, quarantine the file, BREAKING-flag the changelog, delete the row.
- **R4** — **an alias may not gain behaviour.** A changelog entry dated after the alias's `since` that names it and is not its drop fails the gate: features go on the replacement, the alias only ever drops. (2026-08-27: three tickets shipped features on `ListingCard` — frame, zoom, a hero rung — because nothing connected "on the ledger" to "being worked on". Enforced for entries from 2026-08-28.)

What counts as an alias is detected from source — a barrel line exporting one default under two names, an export whose file (or whose own JSDoc) opens with `@deprecated`, or a kol-theme CSS class whose rule sits directly under a `/* @deprecated YYYY-MM-DD → replacement */` line — so nothing already shipped is missed. A CSS alias counts as used wherever the class string appears in a code file.

## Aliases

| Alias | Package | Replacement | Since |
|---|---|---|---|
| `PageHeader` from `@kolkrabbi/kol-shell` | 2026-09-03 | import it from `@kolkrabbi/kol-component` — same component, same props, plus `register` | moved, not aliased: shell peers on component so every consumer already has it (page-header-one-masthead) |
| `BrandHero` | framework | `PageHero` | 2026-09-03 |
| `SubPageHero` | framework | `PageHero` (`backTo` / `backLabel` kept) | 2026-09-03 |
| `AppShell` | framework | `PageLayout` (+ `pageWash`, `bare`; kol-shell's `AppShell` is a different component, unchanged) | 2026-09-03 |
| `MenuPopover` | component | `MenuItem` | 2026-07-02 |
| `MediaPicker` | component | `MediaLibrary variant="modal"` | 2026-08-01 |
| `FullBleedHero` | component | `SectionHero` | 2026-08-26 |
| `FeatureSplit` | component | `SectionSplit` (`flip` → `align="left"`) | 2026-08-26 |
| `FeaturesCardSection` | component | `SectionCards` | 2026-08-26 |
| `CtaGlobal` | component | `SectionCta` | 2026-08-26 |
| `FeaturedCarousel` | component | `SectionHero media={[…]}` | 2026-08-26 |
| `Section` | component | `InspectorSection` | 2026-08-26 |
| `CardFeatureItem` | component | `SectionCardItem` | 2026-08-26 |
| `NewsletterBand` | component | `SectionNewsletter` (`title` → `headline`, `description` → `body`) | 2026-08-27 |
| `BentoCard` | component | `TiltBento` (the Tilt family) | 2026-08-27 |

## CSS classes

Type and chrome classes retire the same way — the marker line above the rule is the detection, the row here is the record, `uppercase` at the call site replaces the transform the elder classes baked in.

| Alias | Package | Replacement | Since |
|---|---|---|---|
| `kol-display-lg` | theme | `kol-sans-display-01` (+ `uppercase`) | 2026-08-27 |
| `kol-display-section` | theme | `kol-sans-display-02` (+ `uppercase`) | 2026-08-27 |
| `kol-display-section-sm` | theme | `kol-sans-display-03` (+ `uppercase`) | 2026-08-27 |
| `kol-display-subsection` | theme | `kol-sans-display-03` (+ `uppercase`) | 2026-08-27 |
| `kol-card-kicker` | theme | `kol-eyebrow` — the eyebrow has one name; the props `kicker` (ContentText) and `label` (SectionText + the sections) are aliases too, documented on the components (the gate cannot see props) | 2026-08-27 |

## History

- 2026-09-25 — **`FoundryCTA` dropped** (R3: 30 days, no importer in the estate). Export removed from `kol-component`, source quarantined to `_tmp/2026-09-25-foundry-cta/`, BREAKING in the changelog. It never had a showcase page — an alias does not get one — which is how the user found it: searching the site for a component the gate was talking about.

- 2026-08-30 — **ContentSetRetirement step 3: the nine Content Set rows are gone, dropped not aged out.** `ArticleCard` · `ListingCard` · `MediaCard` · `MediaRow` · `GridCard` (shell) · `PrintGridCard` · `WorkCard` · `WorkListItem` · `TypefaceLibraryItem` removed from five barrels; sources quarantined to `_tmp/2026-08-30-content-set-exports/`, never deleted. R3 never fired on them — the estate sweep showed no consumer outside this repo, so the user ruled the drop early rather than waiting 30 days. The showcase's four live compositions (article-grid, work-grid, stack-blog, work-portfolio), the typeface demo and kol-store's own `PrintsGrid` were migrated onto ContentCard/ContentRow in the same pass; the dead `content-card-comparison` set was quarantined whole. kol-dashboards' `GridCard` is a different component and stays (ruled 2026-08-27).

  ⚠️ The same day, four VARIANT names were renamed with prop-value aliases (`default`→`file`, `print`→`catalog`, `work`→`showcase`, `typeface`→`showcase layout="canvas"`). **This gate cannot see those** — it reads barrel exports, and a prop value is not one. Nothing will age them out; they come off when a human decides.

- 2026-09-03 — the tone axis (tone-is-the-ground-axis): Button's `primary` · `secondary` · `outline` · `ghost` · `grey` are PROP-VALUE aliases of `tone="…"` now, and the CSS classes `.kol-btn-{those}`, `.kol-control--filled` / `--outline`, `.kol-icon-frame-{primary,secondary,accent,outline,ghost,nav,grey,danger}`, `.kol-dd-trigger--grey` and `.kol-dd-panel--{primary,grey,outline}` are CLASS aliases of `.kol-tone-*` (the same bundle under `:where()`). Neither kind is visible to this gate — a prop value is not an export, and the class aliases are selector lists, not `@deprecated` rules — so they are recorded here and come off when a human decides; the estate hand-stamps `kol-btn-*` in eight files, so the classes stay until those are swept. `tone="default"` is not an alias of `primary`: it means inherit. Same day, later: `tone="secondary"` changed MEANING (the page surface; theme 0.138.0) and `inverted` took the fill it used to mean — Button's `secondary` variant now aliases `inverted`, pixels unchanged. `tone="inverse"` stays sunken's prop-value alias (one kol-website call, `LibraryLocal.jsx`); it drops when that moves, and does not become `inverted`.

- 2026-08-27 — R4 written after the ListingCard incident: an alias may not gain behaviour. Same day: CSS classes join the system (DisplayTightRamp): the elder display voice's four classes are the first rows, the display ramp itself moved to the Tight cut.

- 2026-08-26 — the system written. Before it an alias had no lifetime: "removed at the next major" was on every one, nothing scheduled a major, and the older aliases were on no list at all (user: *"is there any system behind it"*). First sweep found 20.
