# SiteRailDotNoAccent

**Staged:** 2026-10-24 · from a kol-studio session
**Change:** the site rail's active-page dot drops the accent; it wears the row's ink

---

## The problem, in one case
kol-studio on `SiteLayout` (kol-framework 0.54.0 · kol-component 0.298.0 · kol-theme 0.186.0), Resume › Source active. The user: *"why is the dot yellow and in the wrong place?!"* — then the ruling: *"the dot is not supposed to be accented. remove the accent!"*

The dot is the package's: `kol-components-atoms.css` draws it with `background: var(--kol-accent-primary)`. kol-studio has no rail CSS, so there is nothing to fix there — and a consumer override is exactly what the KOL forbids.

Screenshots: `_assets/2026-10-24-site-rail-dot/` — his crop (`user-crop-resume-source.png`) and the full rail at 1440 (`kol-studio-1440-clients.png`).

## The fix
- The active dot's fill is the row's ink, not `--kol-accent-primary`, in dark and light.

## Question in the same ticket
- *"in the wrong place"*: kol-component 0.298.0 moved the dot onto `--kol-pad-chrome-x` + 1.125rem plus a per-depth indent. brand.kolkrabbi.io (kol-component 0.282) sits it closer to the label. Is 0.298's position the intended one?

## Definition of done
- [ ] The site rail's active dot is ink, no accent, in both themes
- [ ] The dot's position confirmed or corrected
- [ ] Published; kol-studio's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-theme 0.188.0 live

`.kol-sidenav-link.is-active::before` paints `currentColor` — the active row's on-primary ink, in both themes (walked on site-hub: dot = ink in dark and light, never the accent). **The position is confirmed**: 0.298.0's ruling from site-hub — the dot's left on the chrome inset plus the depth indent, the label column unchanged — and it does not move here; a different place is a visual call for the user on the open-questions page, not a fix. Registry live (checked once). Receipt returned to kol-studio's outbox.
