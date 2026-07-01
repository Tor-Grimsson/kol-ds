# workbench

Isolated component development for KOL, via [Ladle](https://ladle.dev). A
consumer-tier app — it installs the `@kolkrabbi/kol-*` packages like any
consumer and renders their components one state at a time, outside any app.

Never published. See the adoption plan:
`docs/migration/2026-06-26-workbench-adoption.md`.

## Run

```bash
pnpm workbench        # from repo root
# or, from here:
pnpm ladle            # serve
pnpm ladle:build      # static build
```

## Writing stories

Stories live **here, in `src/`** — not next to the components in `packages/`.
Two reasons:

1. The packages ship raw source with `files: ["src"]`; colocated `*.stories.jsx`
   would leak into the published tarball.
2. Importing by **package name** makes the workbench a real consumer — it
   exercises the public `@kolkrabbi/*` entry the way an app does.

Convention:

```jsx
// src/Button.stories.jsx
import { Button } from '@kolkrabbi/kol-component'   // by package name, never relative

// one export per meaningful view; the export name is the story label
export const Variants = () => ( /* ... */ )
export const States   = () => ( /* ... */ )
```

- File `Foo.stories.jsx` → story group `foo`; export `Bar` → id `foo--bar`.
- Show the awkward states (empty, disabled, loading, long text), not just the happy path.

## Gotchas

- **New story _files_ need a server restart.** Ladle's `meta.json` picks them up,
  but the client story list doesn't hot-add them — restart `pnpm ladle`. Editing
  an existing story file hot-reloads fine.
- **Ladle bundles Vite 6**; the rest of the repo is on Vite 8. That's fine — the
  workbench's Vite is isolated to this package and never ships. `vite.config.js`
  adds only Tailwind v4 + the single-React-copy `dedupe` fix.
- **Styling** comes from `src/index.css` (the KOL cascade, imported once in
  `.ladle/components.jsx`). **Order is load-bearing** — don't reorder it.
- **Fonts** are served from the showcase's `public/` via `publicDir` (no copy).
- **Default theme is dark** — `addons.theme.defaultState: 'dark'` in `.ladle/config.mjs`, matching KOL's `data-theme="dark"` default. Toggle in the toolbar.
- **Page-recolouring extensions (Dark Reader etc.) mangle the workbench** — vanishing text, wrong contrast. Disable them for this tab; it's the extension, not KOL.
