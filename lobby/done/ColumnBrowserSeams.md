# ColumnBrowserSeams — three seams the browse page needs so kol-r2b2 keeps no CSS

**Staged:** 2026-08-27 · from **kol-r2b2** `src/App.jsx` + `src/index.css` (the residue after `MediaLibraryPages` and `ColumnBrowserChromeCorrections` both landed)
**Change:** kol-component `ColumnBrowser` + `MediaLibrary` pages — an autofocus seam, a stats seam, and real row state classes

Three stopgaps are all that stand between kol-r2b2 and an override-free stylesheet. Each is small; the third is the one that matters.

## 1. `autoFocus` — the arrow keys are dead until you click

`ColumnBrowser` is `tabIndex={0}` and focuses itself on a row click, but nothing focuses it on mount, so a fresh load ignores ↑/↓/←/→ until the user clicks a row. The retired `FileList` focused it from the consumer; `MediaLibraryBrowse` does not.

**Ask:** `autoFocus` (default `false`) on `ColumnBrowser`, forwarded by the browse page. kol-r2b2 currently does this from a wrapper:

```js
requestAnimationFrame(() => root.querySelector('[tabindex="0"]')?.focus())
```

re-run on bucket change. Reaching into the organism's DOM from outside is the tell that the seam is missing.

## 2. `stats={false}` — a stacked pair prints the count twice

kol-r2b2 renders `variant="browse"` above `variant="library" header={false}` on one page (its one-view ruling). Both pages render their own stats line, so the file count appears twice, one line under the other — the user's words: *"it used to be a row"*.

**Ask:** `stats` (default `true`) on the library page, exactly parallel to the `header` prop it already has. Today the consumer hides it with `.r2b2-library > p { display: none }`, which depends on that `<p>` staying the page root's only bare `<p>` child.

## 3. Row state classes — the brittle one

`ColumnBrowserChromeCorrections` (0.118.3) shipped the Finder look, and kol-r2b2 still carries a block on top of it because **the row exposes no semantic state class**. The only hook for "this row is selected" is the Tailwind fill the row happens to wear:

```css
.kol-column-browser-row.bg-fg-04 { … }
```

A restyle that changes that utility silently breaks every rule hanging off it — and silent is the operative word: the selector still parses, matches nothing, and neither lint nor the build notices. That failure has already happened twice in this consumer (0.113.0's inner scroll row, then the retirement of the class `FileList` was attaching).

**Ask:** `is-selected` and `is-cursor` on `.kol-column-browser-row`, beside the existing utilities. Nothing needs to change visually.

### And the rule worth taking with it

With state classes in place, this becomes expressible in the theme, and it is the correct behaviour rather than a preference — with a file picked, a positional selector lights both the folder column and the file column:

```css
.kol-column-browser-column:not(:has(~ .kol-column-browser-column .is-selected)) > .is-selected { /* full strength */ }
.is-selected { /* half strength — the trail you came through */ }
```

Read: *the selected row in the last column that actually holds a selection is the only one at full strength; every ancestor dims.* The user's ruling: **"ONLY one selected state can exist, not TWO"**. Positional selectors cannot say it; `:has(~ …)` can.

## Recreation notes

(1) and (2) are prop plumbing. (3) is two class names plus, if you want it, the two rules above in `kol-components-molecules.css`. On return kol-r2b2 deletes its whole override block and `src/index.css` is the imports, the body anchor and one media-checkbox rule.

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-component 0.119.0** + **kol-theme 0.81.0**:

1. `ColumnBrowser autoFocus` (default `false`) — focuses the root on mount and again on `prefix` change, so a bucket switch from the header (which takes focus) hands the keyboard back; `MediaLibraryBrowse` forwards it.
2. `MediaLibraryLibrary stats` (default `true`), beside `header`.
3. `is-selected` / `is-cursor` on `.kol-column-browser-row` — and the fill MOVED into the theme keyed on them (a theme rule cannot outrank a `bg-fg-04` utility, so taking the rule meant taking the fill): hover and cursor fg-04; a selected row fg-02, the trail; `.kol-column-browser-column:not(:has(~ .kol-column-browser-column .is-selected)) > .is-selected` fg-04 — the one selected state. Values are the organism's own two stops; r2b2's Finder pill, accent and no-dividers block are its later local rulings, not filed here.

Verified in source + showcase build only. Remainder in kol-r2b2: bump both, delete the override block — `src/index.css` is the imports, the body anchor and the media-checkbox rule.
