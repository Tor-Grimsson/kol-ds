---
component: LibraryMastersFoundryWebsite
source: kol-website/.kol/llm-context/plans/2026-11-08-foundry-to-figma.md#2.2b (measurements in kol-website/_tmp/2026-11-08-foundry-figma/ and _tmp/2026-11-08-website-figma/)
staged: 2026-11-08
status: closed
deps: [TypeTester, SectionFaq, Accordion, AccordionPanel, ContentRow, ContentCard, ContentText, SectionCardItem, SectionHero, SectionCta, SectionText, ExhibitLinkCard, SourcesReferences, ShellHeader, Slider, Iconset]
---

# LibraryMastersFoundryWebsite

## Purpose
`◇ foundry--kol-ds-ui` (uKJdSFNoAJkYqqpiSXETFR) and `◇ website--kol-ds-ui` (7YxebZmHy7slweU5E1gt7p) are being built from `❖ library--kol-ds-ui` instances only. These library masters are missing or disagree with the shipped code, so the foundry page template, its 14 screens and several website screens wait on them. Figma work only — no package change is asked. kol-website's own sessions were blocked from writing the library, which is yours.

## Anatomy
One Figma pass on the library: new masters on their tier pages, corrections to existing ones, two icons. Each master measured from the code (code is the only source), per the kol-figma protocol.

## Variants
### 1. Missing masters — foundry (measured, dark, 1440 / 390, from the built apps/web)

| Master | Page / section | Spec |
|---|---|---|
| _Slider base `value` | Molecules › Inputs (1238:4586) | Thumb is ABSOLUTE at x 94/200 with MIN constraint, so it never follows the instance width. Plan: keep current variants as `value=50`; on minimal/float/scrub/panel horizontal put the thumb in an absolute GRID overlay `value` (constraints STRETCH, cols [FLEX v][FIXED thumb w][FLEX 100−v]; v 0 / 100 → FIXED 0), float's fg-64 run in col 0 (hide the _Track run); clone for 0…100 by 10. Expose `slider-base` in every Slider variant (isExposedInstance) so `value` shows on Slider. |
| TypeTester | Molecules › Inputs | frame: surface-primary, 1px fg-08 inside, radius 4, pad 24 / 16, gap 24, min-h 160. Head: wrap, space-between, gap 32 / 16: Dropdown filled **sm** (130 × 26, mono-12) · Sliders (minimal, readout input, 224 wide, gap 32 / 16; Size · Leading · Spacing, phone Size only). Sample: TEXT, font per instance, 96 / 64 / 48 / 24 ladder is the caller's, leading 90+10 = 100%, truncation ENDING maxLines = lineClamp. 1440 heights: 197 (96/1) · 293 · 293 · 202. |
| AccordionPanel | Molecules › Content | border-top 1px fg-08 (last panel also bottom); trigger py 16, gap 16: title helper-12 emphasis, optional meta helper-12 fg-48 (ml auto mr 12), chevron helper-16 fg-48 `+` / `−` (min-w 12); body pt 8 pb 24 = slot. Closed 49 tall (57 when the title wraps at 390). `open` true / false. |
| Accordion | Molecules › Content | vertical stack (slot) of AccordionPanel; mt 8 mb 24 (SectionFaq zeroes them). |
| SectionFaq | Organisms › Sections (1104:144307) | section px 56 / 32 (md) / 20, py 96 / 64, min-h 60vh; inner max-w content-column 768, gap 32: SectionText (headline heading-02 default, body) over Accordion. Desktop 1440 wide; phone 390. |
| ContentRow `typeface` | Molecules › Content (529:18982) | column, not line: surface-secondary, 1px tone/border, radius sm, pad 24, gap 24, min-h 160; head = title mono-14 upper emphasis + body mono-12 meta (gap 8) left · detail mono-14 emphasis + date mono-12 fg-64 right (items end); `footer` SLOT full width (TypefaceAlphabet 52). 1344 × 168 / 350 × 168. Header = new ContentText `variant=showcaseCanvas, form=row`. |
| ContentCard `typeface` | Molecules › Content (52:308) | 500 tall fixed (432 / 350 wide), surface-secondary, 1px tone/border, radius sm; `cover` slot absolute fill (the caller's specimen); plate at top pad 24: ContentText `showcaseCanvas, form=card` (title mono-14 upper emphasis, body mono-12 meta, gap 8). The hover `reveal` (surface-inverse overlay) is a state — not drawn. |
| SectionCardItem text-only | Molecules › Content (471:14994) | new VARIANT `visual=image|none` (existing variants → image). none: no fill, 1px fg-08, radius 4, pad 24 / 16, min-h 180, justify between: header (title helper-16 + optional 16 icon, gap 8) top, description mono-12 fg-48 bottom. 432 × 180 / 350 × 180. |

### 2. Missing masters — website
- **SectionHero `split`** — the /studio hero (live /studio is 3401 tall at 1440; the screen is 1940 without it) and the /foundry hero.
- **SectionHero text-only** — the /foundry/licensing hero.
- **ContentCard `showcase`** — More Work on /work/:slug.
- **SectionCta `centered`** — the /prints CTA and the closing CTA on all seven /foundry pages.
- **ExhibitLinkCard** — the /workshop cards.
- **SourcesReferences** — the article sources block (kol-website's file held a local copy; it is retired to its `_trash`).

### 3. Masters that disagree with the code (height delta vs live, 1440 / 390)
- **SectionText `page`** +47 / −59.
- **SectionHero `text`** −90 / −140.
- **ContentCard `hero=true`** −109 / +421 — and no phone variant.
- **ContentCard `article`** −6 / +51 — and no eyebrow layer, so the post kicker cannot show.
- **ShellHeader** — 6 fixed sample tabs and no slot; /workshop renders 9. Ask: tabs as a slot (or an instance-swap list), so any count works.
- **Slider** — the thumb is absolute at a fixed x in `_Slider base`, so no instance can show a value. Ask: a `value` property that places the thumb (proposal in the table above, keeping today's variants as `value=50`).

### 4. Iconset
- **Mirror** and **Pin** — used by the /workshop rails, missing from the Iconset.

## Props
Property names = the code's props, per the protocol (`variant`, `form`, `visual`, `open`, `value`, text properties for what a screen changes, slots for what a caller fills).

## Styling
Every value in §1 is measured from the live DOM; tokens named there. Bind every fill, stroke, gap, pad and radius to its variable.

## States & interactions
Accordion `open` true / false. ContentCard `typeface` hover reveal is a state, not drawn.

## Dependencies
Existing library masters by instance: Dropdown, Slider, SectionText, ContentText, Iconset glyphs.

## Recreation notes
- The general seam each time: a slot or a property, never a one-off frame, so no second ticket is needed when a third app uses it.
- Pill `subtle` is NOT asked: it is a deprecated alias of `primary`.
- Close with audit / invalid-assets / nesting-check clean on the touched library pages and the master ids in the resolution. Publishing stays the user's click.

## ✅ RESOLUTION — 2026-11-08 · ❖ library--kol-ds-ui (n48kE2bJtrFjl7wxst30xH), unpublished — publishing is the user's click

Measured from kol-ds-ui `packages/` on a task-scoped showcase probe (`_tmp/figma/w40/m40.json`, dark, 1440 / 390) plus the ticket's live DOM. Audit 0 errors on Molecules (Inputs, Content, Cards) and Organisms (Sections, Shell); invalid-assets 0 / 0; nesting-check fakeCount 0 on both pages.

**§1 foundry**
- `_Slider base` `value` 0–100 by 10 — 1238:4586 (minimal / float / scrub / panel horizontal; the root is a 1-row grid [v fr · thumb · 100−v fr], track absolute behind; old variants = `value=50`). `slider-base` exposed in every `Slider` variant (577:20000).
- `TypeTester` — 1807:9219 (`breakpoint` desktop 1807:9107 / phone 1807:9187; `text` prop; Dropdown + Slider instances).
- `AccordionPanel` — 1805:58427 (`open` false 1805:58415 / true 1805:58420; `title`, `meta` + `metaText`, `body` slot). `Accordion` — 1805:58428 (`children` slot).
- `SectionFaq` — 1808:46173 (desktop 1808:46123 / phone 1808:46148), Organisms › Sections.
- `ContentRow` `variant=typeface` — 1804:39432 / phone 1804:39441 (`footer` slot). New `ContentText` `variant=showcaseCanvas` — row 1804:39292, card 1804:39289.
- `ContentCard` `variant=typeface` — 1804:39450 / phone 1804:39456 (`cover` slot absolute fill).
- `SectionCardItem` `visual=none` — 1804:39299 / phone 1804:39309 (existing = `visual=image`).

**§2 website**
- `SectionHero` `variant=split` — 1808:46190 / phone 1808:46200 (existing = `variant=media`).
- `ContentCard` `variant=showcase` — 1804:39462 / phone 1804:39464 (3/4, fg-04 rim; the hover drawer is a state, not drawn).
- `SectionCta` `variant=centered` — 1808:46174 / phone 1808:46182 (existing = `variant=editorial`).
- `ExhibitLinkCard` — 1807:9220 (Molecules › Cards; `image` slot). Its ink is the ordinary fg-64 / fg-48 / fg-08 ladder: the root is pinned to the opposite color mode (Light, the library is dark-first), as `.bg-surface-inverse` flips the ladder in code; fill `color/white` = surface-inverse in the dark context. (The interim fg-inverse variables were removed.)
- `SourcesReferences` — 1805:58451 (`sources` slot of `_SourcesReference` 1805:58445).

**§3 corrections**
- `SectionText`: the live /work and FAQ blocks are the no-level SectionText, not `page` — new `variant=default` × `headlineSize` heading-02 / heading-01 / display-01 / display-04 × `align` start / center (1804:45923, 1804:45929, 1804:45935, 1804:45941, 1808:9214, 1808:9220, 1808:9226, 1808:9232).
- `SectionHero` route=text — 472:15121 / 472:15131 at 900 tall (90vh), text at the foot (pb 224 / 128), display-01 caps.
- `ContentCard` article hero — 52:276 at 1344 (16:9 media) + phone 1804:39466; article card 52:291 at 432 + phone 1804:39475; new `breakpoint` prop; the nested `ContentText` is exposed, so eyebrow / title / body set from the card (eyebrow now sits after the tags, as the code orders it).
- `ShellHeader` — 1475:13767: the tab row is the `nav` slot, filled with `ShellHeaderTab` instances (new set 1808:46262, `active` false / true, `label`, `icon`).

**§4 Iconset** — nothing to add: Pin is `pushpin` (30:20) and the Mirror page's icon is `transparency` (33:88; `overlap` is its old name in `RENAMED_ICONS`). Use those names in the website file.

**Code Connect** written, not published (no full publish while the modal-family session runs): `figma/TypeTester`, `Accordion`, `AccordionPanel`, `SectionFaq`, `SourcesReferences`, `ExhibitLinkCard` `.figma.js`.
