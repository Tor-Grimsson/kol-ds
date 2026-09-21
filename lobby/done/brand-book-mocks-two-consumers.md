# brand-book-mocks-two-consumers — four styleguide files live in two brand apps, two of them byte-identical, none has a DS counterpart

**Filed:** 2026-09-03 ← **kol-client-olina**
**Package:** `@kolkrabbi/kol-styleguide@0.3.0` — the gap in the set
**Origin:** `apps/brand`'s styleguide retirement. Two of seven files went onto the package (`LogoCard`, `ClearspaceDiagram`); these four had nowhere to go.

## The measurement

`kol-client-olina/apps/brand/src/components/styleguide/` against
`kol-website/apps/brand/src/components/styleguide/`, diffed file by file:

| file | lines (olina / website) | diff |
|---|---|---|
| `AssetCard` | 25 / 25 | **byte-identical** |
| `Swatch` | 23 / 23 | **byte-identical** |
| `SocialMocks` | 136 / 136 | 4 lines |
| `StationeryMocks` | 724 / 722 | 32 lines |

908 lines, two consumers, and the two smallest are the same file twice over.
The divergence in the other two is client data (names, addresses, cover
imagery) — the structure is one component.

## What they are

- **`AssetCard`** — a download tile: preview node, label, format, a download control. The generic wrapper every asset page repeats.
- **`Swatch`** — chip + meta row (`name` + uppercased hex) + an optional canonical-anchor dot. The DS `ColorSwatch` is the **chip only**; this is the documented-swatch form a colour page needs, and `.kol-swatch` / `.kol-swatch-meta` already ship in `kol-components-molecules.css`. The CSS is in the DS and the component is not.
- **`SocialMocks`** — avatar + post/story frames at 1:1, 4:5, 9:16, for showing a mark in situ.
- **`StationeryMocks`** — business card front/back, letterhead, envelope, email signature. The largest single file in either app's styleguide folder.

## The ask

Take all four into `@kolkrabbi/kol-styleguide`, asset-agnostic the way `LogoCard`
0.3.0 already is — every mark, image and string a consumer-injected node or
prop, no registry reads, no baked client data. `Swatch` composes the existing
`ColorSwatch` rather than redrawing the chip.

This is the case that meets the bar the design-editor ticket failed: **two
consumers already have the code.** Not "this looks portable" — two repos are
maintaining the same file, and one of them is a client deliverable.

## Consumer status

All four kept local in `apps/brand`, unchanged. On ship this repo retires them
and `src/components/styleguide/` is down to `AssetTable` alone (its own ticket,
`assettable-package-dropped-its-wiring`). No stopgap, nothing blocked.

---

## PARTIAL — 2026-09-03 · kol-styleguide 0.4.0 · three of four files, six of StationeryMocks' 27 exports

**Shipped, asset-agnostic, in `@kolkrabbi/kol-styleguide@0.4.0`:**

| file | as | notes |
|---|---|---|
| `AssetCard` | `AssetCard` | straight carry-through — same elements, classes and order; `backdrop` + `className` added |
| `Swatch` | `Swatch` | composes `ColorSwatch` per the ask |
| `SocialMocks` | `PostPhoto` · `PostType` · `PostProduct` · `PostEditorial` · `StoryPhoto` · `StoryType` · **`ProfileAvatar`** | all 7; `Avatar` **renamed** — kol-component already exports an `Avatar` (a person's) and the roster gate catches the collision |
| `StationeryMocks` | `BusinessCardFront` · `BusinessCardBack` · `Envelope` · `Letterhead` · `LetterheadCorrespondence` (alias `LetterheadB`) · `EmailSignature` | **6 of 27** — see below |

Injection follows `LogoCard`: `mark` (node), `palette`, `fonts`, and `info` for
the brand block, each merged over neutral defaults so a partial `info` cannot
render `undefined` mid-sheet. `'Bricolage Grotesque'` / `'JetBrains Mono'` by
name are gone — the defaults are `--kol-font-family-sans-narrow` and
`--kol-font-family-mono`. Geometry is the forks': the aspect boxes, the mark
fractions (`w-1/4` · `w-1/5` · `w-1/6` · `w-1/3` · `w-1/2`), the corner insets,
every type size. All thirteen mocks render on the showcase's styleguide set page
off ONE authored `BRAND_BOOK` object, which is both the exercise and the
reference call shape.

**~~⚠ Your `Swatch` was rendering nothing.~~ WRONG — corrected 2026-09-03,
kol-styleguide 0.4.1.** The `.kol-swatch` / `.kol-swatch-chip` /
`.kol-swatch-meta` rules are real: they ship in **`@kolkrabbi/kol-framework`**
(`kol-framework.css`, the "Swatch / Ramp (color specimens)" block — a 6px-gap
column, a **96px-tall** chip at radius 4, a baseline-aligned wrapping meta row),
and olina confirmed them in its own built CSS. My check covered kol-theme, both
apps and the showcase and never looked in kol-framework, so only
`.kol-swatch-none-marker` came back and I published a false claim about the
estate in the component's own docstring. The ticket's version was wrong in the
other direction — right that they ship, wrong about which package. Both are now
recorded correctly. They are stragglers: `.kol-mood-tile-*` left that same
framework block for `kol-theme/kol-components-styleguide.css` on 2026-07-10 and
these did not.

**And the geometry is fixed, which was the practical half.** 0.4.0's `Swatch`
put a 24px `ColorSwatch` where the forks draw a 96px specimen bar — not a
carry-through, and olina was right to hold the retirement. **0.4.1 draws the
forks' geometry itself**: full-column chip at `height` (default 96) via
`ColorSwatch size="stretch"`, the 6px column gap, and the row-wrapped baseline
meta line. It does NOT wear the classes and kol-framework does not become a
peer — a component whose look depends on another package's stylesheet being
imported is the exact defect `styleguide-barrel-is-unimportable` was filed
about. A fork swaps onto it with no new install and no visual change; `height`
is the seam for a shallower specimen.

⚠ **Left for the user:** those three rules sit in the wrong package. Moving them
to `kol-theme/kol-components-styleguide.css` beside their relocated siblings is
the obvious tidy, but it is a framework CSS retirement with unknown consumers
and it is not mine to call.

**Held: the 21 garment / packaging exports** — `Hangtag`, `SwingTag`,
`CareLabel`, `NeckLabel`, `SizeLabel`, `EditionCard`, `DustBag`, `GarmentBag`,
`HangtagLong`, `Packaging` and their B variants, ~500 of the file's 724 lines.
Not laziness — the file has accreted **three brands' content in one place**: a
named customer and their street address in the letter body, prices in €, woven
neck-label copy referencing another client's marks, `SIZE_DATA`, a care-icon
sheet, and a palette its own source comment attributes to *"another client's
palette, carried in with the app"*. Carrying that through verbatim would ship
one client's correspondence and another's product line inside a shared package;
stripping it is not a port but a new API of 21 components at four to eight text
props each — my call to invent, which is the user's to make.

**The recommendation:** take them as a second file, `GarmentMocks`, in one pass
with the props named deliberately, and separate from the stationery set they
were mixed into. Both brand apps keep their forks until then; nothing regresses
and nothing is blocked. Ruling wanted, not started.

## ✅ RESOLUTION — 2026-09-03 · @kolkrabbi/kol-styleguide@0.4.1

Three of the four files shipped; the garment half is retired by the user's ruling, not deferred.

Shipped in kol-styleguide 0.4.0, corrected in 0.4.1:
- AssetCard — straight carry-through, same elements and classes; backdrop + className added.
- Swatch — composes ColorSwatch per the ask, and carries your geometry: full-column chip at height (default 96), the 6px column gap, the row/space-between/baseline meta line. 0.4.0 got this wrong (a 24px chip where you draw a 96px specimen bar) and kol-client-olina held the retirement on it; 0.4.1 is the fix.
- SocialMocks — all seven, with Avatar renamed ProfileAvatar: kol-component already exports an Avatar (a person's), and two packages exporting one name is a collision the roster gate catches.
- StationeryMocks — the six true stationery pieces: BusinessCardFront/Back, Envelope, Letterhead, LetterheadCorrespondence (alias LetterheadB kept so call sites don't move), EmailSignature.

Injection follows LogoCard: mark node, palette, fonts, info, each merged over neutral defaults so a partial info cannot render undefined mid-sheet. The client fonts by name are gone. Geometry is the forks' throughout — aspect boxes, mark fractions, insets, every type size. All thirteen render on the showcase's styleguide set page off one authored BRAND_BOOK object, which is both the exercise and the reference call shape.

CORRECTION ON THE RECORD: my 0.4.0 note claimed .kol-swatch / -chip / -meta exist in no stylesheet in the estate. That was wrong. They ship in @kolkrabbi/kol-framework (kol-framework.css, the "Swatch / Ramp" block) — kol-client-olina found it and confirmed it in its own built CSS. My grep covered kol-theme, both apps and the showcase and never looked in kol-framework. The ticket's version was wrong the other way (right that they ship, wrong about the package). The component draws the geometry itself rather than wearing the classes, so kol-framework does not become a peer of kol-styleguide.

RETIRED — the 21 garment / packaging exports. User ruling, verbatim: "no its just one client that uses garments I dont need it in ds." Hangtag, SwingTag, CareLabel, NeckLabel, SizeLabel, EditionCard, DustBag, GarmentBag, HangtagLong, Packaging and their B variants stay client work in the brand apps. Checked before asking: zero imports of any of those names from the package anywhere in the estate — both brand apps carry local copies (kol-website's has 25 exports of its own). The ticket's "two consumers already have the code" bar was true of the file and not of the need.

Not done and not owed: the .kol-swatch* rules are stragglers in kol-framework — kol-mood-tile-* left that same block for kol-theme/kol-components-styleguide.css on 2026-07-10 and these did not. Left in place deliberately: nothing is broken, no component depends on them now, and moving rules between packages is a breaking import change for no gain.

**Remainder here:** none — kol-client-olina bump kol-styleguide to 0.4.1 and retire AssetCard, Swatch, SocialMocks and the six stationery pieces; the garment kit stays yours by ruling.

