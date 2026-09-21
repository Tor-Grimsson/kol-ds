# @kolkrabbi/design-editor

The Kolkrabbi design editor as one embeddable React component — a DOM/SVG
vector + generative compositor (canvas, layers, palette/pattern/type
generators, kinetic type, boolean geometry, image export).

**Live:** [editor.kolkrabbi.io](https://editor.kolkrabbi.io)

## The one built package

Every other `@kolkrabbi/kol-*` package ships raw `.jsx` (ARCHITECTURE §4). This
one ships a **built bundle** (`dist/`) and is the §4 exception, by ruling
(2026-09-03): it is an *application* you embed — one export, its own router
and state — carrying pixi, three and d3, which no source package takes and
which a site installing a Button must never pay for. The design system stays
**external**: the bundle imports `@kolkrabbi/kol-component`, `kol-framework`,
`kol-icons`, `kol-shell` and `kol-media-client` at runtime, so the host and the
editor run ONE copy of the DS at the host's version.

It moved here from `kol-fxr` (which published it from its own `package.json`
for two months, unversioned by any gate) so it is built, gated and published
like everything else in this repo. kol-fxr is now its first consumer.

## Install

```sh
npm install @kolkrabbi/design-editor \
  @kolkrabbi/kol-component @kolkrabbi/kol-framework @kolkrabbi/kol-icons \
  @kolkrabbi/kol-shell @kolkrabbi/kol-media-client react react-dom
```

Peers are pinned to the DS versions the bundle was built against (see
`package.json`); bump them together.

## Usage

```jsx
import { DesignEditor } from '@kolkrabbi/design-editor'
import '@kolkrabbi/design-editor/style.css'

export default function EditorPage() {
  return <DesignEditor mediaProxyBase="/media/" />
}
```

The editor mounts wherever you place it and owns no route — it runs on an
internal `MemoryRouter` and never touches the host's URL bar or
`document.title`.

## Host requirements

| Path | Serve | Why |
|---|---|---|
| `/media/*` | proxy → `https://r2.kolkrabbi.io/*` | the CDN sends no CORS headers; a cross-origin image taints the canvas and breaks every filter and export path. Same-origin is load-bearing |
| `/fonts/*` | the KOL fonts | the DS consumer contract — fonts are never bundled in any `@kolkrabbi` package; text and morph layers render with whatever the host serves there |

Point `mediaProxyBase` at whatever path you proxy (`/media/` is the default).
On Vercel that is a `vercel.json` rewrite; any static host has an equivalent.

The stylesheet is self-contained (Tailwind utilities without preflight, the DS
theme, the editor's own chrome) and scoped under `.kol-design-editor`, so it
does not restyle the host page. A host that also imports `@kolkrabbi/kol-theme`
gets idempotent duplicate custom properties, nothing worse.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mediaProxyBase` | `string` | `/media/` | Same-origin path the host proxies to the media CDN. |

## Building (this repo)

```sh
pnpm --filter @kolkrabbi/design-editor build   # → dist/design-editor.{js,css} + chunks
```

`prepublishOnly` runs it, so `pnpm publish` never ships a stale `dist/`.
`dist/` is gitignored; the source of truth is `src/`.

## License

MIT
