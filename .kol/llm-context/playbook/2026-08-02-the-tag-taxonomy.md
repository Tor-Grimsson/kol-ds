---
title: The tag taxonomy
type: playbook
status: active
created: 2026-08-02
updated: 2026-08-02
description: Making tags discriminate, and the repo/DS audit
tags:
  - domain/conventions
  - audience/agency-internal
---

# The tag taxonomy

Append-only. Real timestamps. One idea per line.

## 0. Prerequisites

- 06:50 — User: *"we need to make sure each page has the tags to map out 'This page'"*. Audited before writing: the problem is not coverage.
- 06:51 — **72 of 78 docs carry `domain/design-system`** — 92% of the vault. A tag on nearly everything discriminates nothing, and the graph draws an edge between every pair.
- 06:51 — **20 of 29 tags appear exactly once.** A tag with one member connects nothing either. The set fails at both ends.
- 06:52 — 18 docs carry a single tag; for 12 of them that tag is the 92% one, so they are effectively untagged.
- 06:52 — Distribution: 1 tag → 18 docs · 2 → 46 · 3 → 13 · 4 → 1.
- 06:40 — Separately, the repo-vs-DS audit ran. Keyword counting was a POOR instrument — it called `05-brand/INDEX` repo for using the word "pipeline" once. Verdicts below are by subject, not vocabulary.
- 06:42 — Four files sit against their own chapter's verdict: `06-research/workflows/` (6 pages) → operations · `08-breakpoints/03-methods.md` → operations · `03-showcase/02-doc-card-sets.md` → foundations · `01-release/02-shipped-packages.md` stays (DS fact, release ritual owns it).
- 06:43 — `05-reference-graph` is the one undecidable chapter: repo machinery, design-system subject. Either home defensible.
- 06:44 — Moving `workflows/` leaves `06-research` holding `benchmark/` alone — under the 3-page minimum that landed hours earlier. Benchmark's index is 143 lines / 9 sections and splits cleanly.

## 1. The three axes

- 07:05 — `domain/<subject>` clusters · `audience/{consumer,agency-internal}` filters · `pattern/`+`provider/` only where genuinely true.
- 07:06 — First attempt gave DS pages ONE tag — `audience/` was scoped to machinery only. My own guard refused the write, which is what a guard is for.
- 07:08 — Fixed by making audience apply to EVERY page: two values, both real, and the repo-vs-DS audit becomes greppable instead of judged per file.
- 07:09 — Then the guard refused again: `audience/consumer` at 47/78 is over half. Scoped the >half rule to `domain/` only — that axis exists to cluster; `audience/` is a filter and is SUPPOSED to cover half.

## 2. The sweep

- 07:10 — 78 docs rewritten. **29 tags → 21.** `domain/design-system` deleted, not redistributed.
- 07:11 — Three singletons survived the sweep: `domain/color` folded into `domain/tokens`, `pattern/blocks` and `pattern/distribution` dropped as filler.

## 3. The gate

- 07:14 — `validate:tags` — T1 ≥2 tags · T2 closed namespace · T3 no domain tag over half · T4 no singleton. All four negative-tested. **18 gates.**

## 4. The folder moves

- 07:20 — `06-research/workflows/` (6 pages) → `operations/06-workflows/`.
- 07:22 — `06-research` then held benchmark alone. Benchmark's 143-line index split into `01-comparison` · `02-gaps` · `03-rejected`; the subfolder is gone and 06-research IS the benchmark chapter.
- 07:25 — `08-breakpoints/03-methods` → `operations/06-workflows/07-device-testing`. `03-showcase/02-doc-card-sets` → `01-foundations/07-doc-card-sets`.
- 07:27 — That left `03-showcase` at 2 pages, under the minimum — split `02-root-causes` out of the roadmap. Evidence · diagnosis · response, three pages.
- 07:28 — 15 wikilinks repointed across four passes; relative depths inside moved files were wrong every time and only the gate caught them.

## 5. Verification

- 07:32 — All 18 gates clean. 374 links resolve, 81 vault docs, 14 chapters.
- 07:33 — `05-reference-graph` left in operations DELIBERATELY — repo machinery, DS subject, the one genuinely undecidable chapter. Written into 02-taxonomy.md so it reads as a decision.
- 07:33 — NOT opened in a browser.
