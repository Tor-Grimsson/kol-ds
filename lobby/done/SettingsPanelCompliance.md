---
component: SettingsPanel
source: kol-r2b2 on kol-component 0.100.0 / kol-theme 0.69.0
staged: 2026-08-27
status: draft
deps: [SettingsPanel, SettingsChipRow, ShellDrawer, Tag]
---

# SettingsPanel — make it DS-compliant (the 0.98.0 chip change went the wrong way)

User, verbatim: "fix the settings overlay. make it ds compliant... I thought I already said?" and, on the 0.98.0 chips: "WROOOONG — what the fuck is that". Screenshot: `_assets/2026-08-27-settings-and-preview/settings-chips-wrong-tags.png`.

User, again, verbatim: "it's the most fucked up thing I've ever seen… tell them it's FUCKING RIDICULOUS and pull their head out of their ass." This panel has now been through three rounds (SettingsPanel → 0.69.0, SettingsPanelChromeAndColumnPreview → 0.98.0, this) and each one invented a look instead of reusing the collection's. Stop inventing. Use what ships.

## What is wrong
- **`SettingsChipRow` now renders `Tag` (md · inverse when on)** — big white uppercase pills. That is not the chip used anywhere else in the collection. The ruled chip is the **`.kol-control` control chip** — `kol-control kol-control-sm kol-mono-12`, `kol-control--filled` when on, `text-meta hover:text-emphasis` when off, count in `text-meta` after the label — the same string `ContentFilters`' kind chips, `ViewToggle`'s text variant and the SELECT / FLAT strip wear. No `Tag`, no uppercase, no inverse.
- The rest of the panel must sit on the same register as the collection beside it, nothing invented: title `kol-helper-14` uppercase, rows `kol-mono-12`, hints `kol-mono-12 text-meta`, section labels the `Section`'s own, `SegmentedToggle` / `ToggleSwitch` as shipped, `ShellDrawer` edge `oq-08`. If any of those is already right, leave it; the chip row is the defect.

## Consumer state
kol-r2b2 renders the chip row itself as a stopgap (`.kol-control` buttons, `SettingsPanel.jsx`) and will delete it on bump.

## Recreation notes
`SettingsChipRow` → the `.kol-control` chip (the `chipCls` helper the organism already exported at 0.93.x did exactly this; 0.98.0 replaced it with `Tag`). Show it on the drawer demo next to the ContentFilters kind chips — they must be indistinguishable.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.100.1

SettingsChipRow is the .kol-control chip again — kol-control kol-control-sm kol-mono-12, kol-control--filled when on, text-meta hover:text-emphasis when off, the count in text-meta — the string ViewToggle's text variant and the strips wear; 0.98.0's Tag pills were the DS's wrong call. Measured on the drawer demo: 0 .kol-tag in the drawer, on/off chips carry exactly that string, 0 uppercase. The rest of the panel was already on the register from 0.98.0 (helper-14 uppercase title, mono-12 rows and hints, oq-08 edge) and is untouched.

**Remainder here:** none — kol-r2b2 bump kol-component 0.100.1; delete the stopgap chip row.

