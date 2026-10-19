# PageHeaderAppLevelDisplay — `level="app"` is DISPLAY between page and section, not mono

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor · corrects PageHeaderAppLevel (kol-component 0.277.0)

## The ask, in the user's words

> "did I ask for mono?!?! OR DID I SAY MAKE THE TEXT SMALLER AS IN THE HEIGHT, SO THAT IT IS BETWEEN SECTION AND PAGE"

## The ask (confirmed by the user)

`level="app"`'s text size sits **between `page` and `section`**. **Do NOT make a new style.** Tailwind classes on page's display style:
`PAGE_HEADER_ROLES.app.title = 'kol-sans-display-01 text-[46px] md:text-[60px]'` (page 80/56, section 42/36). 0.277.0's mono typeface was never asked for.

## Done means

`app` reads between `page` and `section` in size.

## ✅ RESOLUTION — 2026-10-18 · kol-component@0.279.0 · kol-theme@0.177.0

`PageHeader level="app"`: page's display-01 sized `text-[46px] md:text-[60px]` (no new style), over `.kol-header-lede-app` (19/26 Light, kol-theme 0.177.0). `PAGE_HEADER_ROLES.app` = `{ title: 'kol-sans-display-01 text-[46px] md:text-[60px]', lede: 'kol-header-lede-app' }`. kol-shell 0.72.0's app pages already default to `app`. Reviewed live on Development › Open questions › Round 14 (page · app · section on one CatalogPage).

**Remainder here:** none — kol-monitor bump kol-component@0.279.0 + kol-theme@0.177.0 (tarballs HTTP 200).
