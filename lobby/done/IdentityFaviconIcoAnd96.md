# IdentityFaviconIcoAnd96 — every identity set ships `favicon.ico` and `favicon-96.png`

**Staged:** 2026-10-28 · from kol-website (closing `IdentitySetFromPackage`)
**Change:** add two files to each `kol-icon-set-identity/<id>/`, rendered by the same script as the rest

---

## The problem
kol-website copies every app's identity out of kol-icons 0.50.0 now. Two files the apps serve have no source in the package:

| File | Who needs it | Today |
|---|---|---|
| `favicon.ico` (32 × 32) | Sanity Studio serves `static/favicon.ico` by name; any browser asks `/favicon.ico` | studio keeps a hand-made copy in `public/identity/studio/` |
| `favicon-96.png` | Sanity Studio's `static/favicon-96.png` | same — the last hand-made file |

`favicon-192` and `favicon-512` were the same art as your `icon-192.png` / `icon-512.png`; kol-website now links those, so they are not asked for.

## The fix
`scripts/render-identity.mjs` writes `favicon.ico` (32, from `<id>-favicon.svg`) and `favicon-96.png` into every identity folder, the way it writes the touch PNGs.

## Definition of done
- [ ] every `kol-icon-set-identity/<id>/` carries `favicon.ico` and `favicon-96.png`
- [ ] kol-icons published

**Remainder at kol-website once it ships:** bump kol-icons; `scripts/icons.mjs` copies the two files; studio's hand-made pair goes to `_tmp/`.


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-icons 0.52.0**. Every `kol-icon-set-identity/<id>/` with a mark carries `favicon.ico` (one 32 × 32 PNG in an ICO wrapper) and `favicon-96.png`, rendered by `pnpm identity:render` from the dark app icon — studio's hand-made pair was the dark app icon, and the rendered pair is pixel-identical to it. `apps/identity` lists both under each identity's rendered sizes.
