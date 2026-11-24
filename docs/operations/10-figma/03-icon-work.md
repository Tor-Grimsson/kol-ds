---
title: Icon work
type: reference
status: active
created: 2026-11-20
updated: 2026-11-21
description: The icon workspace is the Figma file iconset--kol-ds-ui; its pages, how a category frame is built, and what a read-back relies on. The former _icon-work page of the library is kept below for the record.
aliases:
  - icon work
  - iconset file
  - _icon-work
tags:
  - domain/figma
  - domain/icons
  - audience/agency-internal
related:
  - "[[INDEX|Figma]]"
  - "[[01-file-setup|Figma file setup]]"
  - "[[04-icon-export|Icon export]]"
  - "[[05-icon-forms|Icon forms]]"
---

# Icon work

The workspace for the icon set is the Figma file `iconset--kol-ds-ui` (`Lud0oSRKPTyHvT9MDVIczN`). On 2026-11-21 the whole set went in flat from the code, one frame per category, every icon a component under its own name, so he can delete what he does not want. When he says he is done, what is left is read back and applied to code and to the library. Plan: `.kol/llm-context/plan-2026-11-20-kolbox-everything-left.md` W21.2b. Tally per category: `_tmp/2026-11-21-iconset-fill/tally.md`.

## Pages

| Page | Id | Holds |
|---|---|---|
| `Page 2`, `Page 1` | `1:684`, `0:1` | his; untouched |
| `Interface` | `10:4440` | section `Interface` (`11:4554`), 20 category frames, 916 icons |
| `Signal` | `10:4441` | section `Signal` (`17:9739`), 19 category frames, 121 icons |
| `Identity` | `10:4442` | section `Identity` (`18:4440`), one frame `Identity`, 11 icons (`kol-icon-set-identity/<id>/<id>.svg` only) |
| `External` | `10:4443` | section `External` (`18:4500`), frames `Brands` (20) and `Social` (10); flags are left out |
| `_parts` | `10:4444` | the frame parts: `_Header` (`10:4445`), `_Footer` (`10:4451`), `_Name` (`10:4456`) |
| `Bases` | (another agent) | the shared base builders; not part of this fill |

Every ground is #1E1E1E. In a section the frames stack down in category order, 80 from the section edge and 172 apart, as in his atlas file (`RPirjavYkZlqZ4nRCWxihb`, section Iconset `109:859`).

## A category frame

The layout copies his atlas frames: 1600 wide, ground #1C1E21, clip on, hugging its height.

| Layer | What it is |
|---|---|
| frame `<Category>` | the code's folder name with its first letter capitalised (`Actions`, `Transport`) |
| `_Header` instance | path line `<Set> / Iconset`, title the category, count line `N icons on the 24 grid, 1.5 stroke.` (N = cells); no used-by line |
| `Specimen` | vertical, padding 64, gap 64 |
| `Specimen` › `Grid` | wrap, 1472 wide, gap 24 across and 32 down |
| `Grid` › `Cell / <name>` | 160 by 64 (72 when the name wraps), vertical gap 8, centred: the icon, then a `_Name` instance with the name |
| `Specimen` › `bases` | an empty band 160 high, for that category's base builders (placed by the base work, not by the fill) |
| `_Footer` instance | `KOL iconset`, `Changelog: 2026-11-21` |

The icon in a cell is a component named exactly the icon name (`arrow-up`), 24 by 24, holding the code's drawing as imported: vectors named `icon`, groups `group`, strokes live (round caps and joins where the code has them), nothing outlined or rescaled. An icon with a solid cut in code (`x` and `x-solid` in the same set) is one component set named `x` with the property `solid`, values `false` and `true`, both drawings inside, in one cell.

Fonts are his atlas fonts: DM Mono for the path line, names and footer, Work Sans for the title and count line.

## Read-back

What a later read-back relies on:

| Read | Means |
|---|---|
| the components and component sets inside each `Grid` | the icons that stay; a name missing against the code means he deleted it |
| a cell's component name | the icon name (a set's name for a solid pair) |
| the frame a cell sits in | the icon's category folder |
| the `solid` set | both drawings stay unless he deletes a variant |

The approved duplicates (`_tmp/2026-11-21-iconset-fill/approved-duplicates.json`) were applied before the fill: `link`, `gear`, `clock` and `layers` carry the drawings of `link-02`, `settings-01`, `clock-03` and `layers-02`, and eleven names were left out. Their absence is not a delete.

## Former `_icon-work` page

> **Left the library file on 2026-11-21.** Its contents are on the library's `_trash` page in the section `_icon-work 2026-11-20` (`2561:70539`); the empty page waits for him to delete it. The draft section "Icons, base and modifier" went to `_trash` too, as `_Icons, base and modifier 2026-11-20` (`2537:1287`). Bases and modifiers now live only in the workshop file `iconset--kol-ds-ui` (`Lud0oSRKPTyHvT9MDVIczN`); the library's Iconset page holds flat finished icons only. What follows is the page as it was. Plan: W21.1.

His working space for the icon set, in the KOL library file `n48kE2bJtrFjl7wxst30xH`, page `_icon-work` (`2543:11`), with the utility pages before `_trash`. Every component on it starts with `_`, so nothing on it publishes. A finished icon moves to the Iconset page and loses the prefix. His moves here are read back by a script and applied to the set (`modifiers.json`, the group folders, `tags.json`), never the other way round by guess. Plan: `.kol/llm-context/plan-2026-11-20-kolbox-everything-left.md` W20.4.

### Nodes

| Node | Id | Holds |
|---|---|---|
| Page `_icon-work` | `2543:11` | everything below, ground #1E1E1E |
| Frame `How to` | `2543:12` | the three things he can do, one text each (`step 1` to `step 3`) |
| Sections `Duplicates / <category>` | row at y 400, e.g. `actions` `2544:10`, `direction` `2545:685`, `typography` `2549:1781`, `cap` `2549:3396` | the 277 baseline pairs, 31 sections |
| Sections `<category>` | row below, e.g. `files` `2552:3330`, `design` `2551:3065`, `transport` `2552:7000` | the groups, 39 sections (20 Interface, 19 Signal) |

### Pairs

One section per category, `Duplicates / <category>`; the category is the group folder of the pair's base. Inside: a frame `Pairs`, and in it one frame per pair named `Pair <a> = <b>`, the two names as the baseline lists them (`scripts/icon-duplicates-baseline.json`).

| Layer | What a read-back takes from it |
|---|---|
| `Label` › text `outcome` | the first letter: `a` one base, one modifier; `b` one name; `c` two ideas |
| `Label` › text `note` | the reason, for him; not read |
| `Row` › `Suggestion` | the draft components (below) |
| `Row` › `Current` › `Current <name>` | the two library icons at 24 and 96, as instances; not read |

Draft components in `Suggestion`:

| Outcome | Components | Read as |
|---|---|---|
| a | `_Icon/<base>/base` and the set `_Icon/<base>` with `modifier=none` and `modifier=<transform>` | the base is the name in the set's name; the other name of the pair becomes an entry `{ base, transform }`; transform words are the code's (`flip-x`, `flip-y`, `rotate-<deg>`, several space-separated in the order they apply) |
| b | `_Icon/<base>`, its description `<other> resolves to this` | the other name becomes an entry on the base with no change |
| c | `_Icon/<a>` and `_Icon/<b>` | both stay drawings; nothing to apply |

He changes an outcome by retyping the `outcome` text (`a`, `b` or `c` first), and the base by renaming the set and base component to the other name. A pair he has settled leaves the baseline after it is applied.

How the suggestion was made: the check's pose and score per pair, plus the share of ink the posed base covers on the other drawing at 96 (`_tmp/2026-11-20-icon-work/pairs.mjs`). a: a turn or flip, score at least 98, ink at least 80 percent. b: no turn, ink at least 99.5 percent. Anything else c. The base is the plainer name: no number suffix, then no direction word, then the shorter.

### Groups

One section per category, named exactly as the code's group folder (`packages/icons/src/kol-icon-set-<set>/<folder>`): Interface in the folders' order, then Signal in the order of `showcase/src/nav/icon-categories.js`. Inside: a frame `Grid`, and in it one frame per icon named `Cell <icon name>`, holding an instance of the Iconset component and its name.

| Move | Read back as |
|---|---|
| a `Cell` dragged to another section | the icon's folder becomes that section's name |
| a section renamed | the folder is renamed |
| a cell whose text ends `(not in the library)` | the code has the icon, the library has no component for it yet |

An icon with a solid cut is one cell: its instance is the set with the `solid` toggle, and the `-solid` name moves with it.
