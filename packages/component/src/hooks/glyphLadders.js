/**
 * THE two glyph ladders. One source for the sizes every icon-bearing control
 * resolves against.
 *
 * Plain constants, not hooks — they live here because src/hooks is the
 * taxonomy's only non-component folder (same reason as cssVar.js).
 *
 * The ladders split on ONE question: is there a label beside the glyph?
 *
 *   SOLO      an icon alone in a pinned square (28/32/36) — takes the room
 *   ADJACENT  an icon inside a rung's line box, beside a label
 *
 * Stated in the DS before this file existed — ThemeToggle.jsx:40 ("solo
 * 16/20/24, the pinned-square pairing") and IconFrame.jsx ("the solo-glyph
 * ladder against the pinned squares 28/32/36"). This file is where they stop
 * being transcribed.
 *
 * Why it exists: the same two ladders were re-typed in four places
 * (Button, IconFrame, Input, Tag) and had already drifted. Button's icon-only
 * branch took the ADJACENT ladder — a 14px glyph in a 28px square where the
 * law says 16 — which is exactly what independent transcriptions produce.
 * framework 0.10.3 fixed the mirror of this bug (hop-bare took SOLO while
 * carrying a label) and nothing connected the two.
 */

/** Icon alone in a pinned square. Pairs with squares 28 · 32 · 36. */
export const SOLO = { sm: 16, md: 20, lg: 24 }

/** Icon beside a label, inside the rung's line box. */
export const ADJACENT = { sm: 14, md: 16, lg: 18 }

/**
 * Indicator glyph — a caret/chevron that DECORATES a control rather than
 * naming it (a dropdown caret, a sort arrow). Pairs 1:1 with the control's
 * mono text rung, one step under ADJACENT: an indicator never outweighs the
 * label it points at. Promoted 2026-08-09 — Table's sort chevron and
 * Dropdown's caret each hand-typed their number (Dropdown took the ADJACENT
 * rung, the oversize the user called): two transcriptions, the folklore
 * threshold. */
export const INDICATOR = { sm: 12, md: 14, lg: 16 }

/**
 * Resolve a glyph size. `solo` picks the ladder; `size` indexes it.
 * Falls back to the md rung so an unknown size never yields undefined.
 */
export function glyphSize(size, solo = false) {
  const ladder = solo ? SOLO : ADJACENT
  return ladder[size] ?? ladder.md
}

/** Resolve an indicator size. Separate helper — `solo` never applies. */
export function indicatorSize(size) {
  return INDICATOR[size] ?? INDICATOR.md
}
