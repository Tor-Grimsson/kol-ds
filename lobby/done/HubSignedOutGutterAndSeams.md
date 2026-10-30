---
component: HubSignedOutGutterAndSeams
source: kol-fxr, kol-shell 0.89.1 — HubHome.jsx#L265-L269 · AppHub.jsx#L209-L232 · HubSettingsRail.jsx#L100
staged: 2026-10-29
status: closed
deps: [HubHome, AppHub, HubSettingsRail, AppStudio, Button, PhoneNav]
---

# HubSignedOutGutterAndSeams

**Raised:** user, 2026-10-29, reviewing fxr's signed-out Home and Settings › Account: *"cavnas 'padding' is a bit off"*, *"when you are signed out, we should have the rail already hidden"*, *"we already choose which sign in to use, we made a artifact!!!"*, *"wrong button for sign out, wrong sizes"*. Then: *"SUGGEST FIXES"* → *"do it"*.

## 1. One gutter on the signed-out Home
The signed-out page's three corners sit on three different margins (desktop, `md:`):

| Item | Now | Wanted |
|---|---|---|
| Logomark box (112 square) | `md:left-20 md:top-16` — 80 left, 64 top | 64 left, 64 top |
| Round + (`HomeMenu`) | `right-16 top-[72px]` — 64 right, 72 top | 64 right, 64 top |
| Dock (`PhoneNav variant="dock"`) | 64 left, 64 bottom | unchanged |

One 64 gutter on every edge; the logomark's top and the +'s top on one line. Phone values (`left-4 top-6`) are not part of this ask.

## 2. The rail starts hidden while signed out
A Home option (e.g. `home.railHidden`, or on by default when `signedOut`) that opens the signed-out page with the rail hidden; `railToggleKey` (`\`) still brings it back, and signing in returns it. Today AppShell un-hides on every route entry *after* its children's effects run, so a consumer can only do it a frame late — fxr does exactly that (`HomeStage`'s `requestAnimationFrame(() => setNavHidden(true))`).

## 3. Sign in can be a page
`signIn.page` (a path, or `onSignIn`) — when set, every Sign in the Hub draws routes there instead of `modal.form('Sign in', …)`: the rail's foot row, the signed-out +, **and the phone's More sheet**. fxr has a designed `/signin` page (frame C). It reroutes the first two today through `shell.foot` and `home.signedOutActions`; the third it cannot reach, because `AppStudio` does not forward `phoneNav` to `AppHub`.

## 4. The Account tab's sign out is the approved button, in the footer
`HubSettingsRail` draws `account.footer` as `<Button tone="outline" size="sm" className="self-start">` at the end of the tab body. Frame D2 (approved 2026-10-29) has it as a full-width `Button size="md"` in the rail's foot (`RailFoot`). On the Account tab, the footer should be that button, in the rail footer where the theme toggle and reset sit on the other tabs. fxr draws its own full-width Sign out inside the tab meanwhile and passes no `footer`.

## Done when
fxr deletes its three workarounds — the `HomeStage` rAF, the `toSignInPage` edits on `shell.foot` / `home.signedOutActions`, its own Sign out button in `AccountPanel` — and passes `signIn.page` + `account.footer`, with no other fxr change; the phone More's Sign in opens `/signin`.

---

## Built — 2026-10-29 — kol-shell 0.90.0

- **1 · One gutter:** the mark `md:left-16 md:top-16` (was `left-20`), the + `right-16 top-16` (was `top-[72px]`), the dock unchanged; the walkthrough panel on the mark's line (`md:left-16`). Measured on studio-hub at 1440: mark 64 left 64 top, + 64 right 64 top, dock 64 left 64 bottom.
- **2 · The rail starts hidden:** `AppShell railHidden` — `useState(!!railHidden)` and the route-entry effect lands on `railHidden`, not on shown, so first paint has no rail and no consumer is a frame late; `railToggleKey` still toggles; the prop flipping moves the rail to its new rest. `AppHub` passes `home.railHidden ?? signedOutHome` on Home. Walked: no `.kol-shell-rail` on load, `\` brings it back, signing in returns it.
- **3 · Sign in as a page:** `signIn.page` (a path, or a function) — `askSignIn` routes there while signed out, and every Sign in the Hub draws goes through it: the rail's foot row, the signed-out +, the phone's More. `AppStudio` forwards `phoneNav`. Walked: all three land on `#/signin`, no dialog.
- **4 · The Account tab's foot:** `HubSettingsRail` draws `account.footer` as `<RailFoot><Button size="md" className="w-full">` in the rail's `footer` slot on the Account tab (the toggle and reset stay on the other tabs); the outline sm chip in the tab body is gone. Walked: `kol-btn-md w-full`, 348 wide = the rail's inner width.
- Reference: studio-hub passes `signIn.page: '/signin'` with a stand-in page outside the Hub. Screenshots: `_tmp/2026-10-29-hub-signed-out/` (8).
- Docs: 11-shell-system, 16-app-anatomy, 17-settings; shipped-packages 0.90.0.

**Remainder at kol-fxr:** bump kol-shell 0.90.0; retire the `HomeStage` rAF, `toSignInPage` on `shell.foot` / `home.signedOutActions`, and `AccountPanel`'s Sign out to `_tmp/`; pass `signIn.page: '/signin'` and `account.footer: { label: 'Sign out', onPress }`.
