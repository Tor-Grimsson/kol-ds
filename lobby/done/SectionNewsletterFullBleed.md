# SectionNewsletterFullBleed — the card's fill is clipped by the page gutter

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `SectionNewsletter.jsx`

## The gap

The newsletter card is a **filled** surface, and it sits inside `.kol-page`. So on
mobile the page gutter clips its background: the fill stops 20px short of each
screen edge and leaves white strips down both sides of the colour.

A filled card at full width is the normal mobile treatment — the fill breaks the
gutter, the content keeps it. There is no prop for that: the organism takes
`className` (`:47`, `:69`), but the fill and the content padding are the same box,
so a consumer cannot bleed one without dragging the other out with it.

User's words on the same pattern elsewhere on the page: *"the background is not
supposed to break with padding"* and, for the Instagram section, *"make padding 0
and instead pad the text"*.

## The ask

A way for the card to bleed its fill to the container edges while its content
stays on the page measure. `fullBleed` as a boolean is the obvious shape and
matches `SectionHero`, which already has one — worth checking whether the section
family should share that prop rather than each organism inventing it.

Note `.kol-full-bleed` exists as the ruled escape but is container-relative: used
on an organism whose own parent has no gutter it over-bleeds, which this consumer
already hit once tonight on a different section.

## Stopgap here meanwhile

`apps/web/src/styles/ui.css` pulls the section out by the gutter under
`max-width: 767px`:

```css
.kol-section-newsletter { margin-inline: calc(var(--kol-pad-section-x) * -1); width: auto; }
```

The DS's own `px-5` (shipped in `SectionNewsletterMobileMeasure`) then re-insets
the content, so only the fill moves. Dated and citing this ticket.

## Remainder here once it ships

bump kol-component; pass the prop from `HomeSignup`; delete the stopgap block.

## ✅ RESOLUTION — 2026-08-31 · kol-component@0.147.0

fullBleed shipped on SectionNewsletter. The breakout literal is SectionHero's, character for character (w-screen ml-[calc(50%-50vw)]) rather than a second mechanism — you were right to ask, and two organisms in one family inventing two ways to leave a gutter is exactly how they drift. The section's own px-5 sm:px-8 then re-insets the content, so only the fill moves, which is the behaviour your stopgap was getting by hand. Not used: .kol-full-bleed — container-relative, and you already hit it over-bleeding tonight. NOT DONE: hoisting fullBleed to the whole section family. It is the right question and it binds eight organisms, so it is a ruling rather than a fix; file it and it gets built.

**Remainder here:** none — kol-website bump kol-component >=0.147.0, pass fullBleed from HomeSignup, delete the stopgap block.

