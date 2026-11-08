# kol-icons identity/foundry — the Foundry app's mark

**Staged:** 2026-11-08 · from a kol-foundry session (tools/kol-kerner)
**Change:** kol-icons — one identity glyph

---

## The problem, in one case
kol-foundry's app (`tools/kol-kerner`, now named Foundry) borrowed the Kolkrabbi logomark in its app rail until its own
app-icon round on 2026-11-08. The user picked `compass-big-up`: kol-icons' own `design/drafting-compass`, enlarged so its
ink runs slightly past the 60 % box and lifted a touch, on #121215. Its wordmark is FOUNDRY in Right Grotesk Tall Dark.
kol-icons has no `identity/foundry`.

## The fix
- Add `identity/foundry.svg`. The file is attached at `lobby/_assets/IdentityFoundry/foundry.svg`, the one the app's rail
  draws: the favicon's glyph (the compass ×1.3, filling the 24 grid) at the set keyline, `translate(3 3) scale(0.75)`,
  `currentColor`.
- The tile, favicon and the wordmark's share card live in `kol-foundry/tools/kol-kerner/public/`, and the app-icon
  skill's `assets/foundry/` holds the three source SVGs.

## Definition of done
- [ ] `identity/foundry` ships in kol-icons

## ✅ RESOLUTION — 2026-11-08 · kol-icons@0.67.0

identity/foundry added (Foundry app mark, currentColor, keyline)

**Remainder here:** none — kol-foundry bump kol-icons@0.67.0; use identity/foundry in the app rail.

