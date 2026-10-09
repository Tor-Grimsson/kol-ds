# @kolkrabbi/kol-media-client

## 0.5.0 — 2026-10-09

- **New: `prepareUpload(file, { folder, optimise, keepOriginals })`** — kol-client-olina's upload recipe, lifted (kol-website was the second consumer). One file → `[{ key, blob, thumb? }]` to put: the web copy (≤2560 wide, ≤500 KB) and, with `keepOriginals`, the untouched file at `original/<name>`. Pure — the consumer puts. A transparent still keeps its alpha (WebP), never JPEG on white; any still already web-sized is left as it is; one still over 500 KB at quality 0.4 steps its width down. Video / SVG / GIF / undecodable pass through; a video carries a 96px `thumb`.
- **New: `isOptimisable(file)`** (ask only when a drop holds one), `cleanName(name)`, `videoThumb(file)`.

## 0.4.1 — 2026-10-06

- **`adminBase` defaults to `https://media.kolkrabbi.io`** (media-client-admin-base-is-media, kol-website). The media app has one hostname; `admin.` only redirects and is retiring. Consumers on the default reached the API through a 301; bump and they reach it directly.

## 0.4.0 — 2026-09-03

- **`buckets` takes an ARRAY meaning exactly these** (one-bucket-consumer,
  kol-client-olina). The object form MERGES over `KOL_BUCKETS` by id — by
  design, so a Kolkrabbi consumer overrides rather than restates — but that left
  no value meaning *mine and no others*. A client passing its single bucket got
  Kolkrabbi's `B2 · website` and `B2 · vault` rendered on its own admin domain.
  An array is now the whole list, with `KOL_BUCKETS` never consulted; entries
  carry their own `id`, falling back to the array index. `null`, `true` and the
  object form are untouched.

## 0.1.0

### Minor Changes

- c750436: New package: read-only client for the kol-media CDN — `listMedia` / `mediaUrl` / `proxied` (canvas-safe) / type guards / `formatSize`, plus the optional `uploadToLibrary` proxy helper. Consolidates the byte-identical `mediaLibrary.js` copies from kol-labs-single and kol-design-editor. Plain ESM, no React; `createMediaClient({ adminBase, publicBase })` factory with production defaults. First of the **clients tier** (headless service SDKs — one package per service contract).
