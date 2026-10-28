---
component: PhoneNavDock
source: kol-fxr plan 44 (`~/dev/projects/kol-fxr/.kol/llm-plan/44-logged-out-home-and-the-fonts.md`)
staged: 2026-10-28
status: draft
---

# PhoneNavDock

**Raised:** user, 2026-10-28, frame B2 on the canvas: *"I moved the Phone nav in desktop, that component shoudl probablyget its own variant or preset?"*

## The look (frame B2 as moved, https://claude.ai/artifact/W81QSMMdZXXWFrFBtGWjZP)
- The `nav` pill (56 slots, 44 circle active, no hairline, no shadow), placed at the content's bottom-left: ~64px in from the content edge (under the page's mark), ~62px up from the bottom. Not centred; not full-width.
- Slots are the app's chromes (fxr: Generate, Effects, Labs, Morph, Editor). No ••• needed on a desk: the rail is there.

## The ask
- `variant="dock"` in `PHONE_NAV_VARIANTS` (placement `bottom-start` or the inset the DS picks on the 4px ladder).
- Shown on a fine pointer at ≥ md; `AppShell` / `AppStudio` take it like `navVariant` (an app opts in, e.g. `shell={{ dock: items }}` or HubHome's own slot, see `HubHomeSignedOut`).

## Done when
fxr Home at 1440 draws the pill bottom-left from `variant="dock"` with no hand-set props.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.86.0 · kol-component 0.311.0**. `PhoneNav variant="dock"` (TabsRow `dock`): md and up, the content's bottom-left — 64 in from the rail's edge, 64 up (B2's 62 on the 4px ladder) — no More, no hairline, no shadow, the circle. The signed-out Home draws it from `home.chromes`.
