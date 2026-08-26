---
component: SideNavMobilePosition
source: kol-framework/src/SideNav.jsx#L96 · kol-framework/kol-framework.css#L238-L248
staged: 2026-08-25
status: draft
deps: []
---

# SideNavMobilePosition — every consumer page opens one viewport down on phones

## The defect (kol-website mobile audit 2026-08-25, #1)

Below 768px `kol-framework.css:238` wants the rail out of flow:
`.kol-sidenav { position: fixed; inset: 0 auto 0 0; transform: translateX(-100%) }`.
But `SideNav.jsx:96` also ships Tailwind **`sticky top-0 self-start h-dvh`** in the
aside's className, and that utility wins the cascade (the package CSS sits in a lower
layer than the consumer's utilities). Measured on brand.kolkrabbi.io's tree at 393×852:

```
393  aside position=sticky transform=matrix(1,0,0,1,-280,0) rect=-280,0 280x852 | content top=852
1280 aside position=sticky transform=none                    rect=0,0 256x852   | content top=0
```

The drawer stays **in flow**, `.kol-brand-layout`'s one-column grid hands it an
852px row, the transform only hides it — and the page content starts at `y=852`.
Every page, every consumer of the package SideNav, on every phone.

## Ask

Own the position in the package CSS: put `position: sticky; top: 0; align-self:
start; height: 100dvh` on `.kol-sidenav` in `kol-framework.css` and drop the four
utilities from the className, so the 767px media rule wins by source order like it
was written to. Consumer stopgap in place meanwhile (kol-website
`styles/sidenav-collapse.css`, one media rule) — delete it when this ships.

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.23.0

The aside box moved into `.kol-sidenav` (kol-framework.css) — `position: sticky; top: 0; align-self: start; height: 100dvh; display: flex; flex-direction: column; z-index: var(--kol-z-sticky)` — and the seven utilities left the className; only the colour utilities ride the element now. Same law as 0.15.2 hop fix, one element up: a utility outranks every rule in this layered sheet, so the 767px drawer block `position: fixed` could never win while `sticky` sat on the element. Declared in the rule, the drawer block beats it by source order. Verified by replaying the exact change on brand production DOM (stopgap rule deleted, utilities stripped, the rule + drawer block injected in file order): 393 → aside `fixed` at x=-280, content top 0; 1280 → `sticky`, 256 wide, holds at top through a 600px page scroll. 20 gates clean.

**Remainder here:** none — kol-website bump kol-framework >=0.23.0; delete the stopgap block at the end of `apps/brand/src/styles/sidenav-collapse.css`; re-walk brand at 393.

