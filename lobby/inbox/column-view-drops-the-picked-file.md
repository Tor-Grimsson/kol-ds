# Column view forgets the picked file when you switch views

**Staged:** 2026-09-25 · from a kol-client-olina session
**Change:** `ColumnBrowser` takes a controlled `picked`; `MediaLibraryPages` passes `pickedFile` into it

---

## The problem, in one case

kol-component 0.220.0, `apps/media`. Pick a file in rows: the preview pane shows it. Switch to grid:
still shown. Switch to columns: nothing is picked and the preview is gone. The user: *"why does
preview not remain on when you switch between modes? it remains between row and grid but not
column?"*

## Why

Rows and grid read the page's `pickedFile` (`MediaLibraryPages.jsx:882`). `ColumnBrowser` keeps its
own `const [picked, setPicked] = useState(null)` (`ColumnBrowser.jsx:547`) and only reports out
through `onPick`. The page never hands `pickedFile` back in, so every switch to columns mounts a
fresh browser with nothing picked. Columns → rows works only because `onPick` already wrote the
page's state.

## The fix

A controlled `picked` prop on `ColumnBrowser` (a key or object; absent = today's internal state), and
`MediaLibraryPages` passes `pickedFile` (re-rooted to the virtual path) into it. Opening columns with
a pick lands the browser on that file's level with the row selected and the preview showing, the
way a pick in columns already does.

## Definition of done

- [ ] Pick a file in rows or grid, switch to columns: the same file is selected and previewed.
- [ ] Pick in columns, switch to rows or grid and back: still picked.
- [ ] `ColumnBrowser` with no `picked` prop behaves exactly as now.

## ADDRESSED — 2026-09-25 · kol-component@0.221.0

`ColumnBrowser` takes a controlled `picked` (a key or an object; absent = internal, exactly as before). Given, the browser opens on that file's level — calling `onPrefix` when the file sits deeper than the current prefix — with its row selected, previewed, and the keyboard cursor seeded on it. `MediaLibraryPages` passes `pickedFile`, re-rooted to the virtual path.

Proved live in `apps/media` (multi-bucket, so virtual paths): rows → columns and grid → columns keep the file; a file picked inside an expanded subfolder in rows lands columns on that folder; ↑ from the carried pick moves to the file above; clicking a folder clears the pick.
