# The three browse views still label files by path — 0.243.0 fixed search only

**Staged:** 2026-10-08 · from a kol-fxr session
**Follows:** `browse-surface-honours-display-name` (🟢 closed as kol-component 0.243.0)
**Change:** `partition` (and `groupVariants`) in `utilities/mediaKinds.js` keep `o.displayName`

---

## The problem, measured

kol-component 0.243.0, fxr's files dialog on `MediaLibrary variant="browse"`, built bundle at
1600. Two objects, keys `preset/w-alpha` and `preset/w-beta`, each with `displayName`
(*Walk alpha*, *Walk beta*):

| view | shows the name | shows the id |
|---|---|---|
| Columns | no | yes |
| Rows | no | yes |
| Grid | no | yes |
| search | yes | — |

## Why

0.243.0 taught the readers to fall back — `o.displayKey ?? o.displayName ?? …` — but the views
are fed by `partition` (`utilities/mediaKinds.js:143`), which sets `displayKey: rel` first, so
the fallback never reaches `displayName`. `groupVariants` (`:130`, `displayKey: base`) has the
same shape.

## The ask

`partition` and `groupVariants` write `displayKey: o.displayName ?? rel` (resp. `?? base`), the
rule the other four derivations got in 0.243.0.

## What stays in fxr

The port is parked again (`_tmp/2026-10-08-filesdialog-before-browse/FilesDialog.browse-port.jsx`,
`displayName` on every object); the 2026-09-04 dialog is live. On the return: bump, swap, walk.
