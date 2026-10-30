# Brand lab tools: one window for TypeLab, ColorLab, ComboLab and LockupLab, plus the features he listed

**Staged:** 2026-10-29 · from kol-atlas (plan `.kol/llm-plan/08-lab-app.md` § W5 and § W7; user: *"you dont have to fix it just include it with ticket"* and *"tell them not to ship until I have reviewed"*)

> 🔴 **DO NOT SHIP UNTIL THE USER HAS REVIEWED.** Build it, show it to him (an artifact or the DS docs page), and publish only on his word.

## Context

kol-atlas's identity lab runs the four labs (`@kolkrabbi/kol-styleguide` 0.17.0). Today each lab lays itself out as a page, each in its own way. He asked for one look: tools in a container, with their output outside it. kol-atlas built two proposals on KOL components. Both are artifacts, both are wrong in ways he listed, and the fixes belong here in the labs themselves:

| | link | source (kol-atlas) |
|---|---|---|
| v1 | https://claude.ai/artifact/Jdc3PE5dwkpSu1pyGm7NVN | `apps/lab/src/proposal/` |
| v2 | https://claude.ai/artifact/9rTW2NsYuFfY44tYx9kCon | `apps/lab/src/proposal/v2/` |

Research behind it: kol-atlas `.kol/llm-plan/08-assets/w6-research.md` (FXR's Color Modes window, Adobe Color, the per-tool comparison). Reference images are in kol-atlas `.kol/llm-plan/08-assets/`:
- `ref-kol-media-picker.png` and `ref-kol-quicklook-frame.png`, his examples of an established window
- `ref-adobe-0*.png`, his Adobe Color captions: base colour, colour wheel, two colours, eight colours, edit tint, options per colour
- `ref-fxr-color-modes-window.png`
- `review-v1-*.png` and `review-v2-*.png`, the review screenshots

## His points, verbatim

On v1:
- "container uses wrong helper text style for the millioneth and hundered time."
- "you are reinventing styles instead of using an already established style. f.e. quicklook or media or search or modal or rail or whatever, there are a bunch of options, you chose none."
- "container is taller then available height, that is stupid"
- "line break because of placeholder sentence, thats stupid, just truncate if more then the one line."
- "dropdowns are invisible, thats stupid, referene the fucking background"
- "color is extremely lacking, and different height. and missing features."
- "why is the title not the same as the name? Combination? isnt the name ComboLab? … Combo lab is also bugged … and why would combo lab output palette and not the color lab?"
- "Lockup is stupid, scale doesnt matter, so sm md lg xl is irellevant, its about the lockup of shapes not size. size is just output and usage. horizontal hero and wordmark is also stupid, they are all the same in differnt sizes. much better would be text controls, font ratio, line height (as in clip to baseline), grid on off, logo shape, lockup type, different sub-categories, all of this is listed in assets/media in the branded house image for example. … output also just is insanely different then the tool."
- "dont use segmentedtoggle, and if you do then use the right one, which is the one without border. dropdowns are much better."
- "stop using bullets everywhere" (the "·" separators)

On v2:
- "I just dont understand modal header padding content padding and footer padding, none of them match, then you have 2 different dropdown tones"
- "why footer anyway, why not use the left siderail for that info? and make the container resizable?"
- "you are not using any labelledcontrols?"
- "why is output swatch different in combo lab then color lab? why is combo lab branded? no accessibility check on either one?"
- On the Lockup Lab: "this is so stupid, broken layout, no standards, and use tabs intead of vertical scrolls? AND why doesnt lockup lab output table? as well?"

## What the labs need, read from those points

**One window for all four**
- An established KOL window anatomy, not a new frame: QuickLookFrame or the media picker's dialog. One padding for header, content and rail.
- Resizable, as QuickLookFrame is, and never taller than the viewport.
- No footer. The status line ("8 steps from 12 to 90 px", what the tool is set to) lives in the left rail.
- The rail's sections are tabs, not one long vertical scroll.
- Controls are `LabeledControl` as it ships. One control tone that reads against the rail's ground, and the same tone for every control (v2 had a grey Stepper beside a black Dropdown).
- Dropdowns, not SegmentedToggle. If a toggle stays, it is the borderless `tone="sunken"`.
- `kol-helper-*` only on short field labels. No "·". Single-line samples truncate.
- Each title is the tool's name: Type Lab, Color Lab, Combo Lab, Lockup Lab.
- Output sits outside the window, in the same table shape for every lab.

**Color Lab: his feature list (Adobe Color plus FXR Color Modes)**
- Start from a base colour or from the colour wheel. A count from 2 to 8, with colour 1 the base.
- Per colour: edit tint (a lightness ladder), edit, lock, copy and delete. Roll keeps locked colours. Undo and redo.
- An accessibility check, a contrast ratio and grade per colour (0.17.0 has `contrastRatio` and `contrastGrade`). Every swatch the same height.
- Color Lab owns the palette output, as a table plus CSS.
- Engine: kol-fxr's way, roles by look after generating (darkest is the ground, lightest is the ink, most saturated is the accent). Settled 2026-10-29 by kol-atlas, from his own words in kol-fxr. **Do not ask him design questions**: decide, say what you chose, and bring him the built result to review.

**One colour engine**
- There are three today: ColorLab's `colorLab.js` (HSL, jobs given in harmony order), ComboLab's `comboMath.generatePalette` (by mode, from a pool), and kol-fxr's `src/editor/color/palette.js` (OKLCH, base is colour 1, a count of 2–8, jobs given by look, lock and roll, contrast).
- Make one, in kol-styleguide, on kol-fxr's model, and export it. Color Lab and Combo Lab both run on it.
- Retire the other two into it. `generatePalette` becomes a deprecated alias, then is removed. kol-fxr moves to the shipped engine through its own ticket (`palette.js` goes to its `_tmp/`).

**Combo Lab**
- Combines Color Lab's palette. It does not generate its own and does not output a palette.
- Unbranded: no Atlas mark or name in its stage.
- Same swatch and table shape as Color Lab. An accessibility check on the pairs it makes (each role on the ground).
- Fix the v1 bugs: the logo toggle did nothing outside one layout, and `bg` duplicated `light`.

**Lockup Lab: from the branded-house sheets** (kol-atlas `docs/documentation/05-graphics/_assets/bh-*.svg`, Canalix)
- Parts: logo (mark shape), company wordmark (parent), product wordmark, sub-category, optional.
- Lockup type: the five on `bh-logo-system-0.svg`, from mark with parent, product and sub-category down to product alone.
- Controls: text per part, font ratio (parent and sub-category to product), clip to baseline, grid on or off (the sheet's coloured part boxes), logo shape, sub-category presets.
- No scale (sm, md, lg, xl) and no horizontal, hero or wordmark presets.
- Output: a table of the parts (text, size, weight) plus every lockup type, drawn by the same renderer as the tool.

## Definition of done
- [ ] Built in kol-styleguide's lab
- [ ] **Reviewed by the user**, nothing published before this
- [ ] published

---

## Shipped on his word — 2026-10-29 (the review continues; the ticket stays open)

*"just ship it so I can at least work in Atlas and the changes come on bump"* — published: kol-icons 0.53.0 · kol-theme 0.200.0 · kol-component 0.317.0 · kol-framework 0.65.0 · kol-styleguide 0.18.0, then review 7 as patches: kol-icons 0.53.1 · kol-theme 0.200.1 · kol-component 0.317.1 · kol-styleguide 0.18.1. The review rounds and their points: `.kol/llm-context/plan-2026-10-29-lab-window-review-1.md` (W1–W8).
