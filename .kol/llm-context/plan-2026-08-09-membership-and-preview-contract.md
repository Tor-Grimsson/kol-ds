# Plan — the membership gate + the preview contract

**Raised:** 2026-08-09 (user, 14-item review of `/` and `/components`)
**Status:** authored, NOT started — every wave below waits on the user's go
**Supersedes nothing.** The 2026-08-09 tier re-rule stands; this plan adds the
axis that ruling deliberately did not cover.

---

## 0. The one sentence

Three of the fourteen items are chrome. Three are component defects. **Eight are
one defect wearing eight faces** — the showcase has no *preview contract* and the
system has no *membership test*, so every card renders a whole demo into a 224px
slot and every component that was ever written is still a published component.

---

## 1. What the user said, item by item

Nothing here is paraphrased into a smaller ask than it was made.

| # | Item (verbatim gist) | My reading | Wave |
|---|---|---|---|
| 1 | Close the deletion ticket, it's outdated | Done — ⚫ retired, ledger + history updated | ✅ |
| 2 | Load home with sidebars hidden | `/` mounts with BOTH rails collapsed | A |
| 3 | Match font for workshop, but say KOL-DS | The `WORKSHOP` wordmark becomes `KOL-DS` in the same typeface | A |
| 4 | Header icons → 100% opacity, medium size | The 4 header glyphs are `lg` + dimmed; want `md` + full ink | A |
| 5 | Why does Button show size? size is an option, show variations | The one-instance ruling never reached Button's demo | C |
| 6 | Badge doesn't align with StatusChip — what gap does StatusChip have? | `gap-2`. Badge has **no gap at all**, plus a different radius and size model | B |
| 7 | /components is messy, previews break every card, 4 columns in tight space | The index renders full demos, not index cards | C |
| 8 | Does nothing translate? does it have to be solved on every page??? | It translates. It was never wired. See §3 | C |
| 9 | Atoms should not be 38 | Right, and for a better reason than consumer counts: 9 of them are not interface elements. See §4 | E |
| 10 | AnimatedTitle / InteractiveImage / OverlayGlassPanel / AssetGrid / AssetPlaceholder / TransparentX — who consumes these? | First answered by consumption; **re-scoped** on the user's second pass — the axis is *what a thing is*, not who uses it. See §4 | E |
| 10b | "Atomic design is a design principle, NOT an invisible-helper principle" — spare atoms for VISUAL atoms; make a utility category | Accepted. Two mechanical tests + one new shelf; the rest of the shelves already exist unused. §4 | E |
| 11 | AsciiCursor is icons + animation + states — not a molecule? and why is its preview empty? | Tier: no, already ruled. Empty preview: real bug | E / C |
| 12 | EmptyState + ExitPreview use helper-mono FOR PARAGRAPHS | Confirmed. `kol-helper-*` is line-height-1 chrome mono | B |
| 13 | MediaCard pushes 2 images into a slot that holds barely one | Same defect as #7 | C |
| 14 | **SectionLabel needs a space. Section Label. Two words.** | The rule EXISTS and is called in exactly one place. See §5 | D |

---

## 2. Wave A — chrome (isolated, no system consequence)

| | Item | Where | Note |
|---|---|---|---|
| A1 | `/` mounts both rails collapsed | `ShellLayout.jsx:93-94` + a route hook | `ShellTocCollapsedContext` already exists for the right rail; the left rail has no equivalent. Mint the nav twin rather than special-casing the route inside the shell |
| A2 | `WORKSHOP` → `KOL-DS` | `packages/brand/src/svg/wordmark-workshop.svg` | The asset is **outlined paths**, not `<text>` — a new wordmark has to be drawn or set from the source typeface. **Blocked on one answer: which typeface is the WORKSHOP wordmark?** Typing it in a matching font is the fallback, and is what got reverted last time (it wrapped to two lines) |
| A3 | Header glyphs → `md`, full opacity | `ShellChrome.jsx:273` · `ShellLayout.jsx:230` · `ShellHeader.jsx` | Four glyphs, three files, all `size="lg"`. The 2026-08-01 ruling put them on `lg` *together* — moving to `md` is a re-rule of that, and it must move all four or the row goes ragged again |

---

## 3. Wave C — the preview contract (this is the "solve it once" one)

**The answer to "does it have to be solved on every page???" is no, and here is
why it looked that way.**

`showcase/src/pages/Components.jsx:48` is the ONLY renderer for a component card:

```jsx
c.demo.Card ? <c.demo.Card /> : <DemoStage entry={c.demo} />
```

`Card()` is the index card — one canonical instance. **11 of 185 demos export
one.** The other 174 fall through to `<DemoStage>`, which renders the *full demo*
— every size, every variant, every state — into a `max-h-56` box that is
`overflow-hidden` and `pointer-events-none`. That single fallback is:

- #7 — the wall of clipped, ill-spaced cards
- #13 — MediaCard shoving four tiles through a two-tile hole
- #11b — AsciiCursor showing nothing: its demo is behind a Button, and the card
  slot is `pointer-events-none`, so the button is physically unclickable
- #5 — Button's size ramp on the home tile

**The fix, in order:**

1. **Delete the fallback.** The index renders `Card` or the name placeholder,
   never `DemoStage`. One line. Every one of the 174 broken cards stops
   overflowing the same minute.
2. **Backfill 174 `Card()` exports.** Mechanical, one line each, batched.
3. **Gate it** — `validate:demos` fails on a demo with no `Card`. Without the
   gate this regrows the day someone adds a component.
4. **`Card()` is static by contract** — no toggle, no interaction, no
   `useState`. A card that needs a click to show anything shows nothing.
5. **Sweep hard-coded size ramps out of demo bodies** (#5). The 2026-08-09
   ruling — *one instance, sizes in the toolbar picker* — landed on
   SegmentedToggle / Stepper / ColorSwatch and stopped. Button still hard-codes
   Small / Medium / Large. Every demo with a size ramp in its body gets a
   `sizes` export instead.

**Not in scope:** the 4-column waterfall itself. `[columns:4_20rem]` is correct —
it is the *content* of each card that is oversized, not the column count. Fixing
the cards first is the honest test of whether the grid needs anything.

---

## 4. Wave E — atoms are VISUAL, and the shelf must prove it

> **Re-scoped 2026-08-09 on the user's second pass.** This section first
> measured *consumers* — how many apps use a thing. That was the wrong axis and
> he said so: consumption tells you whether to keep a component, never whether
> it is an **atom**. Atomic design is a design principle. The question is what a
> thing IS, and the shelf has never been made to answer it.

### The gap

`00-taxonomy.md` defines an atom as *"an irreducible interface element — one
control, indicator, or content primitive."* Good definition. **Nothing enforces
it.** The 2026-08-09 ruling repealed the mechanical import test and put placement
under authored judgment — correct — but authored judgment was applied to
*existing rows*, never to the question of whether a row was an interface element
at all. So `atoms/` accumulated layout wrappers, positioning primitives, fallback
states and app chrome, all sitting beside Button.

That is why the shelf reads as noise. It is not 37 atoms. It is ~28 atoms and 9
things that were never interface elements.

### The two tests

Both are mechanical. Neither asks whether a component is *good* or *used*.

**Test 1 — THE VISUAL TEST. Strip every child and every prop. Does it paint?**

An atom is something you can see. If a component renders nothing until a consumer
hands it content, it is not an element — it is a wrapper or a behavior.

**Test 2 — THE PLACEMENT TEST. Can it stand alone on a canvas and mean something?**

Painting is not enough. A mark that is only ever applied *onto* another element,
or a state another component *falls back to*, is a member of that component — not
its peer. The taxonomy's own page rule already says this: *"compositional
sub-parts and infrastructure sub-exports are members of one component, not
peers."* It has never been enforced either.

| | Paints alone? | Stands alone? | Verdict |
|---|---|---|---|
| Button, Badge, Input, Divider, Tag, ColorSwatch… | ✅ | ✅ | **Atom** |
| AssetPlaceholder, TransparentX | ✅ | ❌ | Member / decoration of its parent |
| AssetGrid, Popover, OverlayGlassPanel | ❌ | — | Not a component: layout, behavior, or CSS |

### THE PROPOSAL — one folder, one sidebar group, eight files

> **Corrected 2026-08-09.** The first draft of this section routed the failures
> to eight different destinations (layout · infrastructure · CSS · graphics ·
> framework · a parent's page · a specimen shelf · molecules). The user rejected
> it outright: *"you just created 8 different locations for what I was saying —
> GROUP THIS TOGETHER."* He is right. Eight tidy homes is worse than one shelf,
> because now there are eight places to look instead of one.

**Mint ONE tier: `packages/component/src/utilities/`.**

It sits beside `atoms/ · molecules/ · organisms/` and gets **one** sidebar group,
`Utilities`, at the bottom of the Atomic grouping. That is the entire structural
change. No other folder is created, no other group appears anywhere.

**What goes in it:** anything that fails either test — paints nothing on its own,
or only ever renders onto/inside another component. Purpose without a face.

**The files that move, unchanged.** Second sweep run 2026-08-09 ("let's try to
catch more this run") — the same two tests applied to all of `molecules/` and
`organisms/`, every low-paint file read in full, not judged by grep.

*From `atoms/` (8):*

| File | Why it isn't an atom |
|---|---|
| `AssetGrid.jsx` | `<div class="grid">{children}</div>` — no border, bg, text or svg. Its own docblock: *"purely structural"* |
| `Popover.jsx` | Positions someone else's panel. 0 paint · 0 external consumers · 7 internal |
| `OverlayGlassPanel.jsx` | A `color-mix` background + `blur(1px)` — a surface treatment |
| `TiltCard.jsx` | `relative` div + children; the tilt is a mouse-move transform |
| `AssetPlaceholder.jsx` | Paints, but it is what `Image`/`Graphic` fall back to — a state, not a peer |
| `TransparentX.jsx` | One `<line>`, `aria-hidden`, absolute-fills-parent. A mark drawn onto a slot |
| `ExitPreview.jsx` | `position: fixed` draft chrome — its CSS already ships from `packages/framework/kol-framework.css:605` |
| `ProsePreview.jsx` | A full H1–H4 + blockquote + code specimen |

*From `molecules/` (4):*

| File | Why it isn't a molecule |
|---|---|
| `ButtonGroup.jsx` | Own docblock: *"Pure layout"* — responsive stack/row wrapper for Buttons, nothing cloned, nothing painted |
| `FullscreenOverlay.jsx` | It DOES paint (scrim + sheet + close ×) — filed on the **placement** test: nobody places it as an element, five components **wear** it (ShellDrawer, Popover, MediaLibrary, MediaViewer, LoaderOverlay). User asked *"both no visual?"* — answered honestly, held in the list on my vote; his call if a scrim+sheet reads visual enough to stay |
| `LoaderOverlay.jsx` | A 5-line slot pass-through over FullscreenOverlay. Paints nothing |
| `ErrorBoundary.jsx` | Renders its children untouched; paints only when the subtree crashes. A guard, not an element |

**`MenuPopover` struck from the list (user, 2026-08-09: "menu popover is a menu
item, its visual").** Correct — it renders a MenuItem. It stays a molecule and
dies on its own deprecation track (*"removal in the next major"*), which is a
separate matter from tier.

*From `organisms/` (1):*

| File | Why it isn't an organism |
|---|---|
| `EditorShell.jsx` | *"The two-rail editor layout **frame**"* — slot props (`topbar/left/right/children`) + Dividers between whichever slots are filled. Same failure as AssetGrid, at region scale |

**Checked and kept, so they are not relitigated:** `Carousel` (paints its own
kol-embla chrome + prev/next controls) · `DocsToc` (paints the nav rows) ·
`SpecList` (paints the dl rows + dividers) · `AlignmentGrid` (paints six icon
Buttons from its own default config) · `ImageBlock`/`VideoBlock` (visible
captioned media) · `PropertyInput` (Label + control, the canonical molecule) ·
`Image`/`HlsVideo` (the DS's content elements — an `<img>`/`<video>` with the
placeholder fallback) · `GalleryCarousel`/`Canvas`/`Modal` (paint their own
regions). Flat packages not swept — ownership tiers (2026-07-30) govern them,
not the atomic shelf.

**Section/LabeledControl merge flag — WITHDRAWN (user, 2026-08-09).** The JSX is
near-identical, which is what got pattern-matched, but the roles differ:
`LabeledControl` labels **one** control (`hint` + `inline` modes — the one the
user actually uses); `Section` labels a **group** — a stack of several controls
in an inspector panel. Group header vs field label. Both stay molecules,
untouched.

**Not part of this:** `PaletteHarmonyWheel` is a canvas hue ring — it paints and
it stands, so it stays a component (the user kept it 2026-08-09). Its own
`taxonomy-ok:` comment says it belongs beside SpectrumControls in molecules; that
is a one-row atomic re-file, tracked separately, **not** a new group.

`Figure` and `TiltCard` were called borderline in the first draft. TiltCard is in
the list above; `Figure` paints and stands, so it stays an atom. No shelf is
created for "borderline".

### The count

**13 files → `utilities/`.** Atoms 37 → 29 · molecules 36 → 32 · organisms
20 → 19. One sidebar group appears. **User signed off on the list 2026-08-09**
("other than that im good with it") — FullscreenOverlay is the one row still
his to overrule.

**✅ EXECUTED 2026-08-09 (user "go").** Folder created, 13 moved, barrel +
15 internal imports repointed, `utilities` taught to roster/registry/admitted,
the paints-law + heuristic gate added to `validate-taxonomy.mjs` (check 4),
`validate-roster.mjs` folder set widened, law written into `00-taxonomy.md`,
map appended to `02-placement.md § The utilities re-file`. **All 19 gates
clean.** Local on HMR — part of the standing unpublished component delta.

**Nothing is deleted, renamed, or unexported.** Every import path that consumers
use today keeps working — the barrel (`src/index.js`) re-exports from the new
folder, so `import { AssetGrid } from '@kolkrabbi/kol-component'` is untouched.
`InteractiveImage` (0 consumers anywhere, ever) is the one retire, to `_tmp/`.
`rm` is not in this plan.

### The law to write into `00-taxonomy.md`

> **An atom paints, and it stands alone.** Strip its children and its props: if
> nothing renders, it is layout, behavior, or CSS — not a component. If it
> renders only *onto* or *inside* another component, it is that component's
> member, not its peer.

Then a gate — `validate:taxonomy` grows a check that every file in `atoms/`
renders something with no props. Without the gate this regrows.

### Direct answers

- **"Why is AssetPlaceholder an atom? you can't view it."** You can — it draws
  the dashed `MISSING` tile in your screenshot. But you are right that it does
  not belong: it is what `Image` shows when it fails, so it is a **state of
  Image**, not a peer of Button. It fails Test 2, not Test 1.
- **"Same argument for TransparentX / ExitPreview / AssetGrid."** Correct on all
  three, by three different routes: TransparentX is a decoration, ExitPreview is
  framework chrome (its own stylesheet already lives there), AssetGrid paints
  nothing at all. AssetGrid is the cleanest failure on the shelf.
- **"Why not make a utility category?"** That is exactly the fix, and it is the
  whole fix. `packages/component/src/utilities/`, one sidebar group, eight files.
  The Function axis already had a `Utility · non-visual helpers` entry that
  nothing was ever filed into — this is the Tier half it was missing.

---

## 5. Wave D — the space between the words

`showcase/src/nav/labels.js` exists. It was written on the user's 2026-08-01
ruling, and its own docblock quotes him:

> *"its very amateur that you cant start a sentence or word with a Capital? or
> Create a space between CreateButton.jsx or whatever [ Create Button ]"*

`labelFromSlug('SectionLabel')` returns **`Section Label`**. It is correct. It
has been correct for eight days.

**It is called in exactly one place** — `ShellChrome.jsx:210`, for vault category
labels. Component names render raw through `{c.name}` at
`Components.jsx:50`, `Components.jsx:54`, `ComponentPage.jsx:47`,
`ComponentPage.jsx:68`, and `component-page-parts.jsx:163/169`, plus the sidebar
tree.

So the rule was written and never wired to the surface he is actually looking at.
That is the whole answer to *"you say you do, but never address it"*.

**Fix:** the registry carries `displayName = labelFromSlug(name)` beside `name`.
Every human-facing render reads `displayName`; imports, snippets, slugs and file
paths keep the identifier. This is the shadcn/Radix split — `Alert Dialog` on the
page, `AlertDialog` in the import — so it is convention, not invention.

One edit at the registry, six call sites, and `Section Label` · `Media Card` ·
`Empty State` · `Overlay Glass Panel` all fix together and stay fixed.

---

## 6. Wave B — two real component defects

**B1 — Badge ≠ StatusChip.** The tones were synced 2026-08-09; the *box* was not.

| | StatusChip (`FieldRow.jsx:68`) | Badge (`kol-components-molecules.css:382`) |
|---|---|---|
| gap | `gap-2` | **none** |
| radius | `rounded-full` | `4px` |
| type | `kol-mono-12` | `font-size: 10/12/14px` |
| box | `px-2 py-0.5` | `height: 20/24/28px` + `padding: 0 6/8/12px` |

The gap is the one he asked for: **`gap-2`**. But a sibling pair cannot agree on
tone and disagree on every other measurement — the whole box moves onto
StatusChip's grammar, or they are not siblings.

**B2 — helper-mono on paragraphs.** `kol-helper-*` is `line-height: 1` mono for
single-line chrome; `kol-mono-*` is the line-height-bearing family for anything
that can wrap. Two confirmed faults:

- `EmptyState.jsx` — `kol-helper-16` on `title`, `kol-helper-12` on `footer`.
  Both wrap in the demo right now.
- `showcase/src/demos/ExitPreview.jsx:37` — `kol-helper-12` on a
  three-clause sentence.

This is the `kol-type-conform` fault line. Worth a repo-wide sweep for
`kol-helper-*` on `<p>`, not just these two.

---

## 7. Sequence

The order is not taste — each wave removes noise the next one would otherwise
have to see through.

1. **C** first. Until the cards stop overflowing, every other visual judgment on
   `/components` is made through a broken lens.
2. **D** next. Cheap, and it is the label on every card C just fixed.
3. **B** — two contained package fixes.
4. **A** — chrome. A2 is blocked on the typeface answer; A1 and A3 are not.
5. **E** last, and **jointly**. Retiring components is the user's call, not the
   agent's. What ships from this plan is the evidence table and the proposed bar.

**Publishing:** component + theme already carry an unpublished delta from the
homepage-review arc. Nothing here publishes until the user signs off on that
delta *and* on these — one wave, not seven.
