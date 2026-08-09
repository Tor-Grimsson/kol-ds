---
component: ReferenceGraphPipeline
source: kol-dumpty/humpty (external agent — humpty repo, not a consumer app)
date: 2026-07-30
status: closed
deps: [extract-usage.mjs, sync-mdx-frontmatter.mjs, validate-all.mjs, parse-barrel.mjs]
staged: 2026-07-30
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

---

## ✅ RESOLUTION — 2026-08-01

🟢 `closed` — **KEEP.** The user's ruling, verbatim: *"right thats the humpty
agent went rouge yesterday, so its a good system, we could adopt -- so I say yes
adopt it"*.

Adopted as-is rather than adapted. humpty's own blueprint decided the shape:
*"implement the contract natively when the repo already mines its own usage —
extending an existing extractor keeps one source of truth; adding a second
produces two graphs that disagree."* This build **extended** `extract-usage.mjs`
in a separate field rather than forking it, so it was already the right shape.

### The audit the entry asked for

| Contract rule | Verdict |
|---|---|
| only a thing's own source may author its edges | ✅ `isSource()` at `sync-mdx-frontmatter.mjs:75` restricts to `packages/<pkg>/src/`, documented with the AccordionPanel bug that motivated it |
| canon bar is a multiple of the median, not a constant | ✅ `median * 3` in both the validator and the page; median computed on **sorted** weights, verified |
| `--regen-reuses` never wired into a script | ✅ present only as an `argv` flag in `sync-mdx-frontmatter.mjs:40`; zero hits in `package.json` |
| computed, never declared; disagreements reported | ✅ `sync-mdx-frontmatter.mjs:280-287` — author-wins, and a difference is pushed to `disagreements` |

### The pages were opened — and that is where the defects were

The entry's own flag was *"compiled and routed, never opened in a browser."* Both
were opened at 1280×720 against a task-scoped dev server (killed after).

| | Found | Fix |
|---|---|---|
| ✅ | `/references` — 663 nodes, ranked, filter and sort work; the canon bar renders as *"60★ (3× the median of 20)"* | none needed |
| ⚠ | `/references/:name` hand-rolled `<table className="kol-table w-full">` inside an `overflow-x-auto` div — **on the page whose entire subject is what you reused** | now the DS `Table` with `width="column"`; the wrapper div goes, since the Table caps itself |
| ⚠ | that table's header rendered as `★usesfile` and the counts touched the paths | the hand-rolled cells had no role class, so no padding — now the documented `kol-table-cell-*` roles |

### Hand-rating — the first in either repo

**9 of 9 sampled edges agree with the stated rule.** Four 5★ (`Icon` in
SearchInput, `Divider` in SpecList and EditorShell, `Slider` in
TypefaceVariablePreview — each the file's only KOL import, each used 3+ times),
three 4★ (used 3+ times *with* other imports present), two 3★ (used once). Each
verified by reading the source and counting.

The sample is small and the other ~540 edges remain unchecked. That is now stated
in the doc rather than left implicit.

### Documented

`docs/operations/05-reference-graph/` — `INDEX.md` + `01-pipeline.md`, covering the
five stages as implemented, the derivation rule, the star scale, the canon bar,
the commands, and the **known limits up front**: composition-through-children is
invisible, package imports are opaque, stars unvalidated beyond the sample.

**One finding recorded rather than fixed:** the median/threshold arithmetic is
transcribed in *two* places — `validate-references.mjs:57-59` and
`References.jsx:60-62`. They agree today. Two hand-maintained sources always
drift, and that is this repo's own standing rule. Named in the doc as a warning
block; collapsing them is a separate call.

**humpty still owes the repo-agnostic blueprint** — and has since shipped it at
`docs/documentation/03-surveyor/03-pipeline-blueprint.md`, read during this
adoption. That side is settled.
