# ShellSettingsPairRetired — kol-shell's duplicate settings pair, filed to two repos

**Filed:** 2026-08-30 → **kol-mirror** + **kol-monitor**
**Entries:** `~/dev/projects/kol-{mirror,monitor}/lobby/inbox/ShellSettingsPairRetired.md`
**Ledgers:** each repo's `lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · synced 2026-08-30

## Why it went there

User ruling 2026-08-30: *"dont ship duplicate components"*. kol-shell shipped
its own `SettingsSection` + `LabelRow`, a second implementation of
kol-component's `LabeledControlSection` + `SettingsRow`. Retired in
**kol-shell 0.21.0**, quarantined to `_tmp/2026-08-30-shell-settings-duplicates/`.

Those two repos' `SettingsPage.jsx` were the only importers in the estate
(kol-fxr had already moved off). No alias, no deprecation window — the swap and
the bump are one move.

## What stays here

Nothing. `SettingsShortcuts` was repointed at `SettingsRow` in the same pass and
`SettingsScaffold` is unchanged.

⚠️ The **fxr ticket's remaining ask is untouched** and still live in the inbox:
`SettingsScaffoldFromFxrPage` asks that the scaffold's header row become the
real `ContentFilters` organism. That is marked DO-NOT-START pending the user's
conversation, and this retirement does not close it.

**Remainder here:** none.
