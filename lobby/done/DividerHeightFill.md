# DividerHeightFill — vertical `Divider` can stretch to its row

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor

## The ask

`Divider variant="vertical"` takes `height` as a number only (default 16, `self-center`). Add `height="fill"`:
the wrapper `self-stretch` with no fixed height, so the 1px rule runs the full height of the flex row.

## Why

monitor's eurorack panels separate jack and knob groups with full-height rules (VCAModule, AttenuatorModule —
compare on monitor's Dev → Divider tab). Its local Divider stretches (`alignSelf: stretch`); KOL's 16px centred
rule reads as a tick there, and with a call site's `py-1.5` it shrinks to 4px. monitor swaps to KOL's Divider
once this ships.

Keep: default stays 16 + centred; `className` padding (e.g. `py-1.5`) insets a fill rule from the row's edges.

## Done means

`<Divider variant="vertical" height="fill" />` stretches to the row; numeric `height` unchanged.

## ✅ RESOLUTION — 2026-10-18 · kol-component@0.276.0

`Divider variant="vertical" height="fill"`: the wrapper is `self-stretch` with no fixed height and the 1px rule stretches with it; `className` padding insets it. Numeric `height` (default 16, centred) unchanged. Same release: `PageHeader` is the one Round 11 header (size · voice · register · masthead ignored) — monitor's mastheads change on the bump.

**Remainder here:** none — kol-monitor bump kol-component@0.276.0 (tarball HTTP 200), swap to KOL's `Divider` with `height="fill"`.
