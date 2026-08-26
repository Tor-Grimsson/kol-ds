---
component: DashboardIconCoverage
source: kol-website — apps/web/src/routes/Metrics.jsx + workshop/DashboardComponents.jsx
staged: 2026-08-14
status: draft
deps: [kol-icons]
---

# DashboardIconCoverage — 7 dashboard icon names resolve nowhere

## The ask

Seven icon names used by kol-website's dashboard surfaces are **absent from
`@kolkrabbi/kol-icons@0.15.0`**. Each logs a resolution warning at runtime and
renders nothing:

```
dashboard-bookmark   dashboard-roadmap   dashboard-dual-opponent
stat-crown           stat-winner         stopwatch            trending
```

Call sites — `apps/web/src/routes/Metrics.jsx:336,379,382,392` and
`apps/web/src/routes/workshop/DashboardComponents.jsx:314,382,399,416,490`.
No `registerIcons()` anywhere in the consumer, so there is no local escape hatch
in play — these simply don't resolve.

## Why it's the DS's call, not the consumer's

The consumer can't pick replacement names safely: the underlying question is
whether the **v1 set is meant to cover the dashboard vocabulary**, or whether
`registerIcons()` is the blessed permanent path for app-specific icons. That
ruling belongs to kol-icons, and it decides the fix:

- **v1 grows** → ship the 7, consumer changes nothing.
- **`registerIcons()` is the contract** → say so in the icons docs, and the
  consumer registers these 7 locally.

Either is fine. The consumer needs to know which before migrating anything.

## History — this is a re-file, not a new finding

Raised 2026-07-15 as item **2.9** of kol-website's `docs/DS-CHANGES-2.0.md`, a
batch ledger that predates the lobby. That ledger was never handed over and is
being retired; this is the live half of it, refiled through the current channel.
The original note also flagged that legacy/stroke/solid fallback sets are
announced as dropped in a future major — so the deprecation warnings these names
produce today become hard failures at that major.

Live-confirmed still firing 2026-08-12 during a headless route walk of
kol-website (`/metrics`, both apps' 24 routes) — 13 months of stack movement
(icons 0.6.1 → 0.15.0) has not closed it.

## What stays with kol-website

Nothing to retire — the names are already in use and simply render empty.
On ship: swap to the shipped names, or add the `registerIcons()` call, per the
ruling.

## Resolution — 🟢 closed 2026-08-14

Ruling (user): **v1 grows** — the drawings already existed on the retired
shelves; promoted under plain names per the set convention (prefixes drop),
approved on the `docs/visual-reference/dashboard-icon-proposals.html` page
("icons look fine"). Shipped **icons 0.16.0** (registry-verified); inventory
**198 · 27**.

- Minted: `crown` + `trophy` + `stopwatch` (misc) · `users` (nav). Crown +
  trophy verbatim from the keyline `_tmp/icons-v1-export/` shelf (that shelf
  had already redrawn `stat-winner`'s podium+star as the trophy cup);
  stopwatch + users redrawn to keyline from the filled legacy cuts.
- Mapped, NOT minted — shipped drawings cover them: `dashboard-bookmark`→
  `bookmark` · `dashboard-roadmap`→`roadmap` · `trending`→`trending-up`.
- `registerIcons()` stays the escape hatch for genuinely app-specific icons —
  the two paths are not mutually exclusive; these 7 were set vocabulary.

📌 Remainder is kol-website's: bump icons ≥0.16.0 and swap the 9 call sites to
the shipped names (`stat-crown`→`crown` · `stat-winner`→`trophy` ·
`dashboard-dual-opponent`→`users` · the three mapped names above; `stopwatch`
resolves as-is).
