# SettingsMastheadCluster — the settings masthead row, filed to three repos

**Filed:** 2026-08-30 → **kol-fxr** + **kol-mirror** + **kol-monitor**
**Entries:** `~/dev/projects/kol-{fxr,mirror,monitor}/lobby/inbox/SettingsMastheadCluster.md`
**Ledgers:** each repo's `lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` · synced 2026-08-30

## Why it went there

User, on three settings pages side by side: *"Im trying to ship a universally
consistent settings page, visually and functionally, but I keep hitting the same
issues over and over again."*

Two causes, both now fixed here:

1. **The masthead row was a raw `header.actions` slot.** fxr and kol-r2b2 each
   hand-built the same shape; mirror and monitor passed nothing at all. Not
   drift — two pages were never handed the row. `SettingsScaffold` owns the
   arrangement now (**kol-shell 0.27.0**): `picker · themeToggle ·
   onOpenSettings`, order/gap/tone ruled, gear drawn by the DS.
2. **`tone="sunken"` was rendering RAISED** (**kol-theme 0.106.0**) — it had no
   token and borrowed `oq-inverse-96`, 23.7 on an 18.2 page. Now
   `--kol-surface-sunken` → `oq-ab-96`, with the `ab` ladders flipping toward
   the ground.

## What stays here

Nothing. Both fixes shipped.

⚠️ **No repo renders the cluster yet** — it is source-and-build verified only.
The first repo to adopt is the screen check, and that is called out in all three
entries.

**Remainder here:** none.
