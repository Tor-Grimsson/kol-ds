---
title: Icon forms
type: reference
status: active
created: 2026-11-21
updated: 2026-11-21
verified: 2026-11-21
description: How an icon is built in the iconset Figma file, from drawn part to form to base to build output to category, with the line form as the worked example
aliases:
  - icon forms
  - form base
  - icon pipeline
tags:
  - domain/figma
  - domain/icons
  - audience/agency-internal
related:
  - "[[INDEX|Figma]]"
  - "[[03-icon-work|Icon work]]"
  - "[[04-icon-export|Icon export]]"
---

# Icon forms

Every icon in `iconset--kol-ds-ui` (`Lud0oSRKPTyHvT9MDVIczN`) is built in six steps, each one made of components of the step before. Nothing is drawn loose and nothing is hidden as a bare layer.

| Step | What it is | Made of | Line example |
|---|---|---|---|
| 1 Raw | the drawings as they came from code | nothing, reference only | minus, plus, x, ascii-pipe, three caps |
| 2 Parts | one component per drawn part | a vector | `Line/horizontal`, `Line/vertical`, `Line/diagonal-down`, `Line/diagonal-up`, `Line/horizontal-dashed`, `Line/vertical-dashed` |
| 3 Form | one component holding every part of the form, each on a show/hide switch | part instances | `Line` (`120:10976`), six switches |
| 4 Base | the form on the keyline | `Base/keyline` + the form (+ the container, if contained) | `Base/line` (`25:5338`), two layers |
| 5 Build output | one component set per form, one variant per icon, no category | the base with switches set | `Line/output` (`124:5688`), `variant` = minus, plus, x, ascii-pipe, cap-butt, cap-round, cap-square |
| 6 Category | the icon component, named the icon, in its category | one layer: its build output variant | `minus`, `plus`, `x` in Interface / Actions; `ascii-pipe` in Signal / Ascii; the caps in Signal / Cap |

## The nesting

```
minus                      component, lives in Interface / Actions
└─ Line/output             instance, variant = minus
   └─ Base/line            instance
      ├─ Base/keyline      instance, switched off
      └─ Line              instance, switches: horizontal on, rest off
         ├─ Line/horizontal          shown
         ├─ Line/vertical            hidden
         ├─ Line/diagonal-down       hidden
         ├─ Line/diagonal-up         hidden
         ├─ Line/horizontal-dashed   hidden
         └─ Line/vertical-dashed     hidden
```

Change `Line/horizontal` and every icon that shows it follows. That shared line back to the form is the reason for the whole build.

## The rules

1. **A drawn part is a component.** Never a loose vector inside a base.
2. **A form is one component.** It holds one instance of each part, and each instance has its own show/hide switch. A component set is not used here; switches do the job.
3. **A base holds only three things:** `Base/keyline`, the form, and the container if the icon is contained. The form's instance is exposed so its switches show on the base.
4. **Build output comes before categories.** The form's icons are made first as one set with no category on them.
5. **A category takes outputs, it does not make drawings.** The icon component in a category holds one layer, its build output variant.
6. **Each step is its own column.** A new step never goes at the bottom of the step before it.
7. **A part or a base earns its place with two icons or more.**

His words, 2026-11-21: "the only thing in that component should be 1. Base/keyline 2. the mark 3. the container", "they should already be an instance before they go in with the keyline", "only then can you take the output of the FORM BASE and nest those in their rightful categories. that is the only way to maintain the shared FORM heritage".

## Where it lives on the Bases page

Page `Bases` (`10:5236`) holds two sections side by side, starting at the same height.

| Section | Holds |
|---|---|
| `Bases, flow` (`111:17279`) | frame `Flow`: a header of column titles (RAW, PARTS, FORM, BASE, BUILD OUTPUT, CATEGORY), bands, and one lane per form. A lane's cells sit under the column titles with an arrow between each step. The CATEGORY cell names the categories the lane feeds. |
| `Categories` (`131:5068`) | frame `Layout`: the same header and band rows as the Flow, then a grid three columns wide. One cell is one category. The cell holds the category title and its icon components. |

In the Categories grid the first category row starts level with the first form lane. A cell that no form feeds yet stays dim. A cell is never filled with a whole category brought over from the Icons page; it shows only what the forms have sent it.

## Building the next form

1. Make each drawn part a component in the lane's PARTS cell.
2. Make the form component in the FORM cell: one instance per part, one switch per instance.
3. Make the base in the BASE cell: `Base/keyline` and the form, plus the container if contained. Expose the form instance.
4. Make the output set in the BUILD OUTPUT cell, laid out in the same rows as the RAW cell so each icon sits across from its raw drawing.
5. Check each variant exports the same paths as its raw drawing.
6. Make the icon components in their category cells, each holding its output variant.

## Standing

| Form | State |
|---|---|
| line | built through all six steps |
| every other lane | still on the old build (loose and hidden layers in the base); to be rebuilt this way |

The icons on the `Icons` page and the files in `packages/icons` still come from the old build. See [[04-icon-export|Icon export]] for how built icons reach code.
