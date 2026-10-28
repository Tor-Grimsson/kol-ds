# NavRailSite: the Kolkrabbi credit footer is on by default — make it opt-in

**Staged:** 2026-10-28 · from a kol-website session
**Change:** kol-component `NavRailSite` (default flip) — breaking for apps that rely on the credit

---

## The problem, in one case
`NavRailSite` (kol-component 0.306.0, `src/organisms/NavRailSite.jsx` ~511) draws the "Kolkrabbi Vinnustofa · <year>" link in the rail footer whenever `footer` is `undefined`. kol-website's record.kolkrabbi.io (`SiteLayout`, `apps/record/src/App.jsx`) shows it because it never passed `footer: false`; brand hides it with `sideNav={{ footer: false }}`. Every app has to remember to turn it off.

## The fix
User ruling 2026-10-28: **default off, opt in.** `footer` undefined → no footer box. The credit becomes an explicit opt-in (e.g. `footer: 'credit'` or `footer: true`, the DS's pick), a node still renders as before, `false` stays valid.

## Definition of done
- [ ] `NavRailSite` with no `footer` renders no footer box
- [ ] the credit renders only when an app opts in; docs and the DS apps updated (any DS app that wants the credit passes the opt-in)
- [ ] published; kol-website record shows no credit after the bump

## ✅ RESOLUTION — 2026-10-28 · kol-component@0.307.0

NavRail preset="site" (NavRailSite): no footer prop = no footer box. The Kolkrabbi credit renders only on footer="credit" (SiteLayout's sideNav={{ footer: 'credit' }}); a node renders as before; false stays valid. Breaking for any site that relied on the default credit; no kol-ds-ui app did (brand-hub, brand, site-hub already passed false; rails, shell, brand-sections now show none — checked in apps/rails on the site frame). Docs: 04-compositions/18-site-frame.md row 'the footer', kol-component CHANGELOG.

**Remainder here:** none — kol-website bump kol-component to 0.307.0 — record shows no credit with no change; brand's footer: false can go.

