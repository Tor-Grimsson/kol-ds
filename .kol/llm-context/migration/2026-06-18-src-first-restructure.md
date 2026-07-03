---
title: src-first restructure — design system in src/, packages as a build artifact
type: plan
status: active
updated: 2026-06-18
description: Collapse the pnpm workspace into a single regular app with the design system in src/, consumed via @kolkrabbi/* path aliases; generate the npm packages from src/ at publish instead of linking them as workspace deps.
phases:
  - "0 · Decide + freeze scope"
  - "1 · Restructure source into src/kol/<layer>"
  - "2 · Aliases + drop workspace and @source"
  - "3 · Generate-packages script"
  - "4 · Boundary enforcement"
  - "5 · Publish pipeline on generated packages"
  - "6 · Cutover + cleanup"
tags:
  - domain/design-system
  - domain/build
  - pattern/generated-packages
related:
  - "[[benchmark/INDEX|shadcn ⇄ KOL benchmark]]"
---

# src-first restructure — design system in `src/`, packages as a build artifact

## Why

The repo is a pnpm workspace: the design system lives in `packages/{theme,loader,component,framework}` and the showcase consumes them via `workspace:*` through `node_modules` symlinks. Three costs fall out of that:

1. **Tailwind can't see the components.** Tailwind v4 auto-detection skips `node_modules`, so utility classes used *inside* the KOL components never generate unless the showcase carries `@source` directives. This is the bug that rendered the sidebar as bare unstyled text.
2. **The host pages drift off-brand.** They're authored against packages-behind-a-symlink rather than live local source, so building them right is friction, and they keep diverging from the brand app's gallery.
3. **The source-of-truth repo has a worse showcase than its downstream consumer.** `kol-monorepo/apps/brand` consumes the same packages from local-ish source and stays on-brand; this repo re-implements that gallery by hand and fights drift.

**Goal:** consume the design system the way the brand app does — live local `src/` — while still publishing the four versioned `@kolkrabbi/kol-*` packages to npm. One source of truth, zero hand-synced copies, no workspace/`@source` friction.

The key enabler: cross-layer imports **already** use `@kolkrabbi/*` specifiers (ARCHITECTURE §3 — `AppShell` imports `@kolkrabbi/kol-component`, etc.). So an alias can resolve them locally during development while the *published* packages keep the identical specifiers — making publish a near-pure copy with no import rewriting.

## Current state

```
/ (pnpm workspace root)
├── pnpm-workspace.yaml
├── packages/
│   ├── theme/        @kolkrabbi/kol-theme      (CSS at package root; "." → kol-theme.css)
│   ├── loader/       @kolkrabbi/kol-loader     (src/*.jsx)
│   ├── component/    @kolkrabbi/kol-component  (src/{atoms,molecules,organisms}/*.jsx)
│   └── framework/    @kolkrabbi/kol-framework  (src/*.jsx + kol-framework.css + kol-brand-color.css)
└── showcase/         the app — consumes via workspace:* through node_modules symlinks
    └── src/index.css → @source "../node_modules/@kolkrabbi/kol-*/src"  (the friction)
```

- Internal deps: `workspace:*`. Cross-layer imports: `@kolkrabbi/*`. Within a layer: relative (§3).
- Boundaries (`theme ← loader ← component ← framework`) are enforced continuously by the resolver — `component` only has its declared deps installed, so it physically cannot import `framework`.
- Packages ship raw `.jsx`/`.css`, no build step (§4).

## Target state

```
/ (regular Vite app, no workspace)
├── package.json                  single app package
├── vite.config.js                aliases @kolkrabbi/kol-* → src/kol/<layer>
├── jsconfig.json                 same paths for editor/LSP resolution
├── eslint.config.js              no-restricted-paths: enforces layer boundaries in src/kol
├── scripts/build-packages.mjs    generates packages/ from src/kol at publish
├── src/
│   ├── kol/                      ← the design system (the publishable source of truth)
│   │   ├── theme/                → @kolkrabbi/kol-theme
│   │   ├── loader/               → @kolkrabbi/kol-loader
│   │   ├── component/            → @kolkrabbi/kol-component
│   │   └── framework/            → @kolkrabbi/kol-framework
│   ├── app/                      ← the host/showcase pages (consume kol/* via @kolkrabbi/*)
│   ├── index.css                 @import "@kolkrabbi/kol-theme" (alias-resolved; NO @source)
│   └── main.jsx
└── packages/                     ← GENERATED build artifact (gitignored source, committed package.json+README)
    ├── theme/    package.json + README committed · CSS generated from src/kol/theme
    ├── loader/   "
    ├── component/"
    └── framework/"
```

- **App resolves the DS from `src/kol/` via `@kolkrabbi/*` aliases.** Vite + jsconfig paths. The repo never imports from `packages/`.
- **Tailwind scans `src/` natively** — `@source` directives deleted; the sidebar/chrome utilities generate with no config.
- **`packages/` is output, not source.** A generate step copies `src/kol/<layer>` into each package's published layout; `package.json` + `README` per package stay committed (npm metadata changes rarely), the source files are generated and gitignored. Nothing is hand-synced; nothing imports from it during development.
- **Boundaries enforced at lint + publish time** instead of by the resolver. One `no-restricted-paths` rule flags a cross-layer import as you type; the generate script re-validates before emitting.

## Phases

### 0 · Decide + freeze scope

- Confirm this supersedes the workspace model in ARCHITECTURE §1 (and adjust §3/§6 wording: "internal workspace" → "internal `src/` + alias"; §4 unchanged — packages still ship raw source).
- Confirm the four published package names, exports maps, and peer deps are frozen as-is (this restructure must not change the published API — see acceptance criteria).
- Snapshot the current published surface: `git`-tag or record each package's `package.json` `exports` + `files` so the generated output can be diffed against it.

### 1 · Restructure source into `src/kol/<layer>`

- Move `packages/theme/*` → `src/kol/theme/`, `packages/{loader,component,framework}/src/*` → `src/kol/{loader,component,framework}/`, and the framework's root CSS (`kol-framework.css`, `kol-brand-color.css`) → `src/kol/framework/`.
- Move the showcase app: `showcase/src/{pages,lib,...}` → `src/app/`; `showcase/public/*` → `public/`; `showcase/index.html` → repo root.
- Keep each layer's **internal** imports relative (unchanged) and **cross-layer** imports `@kolkrabbi/*` (unchanged) — no edits to component source in this phase, only relocation.

### 2 · Aliases + drop workspace and `@source`

- Add `vite.config.js` `resolve.alias` for each `@kolkrabbi/kol-*` → `src/kol/<layer>`. Alias the **bare specifier to the layer's entry** (e.g. `@kolkrabbi/kol-theme` → `src/kol/theme/kol-theme.css`) **and** `@kolkrabbi/kol-theme/*` → `src/kol/theme/*` for deep imports; order specific-before-bare. *(Known wrinkle: CSS `@import` of a bare package specifier resolves to the entry file, not a folder — verify the theme/framework CSS entrypoints resolve.)*
- Mirror the same paths in `jsconfig.json` (`compilerOptions.paths`) so editor/LSP + ESLint resolve them.
- Delete the three `@source` directives from the app's `index.css`. Delete `pnpm-workspace.yaml` and the per-package `workspace:*` wiring. Collapse `showcase/package.json` + the four package.jsons' devDeps into one root `package.json`.
- Smoke-test: app boots, Tailwind generates the chrome utilities with zero `@source`, sidebar renders correctly, fonts load.

### 3 · Generate-packages script

- `scripts/build-packages.mjs`: for each layer, copy `src/kol/<layer>` into `packages/<layer>/` at the published layout (theme = flat CSS at package root; loader/component/framework = `src/`), leaving the committed `package.json` + `README` in place.
- No import rewriting (specifiers are already `@kolkrabbi/*`). The script **validates** before writing: every `@kolkrabbi/*` import in a layer must be in that package's declared `dependencies` (catches a boundary break that the missing resolver no longer blocks — see Phase 4).
- Wire `package.json` scripts: `build:packages`, and a `prepublishOnly`/CI hook that runs it.
- Add generated source paths to `.gitignore` (keep `packages/*/package.json`, `packages/*/README.md` committed).

### 4 · Boundary enforcement

- ESLint `import/no-restricted-paths` zones over `src/kol`: `theme` may import nothing internal; `loader` → theme; `component` → theme, loader; `framework` → theme, loader, component. Forbidden cross-layer imports error in-editor and in CI.
- The Phase 3 validate step is the backstop: even if lint is bypassed, the generator refuses to emit a package with an undeclared `@kolkrabbi/*` dep.

### 5 · Publish pipeline on generated packages

- Point changesets at `packages/` (they remain real package dirs with committed `package.json`). Release flow: `build:packages` → `changeset version` → `changeset publish`.
- Verify `workspace:*` is gone — internal deps in the generated `package.json` are real semver ranges (changesets manages these). No `workspace:*` may reach npm (ARCHITECTURE §1 still holds for the external seam).
- CI: on release, generate → validate → publish. On PR, generate → validate (no publish) as a boundary/packaging check.

### 6 · Cutover + cleanup

- Delete the old `packages/*/src` committed sources and `showcase/` once `src/` is the live tree.
- Rewrite ARCHITECTURE §1 to describe the `src/` + alias internal model; update AGENT-CONTEXT gotchas (the `@source` requirement note becomes "N/A internally; still required for *external* consumers — document in package READMEs").
- Update each package README's consumer instructions (external consumers still need `@source "../node_modules/@kolkrabbi/kol-*/src"` — that requirement is unchanged for them; it's only the *internal* repo that escapes it).
- Mark this plan `status: superseded` pointing at the executed reality.

## Acceptance criteria

- App runs with the design system imported from `src/kol/` via `@kolkrabbi/*` aliases; **no `@source` directive anywhere**; sidebar/chrome render correctly; fonts load.
- `npm run build:packages` emits `packages/` whose published surface (`exports`, `files`, every entry file) is **byte-for-byte equivalent in public API** to the pre-migration packages — diffed against the Phase 0 snapshot.
- A clean external consumer (`npm install @kolkrabbi/kol-*` in a throwaway Vite+Tailwind app) renders identically to before. **This restructure is invisible downstream.**
- A deliberately-planted cross-layer import (`component` → `framework`) **fails ESLint and fails the generate step** — boundary is enforced, just later than the resolver did.
- Editing a component in `src/kol/component` updates the running app immediately (HMR) and, on the next `build:packages`, the published package — **one source, no hand-sync**.
- No `workspace:*` string appears in any generated `packages/*/package.json`.

## Risks & non-goals

- **Lost continuous boundary enforcement** → recovered by Phase 4 (lint + generate-validate). Enforcement moves from author-time-by-resolver to author-time-by-lint plus publish-time-by-validate. Acceptable.
- **CSS entrypoint resolution under aliases** (Phase 2 wrinkle) is the most likely snag — bare `@import "@kolkrabbi/kol-theme"` must resolve to the entry CSS, not a folder. Validate early.
- **Not in scope:** changing the published package boundaries, names, or API; OKLCH/token work; the `ContentFilters`-over-registry host-page improvement (separate, and only worth doing if the showcase survives the consolidation question — see `session-log/2026-06-18-host-page-dogfooding-and-showcase-redundancy`).
- **Open prerequisite:** this assumes the showcase stays in this repo. If the decision is instead to consolidate onto the brand app, this plan is moot — settle that first.
