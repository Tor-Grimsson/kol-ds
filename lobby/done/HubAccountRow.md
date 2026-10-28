---
component: HubAccountRow
source: kol-fxr plan 43 (`~/dev/projects/kol-fxr/.kol/llm-plan/43-accounts-phone-home-and-the-growing-line.md`)
staged: 2026-10-28
status: draft
---

# HubAccountRow

**Raised:** P4 (user, 2026-10-28): *"I am the only user. and we will treat me THE ONLY USER as a proper user"* … *"maybe user space? profile picture, name, custom settings?"* … *"in the rail instead of the cloud 'signed in' just says user?"*; and on the copy: *"why does it say password for library sync? … stupid."*

## The problem
`AppHub`'s `signIn` is `{ signedIn, onPress(password | null) }`: a single password prompt ("Password for the library sync:"), and signed in the row is a cloud glyph labelled "Signed in". fxr is moving to real accounts (users + sessions in D1, invite-link sign-up), so the row needs an identity and the dialog needs an email.

## The ask
- `signIn.user: { name, avatar? }` — signed in, the row draws the avatar (initials when none) and the name, and pressing it calls `signIn.onProfile()` (fxr routes to its profile page) instead of the sign-out confirm.
- Signed out, the DS dialog asks **Email** and **Password** (title "Sign in"), then `signIn.onPress({ email, password })`. Keep the string form working for apps that still pass a shared password.
- Sign out moves to the profile page (fxr's), so the Hub needs no sign-out copy; if it keeps one: "Sign out? Saves stay on this device."

## Done when
fxr signed out: the row reads Sign in and asks email + password; signed in: the row shows the avatar and name and opens `/account`.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.85.0 · kol-component 0.309.0**. `signIn.user: { name, avatar? }` + `signIn.onProfile()`: signed out the DS dialog asks Email and Password (`modal.form`, title "Sign in") → `onPress({ email, password })`; signed in the rail row is the avatar (`Avatar size="xs"`, the initial when none) and the name, opening `onProfile()`. Without `user` the shared-password row is unchanged. Walked on studio-hub at 1440 and iPhone 13 (`_tmp/2026-10-28-fxr-phone-walk/`, 8/8).
