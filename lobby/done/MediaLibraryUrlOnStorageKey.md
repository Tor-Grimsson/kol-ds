# `MediaLibrary` + `kol-media-client` — build the public URL on `storageKey`, not `key`

**Staged:** 2026-10-13 · from a kol-website session (the D1 arc, `plans/2026-10-13-d1-arc.md`)
**Change:** `organisms/MediaLibrary.jsx` (every `mediaUrl(…key)` site) · `MediaLibraryPages.jsx:674, :695` · kol-media-client `mediaUrl`, kol-component 0.255.0 / kol-media-client 0.5.0

---

## What changed on the API

media.kolkrabbi.io's `/api/list` for the R2 bucket now lists from D1 (deployed 2026-10-13). Each row
keeps `key` = the file's PATH (`folder/name`, what the pages build their folders from) and adds
**`storageKey`** = the permanent R2 key the bytes live at. The object never moves: rename and move
edit the row, so `storageKey` is what a URL must be built on. New uploads live at `f/<id>.<ext>`;
objects that were in the bucket before keep their old key, so for them `storageKey === key` until
the first rename.

`uploadFile` / `rename` / `delete` / `download` keep speaking in PATHS — nothing changes there.

This is olina's contract (its media API has shipped it since 2026-09-21) — the DS pages never read
`storageKey`, so olina's `src/lib/client.js` carried the fix app-side. The estate is on one shape now.

## What breaks without it

In the explorer, open / copy-URL / preview of any renamed file or any new upload 404s: `mediaUrl(row.key)`
builds `r2.kolkrabbi.io/<path>` and nothing is at the path.

## Ask

- `MediaLibrary.jsx` — `mediaUrl(row.storageKey ?? row.fullKey ?? row.key)` at `:477`, `:501`, `:698`, `:787`,
  `:820`, `:973`, `:1084` (whatever the row/object variable is at each). `downloadUrl` stays on `key`
  (the API resolves the path).
- `MediaLibraryPages.jsx` — same at `:674` (Copy URL) and `:695`.
- Rows built from list objects keep `storageKey` through whatever mapping drops unknown fields.
- `kol-media-client` — `mediaUrl(keyOrObject, bucket)`: accept the row and prefer `storageKey`, or
  document that consumers pass `o.storageKey ?? o.key`. Either; say which.

## Nothing to decide

The fallback chain makes an API without `storageKey` behave exactly as today.

## ✅ RESOLUTION — 2026-10-13 · kol-component@0.257.0 + kol-media-client@0.6.0

Both `mediaUrl` wrappers (MediaLibrary's provider and MediaLibraryPages') resolve a PATH to its row's `storageKey` through a key → storageKey map built from the listed objects, so every site is covered in one place: thumbs, previews, posters, Copy URL, picks (more than the nine lines the ticket named; posters and copy-by-path pass paths too). The picker's Use builds on `file.storageKey ?? file.key`. `downloadUrl` stays on the path. kol-media-client: `mediaUrl` ACCEPTS THE ROW and prefers `storageKey`; a plain key string builds as before. Verified against the live API: 434/434 rows carry `storageKey`, the URLs return 200; a synthetic moved row {key:'a/b.jpg', storageKey:'f/1.jpg'} builds r2.kolkrabbi.io/f/1.jpg.

**Remainder here:** none — kol-website bump kol-component ^0.257.0 and kol-media-client ^0.6.0; pass rows to `mediaUrl` in app code.

