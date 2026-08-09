---
title: Surface rules
type: reference
status: active
created: 2026-08-09
updated: 2026-08-09
description: Admission rules for the three ruleless surfaces
tags:
  - domain/showcase
  - audience/agency-internal
related:
  - "[[01-recovery-roadmap|Showcase recovery]]"
  - "[[../../documentation/04-compositions/02-shells|reference shells]]"
---

# Surface rules — Docs, Search, References

Three surfaces were held in quarantine with `rule: null` — not for defects, but
because no phase of the 2026-07-30 plan claimed them. This page is the rule
they waited on. Each entry states what the surface **is**, why it lives where
it lives, and what admitting it asserts.

## Docs

The four MDX pages — Shell & Layout, Menus, Loaders, Type roles — are **living
standards pages**: documents whose bodies render live components. That is
exactly what the vault cannot hold (`docs/` is portable markdown; a vault page
never mounts React), so absorption into Documentation was rejected. They stay a
surface of their own, in the Tools group, and their frontmatter follows the R4
converge contract like every other document surface.

## Search

The results page is the **page form of the ⌘K overlay** — it reads the same
`buildShellSearchItems()` and the same matcher, so it cannot drift from the
modal. It exists on the user's ruling (2026-08-01: *"make a page for me to
view, show me a modal and show me a page"*). It is a tool, not a category:
Tools group.

## References

The reference graph is **generated measurement** — built from `usage-index` +
`token-index` at extract time, so it cannot rot by hand-editing. It is what the
repo measures about itself, not a written page: Tools group, beside Search.

## Admission assertions

| Surface | Admission asserts |
|---|---|
| Docs | The four pages carry R4 frontmatter and render through the shell frame |
| Search | The page reads `buildShellSearchItems()` — one item source, one matcher |
| References | The graph renders only generated data; no hand-authored rows |

A surface that stops satisfying its row goes back behind the gate with the
reason recorded — the same return path every category has.
