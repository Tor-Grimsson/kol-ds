---
title: Candidate apps
type: reference
status: active
created: 2026-09-21
updated: 2026-09-21
description: Products the tier absorbs, one at a time
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
aliases:
  - candidate-apps
related:
  - "[[INDEX|Apps tier]]"
  - "[[01-tier-rules|Tier rules]]"
  - "[[02-media-app-plan|Media app plan]]"
---

# Candidate apps

**A roster, not a queue, and not an order.** The tier is *designed* for any number of tools and *populated* one at a time — several half-built apps prove nothing. Only media is committed; nothing below is started, scoped or promised, and each one becomes real only when the user says so.

## Committed

| App | Status |
|---|---|
| `apps/media` | In build — [[02-media-app-plan\|the plan]]. Furthest along, three live consumers, and its missing half is costing work today |

## Roster

Named by the user, 2026-09-21:

| Candidate | Known ties in the estate |
|---|---|
| The settings + ContentFilters + home system | Shared by kol-fxr, kol-mirror and kol-monitor — the same three repos that produced the `SettingsMastheadCluster` and `SettingsScaffoldFromFxrPage` tickets. A shared shell, which per the concept doc becomes a **package** each app imports, never a copy per app |
| The fxr editor | Already ships as `@kolkrabbi/design-editor`, the app-tier exception in ARCHITECTURE §4. kol-fxr is its first consumer and still hand-rolls seventeen components (`lobby/inbox/editor-panels-the-held-specs.md`) |
| The presentation system in the olina brand | kol-client-olina |
| The brand structure clients get | `packages/brand` + `packages/brand-template` |
| The 3D / three.js editor | — |
| Notes | `@kolkrabbi/kol-notes` is ruled as its own package (2026-09-04); kol-noter's 51-component intake is landing pattern by pattern |
| Markdown parsers | `packages/workshop` carries a handrolled markdown engine already |

## Scan

The list above is what came to mind in one sitting; the user expects there are more. **A sweep of `~/dev/projects` has not been done** — it is an open idea, not a scheduled step, and it waits until media is built rather than competing with it.
