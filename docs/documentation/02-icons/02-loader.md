---
title: Icon loader
type: reference
status: active
created: 2026-08-01
updated: 2026-11-21
description: The IconLoader component and the packaged set
tags:
  - domain/iconography
  - domain/packages
related:
  - "[[INDEX|icons]]"
---

# Icon loader

How a glyph reaches the screen — the async loader, and the one packaged set it reads.

## IconLoader component

```jsx
import { IconLoader } from '@kolkrabbi/kol-icons'
<IconLoader name="download" size={16} />
```

- **Resolution order:** consumer-registered (see *Bring your own icons*) → **kol-icon-set-interface**. That is the whole chain (v1-only since **0.8.0**, 2026-07-28) — a miss is a real miss and renders nothing (`console.warn`).
- **Async by design** — the packaged SVG maps live in `iconData.js` behind one dynamic `import()`, so the SVG text streams as its own chunk instead of blocking the consumer's first paint. Consumer-registered icons resolve synchronously (no wait). A chunk that fails to load is logged (`console.error`) and asked for again (twice, a second apart, then on the next icon's mount); until then the icon holds its empty box (2026-11-19).
- **Vite-only** (`import.meta.glob`).

> The `variant` prop was removed in 0.8.0 with the legacy solid cut — the set is a **single stroke cut**; intentional solids are their own named icons (e.g. `star-solid`).
>
> **`variant` is back in 0.60.0 (2026-11-01), as a pointer and not as a cut.** `<IconLoader name="cloud-storm" variant="solid" />` renders the drawn twin `cloud-storm-solid`. A name with no `-solid` twin renders its outline, and the `-solid` names still resolve on their own. No parallel tree comes back: a solid exists only where it was drawn (72 pairs today). In Figma each pair is one component set with `variant=outline|solid`.

## Search tags

```js
import { KOL_ICON_TAGS, getTags } from '@kolkrabbi/kol-icons'
getTags('lab-flask') // ['lab', 'science', 'chemistry', 'bottle', 'experiment']
```

- **Source:** `packages/icons/src/tags.json`, name to 2–6 lowercase tags, every glyph in all four sets (identity: every file in its folders).
- **What a tag is:** a synonym or a use a person types ("lab" for the flasks), never the name split again.
- **Read by:** the showcase's ⌘K search (icon rows' keywords) and `IconBrowser`'s search (`searchKeys={['name', 'tags']}`).
- **Gate:** `pnpm validate:icon-tags` (gate `icon-tags`) fails when a glyph has no entry or an entry names a glyph that is gone. A new SVG lands with its tags row.
- **App tags:** `editor` marks every icon the editor draws, and the catalog's Tag filter (`/icons` and each set's page) shows them together. The list is read from the code, never typed: `node scripts/extract-editor-icons.mjs` prints it, `--write` sets the tag on exactly those names. Rerun it after the editor's icons change (2026-11-20, W18.4).

## kol-icon-set-interface

One small, hand-reviewed set — **144 icons across 23 groups** (2026-07-28: 17 promotions with 0.8.0, keyline-conformed in 0.8.1 — chevrons/carets fit the 18×18 rect; 0.8.2 killed chevron-expanded (twin of chevron-up) and completed the four-diagonal arrow family as baked mirrors of the arrow-downright master), a **single stroke cut**, every icon authored with `currentColor` and normalised to the 1.5 keyline. It **ships in the package** at `packages/icons/src/kol-icon-set-interface/<group>/<name>.svg` and is the ONLY packaged set. It renders on `/icons`, which **dogfoods** it — groups from the `KOL_ICON_SET_INTERFACE` inventory, each icon via the package `<IconLoader>`.

- **Grouped, flat-by-name.** Foldered by category (direction, actions, navigation, status, layout, files, design, shapes, …) but resolved by basename — so no two icons share a name across groups.
- **Single cut.** No stroke/solid duality; intentional solids (filled carets, dots) are baked into the individual icon, not a parallel tree.
- **Grows slowly, curated** — new icons enter via the promotion loop below, not bulk import.

## Rules

His rules for the set, 2026-11-20 (W18.6, W19). Every agent that touches an icon follows them; two of them are gates.

| # | Rule | Gate |
|---|---|---|
| a | The set's own drawing wins. An incoming icon that matches one in the set is dropped, never a replacement. | |
| b | An icon is a base, or a base with a modifier: *"ruler and ruler at 45, or pen and pen flipped share pen base"*. The bases and their live settings are built in the workshop file (below), never in code; code and the library file receive flat finished icons exported from it. | `pnpm validate:icon-duplicates` |
| c | Line icons are live 1.5 strokes on the 24 grid. A solid source is redrawn or rejected, never scaled in and called fitted. A solid icon is a named solid cut: a `-solid` file, or an entry with `"solid": true`. | `pnpm validate:icon-fills` |
| d | Variants share a base. | `pnpm validate:icon-duplicates` |
| e | A review shows the source and the fitted redraw side by side on the keylines. Words do not stand in for it. | |
| f | Say solid, or line drawing. Never "filled outlines". | |
| g | One name, solid is its variant: the plain name is the stroke drawing, `variant="solid"` draws its solid, and `-solid` is only how that drawing is stored. The catalog shows one tile per name with its solid on it. | |

## The workshop

Ruled 2026-11-21 (W21), his words: *"I guess this shape builder base system doesnt have to live in code, it could just be a figma thing, and exported components in code would be seperate with baked corners?"*

| Place | Holds |
|---|---|
| `iconset--kol-ds-ui`, Figma file `Lud0oSRKPTyHvT9MDVIczN` | the workshop: every base with live radius, caps, dashes, fills and shown or hidden parts, and every icon built from them. The only place the base system exists. |
| `packages/icons/` | one flat drawing file per icon, everything baked, exported from the workshop. No composing in code. |
| `library--kol-ds-ui`, Figma file `n48kE2bJtrFjl7wxst30xH` | the same finished icons as flat components on its Iconset page, updated in place; what masters use and what Code Connect maps |

His model, from his atlas set (`Icon/File/base` and the set `Icon/File` with `modifier=search`, `check`, `pulse`, `heart`, `plus`, `star`, `code`, `terminal`, `pen`, `chart`, `text`), is how the workshop is laid out: a base, then its set. Names: the base word first, then the modifier (`file-search`, `clock-reverse`, `cloud-rain`). A number is not a modifier.

From 2026-11-20 to 2026-11-21 the set composed some icons in code from a base (`modifiers.json`); on 2026-11-21 each was written out as its own flat file, drawn exactly as before, and the composing code is in `_tmp/2026-11-21-icons-compose-retired/`.

**Second names.** `packages/icons/src/aliases.json` maps a name that is another icon's drawing to that icon: his atlas names (`hosting-vm` is `globe-network`, `incident-report` the set's `siren`, `blog` is `file-text`) and the second names of one drawing (`crop-02` is `crop`, `pencil-simple` is `pencil-ferrule`): 92 names. The loader resolves them as it resolves the renamed list, but they are permanent; the icon's tile carries the name as a search tag. `KOL_ICON_ALIASES` reads the file. An alias is never a second file, and the duplicate gate fails one whose icon is missing or that shadows a name.

## Duplicates

His rule, 2026-11-20 (W18.2): *"so many pens, theres no rule"*.

| Case | Allowed | Name |
|---|---|---|
| One idea, one drawing | yes | the idea: `pen`, `ruler` |
| A second drawing that means something else | yes | says the difference: a tool against an action (`pen-tool`, `edit`), an outline against a solid cut (`star`, `star-solid`) |
| The same drawing turned, flipped or badged | as a modifier only | an entry naming its base (`ruler-02` is `ruler` at `rotate-45`) |
| A second drawing of the same idea | no | it becomes an entry naming the kept drawing; its name keeps loading, its old drawing moves to `_tmp/` |
| A numbered name (`pen-02`, `pen-03`) | not a difference | renamed to what it means, or an entry |

The duplicate gate compares every two drawing files in the interface and signal sets under 16 poses (eight turns of 45, each mirrored or not), centrelines thinned, size allowed to differ by a quarter: a pair fails when 95 percent of each one's ink lies within three quarters of a grid unit of the other's. `scripts/icon-duplicates-baseline.json` holds the pairs still to settle (277, from 2026-11-20; decided on the survey page, [[06-survey|survey]]) and `allowed`, the pairs that are two real icons, each with its reason (a base and its turned or badged icon, two ideas on one shape). A new pair fails. The fill gate's baseline is `scripts/icon-fills-baseline.json` (93 icons with a filled shape that are not named solid cuts), with an `allowed` list for a deliberate fill and its reason.

Settled 2026-11-20 (W19.3): `pen-tool-02` is `pen-nib` flipped, `ruler-02` is `ruler` turned 45, `pencil-03` and `pen-02` are `pencil-ferrule` with the tip line and the clip; `pencil-simple`, `pencil-02`, `swatch-book-02` and `crop-02` are second names of `pencil-ferrule`, `pencil`, `color-swatch` and `crop` (`crop` carries crop-02's drawing, his keeper). The replaced drawings are in `_tmp/2026-11-20-icons-retired-drawings/`.
