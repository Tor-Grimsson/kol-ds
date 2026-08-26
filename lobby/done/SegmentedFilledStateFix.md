---
component: SegmentedToggle (variant="filled" — state styling correction)
source: kol-fxr — inspector strips; supersedes part of SegmentedFilledVariant (0.36.0)
staged: 2026-08-12
status: draft
deps: [SegmentedToggle]
---

# SegmentedFilledStateFix — the selection marker is the DARK tile, not a ring

## Purpose
The `variant="filled"` shipped in 0.36.0 was built to the ticket's FIRST reading (filled tiles always, inset ring on the selected cell). The user corrected it the same day: **selected = the dark filled tile + bright glyph; unselected cells are QUIET (transparent, dim, hover brightens); no outline ring anywhere.**

## Current behaviour
- 0.36.0 `filled`: every cell tiled, selected adds an inset `--kol-fg-24` ring.

## Ask
Flip the variant's states: unselected = transparent + text-meta (hover text-emphasis); selected = `--kol-surface-secondary` tile + text-emphasis; delete the ring. Stateless mode unchanged (all cells quiet).

**Plus (user, same day):** `.kol-seg-cell`'s glyph paint is `var(--kol-fg-meta)` — ALPHA. Overlapping stroke glyphs compound at intersections (the estate's opaque-icons law: icons paint with `oq-*`, never fg alpha). Cells hosting icons must paint with the opaque scale (`--kol-oq-48`-ish rest, `--kol-oq-*` emphasis active). kol-fxr is force-wrapping its icon labels in `text-oq-48` as the interim.

## Recreation notes
kol-fxr's stopgap twin (`SegBar.jsx`) already renders the CORRECTED law and is the live reference; it dies when this fix ships (the twin's deletion was the point of the original ticket).

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-theme@0.38.0** (registry-verified; pure CSS — no
component bump needed). States flipped to the corrected law: unselected =
transparent + dim (hover brightens), selected = `--kol-surface-secondary`
dark tile + `--kol-fg-emphasis` glyph, ring DELETED; the selected tile rounds
itself (SegBar geometry). The tonal variant follows the same quiet-unselected
law with its tertiary tile. Opaque paint: `.kol-seg-cell` rest ink is now
`--kol-oq-48` (was `--kol-fg-meta` alpha) — hover/active stay full ink.
Adoption is kol-fxr's: bump ≥0.38.0, drop the `text-oq-48` force-wraps, and
SegBar.jsx (already retired to `_tmp/`) stays dead.
