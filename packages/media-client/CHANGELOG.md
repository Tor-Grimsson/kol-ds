# @kolkrabbi/kol-media-client

## 0.1.0

### Minor Changes

- c750436: New package: read-only client for the kol-media CDN — `listMedia` / `mediaUrl` / `proxied` (canvas-safe) / type guards / `formatSize`, plus the optional `uploadToLibrary` proxy helper. Consolidates the byte-identical `mediaLibrary.js` copies from kol-labs-single and kol-design-editor. Plain ESM, no React; `createMediaClient({ adminBase, publicBase })` factory with production defaults. First of the **clients tier** (headless service SDKs — one package per service contract).
