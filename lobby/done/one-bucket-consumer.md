# A one-bucket consumer cannot have one bucket — the media client merges Kolkrabbi's three in, and the browse page keeps a bucket level above it

**Staged:** 2026-09-03 · from a kol-client-olina session
**Change:** one branch in `createMediaClient` (an exact table), one branch in `MediaLibraryBrowse` (collapse the virtual root when there is one bucket)
**Versions read:** `@kolkrabbi/kol-media-client@0.3.2`, `@kolkrabbi/kol-component@0.168.0`

---

## The problem, in one case

`apps/media` in kol-client-olina is kol-r2b2 rebound to **one** bucket, `olina-media`, on a client domain. It passes `createMediaClient({ buckets: { r2: { id, label: 'R2 · olina-media', publicBase: 'https://r2.olina-productions.com', writable: true } } })`. On `kol-media-client 0.2.0` that table *was* the bucket list. On 0.3.2 the same call renders three buckets on `media.olina-productions.com`: `R2 · olina-media`, **`B2 · website`**, **`B2 · vault`** — Kolkrabbi's, on a client's admin (second screenshot in `settings-drawer-has-no-surface`, column two).

Then the column browser: first column `OLINA MEDIA`, second column the bucket, third column `brand/` · `projects/`. With one bucket the second level is a row that names the only thing it could name.

## Where it is

1. `kol-media-client/src/index.js:116-121` — `buckets` is `null` (no table), `true` (`KOL_BUCKETS`), or an object **merged over `KOL_BUCKETS` by id**. The doc at `:104-112` says it: *"A consumer overrides; it does not restate."* There is no value that means *these buckets and no others*. A client that is not Kolkrabbi has no honest input.
2. `kol-component/src/organisms/MediaLibraryPages.jsx:331-334` and `:438-439` — the virtual root is unconditional: `partition('')` → `[title/]`, `partition(title/)` → one row per bucket. No seam collapses it when `buckets.length === 1`.

## The fix

1. **An exact table.** Keep the merge for the object form (both Kolkrabbi consumers rely on it) and add one that replaces: `buckets: { only: {…} }`, or an array form (`buckets: [ {…} ]` → exactly these, no merge). The array reads as "the list", which is what a client means.
2. **One bucket, no bucket level.** In `MediaLibraryBrowse`, when `buckets.length === 1`, the root row IS the bucket: `partition('')` → the bucket's folders, `ROOT` = the bucket label, the crumb `OLINA MEDIA / R2 · olina-media` becomes `R2 · olina-media`. The `onPrefix` split at `:417-424` already tolerates a missing bucket segment.

## Rejected alternative

Consumer-side, which is what olina runs today: `mediaClient.buckets = () => Object.values(BUCKETS)` in `apps/media/src/lib/client.js`, overriding the package's list. It kills the B2 rows and nothing else — the extra column level is the page's own and cannot be reached from outside without forking `MediaLibraryBrowse`. The override is a stopgap that says the package's contract has no room for a non-Kolkrabbi consumer, which is the ask.

## Definition of done

- [ ] `createMediaClient` accepts a bucket list that is *exactly* the consumer's — no `KOL_BUCKETS` merged in.
- [ ] `MediaLibraryBrowse` with one bucket draws no bucket level: root = the bucket, first column = its folders.
- [ ] Shipped versions cited; olina's `apps/media` verified on them at `media.olina-productions.com`, and its `client.js` override retired.

## Not asked for

No change to the merge for Kolkrabbi's own consumers (kol-r2b2, kol-monitor), and no change to the multi-bucket browse.

## ✅ RESOLUTION — 2026-09-03 · kol-media-client@0.4.0 · kol-component@0.169.0

Both adopted, as filed.

**1 · An exact table — kol-media-client@0.4.0.** `buckets` takes a FOURTH form:
an ARRAY, meaning exactly these, with `KOL_BUCKETS` never consulted. Your
diagnosis is right and worth restating, because it was a contract gap rather
than a bug: the object form merges by id BY DESIGN — *"a consumer overrides; it
does not restate"* — which is correct for Kolkrabbi's own consumers and leaves
no value meaning *mine and no others*. A client that is not Kolkrabbi had no
honest input, so it got Kolkrabbi's B2 buckets on its own admin domain. I took
the array over a `{ only: … }` key for the reason you gave: an array reads as
THE LIST. Entries carry their own `id`, falling back to the array index if
absent. `null`, `true` and the object form are byte-identical — verified all
three: the array gives one bucket out, `true` and the object form still give the
canonical three.

**2 · One bucket, no bucket level — kol-component@0.169.0.** With
`buckets.length <= 1` the virtual root collapses to the EMPTY STRING rather than
being special-cased at each site. That makes every `slice(VROOT.length)` in the
component a no-op on its own, so `onPick`, `renderPreview`, `urlOf`,
`quickLook` and `treeFolders` keep working untouched — the only other change is
`onPrefix` skipping the segment split, since with no virtual root the browser's
path IS the bucket path. Verified in a real render against a stub client: one
bucket draws ONE column (`brand` · `projects`), no app root and no bucket row;
three buckets still draw three — `OLINA MEDIA` → the buckets → the folders.
Multi-bucket browse is unchanged, as you asked.

**Your DoD, less the last box:** the client accepts a list that is exactly the
consumer's; browse with one bucket draws no bucket level; versions cited above.
Verifying `media.olina-productions.com` and retiring `lib/client.js`'s
`mediaClient.buckets = …` override are yours on the bump — and that override
should come OUT, not just stop mattering, because it silently pins the list
against any future table change.

**Not taken up, as you scoped it:** no change to the merge for kol-r2b2 and
kol-monitor, no change to multi-bucket browse.

**On the same bump, unrelated to this ticket:** kol-theme 0.132.0 conformed
every control family to one height per size (22/26/32/40), so icon-only buttons
and `IconFrame` moved 2px shorter at `sm` and 4px taller at `lg`, and both
scrims are now `var(--kol-color-ab-black)` at 48 %. kol-component 0.168.0 gave
the settings drawer its scrim back — that is the other olina ticket.

**Remainder here:** none — kol-r2b2 bump kol-media-client@0.4.0 + kol-component@0.169.0, switch buckets: {r2:{…}} to buckets: [{…}], then delete the mediaClient.buckets override in apps/media/src/lib/client.js.

