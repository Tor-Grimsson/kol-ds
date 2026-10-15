---
title: Twenty-two packages, one consumer each
type: narrative
status: draft
created: 2026-10-14
updated: 2026-10-14
description: The technical draft of the KOL post
aliases:
  - stack-technical
tags:
  - domain/stack
  - audience/public
related:
  - "[[01-conceptual|conceptual]]"
  - "[[03-mixed|mixed]]"
  - "[[04-graphics|graphics]]"
---

# Twenty-two packages, one consumer each

KOL is a React design system published as raw source under `@kolkrabbi/*`. It runs a handful
of tools, most of which are the only consumer of the package they depend on. This is how it is
built, why the round trip hurts, and where we cut it.

## Origin

The system was re-split from a single application into four packages on 2026-06-15: `theme`
(CSS only), `icons`, `component` and `framework`. Everything since has been lifting a domain
out of `component` the moment a second consumer existed. Dashboards, chess, content, foundry,
store and the application shell all went that way. Today the published surface is twenty-two
packages across four tiers.

The brand was the starting point, and it is now a dependency like any other. `kol-brand` is a
manifest: ramps, type, logo SVGs. `kol-brand-template` is the schema that manifest conforms to,
plus a CSS generator. The theme reads `--brand-*` custom properties; swap the manifest and
nothing else changes.

## The shape

```text
foundation   kol-theme (all CSS)   kol-icons (344 icons, one loader)
core         kol-component         kol-framework (site)   kol-shell (app)
domain       workshop · dashboards · hardware · chess · content · foundry · store · styleguide · notes · deck
engines      kol-markdown · kol-search   (plain JS, no React, no DOM)
clients      kol-media-client            (one package per service contract)
app          design-editor               (the one built package)
```

Two rules hold the tiers apart. Cross-package imports use the `@kolkrabbi/*` specifier; inside
a package, imports stay relative. And dependencies point one way: a domain package peers on
`component` and `theme` with a `>=` floor, never the reverse, and an engine may depend on
another engine but never on a UI package.

The peer floor is not pedantry. A `0.x` caret in `dependencies` makes pnpm nest a private copy
of the tier under the domain package, so a consumer's bump never reaches the surfaces that
package renders. We shipped that bug before we wrote the rule.

## No build

Packages publish `.jsx` and `.css` as written. There is no `dist/`, no transpile, no bundler
config to keep alive. A consumer can open `node_modules/@kolkrabbi/kol-component/src/atoms/Button.jsx`
and read the thing it is rendering.

That choice constrains the consumer. It must be Vite, because the icon loader uses
`import.meta.glob`. It must be Tailwind v4, and it must tell Tailwind to scan the packages,
because Tailwind skips `node_modules` by default:

```css
@import "tailwindcss";
@source "../node_modules/@kolkrabbi/kol-*/src";
@import "@kolkrabbi/kol-theme/kol-theme.css";
@import "@kolkrabbi/kol-framework/kol-brand-color.css";
@import "@kolkrabbi/kol-framework/kol-framework.css" layer(components);
```

The order is load-bearing and so is the `layer()`. Unlayered rules outrank every layered rule
regardless of specificity, so a bare framework import silently promotes its chrome above the
theme's type classes. Two consumers rendered the same package version at two font sizes before
that line was written down.

## The seam

Inside the repo the packages depend on each other with `workspace:*`, and the showcase consumes
them the same way. A change is live everywhere on save.

Outside, consumers install versioned packages from npm. No symlinks, no path aliases, no
`workspace:*` ever reaches a consumer. The repo is the only place a package is versioned; if
that sounds like a truism, see the editor below.

## Round trips

The workflow for a change that originates in a consumer:

1. The consumer files a ticket into the system's `lobby/inbox/`, a markdown spec with the ask,
   the evidence and the file-and-line it found the problem at.
2. The system builds it, runs the gates, publishes a version and cites it in the ticket.
3. The consumer bumps, verifies, and the ticket closes.

Since mid-August that loop has closed 326 tickets. The ledger shows what they were: a
`MenuDropdownItem` rendered `inline-flex` so rows measured side by side; a `Dropdown` trigger
with no `ariaLabel` prop; a selection overlay's size label that rotated with its box. The fix
for the first was one word. The round trip for it was the same as for a new component.

A library with many consumers amortises that cost. Most KOL packages have one. The hardware
package has three consumers and that is the high end.

## Fork & return

On 2026-10-08 we stopped running the editor through the loop.

`@kolkrabbi/design-editor` is the largest package and the one under the most active
development. Its consumer, the fxr tool, took `packages/design-editor/src` local and develops
it there. The copy in the system repo is now a mirror, refreshed from fxr's source after the
fact, and it keeps publishing the package for the other consumers from what fxr has shipped.

The direction of asks is unchanged. Component-tier parts still belong in `kol-component`, and
fxr files tickets for them as before. What changed is that the application is developed where
it runs, and the system catches up rather than gating.

The editor is also the one package that ships a build. It carries pixi, three and d3, and one
`<DesignEditor />` export that owns its own router and state. Raw-source publishing exists so a
consumer can read and patch a component; that argument does not reach a 4 MB compositor.

## Function first

The hardware tier is the clearest case. A rack fader is a 2px track on a 24px panel. It is not
a `Slider` with different padding, and treating it as one would have produced a worse fader and
a worse slider. So `kol-hardware` ships knobs, faders, LEDs, jacks and module frames as their
own tier, built in the rack, under use.

Then the rulings came. A control that does the same job as a core control became that control's
`variant="panel"` instead of a second component: `Fader` is now `Slider`, `Knob` is
`RotaryDial`. What stayed in hardware is what has no app twin.

The same happened to colour. Icons take `oq-*` (opaque) ink stops, never `fg-*` (translucent),
because translucent strokes show their overlaps. The sizes ladder, 22 · 26 · 32 · 40, was
measured off shipped controls and then enforced. Thirty-odd `validate:*` scripts now run on
every change, and almost every one of them was written after the thing it checks had already
gone wrong once.

## What works

- **One copy.** `kol-shell` replaced two hand-copied application shells that had already
  drifted (a shared dead import, a shared light-theme bug). The signal engine in
  `kol-hardware/signal` replaced four copies of the same expression compiler.
- **Tickets as specs.** A lobby entry is a brief the system recreates from, not source it
  copies. The spec carries the props, the seams and the coupling to drop.
- **Prove by use.** `apps/*` runs each system as a real clickable program over in-memory data
  before anything is published. The media library, the rack, the mixer and the editor all went
  through that.
- **Gates over opinion.** A doc is the rule, a green gate is proof, unexamined source is
  neither. Code is the current state, and the current state can be wrong.

## What doesn't

- **One consumer per package.** The round trip protects nobody until a second consumer exists.
- **Ruling without context.** The system set `ArticleCard` geometry twice and was wrong twice.
  The site rendering the cards now owns the spec; the system conforms.
- **Publishing from the wrong place.** The editor was published from fxr's own `package.json`
  for two months at `0.1.0`, pinning a dependency that no longer existed. No gate touched it.
  A package in this scope is versioned here or it is not versioned at all.
- **The docs shell is a consumer too.** The showcase imported the framework CSS without
  `layer(components)` and rendered header tabs at 16px while the website rendered 14px.
  Identical CSS. The fix was one word, and a rule.

## Next

The fork-and-return pattern is one case. Whether it becomes the pattern for every
single-consumer package is the open question, and the honest answer is that it depends on how
much the gates catch when the system is no longer in front of the change.

## Sources

- KOL, the live system: https://ui.kolkrabbi.io
- The packages: https://www.npmjs.com/org/kolkrabbi
- The source: https://github.com/Tor-Grimsson/kol-ds
- Tailwind v4 source detection: https://tailwindcss.com/docs/detecting-classes-in-source-files
- CSS cascade layers: https://developer.mozilla.org/docs/Web/CSS/@layer
