---
component: NestedDsDependencies
source: kol-workshop · kol-chess · kol-content · kol-foundry · kol-store package.json (dependencies on the tier below)
staged: 2026-08-26
status: draft
deps: [kol-component, kol-framework, kol-theme, kol-icons]
---

# NestedDsDependencies — app packages pin the tier below as `dependencies`; pnpm nests a stale copy and DS fixes never reach the consumer

## The defect (kol-website bump wave 2026-08-26)

kol-website bumped component ^0.68.1 · framework ^0.23.0 · theme 0.51.0 to consume
the four mobile returns. Playwright at 393 then showed **two of the returns not
present**: the ShellHeader active tab still sat at x=347–445 in a 24–369 strip
(a `scrollLeft` setter trap recorded zero writes on a fresh load), and the docs
reader's CodeBlock rendered `<code style="white-space: pre">` with no
`.kol-codeblock-line` stamps. The browser was loading kol-component 0.68.1 for the
app's own imports — and **0.39.0** for the one `DocumentationReader` makes.

The cause is packaging, not code. Each app package declares the tier below as
`dependencies` with a 0.x caret, and pnpm resolves a package's deps from its own
lockfile entry, so every one of them carries its own copy:

| Package | Declares | Resolves beneath it (kol-website, 2026-08-26) |
|---|---|---|
| kol-workshop 0.22.0 | component ^0.39.0 · framework ^0.20.0 · theme ^0.41.0 · icons ^0.16.0 | component **0.39.0** · framework **0.20.1** · theme 0.41.0 · icons 0.16.0 |
| kol-chess 0.6.0 | component ^0.38.0 · theme ^0.41.0 · icons ^0.16.0 | component **0.38.0** · theme 0.41.0 · icons 0.16.0 |
| kol-content 0.8.1 | component ^0.63.0 · theme ^0.48.0 · icons ^0.18.0 | component **0.63.0** · theme 0.48.0 |
| kol-foundry 0.5.6 | component ^0.52.0 · theme ^0.46.1 · icons ^0.17.0 | component **0.52.0** · theme 0.46.1 · icons 0.17.0 |
| kol-store 0.1.1 | component **0.8.0** · theme **0.7.3** (exact) | component **0.8.0** · theme 0.7.3 |
| kol-dashboards 0.2.3 | **peerDependencies** | the app's 0.68.1 · 0.51.0 · 0.18.0 ✓ |

Two consequences. A `^0.39.0` on a 0.x line means `<0.40.0`, so no consumer bump
can ever move it — `pnpm dedupe` is powerless. And a consumer page that mounts a
component through one of these packages gets that package's copy: `ShellLayout`
→ `ShellHeader` from framework 0.20.1, `DocumentationReader` → `CodeBlock` from
component 0.39.0, `ListingCard` internals from 0.63.0, the prints grid from
component **0.8.0**. Every kol-component fix since those versions has been
invisible on those surfaces. WorkshopShellMobile's return said "kol-workshop
unchanged, nothing to bump" — true of its source, false of what it renders.

## The fix

Declare the tier below as **`peerDependencies`** (with a matching
`devDependencies` entry for the showcase/build) in kol-workshop, kol-chess,
kol-content, kol-foundry and kol-store — exactly what kol-dashboards already
does. The consumer supplies one copy; the range is a floor, not a pin. kol-framework
→ kol-component (`^0.68.1` today) is the same class one level down and can move
with it. Republish the five.

API compatibility is not a risk: every named import each of the five takes from
`@kolkrabbi/kol-component`, `kol-framework` and `kol-icons` exists in the
0.68.1 / 0.23.0 / 0.18.0 barrels (walked mechanically, 54 names, 0 missing).

## Consumer stopgap in place

kol-website's root `package.json` carries `pnpm.overrides` forcing one copy of
component / framework / theme / icons. With it: fresh load at 393 lands the
Dashboard tab at 79–177 inside the strip (scrollLeft 268); the docs CodeBlock
computes `pre-wrap`, 311/311, 9 stamped lines, 44px lane on the chipless block;
`/prints` (store), `/workshop/chess`, `/foundry/typefaces/malromur` render with
zero console errors. The override block is deleted the day the packages ship
peers — that is kol-website's 📌 on this ticket.

## Definition of done

- [ ] kol-workshop · kol-chess · kol-content · kol-foundry · kol-store: DS tier as `peerDependencies`, published
- [ ] `pnpm why @kolkrabbi/kol-component` in a consumer lists ONE version
- [ ] Receipt back so kol-website deletes its `pnpm.overrides` block

## ✅ RESOLUTION — 2026-08-26 · kol-workshop@0.23.0 · kol-chess@0.7.0 · kol-content@0.9.0 · kol-foundry@0.6.0 · kol-store@0.2.0

The DS tier is a peer in all five. kol-component · kol-theme · kol-icons (+ kol-framework in workshop) moved from `dependencies` — a 0.x caret, so pnpm nested a private stale copy under each package (component 0.39.0 under workshop, 0.8.0 under store) — to `peerDependencies` with `>=` floors: component >=0.68.1 · framework >=0.23.0 · theme >=0.51.0 · icons >=0.18.0, the versions the ticket's 54-name import walk was made against; `workspace:^` in devDependencies for the showcase — the kol-dashboards / kol-shell shape. Registry-verified on all five: `peerDependencies` carries the tier, `dependencies` carries none of it (workshop keeps kol-brand ^0.1.2, not a DS-tier package). The floors are honest, not lenient — a consumer below them gets a peer warning until it bumps. Not touched, same class, outside the five: kol-framework → component/icons, kol-component → icons and kol-styleguide → component/foundry/icons/theme still declare `dependencies`; framework moves with its next publish if ruled. Topology doc §Dependencies now states the rule; every changelog flags it BREAKING.

**Remainder here:** none — kol-website bump to kol-workshop 0.23.0 · kol-chess 0.7.0 · kol-content 0.9.0 · kol-foundry 0.6.0 · kol-store 0.2.0, delete the root `pnpm.overrides` block, then `pnpm why @kolkrabbi/kol-component` → ONE version (the ticket's own bar).

