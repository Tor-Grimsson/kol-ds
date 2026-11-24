# The Figma doc frame: one layer holds the masters, the annotation floats, nothing shows as hex

**Staged:** 2026-11-21 · from a kol-atlas session
**Change:** a rule for every doc frame in the KOL Figma files, plus a new size on the Annotation doc part

---

## The problem, in one case

In library--atlas a doc frame was built as `_Header` › `Specimen` › `Grid` › `Column` › annotation + master. The user, 2026-11-21: *"why are we using so many frames?"* `Grid` wraps several masters into rows and `Column` only stacks an annotation on top of its master, so for one master both do nothing. The annotation sat in the auto layout, 42 tall inside 40 of padding, and touched the header's rule. And the doc parts carried raw colours (annotation purple, keyline pink, the set's fill and stroke), which he flagged because they fill the Selection colors list and hide what is really unstyled: *"_Annotation has hex values, making it harder to spot unstyled things."*

He then rebuilt the frame himself and called it the rule. He wants the same in the design system's files: *"I want to do similar there."*

## The fix

The reference is his own frame: library--atlas (`RPirjavYkZlqZ4nRCWxihb`), page `↳ Brand guide`, frame `Guide layout`, node `763:3176`.
https://www.figma.com/design/RPirjavYkZlqZ4nRCWxihb/?node-id=763-3176

Measure it before building; these are the numbers read off it on 2026-11-21.

```
<doc frame>      vertical, hug / hug, counter axis centred, fill = the surface variable, clip on
  Header         fills the width
  Wrapper        vertical, padding 24 all round, hug / hug
    Specimen     vertical, gap 40, padding 0, hug / hug
      <masters>  the component set, or the separate components
      Annotation ignores auto layout, constraints centre / top
  Footer
```

1. **`Wrapper` only gives air.** Its 24 keeps the specimen off the frame's edges and off the header's rule. It has no fill and no stroke.
2. **One layer holds the masters, never two.**
   - A component with variants: the component set is that layer. It carries padding 64 all round, gap 64 between variants, the fill and the dashed stroke (1, inside, dash 10 / 5, radius 4). `Specimen` has no padding. His words: *"the component has variants, and can therefor be treated as a frame."*
   - Several separate components: there is no set, so `Specimen` carries all of it instead: padding 64, the gap, the fill and the dashed stroke. *"if it were 3 individual components id put it on the specimen layer."*
3. **The annotation floats.** Ignore auto layout on, 64 tall with 16 padding on top, centred at the top of the layer that holds the masters. It is exactly as tall as that layer's top padding, so the bubble starts 16 below the header and the connector ends on the first master. It takes no space in the layout.
4. **No `Grid`, no `Column`.**
5. **Nothing shows as hex.** Every doc colour is a variable. In library--atlas that is a small collection `atlas-doc`, hidden from publishing: `doc/annotation` (the purple), `doc/keyline` (the pink), `doc/section` (white at 10%). The set's fill uses `doc/section` and its dashed stroke uses `doc/annotation`. He does not want a variable per role: *"I dont care what the fucking color it is … I just neeed this set to styles so they dont show as hex values."*
6. **Sections** take their fill from the same `doc/section` variable and carry no stroke.

What this touches in the design system:

- `~/.claude/skills/kol-figma/SKILL.md` §5, Master-page layout: today it reads "_Header › Specimen (labels in auto-layout) › _Footer". The annotation in auto layout is what this replaces.
- `❖ library--util` (`l0tvnukIzRz2TzVCfmJhav`): the `Annotation` part gets the 64 tall, 16 top size in its master, so no frame needs an override. Its colours, and Header's and Footer's, are checked for raw values.
- `~/.claude/skills/kol-figma/scripts/audit.js`: a check that fails a doc frame with a `Grid` or `Column` layer, an annotation inside auto layout, or a raw colour on a doc part.

## Rejected alternative

Keeping `Grid` and `Column` and only raising the padding so the annotation clears the rule. It fixes the clash and keeps two layers that do nothing, which is the thing he asked about.

A separate variable for each role (`doc/component` beside `doc/section`). Proposed in the session and refused; same value, and he only needs the hex gone.

## Definition of done

- [ ] The doc frame rule in `kol-figma/SKILL.md` §5 states this structure, with the two cases (set, or separate components).
- [ ] `Annotation` in `❖ library--util` is 64 tall with 16 top padding in its master and has 0 raw colours.
- [ ] A read of `Header`, `Footer`, `Annotation` and the keyline guides in `❖ library--util` returns 0 raw fills and strokes.
- [ ] One doc frame in `❖ library--kol-ds-ui` is rebuilt on the rule and its layer tree matches the tree above, layer for layer.
- [ ] `audit.js` fails on a `Grid` or `Column` layer in a doc frame, on an annotation that is not set to ignore auto layout, and on a raw colour on a doc part.
- [ ] Sections in the file that was rebuilt have a variable fill and no stroke.

## Note for the reader

library--atlas keeps its own doc parts on its `_util` page and does not use `❖ library--util`; that exception is written into rule 23 of `kol-figma/LAW.md`. So nothing ships back to kol-atlas from this ticket.
