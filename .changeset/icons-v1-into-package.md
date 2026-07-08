---
"@kolkrabbi/kol-icons": minor
---

kol-icon-set-v1 now ships in the package. The curated set (107 icons, single stroke cut, `currentColor`) lives at `src/kol-icon-set-v1/` and **resolves first** — `<Icon name>` returns the v1 version when a name is in the set, falling back to the legacy stroke/solid/svg trees otherwise.

Falling through to the legacy set now emits a one-time `console.warn` naming the icon — it isn't in v1, so `registerIcons()` it locally or migrate to a v1 name before the legacy set is dropped (a future major).

New exports: `KOL_ICON_SET_V1` (grouped `{ group: names[] }`) and `KOL_ICON_SET_V1_NAMES` (flat, sorted) — so consumers and audits can tell curated names from legacy. Non-breaking: legacy still ships alongside; every existing name still resolves.

Migration tooling: **`npx kol-icons audit`** scans a repo's `<Icon name>` usage and reports in-v1 / legacy-only / not-in-package, so you can see exactly which icons to migrate or `registerIcons` before the legacy set is dropped.
