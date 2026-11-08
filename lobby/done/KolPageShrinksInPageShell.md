# `.kol-page` must fill PageShell, not shrink to its content

**Staged:** 2026-11-08 · from a kol-foundry session (kol-kerner)
**Change:** one CSS rule, one line

---

## The problem, in one case

kol-kerner renders `DocumentIndex` (kol-framework) inside `PageShell mode="scroll"` (kol-shell). `.kol-page` centres itself with `margin: 0 auto` (`packages/framework/kol-framework.css:451`); `.kol-shell-page` is a flex column (`packages/theme/kol-components-shell.css:55`). In a flex container, auto margins stop the item stretching, so `.kol-page` shrinks to its content instead of filling up to `--kol-container-max`.

Result at 1440 with the rail open: `/specimens` is 652px wide, `/index` is 1056px — two pages of the same component, different widths, each set by how long its text happens to be.

## The fix

Give `.kol-page` `width: 100%` (it keeps `max-width: var(--kol-container-max)` and `margin: 0 auto`, so it still centres above the cap). Every `.kol-page` inside a flex parent gets the same fix.

## Rejected alternative

A wrapper `<div>` in each consumer (tried in kol-kerner and reverted — consumers do not patch DS bugs). It works, but every app pairing PageShell with a `.kol-page` would need its own.

## Definition of done

- [ ] `DocumentIndex` inside `PageShell` is as wide as `--kol-container-max` allows (less the shell padding), whatever its content.
- [ ] kol-kerner `/index` and `/specimens` are the same width after a bump.

## ✅ RESOLUTION — 2026-11-08 · kol-framework@0.74.1

`.kol-page` takes `width: 100%` + `box-sizing: border-box` (max-width and auto margin kept), so inside a flex parent it fills to `--kol-container-max` whatever its content. Checked at 1440 in a flex column: 1440 wide with short content (no overflow); at 2400 it caps at 1600 and centres. Doc: `docs/documentation/01-foundations/05-layout-systems.md` history.

**Remainder in kol-foundry:** kol-kerner bumps kol-framework@0.74.1 and drops its two `<div>` wrappers on `/index` and `/specimens`.
