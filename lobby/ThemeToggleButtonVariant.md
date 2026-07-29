---
component: ThemeToggle (button variant) + library icon
source: kol-website apps/brand sidebar seat · packages/framework/src/ThemeToggle.jsx · packages/icons kol-icon-set-v1/files/library.svg
date: 2026-07-29
status: shipped-with-failures
deps: [kol-btn ladder (kol-components-atoms.css), kol-mono classes, mode-toggle-01]
---

# ThemeToggle `button` variant — shipped 0.5.13, two declared failures

Agent-shipped work, consumer-driven (kol-website brand sidebar). What landed, what
the laws are, and — per user order — an honest record of the two parts that FAILED
and need real DS-side work.

## What shipped (kol-framework 0.5.13)

New `variant="button"`: a REAL ladder button — glyph + "Dark mode"/"Light mode"
label inside plain `kol-btn kol-btn-primary kol-btn-{size}` + the rung's mono
class + `gap-2`. **No width/justify overrides** — it must measure pixel-equal to
any same-rung kol-btn (playwright-verified 32px === 32px at md against a text
kol-btn).

**Text-adjacent glyph law (pinned in a source comment):** inside a text button
the glyph must fit the rung's mono line box (16/18/22) → glyphs are **sm 14 /
md 16 / lg 18**. The 16/20/24 pairing law applies to pinned icon-only squares
ONLY — using it here inflated the button to 34px and broke the ladder (that
mistake burned 0.5.12, npm-deprecated).

Also burned: 0.5.11 — `npm publish` leaked raw `workspace:*` deps.
**kol-framework publishes ONLY via `pnpm publish`.**

## ❌ FAILURE 1 — the roll animation (live in 0.5.13, reads wrong)

The brief: restore the ORIGINAL toggle behavior — icon 1 rotates 180° away from
icon 2 on click, icons roll forward `>>` on dark→light and roll backward `<<`
on the way back.

What the agent shipped instead: the existing horizontal slide with a 180°
rotation bolted onto both glyphs (`glyphSpin` spans inside `iconSwap`). The
transform matrices flip correctly, but the motion does NOT read as the original
roll — user verdict: **FAIL, terrible**. It's live in 0.5.13, so the current
motion is wrong-but-shipped.

DS to-do: design the roll properly (a glyph that visually rolls — rotation
synced to travel like a wheel, likely rotate = translateX/radius, possibly a
single glyph rolling in place rather than a two-glyph strip). Treat the current
`glyphSpin` code as a placeholder to replace, not a base to iterate.

## ❌ FAILURE 2 — library.svg redesign (live in kol-icons 0.8.8, still wrong)

The complaint: the 4-bar `library` glyph's negative space between bars
overlaps/collides at render sizes — it was already on the user's
schedule-to-delete list.

What the agent shipped: 3 bars (w=3, x 4.75/10.5/16.25, shared 19.5 baseline,
1.25px clear gaps after stroke). User verdict: **FAIL** — the redesign does not
solve the read.

DS to-do: real redesign pass for `library` (or kill the glyph and remap the
name — consumers: brand sidebar Library entry, anything else using `library`).
Keyline grid + optical check at 16px, not just geometry math.

## Consumer state

kol-website web + brand are on framework `^0.5.13` / icons `^0.8.8`. Brand
sidebar seats `<ThemeToggle variant="button" size="md" />`. The old chrome-less
`hop-bare` seat is gone consumer-side; `hop`/`hop-bare` variants still exist in
the component for other consumers.
