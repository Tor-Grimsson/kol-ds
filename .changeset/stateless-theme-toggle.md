---
"@kolkrabbi/kol-theme": patch
"@kolkrabbi/kol-framework": patch
---

ThemeToggle: no interactive states on any variant

User ruling 2026-07-30 — *"REMOVE ALL STATES, no fucking hover… no variant at all
should have an interactive state, it's just a click 1-2, and it's themed."*

The toggle emitted `.kol-btn` plus `.kol-btn-nav`/`.kol-btn-primary`, which dragged the
button state machine along: the base transition and focus ring, the per-variant `:hover`
wash, and the `[aria-current]` shift. Those three classes were the only state sources.

**theme** adds `.kol-theme-toggle{,-none,-subtle,-flush}` — resting appearance only, no
state rules to inherit. Mirrors the `IconFrame` cure directly above it in the same file.

**framework** emits those instead. The SIZE classes (`kol-btn-{sm,md,lg}`, `kol-btn-icon`)
are pure padding/geometry and are unchanged. `.kol-btn` itself is untouched — every real
Button keeps its states.

Resting appearance is byte-identical for both fills, so no consumer shifts a pixel. The
glyph roll stays: it animates a state *change*, it is not an interaction state.
