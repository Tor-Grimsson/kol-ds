---
component: ThemeToggle (and every component emitting Tailwind utilities)
source: kol-monitor — DS adoption, framework ThemeToggle integration
staged: 2026-08-12
status: draft
deps: [ThemeToggle]
---

# ComponentTailwindSourceTrap — component mechanics ride the consumer's Tailwind scanner

## Purpose
`ThemeToggle` rendered **inert** in kol-monitor: glyph visible, click works, but no roll — the strip doesn't travel, the coin doesn't rotate. No error, no warning, nothing in the console. The user's verdict on seeing it: "that is not my component."

## Current behaviour
- The roll is built from Tailwind utilities emitted in JSX: `overflow-hidden`, `transition-transform`, `duration-500`, `ease-in-out`, `inline-flex`.
- Tailwind v4 **does not scan node_modules**, so a consumer that just does `@import "tailwindcss"` + `@import "@kolkrabbi/kol-theme"` never generates those classes. The component silently degrades to a static glyph.
- The showcase works only because its `index.css` carries `@source "../node_modules/@kolkrabbi/<pkg>/src"` lines — an unwritten consumer contract. kol-monitor had to discover this by diffing behaviour against the showcase.
- Failure mode is the worst kind: **silent visual degradation**. A consumer who has never seen the real animation doesn't even know it's missing.

## Ask
Make component-load-bearing motion/layout self-contained so `@import "@kolkrabbi/kol-theme"` alone yields working components:

1. **Preferred:** own the mechanics in DS CSS. The roll strip's classes become real `kol-*` rules (e.g. `.kol-roll`, `.kol-roll-slot`) living next to `.kol-theme-toggle` in `kol-components-atoms.css` — the component already owns that block. A component's own moving parts shouldn't depend on the consumer's scanner.
2. **If motion primitives accumulate:** a dedicated `kol-animations.css` slice in kol-theme's cascade (there's precedent — the NavLinkUnderline ticket already minted site animation into `kol-utilities.css`). One home for roll strips, reveals, underline draws — instead of per-component scatter.
3. **At minimum:** document the `@source` requirement in the kol-theme + kol-framework READMEs as an explicit consumer contract, with the exact lines to paste.

## Consumer workaround (live in kol-monitor today)
```css
@source "../node_modules/@kolkrabbi/kol-framework/src";
@source "../node_modules/@kolkrabbi/kol-component/src";
```
Works, but every future consumer will hit the same silent wall first.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-theme@0.38.0 + @kolkrabbi/kol-framework@0.19.0**
(registry-verified). Ask 1 (preferred) done: the roll mechanics are now real
DS chrome — `.kol-roll` / `.kol-roll-strip` / `.kol-roll-slot` beside
`.kol-theme-toggle` in kol-components-atoms.css; ThemeToggle's JSX keeps only
per-render geometry inline (widths/transforms). `@import "@kolkrabbi/kol-theme"`
alone now yields the working roll. Ask 3 done: the kol-theme README gained a
"`@source` contract" section with the exact paste-in lines (framework +
component READMEs already carried theirs). Ask 2 (a kol-animations.css slice)
deliberately skipped — two motion utilities don't justify a new cascade file;
revisit when they accumulate. Adoption is kol-monitor's: bump both, optionally
drop its @source workaround for the toggle (the @source lines stay correct
for other utility-emitting components).
