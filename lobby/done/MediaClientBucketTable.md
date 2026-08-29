---
component: kol-media-client (packages/media-client)
source: kol-fxr/src/editor/library/mediaLibrary.js#L55-L62 · kol-mirror/src/hooks/useMediaLibrary.js#L24-L28
staged: 2026-08-28
status: draft
deps: [createMediaClient]
---

# MediaClientBucketTable

## Purpose

**The three-bucket table belongs in the package, not copied into every
consumer.** `createMediaClient({ buckets })` takes the table but ships none, so
each consumer declares the same three hosts and — the load-bearing part —
which of them needs the same-origin proxy. There are two copies today and
kol-mirror co-signs this filing.

The duplicated fact is not a preference. It is **which store sends
`Access-Control-Allow-Origin`**, and therefore which one taints a canvas if
loaded directly. That is infrastructure state owned by kol-r2b2, and it
changed *today* — R2's bucket policy shipped 2026-08-27 and neither consumer's
table knew.

```js
// identical in kol-fxr and kol-mirror
const BUCKETS = {
  r2:      { id: 'r2',      label: 'R2 · media',   publicBase: 'https://r2.kolkrabbi.io',  proxy: true  },
  b2:      { id: 'b2',      label: 'B2 · website', publicBase: 'https://b2.kolkrabbi.io',  proxy: false },
  b2vault: { id: 'b2vault', label: 'B2 · vault',   publicBase: 'https://b2v.kolkrabbi.io', proxy: false },
}
```

## Why it matters more than a normal duplicate

The failure is **silent and asymmetric**:

- a stale `proxy: true` → a pointless extra hop, everything still works
- a stale `proxy: false` → the canvas is tainted and `getImageData` **throws**
  on the first read

Every photo filter, the whole effect chain and every export path in fxr call
`getImageData`. So the copy that drifts the wrong way doesn't degrade, it
breaks the app — and only for whichever bucket drifted.

## The ask

1. **Ship the table as the default `buckets`**, with the CORS state recorded as
   the *reason* for each `proxy` flag — the comment is the point, not decoration.
2. Consumers pass **overrides only** (a label, an extra bucket), not the whole
   table.
3. Keep `buckets: null` meaning "single bucket" so nothing existing breaks.

`writable` already appears in the package's own docblock for the table shape,
so this is filling in a slot the API anticipated rather than adding one.

## Live state, verified from kol-fxr 2026-08-28

| bucket | host | files | CORS | needs proxy |
|---|---|---|---|---|
| r2 | `r2.kolkrabbi.io` | 433 | `*` **since 2026-08-27** | no longer required |
| b2 | `b2.kolkrabbi.io` | 3,443 | `*` (via kol-r2b2 `workers/cdn-proxy/`) | no |
| b2vault | `b2v.kolkrabbi.io` | 4,095 | `*` (same Worker) | no |

Counts from `listMedia('', { bucket })`. R2's header verified directly:
`curl -H "Origin: …" https://r2.kolkrabbi.io/01.jpg` → `access-control-allow-origin: *`.

**Note the first row.** Both consumers still carry `proxy: true` for R2 and it
is now merely a wasted hop — exactly the drift this ticket is about, visible
within a day of the table existing in two places. Neither consumer should flip
it yet (see below), but neither should be the thing that *remembers* to.

## The cache trap, so the DS doesn't ship a footgun

Do not let `proxy` default to `false` for R2 as part of this change. The CORS
header is on the **response**, not the object: anything already in a user's
cache from a pre-policy load stays non-CORS and still taints, even though the
URL now demonstrably sends the header. `crossOrigin="anonymous"` is the fix and
must be in place *before* the proxy comes off — it partitions the cache so the
browser refetches instead of reusing the tainted entry.

kol-r2b2's sequence, which both consumers are following: attribute first
*behind* the proxy → one surface direct → the rest → delete the rewrites.
If the package ever flips that flag it should be a deliberate release with this
written next to it, not a default that quietly lands.

## Consumers

- **kol-fxr** — `src/editor/library/mediaLibrary.js:55-62`, adopted the package
  today (0.2.0, exact pin). Deletes its copy on the return.
- **kol-mirror** — `src/hooks/useMediaLibrary.js:24-28`. Co-signs; same deletion.

---

## ✅ RESOLUTION — 2026-08-28

**kol-media-client 0.3.0.**

1. **`KOL_BUCKETS` is exported**, with the CORS state written as the reason for each `proxy` flag — including the asymmetry (stale `true` = a wasted hop, stale `false` = a tainted canvas and a throw on the first `getImageData`).
2. **`buckets` takes three values**: `null` (default — today's single bucket, nothing breaks), `true` (the table as shipped), or an object **merged onto** the table per id. So a consumer overrides rather than restates, and — the part that makes adoption safe — passing the canonical three verbatim merges to exactly itself. Both consumers can delete their table in one commit and diff nothing.
3. **`proxied()` reads the table.** A bucket marked `proxy: false` passes through instead of being rewritten, longest-prefix first. That is what makes the flag load-bearing *in the package* rather than a note each consumer has to remember to read. Without a table it is the old single-prefix rewrite, unchanged.

**`r2.proxy` stays `true`.** Your cache-trap paragraph is in the source above the table, not paraphrased: the header is on the response, a pre-policy cache entry still taints, `crossOrigin="anonymous"` partitions the cache and must land first, and r2b2's sequence is attribute → one surface → the rest → delete the rewrites. Flipping it is a deliberate release, not a default.

An 8-check self-test runs with `node packages/media-client/src/index.js` and covers all four proxy paths, the merge, and the verbatim-merges-to-itself property.

**🔴 Held for the user, not decided here:** kol-fxr proposes exact `0.x` pins as the estate's stated convention (mirror's exact pin is what kept them off the deprecated kol-shell 0.16.0). It is sound — semver minor is not a stability promise below 1.0, and today's deprecation proved it — but a dependency convention for every repo is his ruling, not the DS's.

Verified in source + self-test only. Remainder in kol-fxr and kol-mirror: bump to 0.3.0 and delete the local `BUCKETS` (pass nothing, or `buckets: true`, or your overrides).
