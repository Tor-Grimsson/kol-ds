# Review: uber (Uber brand guidelines, 2019 page, 2021 site, Oct 2018 PDF)

## Verdict

**Needs fixes.** The facts are mostly right: 70+ quoted rules and values checked, nearly all verbatim, and the chapter list is accurate. The problems are a few wrong or loose statements, an accessibility claim the guide contradicts, a mischaracterised press quote, an unverifiable figure count, and two assets that don't show what they are labelled as. The validator passes (13 found, 2 partial, 28 sources, 15 chapters). Nothing here needs a re-research.

Checked against the files in `scratchpad/guide-uber` (2019 `/guide`, the 2021 section pages, `partner.pdf`, the case studies). The PDF on the Shopify CDN is byte-identical in size to the local copy (706,403 bytes). Live fetches: MCKL, Red Dot, Dezeen, It's Nice That, Fortune, Wolff Olins and assets.uber.com all return 200. `brand.uber.com` gives a 307 to `assets.uber.com`, a Frontify page titled "Brand.uber".

## Chapters check

The 2019 `/guide` nav matches `chapters` 1–14 in order and wording:

- Nav: Brand story, System elements (Logo, Brand Architecture, Color, Composition, Iconography, Illustration, Motion, Photography, Tone of voice, Typography), Showcase, Downloads, Help / FAQ.
- Sub-section counts all match the 2019 headings: Logo 13, Brand Architecture 12, Color 9, Composition 7, Iconography 6, Illustration 9, Motion 11, Photography 10, Tone of voice 7, Typography 9.
- Chapter types are right. Composition as `layout` and Brand Architecture as `naming` are arguable but defensible.
- Nothing is invented and nothing is missing from the 2019 TOC. Chapter 15 "Terms" is a footer link, not in the nav; that is fine, but it is the one chapter sourced to 2021 only.

Problems:

- The TOC mixes two editions with no per-chapter edition marker. The 2021 nav (every 2021 page footer) has Logo, Brand architecture, Color, Composition, Imagery (Iconography, Illustration, Photography), Tone of voice, Motion, Typography, Downloads. It has no Brand story, no Showcase and no Help/FAQ. Chapters 1, 12 and 14 exist only in 2019. The 2021 order also differs (Tone of voice before Motion).
- Chapters 9 and 10 describe different editions: Photography is the 2019 brief, Tone of voice the 2021 traits. `size` hints at this for Photography only.
- The 2019 Downloads page lists 196 files. Several are guide documents that are not mentioned anywhere: "Brand System Guide (Keynote)", "Agency Onboarding", and "Brand Guidance: sub-brands, programs, products, and teams (Signature)" (PDF and KEY, 12 Feb 2019). The dossier covers only the Brand Book and quick guide in the `format` bullet.

## Verified claims

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | Clear space = "cap height of the U" | 2021 logo page; PDF p.3 | confirmed |
| 2 | Min size "18 pixels wide/0.25 inches wide/0.635 centimeters wide" | 2021 logo page | confirmed |
| 3 | Logo white on dark, black on light | 2021 logo; PDF p.3 | confirmed |
| 4 | Four clear-space exceptions (App icons, Signage with limited space, Trade dress, Social icons) | 2021 logo | confirmed |
| 5 | Placements: bottom left default, bottom right for RTL, centred only with bold U-frame, top left | 2021 logo | confirmed |
| 6 | Partner lockup separator = vertical line glyph in Uber Move Display Light | 2021 logo; PDF p.4 | confirmed |
| 7 | "half a horizontal U" icon padding | 2021 logo | confirmed |
| 8 | Safety Blue RGB 39 110 241, CMYK 84 54 0 0, HEX 276EF1, PMS 2174 C, 3005 U | 2021 color; 2019 | confirmed |
| 9 | Safety Blue CMYK 90 30 0 0 in the Uber Design case study | case study | confirmed |
| 10 | 2019 secondary HEX: 47B275, FFC043, F25138, 99644C, FF7D49, 7356BF | 2019 `/guide`; PDF p.6 image | confirmed |
| 11 | 2021 changes: green 05A357, red E11900, orange FF6937 | 2021 color | confirmed |
| 12 | 2021 green RGB 58 167 109 vs HEX 05A357 | 2021 color | confirmed (mismatch real) |
| 13 | 2021 red "RBG — 212 67 51" vs HEX E11900 | 2021 color | confirmed (typo and mismatch real) |
| 14 | 2021 brown "RGB — 153 00 77" vs 99644C; PDF 153 100 77 | 2021 color; PDF p.6 image | confirmed |
| 15 | 38 specialty colours | 2019 `/guide` (38 HEX lines) | confirmed |
| 16 | "Text should never be colored." and "Do not cover surfaces with safety blue." | 2021 color | confirmed |
| 17 | Headline 5 words or less = Display Bold; 6 or more = Display Medium; cap height 1.5× base unit; 1.0 leading; 0 tracking | 2021 typography | confirmed |
| 18 | Subhead ½ headline, 1.1 leading; body Text Regular ⅓ subhead, 1.2 leading | 2021 typography | confirmed |
| 19 | PDF: subhead 1.2 leading; headline "1.5x logo point size (minimum)" | PDF p.8 image | confirmed |
| 20 | Pairings: Medium with Light, Bold with Regular | 2021 typography; PDF p.7 | confirmed |
| 21 | "Use Uber Move Text Bold for action and Uber Move Display Bold for buttons" | 2021 typography; PDF p.8 | confirmed |
| 22 | MCKL: "4 weights and 2 optical sizes"; Display tracked tightly, Text slightly condensed | mckltype.com | confirmed |
| 23 | Uber Move credits: Brand Experience team, Wolff Olins, MCKL / Jeremy Mickel | Uber Design case study; Wolff Olins case study | confirmed |
| 24 | U-frame: Regular 2U, Medium 3U, Bold 4U; "no light U-frame" | 2021 composition | confirmed |
| 25 | Margin = ⅓ column; gutter = ½ margin; 9 columns for 16:9 | 2021 composition | confirmed |
| 26 | "Do not rotate the U-frame", "Do not round the corners", no multiple U-frames, "standard office printer" rule | 2021 composition | confirmed |
| 27 | Icons on 24×24 px grid, 3px stroke, container doubles icon width | 2021 iconography | confirmed |
| 28 | Illustration ✕: strokes, gradients, 3 colours max, no mixing palettes; badges 88x88 | 2021 illustration; 2019 | confirmed |
| 29 | Each transition 0.5 s; max 2 combined motion states; 8-column motion grid; 3 lower-third variants; 4 end cards | 2021 motion | confirmed |
| 30 | 2019 shot list Hero 20 / Lifestyle 50 / Lifestyle with product 10 / Textural 20; product ≤20% of space | 2019 `/guide` | confirmed |
| 31 | 2019 core voice: Considerate, Simple & Direct, Consistent; supporting ranked Optimistic, Inviting, Bold | 2019 `/guide` | confirmed |
| 32 | 2021 core voice: Bold, Direct, With heart | 2021 tone page | confirmed |
| 33 | 16 quick editing tips | 2019 and 2021 | confirmed (16 headings) |
| 34 | Legal reminders (no Uber as verb, noun, plural or possessive); localization@uber.com | 2021 tone page | confirmed |
| 35 | Mission, "Modern Striver", Brand Book link | 2019 brand-story | confirmed |
| 36 | Research bullets "+1000 hours of listening", "Black scored 88% favorability", three learnings; "nine elements"; "20:1 Contrast ratio" | Uber Design case study | confirmed |
| 37 | Brand New quotes ("fantastic simplicity…", "three hundred or so custom sans serif…"), Armin Vit, 17 Sep 2018 | Brand New page | confirmed |
| 38 | Wolff Olins quotes ("beyond-simple", "Its success depends on how useful teams find it.") | Wolff Olins case study | confirmed |
| 39 | Approval: "All partner led creatives must be pre-approved by the Uber brand team." | PDF p.2 | confirmed |
| 40 | JIRA help desk, 48 hours; "Uber login required…"; Creative Plus; trademark terms | 2019 FAQ and Downloads; 2021 Downloads; Terms | confirmed |
| 41 | Brand architecture gates ($50M / $10M / $2M + ELT) | 2019 `/guide` | confirmed |
| 42 | PDF: 10 pages, 1920×1080, Keynote, dated Oct 2018 | `pdfinfo` | confirmed (created 3 Oct 2018) |
| 43 | Co-marketing paths on assets.uber.com | cdx list | confirmed |
| 44 | Relative section weight: "Composition 122, Color 50, Brand architecture 43, Logo 37, Typography 31, Photography 0" figures | CDN asset names (`cdx_assets.txt`, `imgurls.txt`) | **unverifiable**, see Wrong facts |
| 45 | "launched with the September 2018 rebrand" | nothing in the sources | **unverifiable**, see Wrong facts |
| 46 | PDF "cut down from" the site | PDF is dated 3 Oct 2018; site sections are stamped 12/05/2018–04/03/2019 | **unverifiable**, direction unproven |

## Wrong facts

1. **Accessibility claim contradicted by the guide.** The `colour` points say "Accessibility is argued only through black/white contrast", and the `omissions` answer says "Contrast is argued only for black and white … no contrast rule for Safety Blue". The guide has other contrast rules:
   - Composition (2019 and 2021): "Make sure that the context for your U-frame will provide sufficient contrast … (otherwise the shape will disappear)" and "Avoid using the U-frame in contexts without sufficient contrast".
   - Typography summary: "Aim for contrast across type hierarchies".
   - Colour overview: primary colours exist "to provide accessibility" and proportions keep the brand "accessible for all people".

   It is true there is no contrast ratio or WCAG number for Safety Blue or the secondaries.
2. **Logo is not "set in Uber Move Medium".** The `logo` summary says the logo is "a single wordmark set in Uber Move Medium". The guide (Typeface as logo) says: "The medium weight of Uber Move is the same weight as the logo, but our logo has been optically kerned. When a headline uses the word 'Uber,' make sure to use the logo from the glyph palette." The logo is a drawn glyph, not typed text.
3. **Photography structure misdescribed.** The `imagery` summary says "five pillars, each with a goal, a casting brief, a lighting brief, a location brief, a shot list…". Casting, lighting and locations ARE three of the five pillars (Interactions, Composition, Casting, Lighting & color, Locations). Each has a "Goal:" line. The shot list and ✕ list are separate sub-sections.
4. **Brand New mischaracterised.** The `strengths` summary says the review "dismissed the logo at first glance". Vit writes "At first glance, the new logo is… nothing", then "it's actually perfect" and "I am guessing that this is not the negative review most people expected". Say that he found it bare at first glance and then endorsed it.
5. **Red Dot quote context.** The `format` point says "It replaced Uber's 2015 guideline website. Red Dot notes 'Uber has always relied on PDFs…'". In Red Dot the PDF sentence describes what the 2015 site replaced ("But then, they were cumbersome to revise…"). It is not a comment on the 2018 site. The 2015 site's launch is Red Dot's own statement ("launched in June 2015"). The claim "It replaced…" is not in the sources.
6. **Launch claim unsupported.** `format` says the site "was launched with the September 2018 rebrand". The earliest capture in the cdx list for `/guide` is 2019-04-21, brand.uber.com existed in 2015, and nothing in the sources dates the 2018 site's launch. The earliest hard dates are the Dec 2018 Downloads uploads and the 12/05/2018 section stamp.
7. **Quick guide provenance and edition.** `format` and `governance` call the quick guide "cut from" the site for partners. The PDF was created 3 Oct 2018, before the earliest section stamp. The 2019 Downloads page lists "Brand System Quick Guide (PDF)" created **Dec 4, 2018**, which is a different upload from the Shopify-hosted file the dossier cites. The edition line should say which one was read and that they may differ.
8. **Figure counts do not reproduce.** `structure` says "our count of 2021 figures: Composition 122, Color 50, Brand architecture 43, Logo 37, Typography 31, Photography 0". Counting distinct `*-img-NN` names in `cdx_assets.txt` and `imgurls.txt` gives composition 118, color 42, brandArchitecture 21, logo 37, typography 30, photography 1. The saved 2021 pages contain only 2 `<img>` tags each (the footer app badges), so the numbers come from CDN file names. That is not "figures in the guide". Drop the numbers or restate them as "files on the 2021 CDN" with the new counts. "Composition is the longest section" is still supported by the text lengths (11.5 KB vs 4–5 KB for most).
9. **Orange also mismatches in 2021.** The colour answer lists green, red and brown as internally inconsistent. The 2021 orange is "RGB — 237 110 51" against HEX FF6937 (255 105 55). Brown CMYK also drifts: 2021 "13 56 61 82", PDF "13 56 61 32". Both are additions to the drift list, not corrections.

## Status problems

- `strengths` is `found` but no source judges the guide document. Brand New, Dezeen, It's Nice That and Fortune judge the identity; Wolff Olins and Uber Design are self-descriptions. The `omissions` answer is `partial` for exactly this reason. Make the two consistent: either mark `strengths` partial with a `gap` ("no independent review of the guide itself"), or state in the summary that the verdict is on the identity and application system and ours on the guide.
- `motion` is `partial`: right. The gap text is accurate (no easing, no sound; checked the 2019 guide and every 2021 page; "eas" only matches "easy").
- `voice`, `logo`, `type` etc. as `found`: earned.
- `type` gap says no fallback font and no licensing. Confirmed absent (only the trademark licence in Terms).

## Website-not-guide problems

None. The brand site here IS the guide, and CSS is not used. Two minor items:

- `rule-style` and `governance` use the 2021 Frontify redirect and `assets.uber.com` as evidence of the current state. That is the portal, not the guide; it is only used for "now behind a login", which is fine.
- `uber.design` case-study content (research numbers, CMYK, the "20:1" ratio) is separated from the guide in the text. Good.

## Closable gaps

- **Press on the guide:** Red Dot has a project page "Uber Brand Guidelines" (about the 2015 site). It is praise for a guideline site (interactive hints, change log, search, "as easy to use as the Uber app"), though the text is the submitter's own. It could back `strengths` if clearly labelled as 2015 and entry text.
- **Brand New** has its own "Guidelines." section heading with the application grid image. The quote the dossier already uses sits right above it; the section heading is worth citing as the part about the guideline layouts.
- **Accessibility:** the U-frame contrast rule and the typography contrast summary (Wrong facts 1) close part of the accessibility omission.
- **Downloads:** the 2019 Downloads list shows categories and file types (196 files, including .ase colour palette, .ai/.eps logos, .docx). That answers more of "how assets are distributed" than the current text.
- **Cannot be closed from the guide:** sound, easing, fallback fonts, stationery, merchandise, vehicles. Every claimed omission is really absent (searched all 2019 and 2021 text for sound, audio, sonic, fallback, Arial, Helvetica, stationery, merch, uniform, packaging; "vehicle" only appears as an icon name and in photo copy).

## Asset problems

All 12 files exist, open and are indexed; none are used without an index entry or indexed without use. PDF page labels are right (p.2 Welcome, p.3 Logo, p.6 Color secondary + proportions, p.8 Typography hierarchy + CTA).

- `toneOfVoice-img-01.jpg` is labelled "Tone of voice — application example (rider sign-up copy in a mobile layout)" and reused as evidence for `voice` and `applications`. It shows an email with an all-caps UBER wordmark and a teal button, which is the pre-2018 identity. In the 2021 page the images run `toneOfVoice-img-01…06` as three before/after pairs, so this is almost certainly a "Before" sample, not the guide's identity in use. Replace it or relabel it honestly. I could not fetch img-02 from the archive to confirm the pair.
- `composition-img-30.png` is labelled "layout with U-frame image block, text and logo". The image shows a grey block, headline, subhead and logo with no visible U-frame. Relabel as "layout with image block, text and logo".
- `typography-img-24.png` and `color-img-33.png` are both ✕ images showing coloured text. Two near-identical ✕ images for one rule; fine but one could go.
- Coverage: no image for brand story, motion, photography, illustration, the U-frame itself or the grid. Only four of the twelve are guide pages (all PDF). `assetsIndex` is adequate for the validator, thin for the content.

## Source-type problems

- `https://cdn.shopify.com/.../Uber_2018.pdf` is typed `owned`. It is a Uber-made document but sits on a Shopify store's file CDN, not an Uber domain. That is fine to cite, but note the host and that the Dec 2018 official download may differ.
- `https://wolffolins.com/work/uber` (agency) is cited in `governance`, but nothing in that page supports a governance claim (it covers brand strategy and projects since 2017). Drop it from `governance` or use it where it fits.
- `red-dot.org` is typed `reference`. A Red Dot project page is the award entry text, so it is closer to `owned`-by-submitter than neutral. Acceptable if labelled, but not neutral reference.
- All other types are right: brand.uber.com, uber.design, assets.uber.com = owned; Wolff Olins, MCKL = agency; Brand New, Dezeen, It's Nice That, Fortune = press.

## MUST-FIX

1. `colour` points and `omissions` summary and points: remove "contrast argued only for black and white". Add that Composition requires "sufficient contrast" for the U-frame and Typography says "Aim for contrast across type hierarchies"; the gap is that no contrast ratio or WCAG target is given for Safety Blue or the secondaries.
2. `logo` summary: replace "a single wordmark set in Uber Move Medium" with the guide's wording (the logo is the same weight as Uber Move Medium but optically kerned, used as a glyph, not typed).
3. `imagery` summary: fix the pillar description. The five pillars are Interactions, Composition, Casting, Lighting & color and Locations, each with a goal; the shot list and ✕ list are separate.
4. `strengths` summary and first bullet: replace "dismissed the logo at first glance" with Vit's own arc ("At first glance, the new logo is… nothing" … "it's actually perfect").
5. `strengths` status: set to `partial` with a `gap` stating no independent source reviews the guide document (matching `omissions`), or move the claim to "the identity's application system" and keep `found` with that scoping stated.
6. `structure` last bullet: delete the "122 / 50 / 43 / 37 / 31 / 0" counts or restate them as CDN image-file counts (118 / 42 / 21 / 37 / 30 / 1) and say that is what they are.
7. `format` summary and bullets: remove "launched with the September 2018 rebrand" (no source). Reword the Red Dot bullet so the quote describes what the 2015 site replaced, and drop "It replaced Uber's 2015 guideline website" or source it.
8. `format` and `guide.edition`: state that the quick guide PDF read is the Oct 2018 file on the Shopify CDN (created 3 Oct 2018), that the 2019 Downloads list a Dec 4, 2018 "Brand System Quick Guide (PDF)", and drop "cut down from the site" unless sourced. Add the "Agency Onboarding" and "Brand Guidance: sub-brands, programs, products, and teams" downloads to the list of guide documents.
9. `assets` / `assetsIndex`: replace `toneOfVoice-img-01.jpg` (old-identity email, probably a "Before") with a real guide page, or relabel it. Fix the `composition-img-30.png` label (no U-frame visible). Remove the reuse of the email image as `applications` evidence.
10. `chapters`: add an edition marker to each chapter (2019 only: 1, 12, 13, 14; 2021: 3–8, 10, 11, 15; 2019 text for 2 and 9) in `note` or `size`, and note once in `structure` that the 2021 nav drops Brand story, Showcase and Help/FAQ and moves Tone of voice before Motion.
11. `colour` points (drift list): add the 2021 orange RGB 237 110 51 vs HEX FF6937 mismatch and the brown CMYK 82 (2021) vs 32 (PDF) difference.
12. `governance` sources: remove `https://wolffolins.com/work/uber`, which supports nothing in that answer. Re-type `red-dot.org` as `owned`-style entry text or add "entry text" to its title.
