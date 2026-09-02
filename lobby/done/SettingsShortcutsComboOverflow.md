# SettingsShortcutsComboOverflow — a nowrap combo overflows its column into the neighbour's labels

**Staged:** 2026-09-01 · from **kol-monitor**
**Nature:** the other half of `SettingsShortcutsComboWrap` (2026-08-27) — the wrap was fixed by nowrap, and nowrap now overlaps.

## Measured — 1440 × 900, kol-shell 0.31.0

Monitor's shortcuts sheet, APP column, row `Jump to rail item (Home first)`
with combo `⌥ then 1–5`. The grid column is **176px** (label 96→272); the
combo cell is `whitespace-nowrap` (the `ComboWrap` fix), so the string runs
past x=272 and renders UNDER the STAGE column's `SHOW / HIDE MODULES` label,
which starts at x=320. Both strings occupy 272–330. Screenshot:
kol-monitor `_tmp/2026-09-01-mobile-qa/qa-settings-1440.png` (left of centre,
y≈655).

Nowrap was the right call for `⌘K`-length combos; it just traded wrapping for
overlap on the first long one. `⌥ then 1–5` is a legitimate combo shape — the
prefix gesture exists on the rail's own ticket (`AppShellNavKeysHomeFirst`).

## The ask

The shortcuts grid should contain a long combo instead of letting it paint
over the next column — wider combo column, `min-width: 0` + ellipsis, or let
the COLUMN size to its longest combo. Your call which; the invariant is
"no cell paints outside its column".

## ✅ RESOLUTION — 2026-09-01 · kol-shell@0.33.0

The label yields for real now. The actual geometry: SettingsRow's fixed 160px label inside your ~176px grid columns left the combo cell 4px — every combo has been painting into the 48px column gap since the block shipped, and ⌥ then 1–5 was just the first to cross it. LabeledControl (kol-component 0.151.0) takes labelWidth="auto" — label flexes and truncates, combo hugs shrink-proof, an over-long combo clips at its own column edge — and SettingsShortcuts passes it. Combos keep nowrap: one token by nature, the 08-27 ruling stands.

**Remainder here:** none — kol-monitor bump kol-shell@0.33.0 + kol-component@0.151.0; re-check the shortcuts sheet at 1440 — no cell over a neighbour, labels ellipsise.

