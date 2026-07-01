# KOL Design System

The single maintenance home for the **KOL (Kolkrabbi)** design system. This repo:

1. **Maintains** the `@kolkrabbi/kol-*` packages (one pnpm workspace, hot iteration).
2. **Hosts** them for fresh installs — published, versioned packages on npm. Consumers `npm install` them; **no linking, no symlinks, no `workspace:*`** reaches the outside world.
3. **Showcases** them — a live gallery (`showcase/`) that presents every component _and_ carries a usage reference mined from real KOL apps, for humans and LLMs alike.

This repo is the **source of truth**. The older copies in `kol-monorepo` are downstream and will migrate onto these published versions.

## Packages

| Package | What it is | Depends on |
| --- | --- | --- |
| [`@kolkrabbi/kol-theme`](packages/theme) | Brand-neutral tokens + base CSS. The cascade everything builds on. | — |
| [`@kolkrabbi/kol-loader`](packages/loader) | `<Icon/>` + the 341-icon registry. Vite-only (`import.meta.glob`). | react |
| [`@kolkrabbi/kol-component`](packages/component) | Components, atoms → organisms. Emits canonical `kol-*` classes. | kol-loader |
| [`@kolkrabbi/kol-framework`](packages/framework) | App shell — sidenav, layout, theme toggle, footer, heroes + brand color layer. | kol-component, kol-loader |

## Install (consumers)

```sh
npm i @kolkrabbi/kol-theme @kolkrabbi/kol-component @kolkrabbi/kol-loader
# react, react-dom (and react-router-dom for some components) are peers
```

**Requirements:** a **Vite + Tailwind v4** app. Packages ship raw JSX/CSS source — your bundler compiles them; the loader uses `import.meta.glob`.

CSS cascade order is load-bearing — import in exactly this order:

```css
@import "tailwindcss";
@import "@kolkrabbi/kol-theme";
@import "@kolkrabbi/kol-framework/kol-brand-color.css";   /* if using the framework */
@import "@kolkrabbi/kol-framework/kol-framework.css";     /* if using the framework */
```

```jsx
import { Button, Tag } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-loader'

<Button variant="primary" iconLeft="plus">New</Button>
```

## Local development (maintainers)

```sh
pnpm install        # links the workspace; showcase consumes packages via workspace:*
pnpm dev            # runs the showcase at localhost
pnpm build          # builds the showcase
```

Linking is fine **inside** this repo — that's the whole point of the workspace. It just never leaks to consumers, who only ever see published versions.

## Usage reference

Every component carries real-world examples pulled verbatim from ~25 KOL apps:

- **Browse:** `pnpm dev` → the **Components** page. Live demos + mined examples per component.
- **Read/diff:** [`docs/usage/<Component>.md`](docs/usage) — one file per component, attributed by app.
- **Regenerate:** `node scripts/extract-usage.mjs` (re-mines the consumer apps).

## Publishing

Versioning + release runs on [changesets](https://github.com/changesets/changesets):

```sh
pnpm changeset            # describe a change (pick bump per package)
pnpm version-packages     # apply versions + changelogs
pnpm release              # publish to npm  (needs @kolkrabbi npm auth)
```

CI (`.github/workflows/release.yml`) does this automatically on merge to `main` once the repo has an `NPM_TOKEN` secret.
# kol-ds
