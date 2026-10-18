# SettingsRowTextKeepsLabel — `SettingsRow text` keeps the Settings label look

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor · corrects `SettingsRowMonoBaseline` (kol-component 0.269.0)

## The ask, in the user's words

> "you understand what section header is? and why IS SHOUDL BE DIFFERENT FROM THE LIST IT DESCRIBES?!?!?!?"
> (pointing at ui.kolkrabbi.io/apps/hub → Settings rail: DEFAULTS / TRANSPORT headers bright and heavier; DEFAULT
> ASPECT · SHOW GRID · AUTOPLAY labels small, widely tracked, dim)

## What 0.269.0 did wrong (my ask, not your build)

`SettingsRow text` sets the label in `kol-mono-12` at `text-fg-80` — the same size, case and ink as
`LabeledControlSection`'s `kol-eyebrow text-fg-80` header. In monitor's shortcuts rail the header "APP" now reads
as one more row.

## The ask

`text` rows keep the Settings rail's label look — the same size, tracking and dim ink the label has in every other
`SettingsRow` (the hub's Settings rail is the reference). Keep only what 0.269.0 fixed underneath it: a real
line-height (no `line-height: 1`), label and value on one baseline, no inherited 24px strut.

## Acceptance

monitor's shortcuts rail (`SettingsPanel` → `LabeledControlSection divided rowGap={1}` → `SettingsRow text`) reads
like the hub's Settings rail: headers stand above dim labels; rows are as tall as their text, on one baseline.

## ✅ RESOLUTION — 2026-10-18 · kol-component@0.271.0

kol-component 0.271.0: `SettingsRow text` keeps the Settings label look — `kol-helper-10 tracking-widest text-meta`, as on every other SettingsRow — on a real 16px line (`leading-4`, not helper's `line-height: 1`); label and value stay on one baseline and the value cell stays a flex box, so no 24px strut. `LabeledControlSection` is back to `kol-eyebrow text-fg-80` (0.270.0's mono-14 header for the withdrawn SectionHeaderAboveTextRows is removed). Measured in apps/hub: header eyebrow 12px fg-80 over 10px meta labels (0.48), text row 17px.

**Remainder here:** none — kol-monitor bump kol-component@0.271.0 (skip 0.270.0).
