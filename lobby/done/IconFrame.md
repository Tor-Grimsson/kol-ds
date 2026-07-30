---
component: IconFrame
source: kol-website/apps/web/src/components/ui/SectionTitle.jsx#L13-L15
date: 2026-07-30
status: draft
deps: [Icon]
---

# IconFrame

> **USER RULING, 2026-07-30:** the pattern currently exists only as an anonymous
> `<span>` reusing the button classes. *"span? that's fucked up, not even a button?
> …take that span and make it a component for icons with no states."* Promote it to a
> named atom.

## Purpose

A **static** square frame that holds one icon — the visual weight of a button rung with
**none of its interactivity**. Used as a heading ornament, a label ornament, a legend
swatch: anywhere an icon needs the button's box and background but must not read or
behave as a control.

Today this is `SectionTitle`'s unnamed inner span (`kol-btn kol-btn-secondary kol-btn-md
kol-btn-icon` on a `<span>`), which is THE section-header opener across the foundry /
typefaces surfaces in kol-website. It works only because a `<span>` can't take `:hover`
button semantics — the "no states" property is an accident of the element, not a
guarantee of the API. That accident is what this component makes explicit.

## Anatomy

```
IconFrame  (<span>, non-interactive)
└── Icon   (kol-icons, currentColor, solo-glyph size per rung)
```

No label slot, no children beyond the icon, no wrapper chrome.

## Variants

`variant` = the background/foreground pairing, **borrowed verbatim from the `kol-btn`
colour set** so the frame sits in the same visual system as real buttons.
The eight shipped rungs (`kol-components-atoms.css:243-365`):

| variant | background | foreground |
|---|---|---|
| `primary` | `--kol-surface-secondary` | `--kol-surface-on-primary` |
| `secondary` *(the one in use)* | `--kol-surface-on-primary` | `--kol-surface-primary` |
| `accent` | `--kol-accent-primary` | pair token |
| `outline` | transparent + border | ink |
| `ghost` | transparent | ink |
| `nav` | transparent, quiet ink | ink |
| `grey` | grey fill | ink |
| `danger` | danger fill | pair token |

Both `primary` and `secondary` are **inverse pairs that flip with the theme** — that's
the "natural themed light and dark" the ruling asks for, and it comes free from the
tokens. No per-theme props.

## Props

| prop | type | default | controls |
|------|------|---------|----------|
| `name` | string | — (required) | icon name, passed to `Icon` |
| `variant` | `'primary' \| 'secondary' \| 'accent' \| 'outline' \| 'ghost' \| 'nav' \| 'grey' \| 'danger'` | `'secondary'` | background/foreground pairing |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | square + glyph, moved together |
| `className` | string | `''` | escape hatch |

**Deliberately absent:** `onClick`, `href`, `disabled`, `aria-pressed`, `title`. If any of
those are wanted, the consumer wants a `Button` with `kol-btn-icon`, not this.

## Styling

Square geometry from `.kol-btn-icon` + the rung (`kol-components-atoms.css:239-241`):

| size | square | glyph |
|---|---|---|
| `sm` | 28 × 28 | 16 |
| `md` | 32 × 32 | 20 |
| `lg` | 36 × 36 | 24 |

Glyph sizes follow the **solo-glyph law** (16/20/24 — the pinned-square pairing), not the
text-adjacent ladder.

Colour tokens: exactly the `.kol-btn-{variant}` declarations listed above. No new tokens.

**What must NOT carry over from `kol-btn`** — this is the whole point of the component:
- every `@media (hover: hover) .kol-btn-*:hover` rule (lines 249, 262, 276, 288, 301, 320, 343, 360)
- `:active` background shifts (line 372 and siblings)
- `.kol-btn:focus-visible` (line 223)
- `:disabled` handling, `.kol-btn-pressed` (line 838), `.kol-btn-animate` (386)

Reusing `kol-btn-*` classes on a `<span>` suppresses these *by element*, which is fragile —
the moment someone changes the element or a rule stops requiring `:hover` on a focusable,
states leak back in. **Give `IconFrame` its own class (e.g. `.kol-icon-frame`,
`.kol-icon-frame-{variant}`, `.kol-icon-frame-{size}`) that declares the same
background/colour/geometry and simply has no state rules to inherit.**

## States & interactions

**None, by design.** No hover, no active, no focus ring, no disabled, no cursor change,
no transition. It is not tabbable (`<span>`, no `tabIndex`). If it conveys meaning rather
than decoration the consumer supplies its own `aria-label` / `role="img"`; otherwise the
icon stays `aria-hidden`.

## Dependencies

`Icon` from `@kolkrabbi/kol-icons`. Nothing else.

## Recreation notes

- **Tier:** atom (`packages/component/src/atoms/IconFrame.jsx`).
- **Own class, not `kol-btn`.** The current implementation borrows button classes; the
  component must declare its own so "no states" is a property of the CSS, not of the tag.
  Keep the computed background/foreground/geometry byte-identical to the `kol-btn`
  equivalents so existing surfaces don't shift a pixel.
- **`size` moves square and glyph together** — one prop, never two.
- **No text-transform, no casing logic** — it holds an icon, nothing to case.
- **Migration:** kol-website's `SectionTitle` (`apps/web/src/components/ui/SectionTitle.jsx`)
  is the first consumer and swaps its inner span for `<IconFrame name={icon} size="md" />`.
  Its sibling — the text half, `kol-btn kol-btn-md kol-helper-16` on a span — has the same
  smell and is a candidate for the same treatment later; out of scope here.
- Immediate second consumer: kol-website apps/brand sidebar, `variant="secondary" size="lg"`.

---

## RESOLUTION — 2026-07-30, shipped in `@kolkrabbi/kol-component@0.15.0` + `kol-theme@0.13.4`

Built to spec at `packages/component/src/atoms/IconFrame.jsx`; CSS at
`packages/theme/kol-components-atoms.css:887`.

**Own classes, not `kol-btn`** — the load-bearing requirement. `.kol-icon-frame`,
`.kol-icon-frame-{variant}`, `.kol-icon-frame-{size}` declare the same background,
foreground and geometry and have no state rules to inherit: no `:hover`, no `:active`, no
`:focus-visible`, no `:disabled`, no transition, no cursor. "No states" is now a property
of the CSS instead of an accident of the tag.

All eight variants shipped as specced, sizes `sm|md|lg` on the pinned squares 28/32/36
with the solo-glyph ladder 16/20/24. `onClick` / `href` / `disabled` / `aria-pressed` /
`title` deliberately absent. Tier: atom. `FUNCTIONS_BY_NAME: display`. Barrel-exported.

**Migration verified by measurement, not eyeball.** The `md` `secondary` frame was
compared in-browser against the `kol-btn` span it replaces: **zero differing computed
properties** — width, height, border-radius, background, colour, border, padding, display,
align-items, justify-content all identical, glyph 20px in both. Existing surfaces will not
shift a pixel.

### User note at approval

*"nope we dont need all those variants.. but I guess it doesnt matter — ahh just ship it."*

Shipped with all eight because that is what this brief specifies and trimming the API
against a filed spec without an explicit instruction is the improvisation this repo keeps
paying for. **Only `secondary` has a consumer today**; `nav` and `outline` are the
plausible next two. Cutting the set to those three is a one-line change to `IconFrame.jsx`
plus deleting the unused CSS blocks — say the word and it is a patch bump.

### Not done here

`SectionTitle` in kol-website still renders its own span — the consumer migration is that
repo's edit, not this one's. Its sibling (the text half, `kol-btn kol-btn-md
kol-helper-16` on a span) has the same smell and was explicitly out of scope.
