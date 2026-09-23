# The media root can show the bucket level with one bucket

**Staged:** 2026-09-23 · from a kol-client-olina session
**Change:** one opt-in prop on the media pages; absent means today's behaviour

---

## The problem, in one case

`apps/media` (media.olina-productions.com) has one bucket. On kol-component 0.217.0 its column
view opens straight onto the bucket's folders (`brand`, `projects`), and the root count line reads
`1 buckets · 0 files · 0 B` above folders with no bucket in sight. The user wants what the DS
fixture shows: column 0 is the title, column 1 is the bucket (`R2 · olina-media`), then its folders.
One place to stand at the top, the same picture as every multi-bucket consumer.

That level was removed for single-bucket consumers on this repo's own ask (one-bucket-consumer,
2026-09-03), and it is hard-coded: `MediaLibraryPages.jsx:1398`
`const single = buckets.length <= 1` → `VROOT = ''`. A consumer cannot turn it back on without
faking a second bucket.

## The fix

Make it a prop. Don't flip the default.

- `bucketLevel` on `MediaLibraryBrowse` (and through `MediaLibraryExplorer`): `true` keeps the
  virtual root — title → bucket → folders — even with one bucket. Absent, `single` is what it is
  today, so no other one-bucket consumer changes.
- With one bucket the header dropdown can stay hidden (`LibraryHeader`, `:719`); the bucket row in
  column 1 is the only bucket control needed.

## Rejected alternative

**Reverting the 09-03 collapse for everyone.** Other one-bucket consumers asked for or live with
the collapse; the ask is to reach the level, not to force it.

## Definition of done

- [ ] `bucketLevel` with one bucket: column 0 = title, column 1 = the bucket row, then its folders; crumbs and the root count line match a multi-bucket consumer.
- [ ] Without it, a one-bucket consumer renders exactly as on 0.217.0.
- [ ] Drop, move and the menu verbs still hand the consumer bucket-relative paths (the `unroot` seams).

## ADDRESSED — 2026-09-23 · kol-component@0.218.0

`bucketLevel` (default `false`) on `MediaLibraryBrowse`, reaching `MediaLibraryExplorer` through its prop spread. `true` keeps the virtual root with one bucket: column 0 the title, column 1 the bucket row, then its folders — the same `VROOT`/`unroot` path multi-bucket consumers take, so drop, move and menu verbs still get bucket-relative paths. The header dropdown stays hidden with one bucket. Absent, `single` is what it was on 0.217.0. 27 gates clean; not proved live in `apps/media`.
