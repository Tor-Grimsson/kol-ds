---
component: HubAppOwnsItsRows
source: kol-fxr, kol-shell 0.87.2
staged: 2026-10-29
status: draft
---

# HubAppOwnsItsRows

**Raised:** user, 2026-10-29: *"then file it so it has more flexibility, I dont wanna file every goddamn change"* — after `HomeMenuAccountRow`, the fourth ticket in a day that only added or moved a row the Hub draws (the 2 × 2 doors, the account row's glyph, More's list, the Home menu).

## The problem
`AppHub` / `HubHome` / `AppStudio` decide which rows exist and in what order in four places, from fixed props (`home.action`, `walkthrough`, `signIn`, `media`, `settings`, `dev`). An app can only switch a row on or off; it cannot add one, drop one, reorder, or change what a row opens. So every "this menu should also have X" is a DS round trip.

## The ask — one shape, four places
Each place takes an optional **function of its default rows** — `(defaults) => rows` — so an app keeps the Hub's rows and edits them, or replaces them outright. Rows keep the shape the Hub already uses (`{ icon, label, onPress | path, avatar? }`); the Hub still draws them (one look).
1. `home.menu` — the masthead's round button (signed in and signed out).
2. `shell.foot` — the rail's pinned foot (Media, account, Settings).
3. `phoneNav.more` — the phone pill's More sheet (`moreItems` today only filters).
4. `home.signedOutActions` — the + menu on the signed-out page.
Absent, nothing changes. `HomeMenuAccountRow` then becomes fxr's one-line edit, and the ticket can close as covered by this.

## Done when
fxr adds its account row to Home's menu, and could drop Walkthrough or move Settings, with code in fxr only — no DS change.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-shell 0.88.0**. All four places take a function of the Hub's rows, `(defaults) => rows`:
- `home.menu` is the masthead's round button (signed in).
- `home.signedOutActions` is the + on the signed-out page.
- `shell.foot` is the rail's pinned foot.
- `AppHub phoneNav.more` is the phone pill's More sheet.

Rows are `{ icon, label, onPress | path, avatar? }`; a pressing row travels the rail as a sentinel, and the Hub still draws every row. Absent, nothing changes. Walked on studio-hub with temporary probes, since removed: a row added to Home's menu presses, and a row added to the rail's foot sits first and presses. `phoneNav.more` shares the code path but was not walked on a touch device.
