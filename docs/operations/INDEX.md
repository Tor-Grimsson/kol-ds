---
title: Operations
type: index
status: active
created: 2026-08-01
updated: 2026-08-01
description: Repo machinery for the KOL packages
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[../INDEX|docs home]]"
  - "[[../documentation/INDEX|KOL documentation]]"
---

# Operations

Repo machinery — how the KOL packages get versioned, published, eyeballed, and how this vault reaches the screen. This is the process *around* the repo, not the design system itself (that's [[../documentation/INDEX|documentation/]]).

| Section | What it covers |
|---|---|
| [[01-release/02-shipped-packages\|Shipped packages]] | **THE package list** — every `@kolkrabbi/*` package + current version, one table. Updated with every publish. |
| [[01-release/INDEX\|01 — Release]] | Changesets → Version PR → CI publish. Add a changeset, merge the auto-opened PR, CI ships to npm. |
| [[02-workbench/INDEX\|02 — Workbench]] | The Ladle component workbench — render every component × every state in isolation. |
| [[03-showcase/01-recovery-roadmap\|03 — Showcase]] | The 2026-07-30 review traced to source, and the [[../documentation/01-foundations/07-doc-card-sets|doc + card sets plan]]. |
| [[04-content-pipeline/INDEX\|04 — Content pipeline]] | **How docs/ and code become the showcase** — the seven content roots, the nav manifest, the category/chapter/page taxonomy, and the conventions that keep the vault human. |
| [[05-reference-graph/INDEX\|05 — Reference graph]] | **What depends on what, with a weight.** Rated edges mined from the repo's own source; the canon bar is 3× the median, and the deletion guard names who breaks. |

## Folder shape

Numbered folders, each with its own `INDEX.md`. **Only `INDEX.md` sits at a category root** — `SHIPPED-PACKAGES.md` did too until 2026-08-01, and it was the single loose file the vault tree had to grow a special case for; it lives in `01-release/` now, where the ritual that updates it lives. Matches `kol-website/docs/operations`. Flat loose files here were drift, not design — the framework's rule is *either* subfolders *or* loose content files at a level, [never both](../../.kol/docs-framework/01-conventions.md).
