# AppCardWholeFlip

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** `backReveal="flip-card"` turns the WHOLE card (plate, text, controls), the back a full face on the card's surface; a controlled `flipped` on the card and on `CatalogPage` / `HubHome`, so a page can turn every card on a key with hover off

---

## The problem, in one case
AppCardBackCover shipped `flip-card` (kol-component 0.299.0). The user tried it on monitor's /dev → Card flip: *"it doesnt truly flip the card, there is still the background that remains."* The card's root keeps its background while an inner layer turns, so the picture rotates over a plate that stays put.

What he wants is built locally in monitor (`src/pages/dev/CardFlipPage.jsx`, `Flip` + `TrueFlip`): a 3D turner around the entire `ContentCard`, the back a second full face (`bg-surface-secondary`, the card's radius) holding the rack screenshot; faces swap by `backface-visibility`, never a timed `visibility` (see FlipCardFaceSwap — FlipCard blanks mid-turn). Then: *"make the cards flip on a shortcut and disable the hover"* — `F` turns every card on the page; and a Settings toggle, *"hover flips card? default off"* (monitor's `useHoverFlip`, Settings → Display).

## The fix
1. `flip-card` turns the card root — everything — with the back as a full face on the card's surface. The same turn as monitor's `Flip` (perspective, preserve-3d, both faces backface-hidden, 450ms ease).
2. `flipped` (controlled) on `ContentCard`; `CatalogPage` and `HubHome` take a page-level `flipped` and pass it to every card. `hover` becomes opt-in on the card (`backReveal` + `backHover`, or your naming), so a consumer can turn cards on a key with hover off.
3. Monitor wires `F` → `flipped` on Library and Home and `backHover` from its Settings toggle.

## Definition of done
- [ ] `flip-card` turns the whole card; no plate stays behind; no blank frame
- [ ] `flipped` controlled on the card, `CatalogPage`, `HubHome`; hover opt-in
- [ ] Published; kol-monitor's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-component 0.301.0 · kol-theme 0.189.0 · kol-shell 0.81.0 live

`flip-card` is a turner AROUND the card root: the whole card — plate, text, controls, its own ground — is the front face, the back a full face on the card's surface (surface-secondary, the card's radius); nothing stays behind. `flipped` (controlled) on the card, page-level on `CatalogPage` and `HubHome`; `backHover` (default off) opts the hover and focus reveal in — breaking for 0.299.0's hover-by-default. 450ms ease, faces by backface. rack-hub: `F` turns every card, Display → Hover flips card. Walk `_tmp/2026-10-24-whole-flip/walk.mjs` 13/13. Registry live. Receipt returned to kol-monitor's outbox.
