# PageHeaderAppLevel — a header level between page and section, at the old mono masthead size

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor · follows Round 11 (kol-component 0.276.0)

## The ask, in the user's words

> "display is too big … it needs to be same or closer to the size as mono had"
> "that display is fine for Section Hero like in brand but not for EVERYTHING ELSE that uses the mono. so why not
> proping or making a variant that is between page and section?"

## The ask

`PageHeader` gains a level between `page` (display-01 over the 22/28 lede) and `section` (display-03): the app
page header, sized like the retired mono masthead (`size="sm" voice="mono"` — e.g. monitor's Home "Monitor /
Video synthesis workstation" before 0.276.0). Naming is yours.

- `page` (display-01) stays for hero headers — brand's section hero.
- App-tier pages (Home, Library, Settings, Dev — via HubHome / CatalogPage / SettingsScaffold / HubDev) default to the
  new level, so consumers move with no call-site change.
- Expose its title/lede classes: monitor's Create page puts editable `<input>`s in `title` / `subtitle` and must
  style them to the level (it hand-sets `kol-mono-heading-03` today).

## Done means

monitor's Home and Library headers read at the old mono size again; brand's hero is unchanged; Create's inputs
can match the level from its exported classes.

## ✅ RESOLUTION — 2026-10-18 · kol-component@0.277.0 · kol-shell@0.72.0

`PageHeader level="app"` — h1 `kol-mono-heading-03` over a `kol-mono-14` lede at oq-64, the retired mono masthead as a level. `page` (display-01) stays the hero. kol-shell 0.72.0: `CatalogPage` (so `HubHome`), `SettingsScaffold` (`HubSettings`), `HubDev` and `AppStudio`'s create page default to `app`; `header.level` still wins. New export `PAGE_HEADER_ROLES` — `{ page | app | section: { title, lede } }` — for Create's inputs (`PAGE_HEADER_ROLES.app.title` / `.lede`).

**Remainder here:** none — kol-monitor bump both (tarballs HTTP 200).
