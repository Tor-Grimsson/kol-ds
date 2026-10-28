# @kolkrabbi/kol-brand

> **Gap:** 0.1.0 → 0.1.2 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.2.0 — 2026-10-28

- **The marks move to kol-icons** (plan-2026-10-28-identity — user: *"the only thing about kolkrabbi I want DS to own is the fucking identity system, and its just because the favicons have a system that needs to be reviewed as a set"*). Every SVG under `src/svg/` now lives at `@kolkrabbi/kol-icons/identity/<id>/`, one folder per identity, named by role: `kol-logomark` → `kolkrabbi/kolkrabbi-logomark` · `kol-wordmark` → `kolkrabbi-wordmark` · `kol-lockup-hori` → `kolkrabbi-lockup-h` · `kol-lockup-vert` → `kolkrabbi-lockup-v` · `favicon-kolkrabbi` → `kolkrabbi-favicon` · `favicon-01` → `kolkrabbi-logomark` (it was the same drawing at 32) · `favicon-kol-ds` → `kol-ds/kol-ds-favicon` · `favicon-metrics` → `metric/metric-favicon` · `wordmark-workshop` → `workshop/workshop-wordmark`. `brand.logos` and `brand.favicons` point at the new paths (`lockup-hori`/`-vert` ids → `lockup-h`/`-v`, `metrics` → `metric`).
- **Ledger:** `src/svg/*` and the `./svg` `<Asset>` loader stay as they were until **2026-11-27**, then drop (BREAKING then, not now). Inline a mark with kol-component's loader (`Logomark`, renamed `VectorLoader` in kol-component's next publish) — `<Asset>` only ever globbed this folder.

## 0.1.0

### Minor Changes

- c750436: New package: Kolkrabbi's brand kit — the studio's manifest conforming to the kol-brand-template schema. Identity meta, the four semantic color anchors, all seven ramps with literal hex (verbatim from kol-brand-color.css), type families/scale, the four logo SVGs (shipped in-package via the `./logos/*` export), clearspace rule, presence, and studio-scoped timeline. Public-appropriate facts only — personal identifiers and the internal press archive deliberately excluded.

### Patch Changes

- Updated dependencies [c750436]
  - @kolkrabbi/kol-brand-template@0.1.0
