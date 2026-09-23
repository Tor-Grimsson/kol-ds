# The count line's grey tail totals the folder you are in, recursively

**Staged:** 2026-09-23 · from a kol-client-olina session
**Change:** one line in `MediaLibraryPages.jsx`'s count line

---

## The problem, in one case

`apps/media`, at `projects/` (28 project folders, no loose files): the count line reads
`28 folders · 0 files · 0 B`. There is no way in the product to learn how big `projects/` is. The
grey tail that would answer it, `· bucket: 303 files · 605.7 MB`, only renders at the bucket root
(`MediaLibraryPages.jsx:1924`, `!prefix && …`), and there it totals the whole bucket.

The user, verbatim: *"the calc should recursivly show the entire size at least? … you can use the
grey version to show the summary right? how else am I gonna get the total size of projects?"*

## The fix

Keep the bright part as it is (what sits directly in this level). Make the grey tail the recursive
total of the **current folder** at every level:

- At a folder: `28 folders · 0 files · 0 B  ·  in projects: 280 files · 540.1 MB`, counting every
  file under the prefix.
- At the root: unchanged, `· bucket: 303 files · 605.7 MB`.
- Hidden when it would repeat the bright part (a level with no subfolders), the same way the root
  tail hides when `rawFiles.length === bucketFiles`.

The page already has the whole listing (`bucketFiles` / `bucketBytes` are summed from it), so this
is a prefix filter on the same sum and no fetch.

## Definition of done

- [ ] At any folder with subfolders, the grey tail shows that folder's recursive file count and size.
- [ ] At the root, it reads as on 0.217.0.
- [ ] A leaf folder shows no tail.

## ADDRESSED — 2026-09-23 · kol-component@0.218.0

Below the root the count line's grey tail is the current folder's recursive total — `· in projects: N files · size`, every file under the prefix (system files included, as the root's `bucket:` tail counts them). Hidden when it would repeat the bright part (a leaf). Root unchanged. One line in `MediaLibraryPages.jsx`; 27 gates clean; not proved live in `apps/media`.
