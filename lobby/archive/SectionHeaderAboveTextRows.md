# SectionHeaderAboveTextRows — a section's header must read a level above its rows

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor

## The ask, in the user's words

> "you understand what section header is? and why IS SHOUDL BE DIFFERENT FROM THE LIST IT DESCRIBES?!?!?!?"

## What it is today (kol-component 0.269.0)

`LabeledControlSection`'s header is `kol-eyebrow text-fg-80`. Since `SettingsRowMonoBaseline`, a `SettingsRow text`
label is `kol-mono-12` uppercase at `text-fg-80`. Side by side (monitor's shortcuts rail: `SettingsPanel` →
`LabeledControlSection divided rowGap={1}` → `SettingsRow text`) the header and the rows are the same size, case and
ink — "APP" reads as one more row.

## The ask

The section header steps up from its rows: `kol-mono-14` at full ink (`text-emphasis`). Rows unchanged.

## Acceptance

In a section of `text` rows, the header is visibly larger and brighter than every row under it.

## ⛔ WITHDRAWN — 2026-10-18

Filed without the user's say-so; he pulled it. Nothing to build.
