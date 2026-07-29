---
name: tmpl-prefix-standardised-outputs
description: "Skill-naming convention — `tmpl-` prefixes skills that are standardised output templates (first: tmpl-proposal)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8925f683-6a0f-4c1c-a610-aea124b7b6f7
  modified: 2026-07-29T21:27:52.215Z
---

The user's convention (2026-07-29): skills that define a **standardised output template** are named with the **`tmpl-` prefix** — first member is `tmpl-proposal` (the staged visual-review page, ex kol-visual-review/kol-showme). Applies across repos; skills live in `~/.claude/skills/`.

**Why:** groups reusable output formats under one findable namespace instead of scattering them through `kol-*`/`claude-*`.

**How to apply:** when a new skill canonises an output format (a report shape, a review page, a doc template), propose `tmpl-<thing>` as its name — and per [[ask-before-acting-both-ways]], the name itself is the user's ruling, not mine.
