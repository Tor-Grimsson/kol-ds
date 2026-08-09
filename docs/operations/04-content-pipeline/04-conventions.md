---
title: Conventions and gates
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: The format rules, paired with what enforces them
aliases:
  - formats-lint
  - pipeline-conventions
tags:
  - domain/content-pipeline
  - audience/agency-internal
  - pattern/docs-as-data
related:
  - "[[INDEX|content pipeline]]"
  - "[[01-sources|the seven content roots]]"
  - "[[05-lookup|lookup]]"
---

# Conventions and gates

The governing principle of this repo, learned the hard way across 2026-07-30: **a rule with a script survived; a rule in prose drifted.** Every convention below names the gate that enforces it, or says plainly that it has none.

## Filenames

| Root | Convention | Why |
|---|---|---|
| `docs/**` | kebab-case, lowercase, `NN-` prefix | framework `01-conventions.md`. `INDEX.md` and UPPERCASE meta files (`SHIPPED-PACKAGES.md`) are exempt |
| generated catalogs | keep the generator's naming, unprefixed | the generator owns the folder; hand-renaming its output breaks the next run |
| `showcase/src/docs/*.mdx` | PascalCase for component docs (`Button.mdx`), kebab for standalone pages | the filename is the lookup key for `ComponentPage` |
| `showcase/src/demos/` | kebab, one file per demo | one-file demo model — preview and code render from the same file, so they cannot drift |

**Generated catalogs live outside `docs/`** ([[01-sources|sources]]). The exemption above describes how a generator names its files; it is not permission to write them into the vault.

## Frontmatter

| Root | Contract | Gate |
|---|---|---|
| `docs/**/*.md` | framework schema — `title` · `type` · `status` · `created` · `updated` · `description` · `tags` · `related` | **`pnpm validate:metadata`** (shape), `validate:vault-links` (links) |
| `showcase/src/docs/*.mdx` | same contract, generated | **`pnpm validate:frontmatter`** (`sync-mdx-frontmatter.mjs --check`) |

The nine `type:` values and the closed tag taxonomy are defined in `.kol/docs-framework/`. `type` picks the body shape; `tags` must come from the closed namespace list (`domain/` · `pattern/` · `provider/` · `audience/` · …). A tag outside it is not a new idea, it is a typo.

### The shape

Frontmatter **renders** — every field is a row in the reader's metadata panel, in a fixed two-column box. Three rules, gated by `validate:metadata` (user ruling 2026-08-01):

| | Rule | What it was |
|---|---|---|
| **M1** | A title is a NAME. No ` — ` clause | 36 of 56 titles carried one — `Foundations — the token system` printed one fact as two, and the clause **is** the description |
| **M2** | A description is **≤ 8 words** | 56 of 56 ran over; the worst was 82 words, and it ran off the right edge of the panel. *"meta data is not for babling wihtout limits"* |
| **M3** | Sentence case | a title and a description start with a capital, with an allowlist for names that spell themselves lowercase (`shadcn`, `pnpm`, `kol-*`) |
| **M4** | `created` is present | the panel showed only `updated`, so a doc had no age. Backfilled across all 56 from **file birth time** — a real timestamp from this machine, not a guessed one, and the only honest source available |

**Values are sentence case too.** `type` and `status` carry closed enums and rendered as `reference` / `active` under capitalised labels; the reader authors their case against the key. Every other value is content and prints exactly as written.

**`aliases` no longer renders.** It is an Obsidian field — Quick Switcher and search autocomplete, per `.kol/docs-framework/01-conventions.md:65`, and explicitly not part of wikilink resolution. Nothing in the app reads it, so it stays in the file and stops taking a row in a panel that shows facts.

The check is on the **source**, not the renderer — same reason as `validate:headings`. `cleanTitle` had been stripping the dash clause at render time, which hid the babble and kept it; the clause is gone from the data now and the stripper is a no-op on conforming docs.

**Counted, not enforced:** 24 of 66 component MDX descriptions still exceed the limit. They are mined from package JSDoc by `extract-descriptions.mjs`, so a hand-rewrite is overwritten on the next regen — the fix is in the package source. The gate prints the count rather than skipping it silently.

**The remaining asymmetry:** nothing checks the tag namespace on either surface.

## Wikilinks

Explicit-with-display form always, and **with the path** — `../01-foundations/02-color` as the target, not `02-color`. A bare filename resolves inside Obsidian, which searches the whole vault by name, and resolves nowhere else. The showcase renders these docs by path, so a bare link is a dead route in the app while looking perfectly fine in the editor.

Sibling cross-references go in **both** files' `related:` fields. A one-way link is a broken relationship that looks fine from one side.

Gate: **`pnpm validate:vault-links`**. Written 2026-07-31, when this section was authored and the claim "references gates wikilinks" turned out to be false — `validate:references` is the component **deletion guard**, unrelated to markdown. The new gate found **17 dead links** on its first run, fifteen of them pre-existing bare links exactly as described above.

## Casing

Strings are authored in the case they render. No `text-transform`, no `charAt(0).toUpperCase()`, no `::first-letter`. Casing is a content decision made at the call site — a component that enforces it makes every consumer fight it, and it breaks under translation.

**A DERIVED label is still authored — at the data layer (user ruling 2026-08-01).** A slug, a filename or a frontmatter key that becomes a visible label is cased where the string is *made*, never by CSS. `showcase/src/nav/labels.js` is the one rule: it drops a file extension and a numeric prefix, splits PascalCase on the case boundary (`CreateButton.jsx` → `Create Button`, `KOLButton` → `KOL Button`, runs of capitals kept whole) and sentence-cases the rest. It was written **byte-identically in two files** — `shell-nav.js` and `vault.js` — until they were collapsed onto it. `DocsFrontmatter` carries the same rule for an unlisted frontmatter key, which used to print raw and snake_cased.

Gate: none for the case itself. Enforced by there being **one** derivation.

## Gate set

`pnpm validate` runs all fifteen and prints one scoreboard. Ordered by what they protect:

| Gate | Protects |
|---|---|
| `validate:roster` | the component roster matches the package barrels — no phantom components, no missing ones |
| `validate:taxonomy` | every component resolves to a real tier; the `misc` bucket stays empty |
| `validate:groups` | sidebar groups are complete and non-overlapping |
| `validate:imports` | no cross-package import breaks the dependency direction |
| `validate:foundations` | the foundations page reads live theme values, never a copied literal |
| `validate:width` | the one-frame law — main column caps at canvas, no hardcoded pixel max-widths, panel-bound content capped |
| `validate:rails` | one row idiom and one label voice across every rail |
| `validate:frontmatter` | the MDX frontmatter contract |
| `validate:metadata` | the vault frontmatter SHAPE — a title is a name, a description is ≤ 8 words, both sentence case |
| `validate:headings` | an H2 is a nav label, not a sentence — it renders as a rail row |
| `validate:chrome` | a declared variant carries a state; no arbitrary `rounded-[…]`/`shadow-[…]` |
| `validate:references` | a load-bearing component isn't deleted out from under its dependents — the **canon deletion guard**, nothing to do with markdown |
| `validate:vault-links` | every `[[target\|display]]` in `docs/` resolves **by path**, the way the app reads it |
| `validate:drift` | generated artifacts match their sources |
| `validate:reachable` | every route is findable by name in ⌘K, including quarantined ones — and **E1b**: a slot-page contributes a search row *and* has a real Route, so a page that moves from `ALL_ROUTES` into a chapter cannot go missing |

## Ungated rules

Named honestly, because an ungated rule is the one that breaks next:

| Rule | Where it lives |
|---|---|
| Vault frontmatter conforms to the framework schema | `.kol/docs-framework/01-conventions.md` |
| Tags come from the closed taxonomy | `.kol/docs-framework/03-tag-taxonomy.md` |
| No auto text-transform | convention |
| Generated output never lands in `docs/` | [[01-sources\|this section]] — new as of 2026-07-31 |
| A surface is not a category | [[02-taxonomy\|taxonomy]] — new as of 2026-07-31 |
| Either subfolders or loose files at a level, never both | `.kol/docs-framework/01-conventions.md` |

The last three are the ones that produced this section. They are prose today; on the repo's own evidence, prose is where rules go to be walked past.

## Regeneration

| Command | Refreshes |
|---|---|
| `pnpm extract:usage` | mined call-sites from the consumer repos |
| `pnpm extract:docs` | doc meta, API rows, composition, origins |
| `pnpm extract:tokens` | the token index |
| `pnpm extract:graph` | usage + tokens + MDX frontmatter in one pass |
| `pnpm sync:mdx-frontmatter` | rewrites MDX frontmatter idempotently |

`extract-usage.mjs` reads sibling repos by absolute path and **hard-fails if a root is missing** — a 2026-07-15 audit found nine dead roots producing a "clean" run that would have silently wiped the index over the real one.
