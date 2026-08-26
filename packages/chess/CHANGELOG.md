# @kolkrabbi/kol-chess

> Started 2026-08-14 at 0.6.0 — earlier versions shipped without entries (that history
> lives in the repo's session logs). From here every publish adds an entry, and
> breaking or global-surface changes are flagged **BREAKING**.

## 0.7.0 — 2026-08-26

- **BREAKING — the DS tier is a peer, not a dependency.** kol-component · kol-icons · kol-theme move from
  `dependencies` to `peerDependencies` with a `>=` floor (>=0.68.1 · >=0.18.0 · >=0.51.0).
  A 0.x caret in `dependencies` had pnpm nesting a private, stale copy of the tier
  under this package — a consumer bumped to kol-component 0.68.1 was still rendering
  this package's imports from the pinned line, so no DS fix since could reach those
  surfaces. The consumer now supplies ONE copy; the floor is the version this
  package's named imports were walked against. Same shape as kol-dashboards and
  kol-shell. Consumers: install the tier yourself and drop any `pnpm.overrides`
  forcing one copy.
