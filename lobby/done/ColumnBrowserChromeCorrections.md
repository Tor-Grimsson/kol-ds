# ColumnBrowserChromeCorrections — four rulings on the organism's own chrome

**Staged:** 2026-08-27 · from **kol-r2b2** `src/index.css` (user rulings 2026-08-27, live on `admin.kolkrabbi.io` since)
**Change:** kol-component `ColumnBrowser` + kol-theme — the last column's edge, the single-row column's hairline, one ink for rows, the grab pill

These four were described to the kol-website session while `MediaLibraryPages` was being written and were expected to ride along; 0.118.1 does not carry them (`ColumnBrowser.jsx:386` still `last ? '' : 'border-r'`, `:405` still `muted`, the theme still washes the strip). Filing them properly. They have been overridden in kol-r2b2 all day, so the values below are measured, not proposed.

## 1. Every column keeps its right edge

`:386` — `${last ? '' : 'border-r'}`. When the columns do not fill the box the browser reads as an open-sided container: the rows stop, the frame's border is far to the right, nothing closes the last column. Finder closes it. Ruling: every column carries `border-right: 1px solid var(--kol-oq-08)`, the last one included.

## 2. A single-row column loses its hairline

Row is `border-b last:border-b-0`. A column holding ONE row is also the last row, so it renders with no hairline while every neighbouring column shows one under its first row — it reads as a missing border, not as a clean tail. In kol-r2b2 the virtual root column always holds exactly one row, so it is permanent there. Ruling: a column's last row keeps its bottom hairline when it is the column's ONLY row. (kol-r2b2 scopes it to the first column; the general rule is `:only-child`.)

## 3. One ink for folders and files

`:405` — `muted={shown?.key !== o.key}` paints every unselected file `text-fg-48` while folders sit at `text-fg-default`. A column then reads as two classes of thing, and the dimming says "file" rather than "unselected". Selection is already carried by the `bg-fg-04` fill. Ruling: one ink for both; the fill alone marks selection. (User: *"why is folder full opacity but not files?"*)

## 4. The grab edge is a pill, not a wash

`.kol-column-browser-resize-x/-y` wash `fg-08` across the whole 8px strip on hover. The estate already has a ruled resize affordance — the framework's SideNav edge, `.kol-sidenav-grab` — and this should be the same thing. User: *"dont show me this way to grab"*, then *"like in the sidenav"*, then *"MIDDLE smack middle"*, then *"more smooth animation longer in and out"*.

Ruling, as it now runs here:

```css
/* no wash on hover or while dragging */
.kol-column-browser-resize-x:hover, .kol-column-browser-resize-x.is-dragging,
.kol-column-browser-resize-y:hover, .kol-column-browser-resize-y.is-dragging { background-color: transparent; }

.kol-column-browser-resize-x::before, .kol-column-browser-resize-y::before {
  content: ''; position: absolute;
  top: 50%; left: 50%; translate: -50% -50%;   /* dead centre — pointer-following was built and rejected */
  border-radius: var(--kol-radius-full);
  background: var(--kol-fg-64);
  opacity: 0;
  transition: opacity 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.kol-column-browser-resize-x::before { width: 0.1875rem; height: 2rem; }  /* vertical bar on a column edge */
.kol-column-browser-resize-y::before { width: 2rem; height: 0.1875rem; }  /* horizontal on the bottom edge */
/* shown on hover of the strip and while dragging */
```

Differences from `.kol-sidenav-grab`, deliberate: hidden at rest rather than dim-at-rest (a column browser has one handle per column — N pills standing at rest is noise where the SideNav has one), and 420ms rather than 150ms (user: *"longer in and out"*).

## Recreation notes

(1) and (2) are `ColumnBrowser.jsx` class changes; (3) is dropping the `muted` prop from the file rows (or the mute from the class list — the prop can stay for other callers); (4) is kol-theme, and the pill belongs beside `.kol-sidenav-grab`'s values so the two stay one affordance. On return kol-r2b2 deletes the block in `src/index.css` (it is the whole file bar the checkbox rule).

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-component 0.118.3** + **kol-theme 0.79.0**, the values as measured:

1. `ColumnBrowser.jsx` column: `border-r` on every column, the last included.
2. Row: `border-b last:border-b-0 only:border-b` — the general `:only-child` rule.
3. File rows no longer pass `muted`; the prop stays for other callers.
4. `.kol-column-browser-resize-x/-y::before` — the `.kol-sidenav-grab` pill (0.1875rem × 2rem, radius-full, fg-64, dead centre), hidden at rest, opacity in over 420ms on hover and `.is-dragging`; the fg-08 wash and its transition are gone.

Verified in source only. Remainder in kol-r2b2: bump both, delete the `src/index.css` block.
