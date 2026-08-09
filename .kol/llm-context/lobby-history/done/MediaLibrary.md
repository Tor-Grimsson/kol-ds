---
component: MediaLibrary
source: kol-ds-fxr/src/editor/library/{mediaLibrary.js,MediaPicker.jsx,LibraryProvider.jsx} — plus 3 more forks, see Provenance
date: 2026-08-01
status: closed
deps: [Input, Button, Icon]
staged: 2026-08-01
---

# MediaLibrary

> **On the raw values in Styling below:** they are *transcriptions of consumer
> source*, recorded so the DS can reproduce the look without guessing — the
> lobby spec's whole job. **No KOL token carries them today** (checked: the
> backdrop washes, the card width and the tile floor have no `--kol-*` home).
> They are listed precisely so they can be *replaced* by tokens on recreation,
> not adopted. Every one is called out under **App-specific bits to DROP**.

## Purpose

A browser over the **kol-media R2 bucket**, read via one public endpoint
(`https://admin.kolkrabbi.io/api/list`) and rendered from one public origin
(`https://media.kolkrabbi.io/<key>`). Folder drill-down, name filter, grid,
lightbox, click-to-copy URL, and an optional "pick this asset" contract.

**This is not a new component — it is a consolidation.** Four repos ship their
own copy of it today. Two of them share filenames and have already diverged in
opposite directions, so a fix in either is invisible to the other.

## Provenance — the four copies

| Repo | Files | Lines | Shape |
|---|---|---|---|
| **kol-ds-fxr** | `editor/library/mediaLibrary.js` · `MediaPicker.jsx` · `LibraryProvider.jsx` | **750** | modal picker + lightbox + folders. **Most complete.** |
| **kol-apps/kol-labs-single** | `lib/mediaLibrary.js` · `components/framework/MediaPicker.jsx` · `pages/library/LibraryPage.jsx` | 425 | picker **and** a full page |
| **kol-apps/kol-client-kolkrabbi** | `pages/Library.jsx` | 145 | flat page, no folders |
| **kol-website** (brand) | `apps/brand/src/pages/Library.jsx` | 147 | flat page, no folders |
| kol-media-admin | `src/lib/api.js` + `functions/api/*` | 75 | **the origin.** Owns write ops — NOT in scope |

**1542 lines across 9 files.** `kol-ds-fxr` and `kol-labs-single` are forks of
one another: identical filenames, and both export `mediaUrl` / `listMedia` /
`isImageType` / `isVideoType` / `formatSize`. They diverged —

- fxr gained `proxied()` + `setMediaProxyBase()` — the **canvas-taint fix**. The
  CDN sends no CORS headers, so a cross-origin load taints a canvas that later
  calls `getImageData`. labs-single does not have this.
- labs-single gained `uploadToLibrary()` + `saveToGallery()` — write paths fxr
  does not have.

Neither `Library.jsx` page has folders at all, which is the visible symptom: the
brand book renders **433 flat tiles**, 415 of them `labs-render-examples/` noise,
because it never learned the drill-down the picker already does.

## Anatomy

```
MediaLibraryProvider            (headless — fetch, cache, folder derivation)
└── consumers pick a view:
    ├── MediaPicker             (modal — choose one asset, returns via onPick)
    │   ├── header              label · filter Input · close
    │   ├── breadcrumb          root / seg / seg
    │   ├── folder list         one row per immediate sub-folder + chevron
    │   ├── file grid           square tiles, img or video
    │   └── MediaLightbox       overlay: full preview · ←/→ · name · size · Use · Copy URL
    └── MediaBrowser            (full page — same body, no modal shell, no pick)
```

## Variants

| variant | form | pick contract |
|---|---|---|
| `MediaPicker` | fixed overlay, centred card | `onPick(url, { contentType })` then closes |
| `MediaBrowser` | in-flow, fills its container | none — click copies the public URL |

Both render the identical breadcrumb + folder list + grid + lightbox. The modal
shell and the pick action are the only differences.

## Props

### `useMediaLibrary()` / `<MediaLibraryProvider>`

| prop | type | default | controls |
|------|------|---------|----------|
| `adminBase` | string | `https://admin.kolkrabbi.io` | list endpoint origin |
| `publicBase` | string | `https://media.kolkrabbi.io` | object URL origin |
| `proxyBase` | string \| null | `null` | same-origin rewrite path for canvas consumers; `null` = no rewrite |
| `accept` | `'image'` \| `'video'` \| `'all'` | `'all'` | which contentTypes are listed/pickable |

Returns `{ objects, folders, files, prefix, setPrefix, crumbs, filter, setFilter, loading, error, mediaUrl, proxied }`.

### `<MediaPicker>`

| prop | type | default | controls |
|------|------|---------|----------|
| `open` | bool | `false` | mounts the overlay |
| `onClose` | fn | — | Esc, backdrop click, close button |
| `onPick` | fn | — | `(url, { contentType })` |
| `accept` | string | `'all'` | forwarded to the provider |

### `<MediaBrowser>`

| prop | type | default | controls |
|------|------|---------|----------|
| `accept` | string | `'all'` | forwarded to the provider |
| `onSelect` | fn \| null | `null` | null → click copies URL instead |

## Styling

Verbatim from `kol-ds-fxr/src/editor/library/MediaPicker.jsx` — the most
developed copy. Read with the note at the top of this file.

**Modal shell** — backdrop `fixed inset-0 flex items-center justify-center` over an
inline black wash at 60% · card `bg-surface-primary border border-fg-08 rounded
shadow-xl flex flex-col`, inline fixed width with viewport-gutter max-width/height
(`MediaPicker.jsx:213-214`).

**Header** — `flex items-center gap-3 px-5 h-12 border-b border-fg-08 shrink-0`;
label `kol-helper-12 text-emphasis whitespace-nowrap`; `<Input variant="filled" size="sm" className="flex-1">`.

**Breadcrumb** — `flex items-center gap-1 px-5 h-9 border-b border-fg-08 shrink-0 kol-mono-12 text-meta overflow-x-auto`; segments `hover:text-emphasis transition-colors`.

**Body** — `flex-1 min-h-0 overflow-y-auto p-5`, inline `scrollbarWidth: 'thin'`.

**Folder row** — `flex items-center gap-3 py-2 px-1 border-b border-fg-08 cursor-pointer hover:bg-fg-04 transition-colors rounded`; name `kol-mono-12 text-emphasis flex-1`.

**File grid** — `grid gap-4 list-none m-0 p-0` on an `auto-fill` / `minmax` track
(`MediaPicker.jsx:274`)
- tile `aspect-square bg-fg-04 rounded overflow-hidden border border-fg-08 hover:border-fg-24 transition-colors`
- media `w-full h-full object-cover`, `loading="lazy"` on img, `muted preload="metadata"` on video
- caption `kol-helper-10 text-meta truncate mt-1`

**Lightbox** — `fixed inset-0 flex items-center justify-center` over an inline
black wash at 88% plus a `backdropFilter` blur
- media `max-w-full max-h-[70vh] object-contain rounded` + an inline drop shadow
- name `kol-mono-12 text-emphasis` · size `kol-mono-12 text-meta` · counter `kol-mono-10 text-meta`
- arrows `absolute left-4|right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded text-meta hover:text-emphasis transition-colors` on a square hit box

**Empty / error** — `kol-helper-12 text-meta` · `kol-helper-12 text-ui-error`

### App-specific bits to DROP

- **`EditorButton`** (`MediaPicker.jsx:3`) — an fxr-local button. Use DS `Button`.
- **The inline `Chevron`** (`MediaPicker.jsx:39-45`) — hand-rolled because "the
  editor icon registry has no left/right chevron". **kol-icons v1 ships
  `chevron-left` and `chevron-right`.** Delete it, use `Icon`.
- **The two inline black washes and the two drop shadows** (`MediaPicker.jsx:83,101,112,209`)
  — raw rgba. No `--kol-*` currently carries a scrim; either add one or use the
  absolute/oq ladder.
- **The card's inline width and viewport-gutter maxima** (`MediaPicker.jsx:214`)
  — should be a prop or read `--kol-content-*`.
- **The grid's minmax floor** (`MediaPicker.jsx:274`) — a magic tile size; make it a prop.
- **The two arbitrary `z-[…]` values** (`MediaPicker.jsx:82,208`) — reconcile with the DS layering scale.
- brand's `Library.jsx:8-9` hand-transcribes the `ADMIN_BASE`/`PUBLIC_BASE` pair
  — the package owns those constants; nobody re-declares them.

## States & interactions

| | |
|---|---|
| folder row hover | `bg-fg-04` |
| tile hover | border `fg-08` → `fg-24` |
| tile click | opens lightbox at that index |
| lightbox keys | `←`/`→` step, `Esc` closes **the lightbox only** — the picker suppresses its own Esc while it's open, so one press steps back one level rather than exiting entirely (`MediaPicker.jsx:182-187`) |
| copy | button label swaps to `Copied` for 1500ms |
| backdrop click | closes; card click `stopPropagation` |
| loading / error | single line of text, no skeleton |

## Dependencies

DS: `Input` (filled, sm) · `Button` (primary/secondary sm, iconOnly + quiet for close) · `Icon` (`chevron-left`, `chevron-right`, `x`).

Consumer-only to replace: `EditorButton`, the inline `Chevron` SVG.

## Recreation notes

- **Tier: organism**, with the data layer as a plain module + hook beside it.
  `mediaLibrary.js` is already 53 lines of zero-React code — it ports as-is.
- **Export headless first.** fxr needs a modal; brand, labs and client-kolkrabbi
  need a page. One opinionated component cannot serve both — ship
  `useMediaLibrary()` + `MediaLibraryProvider` and let `MediaPicker` /
  `MediaBrowser` be two thin views over it.
- **Folder derivation is client-side and must stay so.** `/api/list` returns a
  flat key array with no `prefixes` key; `?delimiter=/` changes nothing
  (probed 2026-08-01). fxr's `partition()` (`MediaPicker.jsx:25-35`) splits keys
  on the first `/` below the current prefix — that function is the whole feature
  and it is ten lines.
- **Carry fxr's `proxied()` + `setMediaProxyBase()` forward.** It is the only
  copy with the canvas-taint fix; dropping it silently breaks any consumer that
  reads pixels. Make it a provider prop rather than module-level mutable state.
- **Video tiles need a poster frame.** All four copies render
  `<video preload="metadata">` with no poster, so **222 of the bucket's 433
  objects paint as empty boxes**. Appending a `#t=` time fragment to the video
  src makes the browser seek and paint frame one.
- **Do NOT absorb the write ops.** `uploadToLibrary`/`saveToGallery`
  (labs-single) and upload/rename/delete (`kol-media-admin/functions/api/*`) stay
  out — this package is the read layer. The admin remains the write tool.
- Text casing at the call site as always — labels are authored, not transformed.

## Open question for the DS

Package home: a new `packages/media` (it carries a network contract and two
origin constants, which no existing package does), or an organism inside
`packages/component`. Leaning new package — `kol-component` has no other
component that talks to an API.

---

## Resolution — 2026-08-01

**Recreated as** `packages/component/src/organisms/MediaLibrary.jsx` (component **0.19.0**),
one module exporting `MediaLibraryProvider` · `useMediaLibrary` · `MediaPicker` ·
`MediaBrowser` — the `Popover` module's precedent for a multi-export tier member.

**The open question is answered: no new package.** `packages/media-client` already
owned the network contract (`createMediaClient` / `mediaUrl` / `proxied` /
`listMedia`), so the only thing missing was the React layer. And the views could
not live in that package either — **ARCHITECTURE §3 keeps the clients tier free of
UI dependencies in BOTH directions.** So the client is **injected as a prop** and
`kol-component` never imports it. That is the kol-dashboards / kol-chess /
kol-content contract: the package renders, it never fetches on its own authority.

**What was reused rather than rebuilt:**

| The spec asked for | What it became |
|---|---|
| a lightbox | `MediaViewer` — the DS already had ONE fullscreen paged viewer. It gained an additive `actions` slot so Use / Copy URL ride it instead of forking a second lightbox. |
| a modal shell + backdrop + Esc + scroll lock | `FullscreenOverlay` / `.kol-overlay` — it already owns the scrim, the centring, backdrop-dismiss and the corner close. |
| the inline `Chevron` SVG | `Icon name="chevron-left|right"` — kol-icons v1 ships both, as the spec itself noted. |
| two arbitrary `z-[…]` | nothing — the overlay's own layer handles it; `--kol-z-*` was not needed at a call site. |
| the two inline black washes | nothing — `.kol-overlay`'s scrim is the only one now. |

**The raw values became tokens, not props.** `--kol-media-picker-w` and
`--kol-media-tile-min` live in `packages/theme/kol-components-organisms.css`
alongside `.kol-media-picker` / `.kol-media-grid` / `.kol-media-tile` /
`.kol-media-folder`. A card width and a tile floor are geometry, and geometry is
referenced, not re-guessed per consumer — which is exactly how four forks ended up
with four different ones.

**Defects fixed on promotion:**
- **Video tiles paint.** `#t=0.1` on the tile src makes the browser seek and render
  frame one — 222 of the bucket's 433 objects were empty boxes in all four forks.
- **Folders exist in the page view.** `partition()` is in the shared body, so
  `MediaBrowser` drills down; the brand book's 433 flat tiles were the symptom of
  the page forks never gaining it.
- **Escape steps back one level.** The picker hands `FullscreenOverlay` a no-op
  close while the viewer is open, which is what the fxr fork hand-rolled.
- **The abort path is real** — the provider aborts its fetch on unmount.

**Not absorbed, deliberately:** `uploadToLibrary` / `saveToGallery` and the admin's
upload/rename/delete. This is the read layer; write auth stays in kol-media-admin.

**Where to see it:** `/sets/media-library` — both views side by side over one
injected client, plus `/sets/preview/media-library` for the full-bleed page.
Per-component pages at `/components/:slug`.

**Flagged, not decided:** whether the four consumer repos accept this injected-client
API is their sign-off, not the DS's. Nothing was changed in any of them.

14 gates clean · production build green.

---

## ✅ RESOLUTION — 2026-08-01

🟢 `closed`. **Shipped and published:** `@kolkrabbi/kol-component@0.19.0` +
`@kolkrabbi/kol-theme@0.18.0` (registry, 2026-08-01). That meets this repo's bar —
a shipped version cited, not a build that only exists locally.

**The API, as published:**

```jsx
import { MediaLibrary } from '@kolkrabbi/kol-component'
import { createMediaClient } from '@kolkrabbi/kol-media-client'

const client = createMediaClient()                    // or { adminBase, publicBase, proxyPath }

<MediaLibrary variant="page" client={client} />                       // the browse page
<MediaLibrary variant="modal" client={client} onSelect={fn} onClose={fn} />  // the picker
```

`MediaPicker` and `MediaBrowser` are kept as aliases so the fxr editor's `onPick`
naming and the existing page call sites keep working.

**What each fork replaces:**

| Repo | Fork to retire | Lines | Replace with |
|---|---|---|---|
| **kol-ds-fxr** | `src/editor/library/{mediaLibrary.js,MediaPicker.jsx,LibraryProvider.jsx}` | 750 | `MediaPicker` — and `createMediaClient({ proxyPath })` for `proxied()` |
| **kol-apps/kol-labs-single** | `src/lib/mediaLibrary.js` · `src/components/framework/MediaPicker.jsx` · `src/pages/library/LibraryPage.jsx` | 425 | both variants; **keep** its write paths (below) |
| **kol-apps/kol-client-kolkrabbi** | `src/pages/Library.jsx` | 145 | `variant="page"` — gains folders |
| **kol-website** | `apps/brand/src/pages/Library.jsx` | 147 | `variant="page"` — gains folders; kills the 433 flat tiles |

**The canvas-taint fix survives.** fxr's `proxied()` + `setMediaProxyBase()` are in
`createMediaClient({ proxyPath })` — the client rewrites CDN URLs to a same-origin
path, so a canvas that later calls `getImageData` is not tainted. Do not drop it
on migration; the proxy route itself stays consumer host config.

**Write paths are NOT in the component.** labs-single's `uploadToLibrary` /
`saveToGallery` have no equivalent here — this is the read layer. `uploadToLibrary`
does ship from `@kolkrabbi/kol-media-client`; `saveToGallery` was never ported and
admin write auth stays in kol-media-admin.

**Receipts returned:** `kol-website/lobby/outbox/MediaLibrary.md`. The other three
filing repos (kol-ds-fxr, kol-labs-single, kol-client-kolkrabbi) are **not in the
lobby registry** (`~/.dotfiles/docs/operations/systems/lobby/01-registry.md` — the
four are dotfiles, humpty, kol-website, kol-ds-ui), so there is nowhere to send a
receipt. The migration table above is the record for them.

**Still theirs to decide.** Nothing was changed in any consumer repo. Whether each
accepts the injected-client API is that repo's sign-off, not the DS's.
