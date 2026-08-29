# SettingsShortcutsComboWrap — a three-character combo wraps in the six-column grid

**Staged:** 2026-08-27 · from **kol-monitor** (seen rendering on `/settings` at 1440, both themes)
**Change:** kol-shell — one `whitespace-nowrap` on the combo cell

## The problem, in one case

`SettingsShortcuts` lays sections six columns × two. In monitor's render every
combo with a break opportunity wraps: `⌘ K` renders as `⌘` over `K`, `+ / −` as
three lines, `1–9` as `1–` over `9` — while `Alt+Scroll` (no break point) sits
on one line. A three-character value breaking means the value cell is being
squeezed to min-content, not that the column is full. A key combo is one
token by nature; it must never wrap.

Monitor passes `comboLabel={(c) => <span style={{ whiteSpace: 'nowrap' }}>{c}</span>}`
meanwhile — a formatting seam carrying a layout fix.

## The fix

`whitespace-nowrap` on the combo cell in `SettingsShortcuts.jsx` (or on
`LabelRow`'s value when it is a string), and let the label truncate instead if
the column is genuinely short — the label is the prose, the combo is the datum.

## Rejected alternative

Widening the grid to fewer columns — the 6 × 2 column-first layout is the
ruling (user, 2026-08-27); the defect is the cell, not the count.

## Definition of done

kol-shell published; monitor drops the nowrap `comboLabel` on the bump.

## ✅ RESOLUTION — 2026-08-27 · kol-shell 0.9.1

SettingsShortcuts' combo cell is whitespace-nowrap; LabelRow's label keeps its 160 but yields (flex 0 1 160px, min-width 0) and truncates when the row is squeezed — the label is the prose, the combo the datum. 6 × 2 untouched. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-monitor bump kol-shell 0.9.1; drop the nowrap comboLabel.

