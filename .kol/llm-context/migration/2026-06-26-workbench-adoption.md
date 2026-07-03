---
title: Component workbench (Ladle) — adoption plan
type: plan
status: superseded
superseded_by: "[using the workbench](../../../docs/documentation/05-operations/02-workbench.md)"
updated: 2026-06-26
description: Stand up a dedicated Ladle workbench app to develop KOL components in isolation — a consumer-tier app that imports the packages by name and assembles the cascade CSS once. Phased, gated on a Vite-6/Tailwind-v4 toolchain spike.
phases:
  - "0 · Toolchain spike — go/no-go"
  - "1 · Scaffold the workbench app"
  - "2 · Assemble the CSS + fonts shell"
  - "3 · First stories"
  - "4 · Conventions + scale-out"
tags:
  - domain/design-system
  - domain/workflow
  - pattern/component-workbench
related:
  - "[[workflows/01-component-workbench|component workbench]]"
  - "[[workflows/02-workbench-tools|workbench tools]]"
  - "[[2026-06-18-src-first-restructure|src-first restructure]]"
  - "[[benchmark/INDEX|shadcn ⇄ KOL benchmark]]"
  - "[using the workbench](../../../docs/documentation/05-operations/02-workbench.md)"
---

# Component workbench (Ladle) — adoption plan

A guide for standing up isolated component development. Read [[workflows/01-component-workbench|the workbench guide]] for the concept; this is the build.

## Why

KOL components are developed by dropping them into a running app and clicking to a state. A workbench renders each component's states directly and in isolation — the right surface for a system whose whole value is *behaving correctly across every state and prop combination*. This adopts the lean rungs (isolated render + stories), nothing heavier.

## The call (reviewed)

**A dedicated `workbench/` app at the consumer tier. Ladle. Stories live in the app and import components by package name.** Not colocated in the packages, not Storybook — for reasons the codebase forced, not taste:

| Decision | Why — grounded in the code |
|---|---|
| **Own app, not config in a package** | A workbench needs the *assembled* stack (cascade CSS, `@source`, fonts) — a consumer's job (§1, §4). Putting it in `packages/component` makes a library carry app concerns and reach sideways into `theme`/`framework`. |
| **Stories in the app, imported by name** | `packages/*/package.json` has `files: ["src"]` — the whole `src` ships. Colocated `*.stories.jsx` would leak into the published raw-source tarball, and `files` negation is fragile. Stories in the app keep packages pristine and **dogfood the public `@kolkrabbi/*` entry** the way a real consumer hits it. |
| **Ladle, not Storybook** | KOL wants the isolated-dev rung, not the full a11y/visual-regression pipeline. Ladle is Vite-native and light. Storybook is the named fallback if the spike fails (see Risks). |

**Decoupled from the open src-first decision.** The workbench depends only on `@kolkrabbi/*` specifiers, which the [[2026-06-18-src-first-restructure|src-first restructure]] preserves by design — so this survives that move (or its rejection) untouched. Safe to build before that call lands.

## Current state

- pnpm workspace: `packages/{theme,loader,component,framework}` + `showcase`. Registered in `pnpm-workspace.yaml`.
- Stack: **Vite 8**, **Tailwind v4** (`@tailwindcss/vite`), **React 19.2**. The loader resolves icons via `import.meta.glob('./**/*.svg', { query: '?raw' })` — **Vite-only**.
- The showcase already proves the consumer recipe: `showcase/src/index.css` (the cascade) + `showcase/vite.config.js` (plugins + the React-dedupe fix). The workbench mirrors both.

## Target state

```
packages/  theme ← loader ← component ← framework
showcase/                                  (existing consumer — untouched)
workbench/                                 ← NEW, consumer tier
  package.json          workspace:* on all four packages + @ladle/react
  vite.config.js        mirror of showcase: react(), svgr(), tailwindcss(), dedupe
  .ladle/
    config.mjs          stories glob + static (fonts) dir
    components.jsx       global Provider — imports the cascade CSS once
  src/
    index.css           the 7-line cascade (copied from showcase)
    Button.stories.jsx  import { Button } from '@kolkrabbi/kol-component'
    Icon.stories.jsx    import { Icon }   from '@kolkrabbi/kol-component'
```

Run with `pnpm --filter workbench ladle`. Stories import by package name; nothing in `packages/` changes.

---

## Phase 0 · Toolchain spike — go/no-go

**The gate. Do not build on Ladle until this renders.** Ladle 5.1.1 bundles **Vite 6**; KOL runs Vite 8. Ladle's Vite stays isolated in `workbench/` (pnpm per-package) — the question is whether **Tailwind v4 + React 19 + the loader's `?raw` glob** all work under Ladle's Vite 6.

1. `mkdir workbench`, minimal `package.json` (`@ladle/react`, the four `@kolkrabbi/*` as `workspace:*`, react, react-dom, `tailwindcss`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `vite-plugin-svgr`).
2. `vite.config.js` = copy of `showcase/vite.config.js` (plugins + `resolve.dedupe: ['react','react-dom']`).
3. `src/index.css` = copy of `showcase/src/index.css` (the cascade + `@source`).
4. `.ladle/components.jsx` importing `../src/index.css`, and one `Button.stories.jsx`.
5. `pnpm install && pnpm --filter workbench ladle`.

**Acceptance:** `Button` renders **fully styled** — KOL classes resolved (proves `@source` works), theme tokens + brand fonts applied — with **no React null-dispatcher crash**. If green → Ladle is the path, continue. If `@tailwindcss/vite` won't init under Vite 6 or the dedupe doesn't kill the crash → **fallback to `@storybook/react-vite`** and re-run this spike before Phase 1.

## Phase 1 · Scaffold the workbench app

Promote the spike to real structure.

1. Add `workbench` to `pnpm-workspace.yaml` `packages:`.
2. Flesh out `workbench/package.json` — `"ladle": "ladle serve"`, `"ladle:build": "ladle build"`. `private: true`, `version: 0.0.0` (never published).
3. Add root script: `"workbench": "pnpm --filter workbench ladle"`.

**Acceptance:** `pnpm workbench` from repo root serves the spike story.

## Phase 2 · Assemble the CSS + fonts shell

The render-correctness layer. Both already solved by the showcase — replicate, don't reinvent.

1. `src/index.css`: the exact cascade — `@import "tailwindcss"` → `@source "../node_modules/@kolkrabbi/kol-{framework,component,loader}/src"` → `@import "@kolkrabbi/kol-theme"` → brand-color → framework css. **Order is load-bearing (§5).**
2. Fonts: theme references `/fonts/…` absolute. Point Ladle's `staticDir` at the existing font files (share `showcase/public/fonts`, don't duplicate ~17 MB) so they serve at `/fonts/`.
3. `.ladle/components.jsx` exports a `Provider` importing `index.css` once — global to every story.

**Acceptance:** a component using brand type + a theme token renders identically to the showcase.

## Phase 3 · First stories

1. `Button.stories.jsx` — `Default`, `Disabled`, plus each real variant/size the component exposes.
2. `Icon.stories.jsx` — `import { Icon } from '@kolkrabbi/kol-component'`, a few names across sizes/variants (stroke vs solid).
3. One organism (e.g. `Table`) to confirm heavier components assemble.

**Acceptance:** sidebar lists the stories; every state is directly addressable and on-brand.

## Phase 4 · Conventions + scale-out

1. Write the story convention down (file location `workbench/src/`, import-by-package-name, one export per state) — short section appended to [[workflows/02-workbench-tools|workbench tools]] or a new `workbench/README.md`.
2. Backfill stories for the components that already have showcase demos; the awkward states (empty, error, long text, loading) are the point.
3. Decide later, only if a real need shows up: graduate to Storybook for a11y/axe-per-story + visual regression. The stories port largely as-is. Not now.

**Acceptance:** adding a component's stories is a documented, repeatable ~5-minute step.

---

## Risks & gates

| Risk | Severity | Mitigation |
|---|---|---|
| **Ladle's Vite 6 can't host Tailwind v4 / React 19** | High — blocks the tool | Phase 0 go/no-go. Fallback: `@storybook/react-vite`, re-spike. |
| **React duplicate → null dispatcher crash** | High | `resolve.dedupe: ['react','react-dom']` — proven fix, copied from showcase. |
| **Unstyled components** (missing `@source`) | Med | The cascade + `@source` copied verbatim; Phase 0 acceptance catches it. |
| **Stories leak into published packages** | Med | Stories live in `workbench/src`, never in `packages/*/src`. Designed out. |
| **Fonts 404 at `/fonts/`** | Low | Ladle `staticDir` → shared font files. |

## Acceptance — whole effort

`pnpm workbench` serves a sidebar of KOL components, each rendered in isolation, fully on-brand (classes + theme + fonts), with no change to any `packages/*` file and nothing new in the published tarballs.
