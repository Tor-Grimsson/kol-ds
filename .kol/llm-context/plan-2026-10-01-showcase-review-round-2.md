# Plan — the showcase review, round 2

**Raised:** 2026-10-01, the user's review of ui.kolkrabbi.io. Points verbatim: `backlog/2026-10-01-showcase-review-round-2.md` (P1–P10); each phase names the P it answers.
**Status:** every phase not TALK or PARKED is built (✅), 2026-10-01 — **published**: kol-theme 0.162.0 · kol-component 0.235.0 · kol-workshop 0.36.0. TALK visuals are on open-questions Round 6. Record: `docs/operations/09-phase-log/2026-10-01-review-round-two.md`. **TALK** = his to rule before it is built; nothing here is decided for him.
**Shape:** W › phase › list. A W is a subject; a phase is one buildable piece of it; the list is what the phase does.
**Laws carried:** every rail group opens its own page; the label is a link, the chevron folds; something is always "on this page"; visual calls go on the open-questions page, not into a rule; nothing is deleted — replaced files move to `_tmp/<date>-<what>/`.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

---

## W1 — Search

### 1.1 — Palette keys (P1) — ✅ built 2026-10-01
- Enter opens the highlighted suggestion.
- ⌘Enter opens the results page.
- The "All results for …" footer is a link to the results page.

### 1.2 — Results page (P2 · P4) — ruled 2026-10-01 — ✅ built 2026-10-01
- Frontmatter hidden by default; F shows it.
- Search eyebrow + Search title + count line become one line; one result count, not two.
- One filter row: kind, as `Tag`. Everything else (scopes, "read as", Category, Tags) folds behind a `+`.
- Built from the shipped filter component — the row is `ContentFilters`/`Tag`, no Pill, no Button, no second tab strip.
- Syntax, scopes and the engine's explanation live on the search home, not here.
- References (he dislikes both; useful only for restraint): MDN, GitHub Docs search.

### 1.3 — Result row (P2) — TALK, visual → open-questions round
- Readable ink at rest.
- Hover lifts the title to full ink and/or the background variant.
- Match underline and hover underline stop being two different underlines.
- The three mono words explained or cut; one casing.
- Path on every row; description on all or none.
- An icon per kind.

### 1.4 — Search loop (P3) — ✅ built 2026-10-01
- Results → Tags → Graph → Results returns to the query, not the search home.

### 1.5 — Search pages are pages (P3) — ✅ built 2026-10-01
- Tags, Graph and A–Z carry frontmatter.
- Results becomes a real page, not an alias of Search.

### 1.6 — Search rail (P3) — TALK
- The breach [Image #11]: a foldable group whose children are flat leaves with nothing under them. The shape that fixes it is open. Same answer as W3.2.

## W2 — Tags and the graph

### 2.1 — Graph stays a graph (P3) — ✅ built 2026-10-01
- Clicking a node selects it; the view does not navigate away.
- The selected node lists its connected tags (in the view or the rail).
- Opening the tag's results is the explicit second step, as in Obsidian.

### 2.2 — Graph contents and settings (P3) — TALK
- Today: tags only. Obsidian: files, orphans, filters, display, forces.
- Which of those we take.

### 2.3 — The tag taxonomy session (P3) — PARKED for its own session (ruled 2026-10-01)
- Why `domain/` parents nearly every tag.
- What the parents should be (search, the space, the kind).
- Done with him, tag by tag.

### 2.4 — Tagging from the site (P3) — PARKED behind 2.3
- His idea: set tags in the browser, stored (D1 or similar), merged into the markdown in a code session.

## W3 — Rails, shell, header

### 3.1 — Library rail loses the "Library" level (P5) — ✅ built 2026-10-01
- Never approved. The rail shows Group by, then COMPOSITION and COLLECTION as top-level uppercase groups.
- No space lists itself as its own parent — check every space.

### 3.2 — Tools rail (P4) — TALK
- Same breach [Image #13]: Tools folds over flat leaves; "there should be sub pages". Same answer as W1.6.

### 3.3 — Label click keeps the list open (P9) — ✅ built 2026-10-01
- Clicking a parent label (Atoms) from a child navigates to its home; the group stays open.
- Only the chevron folds.

### 3.4 — Header order (P5) — ✅ built 2026-10-01
- Library first, Styles second.

### 3.5 — On this page is never empty (P4) — ✅ built 2026-10-01
- The outline starts at the page's first section, the h1 included — site wide.
- A page with no markdown headings (References) still lists its parts.
- Gate: no page renders an empty outline.

### 3.6 — Back keeps the scroll place (P9) — ✅ built 2026-10-01
- Returning to a components home or the wall restores the vertical position (per path, kept in the browser).

### 3.7 — Rail icons (P3) — TALK, visual
- Only Quick actions and Tags carry icons; propose icons for rail groups and pages.

### 3.8 — Show everything (P5) — TALK
- A shortcut that expands the whole rail tree.

### 3.9 — Rail fade (P5) — ✅ built 2026-10-01
- Gradient fade at the bottom of a scrolling rail.

### 3.10 — Resize handle variant (P6) — ✅ built 2026-10-01
- col-resize cursor on hover.
- Border highlights on hover / drag.
- Double-click expands or collapses (icon-rail style).
- A new variant beside the existing one, in the package.

## W4 — Pages that must exist

### 4.1 — Missing homes (P4) — ✅ built 2026-10-01
- Development › References.
- Development › Quarantine.

### 4.2 — Open-questions frontmatter (P4) — ✅ built 2026-10-01
- Every entry carries its own, not only the home.

### 4.3 — Preview scan (P9 — third ask) — ✅ built 2026-10-01
- A gate listing every component without a working preview.
- The demos to close it (81 known on the wall, mostly molecules).
- The gate stays, so it cannot regress silently.

## W5 — The reference home and the front door

### 5.1 — Lookup (P5) — he flagged IMPORTANT; ruled 2026-10-01 — ✅ built 2026-10-01
- A group at the top of the Library rail, `/library/lookup`.
- Pages: names + the site tree · opacity and ink roles · sizes · tiers and placement · plan shape (W › phase › list) — each built for lookup ("what is the stop called").
- Sources already written: `00-overview/05-names.md`, `01-foundations/10-opacity.md`, `09-sizes.md`, `03-components/02-placement.md`.
- Named Lookup, not Reference — Development › References already exists.

### 5.2 — Introduction and Installation (P5) — ✅ built 2026-10-01
- What KOL is, on one page.
- Install lines per package manager in one place (today: landing, component pages, base-layer package pages).
- "Spaces" documented as a term.

### 5.3 — Rename Blocks → Modules (P5) — ruled 2026-10-01: "I like modules more" — ✅ built 2026-10-01
- shadcn's word out, Modules in: Components → Modules → Apps.
- Open: kol-hardware already says "module" (`ModuleFrame`, `ModuleHeader`, rack modules) — the names doc must keep the two apart.
- A rename is a ledger entry (aliases), a route change and a names-doc change.

### 5.4 — Landing walls per kind (P5) — TALK
- The landing's card wall as the format for components, blocks, apps, sets, packages — a landing each.

### 5.5 — Landing double padding (P7) — ✅ built 2026-10-01
- Hero and cards pad twice (page + own). One owner.

## W6 — Component pages

### 6.1 — Spacing (P8) — ✅ built 2026-10-01
- Description → preview gap (Action Button has none).
- Heading → content gap equal for Usage and API Reference.
- Find why Button and Action Button differ on the same page component; remove the second path.

### 6.2 — API table (P8) — ✅ built 2026-10-01
- The minimal table's rule after the last row becomes a prop, default off.
- The table fills the content width.
- A larger gap before prev/next.

### 6.3 — Prev/next arrow (P8) — ✅ built 2026-10-01
- The `→` is a typed character, not a KOL icon. Use the set's arrow.

### 6.4 — Knob bugs (P9) — ✅ built 2026-10-01
- Tone knob does nothing on SegmentedToggle.
- Size lists smallest → largest, not md first.

### 6.5 — Sections vs shadcn (P8) — TALK
- shadcn: title · description · Installation (pm tabs) · Usage · Composition (tree) · one section per example, each with preview + code · API Reference.
- Ours: one preview with knobs · Installation · Usage · Variants · Props.
- Write the comparison, propose our order.

### 6.6 — Knob bar (P8) — TALK, visual
- Variant and tone dropdowns name themselves: first row the knob's name, divider, then the list.
- Bordered SegmentedToggle beside borderless dropdowns clashes: all dropdowns, or one settings popover holding every knob.

### 6.11 — ✅ built 2026-10-01 (kol-component 0.236.0, `TabChips` — the user: "I think thats a good idea") — The tab chips are not a DS component (user 2026-10-01, Image #36: "what is this button? its not DS?")
- Preview/Code and pnpm/npm/yarn/bun are `showcase/src/lib/DocTabs.jsx` — hand-built chips, showcase-local.
- Replace with the shipped tab/toggle component; retire `DocTabs` to `_tmp/`.
- **User 2026-10-01:** "we can just make a tab chip for this purpose exactly like this? just logging it as such?" — option D for Round 6 Q2: promote these chips into kol-component as they are, as their own tab-chip component.

### 6.13 — Install block: the tab row's divider is glued to the code block (user 2026-10-01, Image #37) — REGRESSION from 6.1 — ✅ built 2026-10-01
- 6.1 zeroed the code block's own block margin page-wide (`DocArticle`, `[&_.kol-codeblock-wrapper]:my-0`); in `InstallBlock` that margin was the only space between the pm tabs' rule and the code.
- Fix: the install block owns that gap itself (space between its tab row and its body), so it no longer depends on the code block's margin.

### 6.14 — "Demo" becomes "preview" in the code (user 2026-10-01: "can we henceforth just drop that word and use preview or component preview")
- He never says demo; the component he sees is `PreviewCard`. In talk and prose it is already "preview" (memory: say-preview-never-demo).
- The code still says demo: `showcase/src/demos/`, `DEMOS`, `demos-registry.js`, `DemoStage`, `DemoPreview`, `validate:demos`, `NO_DEMO`. One rename sweep, not started.

### 6.12 — Knob values are lowercase (user 2026-10-01: "everything is always in lowercase for some reason")
- The knobs print raw prop values (`primary`, `md`). Decide the casing with 6.6.

### 6.7 — Preview ground (P8 · P9) — TALK, visual
- The stage is so grey a primary/default Button vanishes.
- Darker stage (~fg-02) or the demo defaults to secondary.

### 6.8 — Eyebrow path (P8)
- "COMPONENTS / ATOMS" above the title — keep or cut. Minor.

### 6.9 — Atoms home filter (P10) — TALK
- A checklist dropdown on the right of the "All components" bar to show/hide the big groupings (hardware…), instead of ContentFilters.

### 6.10 — References table footer (P4) — ✅ built 2026-10-01
- Space above the divider under "Showing the top 300 of 721".

## W7 — The component audit

### 7.1 — Tier scan (P9 · P10) — ✅ built 2026-10-01
- Scan every atom for the KOL components it renders.
- Table: component · what it nests · proposed tier.
- Named suspects: Audio Player, Chess Board, Rail Section, Clearspace Diagram, Rotary Dial with label + value, Action Button.
- Whether the ladder needs another rung. Moves are his ruling.

### 7.2 — Overlap scan (P9) — ✅ built 2026-10-01
- Every pair that looks like one component. Report; merges are rulings and ledger entries.
- ~~Ruled 2026-10-01: Audio Player · HLS Video → one `MediaPlayer`~~ — **NOT DONE, back to the user.** The ruling was made on my wrong description: `HlsVideo` is an inert background video with its controls deliberately stripped, not a player. The fix is its name, not a merge. See `backlog/2026-10-01-component-audit.md` § 2.
- Avatar · Profile Avatar — open.
- **Hls Video (user 2026-10-01):** "I dont see this as an atom, since it has NO UI, its utility or another category of things paint something but have NO UI? and yes namechange probably for it?" — not an atom; utility, or a new category for things that paint with no UI; and a new name. Both are his to rule.

### 7.3 — Button variants (P8) — ✅ built 2026-10-01
- Tone now does what several variants did; list the redundant variants. Report, then his ruling.

### 7.4 — Small defects (P9) — ✅ built 2026-10-01
- Badge with icon has no gap.
- Clearspace Diagram preview clipped.
- Close Button demo labels are lowercase dev notes.
- Section Label shows three identical lines while size lives in the stepper.
- Rocker Switch sits on a stray background — OPEN (user 2026-10-01: "the component is not the component + its panel, that would be a module"). The plate is drawn by the demo file, on 12 hardware demos; strip it from all 12.
- Empty outline: gate P4 added to `validate:rail-pages`; it fails on 7 pages (six Docs chapter indexes, the phase log) — to fix.

### 7.5 — "The parts that make up a thing" (user 2026-10-01) — TALK, his to rule; he needs this in the system
> the collection of things you mentioned module frame module header iu 3u rack and its rack as a whole, would that not constitute a block? or a module? channel strip is not in that, its a part of mirror system more channel mixer based. but still hardware. it would be its own collection. … if that is not a 'block/module' … then what is it? because it certainly is a collection or a group. this is what I originally intended as a set. but that set changed into something else. … I need to be able to find the collection of parts that make up things like the rack, or the mixer or the blog, or the foundry etc. etc.
- The rack (rows, 1U/3U, module frame + header + controls) and the mixer (channel strip) are two such collections; neither has a home today, and the rack itself is not in the design system.
- What "Set" was meant to be vs what it became — to settle with 5.3 (Blocks → Modules) and 7.1 (tiers).

## W8 — Record

- Phase log entry per W; names doc, shells doc and homes match what shipped.

---

## Answers already given

- **Pin** (P5) — a Pinned list in the right rail, kept in this browser's localStorage; survives reloads, not synced.
- **Site tree** (P5) — drawn at `/library`, written in `05-names.md` § The tree. Its home is W5.1.
