---
title: Operations
type: index
status: active
updated: 2026-07-31
description: Repo machinery for the KOL packages — the release pipeline, the component workbench, the showcase recovery arc, and the content pipeline that wires this vault into the live showcase.
tags:
  - domain/workflow
related:
  - "[[../INDEX|docs home]]"
  - "[[../documentation/INDEX|KOL documentation]]"
---

# Operations

Repo machinery — how the KOL packages get versioned, published, eyeballed, and how this vault reaches the screen. This is the process *around* the repo, not the design system itself (that's [[../documentation/INDEX|documentation/]]).

| Section | What it covers |
|---|---|
| [[SHIPPED-PACKAGES\|SHIPPED PACKAGES]] | **THE package list** — every `@kolkrabbi/*` package + current version, one table. Updated with every publish. |
| [[01-release/INDEX\|01 — Release]] | Changesets → Version PR → CI publish. Add a changeset, merge the auto-opened PR, CI ships to npm. |
| [[02-workbench/INDEX\|02 — Workbench]] | The Ladle component workbench — render every component × every state in isolation. |
| [[03-showcase/01-recovery-roadmap\|03 — Showcase]] | The 2026-07-30 review traced to source, and the [[03-showcase/02-doc-card-sets\|doc + card sets plan]]. |
| [[04-content-pipeline/INDEX\|04 — Content pipeline]] | **How docs/ and code become the showcase** — the seven content roots, the nav manifest, the category/chapter/page taxonomy, and the conventions that keep the vault human. |

## Folder shape

Numbered folders, each with its own `INDEX.md`; `INDEX.md` and `SHIPPED-PACKAGES.md` are meta files and sit at the root unprefixed. Matches `kol-website/docs/operations`. Flat loose files here were drift, not design — the framework's rule is *either* subfolders *or* loose content files at a level, [never both](../../.kol/docs-framework/01-conventions.md).
