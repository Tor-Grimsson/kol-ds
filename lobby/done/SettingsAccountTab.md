---
component: SettingsAccountTab
source: kol-fxr, kol-shell 0.87.2
staged: 2026-10-29
status: draft
---

# SettingsAccountTab

**Raised:** user, 2026-10-29, on fxr's settings rail (Settings · Shortcuts · About): *"why isnt account just in settings in account tab?"*

## The problem
`AppHub`'s settings rail draws a fixed tab row (Settings · Shortcuts · About · Docs) and ignores an app's `tabs`. fxr's account (picture, name, email, invites, sign out) therefore lives in a second rail of its own (`src/components/AccountRail.jsx`, built from the rail kit), opened by `signIn.onProfile`. Two rails for one user's space.

## The ask
- `signIn.account: { sections, footer? }` (or `settings.account`) — rows in the settings rail's typed-row shape, or a node, drawn as an **Account** tab placed first in the row while `signIn.signedIn`.
- `signIn.onProfile` absent + `signIn.account` present → the account row (rail foot, Home's menu, phone More) opens the settings rail **on the Account tab**.
- The tab's foot can carry Sign out (`footer`).

## Done when
fxr signed in: the account row opens Settings on Account (picture with hover-× to remove, Upload, Name, Email, Invites with the requests, Sign out); fxr's own AccountRail retires to `_tmp/`.


---

## ✅ RESOLVED — 2026-10-29

Shipped **kol-shell 0.88.0**. `signIn.account: { sections, content?, footer? }` is an **Account** tab, first in the settings rail while signed in. It holds typed rows (`sections`), a node for what rows cannot say (`content`: the picture with its hover-× and Upload), and `footer: { label, onPress }` (Sign out). Without `onProfile`, the account row, from the rail's foot, Home's menu or More, opens the rail on that tab. If an app has no `settings`, the rail opens with Account alone. Walked on studio-hub, whose reference account is now this tab: Account · Settings · Shortcuts · About · Docs, the rows, and Sign out signs out.
