---
title: KOL design-system docs
type: index
status: active
updated: 2026-07-15
description: Front door to docs/ — documentation/ is the design system, operations/ is repo machinery, and the deeper machinery lives in .kol/ at the repo root.
aliases:
  - docs
  - docs-home
tags:
  - domain/design-system
related:
  - "[[documentation/INDEX|KOL documentation]]"
---

# KOL design-system docs

**→ [[operations/SHIPPED-PACKAGES|SHIPPED PACKAGES]]** — every `@kolkrabbi/*` package this repo ships, with versions. The one table; start here if you're looking for "what packages exist."

**[[documentation/INDEX|documentation/]]** is the design system, documented — numbered sections: overview · foundations · icons · components · compositions · brand kit · research · usage. Start with [[documentation/00-overview/INDEX|the overview]].

Anything else that lands in `docs/` is repo-related documentation that isn't the design system itself:

- **[[operations/INDEX|operations/]]** — the [[operations/SHIPPED-PACKAGES|shipped-packages table]], release pipeline, and workbench (repo/CI process, not design-system content).

The deeper machinery lives **outside** the vault, at the repo root:

- `.kol/llm-context/` — agent state (architecture, current state, plan, backlog, session logs)
- `.kol/docs-framework/` — the kol-docs spec these files conform to
- `LLM_RULES.md` — the boot pointer every agent reads first
