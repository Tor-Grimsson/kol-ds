# SettingsRowMonoBaseline — SettingsRow's label on a real mono, on the baseline, no strut

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor

## The ask, in the user's words

> "I feel this is still to tall relative to the font size"
> "why here are we not aligning baseline or size or nothing? and why such low opacity all over?"

## What it is today (kol-component 0.267.0, `SettingsRow` → `LabeledControl inline`)

- Label: `kol-helper-10 tracking-widest text-meta` — helper is `line-height: 1`, 10px, and meta ink is dim.
- Row: `flex items-center gap-3`, measured 328 × 24 for one line of 10px text. The 24 is the value wrapper: an
  inline `span.inline-flex` inside a block `div.flex-1`, so the line box takes the inherited line-height strut.
- Label and value are centred, not baseline-aligned, and at different sizes.

Seen in monitor's shortcuts rail (`SettingsPanel` + `LabeledControlSection rowGap={1}` + `SettingsRow` per key).

## The ask

1. The label sets in `kol-mono-*` (a real line-height), not `kol-helper-*`, at an ink that reads (not `text-meta`).
2. Label and value align on the baseline (`items-baseline`).
3. No inherited strut: the row is as tall as its text (value wrapper block-level / `leading-none` container).

## Acceptance

A `SettingsRow` holding a `kol-mono-12` string is ~16px tall, label and value share a baseline, and the label is
not dimmer than the value.

## ✅ RESOLUTION — 2026-10-18 · kol-component@0.269.0

kol-component 0.269.0: `SettingsRow text` (and `LabeledControl inline text`, `text` on a `SettingsSections` row) — a row whose value is text: the label sets in `kol-mono-12` at `text-fg-80` (the value's ink, not `text-meta`), label and value sit on one baseline (`items-baseline`), and the value cell is a flex box so the inherited line-height strut is gone. Opt-in — switch and dropdown rows are unchanged. Measured in apps/hub at 328px: `text` row 16px (was 24), label and value text bottoms equal, both inks 0.8.

**Remainder here:** none — kol-monitor bump kol-component@0.269.0 and pass `text` on the shortcuts rail's `SettingsRow`s.
