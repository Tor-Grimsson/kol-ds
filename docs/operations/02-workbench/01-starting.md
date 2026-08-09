---
title: Starting the workbench
type: playbook
status: active
created: 2026-08-01
updated: 2026-08-01
audience: internal
description: Getting Ladle running and reading its layout
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/component-workbench
related:
  - "[[INDEX|using the workbench]]"
---

# Starting the workbench

What the workbench needs, how to start it, and what you are looking at once it opens.

## 0. Prerequisites

- Node 20+ and `pnpm` (the repo pins `pnpm@9.15.0`).
- Dependencies installed: `pnpm install` at the repo root.
- You're in the repo root: `kol-design-system/`.

## 1. Start the workbench

```bash
pnpm workbench
```

Runs `ladle serve` for the `workbench` package. It prints a URL — normally `http://localhost:61000/`. If 61000 is busy it climbs (61001, 62002, …); a high port is the tell that an old server is still running.

## 2. Open it in a browser

Open the printed URL. You land on a default story with the workbench UI around it.

## 3. Read the layout

Three regions:

- **Centre — canvas:** the live component renders here on a blank stage (top-left of the canvas), with the real KOL theme, classes, and brand fonts applied. One component, one state — sparse on purpose.
- **Right edge — sidebar:** a **Search** box on top, and a **tree** of components (Button, Icon, Table…), each expandable into its stories.
- **Bottom-left — toolbar:** six icon controls — theme (light/dark, the 💡), fullscreen, viewport, text-direction (RTL), view-source (`</>`), and about.
