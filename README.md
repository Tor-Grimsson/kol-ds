# KOL Design System

[![Live — ds.kolkrabbi.io](https://img.shields.io/badge/live-ds.kolkrabbi.io-000?style=flat-square&logo=vercel)](https://ds.kolkrabbi.io)

The single maintenance home for the **KOL (Kolkrabbi)** design system — one pnpm workspace that **maintains** the `@kolkrabbi/kol-*` packages, **publishes** them to npm, and **showcases** them live.

This repo is the source of truth. The older copies in `kol-monorepo` are downstream and migrate onto these published versions.

## Packages

All published under `@kolkrabbi/*`. The UI tier is a four-layer stack: `theme ← loader ← component ← framework`.

| Package | Tier | What it is |
| --- | --- | --- |
| `kol-theme` | UI | Brand-neutral tokens + base CSS. The cascade everything builds on. |
| `kol-icons` | UI | `<Icon/>` + the 341-icon registry. Vite-only (`import.meta.glob`). |
| `kol-component` | UI | Atoms → organisms, emitting canonical `kol-*` classes. |
| `kol-framework` | UI | App shell — sidenav, layout, theme toggle, heroes, brand color layer. |
| `kol-media-client` | Client | Read-only client for the kol-media CDN. Plain ESM, no React. |
| `kol-brand-template` | Brand | The brand-manifest schema — the blank slate copied per client. |
| `kol-brand` | Brand | Kolkrabbi's own manifest + logo SVGs. Public-safe. |
| `kol-scrape` | Tool | Zero-dep presence/press scraper CLI. |

## Consuming

```sh
npm i @kolkrabbi/kol-theme @kolkrabbi/kol-component @kolkrabbi/kol-icons
```

Needs a **Vite + Tailwind v4** app — packages ship raw JSX/CSS, your bundler compiles them. `react`, `react-dom` (and `react-router-dom` for some components) are peers.

CSS cascade order is load-bearing — import in exactly this order:

```css
@import "tailwindcss";
@import "@kolkrabbi/kol-theme";
@import "@kolkrabbi/kol-framework/kol-brand-color.css";   /* if using the framework */
@import "@kolkrabbi/kol-framework/kol-framework.css";
```

```jsx
import { Button, Tag } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

<Button variant="primary" iconLeft="plus">New</Button>
```

## Developing

```sh
pnpm install      # links the workspace
pnpm dev          # showcase at localhost
pnpm build        # build the showcase → showcase/dist
pnpm workbench    # isolated component dev (Ladle)
```

Linking is fine inside the workspace — it never leaks to consumers, who only ever see published versions.

## Showcase

`showcase/` is a shadcn-style docs site: **Components**, **Blocks** (UI compositions), **Sets** (full apparatus), **Foundations**, **Docs**, and **Icons** — plus a usage reference mined verbatim from ~25 real KOL apps. Read them in [`docs/documentation/07-usage/`](docs/documentation/07-usage); regenerate with `node scripts/extract-usage.mjs`.

## Deploy (Vercel)

Root Directory **= repo root** (not `showcase/` — the app pulls packages via `workspace:*`, which only resolve from the workspace root). Framework preset **Vite**, build command `pnpm build`, output directory `showcase/dist`.

## Publishing

Releases run on [changesets](https://github.com/changesets/changesets) via CI:

1. `pnpm changeset` — describe the change, pick the bump per package.
2. Push. CI opens (or updates) a **"Version Packages"** PR.
3. Merge that PR — **merging it is the publish button.** CI applies versions and publishes to npm. `git pull` afterward, since the merge adds commits to `main`.

## Layout

- `packages/` — the published `@kolkrabbi/*` packages (source of truth).
- `showcase/` — the live docs app · `workbench/` — Ladle component sandbox.
- `docs/documentation/` — the docs vault (numbered sections).
- `.kol/` — agent context + doc framework. This repo is the reference implementation of the `.kol/` convention.
