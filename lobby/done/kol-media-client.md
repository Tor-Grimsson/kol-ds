---
package: "@kolkrabbi/kol-media-client"
kind: shared-client        # NOT a visual component — a data/API client package. Lives here because the lobby is the DS work queue; recreate as a package, not under components/.
source: kol-labs-single/src/lib/mediaLibrary.js + kol-design-editor/src/editor/library/mediaLibrary.js
date: 2026-07-03
status: recreated
---

# @kolkrabbi/kol-media-client

> Handoff note, not a component spec. This is the read-only API client for the
> `kol-media` CDN (the bucket kol-media-admin manages). Two consumers each rolled
> their own near-identical copy; this brief consolidates them into one DS-published
> package. Build it as a package under `packages/`, **not** as a component.

## Why it belongs in the DS
Two live consumers hand-rolled the same client:
- `kol-labs-single/src/lib/mediaLibrary.js`
- `kol-design-editor/src/editor/library/mediaLibrary.js`

The core (`listMedia` / `mediaUrl` / type guards) is byte-identical between them; each adds one app-specific extra. That's exactly the duplication to kill. The DS is the one dependency channel all consumers already trace back to — design-editor installs `@kolkrabbi/*` packages; labs + kol-media-admin vendor the DS inline. So the client ships from here and reaches each consumer the same way the rest of the DS does.

**Contract ownership stays in kol-media-admin** — it defines `/api/list`. This package is just the typed SDK for that contract; bump its version when the API shape changes.

## Proposed placement
New package `packages/media-client/` → publishes as `@kolkrabbi/kol-media-client`, sibling to `component` / `framework` / `loader` / `theme`.

- `kol-loader` was considered and rejected — it's an SVG icon/graphics loader, wrong domain.
- No React, no JSX — plain ESM. Framework-agnostic; the pickers (MediaCard/MediaRow, separately lobbied) consume its output.

## The contract it wraps
```
GET https://admin.kolkrabbi.io/api/list?prefix=<folder>
  → { objects: [ { key, contentType, size }, … ] }        // fields both consumers read
Public bytes: https://media.kolkrabbi.io/<key>
```
Base URLs are currently hardcoded in both copies. **Make them configurable** (factory/options with these as defaults) so the package isn't welded to prod hosts — e.g. `createMediaClient({ adminBase, publicBase })`.

## Exports

### Shared core (both consumers, identical — the must-have)
| export | signature | notes |
|--------|-----------|-------|
| `listMedia` | `(prefix = '', { signal }) => Promise<Object[]>` | fetches `/api/list?prefix=`, returns `data.objects ?? []`; throws on non-OK |
| `mediaUrl` | `(key) => string` | `${publicBase}/${key}` |
| `isImageType` | `(ct) => boolean` | `ct?.startsWith('image/')` |
| `isVideoType` | `(ct) => boolean` | `ct?.startsWith('video/')` |

### Consumer-specific (fold in as opt-in helpers, not required core)
| export | from | notes |
|--------|------|-------|
| `proxied` | design-editor | `(url) => url.replace(/^https:\/\/media\.kolkrabbi\.io\//, '/media/')` — rewrites CDN URL to a same-origin `/media/` proxy path so canvas consumers aren't CORS-tainted. Harmless for labs; safe to ship in core. The `/media/` proxy itself is consumer host config (vite/vercel rewrite), NOT this package's job. |
| `uploadToLibrary` | labs | `(blob, key) => Promise` — POSTs to a **relative** `/api/library/upload` (a consumer-side server proxy that holds `ADMIN_PASSWORD`), sends `x-admin-password` header, prompts + caches the password in `sessionStorage`. Client-side is shareable; the server proxy stays per-consumer. Keep out of core or gate behind an explicit import. |
| `saveToGallery` | labs | dev-only local `/api/gallery/save` — **labs-specific, do not port.** |
| `formatSize` | labs | generic bytes→human util. Include or leave to a general util package; low stakes. |

## Divergences to reconcile
- **labs = read + write** (list + `uploadToLibrary` + `saveToGallery`), no `proxied()`.
- **design-editor = read-only** (list + `proxied()` for canvas-safe loads), no upload.
- Union works: ship core + `proxied` + optional `uploadToLibrary`; each consumer imports what it needs. Nobody loses a feature.

## Migration per consumer
- **kol-design-editor** — `npm install @kolkrabbi/kol-media-client`, delete `src/editor/library/mediaLibrary.js`, re-point imports.
- **kol-labs-single** — vendors the DS inline; vendor a copy of the client the same way, delete its `src/lib/mediaLibrary.js` write-half duplication (keep the labs-only `saveToGallery` locally).
- **kol-media-admin** — does NOT use this client (see below) but vendors the DS; if it ever needs read access it vendors a copy too.

## Do NOT conflate
`kol-media-admin/src/lib/api.js` is a **different** client — the admin's authenticated **write** API (upload / rename / delete / list with Basic Auth + the `moveKey` helper). This package is the **public read-only** client. Keep them separate; don't merge admin write-auth into a package consumers embed in the browser.

## Open decisions (for whoever builds it)
1. Factory (`createMediaClient({adminBase, publicBase})`) vs. bare functions + a `configure()` call. Factory is cleaner for the configurable-base-URL requirement.
2. Ship `uploadToLibrary` in this package (needs each consumer to run the server proxy) or leave upload entirely consumer-side. Lean: ship the client fn, document the required proxy.
3. Whether `formatSize` lives here or in a general util package.
