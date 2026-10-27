# Session: home screen, the site rail, the phone pills

**Date:** 2026-10-27
**Agent:** Claude (Grim)
**Summary:** Four tickets closed (StandaloneSafeAreaAndPageGround, mirror's identity glyphs, PhoneNavTopAndFold, TransportPill), the site rail's chevron and page indent fixed through Rounds 20–21, and a Background axis in one multi-dropdown on every showcase preview.

## Changes Made

### Files Modified
- `packages/theme/kol-base-tokens.css` — `html` on `--kol-surface-primary`; standalone `body` pads the top safe-area inset (kol-theme 0.191.0)
- `packages/icons/src/kol-icon-set-interface/identity/mirror.svg` (replaced, old in `_tmp/2026-10-26-mirror-identity-glyph/`) · `mirror-mir.svg` (new) · cuts regenerated with `playback/stopwatch-solid` (kol-icons 0.46.0, 0.47.0)
- `packages/framework/kol-framework.css` — `.kol-sidenav-hop-caret` `right: 1rem` (16, was 12) (kol-framework 0.57.0)
- `packages/component/src/organisms/NavRailSite.jsx` — a section's own pages inline at `--kol-sidenav-pad-x` + 2rem + 2px (54; were 56 on the chrome inset); group pages unchanged (kol-component 0.303.0)
- `packages/component/src/molecules/TabsRow.jsx` — the phone pill's `edge` · `border` · `shadow` · `active="circle"` · `foldable`/`folded`/`onFoldChange`/`foldSide`, tab `selected`; `TABBAR_PILL_TAB` exported (kol-component 0.304.0)
- `packages/shell/src/PhoneNav.jsx` — `placement="top"`, `border`, `active`, fold, `moreKeepsOpen`, panel items (`onPress` · `selected`); `TransportPill.jsx` new; `MoreSheet.jsx` rows take `checked` (kol-shell 0.83.0)
- `showcase/src/lib/PreviewCard.jsx` — every axis in one MultiSelect, plus Background (sunken · primary · secondary bg, remembered per browser); the per-axis dropdown retired to `_tmp/2026-10-27-rail-geometry/`
- `showcase/src/open-questions/2026-10-27.jsx` (Round 20, rejected) · `-b.jsx` (Round 21, approved) · `-c.jsx` (Round 22, the phone Labs layout, open for review)
- `showcase/src/previews/TransportPill.jsx`, `showcase/src/nav/classification.js`, `showcase/src/docs/components/TabsRow.mdx`
- Docs: `docs/operations/07-apps-tier/10-save-to-home-screen.md` (new playbook) + INDEX row, `02-icons/05-app-icons.md` related, `02-icons/01-inventory.md`, changelogs, `02-shipped-packages.md`
- Lobby: four tickets to `done/`, receipts in kol-mirror and kol-fxr outboxes

### Features Added/Removed
- Every app gets a ground and clears the status bar on the home screen
- The phone pill as one primitive: top or bottom, foldable to an edge tab, the 44 circle; `TransportPill`
- The showcase preview's Background picker

## Current State

### Working
- Live: kol-theme 0.191.0 · kol-icons 0.47.0 · kol-framework 0.57.0 · kol-component 0.304.0 · kol-shell 0.83.0 (registry checked)
- Round 22's phone frame: More keeps the panel, the loop sheet centres on its slot, both pills fold and restore

### Known Issues
- `validate:previews` V1 on stripe-row, studio-detail, tag-mode-gate (pre-existing)
- `validate:icon-ink` I3 at `AppItemMenuProvider.jsx:126` (pre-existing)
- The `Sunken` tone name: he asked why; renaming it touches every control, offered, not decided

## Next Steps
1. His review of Round 22
2. kol-mirror: bump kol-theme 0.191.0, retire its two local copies; kol-fxr: adopt the pills (plan 41 W4)
3. Push is his

## Amended — 2026-10-27

- SiteRailTitleNavigatesOnly (kol-branding) closed: kol-component 0.305.0 — a foldernote's title navigates only, the chevron expands; `discloseOnTitle`, `defaultOpen`, `openOnRoute` on `NavRail preset="site"` (through `SiteLayout`'s `sideNav`); `04-compositions/18-site-frame.md` updated; checked in site-hub; receipt to kol-branding
