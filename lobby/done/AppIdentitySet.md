---
component: AppIdentitySet
source: kol-mirror/public/touch-icons/ · kol-mirror/scripts/generate-icons.mjs
staged: 2026-10-28
status: draft
deps: [kol-icons identity/*]
---

# AppIdentitySet

**Staged:** 2026-10-28 · from a kol-mirror session
**Change:** the KOL owns each app's home-screen identity: tile, favicon, touch icons and share image. Apps stop drawing their own and copy their set from the package.

---

## The problem, in one case
Every app draws its own tile in its own repo, using the same `generate-icons.mjs` shape it took from fxr: lettering in a 24-box, white on `#121215`, the mark in the middle 60% (the rule from `identity-fxr-and-app-icon-size`). Nobody sees them side by side until they are on a phone. Mirror's tile was redrawn 2026-10-26 (`glitch-0-fill`: mark and reflection stretched as one group to FXR's box). The result is only ~15% taller than before and still reads small next to Monitor and FXR on the home screen. FXR and MON are tall condensed letters in one row. MR is two wide half-height rows, so filling FXR's box never makes it match. The review that would have caught this (all tiles, one surface, light and dark) has no home.

The identity *glyphs* already live in kol-icons `identity/` (mirror, fxr, r2b2, and brand and studio are filed). The *tiles* built from them do not.

## The ask
1. **Source.** Each app's tile SVG is owned in kol-ds-ui, drawn from its `identity/<app>.svg` at the 60% rule, so size and keyline are decided once for the family.
2. **Render.** The KOL renders the set per app: `apple-touch-icon-dark.png` 180, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (mark inside the middle 50%), `favicon.svg`, and the 1200×630 OG card.
3. **Ship.** Ship it in kol-icons (beside `identity/`, e.g. `app/<app>/…`) so a `/bump` carries icon changes like any other KOL update. **Package, not bucket:** favicon, touch icon and manifest icons must be same-origin and work offline from the home screen. OG could live on a CDN, but it ships in the package too, for one source.
4. **Review surface.** `apps/identity` (new, or wherever the identity glyphs are shown) shows every app's tile side by side, light and dark panes, at home-screen size. This is where a tile gets judged before it ships.
5. **Consume.** Document how an app takes its set. The lightest form: the app's `pnpm icons` copies `node_modules/@kolkrabbi/kol-icons/app/<app>/*` into `public/touch-icons/` (+ `public/svg/favicon.svg`, `public/og/`), with no drawing in the app. Fold this into `docs/operations/07-apps-tier/10-save-to-home-screen.md`.

## Mirror's tile, specifically
Redraw Mirror on the family surface. The saved alternative `mir-fxr-i0.35` (MIR as one tall row, drawn the way FXR and MON are) is in `kol-mirror/_tmp/2026-10-26-app-icon-proposals/` alongside the others. The user picks on the review surface, not in Mirror.

## Definition of done
- [ ] Tile sources + rendered sets for the live apps (Mirror, FXR, Monitor, R2B2, Metrics, Kolkrabbi, KDS) in kol-icons
- [ ] `apps/identity` shows them side by side, light + dark
- [ ] The consume step written in the save-to-home-screen playbook
- [ ] Mirror's tile redrawn and picked by the user there
- [ ] Published; kol-mirror's receipt names the version


---

## ✅ RESOLVED — 2026-10-28

Shipped **kol-icons 0.50.0 · kol-component 0.308.0 · kol-shell 0.84.0 · kol-framework 0.60.0 · kol-brand 0.2.0** (plan-2026-10-28-identity). kol-icons `identity/<id>/`, one folder per identity (kolkrabbi · kol-ds · fxr · mirror · monitor · metric · r2b2 · record · studio · brand · workshop): the icon on the keyline (`<id>.svg`) plus `-logomark` · `-wordmark` · `-lockup-h/-v` · `-favicon` · `-tile` (dark + light) · the PNGs (180 dark + light, 192, 512, maskable 512) · `og.png`, read by path through the new `./identity/*` export. One renderer, `pnpm identity:render` (`scripts/render-identity.mjs`); fxr · mirror · monitor PNGs pixel-identical to theirs. `apps/identity` (5209) shows the family on light and dark panes with guides, one page per identity with every file and path, and the rule on Files; Mirror's two rows (`glitch-0-fill`, `mir-fxr-i0.35`) wait on his pick there. The consume step is `10-save-to-home-screen.md` step 3. Adoption tickets filed to kol-fxr, kol-monitor and kol-website; kol-mirror's is the receipt's remainder.
