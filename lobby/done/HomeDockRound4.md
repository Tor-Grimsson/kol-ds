---
component: HubHome (signed-out dock and +) · AppFloatNav variant="dock"
source: kol-fxr — Home signed out, kol-shell 0.94.0 HubHome.jsx#L310-312 · AppFloatNav.jsx
staged: 2026-10-31
status: draft
deps: [HubHome, AppFloatNav, Button]
---

# HomeDockRound4

## Purpose
The user walked fxr's signed-out Home on kol-shell 0.94.0 with all three surfaces (2026-10-31). Glass-dark is his pick for the dock — *"this one is def best for this home screen"* — but four things are wrong. Screenshots in `_assets/HomeDockRound4/`.

1. **The + must not follow the dock's surface.** `surface` drives both the dock and the +, so glass turns the + into a ghost circle. *"this also changed the action button, but it is not supposed to change"* (`6.png`); on glass-light *"it just gets a little lost here"* (`7.png`). The + stays the inverted round button whatever the dock wears.
2. **The ··· joins the pill.** It floats as a separate circle beside it. *"I dont love this being disconnected"* (`1.png`).
3. **The ··· opens like the + menu.** Today it opens a tall sheet above the pill, the button turning to × with a "Close" tooltip. *"dont love this .. just make a note that its wrong"* (`2.png`). Logged once already in fxr plan 45 PARKED: he expected a card beside its button, as the + does.
4. **The dock's slots have no hover.** The menu rows light on hover, the pill's icons do not (`3.png` is the menu row's hover, the reference).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `home.surface` | `'solid' \| 'glass-dark' \| 'glass-light'` | `'solid'` | the dock and its menus only — no longer the + |

## Recreation notes
- 1 is a HubHome change (line 310: `HomeMenu … surface={surface}`); 2–4 are AppFloatNav's `dock` preset.
- Acceptance: fxr at `/?float=glass-dark` — the + is the solid inverted button; the ··· sits inside the pill; ··· opens a card the way the + does; hovering a slot lights it like a menu row. Light and dark.

## ✅ RESOLUTION — 2026-10-31 · kol-shell@0.95.0

kol-shell 0.95.0: the + is the solid inverted round button on every surface — `home.surface` now dresses only the dock and its menu cards. On AppFloatNav's dock the ··· is the pill's last slot, and it opens the same card the + uses (usePopover + PopoverPanel, surface-dressed), beside the pill with its bottom level; it stays ··· and lights while open — no × swap, no Close tooltip, no tall sheet. Every unlit dock slot takes the menu row's hover (oq-04 ground, on-primary ink). Checked on all three surfaces in light and dark. The hover lives on the dock for now; it moves into TabsRow when kol-component is free.

**Remainder here:** none — kol-fxr bump kol-shell@0.95.0, then check fxr's Home at /?float=glass-dark.

