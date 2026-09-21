# page-family-is-not-a-set — four components, three prefixes, two primitives, no set

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-framework@0.38.0` — `src/{PageSection,BrandHero,SubPageHero}.jsx` + `kol-framework.css` · `@kolkrabbi/kol-component@0.175.0` — `src/molecules/{ContentText,SectionText}.jsx`
**Origin:** the user, looking at olina's brand app after its full-consumption pass came back six-of-six: *"why do 3 of 4 prefix PAGE if they are a set?"* — then, on the containers: *"regions cards bands, whats the fucking difference, they read exactly like cards"*.

## The problem

Four components form a brand-book page kit. Nothing about them says so.

| component | prefix | composes a text primitive? |
|---|---|---|
| `PageSection` | `Page` | no — hand-stacks `kol-prose-label` / `-title` / `-lede` |
| `BrandHero` | `Brand` | no — hand-stacks the same three |
| `SubPageHero` | `SubPage` | no — hand-stacks the same three |
| the brand layout | — | **no component exists**; `kol-framework.css` ships 15 `.kol-brand-layout` rules and every consumer copy-pastes the markup |

**Three prefixes over four names.** Three-of-four is the worst case: it reads
like a convention without being one, so nothing tells you whether the fourth is
outside the set or was simply missed.

**The two heroes are one component.** Same core, different optional slot:

```
BrandHero    ({ id, label, title, lede, mark })
SubPageHero  ({ backTo, backLabel, label, title, lede })
```

**And underneath, there are two text primitives for one job.** This is the part
that reframes the ticket — it is not three components duplicating one primitive,
it is two primitives, and everything above them inherits the split:

```
ContentText  variant · form(card|hero) · eyebrow · title · body · detail · date · size · meta · tags
SectionText  eyebrow · label · headline · headlineSize · headlineAs · body · actions
```

Both render an eyebrow, a title and a body. Both carry their own scale ramp.
`ContentText` already has a `hero` form. `ContentCard` composes one,
`PageHeader` composes the other (as of 0.175.0), and the three components above
compose neither. The user's read: the container distinction — card vs region vs
band — is not what separates them, because the text block inside all of them is
the same block.

`SectionText` was ruled a BASE on 2026-09-03 ("built with, never used
directly"). No component in `kol-framework` imports it.

## The asks

**1 — Rule which primitive is the base.** A question, not a proposal: does
`SectionText` merge into `ContentText`'s ramp, does `ContentText` keep the card
tier and `SectionText` the page tier as a deliberate two-primitive design, or
does one absorb the other? **This gates ask 2**, because the family has to
compose whichever wins, and merging them touches every card and every section in
the estate. Not something a consumer should decide.

**2 — The family composes the ruled primitive** instead of hand-stacking label /
title / lede. Internals only, no consumer edits — the same move `PageHeader`
made in 0.175.0.

**3 — `SubPageHero` merges into `BrandHero`** as a back-link slot (`backTo` /
`backLabel` beside the existing `mark`), and the result **renames to
`PageHero`**. Alias both old names for one version, record in
`docs/operations/01-release/04-retirements.md`. One hero, one prefix.

**4 — `kol-framework` ships `PageLayout`** beside the `.kol-brand-layout` rules
it already ships. Today the stylesheet is the design system's and the markup is
every consumer's own copy; olina's `BrandLayout.jsx` is 112 lines of it.

**5 — `PageSection` keeps its name.** Stated so it is not reopened: the name is
already correct for the set, and it is the expensive one to change (81 consumer
files against 7).

After 3 and 4 the set reads `PageHero` · `PageSection` · `PageLayout` — one
prefix, every member.

## Blast radius

| what | consumer files |
|---|---|
| `BrandHero` + `SubPageHero` (asks 3) | **7** — kol-website 2 · kol-client-hrafn 3 · kol-client-olina 2 |
| `PageSection` (ask 2, internals only) | **81** — kol-website 39 · kol-client-hrafn 21 · kol-client-olina 21 |

Ask 2 needs no consumer edit, but a regression in it lands in 81 places at once.
Ask 3 is nearly free where it buys the naming, and is not attempted where it
would not.

## Consumer status

kol-client-olina's `apps/brand` is on `PageSection` and `BrandHero` today (both
retired from local forks 2026-09-03) and takes the rename when it ships. Its
local `BrandLayout.jsx` retires against ask 4. Nothing is worked around
meanwhile — the app is six-of-six on the full-consumption greps as it stands;
this ticket is about what those greps cannot see.

## Related

- `page-header-one-masthead` (2026-09-03, closed) — the same duplication one
  level up, between `SectionText` and `kol-shell`'s `PageHeader`. Closed by
  moving `PageHeader` to `kol-component` and, in 0.175.0, composing
  `SectionText`. This ticket is that argument applied to the package the
  masthead ticket did not reach.
- `layout-skip-link` (2026-09-03, closed) — found in the same pass.

## ✅ RESOLUTION — 2026-09-03 · kol-framework@0.39.0

Ask 1 ruled: `ContentText` and `SectionText` stay two primitives by tier — a listing item's text (data slots, variant × form ramp, betweens and stacks, truncation) and a region's head (eyebrow · headline · body · actions); neither absorbs the other. The test — data lines beside a title → `ContentText`; a head that introduces what follows → `SectionText` — is written into the section-system and content-card docs. Ask 2: `PageSection` and the hero compose `SectionText` with the `kol-prose-*` voices passed as the base's seams, gap 0 — internals only, the 81 files untouched, pixel-identical bar the base's `text-wrap: balance` on the headline. Ask 3: `PageHero` = `BrandHero` + `SubPageHero` (`mark` and `backTo`/`backLabel` both kept, voices `BrandHero`'s verbatim); both old names alias it, rows on the retirements ledger. Ask 4 was already shipped under the wrong name: kol-framework's `AppShell` IS the `.kol-brand-layout` markup every `BrandLayout.jsx` in the estate copies. Renamed `PageLayout`, `AppShell` aliased, and the two things the forks carried folded in — `pageWash` (the plane's wash over the primary back; kol-shell's prop and `--kol-shell-page-wash` variable) and `bare` (plane + outlet only, the `?embed=1` branch). Its back is `surface-primary` now, per the brand rulings. Ask 5: `PageSection` keeps its name. Olina's `BrandLayout.jsx` retires onto `<PageLayout navTree={NAV_TREE} pageWash="var(--kol-fg-02)" bare={embedded} sideNav={{ isActive, background: false }} />` — the scroll-spy `isActive` and `useEmbed` stay app-side and are passed in. On the ticket's blast radius: package importers of `BrandHero` are olina's two files and of `SubPageHero` none — the other five files are local forks.

**Remainder here:** none — kol-client-olina bump kol-framework@0.39.0 (pin the number, not @latest); retire BrandLayout.jsx onto PageLayout; BrandHero → PageHero at the two call sites (the alias holds meanwhile).

