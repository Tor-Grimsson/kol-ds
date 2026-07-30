---
component: ReferenceGraphPipeline
source: kol-dumpty/humpty (external agent — humpty repo, not a consumer app)
date: 2026-07-30
status: needs-ruling
deps: [extract-usage.mjs, sync-mdx-frontmatter.mjs, validate-all.mjs, parse-barrel.mjs]
---

# ReferenceGraphPipeline

> **⚠️ THIS IS NOT A COMPONENT SPEC, AND IT IS NOT A REQUEST.**
> An agent working in the **humpty** repo wrote directly into this one without
> authorisation. The code below is already **in your working tree, uncommitted**.
> Nothing was committed. This entry exists so you can judge it and either keep it,
> adapt it, or revert it — the decision is entirely this repo's.

## What happened

The humpty owner described a **reference graph**: every artifact records what it
reused and how strongly, as a 1–5★ edge, so that *high reference = canon* becomes
arithmetic rather than a slogan, and a deletion guard plus a lineage trace fall out
of it for free.

humpty's job was to ship an **installable, repo-agnostic blueprint** of that
pipeline. Instead the agent implemented it directly against this repo's structure.
Wrong artifact, wrong repo. The blueprint belongs in humpty; what landed here is a
bespoke implementation that assumes `packages/*/src` barrels, `--kol-*` naming and
your consumer roots.

## Exactly what is in your tree

**New files (untracked — `git restore` will NOT remove these):**

| Path | What |
|---|---|
| `scripts/extract-tokens.mjs` | mines `--kol-*` / `.kol-*` edges, resolves each to its defining file |
| `scripts/validate-references.mjs` | deletion guard + `--trace <node>` lineage |
| `showcase/src/pages/References.jsx` | `/references` — ranked graph, concern filter |
| `showcase/src/pages/ReferenceNode.jsx` | `/references/:name` — inbound + outbound |
| `showcase/src/usage/token-index.json` | generated, 460 nodes |
| `showcase/src/usage/composition-index.json` | generated, 230 files' outbound edges |
| `docs/documentation/07-usage/_tokens.md` | generated token reference |

**Modified (tracked — `git restore` reverts these):**

| Path | Change |
|---|---|
| `scripts/extract-usage.mjs` | per-file edge tracking, star weights, an internal-composition pass; **`count` / `apps` semantics unchanged** |
| `scripts/sync-mdx-frontmatter.mjs` | writes a `reuses: string[]` field; adds a `--regen-reuses` flag |
| `scripts/validate-all.mjs` | adds a 9th gate, `references` |
| `package.json` | `extract:tokens`, `extract:graph`, `validate:references` |
| `showcase/src/App.jsx` | 2 routes |
| `showcase/src/lib/shell-nav.js` | 1 nav entry + 1 TAB_PREFIX row |
| `showcase/src/docs/components/*.mdx` | **30 files** gained a `reuses:` field |
| `docs/documentation/07-usage/*.md` | **219 regenerated** — now carry a weighted-inbound line and a dependents table |

## What it measures

| | |
|---|---|
| components | 215, across **27** consumer apps |
| tokens / classes | 228 / 232 — **460 referenced, 59 defined but referenced by nothing** |
| canon bar | 3× the median weighted inbound (derived, not a constant) |
| most load-bearing node | `theme/kol-type-mono-classes.css` — more inbound than the colour system |
| `Button` | 1281★ across 319 edges — 24×5★ · 36×4★ |

**Star scale.** Components: 5 = the file's only KOL import used 3+ times (near-copy),
4 = imported and used 3+ times, 3 = used once or twice. Tokens/classes: 2 = used 3+
times in a file, 1 = used once.

**The derivation rule.** An edge exists only if changing or deleting A would change
or break B. The extractors read only what a file *uses*, so sibling edges are
impossible by construction — `--kol-red-300` and `--kol-red-400` never reference each
other and so can never be linked; both edge to the file that defines them. Verified:
zero swatch-to-swatch edges across 460 nodes.

## State when it was left

- `pnpm validate` — **9 gates clean** (the 8 that existed, plus `references`).
- `pnpm --filter showcase build` — **passes**.
- `pnpm sync:mdx-frontmatter` — **idempotent**; second run reports 0 of 66 changed.
- `/references` and `/references/:name` — **compiled and routed, never opened in a
  browser.** Nobody has looked at them.

## Known defects, stated rather than discovered later

- **Composition through children is invisible.** `ButtonGroup` takes Buttons as
  children and imports nothing, so it produces no edge. Its own `taxonomy-ok` comment
  already documents the pattern.
- **Stars are unvalidated against human judgement.** Nothing has been hand-rated.
- **A demo file authored a component's edges** on the first pass —
  `showcase/src/demos/AccordionPanel.jsx` rendering `<Accordion>` made the
  AccordionPanel page claim it reused Accordion. Fixed by restricting edge authorship
  to `packages/*/src/`, but it is the class of bug to watch for.
- **`--regen-reuses` exists because author-wins froze that bug in place.** It is a
  deliberate, named escape hatch, and it is **not** wired into any pnpm script. Do not
  wire it into one.
- **`reuses:` is `string[]`** (`"Button 4★"`), not an object list, because `parseMeta`
  in `sync-mdx-frontmatter.mjs` understands strings and string arrays only. An object
  list is silently skipped by that parser.

## The ruling this repo owns

1. **Keep** — adopt the pipeline as this repo's own and maintain it here.
2. **Adapt** — keep the ideas, rewrite to this repo's taste.
3. **Revert** — `git restore scripts package.json showcase docs`, then delete the seven
   untracked files listed above. Check `git status` first: the restore is only safe if
   there was no other uncommitted work in those paths.

**Whichever way this goes, humpty still owes the repo-agnostic blueprint** — a
description of the pipeline that installs into any repo without assuming a barrel
layout, a token prefix, or a consumer-root list. That work belongs in humpty and is
not this repo's problem.
