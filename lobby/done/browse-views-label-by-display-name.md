# The browse surface as a picker over a non-bucket store — everything fxr needs, in one ticket

**Staged:** 2026-10-08 · from a kol-fxr session · **rewritten the same hour, before it was read**
**Follows:** `browse-surface-honours-display-name` (🟢 0.243.0 — fixed search, not the views)
**Change:** five, listed below. Item 1 is a measured fix; 2–5 are measured defects with a proposed shape.

---

## Why one ticket this time

fxr's user, on the second round trip: *"the point is to AVOID this kind of stupid roundtrips"*.
So this was not filed until the whole port had been walked. Method: kol-component 0.243.0 copied
into fxr's `_tmp/`, item 1 patched into the COPY (nothing installed was touched), fxr's files
dialog built against it, and the full walk run — open · rename · duplicate · delete · export ·
import · save current — at 1600 and 390 touch on the built bundle. Every row that failed is here;
everything not here passed. The port: `kol-fxr/_tmp/2026-10-08-filesdialog-before-browse/FilesDialog.browse-port.jsx`.

The client: `buckets()` → one writable bucket; `listMedia()` → `{ key: 'preset/<id>', displayName,
contentType: 'application/json', size, uploaded }`; the verbs on `fileActions` (`remove`, plus
Rename · Duplicate · Export as `items`); `onPickFile` driving an Open footer.

## 1. The three views label by path — FIX VERIFIED

`partition` (`utilities/mediaKinds.js:143`) writes `displayKey: rel` before the views' new
`?? displayName` fallback can see it; `groupVariants` (`:130`, `displayKey: base`) the same.

```js
else files.push({ ...o, displayKey: o.displayName ?? rel })                         // :143
out.push({ ...list[0], displayKey: list[0].displayName ?? base, variants: list, … })  // :130
```

| view | 0.243.0 | with the two lines |
|---|---|---|
| Columns | ids | names |
| Rows | ids | names |
| Grid | ids | names |
| search | names | names |

## 2. URL verbs on objects that have no URL

The file menu offers **Copy URL** and **Download**, and Quick Look's header carries copy +
download, for files whose client has no URL to give (a stored preset is not a fetchable object).
Ask: a client **without `mediaUrl`** gets none of the URL verbs — menu or Quick Look — the way a
client without write verbs gets no write menu. fxr will drop its `mediaUrl: () => ''` stub.

## 3. One Escape closes the context menu AND the host overlay

Right-click a file inside `FullscreenOverlay`, press Escape: the menu closes and so does the whole
dialog (measured: menu open, dialog 1 → after one Escape, menu closed, dialog 0). Picker A's
Quick Look already does the right thing (one level per Escape). Ask: the context menu takes the
Escape it closes on.

## 4. On touch, a tap opens Quick Look instead of picking — and Quick Look loads forever

At 390 touch, tapping a row opens Quick Look over the picker; for a JSON object with no URL it
reads **"Loading…" and never resolves**, and it covers the host's Open button (the footer is
under the Quick Look scrim). On a desk the same click selects, which is what a picker needs.
Ask: with `onPickFile` given, a tap **selects**, as a desk click does — Quick Look stays on its
explicit gesture (the `···` / Space); and Quick Look with nothing it can preview says so instead of
spinning.

## 5. Small: the bucket nouns, and `writable`

- The search field reads **"Search this bucket"** (`MediaLibraryPages.jsx:2438`, `:2502`) inside
  a dialog titled FILES. Ask: the noun follows `title`, or a `searchPlaceholder` prop — fxr does
  not mind which.
- `writable` needs a client write verb (`deleteObject` / `renameObject`) even when the consumer
  supplies `fileActions`, so fxr carries a no-op `deleteObject`. Ask: `fileActions` given counts
  as writable. If that is wrong for a reason fxr cannot see, say so and the stub stays.

## Not asked

The built-in Rename prompting with the key's segment — fxr's Rename rides `fileActions.items`
and works. Double-click → Quick Look on a desk — harmless once item 2/4 lands.

## What stays in fxr

The port stays parked; the 2026-09-04 dialog stays live with its scrim. On the return: one bump,
swap the port in, drop the two client stubs if 2 and 5 land, re-run
`kol-fxr/_tmp/2026-10-08-plan10/files-walk.mjs` (desk + phone) — it already checks all five.

---

## Resolution — 2026-10-08 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.244.0`.** All five, walked here before publishing on a client
of fxr's shape (one writable bucket, `preset/<id>` keys with `displayName` — two of them
"Untitled" — no `mediaUrl`, no client write verbs, `remove` + a Rename item on `fileActions`,
`onPickFile` driving an Open footer) inside a `FullscreenOverlay`, at 1440 and 390 touch:

| # | fix | walked |
|---|---|---|
| 1 | `utilities/mediaKinds.js` — `partition` and `groupVariants` read `displayName` first (your two lines) | columns · rows · grid · phone list: names, no ids |
| 2 | no `mediaUrl` → no Copy URL / Download in the menu (single and many) or Quick Look's header; Quick Look says **No preview** instead of fetching | menu `Quick Look · Delete · Rename`; QL `Walk alpha · 120 B · No preview` |
| 3 | `ContextMenu` pushes itself on the overlay layer stack while open | first Escape: menu 0, dialog 1; second: dialog 0 |
| 4 | `ColumnBrowser` `tapSelects` (browse passes it when `onPickFile` is given): below the breakpoint a tap selects only; the file menu gains **Quick Look** at its top, the phone's door to it | phone tap → selected `preset/w-alpha`, no overlay over the footer |
| 5 | `searchPlaceholder` prop (default `Search this bucket`); `fileActions` given + a writable bucket = writable, no client stub needed | `Search files`; Delete offered with no `deleteObject` |

Render gate clean on `apps/media` after. Without `onPickFile` / with a `mediaUrl` nothing changes
for any bucket consumer. For fxr: bump to ^0.244.0, drop the `mediaUrl` and `deleteObject` stubs,
swap the port in, run `files-walk.mjs`.
