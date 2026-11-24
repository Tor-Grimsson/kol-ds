# Plan — one type ramp, purpose sets, then library and code

**Raised:** 2026-11-14, user. Points verbatim: *"we should have a ramp and see whats the closes match"*; *"I've used type ramps like this … then I created style sets from the ramp, for differnt purposes like website set, blog set, ui/ux set"*; *"left group is for ramp and fonts, more general / right group is for rich text and styles, more specific. we can add UI text later"*; *"start with a copy of [1:3828] and lay out the ramp"*; *"can you plan futher then that?"*.
**Status:** W1–W6 built (6.1–6.8 published by him; 6.9 type file swapped; 6.10 set text styles + `SpecimenLive` in the library, awaiting his publish). W7 built in code, unpublished (7.3 Inter held). Open: his library publish, the npm publish on his word, W8.
**Shape:** W › phase › list.
**Definitions:** a ramp = the ordered steps, each a size, a line height and a tracking (nothing else). A style = one step + one weight + one family (+ case), and a purpose set is a list of styles. The sets are named after MarkdownPage's variants (his correction 2026-11-14): `article` (the website article), `site` (SiteLayout, the brand-guide text style; not "website") and `research`; UI is added later. Fonts per role (decided 2026-11-14): Special Gothic for display and headings, Inter for text, JetBrains Mono for labels.
**Laws carried:** the type file (○ type--kol-ds-ui `mmBE8t8EcxSdN7g4bUeHok`, section `Type kit` 9:2) is for planning: plain frames, no variables, no styles; agents load `kol-ds-claude` then `kol-figma`; LAW 21 (copy, never choose); no middot; no audit loops; originals stay untouched, work on copies.
**How a phase closes:** acceptance line first, one look at the end.

## W1 — The type-size-ramp sheet (left group) (P: "it could even be the same component with show/hide size ramp and show/hide weights? and obviously table below … and the header. each can take whatever font it wants")
### 1.1 — Range and steps (P: "IT ACCOUNTS FOR EVERYTHING.. not demanding use of everything")
- Range 6px to 128px. Rows: Display 128 down to 64, Heading 56 to 28, Text, Utility and Label on one shared list of 12 sizes — 24, 20, 18, 16, 14, 12, 11, 10, 9, 8, 7, 6 — differing only in line height and tracking. Subheading dropped (it existed to carry weight; bold titles, quotes and pull-outs are styles now). 1px steps below 12 (the div-4 rule broken on purpose).
- Units shown three ways: px, % and rem (16px base). Line height and tracking as a percentage of size, so a step keeps its proportions.
- No fluid clamp: the ramp is fixed; a style picks a different step per breakpoint (Tailwind's mobile-first way).
- Acceptance: every step listed in `15-type-ramp.md` with size, line height, tracking in px, % and rem; the doc updated to the new range.

### 1.2 — The Specimen system, on a new page (P: "think about the best ultimate system figma component for this setup. everything connected, easy to use, well named and labeled, all styled and connected"; "make a new page and show me")
Source: his `system` section (27:19230): parts above the black line, every sheet below it = one dark layout + light content + table footer. His `comp` (27:19229) and `2-sections-content-footer` (26:17641) set the look; copy it (LAW 21). The first agent build (component set 25:7480, rows 22:307, header 22:320, table row 22:347) is reused as nested parts where it fits.
- New page `Specimen` in the type file. Tree:
  - `SpecimenSheet` — the one layout: dark frame 1600 / 1360 inner; `content` slot (light sheet); `footer` slot (show/hide) with the KOL library `Table`, minimal variant, and `SpecimenNote` × n (label + text, each show/hide).
  - `SpecimenHeader` — the "Aa" card: font name, its cuts.
  - `SpecimenRamp` = `SpecimenRampSection` (Display, Heading, Text, Utility, Label) of `SpecimenRampRow` (step, sample, size, line height; case, italic, underline true/false); `SpecimenWeights` docked right (show/hide) of `SpecimenWeightsRow`, each row the height of its ramp row.
  - `SpecimenFontCard`, `SpecimenFontSheet` as content components.
- Font = a local variable collection `font` with modes Inter / Special Gothic / JetBrains Mono (family, weights each font offers, tracking); set once on the sheet instance, everything nested follows; weights a font lacks hidden by the mode.
- Rows heights from size and line-height variables so weights rows line up with ramp rows.
- Assembled examples on the page: ramp sheet, ramp + weights sheet, font card sheets, all as `SpecimenSheet` instances.
- Acceptance: every part a named component in the `Specimen` family; sheets are instances, nothing detached; switching the `font` mode on a sheet changes every nested row; weights rows line up 1:1; the table is the library `Table` minimal.

### 1.4 — The Specimen system rebuilds every view in his test frame (P: "if your component works then you can create all these views … FIX IT THEN")
Cause: the weights live inside the sheet's content, so the sheet widens instead of the panel hanging outside the dark frame; and several contents in one sheet was never proven.
- `SpecimenSheet` root becomes a transparent horizontal row: the dark `frame` (clip on: content slot + footer) and an `aside` slot beside it (show/hide), its top offset equal to the header height so `SpecimenWeights` rows line up with the ramp rows while the panel hangs outside the dark frame.
- The `content` slot takes several items stacked (font card, mono card, Typography sheet), the footer table under them.
- Rebuild every view in his test frame (36:42385) from `Specimen…` instances only, in a new section `Specimen test` beside it: the table alone; the stacked font column with table; each ramp sheet; the ramp with weights hanging outside.
- Acceptance: every view in 36:42385 has an instance-only twin in `Specimen test` (0 detached, 0 hand-drawn layers), screenshot side by side with his; weights rows 1:1 with ramp rows; weights panel outside the dark frame's right edge.

### 1.3 — Roles, defined (P: "Utility, what are we saying utility is? Label, what are we saying a label is?")
- Text: reading text. Utility: what you act on — buttons, controls, inputs, tabs, menu rows, table cells; one line, ellipsis and a max width in ch, never wraps (a style rule, not a ramp step). Label: small text that names or tags something — eyebrows, section labels, meta, captions, keyboard hints, tooltips. Mono and uppercase are not the ramp's.
- Acceptance: the three definitions in `15-type-ramp.md`.

## W2 — Font sheets (left group)
### 2.1 — The three fonts in one format
- The mono card and display alphabet card format, one per font (Special Gothic, Inter, JetBrains Mono), replacing the old Schibsted and Public Sans content.
- Acceptance: 3 cards, each with its font's alphabet, figures and weights.

## W3 — The style map (left group)
### 3.1 — The table as ramp-to-style
- The table frame becomes: style, set, step, weight, family, case. First draft of the website and blog sets from what the right-group frames use today, each mapped to its closest step; the delta shown where it differs.
- Acceptance: one row per style; every style names a step that exists in the ramp.

## W4 — The sets in use (right group)
### 4.1 — Retype the specific frames
- Style specs, Rich text, Article and the set-in-use sheet: every text layer set to its style from W3 (step + weight + family), so the ramp is seen in real layouts.
- Acceptance: 0 text layers off the ramp in those four frames.

## W5 — Your rulings — ✅ ruled 2026-11-14 (P: "we already ruled on that")
- The ramp (48 steps), fonts per role and the sets stand as written in `15-type-ramp.md`.

## W6 — Into the library
- The ramp as variables (size, line height, tracking per step), weights and families as variables, each set's styles (`article`, `site`, `research`) as text styles in ❖ library--kol-ds-ui; your publish.

### 6.1 — Real fonts only (P: "didnt we swap schibsted for grotesk? and why public sans? we added inter no?")
- The library preview sheets use the decided fonts: Special Gothic for display, Inter for text, JetBrains Mono for labels. The Schibsted Grotesk and Public Sans modes (added only to copy his old reference sheet) come out of the library `type` collection; no Specimen instance uses them after.
- Acceptance: `type` has no Schibsted Grotesk or Public Sans mode; every preview sheet resolves to Special Gothic, Inter or JetBrains Mono.

### 6.2 — Specimen parts mapped onto shipped components (P: "SpecimenGroupHead, SpecimenNote, SpecimenFooter, SpecimenFontSheetRow, SpecimenFontFace, SpecimenFooterGroup, is any of this candidate for atom or molecule?"; "was there a reason for fill and stroke on SpecimenNote?")
Cause: the Specimen parts were built in the type file with no library to draw from, so some redraw what KOL already ships.
- Read 2026-11-14: each part's Figma tree against the shipped component's source. Structure is confirmed; type sizes and inks are still to be compared when each swap is made.

| Specimen part | Its tree | Shipped match | Verdict |
|---|---|---|---|
| SpecimenNote | a label cell (320) and a text cell (800), each with a cell fill and stroke | a row of the library `Table` (the Parts table above it is already `Table`) | replace: the notes become `Table` rows; the hand-drawn cells go |
| SpecimenFooterGroup | a title over a content slot | `LabeledControl`, label above (any node as label, any body) | replace |
| SpecimenFontFace | name, then description and detail paragraphs | `SectionText` `variant="content"` (headline over body, no eyebrow) | replace |
| SpecimenGroupHead | a label over a 1px rule | kol-foundry `SpecimenSectionHeader` (title, rule beneath, optional controls right) | becomes `SpecimenHeader` on the `SectionHeader` atom, 6.8 |
| SpecimenFontSheetRow | weight name left, alphabet right | `SpecimenSample` with the label beside the sample | becomes a `SpecimenSample` layout, 6.7 |
| SpecimenFooter | the old table + notes footer | superseded by SpecimenFooterGroup | to the `_trash` page |
| SpecimenCut | a 48 tile with "Aa", then name and cut lines | none (`Tag` is a keyword chip, `SizeChip` one letter) | becomes `Chip`, 6.3 |

- The shipped type-specimen kit (`TypeSample`, `TypeSpecCard`) lives in **kol-foundry**, not kol-styleguide; `TypeBlock` is in kol-design-editor. W7 decides Specimen's code home against that, extending the kit instead of adding twins.
- A part with no exact match stays Specimen and is listed as a gap (show the gap, never force a fit).
- Acceptance: a mapping table on the Styleguide page, one row per Specimen part, each row "library instance", "stays Specimen" or "gap"; 0 Specimen masters that duplicate a shipped component; SpecimenFooter on `_trash`.

### 6.3 — Chip, the shared molecule (P: "specimen cut [icon frame + text] seems like it could be reusable 'chip' with slots? even an atom?"; "agreed Chip is good")
Ruled 2026-11-14: the name is `Chip`, a molecule (it nests an `IconFrame`, as `CloseButton` does).
- `Chip` on the Molecules page: a leading slot, a title and a meta line. `SpecimenCut` instances become `Chip` with "Aa" in the slot; the old master goes to the `_trash` page.
- Code (W7): `Chip` in kol-component molecules with the same props. The docs tell it apart from the `chip` icon and from `Tag`, `Pill` and `SizeChip`.
- Acceptance: `Chip` is one library component with a leading slot; 0 `SpecimenCut` instances left; the code component exists with the same props.

### 6.4 — The header: both variants, chips that fit (P: "where is the other specimen header? why didnt it come with?"; "specimen header clips because you dont manage the font chip")
Cause: the header was copied with one variant and a fixed-height chip block sized for four cuts.
- Renamed `SpecimenDisplay` (his ruling 2026-11-14: "its a wrong name anyway, since its a display"), which frees `SpecimenHeader` for 6.8.
- `SpecimenDisplay` becomes a set with his two variants (type file 27:21248: Styles and Ramp), the Ramp one copied exactly; the ramp previews use it where his test frame does.
- Chips at his reference size (library 2162:21780), in a wrapping grid at the bottom left; the card grows when a font has more cuts.
- Acceptance: 2 variants; 0 clipped chips in every font mode (Inter shows 9); chip width and height equal the reference.

### 6.5 — One Light pin (P: "why are so many components set to light mode? mode is set on the page ? right?")
Cause: Light was pinned on each light component when the colours were bound to tokens.
- Light is set once, on `SpecimenSheet`'s `content` frame; every Specimen master carries no explicit mode.
- Acceptance: 0 explicit theme modes on Specimen masters; the previews look unchanged.

### 6.6 — The Styleguide page in the library convention (P: "its very hard to see the components … just check out other pages for the convension, atoms")
- Laid out as the Atoms page is: plainly named sections by group, one documentation card per component or set (the same card Atoms uses), the card's preview area setting the mode so every component reads. Masters are moved, never recreated; Previews stays after the component sections.
- NOTE 1 to 3 in the preview footers checked against his original text (all three show the same text today).
- Acceptance: every Specimen master sits in a card; 0 loose masters in a section; 0 components dark on dark in a full-page screenshot; Previews instances still linked.

### 6.7 — The type sample family joins Specimen (P: "TypeSample would be a group of TypeSampleItem and that fits 'SpecimenFontSheetRow' as a vertically stacked variant"; "TypeSpecCard should also live with these comopnents, not in brand"; "if from portfolio kit it belongs with specimen")
Source: he pasted both from brand--kol-ds-ui onto the Styleguide page, frame `imp-brand` 2163:69392: documentation cards `TypeSample` (master 2163:69327) and `TypeSpecCard` (master 2163:69341).
- Names (his ruling 2026-11-14, Specimen prefix): the single caption-and-sample is `SpecimenSample`; the stack is `SpecimenSampleGroup` (was `TypeSample`); `TypeSpecCard` becomes `SpecimenSpec`. In code the old names stay as aliases on the retirement ledger.
- `SpecimenSample` is a new component: one caption and one sample (what each of TypeSample's three nested `type-sample` frames is today). Its layout is a true/false property: label above the sample (false, today's look) or label beside it (true, what `SpecimenFontSheetRow` is).
- `SpecimenSampleGroup` becomes the group: a slot stacking `SpecimenSample` instances, the hairline between them kept.
- `SpecimenFontSheet` uses `SpecimenSample` (label beside) for its weight rows; `SpecimenFontSheetRow` goes to the `_trash` page.
- `SpecimenSpec` stays as pasted, its sample slot taking a `SpecimenSample`.
- Both masters rebound from Brand's variables and styles to the library's `theme`, `spacing` and `type`; middots in their sample captions ("Sans · 400 · 32/38") replaced with plain separators.
- Their cards leave `imp-brand` for the page's sections in 6.6 (they already use the documentation card: `_Header`, `Specimen`, `_Footer`).
- Acceptance: `SpecimenSample` exists with one true/false layout property; `SpecimenSampleGroup` holds 0 loose `type-sample` frames, only `SpecimenSample` instances; 0 `SpecimenFontSheetRow` instances left; 0 bindings to Brand-file variables or styles on the two masters; the font sheet preview looks unchanged.

### 6.8 — SectionHeader, the shared atom, and SpecimenHeader on top of it (P: "its a common pattern, I suggest its an atom and its Maybe SectionHeader with SectionFooter partner"; "is there something wrong with nesting SectionHeader to create SpecimenHeader?"; "iconframe right? on the left side? so SectionHeader would have 2 slots")
Ruled 2026-11-14.
- `SectionHeader`: a new atom on the Atoms page. A leading slot (an `IconFrame`), the label, a trailing slot (page number, section name, controls), and a rule beneath that the component draws itself (no nested `Divider`, so it stays an atom). `SectionFooter` is its partner: the rule above, the same slots.
- `SpecimenHeader` (the name freed by 6.4's rename) nests `SectionHeader` and presets the two Specimen forms with one true/false property `controls`: false is the plain group head (today's `SpecimenGroupHead`), true puts the weight and style dropdowns in the trailing slot (kol-foundry's `SpecimenSectionHeader`).
- `SpecimenGroupHead` instances become `SpecimenHeader`; the old master goes to the `_trash` page.
- Code (W7): `SectionHeader` and `SectionFooter` in kol-component atoms; `SpecimenSectionHeader` becomes `SpecimenHeader` on top of it, old name an alias. kol-dashboards has a `SectionHead` (the float card section head): the docs tell the two apart.
- Acceptance: `SectionHeader` and `SectionFooter` exist with a leading and a trailing slot each; `SpecimenHeader` has exactly one true/false property and contains one `SectionHeader` instance; 0 `SpecimenGroupHead` instances left.

Order inside W6: 6.2 → 6.3 → 6.7 → 6.8 → 6.4 → 6.5 → 6.6, one agent, then his publish. Nothing waits on a ruling.

### 6.9 — The type file uses the library's Specimen (P: "library is published") — ✅ built 2026-11-14 (the local masters section was already gone from the file; his `Section 1` 36:42385 untouched)
- In ○ type--kol-ds-ui (`mmBE8t8EcxSdN7g4bUeHok`), every instance of the local Specimen components (page `Specimen` 31:12399, section `Specimen test` 39:27295) is swapped to the published library component of the new name (`SpecimenDisplay`, `SpecimenHeader`, `Chip`, `SpecimenSample` and the rest). The local masters section 34:22773 moves to the file's `_trash` page. His own frames (36:42385 and the `system` section) are not touched.
- Acceptance: 0 instances in the type file whose main component is local; the six test views still match his; section 34:22773 on `_trash`.

### 6.10 — The set text styles — ✅ built 2026-11-14 (86 styles: article 27, site 10, research 27, reader 22; `Sets` section 2186:11434; `SpecimenLive` + `SpecimenLiveRow` in Ramp; unpublished) (P: "website article is called - article, site is … SiteLayout, its the brandguide text style, then research is the third")
Source: `packages/framework/src/markdownVariants.js` (the three MarkdownPage variants) and the classes each one uses.
- Mapping table written 2026-11-14: `docs/documentation/01-foundations/17-type-sets.md`, the three sets plus the Folio reader's family (`apps/folio/src/folio/reader.css`; P: "you could also look at the folio reader styles and map that since that will get added to markdownPage variant"). Ruled 2026-11-14 (phone title 48, research body 16, Folio 13 → 14).
- For each set, `article`, `site` and `research`, one row per role the variant renders (title, headings, lede, body, quote, caption, code, table, label…): today's size, line height, weight and font, the closest ramp step, and the delta. The table goes on the Styleguide page as a library `Table`, and in `15-type-ramp.md`.
- Each row becomes a library text style named `<set>/<role>`, its size and line height bound to the ramp variables, its family to the role's font (Special Gothic display and headings, Inter text, JetBrains Mono labels), weight per row.
- A role whose value sits between two steps takes the nearer one; a delta over 2px is listed for his eye, not silently rounded.
- Acceptance: every role in `markdownVariants.js` has a row in each set it appears in; every `<set>/<role>` text style has 0 raw size or line-height values; the delta list is in the doc.

### 6.11 — One font card, named by layout not by font — ✅ built 2026-11-14 (his set 2193:78770, variants `ramp=false` / `ramp=true`, both 1280 × 800; code folded into `SpecimenFontCard.jsx`, old file in `_tmp/2026-11-14-specimen-monocard-folded/`; no alias, the old name was never published; cuts are 4 `Chip` instances in Figma and code, left column 392; weights rows read the master's words; library unpublished) (P: "both of those are just font layouts, its stupid to say one is mono and the other is not,.. layout doesnt care about WHAT FONT")

Cause: `SpecimenMonoCard` (2144:10360) was named after the font it happened to show. It is a second layout of the font card: mark, role and family, cuts, alphabet, beside a ramp. Nothing in it is mono-only.

- `SpecimenMonoCard` becomes a variant of `SpecimenFontCard`: one set, toggle `ramp` false (name, alphabet, role) and true (mark, cuts, alphabet beside the ramp), the same toggle `SpecimenDisplay` has.
- Either variant takes any font from the `type` collection; no font name in a component, layer or description.
- The four `cut` frames in the `ramp` variant become `Chip` instances (ruled in 6.3), in Figma and in code.
- Code: `SpecimenMonoCard.jsx` folds into `SpecimenFontCard.jsx` as the `ramp` prop; the old name stays as an alias on the retirements ledger; showcase preview, classification and `10-styleguide-system.md` follow.
- The Styleguide page's `SpecimenMonoCard` documentation card (2173:11381) folds into the `SpecimenFontCard` card, which shows both variants.
- The weights rows label in code ("Bold" on every row) is fixed to the master's in the same pass.

Acceptance: 0 nodes and 0 source files named `SpecimenMonoCard` apart from the alias line; `SpecimenFontCard` is one set with exactly two variants `ramp=false` and `ramp=true`; the `ramp=true` variant holds 4 `Chip` instances and 0 frames named `cut`; the code preview of both variants measured against the masters at 0 mismatches.

### 6.12 — The set template: his section, six sheets, two tables — ruled 2026-11-14 (P: "why did you think we made the ramp?? and all those layouts and componetns??!? for you to use a basic TABLE?!?!?"; "TABLE GOES UNDER THE LAYOUT"; "we can also have 2 tables, one with just mono font and this one … with the styles … or it just goes in like this SpecimenSheet")

Cause: 6.10 showed the sets as plain tables in a `Sets` section on the Styleguide page, in the wrong place and without the Specimen sheets built for this.

- The template is his section `Set sheet template` (2199:81229), six `SpecimenSheet`s: the table sheet (footer only), `SpecimenFontCard` `ramp=false`, `SpecimenFontCard` `ramp=true`, `SpecimenFontSheet` with its parts table and notes, the ramp sheet (`SpecimenDisplay` + `SpecimenRamp` + table), the ramp sheet with `SpecimenWeights` in the aside.
- The table sheet holds two tables, each in its own `SpecimenFooterGroup` on the footer-only `SpecimenSheet` (no new variant): the styles table from 2186:11448 (each sample in its real text style), then the mono reference table.
- His section is not edited. Every set and family section is a copy of it.

Acceptance: 2199:81229 unchanged (same 6 children, same sizes); the first sheet of every copy holds exactly 2 tables.

### 6.13 — The five rich text sets on `➤ Styles / ↳ Typography` — ✅ built 2026-11-14 as 6.21 describes: article 27 styles, site 10, research 27, folio 22, workshop 12 (6 of workshop's sit on no ramp step) (P: "Sets? really for TYPOGRAPHY STYLES? no. its needs ➤ Styles/ ↳ Typography"; "we should rename it 'workshop' and we should ship it like other rich text sets? making the total 5"; "reader you mean folio? … I have already said so 100 times")

- Five sections on `↳ Typography` (1453:66452), side by side, 200 apart, each a copy of the template (6.12) with only its content changed: `article`, `site`, `research`, `folio`, `workshop`.
- `folio` is the Folio set: the 22 `reader/*` text styles are renamed `folio/*`. The word "reader" is not used for the set anywhere (styles, section, docs 15 and 17).
- `workshop` is the old `doc` family (`kol-doc-*`, the showcase and workshop documentation text): its `doc/*` text styles are renamed `workshop/*` and it is shown as a rich text set like the other four.
- `prose` folds into `article` and `sheet` into `research`: no section of their own; their old text styles are listed in the report for his word before any is removed.
- Per set: the fonts are the set's own, read from its text styles; the font cards and the font sheet show those fonts; both tables list the set's styles.
- The ramp sheets keep the FULL ramp, all 48 steps in order (ruled 2026-11-14: "every style gets 100% opacity [normal] but unused from ramp go down to like 20-40% so you see how the style set spreads on the ramp"). A step the set uses is at full ink, its sample the name of the style or styles on it, each name in its real text style (breakpoint suffix dropped: `display`, not `display-desktop`). A step the set does not use is the plain ramp row at 30% opacity. In the weights aside a used row shows the weights its styles have at full ink and the others at 30%; an unused row is dimmed whole. Nothing is hidden or detached. A style that sits on no ramp step is listed in the report.
- `article` built 2026-11-14 (2203:19575) with hidden rows; redone to this ruling, then `site`.
- Built `article` first and shown to him; the other four follow on his OK.

Acceptance: 5 sections, 6 `SpecimenSheet`s each; rows shown per set equal its style count, each sample carrying a text style of that set; 0 text styles named `reader/*` or `doc/*`; 0 detached instances; 0 layers named `Frame`; audit 0 errors.

### 6.14 — The font sets and the rest of `↳ Typography` — ✅ built 2026-11-14: sans (34, with float), mono (28, with helper and table), serif (the 1 existing style; no Playfair set made), card (7), empty `ui` section; ten tile frames on `_trash`; `Roles` and `ui-font` left in `02 Typography` as they were; a row off the ramp shows "off" as its step; no style renamed to utility or label (P: "every thing in ↳ Typography needs new specimen files"; "this is terrible layout for font styles"; "I just think sans, mono and serif should be similar sets"; "I would rather join float and sans"; "helper now will be utility … and mono will be label")

- Three font sets, each a copy of the template: `sans`, `mono`, `serif`. One font each, shown the same way.
- `sans` takes the old `sans/*` and `float/*` styles together (both are Inter); `float` has no section.
- `mono` takes the old `helper/*` and `mono/*` styles: the single-line ones are named `utility`, the ones with a line height are named `label`. The old `table/*` style folds into `utility`; its fill, padding and radius stay with `.kol-table-token` in the component CSS. (My reading of "helper → utility, mono → label" together with "sans, mono and serif should be similar sets": for his check on the first build.)
- `serif` is built on Playfair, bound to one `type` font variable so tg-malromur replaces it in one change once his export is installed.
- `card` (the content cards: `ContentCard`, `IndexCard`, `ExhibitCard`, `SectionCardItem`) keeps its name and gets a copy of the template.
- `Roles` becomes one footer-only table sheet. `ui-font` is left out: an empty placeholder section named `ui`.
- The twelve old tile frames in `02 Typography` (1430:1490) go to the `_trash` page, `_` prefixed.

Acceptance: `↳ Typography` holds 5 set sections, `sans`, `mono`, `serif`, `card`, the `Roles` table sheet and the empty `ui` section, and 0 tile frames; every text style of the file appears as a row in exactly one section; audit 0 errors.

### 6.15 — The table sections leave the Styleguide page

- `Sets` (2186:11434) and my single-sheet `Set sheet template` (2197:13178) go to the `_trash` page, `_` prefixed, after 6.13 is built. His template (2199:81229) stays.

Acceptance: neither node is on `↳ Styleguide`; both are on `_trash`.

### 6.16 — Ramp sheets: one sample string, dimming on the weights sheet only — ✅ built 2026-11-14 (article 15 of 48 steps at full ink, site 8; every sample the template's string) (P: "I only was talking about this NOT OTHER INSTANCES"; "this breaks style.. just use the same text string for everything")

Cause: I swapped the sample text for style names and dimmed both ramp sheets; he asked for dimming on the one sheet with the weights, and for the sample to stay one string.

- Every ramp row keeps the template's sample string, in every set. No style names in the sample column, no mixed styles in a line.
- The plain ramp sheet is the template's, untouched.
- Only the sheet with the weights shows the set: a step the set uses at full ink, an unused step at 30%, and on a used row the weights its styles have at full ink, the others at 30%.
- The style names live in the two tables.
- Applies to `article` (2203:19575) and `site` (2207:28378), both built the wrong way.

Acceptance: in both sections, 0 ramp rows whose sample differs from the template's; 0 rows below 100% on the plain ramp sheet; on the weights sheet, rows at 100% equal the steps the set uses (article 15, site 8).

### 6.17 — Sheets side by side, like his original — ✅ built 2026-11-14 for article and site (weights are their own `SpecimenSheet` 80 right of the dimmed ramp sheet, rows level; no `aside`); cutting the kit toward his seven parts stays TALK (P: "I dont understand why you didnt do the component like i made it.. much simpler"; "you are trying to force everything into the same container and it doesnt make sense.. and doesnt need to be this anal")

Cause: his system (type file 27:19230) is seven parts: `header`, `body`, `content-header+styles`, `layout-t`, `footer` and `footer items`, `layout-frames` (the sheet, and the weights sheet as its own frame), `component` (the two frames side by side). I rebuilt it as about twenty components and hung the weights panel in an `aside` slot inside the sheet, where it overlaps.

- My recommendation: no new components and no rebuild of the published ones. In a set section the weights are their own `SpecimenSheet` beside the ramp sheet (content `SpecimenWeights`, no footer), as his `layout-frame-weight` sits beside `layout-frame`; the `aside` slot is no longer used.
- His ruling needed: whether that is enough, or whether the kit itself is cut down toward his seven parts (library and the code in kol-styleguide both).

### 6.18 — The Styleguide page, tidied — ✅ built 2026-11-14

Incident: an earlier edit of mine overwrote the `SpecimenDisplay` `ramp=false` master's title and link ("article", "MarkdownPage variant, .kol-prose"), which then showed on every sheet in Previews and his template. Restored to the `font/name` and `font/link` variables. The same master is 1632 wide (was 1232) and clips its "Aa" in a 1600 sheet: not touched, cause unknown, his call.

Found 2026-11-14 on `↳ Styleguide` (2144:9849): two sections both named `Set sheet template` (his 2199:81229 below Previews at y 8703, mine 2197:13178 at the far right); the rejected `Sets` table section (2186:11434) still in the row; `Specimen mapping` (2169:12647) sitting between `Sets` and `Previews`; two sheets in `Previews` (2153:2918, 2153:4906) sticking out of the section box; my single sheet (2197:13179) sticking out of its section.

- Mine (2197:13178) and `Sets` (2186:11434) go to the `_trash` page, `_` prefixed (replaces 6.15).
- His template moves up into the row after `Previews`; `Previews` is re-fitted to hug its sheets; sections sit in one row, 200 apart, in the order Sheet, Display and cards, Ramp, Weights, Samples, Specimen mapping, Previews, Set sheet template.
- Nothing inside his sections is edited.

Acceptance: 1 section named `Set sheet template`; 0 sections named `Sets`; 0 children outside their section box; all sections at y 0, 200 apart.

### 6.19 — One `SpecimenSheet`, 2200 wide, weights on its toggle — ✅ built 2026-11-14 (master: aside fills the sheet height, top padding 768 → 864 so rows are level; article and site sheets 2200, the aside sheet 5417) (P: "fix width, should be 2200 like component"; "the specimen sheets still need to auto-layout, gap -120, and align top and bottom. then THAT component is used in many cases. and show/hide weight side on toggle")

Cause: I split the weights into a second sheet and kept copies at the old 1600 width; his `SpecimenSheet` is one horizontal auto-layout, 2200 wide, sheet and weights side by side at gap -120, the weights shown by `show aside`. This replaces 6.17's split.

- `SpecimenSheet` master: horizontal auto-layout, gap -120, the sheet and the `aside` aligned top and bottom (the aside stretches to the sheet's height).
- Every sheet in `article` and `site` takes the component's width (no width override left).
- The dimmed ramp and its weights are ONE `SpecimenSheet` with `show aside` on; the separate weights sheet goes.

Acceptance: 0 `SpecimenSheet` instances in `article` and `site` with a width override; each section has exactly 1 sheet with `show aside` true and 0 sheets whose content is `SpecimenWeights`; in the master the aside's top and bottom equal the sheet frame's.

### 6.20 — `SpecimenSpread`: the component made from the two sheets — ✅ built 2026-11-14 (P: "I said create a component from the 2 .. why didnt you??"; "why are you forcing everything into this instance?"; "the shit you are making is broken, not respponsive")

Cause: I pushed the weights back into `SpecimenSheet`'s `aside` (6.19) when he asked for a component made of the two sheets; and the display card and ramp were fixed-width inside a 2200 sheet, so the big samples were cut.

- New component `SpecimenSpread` (2221:15399, section `Spread` on `↳ Styleguide`): horizontal auto-layout, gap -120, two slots `sheet` and `weights`, the weights sheet stretched to the sheet's height, boolean `show weights`. Default content: the plain ramp sheet (2200) and the weights sheet.
- In a sheet the display card and the ramp fill the sheet width; no sample is cut.
- The weights sit level with the ramp rows through the weights sheet's own top padding.
- `article` and `site` use it: each instance holds its own ramp sheet (set title, dimmed steps, reference table) and weights sheet in the slots. 6.19's sheet-with-aside is gone from both.
- Lesson: an edit to slot content of a sheet NESTED inside a component instance writes into the component (the reference table and titles leaked this way). Per-instance content goes in the component's own slots, as real nodes.

Acceptance met: each section has 1 `SpecimenSpread`; first and last weights rows 0px off their ramp rows; 0 truncated samples (sample column 1160 wide); master unchanged after the instances were filled (title from the variable, 48 table rows, 0 dimmed rows).

### 6.21 — His `SpecimenSpread`, and what a set section holds — ✅ built 2026-11-14 for article and site (P: "here THIS IS CORRECT, make show hide the flyout"; "this is to show style spread over ramp … this is not, this is just for the style"; "dont put both tables in same container. two containers in vertical auto layout 200gap"; "not all specimen sheet have to be 2200px width")

Supersedes 6.20: the component is HIS variant (2219:53587, set 2219:53586): two `SpecimenSheet`s in a horizontal auto-layout, gap -120, no slots. My slot build is on `_trash`.

- `show weights` on his variant hides or shows the weights sheet (5280 wide on, 2200 off).
- A set section holds four things, left to right, 200 apart:
  1. `tables`: vertical auto-layout, gap 200, two sheets: the styles table, then the reference table with the notes.
  2. the fonts: vertical auto-layout, gap 200, the font cards and font sheet, each sheet fitted to its content (1648, 1648, 1568), not 2200.
  3. the style sheet (a `SpecimenSheet`, 2200): "just for the style". One row per style of the set, the template sample string in the real text style, rows hugging their text, reference table under.
  4. the `SpecimenSpread`: "the style spread over the ramp". Full ramp, unused steps and unused weights at 30%.
- Per-set content is only ever written into standalone sheets; on the spread only opacity is overridden.

Next, same recipe: `research`, `folio` (rename `reader/*`), `workshop` (needs its `doc/*` styles on ramp steps first), then the font sets.

### 6.22 — The type mode is set once, on the page, and it is `Special Gothic` (P: "whats going on here? you set everything to inter?")

Cause: the Typography page has no `type` mode, so it falls back to the first one, Right Grotesk. I pinned `Inter` on the `article` section and the other eight sections are copies of it. Nine pins where one belongs on the page, and the wrong mode: `Inter` makes headings Inter too. In the `Special Gothic` mode the font variables give exactly what he ruled: Special Gothic for display and headings, Inter for text, JetBrains Mono for labels.

- The `type` pin comes off all nine set sections.
- The page `↳ Typography` gets the `type` mode `Special Gothic`, once.
- Acceptance: 0 sections on the page with their own `type` mode; the page's mode is `Special Gothic`; in `article` an h1 row resolves to Special Gothic, the body row to Inter, the label row to JetBrains Mono.

### 6.23 — Serif is TG Malromur (P: "and serif should be malromur"; "I just think sans, mono and serif should be similar sets")

Read 2026-11-14: Figma has `TG Malromur Variable` (Light to Black, with italics). The library's one serif style, `serif/work-row`, is Instrument Serif Italic 24, its font not bound to any variable. The `type` collection has no serif variable.

- A `font/serif` variable in the `type` collection, `TG Malromur Variable` in every mode, so the face is one value.
- `serif/work-row` takes its family from `font/serif`.
- The serif set mirrors the sans ladder, so the two read as the same kind of set: the same roles, sizes and line heights (display 01 to 04, heading 01 to 05, body 01 to 03), in Malromur — TALK: is mirroring the sans ladder right, or does serif get its own roles.
- The `serif` section on the Typography page is rebuilt from those styles; its font card shows Malromur.
- Code (`--kol-font-family-serif`, the font files from his export, the `kol-serif-*` classes) follows only on his word: W7.
- Acceptance: `font/serif` exists with one value in 4 modes; every `serif/*` style resolves to `TG Malromur Variable`; the `serif` section's rows equal the number of `serif/*` styles.

### 6.24 — The Typography page in three tiers — ✅ built 2026-11-14 (Font sets: sans 18, mono 28, serif 1; Reading sets: article 27, site 10, research 27, folio 22, workshop 12; UI set: card 7, float 16; `helper/*` and `table/*` renamed `mono/utility/*`, old `mono/*` renamed `mono/label/*`; the `type` pin moved from ten sections to the three parents, `mono` shown in the JetBrains Mono mode) (P: "but if some use sans and mono and serif [if they are pure sets] then they are different tier then the style sets?"; "but cards would be ui? not style set right?"; "helper and table would become utility? … but mono would have become label then?"; "i agree")

Cause: 6.14 put nine sections in one row as if they were the same kind of thing. They are three kinds: a font set is one face; a reading set is a purpose built from the font sets; UI text belongs to components.

```
↳ Typography
├── Font sets
│   ├── sans        display, heading, text
│   ├── mono        utility (old helper, table), label (old mono)
│   └── serif       Malromur
├── Reading sets
│   ├── article
│   ├── site
│   ├── research
│   ├── folio
│   └── workshop
└── UI set
    ├── card
    └── float
```

- Three parent sections on the page, stacked top to bottom in that order, each holding its set sections in a row, 200 apart.
- `sans` holds only `sans/*`; the `float` styles leave it for the UI set.
- `mono` holds the one face in its two rows: `helper/*` and `table/*` are renamed `mono/utility/*`, the old `mono/*` are renamed `mono/label/*`. The names `helper` and `table` end.
- `card` moves from its own section into the UI set; `float` gets a section there. The empty `ui` placeholder becomes the `UI set` parent.
- A font set section is its font cards, its style sheet and its spread. The two role tables are for reading sets and the UI set only.
- `prose`, `sheet` and `ui` text styles get no section; they stay in the library because other files use them.
- Supersedes the one-row layout of 6.14. 6.23 (Malromur) fills `serif`.

Acceptance: 3 parent sections named `Font sets`, `Reading sets`, `UI set`, holding 3, 5 and 2 set sections; 0 set sections outside a parent; 0 text styles named `helper/*` or `table/*`; `sans` shows 0 `float/*` rows; font set sections hold 0 `tables` frames; no section overlaps another.

### 6.25 — Which fonts each set uses — ✅ closed 2026-11-15: no review here, the fonts are the ones already designed in code and in the Folio reader (his word); see plan-2026-11-15-typography-page.md (P: "no why would the page get Special Gothic? lets just go through it")

From code today, and after the switch off Right Grotesk:

| Set | Today | After |
|---|---|---|
| article, site | headings Right Grotesk Narrow and Compact, body sans, mono for label, code, caption, footer, table head | headings Special Gothic, body Inter, mono stays |
| research | body Public Sans, headings sans, numbers and data tables mono | his call: body stays Public Sans or goes Inter |
| folio | Inter | Inter |
| workshop | headings Right Grotesk Compact, body sans, the rest mono | mono and Inter; his call: headings Special Gothic or Inter |
| sans | display Narrow, headings Compact, body sans | display and headings Special Gothic, body Inter |
| mono | JetBrains Mono | JetBrains Mono |
| serif | Instrument Serif (one style) | Malromur |
| card | all mono, title Right Grotesk Compact | his call: title Special Gothic or Inter |

- The library `type` mode named `Special Gothic` gives exactly the "after" column per variable (headings and display Special Gothic, text Inter, mono JetBrains Mono); its name misleads. Whether the page takes that mode once, and whether the mode is renamed, waits on his three calls. This replaces 6.22's wording; the nine `Inter` pins still come off.

### 6.26 — The old families fold into the new ones — ✅ 19 pairs folded 2026-11-14; the rest closed 2026-11-15 in plan-2026-11-15-typography-page.md W4 (P: "what do you mean? we are changing them right?")

Cause: 6.10 created `article/*` and `research/*` as new styles beside the old `prose/*` and `sheet/*`, so there are two copies, and every layer built before today still uses the old one.

- A pair is folded by keeping the OLD style (every layer already using it follows), giving it the new name and the new values, and moving this page's rows onto it. The new duplicate is kept `_dup/` prefixed, unpublished, not deleted.
- `ui/*` (37 styles, the first ramp attempt D1 to L8) is replaced by the type ramp; its layers are not moved yet.

Pairing, read from the file 2026-11-14:

| Old | New | Note |
|---|---|---|
| prose/p | article/body | |
| prose/li | article/list-item | |
| prose/lede | article/lede | |
| prose/h2 to h6 | article/h2 to h6 | |
| prose/blockquote | article/quote | |
| prose/label | article/label | |
| prose/tagline | article/tagline | |
| prose/h1, display, title | article/h1, display, title per breakpoint | NOT one to one: the old style is one style sized by the `breakpoint` mode (48/56/64, 56/80/80, 44/56/56); the new ones are separate phone, tablet and desktop styles. His call which way it goes |
| prose/display-upper | none | no new twin |
| prose/code (12/24) | article/inline-code or code-block | unclear which |
| sheet/h1, h2, h3 | research/h1, h2, h3 | |
| sheet/h4 | research/h4-numbered-document | |
| sheet/body | research/body | |
| sheet/body-sm (14.5) | research/text-item | |
| sheet/meta (13) | research/when-and-deliverable-lines | |
| sheet/footnote | research/footnote | |
| sheet/th, td | research/mono-table-and-its-head | two old, one new |

The rest of `article` (quote-cite, code-block, inline-code, table, table-head, caption, footer, display-md) and of `research` (19 styles) have no old twin and stay as new styles.

Built: the 19 clear pairs. Each old style now carries the new name, size and line height and keeps its id; 36 rows on the page moved onto them; 19 duplicates kept as `_dup/*`. Limit met: an old style whose default font the plugin cannot load refuses a write to its tracking, so tracking stayed the old value; it equals the new one except on article/h2, h3 and h4 (0.32px against 2%).

Acceptance: for every folded pair, 1 style with the new name whose id is the old style's; 0 text nodes on `↳ Typography` using a `_dup/` style; unfolded pairs listed in the report.

## W7 — Into code

### 6.27 — Font sets are the whole ramp, in four fonts — ✅ built 2026-11-14 (P: "sans mono and serif should all be wide scope, bigger then the markdown stylesets"; "Sasn only Special gothic and Inter goes to UI"; weight as a mode: "sure")

- Four sets in `Font sets` (2254:47455): `sans` Special Gothic, `mono` JetBrains Mono, `serif` TG Malromur, `ui` Inter. 48 styles each, named `<set>/<step>` (`sans/D1` … `ui/L12`).
- Size and line height bound to `ramp/size/*` and `ramp/line-height/*`; family bound to `font/set/<set>`; weight bound to `weight/<set>` in the new `weight` collection (modes Regular, Medium, Semibold, Bold; JetBrains Mono has no semibold, so it takes Bold).
- `type` collection gained a Malromur mode. Tracking: `ui` takes Inter's curve, the other three are 0% (to set). Utility steps trim to cap height.
- The first-attempt `ui/*` (37) renamed `_ui-old/*`. Replaced sheets moved to `_trash`, section `_font sets old 2026-11-14`.
- Open: the old named styles still sit beside the ramp (`sans/display-01` …, `mono/utility/*`, `mono/label/*`, `serif/work-row`); fold them onto steps or keep, his call.

Acceptance: 4 sections in `Font sets`, each sheet shows 48 rows on its own set's styles (met: 48, 48, 48, 48); 192 styles exist (met).

### 7.1 — Ramp tokens (kol-theme) — ✅ built 2026-11-14 (96 tokens in `kol-typography.css`, generated from the doc table; unpublished)
- The 48 steps as `--kol-ramp-*` size and line-height tokens in kol-theme, values from `15-type-ramp.md`; tracking per font as tokens beside each family.
- Acceptance: 96 ramp tokens resolve on a showcase page; a script compares each to the library variable of the same step, 0 differences.

### 7.2 — The set classes point to the ramp (ruled 2026-11-14: phone title 48, research body 16, Folio 13 → 14) — ✅ built 2026-11-14 (46 rules, 0 raw values, 58 roles measured at 390 / 800 / 1440 with 0 mismatches; unpublished; kol-theme CHANGELOG entry owed at publish)
- The classes the three variants use take their size and line height from the ramp tokens per the 6.10 table; class names that change go on the retirement ledger as aliases; `03-typography.md` and `12-typography-lookup.md` updated.
- Acceptance: 0 raw font-size or line-height values left in the three variants' rules; each role's computed size on a rendered MarkdownPage equals its row in the 6.10 table.

### 7.3 — Inter as the default sans — HELD: his OK (changes every consumer)
- `--kol-font-family-sans: 'Inter'` is built in `packages/theme/kol-typography.css`, unpublished.
- Acceptance: computed body font on a showcase page is Inter; mono roles unchanged.

### 7.4 — The shared parts in code — ✅ built 2026-11-14 (unpublished; previews in showcase, Code Connect files written, not published)
- kol-component: `Chip` (molecule: leading slot, title, meta), `SectionHeader` and `SectionFooter` (atoms: leading slot, label, trailing slot, own rule), props equal to the Figma properties; inventory and catalog docs in the same change.
- Acceptance: three components exported; each renders in a preview with every slot filled; Code Connect maps each to its library master.

### 7.5 — The Specimen kit in one code home — ✅ built 2026-11-14 (kol-foundry now depends on kol-styleguide; `TypeSpecimenLive` → `SpecimenLive`; six views at showcase `/sets/preview/specimen`; unpublished; lockfile and `showcase/src/usage/*.json` not regenerated)
- kol-styleguide takes `TypeSample`, `TypeSpecCard`, `TypeSpecimenLive` and `SpecimenSectionHeader` from kol-foundry under the Specimen names (`SpecimenSample` with `horizontal`, `SpecimenSampleGroup`, `SpecimenSpec`, `SpecimenHeader` on `SectionHeader` with `controls`); old names and import paths as aliases on the retirement ledger; kol-foundry's own sections import the new ones.
- The rest of the Figma Specimen family (`SpecimenSheet`, `SpecimenDisplay`, `SpecimenRamp`, `SpecimenWeights`, the cards) built to the Figma tree, the ramp rows on `TypeSpecimenLive`'s measuring.
- Acceptance: every Figma Specimen master has a code component of the same name and props; a styleguide preview page renders the six test views; 0 imports of the old names outside the alias file.

### 7.6 — The sets' new names in code — TALK (P: "we should ship it like other rich text sets")

- `workshop` and `folio` join `MarkdownPage` as variants beside `research`, `article` and `site` (`packages/framework/src/markdownVariants.js`); the class names `.kol-doc-*` and `.kol-reader-*` and whether they are renamed is his ruling, since a rename reaches every consumer.
- The class families follow the Figma names only on his word: `kol-helper-*` (utility), `kol-mono-*` (label), `kol-float-*` joining `kol-sans-*`.

Acceptance: written when he rules.

## W8 — Back to Folio (after 6.12 to 6.15)
- `plan-2026-11-14-folio-default.md` W1: the folio-default page (float file `879P1yBsBPqpdGI5a5v2Y5`), Folio beside KOL default in three views, the KOL screens now on the new type; his rulings (1.2), then W2 builds the default.

## W9 — moved

The icon mode and the Figma scales are in `plan-2026-11-14-figma-scales.md`.

## Order
6.9 → 6.10 (one kol-figma-agent each) → 7.1 → 7.2 → 7.4 → 7.5 → W8. 7.3 on his OK.

## PARKED

### Case, italic and underline on ANY text style, set from the Appearance menu — PARKED: not now, part of the type cleanup in kol-ds-ui (his word 2026-11-21: "we have to clean up type in kol-ds-ui at some point, but this is not what we are doing now")
- **What he ruled, 2026-11-14:** "showing weights as an extention frame, then as a component we make case and italic on toggle." What he meant, said 2026-11-21: "this was meant for any text style. if I wanted ANY text style to be uppercase I would just go to variable in appearance and find 'Text' with text/uppercase text/normal-case text/italic text/underline".
- **What was built instead:** case, italic and underline as true/false switches on the draft `type-size-ramp` row in the type file (set 25:7480 in `mmBE8t8EcxSdN7g4bUeHok`). The row that shipped, `SpecimenRampRow` in library--util, has no such switches (only step, sample, size, height, tracking). So it sat on a specimen, where it helps nobody, and then was dropped.
- **Where case lives today:** baked into the library's text styles (43 of 476 are uppercase, role styles such as `article/table-head`, `workshop/eyebrow`) and into the role classes in `packages/theme/kol-type-roles.css`; `headlineCase="upper"` on `SectionText` is the one prop. The Appearance menu offers `weight`, `type`, `radius`, `theme`, no `text`.
- **To settle first when this is picked up:** whether Figma can drive case and underline from a variable at all. My understanding, NOT tested in his file: a variable can drive font family, weight, style, size, line height and tracking, so italic is possible through the font style, while text case and underline can only sit on a text style or a component variant. Test it in the library before designing anything.
- **Then:** one way to set case, italic and underline on any text, in Figma and in code alike, and the 43 baked-in uppercase styles moved onto it.
