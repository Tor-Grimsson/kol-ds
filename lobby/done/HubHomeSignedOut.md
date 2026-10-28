---
component: HubHomeSignedOut
source: kol-fxr plan 44 (`~/dev/projects/kol-fxr/.kol/llm-plan/44-logged-out-home-and-the-fonts.md`)
staged: 2026-10-28
status: draft
---

# HubHomeSignedOut

**Raised:** user, 2026-10-28: *"we shouldnt see any files until you've LOGGED-IN. we should rather have something unique to an unlogged experience"* → ruled: a live generative stage; frames A2 (phone) and B2 (desktop) on the canvas

## The frames (https://claude.ai/artifact/W81QSMMdZXXWFrFBtGWjZP)
- **A2, phone 390:** the mark top-left, the stage full-bleed behind, the `nav` pill at the bottom with the app's chromes and •••; ••• opens the whole list (PhoneMoreWholeNav) and turns to ×. No files.
- **B2, desktop 1440:** the rail; the mark alone top-left (no subtitle); the round + top-right opening New File, Walkthrough, Sign in; the `dock` pill bottom-left (`PhoneNavDock`); the stage full-bleed behind. No files.

## The ask
- `home.signedOut: true` (or `home.stage` present with no files) puts HubHome in this state: no catalog, no views, no filters.
- `home.stage`: a node the Hub lays full-bleed behind the page (fxr passes its live generator canvas).
- `home.chromes: [{ icon, label, onPress }]` → the pill (phone `nav`, desk `dock`); the doors and the 2 × 2 stay for apps that want them.
- The masthead's round button is `+` here and its sheet carries New File, Walkthrough and Sign in (the `signIn` row joins the actions when signed out).
- Signed in, HubHome is unchanged.

## Done when
fxr signed out: phone matches A2, desktop matches B2, no file card in either; signed in: today's Home.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.86.0 · kol-component 0.311.0**. `home.signedOut` (or `home.stage` with no files): no catalog; `home.stage` full-bleed behind; the mark top-left alone (48 phone · 112 desk); the round `+` (× open) with New, Walkthrough and Sign in; `home.chromes` as the desk dock and the phone pill, More listing the rail, then the actions, then the pinned foot (frame A2's order); the walkthrough over the stage. Walked on studio-hub at 1440 and iPhone 13 against A2 · B2 (`_tmp/2026-10-28-hub-signed-out/`, 6/6). The round button is the DS's `lg` (40), not B2's 48.
