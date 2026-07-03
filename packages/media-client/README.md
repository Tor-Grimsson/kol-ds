# @kolkrabbi/kol-media-client

Read-only client for the **kol-media CDN** (the bucket kol-media-admin manages). Plain ESM, no React, no build step — works in any modern toolchain (not Vite-bound; this package uses no `import.meta.glob`).

```js
import { listMedia, mediaUrl, isImageType, formatSize } from '@kolkrabbi/kol-media-client'

const objs = await listMedia('photoshoot/')   // [{ key, contentType, size }, …]
const src = mediaUrl(objs[0].key)             // https://media.kolkrabbi.io/<key>
```

## The contract

Owned by **kol-media-admin** — this package is the typed SDK for it; its version bumps when the API shape changes.

```
GET <adminBase>/api/list?prefix=<folder>  →  { objects: [{ key, contentType, size }] }
public bytes:  <publicBase>/<key>
```

## Exports

| export | what |
|---|---|
| `listMedia(prefix?, { signal })` | list bucket objects; throws on non-OK |
| `mediaUrl(key)` | public URL for a key |
| `proxied(url)` | rewrite a CDN URL to the same-origin `/media/` proxy path (canvas safety, see below) |
| `isImageType(ct)` / `isVideoType(ct)` | content-type guards |
| `formatSize(bytes)` | bytes → human string |
| `createMediaClient({ adminBase, publicBase, proxyPath })` | factory bound to other hosts; the bare exports above come from the default (production) instance |
| `uploadToLibrary(blob, key, { proxyPath })` | optional write helper — requires a consumer-side proxy, see below |

## Canvas consumers

The CDN sends **no CORS headers** — a cross-origin `drawImage` taints the canvas. Load through `proxied(url)` and give your host a same-origin `/media/*` rewrite to the CDN (Vite `server.proxy` in dev, a rewrite rule in prod). The rewrite is consumer config, not this package's job.

## Uploads

`uploadToLibrary` POSTs to a **relative** consumer-side proxy (default `/api/library/upload`) that holds `ADMIN_PASSWORD` server-side and forwards to the bucket. The client prompts for the password once per tab (sessionStorage; a 401 re-prompts). If your app doesn't run such a proxy, don't import it.

## Not this package

kol-media-admin's authenticated **write** API (upload / rename / delete, Basic Auth) is a different client and stays in the admin app. Never embed write auth in a browser-shipped package.
