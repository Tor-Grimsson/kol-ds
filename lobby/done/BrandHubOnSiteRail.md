# brand-hub runs the `site` rail and the brand page wash

**Staged:** 2026-10-27 · from a kol-hq session
**Change:** one app, plus one layout default if you take it
**Plan:** `~/dev/projects/kol-hq/.kol/llm-plan/02-estate-split.md`

---

## The problem, in one case

`apps/brand-hub` is built on `AppHub` → `AppShell rail="app"`. Brand is a site type (brand.client.xyz) and runs the `site` rail; `app` belongs to `apps/studio-hub`. It also lacks the page wash kol-branding shows on `/template/general#intro`.

## The fix

Move brand-hub onto the `site` rail (SiteLayout). Give it the wash where kol-branding sets it: `SiteLayout pageWash="var(--kol-fg-02)"` (kol-branding `src/App.jsx` Frame; DS `apps/brand`, `apps/rails`, `apps/shell` pass the same value). Since every site consumer passes that one value, consider making it SiteLayout's default instead of a per-app prop.

## Definition of done

- [ ] brand-hub renders on the `site` rail
- [ ] brand-hub pages carry the same wash as kol-branding `/template/general#intro`

## ✅ RESOLUTION — 2026-10-27 · kol-ds-ui apps/brand-hub (no package)

apps/brand-hub runs kol-framework's SiteLayout and the site rail (BrowserRouter, like site-hub): Brand · Assets · Guide (Blank, Voyager) · the opt-in tools as rows · Settings under the theme row; the app rail stays studio-hub's. Every page carries pageWash="var(--kol-fg-02)", the value kol-branding passes on /template/general. SiteLayout's default was NOT changed: kol-studio and kol-branding pass undefined on Home to mean no wash, so a default would wash both landings on their next bump. Docs: 04-compositions/16-app-anatomy.md.

**Remainder here:** none — kol-hq none.

