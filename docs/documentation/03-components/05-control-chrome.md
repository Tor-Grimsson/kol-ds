---
title: Control chrome — the button law
type: reference
status: active
updated: 2026-08-01
verified: 2026-07-08
description: Every interactive control references the Button — two structural variants (primary / outline) plus the role variants (ghost / secondary / accent / danger / grey), one size scale (26/32/40), and interactive fills built on the opaque (oq) tier so nothing goes see-through over content.
aliases:
  - control-chrome
  - chrome-law
  - button-law
tags:
  - domain/design-system
sources:
  - packages/theme/kol-components-atoms.css
  - packages/component/src/atoms/Button.jsx
related:
  - "[[04-diamond-tier|diamond tier]]"
  - "[[01-inventory|component inventory]]"
  - "[[../01-foundations/01-tokens|tokens]]"
---

# Control chrome — the button law

Every KOL control that a user clicks, toggles, or types into wears the **same chrome as the Button**. One vocabulary, one size scale, one state model — so a Dropdown trigger, an Input, a ToggleSwitch, and a SegmentedToggle cell all read as members of one family instead of five bespoke looks. Established 2026-07-08 while root-causing the button-vanish bug (see [[04-diamond-tier|Button, diamond tier]]).

## Variant set

Two **structural** variants carry the hierarchy; the rest are **role** variants with one job each. This replaces the earlier "two variants, ghost retiring" stance — see the ruling below the fill table.

| Variant | Rest | Role |
|---|---|---|
| **primary** | filled `surface-secondary` | The default. Daily chrome. |
| **outline** | transparent + `border-oq-16` | Always secondary to primary. Bordered, no fill. |
| **ghost** | transparent, text `oq-48` | Quiet chrome — icon toolbars, clickable plies, text actions. Pairs with `quiet`/`pressed`. |
| **secondary** | inverted ink | High-emphasis inversion (rare). |
| **accent** | `accent-primary` fill | Brand-accented CTA. |
| **danger** | `--ui-error` fill | Destructive actions — never fake it with a red `className`. |
| **grey** | `oq-12` fill | Quiet filled chrome — dense tool rails, playback transports; also the Dropdown `grey` chrome (rest-only there per the dropdown ruling). |

`default`, `subtle`, `minimal`, `plain`, `control` are **legacy aliases**, not variants (see *Legacy aliases* below).

## Size scale

Padding-driven, not fixed-height — the control hugs its content and the padding + mono type set the height.

| Size | Padding | Type | Height |
|---|---|---|---|
| **sm** | `4px 12px` | `kol-mono-12` | 26px |
| **md** | `6px 16px` | `kol-mono-14` | 32px |
| **lg** | `8px 20px` | `kol-mono-16` | 40px |

## State model

Interactive fills mix ink into the surface via the **opaque (`oq-*`) tier**, never a translucent `fg-*` wash. A translucent fill over an image or panel reads as the control vanishing — the original bug. Decoration that always sits on a panel (dividers, table washes) still uses `fg-*`; anything that can sit over media uses `oq`. See [[../01-foundations/01-tokens|tokens]] → opaque neutrals.

| Variant | Rest | Hover | Active |
|---|---|---|---|
| primary | `surface-secondary` | `oq-08` | `oq-16` |
| secondary | `surface-on-primary` | `oq-inverse-40` (label stays light, no ink swap) | `oq-inverse-48` |
| accent | `accent-primary` | accent 80% into surface (opaque) | accent 70% mix |
| outline | transparent · `border-oq-16` | `oq-02` | `oq-08` |
| ghost | text `oq-48` | `oq-04` | `oq-08` |
| danger *(2026-07-15)* | `--ui-error` fill · absolute-white label | error 80% into surface (opaque) | error 70% mix |
| grey *(2026-07-15)* | `oq-12` fill | `oq-16` | `oq-24` |
| **pressed** (toggle-on) | solid inverted ink (`surface-on-primary` / `surface-primary`) | — | — |

Plus: a `:focus-visible` ring everywhere (2px `--kol-focus-ring`, offset 2); `:disabled` stays `opacity: .5`; the `@media (hover: hover)` touch guards keep hover off touch. The Button `selected` prop is an alias of `pressed`.

## Conformance

| Control | How it wears the chrome |
|---|---|
| **Button** | The origin. Emits `kol-btn kol-btn-{variant} kol-btn-{size}` (+ `kol-btn-icon` when iconOnly — was an inline style, which beat every consumer display utility; chrome is layered CSS now, so `lg:hidden` et al. stay sovereign, brief-2.0 defect 1). |
| **Dropdown** | Trigger emits the `kol-btn` classes (inline-style chrome gone); open state fuses with the panel. Aliases: default/subtle→primary, minimal→outline. |
| **Input / Textarea** | `.kol-control` chrome; `ghost`→`outline` alias. |
| **ToggleSwitch** | Bare by default; optional primary/outline shells at button geometry; track scales; on = inverted ink. |
| **SegmentedToggle** | Cells padding-matched to the button size scale — heights pixel-identical (26/32/40). |
| **Slider** | Exempt — a bare range row, not a pressable surface. One look, no variants (see [[01-inventory\|inventory]]). |

## Chip law

**A declared variant must carry a state (user ruling 2026-08-01).** `Tag`
declared four variants and shipped exactly ONE `:hover` rule between them —
three of its four paths rendered dead, and its own props table advertised them.
Worse, `color` was a second axis that swapped the base class off `.tag-control`,
so passing a colour silently cost the chip its interaction.

`Tag` is rebuilt on **Pill's model**: `primary` · `secondary` · `inverse`, one
size scale (`sm` default), ONE class scheme (`kol-tag--*`), every variant with
hover + active.

| | Was | Now |
|---|---|---|
| Variants | 4 declared, 1 hoverable | **3, all hoverable** |
| Colour | a second axis that broke the base class | **not a prop** — variant is the look |
| Redundancy | `variant="solid"` **and** a `solid` boolean | gone |
| Class schemes | 4 (`tag-control` · `tag` · `tag-naked` · `tag-control-inverse`) | **1** — `kol-tag--*` |

Enforced by **`pnpm validate:chrome`**: C1 every variant class must exist in the
theme, C2 on an **interactive** component every one must carry `:hover`. Pill is
static by contract and correctly exempt — the gate reads interactivity from
code, never from prose.

Tag colour **by taxonomy** returns later as its own decision, layered on the
variants rather than replacing them.

## Overlay chrome

**There was no shared floating surface (user ruling 2026-08-01).** `.kol-modal`
is an unstyled hook, so `ShellSearchOverlay` hand-wrote its own look and
`TagModeOverlay` rendered as a page-like `<article>` with none — one product,
two overlays, nothing in common.

| Was | Now |
|---|---|
| `rounded-[var(--kol-radius-2xl)]` — 20px, used **nowhere else** in chrome | `.kol-overlay-panel` → `--kol-radius-sm` |
| `shadow-[0_20px_60px_rgba(0,0,0,0.4)]` | `--kol-shadow-overlay` (new rung, claimed) |
| `bg-black/60` · `/50` · `/50` across three files | `.kol-overlay-scrim` — one tint |
| tag overlay: no overlay chrome | the same `.kol-overlay-panel` |

`.kol-overlay-scrim` is **look only** — three scrims exist, two `fixed` and one
`absolute`, so baking position in would force a wrong box on two of them.

Two tokens were added rather than improvised: **`--kol-radius-xs: 2px`** (six
hand-written `rounded-[2px]` call sites and no rung) and
**`--kol-shadow-overlay`** (no existing rung fits a floating surface).

**The close control is a Button, not a character (2026-08-01).** `FullscreenOverlay`
hand-rolled a `<button className="kol-overlay-close">` whose entire content was
the literal `×` — a typographic multiplication sign standing in for `x`, a glyph
kol-icons has always shipped. The class hand-drew a bordered square around it, so
the control had no hover, no focus ring and no icon.

It is now `<Button variant="outline" quiet size="sm" iconOnly="x">` — the same
idiom as `ShellLayout`'s close. `.kol-overlay-close` was cut back to **position
only**, its inset on `--kol-spacing-3` (the rung that already carried that
value); the Button brings the box, the border, the colour set and every state.

**No elevation under a modal.** A `--kol-shadow-xl` reached `.kol-media-picker`
the same day and was struck out on the user's ruling — the scrim is the
separation, matching the rail arc's panel-border removal. `--kol-shadow-overlay`
remains the only sanctioned floating-surface rung.

**One tab strip, three copies (2026-08-01).** `PreviewCard`'s Preview/Code row,
`InstallBlock`'s pnpm/npm/yarn/bun row and `CollectionLanding`'s category nav all
hand-wrote a tab button. Two of the three class strings were **byte-identical**
— nine utilities, same active/inactive fork, in two files. None was a component,
so none could be changed once.

They are now `DocTabs` (showcase `lib/`), whose `variant` is **look only**:
`chip` (mono, filled active) and `plain` (sans, ink-weight active). Selection,
keyboard and markup are identical across both. `InstallBlock` became a **call to
`PreviewCard`** rather than a sibling — `tabs` is a prop, `chrome` is
`figure`|`flush`, and the body is the slot that already existed.

`SegmentedToggle` and `TabsRow` were both considered and neither fits: one is a
joined radiogroup, the other an underline strip. This is the third idiom the
docs actually use, so it became one named thing instead of a fourth copy.

**Variants preview in place (2026-08-01).** A demo exports
`export const variants = [...]` and receives the active one as a `variant` prop;
the picker is a `SegmentedToggle` in PreviewCard's **existing** `actions(tab)`
lane. So a component page flips through its variants without a second demo file
and without leaving the page. Demos that don't export `variants` ignore the
prop, so it is additive for all ~180.

**A decorative glyph never wears `kol-btn` (2026-08-01).** `ContentFilters`
wrapped its title icon — and its search icon — in
`<span className="kol-btn kol-btn-secondary kol-btn-md kol-btn-icon">`. Both read
as buttons and click nothing. The title glyph is now `IconFrame`, the atom
promoted on 2026-07-30 for exactly this ("icons only, NO states"); the search
glyph carries no chrome at all, because the clickable thing is the wrapper.
**If it looks like a control it must be one** — a `kol-btn` class on a `<span>`
is the tell.

**ONE code surface, and it already exists.** The Preview/Code tab and the
Installation/Usage rows both render `CodeBlock`; the only difference is its
`bare` prop, which drops the border and radius because the card around it
already provides them. This has been asked repeatedly — the answer is that they
are the same component with one variant, not two systems. Recorded here so the
question stops recurring.

**Token chips are `.kol-table-token`.** It carries its own fill as of
2026-08-01 and no outer margin — spacing belongs to the container. Before that
the look lived only in the `.kol-table code` descendant rule, so the chip
rendered correctly inside a table and unstyled everywhere else, which is why the
component pages hand-rolled a Tailwind lookalike.

Enforced by **`validate:chrome` C3** — arbitrary `rounded-[…]`, `shadow-[…]`,
`bg-black/NN` and `backdrop-blur-[…]` fail in package source. A bracket that
references the scale (`rounded-[var(--kol-radius-sm)]`) passes; so does
`rounded-[inherit]`, which defers rather than states.

## Legacy aliases

The old variant names still resolve for back-compat but are slated for removal:

`default` · `subtle` · `minimal` · `plain` · `control`

Mappings: Button `control`→`ghost` · Dropdown `default`/`subtle`→`primary`, `minimal`→`outline` · Input/Textarea **shells** `ghost`→`outline` (control shells have no quiet-chrome concept — the shell alias does not contradict the Button variant). The plan is to **sweep consumers, then drop all of them in one major bump** — not piecemeal. Slider's `variant` prop is a documented no-op (0.6.0 collapse); the in-repo dead props were swept 2026-07-15.

**Ghost un-retired (2026-07-15 ruling).** The retirement rationale was "near-zero real usage"; that is no longer true — the chess conformance sweep put icon toolbars and clickable plies on `ghost`(+`selected`), and `SplitToolButton`'s trigger contract is literally `kol-btn-ghost` + `quiet`/`pressed`. Ghost is a real variant (the quiet-chrome slot); the AA-contrast question on its `oq-48` resting label is therefore live again — tracked in the parked threads.

## Tool triggers

Three deliberately distinct dropdown-ish triggers — do not merge, pick by contract (their JSDoc cross-references agree):

| Component | Contract |
|---|---|
| **Dropdown** | Text trigger, single-value list selection. Emits `kol-btn` chrome, fused open panel. |
| **ShapeDropdown** | Two-button split: action half fires, chevron half opens the variant menu. |
| **SplitToolButton** | Single 28×28 trigger: ONE click arms the variant and opens the menu (tool-palette idiom). |
