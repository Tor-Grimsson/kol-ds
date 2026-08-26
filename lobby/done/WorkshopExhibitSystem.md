---
component: WorkshopExhibitSystem
source: kol-website — routes/workshop/Dashboard* + components/workshop/{DesCard,WorkshopSidebarContent}
staged: 2026-08-15
status: draft
deps: [kol-workshop]
---

# WorkshopExhibitSystem — the exhibit-section scaffold, so a new section is content-only

## The ask (user, 2026-08-14 kol-website session, verbatim intent)

> "would it not make sense sending the system to kol-ds-ui and then USING IT for
> dashboard content in kol-website.. so next project I want to add same way as
> dashboard is now, just needs content.. not fucking framework separate"

kol-website's workshop runs the published `@kolkrabbi/kol-workshop` shell, but
its dashboard section is a locally hand-built exhibit: an overview landing (card
grid → sub-pages), a 720-line component-showcase page, and a prose companion —
plus two pieces of exhibit chrome the shell doesn't ship:

- **DesCard** (37L) — showcase-card header: name / description / optional
  details + code snippet, `kol-mono-14/12/10` ramp.
- **WorkshopSidebarContent** — the doc-links block injected into the shell's
  TOC rail via `ShellTocContext`.

Adding the NEXT exhibit section today means rebuilding all of that scaffolding.
Ask: kol-workshop ships the **exhibit-section system** — the overview-landing
pattern, the showcase-page scaffold (sections of DesCard-headed demos), and the
sidebar-links block — so a consumer declares a section as CONTENT (cards, demos,
doc links) and the package renders it.

## Reference implementation

`apps/web/src/routes/workshop/DashboardOverview.jsx` (62L — the landing shape),
`DashboardComponents.jsx` (720L — the showcase shape), `DashboardMetricsSetup.jsx`
(133L — the prose-companion shape), and the two chrome files above. Copy freely —
they are the spec.

## What stays with kol-website

On ship: the dashboard section re-declares as content on the package system;
DesCard + WorkshopSidebarContent + the scaffolding in the three pages retire.
Until then, nothing — the local implementation keeps working.

---

## Resolution — 🟢 closed 2026-08-15

Shipped in **`@kolkrabbi/kol-workshop@0.22.0`** (registry-verified). The
exhibit-section system lives at `packages/workshop/src/exhibit/`, six exports
off the package barrel:

| Export | Replaces | Shape |
|---|---|---|
| `ExhibitOverview` | `DashboardOverview` (62L) | intro + one action + child cards |
| `ExhibitPage` | `DashboardComponents` (720L) **and** `DashboardMetricsSetup` (133L) | sections; `specimens` → card-headed demo grid, `children` → anything, `prose: true` → reading measure |
| `ExhibitSidebar` | `WorkshopSidebarContent` | on-this-page · doc links · quick actions |
| `useExhibitToc` | the copied 6-line `useLayoutEffect` block | registers the rail block, clears on unmount |
| `ExhibitCard` | `DesCard` (37L) | specimen header |
| `ExhibitLinkCard` | `OverviewCard` | landing card |

**One judgement call worth naming.** The brief lists three page archetypes —
landing, showcase, prose companion — and the showcase and the prose page shipped
as ONE component. They were never structurally different: both are a list of
`PageSection`s, and the only thing that varies is what fills a section's body.
A section that carries `specimens` renders the demo grid; one that carries
`children` renders them; `prose: true` adds the 60ch measure. Two components
there would have been two names for one thing, and the next exhibit would have
had to guess which to reach for.

**Drift fixed on recreation, not reproduced.** The rail block hand-rolled its
own collapsible section: `.shell-sidebar-toggle` **and** `.shell-sidebar-label`
stacked on one element, inline `paddingRight`/`paddingBottom`/`justifyContent`,
and its own chevron at L1. All four are precisely what `RailSection` exists to
prevent — the eyebrow-box law (ONE box class, no inline y-spacing) and the
2026-08-01 no-chevron-at-L1 ruling. The rungs come from `RailSection` now, so
this block cannot drift from either rail. The landing card also loses its
`uppercase` utility, per the no-`text-transform` law. `useExhibitToc` closes a
latent loop the copied block left open: keyed on prop *content* rather than
element identity, so an inline array literal is safe.

19 gates clean; the six pieces are registered in the roster
(`showcase/src/nav/classification.js` — two atoms, one molecule, two organisms,
the hook exempt as non-component).

⚠️ **Ships unexercised** — no showcase surface and no adopting app yet, the same
caveat kol-shell 0.1.0 carries. The gates prove it parses and its imports
resolve; nothing has rendered it. kol-website's dashboard section is the first
real exercise, and that is the remainder below.

**Remainder here:** none.
