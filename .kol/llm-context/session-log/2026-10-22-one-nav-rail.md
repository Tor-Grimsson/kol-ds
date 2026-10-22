# Session: One nav rail — folder notes, one open width, ink active icon

**Date:** 2026-10-22
**Agent:** Claude (Grim)
**Summary:** Agreed the one-rail plan with the user; built its behaviour and width phases, filed brand's override removal to kol-website; the SideNav → NavRail merge waits on which package hosts it.

## Changes Made

### Files Modified
- `packages/shell/src/NavRail.jsx` — a section with `to` is a folder note (icon + label open the page, chevron folds/enters); label-only sub rows start on L1's label column; open width reads `--kol-shell-rail-open`.
- `packages/theme/kol-components-shell.css` — `--kol-shell-rail-open` 264, 320 from 1536.
- `packages/theme/kol-components-atoms.css` — active hop icon is ink, `--kol-sidenav-active-icon` to change it per repo.
- `apps/rack-hub/src/rack/RackRail.jsx` — the local fork reads the new width token.
- `showcase/src/previews/NavRail.jsx` — Docs is a folder note with two label-only pages.
- `docs/documentation/04-compositions/11-shell-system.md` — width, alignment, the two opt-ins, the active icon.
- `.kol/llm-context/plan-2026-10-22-one-nav-rail.md` — the plan; W2 · W3 built, W1 TALK.
- kol-website `lobby/inbox/brand-sidenav-drop-overrides.md` + ledger; outbox stub + ledger here.

## Current State

### Working
- Preview at 1600 wide: rail opens to 320, label-only pages at x 52 with their section's label, Docs label → `/docs`, chevron folds.
- Gates: syntax · rails · props green (rest of the run noted below).

### Known Issues
- W1 (SideNav as `NavRail variant="site"`) not built: every host package contradicts ARCHITECTURE §3 as written. Recommendation in the plan: kol-component, the `PageHeader` precedent.

## Next Steps
1. The user rules W1's host package.
2. Publish kol-shell + kol-theme after his yes; name the kol-theme version in kol-website's ticket.

## Amended — 2026-10-22

- W1 built on the user's ruling (kol-component hosts the rail): `NavRail`, `Logomark`, `railSlot` moved to kol-component (`organisms/NavRail.jsx`, `atoms/Logomark.jsx`, `hooks/railSlot.jsx`); kol-shell re-exports them, `AppShell` imports from kol-component; originals in `_tmp/2026-10-22-rail-to-component/`.
- `organisms/NavRailSite.jsx` — `NavRail variant="site"`, SideNav carried class-for-class, router-free (`<a href>` + `onNavigate`, modified clicks left to the browser, `hrefFor` for a basename, `themeToggle` as a render function).
- kol-framework `SideNav.jsx` — now the alias: react-router read + navigate + basename href + ThemeToggle over `NavRail variant="site"`; 479-line original in `_tmp/`.
- Retirement ledger row for `SideNav`; ARCHITECTURE §3 amended; inventory, topology and shell docs updated.
- Verified: apps/brand (basename) — site rail renders as before, leaf clicks route without reload, active leaf `aria-current`, active icon ink; NavRail, SideNav and AppHub previews render. Gates: syntax · imports · taxonomy · roster · homes · groups · consumption · props · vault-links green; retirements' four other violations predate this.
- Published kol-theme 0.179.0 · kol-component 0.283.0 · kol-shell 0.73.0 · kol-framework 0.52.0.
- Showcase: NavRail's page shows both variants (`app` · `site`) and installs from kol-component; `SideNav` is deprecated there (preview retired to `_tmp/`); framed previews now take the variant picker through the iframe URL (`PreviewFrame`, `PreviewCard`); NavRail · Logomark · useRailSlot exempted as kol-shell re-exports; NavRail's composition entry points at its new source.
- apps/*: AppShell/AppHub apps take the new rail through the workspace; rack-hub's local `RackRail` fork stays (its action rows and meta are not shipped) and reads the new width token.
- Earmarked in AGENT-CONTEXT § Later: `apps/brand-hub` (the DS's client brand home) is on the app rail while brand.kolkrabbi.io is on the site rail — the user rules which a brand site wears, later.
