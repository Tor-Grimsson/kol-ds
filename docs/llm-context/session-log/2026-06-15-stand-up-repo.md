# 2026-06-15 — Stand up kol-design-system

Stood up the KOL design system as its own repo: maintenance home + npm-host + showcase, re-splitting the recent single-app source into the published 4-package topology. Builds and renders; verified in-browser.

## Changed

- **packages/** — re-split the recent `_kol-labs-single-init-state` source into `@kolkrabbi/kol-{theme,loader,component,framework}` using the monorepo's boundary contract. Rewrote cross-package imports (`../loaders/Icon.jsx` → `@kolkrabbi/kol-loader`, framework siblings → `@kolkrabbi/kol-component`). Made all four publishable (`private:false`, `0.1.0`, `publishConfig`, peers, `workspace:*` internal deps, READMEs).
- **showcase/** — Vite app from the single-state shell, rewired to consume the packages. Added `/components` gallery: error-boundaried live demos for safe atoms + mined usage per component. Builds clean (2406 modules), 0 console errors in-browser.
- **scripts/extract-usage.mjs** — mines real JSX usage from ~25 consumer apps (3762 files, 9 roots) → `docs/usage/*.md` (55) + `showcase/src/usage/usage-index.json`. 52/55 components have attributed real examples (Icon 21 apps, Button 17).
- **Release infra** — `.changeset/` config + initial changeset, `.github/workflows/release.yml`, root scripts (`changeset` / `version-packages` / `release`).
- **Docs** — root README (consumer + maintainer), 4 package READMEs, `ARCHITECTURE.md`, `AGENT-CONTEXT.md`, carried `docs/_framework`.
- **Fonts** — copied the brand fonts into `showcase/public/fonts/` (~17 MB) so the showcase renders on-brand; documented in the theme README that fonts are a consumer-supplied `/fonts/` contract, not bundled in the package. Build font-resolution warnings now clear.
- **git** — `git init` was permission-declined (global "never run git" rule); repo is assembled and ready for the human to commit/push.

## Next steps (need the human — both are outward/irreversible)

1. **npm publish** — create/confirm the `@kolkrabbi` npm org, `npm login`, `pnpm release` (or set the `NPM_TOKEN` CI secret). Nothing published yet.
2. **GitHub push** — create the `kolkrabbi/kol-design-system` remote (assumed by the repository URLs) and push.

Then: migrate kol-monorepo + the consumer apps onto the published versions; deploy the showcase.
