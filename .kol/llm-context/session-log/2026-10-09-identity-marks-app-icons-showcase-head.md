# Session: identity marks, the app-icon rule, the showcase head, MetricsDashboard on a phone

**Date:** 2026-10-09
**Agent:** Claude (Grim)
**Summary:** Four kol-website tickets worked (three closed, one parked); the showcase got a touch icon, SEO head, sitemap and boot loader; Vercel storage trimmed.

## Changes Made

### Files Modified
- packages/icons/src/kol-icon-set-interface/identity/fxr.svg · r2b2.svg — new, set keyline, currentColor — **kol-icons 0.36.0 · 0.37.0, published**
- packages/icons/src/cuts.json — fxr, r2b2 solid
- docs/documentation/02-icons/05-app-icons.md — new: the 60 % app-icon rule; INDEX chapter row; 01-inventory regenerated (243 · 27)
- packages/component/src/organisms/MediaLibraryPages.jsx — title-root row slider desk-only — **kol-component 0.250.0, published**
- packages/theme/kol-components-dashboards.css — `.dash-grid` content-height rows below 767 container — **kol-theme 0.172.0, published**
- packages/dashboards/src/MetricsDashboard.jsx — tab strip scrolls, timeline wraps, duration hidden below md — **kol-dashboards 0.5.0, published**
- showcase/index.html — apple-touch-icon, manifest, canonical, title/description/OG/twitter, theme-color, the boot curtain (kol-fxr's, KDS mark)
- showcase/src/main.jsx — curtain fade after first paint
- public/touch-icons/ (dark/light 180 + 192/512) · public/og/kol-ds-og.png · public/kol-ds.webmanifest · public/robots.txt · public/sitemap.xml
- scripts/extract-sitemap.mjs — new, runs in `pnpm build` (rail paths only)
- lobby — identity-fxr-and-app-icon-size · title-root-row-slider-on-phone · identity-r2b2 · metrics-dashboard-on-a-phone → done/ with receipts; metrics-dashboard-on-the-app-hub ⚪ parked (withdrawn by kol-website)
- docs/operations/01-release/02-shipped-packages.md — the five versions above

### Features Added/Removed
- identity group: fxr, r2b2; the written app-icon rule
- Showcase installs to a home screen with the KDS icon; has a share card and a sitemap

## Current State

### Working
- All five publishes landed; gates run: syntax, icon-ink, extract:icons clean. Dashboard measured at 390 (four tabs) and 1440.
- Vercel: 6 oldest kol-ds deployments deleted (9 → 3).

### Known Issues
- Meta description says "open source"; the hero and ARCHITECTURE say "source-available" — user to rule
- Each kol-ds build is ~250 MB; retention policy (30 d / keep 10) can only be changed in the dashboard — not done
- Sitemap lists rail paths only, not /components/:slug etc.

## Next Steps
1. Push (all published source unpushed)
2. Dashboard: Settings → Security → Deployment Retention → keep 3
3. Rule the open-source vs source-available wording
