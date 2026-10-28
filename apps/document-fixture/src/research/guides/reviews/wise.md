# Review: wise (Wise Design, wise.design)

Reviewer basis: researcher's fetched Wayback pages (`scratchpad/guide-wise/wb/*`, read only), all 11 assets opened, press pages re-fetched live (Creative Review, Tearsheet, Ragged Edge, D&AD, Brand New). Wayback itself could not be fetched live, so the unread Design at Wise / Resources pages are untested.

## Verdict: needs fixes

The facts the guide actually states (colour, logo, type tables, grid, tokens, voice rules) are accurate and quoted faithfully. The problems are structural: the chapter list is incomplete and slightly out of order, two headline counts/dates are wrong, one asset is mislabelled, and two claims go beyond the page.

## Chapters check

Compared with the live nav captured on `design-at-wise.html`, `resources.html` and the foundations pages.

- **Foundations (25 entries, nav order): matches.** Chapters 3-27 are the real list, in nav order, titles verbatim, including the two Radius and two Spacing entries. The dossier says "27" in two places; it is 25.
- **Design at Wise is incomplete.** The nav shows Brand strategy, Get started, Stories, Work at Wise (in that order). Dossier has Get started then Brand strategy, and omits Stories and Work at Wise. The story gap even admits Stories was "not read".
- **Resources is incomplete and out of order.** Nav: Designing for MUA, Downloads, Partnership guidelines, Mission Days, Wise Platform, Wise Connect, Wise Swag. Dossier lists only Partnership guidelines (n30) before Downloads (n31). Five Resources entries are missing and the two kept are swapped.
- **Missing sub-pages.** CDX shows `foundations/flags/creating-flags` (2023), `foundations/icons/creating-icons` (2025) and `foundations/tone-of-voice/statement-library` (read, gated, 103 words) are real pages. None is a chapter or mentioned.
- **Components (n28) and Patterns (n29)** are real nav sections, but both cite the Get started page as `source`. That page only describes them; it is not their content. Cite the nav capture and say the contents were not read.
- **Types:** all assigned types are defensible. Size (n20) as `digital` is the only soft one; `elements` or `layout` fits a token-scale page equally.
- Nothing invented. No chapter is made up.

## Verified claims

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | Bright Green #9FE870, RGB 159/232/112, CMYK 47/0/72/0, PMS 7487 | colour | confirmed |
| 2 | Forest Green #163300, 22/51/0, 54/0/100/80, PMS 2411 | colour | confirmed |
| 3 | 8 secondary colours with hex and PMS (Orange 163 ... Maroon 4975) | colour | confirmed |
| 4 | "Always start and end with green." | colour | confirmed |
| 5 | Sentiment Warning "not accessible as text"; Interactive Accent #9FE870; Content tokens | colour | confirmed |
| 6 | Accessibility table: Content Primary on white AAA 105.6; Tertiary on Background Neutral "Don't use" | colour | confirmed (page shows Tertiary on white as AA 105.6, same figure as Primary; likely a source typo, not noted) |
| 7 | Clear space "one flag's worth ... in all directions" | logo | confirmed |
| 8 | Minimum size Print 6mm, Digital 35px | logo | confirmed |
| 9 | Partner lockups (horizontal: flag height; vertical: same width, flag height gap) | logo | confirmed |
| 10 | Six misuse rules | logo | confirmed |
| 11 | Type tables: Display large Wise Sans Bold 96px, 85%, 2%, uppercase; Title screen Inter Semi bold 30/34, -2.5%; Body default 14/22, 1%; Editorial Display 1 Heavy 56->128; Heading 1 42->78, 46->82, -3% | typography (Contentful data in page) | confirmed |
| 12 | "Always default to Inter. Unless you're being expressive" ; 50-60 character line; "Don't justify text"; "Don't use Inter in all caps, even for headlines" | typography | confirmed |
| 13 | "allow yourself 3 letters to swap out for custom glyphs"; "Stick to peppering in 1 or 2" | typography | confirmed |
| 14 | Grid XS/M/XL columns, margin, gutter; max 1440px | grid | confirmed (page says "5 sizes" then lists six incl. XXL; dossier's "six" is fair) |
| 15 | Padding 8/16/24/32; Radius desktop 16-60, mobile 10-48; space-1 5px to space-10 160px; space-7 60px/48px | padding, radius, marketing-spacing | confirmed (Editorial radius table is identical to Product radius; dossier does not mention it) |
| 16 | Icons 16/24/32 product; 16/24/48/64/96 editorial | icons | confirmed |
| 17 | Flags: 10 colours; detailed above 150px | flags | confirmed |
| 18 | Principles Intrepid / Universally authentic / Delightfully simple; five "How to speak Wise" rules; "write headlines as if it's illegal to write subcopy"; text grows "30% on average" | tone-of-voice | confirmed |
| 19 | Mission, vision, "The network for the world's money"; pillars; four promises | mission | confirmed |
| 20 | Vocabulary: "bank" banned, "best rate", "worldwide" | vocabulary | confirmed |
| 21 | Flashing "no more than three changes within a period of one second" | motion-system | confirmed |
| 22 | Focus: 2px border, 2px offset, inputs 3px, links 4px radius + 2px padding | focus-states | confirmed |
| 23 | Cards Mini 40/48/56/64, Micro 24; Brand team approval rule | cards | confirmed |
| 24 | Brand New podcast: "billboard to button"; 10 tapestries, "10 meters wide", spend/send locations; three teams | bn67 transcript | confirmed |
| 25 | Creative Review: "one of the most accessible in the world", 200+ colour options, WCAG 3.0, "subtly recrafted", Inter secondary | live page | confirmed |
| 26 | Tearsheet 2025-02-04: Carter, "Brand Systems", retainer | live page | confirmed (retainer line is not attributed to Carter on the page) |
| 27 | Ragged Edge awards: Brand New 2023 win, D&AD 2024 shortlist, ADC Merit 2023 | live page | confirmed |
| 28 | D&AD "we created a global design system ..." | live page | confirmed (entrant Ragged Edge) |
| 29 | Brand New review body paywalled | live page | confirmed |
| 30 | Wise.design live is a Figma Site; docs.wise.design 404; designsystems.surf "removed from public access" | not re-fetched | unverifiable |

## Wrong facts

1. **Foundations count.** `guide.format` and `structure`/`format` points say "27 Foundations pages / nav lists 27 entries". The nav (and the dossier's own chapters 3-27) has 25.
2. **Edition date range.** `guide.edition` and `format` point 4 say Contentful entries run "2022-10-18 to 2024-05-14". Timestamps in the fetched pages run to 2025-09-25 (motion-system), typography 2025-06-23, icons 2025-03-06, design-at-wise 2025-02-27. The "edited after launch" reading stands; the end date is wrong.
3. **"Wise Sans in product only for feature intros, success screens and success progress screens"** (type points). The page adds: "It can also be used sparingly across product to enhance key brand features where relevant, these can be reviewed on a case by case basis." Remove "only".
4. **"weighted 60% snappy, 30% fluid, 10% intuitive"** (motion takeaway and summary). This comes only from the alt text of one chart image ("One graph is titled 60% snappy, the second ... 30% fluid ... 10% intuitive"). The text never calls it a weighting. State it as the chart's titles, or mark it as our reading.
5. **Colour chapter "7 sections".** The page sub-nav has 6 (Core, Secondary, Type and colour, Product, Theming, Accessibility).
6. **Logo "primary colour versions (Forest Green on Bright Green and the reverse)".** The page shows a third primary version, Forest Green on neutral grey.
7. **Exclamation marks "one at most"** is a firmer rule than the page: "Most of the time, you don't need an exclamation mark ... if you must, only use one at a time."
8. **"corner placement preferred"** is a paraphrase; the page says corner placement is "nice and visible", centre is allowed.
9. **"Powered by Wise badges in Bright Green, Forest Green and white"** is not supported by the fetched page text, which only mentions "black and white versions" as the fallback. Check the badge images or drop the colours.
10. **"Ragged Edge credits itself with the verbal identity"** (voice summary). Ragged Edge's page says the team built a verbal identity across 175 countries, so this holds, but the claim is placed next to guide content and Creative Review does not say who wrote the voice. Fine, but cite the Ragged Edge page for it, not the guide.

## Status problems

- **story: partial** is correct (strategy gated). The gap lists Stories as unread; read it or add it as a chapter so the gap is real.
- **applications: partial** is correct. The gap says Wise Swag, Mission Days, Wise Platform, Wise Connect "were listed but not read": those are chapters that should be on the list (see Chapters).
- **imagery: partial** correct.
- **governance: partial** correct.
- **omissions: partial** is fine, but the point "Logo: no construction grid" is checkable and is true on the fetched page; keep.
- **format, structure, rule-style, voice, logo, colour, type, elements, motion, strengths: found.** All earned. `elements` and `motion` could arguably be `partial` (no tapestry rules; no durations) but the questions' asks are met.

## Website-not-guide problems

The guide here is a website, so the wise.design pages are the guide and fine. Not-guide leaks:

- Logo answer cites the Wise blog "New look, same old Wise (2021-02-22)", typed `owned`. That is the 2021 TransferWise-to-Wise rename post, not the 2023 identity and not the guide. Drop it or explain it.
- Format answer leans on the live Figma Site (2026-10-22 check) and on `/foundations` rendering empty. That is evidence about the guide's current state and is reasonable, but it is the marketing site and the claim cannot be re-checked from the fetched files.
- No CSS or marketing-copy facts found in the answers.

## Closable gaps

1. **Stories and Work at Wise** (Design at Wise) and **Designing for MUA, Mission Days, Wise Platform, Wise Connect, Wise Swag** (Resources): look for Wayback captures and read them. They may close part of the `applications` and `governance` gaps.
2. **Statement library** (tone-of-voice sub-page): already fetched (103 words, gated). Say so in `voice` instead of "statement library behind sign-in" being buried.
3. **Creating flags / Creating icons**: CDX has captures; they may hold the missing icon/flag construction rules (the `elements` and `omissions` answers claim none exist).
4. **Logo "Downloads"** and **Resources › Downloads** are both gated: confirmed; no closure.
5. **Brand strategy / Illustration / Tapestries**: gated in every capture; correctly left open. Creative Review and Ragged Edge do not close them.
6. **Typography fonts source**: page does say Inter is open-source only via Creative Review; the guide gives no download or fallback. Omission is real. Add the Creative Review line as press context.

## Asset problems

All 11 files exist, open and are indexed. Problems:

1. **`type-hero.png` is mislabelled.** Index says "Typography › header image — Wise Sans display with a tapestry ribbon", source typography. The image reads "WHOA" over a pink ground with a tapestry ribbon; the fetched pages show that image (alt "Text which reads 'Whoa'") as the header of the **Illustration** page, not Typography (whose header alt is "Dollars, to pesos, to pounds, to euros."). Relabel with the Illustration source, or replace it with a real Typography page image. Its use in the `type` answer is then wrong.
2. **`logo-secondary-pink.png`** shows Bright Orange and Dark Purple logos, not pink. The index text says orange/purple correctly; the filename and its use in `colour` are misleading. Rename or re-describe.
3. **`logo-tapestry-bad.png`** is the only asset for the `imagery` answer, but it is a logo-on-tapestry misuse ("Lacking in contrast"), not a photography or tapestry rule. Weak fit.
4. **Gaps in coverage.** Only logo and typography pages are pictured. No colour swatch page, grid diagram, motion chart or photography example is included, though those pages have images. 11 assets for a 31-chapter guide is thin; add at least colour, grid and photography.
5. **Image/rule mismatch check:** `logo-misuse-lockup`, `logo-misuse-angle`, `type-inter-caps-dont`, `type-align-dont`, `logo-clear-space`, `logo-app-tile`, `logo-partner-lockup` (shows a generic "Partner's Logo" placeholder, not HSBC) match their captions.
6. The `format`, `structure`, `elements`, `motion`, `governance`, `strengths`, `omissions` answers have empty `assets`. Allowed, but `motion` and `elements` have obvious visuals.

## Source-type problems

- Wise Blog 2021 post typed `owned`: wrong kind of source (see above), not guide material.
- D&AD Awards entry typed `agency`: the entry is submitted by Ragged Edge but hosted by D&AD; `reference` or `press` is nearer. The Ragged Edge case study (`agency`) is right.
- Brand New review typed `press` but its body is paywalled and nothing was drawn from it; it is cited only to say it could not be read. Better as a note in `gap` than a source.
- `found` answers all cite an agency or press source, as the validator requires. Some are thin: `elements` cites only wise.design pages, so its `found` rests on owned sources only; check the validator accepts it, and add a press line (e.g. the Creative Review accessibility line).
- wise.design pages typed `owned` are consistent. Wayback URLs are acceptable as the guide's own pages.

## MUST-FIX

1. Change "27 Foundations pages / 27 entries" to 25 in `guide.format` and the `format` points.
2. Fix the edition/date range: Contentful timestamps run 2022-10-18 to 2025-09-25, not 2024-05-14 (`guide.edition`, `format` point 4).
3. Add the missing chapters in nav order: Design at Wise = Brand strategy, Get started, Stories, Work at Wise; Resources = Designing for MUA, Downloads, Partnership guidelines, Mission Days, Wise Platform, Wise Connect, Wise Swag. Swap Brand strategy/Get started and Partnership/Downloads to match the nav. Mark each as read or not read in `note`.
4. Replace the `source` on Components (n28) and Patterns (n29) so it is not the Get started page, or note they are cited from the nav only.
5. Relabel or replace `type-hero.png`: it is the Illustration page header ("WHOA"), not the Typography header. Fix its `assetsIndex` row and remove it from the `type` answer if it stays unrelated.
6. Remove "only" from the Wise Sans in product point; quote the "sparingly ... case by case basis" sentence.
7. Reword the motion 60/30/10 claim as the chart's titles (alt text), not a weighting, in the takeaway and summary.
8. Correct the colour chapter size from 7 sections to 6, and add the third primary logo version (Forest Green on neutral grey) to the logo summary.
9. Fix or drop the "Powered by Wise badges in Bright Green, Forest Green and white" point; the page text only supports black and white fallbacks.
10. Drop the 2021 Wise blog post from the logo sources (or explain that it is about the old rename); retype the D&AD entry away from `agency`.
11. Add 3+ more assets from the guide pages: a colour page swatch, the grid diagram, a photography example. Rename or re-describe `logo-secondary-pink.png` as orange/purple.
12. Try to read Stories, Work at Wise, Designing for MUA, Wise Swag, Mission Days, creating-flags and creating-icons from Wayback and update the `applications`, `governance`, `elements` and `omissions` gaps with what they hold or with "captured, gated".
