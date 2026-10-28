---
component: PhoneMoreWholeNav
source: kol-fxr plan 43 (`~/dev/projects/kol-fxr/.kol/llm-plan/43-accounts-phone-home-and-the-growing-line.md`)
staged: 2026-10-28
status: draft
---

# PhoneMoreWholeNav

**Raised:** P6 (user, 2026-10-28): *"I think when you press [...] you should get the entire Nav menu list"* → *"yes list the whole nav. but also ship with prop so you can customise if you want to only show xyz but not abc."*

## The problem
On Home at 390, More shows only Home's actions (Enter Studio, Walkthrough, Sign in, Settings). The rail's rows that do not fit the pill (Randomiser, Morph, Media …) are not reachable.

## The ask
- More lists the whole nav (every rail row, pinned foot rows included) above the page's actions, by default.
- A prop to filter it: `moreItems` as an allow-list of paths, or a `(item) => boolean`, on `PhoneNav` and passed through `AppShell` / `AppStudio`.

## Done when
On fxr Home at 390, More lists Library, Editor, Labs, Randomiser, Morph, Media (signed in), Sign in, Settings, then the actions; a filter prop trims it.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-shell 0.85.0 · kol-component 0.309.0**. More lists every rail row (the pill's own and the pinned foot), then the page's actions; `moreItems` (paths or a predicate) on `PhoneNav` and `AppShell` (through `shell`) trims it. Walked on studio-hub at 1440 and iPhone 13 (`_tmp/2026-10-28-fxr-phone-walk/`, 8/8).
