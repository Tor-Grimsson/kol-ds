---
title: Apps tier
type: index
status: active
created: 2026-09-21
updated: 2026-09-28
description: Products proved as real apps before publishing
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
related:
  - "[[../INDEX|Operations]]"
---

# Apps tier

**The concept is written once, in dotfiles: `~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md`. Read that first — it holds the why, the three-tier table, the data rule and the shared-shell rule. Nothing on this shelf restates it.**

What lives here is this repo's depth: which app is being built, in what order, and which are queued behind it.

| Page | What it holds |
|---|---|
| [[01-tier-rules\|Tier rules]] | How an app is wired here — shape, publishing, ownership, data, gotchas. Outlives any one app |
| [[02-media-app-plan\|Media app plan]] | The first app — phases, acceptance, and the one decision still held |
| [[03-candidate-apps\|Candidate apps]] | The roster the tier will absorb, one at a time. Only media is committed |

## The apps

| Workspace | Runs on | What it is |
|---|---|---|
| `apps/media` | `pnpm media` · `/apps/media` | the media tool alone |
| `apps/media-shell` | `pnpm media-shell` (5175) · `/apps/media-shell` | the same tool on kol-shell's `AppHub` — Browse loads at `/`; Library (`/library`, RECENT · FAVOURITES · DRAFTS) · Notes (`/notes`, the editor in the page) · Settings (the Hub's, with media's display rows and drawer) |
| `apps/notes` | `pnpm notes` (5177) · `/apps/notes` | the notes tool alone — kol-notes over the fixture's fake D1 `notes` table, through media-fixture's `useNotesTool`; media-shell carries it as the Notes tab (`/notes`) |
| `apps/presentation` | `pnpm presentation` (5178) · `/apps/presentation` | the decks tool alone — kol-deck over the fake D1 `decks` table, through `useDecksTool`; exports PNG · PDF · PPTX · `.deck.json`. media-shell carries it as the Decks tab (`/decks`) |
| `apps/brand` | `pnpm brand` (5179) · `/apps/brand` | the brand tool alone — kol-styleguide's `Brand` over the fixture brand (kol-brand plus the book's copy, `useBrandTool`); the page in the hash (`#assets`). media-shell carries it as the Brand tab (`/brand`, `/brand/assets`) |
| `apps/editor` | `pnpm editor` (5180) · `/apps/editor` | the design editor alone — `@kolkrabbi/design-editor` read from its **source** (a Vite alias, since the package's exports point at `dist/`), browsing the fixture bucket through `<DesignEditor mediaClient>` and keeping its preferences in the fake D1's `tool_settings` row for `editor` through `settingsStore` |
| `apps/controls` | `pnpm controls` (5181) · `/apps/controls` | the controls reference — kol-hardware's parametric set (incl. `EnvelopeGenerator`), kol-component's app controls and panel formats, and the compositions consumers build (module front, mixer channel front/back, params rail, editor parts), each specimen listing where the same thing is still hand-built. Reference only, nothing wired; the page in the hash (`#app`, `#compositions`) |
| `apps/curves` | `pnpm curves` (5182) · `/apps/curves` | the envelope generator alone — kol-hardware's `EnvelopeGenerator` (equation \| ADSR) over the one signal engine (`@kolkrabbi/kol-hardware/signal`), and its `SignalReference` as a panel, popover or sheet, picked from the masthead's Reference dropdown |
| `apps/workshop` | `pnpm workshop` (5183) · `/apps/workshop` | kol-workshop's shell alone over `workshop-fixture` — header, rails, palette, tag browser, reader — laid out as the showcase is today, so every shell change is built and judged here first (plan-2026-09-28-showcase-refinement) |
| `apps/markdown` | `pnpm markdown` (5184) · `/apps/markdown` | kol-markdown alone — a fixture doc or your own text beside what the engine reads: rendered · frontmatter and its round-trip · structure · tags · inventory · corpus counts |
| `apps/search` | `pnpm search-app` (5185) · `/apps/search` | kol-search alone — the query, how it was read, results with the reasons each ranked where it did, facets to narrow by. `pnpm search` is pnpm's own registry search, hence the name |
| `apps/workshop-fixture` | — (private package) | the invented corpus the three apps above share: 19 markdown docs with frontmatter across documentation · operations · development, 24 components, 3 blocks, 2 sets, the showcase's spaces — built into the vault tree, the component tree and kol-search items |
| `apps/media-fixture` | — (private package) | the imagined olina setup both apps run on: a fake bucket (`bucket.js`) and a fake D1 (`d1.js`), the client over them, and `useFixtureMedia` — the wiring both apps share so neither grows a copy |

A media feature ships in the DS and shows in `apps/media`; `apps/media-shell` adds only the shell around it. `apps/shell` (`pnpm shell`, 5176) is the Hub alone, around a placeholder tool — the reference both are judged against.

Build order came in as a ticket: `lobby/inbox/apps-tier-media-first.md`.
