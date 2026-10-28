---
component: HubHomePhoneChooser
source: kol-fxr plan 43 (`~/dev/projects/kol-fxr/.kol/llm-plan/43-accounts-phone-home-and-the-growing-line.md`)
staged: 2026-10-28
status: draft
---

# HubHomePhoneChooser

**Raised:** P2 (user, 2026-10-28): *"where is the original modal we had on mobile? I want taht instead of this 2x2 bullshit"* → the original card (screenshot: "SELECT CHROME / FXR", four stacked buttons, icon left and right) → *"not with the padded container"*

## The problem
`HubHome` draws `touch.doors` as a 2 × 2 grid of `Button tone="grey" size="lg"`, `justify-start`, icon left. fxr's chooser (`src/editor/mobile/MobileView.jsx` `EntryScreen`) was an eyebrow, then full-width buttons stacked one per row, label centred, the icon on BOTH ends (`iconLeft` + `iconRight`, `justify-between`). The Hub has no slot for consumer markup there, so fxr cannot draw it without a local fork.

## The ask
- `touch.layout: 'stack'` (or make stack the only shape; fxr is the one consumer of `doors`): an eyebrow (`touch.label`, fxr passes "Select chrome") then one full-width `size="lg"` button per door, icon on both ends, label centred, `gap-2`.
- No card, no scrim, no surface: straight on the page under the subtitle, where the grid is now.

## Done when
fxr Home at 390: "SELECT CHROME" eyebrow, then Generate, Effects, Labs, Morph stacked, each icon both ends; the 2 × 2 is gone.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.85.0 · kol-component 0.309.0**. `touch.label` as the eyebrow, then one full-width `tone="primary" size="lg"` button per door, the icon on both ends, the label centred — your `EntryScreen` class for class, no card; the 2 × 2 is gone. Walked on studio-hub at 1440 and iPhone 13 (`_tmp/2026-10-28-fxr-phone-walk/`, 8/8).
