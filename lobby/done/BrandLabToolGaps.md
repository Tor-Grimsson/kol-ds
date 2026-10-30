# Brand lab tools: TypeScaleLab and ColorLab leave out what a brand definition needs

**Staged:** 2026-10-29 · from kol-atlas (plan `.kol/llm-plan/08-lab-app.md` § 4.5; user: *"IS gen-color cood enough of a tool to generate whats needed?"* and *"you also said that color and type needed to be changed to account for the output right?"*)

## Context

kol-atlas's identity lab (`apps/lab`, `/lab/gen`) now runs kol-styleguide's brand lab as shipped (0.14.1): `TypeScaleLab`, `ColorLab`, `ComboLab`, `LockupBuilder`. Its type page (`/lab/t1`) is generated from `typeScale` / `typeScaleCss`, and its colour page (`/lab/c1`) will be generated from `deriveColorLab` / `colorLabCss`. Whatever the tools leave out, the lab sets by hand — listed here so the tools can cover it.

## TypeScaleLab / typeScale — sizes and line heights only

What kol-atlas hand-sets because the generator has no say over it (`apps/lab/src/roles.css`):
- **role → step:** 16 roles (display 1–2, h1–h6, quote, lead, body, small, caption, eyebrow, label, data) mapped onto the 8 `TYPE_STEPS`. Several roles share a step (quote · h4 · lead on `heading-4`; six roles on `small`).
- **weight, tracking, case** per role (e.g. h1 700 / −1.5 %, eyebrow 500 / +8 % / upper).
- **face per role** beyond `display · heading · text` — there is no mono face (eyebrow, label, data are DM Mono).
- **colour / opacity per role** (today KOL's text levels: emphasis, lede, body, meta, strong).
- **line-height factor** is fixed per step (1.2 / 1.5); a brand cannot tune it.

## ColorLab / deriveColorLab — a palette, not a colour definition

Missing for the output to be usable as a brand's colour tokens:
- **text-on-colour contrast:** no AA/AAA check or ratio shown for ink on each slot or ramp step. `fgOn` only picks black or white ink for the mix tiles (`ColorLab.jsx:123`); it reports no contrast.
- **dark mode:** one palette, no dark counterpart for the slots.
- **text opacity levels:** no ink ramp of its own (brands borrow KOL's `--kol-fg-*`).
- (from kol-fxr, the user's reference) the palette should come from **one base colour**; FXR's Color Modes and Adobe Color both work that way. Comparison to follow from kol-atlas's W6 research.

## What to do

A ruling with the user on which of these the tools should own, then the changes in kol-styleguide. Nothing here asks for a new component.

## Definition of done
- [ ] Ruling on scope (which gaps the tools take on)
- [ ] TypeScaleLab / typeScale changes shipped
- [ ] ColorLab / colorLab changes shipped
- [ ] published


---

## ✅ RESOLVED — 2026-10-29

**Ruling (the user, 2026-10-29):** *"sure I dont care, just deal with atlas about it. only thing I think is that the group of those tools that generate should ship together with combolab and logo lockup generator, and have unified name system"*. Every gap the ticket lists is taken on; one base colour was already ColorLab's model (a base plus a harmony rule). How the colour engine should compare with FXR and Adobe Color is in kol-atlas's W6 research and waits for the user's call.

Shipped **kol-styleguide 0.17.0**.

- **One name system, one subpath.** `@kolkrabbi/kol-styleguide/lab` ships `TypeLab` · `ColorLab` · `ComboLab` · `LockupLab`, each with `<x>Lab(value)` · `<x>LabCss(…)` · `DEFAULT_<X>_LAB`. The main barrel exports the same names. The old names are 30-day aliases on the retirement ledger: `TypeScaleLab`, `typeScale`, `typeScaleCss`, `DEFAULT_TYPE_SCALE`, `deriveColorLab`, `DEFAULT_PALETTE`, `LockupBuilder`.
- **Type:**
  - `TYPE_ROLES` is your sixteen roles on the eight steps, each with face, weight, tracking, case and ink, overridable in `value.roles` and editable in TypeLab's roles table.
  - There is a fourth face, `mono`, and each step has a line-height factor (`value.leading`).
  - `typeLabCss(value, { faces })` emits the faces, the steps, the role variables and a `.type-<role>` class each, whose colour is `var(--brand-ink-<level>)`.
- **Colour:**
  - Every swatch's info shows its contrast ratio and grade against the brand's own ink (Brand black on light, Light on dark), floored so 4.49 never reads as 4.5.
  - Ink shows the brand's five text levels on its light and dark grounds, measured at their opacity.
  - Dark shows the slots swapped, with each role and composition share moved along its blend ramp until it passes AA on the dark ground.
  - `colorLabCss` emits `--brand-ink-*` and a `[data-theme="dark"]` block.
- **Combo:** `ComboLab onChange(palette)`, `comboLab({ pool, mode, current, locks, base })`, `comboLabCss` (`--brand-combo-*`).
- **Walked** in apps/brand-lab, which has Color · Type · **Combo** · Logo · Guide · Export, on the new names from `/lab`:
  - the roles table, with eyebrow drawn in JetBrains Mono, uppercase, at +0.08em;
  - Ink and Dark with their grades;
  - a Combo randomise reaching the draft;
  - Export showing the ink, the dark block, `.type-eyebrow` and the combo variables.

**Remainder at kol-atlas:** bump; move to the lab names; generate `roles.css` from `typeLabCss` and `/lab/c1` from `colorLabCss`.
