---
component: ShellNavItemInk
source: kol-theme/kol-components-workshop.css#L340-L390 · kol-workshop/src/shell/RailRow.jsx
staged: 2026-08-12
status: draft
deps: []
---

# ShellNavItemInk — rail row ink/weight tune + a weight inconsistency

## The asks (user rulings 2026-08-12, kol-website session)

1. **Resting ink `--kol-fg-64` → `--kol-fg-80`** on `.shell-nav-item`
   (kol-components-workshop.css:352).
2. **`.shell-nav-item.is-active` gains `font-weight: 300`** — the row rests at
   `font-weight: 100` (line 341), so where-you-are steps 100 → 300 in weight
   alongside its emphasis ink.
3. **BUG — the two rails disagree on resting weight.** Live in web's workshop
   (kol-workshop 0.21.0 + theme 0.35.0): the LEFT tree's rows render thin
   (the `.shell-nav-item` weight-100 look), the RIGHT rail's rows (Documentation
   links, Quick actions) render visibly medium (~400/500). User verbatim:
   *"one side is light the other medium? INCONSISTENT"*.

## What we can rule out from this side

- No hand-rolled rows in the consumer: kol-website's workshop chrome carries
  zero `shell-nav-item` markup of its own — both rails render through the
  package (`ShellSidebar` / `RightRail` → `RailRow`, which emits
  `shell-nav-item kol-mono-14`).
- `.shell-nav-item { font-weight: 100 }` and `.kol-mono-14` are both
  single-class selectors; if `kol-mono-14` carries a weight, barrel order
  (kol-type-mono-classes.css before kol-components-workshop.css) should hand
  the win to `shell-nav-item` — yet one rail renders medium. Something on the
  right-rail path adds weight or dodges the class; that diagnosis needs the
  package source.

## Target end state

Both rails identical at rest: `kol-mono-14` metrics, weight 100 (or whatever
rest weight the DS rules — but ONE value), ink `--kol-fg-80`. Active:
`--kol-fg-emphasis` + weight 300. The `--own`/`--muted` modifiers keep their
existing contrast-gap roles.

## Recreation notes

- All three land in kol-theme's workshop sheet + (if the inconsistency is
  markup-side) kol-workshop's RailRow/RightRail.
- kol-website consumes on the next theme/workshop publish — no consumer edits
  expected beyond the bump.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-theme@0.39.0** (registry-verified; pure CSS).
Ask 1: `.shell-nav-item` rest ink `--kol-fg-64` → `--kol-fg-80`. Ask 2:
`.is-active` gains `font-weight: 300` (100 → 300 beside the emphasis ink).
Ask 3 DIAGNOSED by live computed-style probe (showcase dev, both rails):
every plain row in BOTH rails rests at 100 — the "medium side" was the Tags
block, whose `--own` rows carried the deliberate 2026-08-01 `font-weight: 500`.
Five 500-weight rows against a hairline-100 tree read as a rail-level split.
Fix: `--own` 500 → 300 — emphasis weight is now ONE step, shared with
`.is-active`; `--own`/`--muted` keep their contrast-gap roles. Adoption is
kol-website's: bump theme ≥0.39.0, no markup changes.
