# SettingsPanelBackdrop

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** `SettingsPanel variant="rail"` forwards `backdrop` (and `mode`) to its `Rail`, so a page's own settings can sit over a live page without the scrim

---

## The problem, in one case
Monitor's rack and stage have page-level settings (the rack's `H` Rail, the stage's settings, the patch table on both) that must open OVER the page while it keeps running — the user watches the picture while he patches, and the rack's keys (Space, M, the digits) must keep working. That is the bottom Rail's setup already (`Rail backdrop={false}`), and the user's ruling for every page-level Rail: *"should use the setup rail uses for settings"* · *"dont narrow, rather cover … we dont want to interrupt the rack layout. just like bottom shelf does."*

`SettingsPanel variant="rail"` is that setup — the app's Settings tier, the template — but it hard-codes its `Rail` with the scrim on (`SettingsPanel.jsx` ~line 118, "THE SCRIM IS BACK", kol-client-olina 2026-09-03), and does not forward `backdrop`. So a page-settings Rail on the template dims and locks the page it is for. Monitor's stage has carried `ShellDrawer` + `SettingsRow` by hand since 2026-08-28 for exactly this, with a note in the file: *"Worth a DS ask: SettingsPanel should forward `backdrop`."* This is that ask.

## The fix
`SettingsPanel` takes `backdrop` (default `true`, so olina's scrim stays) and passes it to the `Rail`; `mode` too if it costs nothing. Nothing else moves: the anatomy (title helper-14, headerActions, ×, Divider, sections, footer) is the point of using the template.

## Rejected alternative
A local copy of the rail branch in monitor (`Rail side="right" width={380} edge={false} shadow={false}` + the header span + a Divider). It is in the tree as `src/components/PageRail.jsx` until this ships, named as a carry — a second implementation of the template that drifts the day the DS changes the header.

## Definition of done
- [ ] `SettingsPanel backdrop={false}` renders the rail with no scrim, no scroll lock, no focus trap (Rail's own `backdrop={false}` behaviour)
- [ ] default unchanged
- [ ] Published; kol-monitor's receipt names the version

## 🟠 ADDRESSED — 2026-10-24 · built, unpublished

`SettingsPanel` takes `backdrop` (default `true`) and forwards it to its `Rail` on the rail variant — `false` is the Rail's
own no-scrim setup (no scrim, no scroll lock, no focus trap; the Rail's `backdrop` contract). The default and the overlay
variant are untouched. `mode` (`over` · `push`, the Rail's own) forwards the same way. Docs: the JSDoc, `SettingsPanel.mdx`; Unreleased
line in kol-component. props · syntax clean. **Closes on:** the publish; the receipt names the version.

## 🟢 CLOSED — 2026-10-24 · kol-component 0.299.0 live

Registry live (checked once after the PUT). Receipt returned to kol-monitor's outbox — its remainder: bump, every `PageRail` importer → `SettingsPanel variant="rail" backdrop={false}`, `PageRail.jsx` to `_tmp/`.
