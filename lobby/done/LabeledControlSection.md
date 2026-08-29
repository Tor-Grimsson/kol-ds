---
component: LabeledControlSection
source: kol-component/src/organisms/SettingsPanel.jsx (SettingsSection) — consumers: kol-r2b2 src/SettingsPanel.jsx, kol-fxr src/editor/params/AutoControls.jsx
staged: 2026-08-27
status: draft
deps: [LabeledControl, kol-eyebrow]
---

# LabeledControlSection

## The ask

**Rename `SettingsSection` → `LabeledControlSection`.** User ruling, 2026-08-27:
the current name is wrong.

**No alias.** The old name goes. Not deprecated, not kept on the retirement
ledger — renamed. Consumers swap on their bump; there are two
(kol-r2b2 `src/SettingsPanel.jsx`, kol-fxr `src/editor/params/AutoControls.jsx`)
and both are listed above.

## Why the name is wrong

It names the **place it was first used**, not **what it is**. It is a section
of `LabeledControl`s: an eyebrow standing apart (gap-3) from a stack of rows.
Nothing about it is settings-specific — `SettingsRow` is literally
`LabeledControl inline`, and the component has no settings concept in it at all.

The name already fails in the field. **kol-fxr adopted it on 2026-08-27 for its
generative / effects parameter rail** (`AutoControls.jsx` — the one renderer
behind every params surface: labs, effects, editor inspector). That rail is not
a settings drawer, and it took the component purely for its shape. A consumer
reading the import cannot tell whether it is allowed to use it outside a
settings panel; the name says no, the component says yes.

The pairing is the tell:

| what it is | named |
|---|---|
| label + control | `LabeledControl` ✅ |
| a section of those | `SettingsSection` ❌ → `LabeledControlSection` |

## What must not change

The render. `kol-eyebrow text-fg-80` header, `gap-3` from the row stack,
`rowGap` 1 / 2, `divided` → `kol-section--divided`. This is a **name-only**
change — `SettingsPanelApproved` (0.104.0) locked the composition and that
ruling stands.

## Noted, not asked — the siblings

The same naming fault runs through the rest of the organism: `SettingsRow` is a
`LabeledControl inline`, `SettingsSwitch` a `ToggleSwitch`, `SettingsChoice` a
`Dropdown`. `SettingsRow` in particular is the one fxr imports most, and it has
the identical problem. Whether the family renames with the section, or the
section is the only one that escapes the prefix, is the DS's call — this ticket
only carries the ruling that was actually given.

Also worth the DS's eye while here: **`InspectorSection`'s label is still
`kol-helper-10 tracking-widest text-meta`** while this one is `kol-eyebrow`.
Two components whose docstrings both describe "a labeled control group",
wearing two different type roles — which is why fxr left `InspectorSection` for
this one rather than keeping the inspector component in an inspector rail.

## Origin

Filed from **kol-r2b2**, the repo that filed `SettingsPanelApproved` and whose
Display-settings drawer is the reference render.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.112.0

`SettingsSection` → `LabeledControlSection`, no alias, render untouched (the 0.104.0 locked composition). Barrel, showcase demo, docs and classification follow; `SettingsRow` / `SettingsSwitch` / `SettingsChoice` and `InspectorSection`'s label voice noted in the changelog, not touched (not asked). 21 gates clean; verified in source.

**Remainder here:** none — kol-r2b2: bump kol-component 0.112.0 and swap the import in `src/SettingsPanel.jsx` (`SettingsSection` → `LabeledControlSection`). kol-fxr owes the same swap in `src/editor/params/AutoControls.jsx` — BREAKING, no alias; it has no receipt of this, tell it.
