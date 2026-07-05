---
title: Operations
type: index
status: active
updated: 2026-07-04
description: Repo machinery for the KOL packages — the release pipeline (Changesets → CI publish) and the component workbench. Repo/CI process, not design-system content.
tags:
  - domain/workflow
related:
  - "[[../INDEX|docs home]]"
  - "[[../documentation/INDEX|KOL documentation]]"
---

# Operations

Repo machinery — how the KOL packages get versioned, published, and eyeballed. This is the process *around* the repo, not the design system itself (that's [[../documentation/INDEX|documentation/]]).

| Doc | What it covers |
|---|---|
| [[01-release-pipeline\|release pipeline]] | Changesets → Version PR → CI publish. Add a changeset, merge the auto-opened PR, CI ships to npm. |
| [[02-workbench\|workbench]] | The Ladle component workbench — render every component × every state in isolation. |
