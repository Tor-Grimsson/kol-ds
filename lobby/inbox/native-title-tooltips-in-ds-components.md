# DS components render the DS `Tooltip`, never a native `title`

**Staged:** 2026-09-22 · from a kol-client-olina session
**Change:** a sweep: the hint props keep their names and render through `Tooltip` instead of `title`

---

## The problem, in one case

Seen live on media.olina-productions.com (kol-component 0.216.0): hover the ROW / COLUMN toggle and
you get the browser's yellow-grey OS tooltip, after the OS delay, in the OS font. Hover the theme chip
next to it (`apps/media`'s own code, already on `Tooltip`) and you get the DS one. The two sit a few
pixels apart in the same header.

The consumer can't fix this. The `title` is set inside the DS component:

| where | what |
|---|---|
| `atoms/ViewToggle.jsx:66` · `:110` | `title={…label}` on every option: ROW / COLUMN, grid / list / off, and SELECT / FLAT on the files bar (`MediaLibraryPages.jsx:1302-1303` passes `title:` in) |
| `organisms/SettingsPanel.jsx:121` | `<span title={hint}>`, every row hint |
| `organisms/SettingsPanel.jsx:135` | `title={… disabledHint}`, disabled-state hints |
| `organisms/SettingsPanel.jsx:256` | the reset `IconFrame`, `title={resetLabel}` |

A loose grep finds ~37 `title=` attributes across `component/src` and `framework/src`. Some are
headings, not hints, so treat that number as the sweep's upper bound, not its size.

## The fix

- Every **hint** (`hint`, `disabledHint`, option `title`, `resetLabel`) renders through
  `Tooltip` (`utilities/Popover.jsx:134`) instead of a native `title`. **Prop names stay**, so no
  consumer changes a call site.
- Keep `aria-label` / accessible names as they are. The tooltip is for sighted users, and the label
  stays for screen readers.
- Worth having as a gate if the DS keeps any: no bare `title=` on interactive chrome inside
  `packages/component` / `packages/framework`.

## Rejected alternative

**The consumer wraps each control in `Tooltip`.** It can't reach them. The `title` is inside
`ViewToggle` and `SettingsPanel`, and wrapping the whole control would leave the native one firing
underneath.

## Definition of done

- [ ] ViewToggle options, SettingsPanel hints, disabled hints and the reset button show the DS tooltip and no native one.
- [ ] No hint prop was renamed; `apps/media` needs no code change beyond the bump.
- [ ] Accessible names unchanged.

## 🟠 ADDRESSED — 2026-09-23 · kol-component@0.217.0

`ViewToggle` (icon variant), `SettingsPanel` (`SettingsRow` hints, `SettingsSwitch` disabled hints, the footer reset), `ContentFilters`' layout strip and `ActionButton` now render their hints through the DS `Tooltip`; prop names unchanged. A disabled switch inside a hinted row shows one tooltip, not two (`Tooltip` suppresses itself while a nested one is open). Needs `kol-theme@0.147.0` — the `.kol-view-toggle` tone selectors moved one level deeper. Scope was the media pages' own controls: the editor-chrome components (`LayerStack`, `TimelineDock`, …) still carry native `title` — nothing here asked for them.

**Bump** — `kol-component@0.217.0` · `kol-theme@0.147.0` · `kol-icons@0.27.1`, all three together (the component peers the other two, and the theme carries the chrome). Proved live in the DS's own `apps/media` fixture, not just built.

**Also in 0.217.0, so it is not a surprise:** the media surface changed shape underneath — Browse and Files are ONE surface with three views (columns · rows · grid; `list` duplicated rows and now lands on rows). `view` is the new key; `folderView` and `layout` are still read and kept in step beneath it, so nothing you pass breaks. Click selects · double-click opens · right-click is the menu · space is Quick Look (a resizable window, folders too). Opt-in, absent means unchanged: `trash={{ items, restore, purge, empty }}` (delete moves aside instead of "cannot be undone"). New dependency `pdfjs-dist`, lazy — PDFs show page one. Known, not fixed: in column view, dropping a file onto another FILE's row renames the dragged file (pre-existing, unfiled).

Closes on kol-client-olina verifying it in their running app.
