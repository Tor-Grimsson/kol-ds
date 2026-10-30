---
component: HomeMenuAccountRow
source: kol-fxr, live on kol-shell 0.87.2
staged: 2026-10-29
status: draft
---

# HomeMenuAccountRow

**Raised:** user, 2026-10-29, on fxr Home signed in (the ••• sheet showing New File · Walkthrough): *"here is supposed to be user space as well"*.

## Seen
`HubHome`'s masthead menu (`HomeMenu`): signed out it lists New File, Walkthrough, Sign in (`signInAction`). Signed in it drops to New File, Walkthrough — the account (`signIn.user` / `onProfile`, HubAccountRow) is reachable only from the rail's foot.

## The ask
- Signed in, the menu's last row is the account: the outline `user` glyph (or the picture when `signIn.user.avatar` is set, as the rail row draws it since 0.87.2) and the user's name; pressing it calls `signIn.onProfile()`.
- Same row in the phone's More sheet actions.

## Done when
fxr Home signed in: ••• lists New File, Walkthrough, then the account row (user icon + name); pressing it opens fxr's account rail.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-shell 0.88.0**. Signed in, Home's menu (•••) and the phone's More sheet end on the account row: the picture when `signIn.user.avatar` is set, else the outline `user` glyph, with the name. Pressing it calls `signIn.onProfile()`, or opens the Account tab (SettingsAccountTab). Walked on studio-hub: New · Walkthrough · the account. HubAppOwnsItsRows also lets fxr reorder or replace these rows itself.
