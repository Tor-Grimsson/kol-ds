# kol-theme's kol-sources.css reaches nothing in a pnpm workspace

**Staged:** 2026-10-28 · from a kol-website session
**Change:** kol-theme (the manifest) + the wiring docs

---

## The problem, in one case
kol-website `apps/record` (copied from kol-studio, a standalone repo) wired Tailwind with `@import "@kolkrabbi/kol-theme/kol-sources.css"`. Its paths resolve from the theme's own folder — `../kol-component/src`, then `../../../../../@kolkrabbi/kol-component/src`. In a pnpm workspace the theme sits alone in `node_modules/.pnpm/@kolkrabbi+kol-theme@0.191.0/node_modules/@kolkrabbi/kol-theme` and there is no root `node_modules/@kolkrabbi`, so both paths miss and Tailwind scans no package. Nothing warns.

Measured on record.kolkrabbi.io: 56 of kol-framework's 90 rail utilities generated (brand, on explicit `@source` lines: 89/90) — the rail's rows, gaps and heights collapsed. In kol-studio it worked only because pnpm laid the packages side by side.

## The fix
- Stop presenting the manifest as the way to wire an app: the docs show explicit per-app `@source "../node_modules/@kolkrabbi/<pkg>/src"` lines (brand's and media's shape).
- Retire `kol-sources.css`, or mark it in the file and the docs as standalone-repo only.

## Definition of done
- [ ] the wiring docs name explicit `@source` lines as the way
- [ ] the manifest is retired or says where it does not work

## ✅ RESOLUTION — 2026-10-28 · kol-theme@0.192.0

kol-sources.css stays but says, at its head and in kol-theme's README, that it is standalone-repo only: its paths resolve from the theme's own folder, which in a pnpm workspace is alone in the store, so every line misses silently. The way to wire an app is explicit @source "../node_modules/@kolkrabbi/<pkg>/src" lines in the app's own CSS — now said in 00-overview/03-install.md, kol-theme's README, kol-icons' and kol-hardware's READMEs (they offered the manifest as an alternative) and 04-compositions/13-controls-system.md. Every app in kol-ds-ui already carries the explicit lines. No rule changed.

**Remainder here:** none — kol-website bump kol-theme to 0.192.0 if you want the note; apps/record keeps its explicit @source lines.

