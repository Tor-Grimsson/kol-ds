---
component: SiteRailTitleNavigatesOnly
source: kol-ds-ui/packages/component/src/organisms/NavRailSite.jsx#L346-L363
staged: 2026-10-27
status: draft
deps: [NavRailSite, SiteLayout]
---

# SiteRailTitleNavigatesOnly

## Purpose
A foldernote category in the site rail (`NavRailSite`, drawn by kol-framework `SiteLayout`): clicking its **title** opens the overview **and** discloses the category. User, kol-branding 2026-10-27: *"clicking on title shouldnt also expand, that is what the chevron is for."*

## Anatomy
- category row
  - title — `RouteLeaf` (`<a>`), `onPress={() => discloseCat(cat.id)}` ← the coupling
  - caret — `<button>`, `toggleCat(cat.id)`

## Variants
None — behavior only.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `discloseOnTitle` | bool | **false** (user's ruling) | whether a folder title click also opens its pages; the caret always toggles |

## Styling
Unchanged.

## States & interactions
- title click → navigate to `cat.to` only; disclosure state untouched.
- caret click → toggle disclosure (as now). Collapsed rail: caret behavior as now.

## Dependencies
`NavRailSite`; pass-through on kol-framework `SiteLayout`'s `sideNav`.

## Recreation notes
- Drop `onPress={() => discloseCat(cat.id)}` from the folder title by default; keep it behind the prop for any consumer that wants the old coupling.
- **The user's standing ask, in his words paraphrased:** he does not want to file a ticket every time a small rail behavior is wrong. Consumer-facing behaviors in the rail (title disclose, auto-open on arrival, which category opens) should not be hardcoded with no way out — ship a sensible default **plus a prop**, so a consumer adjusts in its own repo without a round-trip here. Audit `NavRailSite` for other hardcoded behaviors of this kind while in there.
