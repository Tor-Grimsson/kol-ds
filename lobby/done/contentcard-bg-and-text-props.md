---
component: ContentCard
source: kol-client-hrafn/apps/web/src/components/site/ProjectCard.jsx#L38-L52
staged: 2026-09-03
status: draft
deps: [ContentCard, ContentText, ContentMedia]
---

# ContentCard — `bg` and `text` props

## Purpose

`ContentCard`'s fill and its ink are **variant-owned with no consumer seam**. A
consumer that wants the shipped card at a different tone has to reach around the
component, which is the one thing the full-consumption contract asks nobody to do.

Found in kol-client-hrafn's project grid: the ask was "same card, grey ground".
There is no prop for it.

## What exists today

`ContentCard` props: `variant · layout · hero · label · pad · tagVariant · media ·
ratio · fit · frame · ring · zoom · flip · fade · plateRule · control · controlStart ·
reveal · actions · expanded · expandedContent · selected · onClick · href ·
onNavigate · className`, plus the `ContentText` slots it forwards.

`ContentText` props: `title · body · eyebrow/kicker · detail · date · size · meta ·
tags`, their eight `*Class` overrides, `form · gap · clamp · tagVariant · className`.

**Neither takes a background or an ink prop.** `ContentMedia` has `bg`, but that is
the media well behind the image, not the card.

So the fill comes only from `BOX[variant].bg`:

| variant | bg |
|---|---|
| `file` | `var(--kol-fg-02)` |
| `catalog` | `var(--kol-fg-04)` |
| `slide` | `var(--kol-surface-primary)` |
| `showcaseCanvas` | `var(--kol-surface-secondary)` |
| `article`, `showcase` | none |

## The ask

1. **`bg`** — a token or scale step for the card's rest fill, overriding `box.bg`
   without touching the hover step. The hover is `--kol-content-hover-bg`, set
   separately, so the two do not have to move together.
2. **`text`** — one ink role for the card's copy (the `--kol-fg-*` roles: `subtle ·
   meta · body · lede · strong · shout · scream · emphasis`), so a consumer can
   set the card's ink level once instead of overriding each slot's ramp string.

The second matters because `titleClass` / `kickerClass` **replace the slot's whole
ramp**, so setting a size drops the ink with it. In this repo `kickerClass="kol-sans-body-01"`
silently lost `text-meta`, which article's kicker ships as `kol-mono-12 text-meta`.
A `text` prop makes the common case ("same card, quieter") one prop instead of
re-specifying every slot.

## Styling — how a consumer has to do it meanwhile

`.kol-card` reads an inline custom property, so a `background-color` utility loses:

```jsx
/* ContentCard.jsx:392 — rest colours are PROPERTIES so the hover class can win */
'--kol-card-bg': box.bg ?? undefined,
```

The working override is to set that property, not the background:

```jsx
className="[--kol-card-bg:var(--kol-oq-48)]"
```

`className="bg-oq-48"` does **not** work, and that is worth a line in the card's
own docstring whichever way this ticket goes.

## Recreation notes

Molecule-level, `packages/component/src/molecules/ContentCard.jsx`. `bg` slots
straight into the existing `--kol-card-bg` line (`bg ?? box.bg`). `text` wants a
decision the DS should make, not the consumer: whether it maps to a wrapper class
that the ramps inherit from, or is applied per slot at build time. The ramps
currently hardcode their ink (`text-meta`, `text-emphasis`, `text-body`), so
inheritance alone will not reach them.

## Filed by

kol-client-hrafn, 2026-09-03. Consumer is unblocked with the `--kol-card-bg`
override above; nothing is waiting on this.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-component@0.183.0

Both props shipped, plus the row, plus the docstring line you asked for either way.

1. bg — slots straight into the --kol-card-bg line as you called it (bg ?? box.bg), so it overrides the variant's rest fill and leaves --kol-content-hover-bg alone. The two still do not move together.

2. text — one ink role across every slot, and it re-inks a <slot>Class override too, which is the half that was impossible before. Your kickerClass="kol-sans-body-01" case is the test in the showcase demo now: the kicker keeps the override's face and still lands on the role.

On the decision you left to the DS — wrapper class vs per-slot: neither works as inheritance, because the ramps hardcode their ink (text-emphasis on a title, text-meta on a date), exactly as your recreation note said. So it is per-slot, applied to the RESOLVED class string: the ink class comes out, the role goes back. The alternation is closed on purpose — text-right / text-center are alignment and survive, and text-fg-NN is stripped too because the hero ramps reach for stops (text-fg-64, text-fg-48) rather than roles and leaving those in would put two inks in one string. It FLATTENS the hierarchy by design, one role for all slots, which is what "set the card's ink level once" means; a card that wants its own relative steps still passes per-slot classes.

3. ContentRow got `bg` in the same pass. Not scope creep — the pair ships together, the row carries the identical --kol-row-bg idiom, and a consumer re-grounding cards in a grid hits the same wall on the rows in that same grid within the minute. `selected` still wins over `bg` there: a selected row is the list's state, not the consumer's ground.

4. The docstring now says what you asked it to say, on both components: the rest colours are custom PROPERTIES so the hover class can win, which is why className="bg-oq-48" does nothing and the reach-around was [--kol-card-bg:var(--kol-oq-48)]. Your workaround is named in the source.

One thing you get for free: `text` lives on ContentText, and both ContentCard and ContentRow forward their unclaimed props to it, so it works anywhere ContentText renders — no per-component plumbing.

Shipped in @kolkrabbi/kol-component@0.183.0, 26 gates clean, showcase builds, verified from the published tarball. Exercised in showcase/src/demos/ContentCard.jsx — three cards: bg on a default, text on an article, and text over a kickerClass override.

**Remainder here:** none — kol-client-hrafn bump kol-component to 0.183.0 and drop the [--kol-card-bg:...] reach-around for bg=; use text= instead of re-specifying slot ramps.

