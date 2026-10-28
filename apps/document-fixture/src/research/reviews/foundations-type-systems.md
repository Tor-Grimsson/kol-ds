# Review: foundations / type-systems

Reviewed file: `src/research/foundations/type-systems.json` (researchedAt 2026-10-21). Reviewed 2026-10-21 against the cited URLs (fetched live; Apple HIG read via its JSON data endpoint).

## Verdict

**Mostly sound, but it needs fixes before anyone uses it as a reference.** The system numbers are accurate: Material 3, Apple iOS, Carbon, Tailwind, Atlassian, Polaris, WCAG and Web Almanac all check out against their sources. The errors and overreach sit in the parts that interpret the data: the Utopia default it quotes is wrong, it draws a tracking "lesson" from Apple's own tables that those same tables contradict, it adds rationales and credits for custom faces that its sources don't contain, and it labels n=2–4 anecdotes as `established`. The field-fit table is honest about what it couldn't verify (agencies). But several of its rows rest on one example, and the table's only cited source is a homepage URL. The gaps a brand designer would hit first are glyph coverage (Icelandic), licensing mechanics, and font loading and performance.

## Verified claims

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | Carbon formula Xn = Xn-1 + {INT[(n-2)/4]+1}×2, y₀=12 → 12…92px (17 values) | carbondesignsystem.com/elements/typography/overview | **Confirmed.** Recomputed step by step: +2 for n=2–5 (14,16,18,20), +4 for n=6–9 (24,28,32,36), +6 for n=10–13 (42,48,54,60), +8 for n=14–17 (68,76,84,92). |
| 2 | Major-third scale 16×1.25^n, n=−2…6 | arithmetic | **Confirmed.** 10.24, 12.8, 16, 20, 25, 31.25, 39.0625, 48.828, 61.035. The ratio table's 16×r⁵ column also checks out for all 9 rows. |
| 3 | Utopia default: 18px/1.2 @320px → 20px/1.25 @1240px; step 0 / step 5 clamp() strings | utopia.fyi/type/calculator | **Wrong viewport.** The live default min viewport is **360px**. The quoted clamp() strings are correct, but they are 360→1240 output: the slope 0.2273vw = 2px/880px and the intercept back-solves to 360. The step px values in the `scales` entry are correct. |
| 4 | clamp() worked example 1rem→2rem, 320–1440: 1.4286vw, 0.714rem | arithmetic | **Confirmed.** |
| 5 | Barvian: max ≤ 2.5× min passes 1.4.4; 16→48 between 320–1280 fails ≈1050–2100px | smashingmagazine.com 2023/11 | **Confirmed.** The 5× breakpoint condition is the article's precondition. |
| 6 | Material 3: 15 roles, 57/45/36 … 11px, 4px-grid line heights, tracking +0.4/+0.5/−0.25px | material-web v0_192 scss | **Confirmed.** Title-large is regular weight, not medium. See Wrong facts #6. |
| 7 | Apple iOS Large table (Large Title 34/41 … Caption 2 11/13) | HIG JSON | **Confirmed** against the table at Large. |
| 8 | iOS body 14→23 across xS–xxxL, 28/33/40/47/53 for AX1–AX5; Large Title 60 at AX5 | HIG JSON | **Confirmed.** |
| 9 | HIG minimums iOS 11 / macOS 10 / visionOS & watchOS 12pt; avoid Ultralight/Thin/Light | HIG JSON | **Confirmed.** It omits tvOS (23pt min). |
| 10 | SF Pro tracking: +41@6, +12@10, 0@12, −26@17, −23@20, +3@24, +14@28–30, +10@36–40, +6@54, 0@80 | HIG JSON | **Numbers confirmed.** The explanation ("because it switches to Display") is not stated by Apple, and the conclusion drawn from it is contradicted (Wrong facts #4). |
| 11 | Carbon productive tokens (body-compact-01 14/18, heading-06 42/50 Light, code-01 12/16 +0.32px), 14px vs 16px base, "do not use inside a container" | carbondesignsystem.com/elements/typography/type-sets | **Confirmed.** |
| 12 | Atlassian: headings ≥ body and ≤ 2× body | atlassian.design applying-typography | **Confirmed.** Atlassian's own heading.xxlarge (32) is 2.29× its default body (14), so the rule is measured against body.large. Worth saying. |
| 13 | Dyson & Kipping: 100 cpl faster than 25, comprehension equal, 55 rated easiest, ratings ≠ performance | journals.uc.edu Visible Language 32(2), 1998 | **Confirmed**, but it is a single 1998 CRT/scrolling study (see Mislabelled #6). |
| 14 | Baymard 50–75 cpl, ≈70ch or 34em | baymard.com | **Confirmed.** |
| 15 | Web Almanac 2025: variable fonts 39.4% desktop / 41.3% mobile; Google Fonts ≈54/47%; ≈72% self-host any, ≈⅓ exclusively; Roboto 10–10.7%, Poppins 5.8–6%, Open Sans 5–5.6%, Montserrat 3.3–3.9%; 0.3% animate axes; Noto Sans JP 25–26% | almanac.httparchive.org/en/2025/fonts | **Confirmed.** The same chapter puts Inter at 1.4–1.5% of pages, which undercuts the summary's "Inter dominates". |
| 16 | Web Almanac 2022: 28/29% variable, Google Fonts 64.5%; 2024: 33/34%, Inter #9 self-hosted, ≈3% of variable fonts | 2022 + 2024 chapters | **Confirmed.** |
| 17 | NHS: Frutiger, 3 licensed weights, Arial fallback, 19px desktop / 16px mobile; GOV.UK GDS Transport rule | service-manual.nhs.uk, design-system.service.gov.uk | **Confirmed.** |
| 18 | IBM Plex: Abbink + Bold Monday, 2017, replaced Helvetica; Thai 2018, Devanagari 2018, Arabic 2019, Korean 2020, Japanese 2021; Apache 9–21 Aug 2018 rescinded | en.wikipedia.org/wiki/IBM_Plex | **Confirmed.** |
| 19 | Netflix Sans (Dalton Maag 2017–2023, Ultra Condensed–Ultra Extended, Latin/Cyrillic/Greek/Vietnamese, 800+ languages); "millions" claim; Hoefler's "never quoted … a million dollars" | daltonmaag.com, thenextweb.com | **Confirmed.** The Hoefler quote is in TNW only, not in the Entrepreneur source. |
| 20 | Airbnb Cereal (Dalton Maag, 15 May 2018, 6 weights, "button to billboard"); Uber Move (MCKL + Wolff Olins, 4 weights, Display/Text); TCCC Unity (Brody Associates, Jan 2018, large x-height) | dezeen, mckltype.com, itsnicethat | **Confirmed.** The Uber page gives no year; 2018 comes from Engadget. |
| 21 | Whitney (Frere-Jones 1996, public 2004, Stripe 2014, WSJ online); Inter Aug 2017; Inter Tight 2022 → Guggenheim Sans 2023; Inter users Peloton / KRON 4 / LPO / Freiburg | fontsinuse.com | **Confirmed.** |
| 22 | Stripe Camphor → Söhne 2020; Robinhood 2024 RH Phonic (Schick Toikka) + Martina Plantijn (Klim) "warm yet intelligent serif" | fontsinuse.com, portorocha.com | **Confirmed.** |
| 23 | Google Sans Flex: 3,000+ readers, 6 axes, Font Bureau + Pathfinders, 20+ writing systems, Red Dot 2024, Google Sans + Flex open-sourced 2025 | design.google | **Confirmed.** |
| 24 | Geist (Vercel + Basement Studio + Andrés Briganti, OFL, Sans/Mono/Pixel, "perfect partner"); Mona Sans (Degarism, OFL, weight/width/slant) | github.com | **Confirmed.** |
| 25 | VF Didot for Vanity Fair, 2013 | fontsinuse.com | **Confirmed.** It is by Commercial Type (Schwartz & Barnes) and was retailed in 2016 as Le Jeune. The JSON leaves out the designer. |
| 26 | Saint Laurent back on its serif; Burberry 2018 replaced Bodoni used since 1901; Paris 2024 by Royalties + Ecobranding, Art Deco/1924 | nssmag, dezeen, typeroom | **Confirmed** as reported by those sources. |
| 27 | WCAG 1.4.8 (1.5 spacing, ≤80 cpl, 40 CJK) and 1.4.12 values; opsz spec "10 to 16 recommended for typical text" | w3.org, learn.microsoft.com | **Confirmed.** |

Scales re-checked step by step: Carbon formula (#1), Major third (#2), Utopia (#3), iOS Large (#7) and Material 3 (#6). Utopia is the only one that fails, and only on the viewport.

**Could not verify from the cited URL:** the Inter 4 opsz range of 14–32 and its "1118 vs 1056" x-height (rsms.me/inter gives no numbers, and "1118 UPM" misuses the term: those are font units, not units-per-em). Guardian Egyptian as a "96-member family" (Wikipedia gives no count). Carbon expressive "up to 92px": the type-sets page lists only one value per fluid style, and Carbon's fluid display styles are generally documented as growing past 92px at the max breakpoint, so check the Carbon source before keeping it. Firefox "caps zoom at 300%" comes from a 2019 article and current Firefox goes to 500%, so date or drop it.

## Wrong facts

1. **Utopia default viewport.** The JSON says 320px (fluid finding 1, the `scales` Utopia computation string, and finding 2's example). The live calculator says 360px, and the JSON's own clamp() strings only work out at 360.
2. **Tailwind "below 4xl ~×1.125".** The real steps are 20→24 ×1.2, 24→30 ×1.25, 30→36 ×1.2. Only base→lg→xl are near 1.125. The "two-ratio scale in practice" framing doesn't hold.
3. **Spotify Mix.** The source credits Spotify's in-house team (led by Rasmus Wängelin) *with* Dinamo, not "Dinamo's Spotify Mix". The source doesn't support "because Circular's range felt limiting", "blends geometric, grotesque and humanist cues" or "Latin-script languages and Vietnamese only". All three are unsourced.
4. **SF Pro "lesson".** The JSON claims that copying negative display tracking onto an optical-size font "double-tightens" it. Apple's own HIG contradicts this. New York has dynamic optical sizes and its tracking goes *monotonically negative* (+40@6pt → −16@80pt+). SF Pro Rounded stays positive throughout. The curve depends on the font, not on whether it has opsz. Inter 4 also has opsz, so the finding contradicts its own Inter example.
5. **Premier League.** soccerbible doesn't contain "clubs cannot use custom numbers in league games". It only says Sporting iD made the font for 2017/18 with five colourways. Unsourced.
6. **Material 3 weights.** The JSON says "title and label use medium weight", but title-large is regular. A later finding in the same file gets it right, so the file contradicts itself.
7. **Robinhood 2020 "with Collins"** (custom-faces table). The cited newsroom post names no agency or designer for Capsule Sans or Nib.
8. **Wise "361-script support".** This repeats an unexplained asterisked claim from NaN, and NaN's same page lists only Latin, Cyrillic and Greek. Unicode encodes about 170 scripts in total, so 361 *scripts* is impossible. It is almost certainly languages. Don't repeat it as scripts.
9. **Burberry/Saville.** Saville did call the replacement of his identity "a management mistake". But the same article has him praising the 2023 design ("really nice", "I like it"). As written, the JSON implies he criticised the new serif. Misleading.
10. **Summary: "Inter dominate[s]" the web.** The cited 2025 Almanac puts Inter at 1.4–1.5% of pages, below the Google sans faces. It dominates only among design-led products.
11. **custom-faces table source.** The table's single `source` is the Netflix Sans page, which supports one row of 12. YouTube Sans ("Saffron with Letterjuice, URW++") has no source anywhere in the file.
12. **Geist year "— (not dated on source)".** Geist launched in October 2023 (vercel.com/font, already cited). Leaving it blank is a lazy gap, not caution.

## Mislabelled confidence

| Finding | Current | Should be | Why |
|---|---|---|---|
| Superfamilies "are the recurring choice for large brands" | established | common-practice | Four examples, two of them not sans+serif+mono superfamilies (Söhne has no serif; Geist has no serif). No survey. |
| Distinctiveness and cross-medium consistency are main drivers | established | common-practice | The evidence is launch PR statements. |
| Brands replace geometric customs at expressive limits; variable is default for new commissions | established | contested / common-practice | Two cases, and the Spotify rationale is unsourced. "Default for new commissions" has no data behind it. |
| News orgs pair custom serif headline + matched sans | established | common-practice | Two examples (NYT, Guardian). The Guardian has used Guardian Headline since 2018. |
| Government chooses humanist / plain grotesque sans | established | common-practice | Three examples, all Anglophone. GDS Transport is a signage face, and the licensing scope is GOV.UK-specific. |
| Luxury swung to sans 2012–18 and back after 2023 | established | common-practice | Fashion journalism. "Back" is two or three houses, and nss itself says Celine's logo is unchanged. |
| Tracking "should be" positive small / negative large | established | common-practice (font-dependent) | Apple's SF Pro Rounded and SF Pro tables break it, and Material 3 holds at 0 for most display/headline sizes. |
| SF Pro non-monotonic "because" of Display optical design | established | common-practice (inference) | Apple doesn't state the mechanism, and the lesson drawn from it is wrong (Wrong facts #4). |
| clamp() max ≤ 2.5× min passes 1.4.4 (presented in the summary as *the* rule) | established | common-practice | One author's derivation, tied to browser zoom behaviour that changes. Keep it, but attribute it. |
| 45–75 measure: "longer lines are often read faster" | contested ✓ label | keep `contested`, fix the claim | "Often" rests on one 1998 scrolling study (n≈18, CRT). Dyson & Haselgrove (2001) found ~55 cpl gave the best comprehension at normal reading speed, so the evidence is mixed. It does not say longer is better. |
| Field-fit: "Sector conventions are weaker than they look" | contested | common-practice (or keep it as a stated opinion) | `contested` is defined as "a popular claim the evidence doesn't support". This is the opposite: the file's own counter-claim, backed by two typeface user lists. |

**Myths not handled:** the golden ratio and "musical" ratios are presented without saying that the ratio names are just labels with no perceptual basis. That should be a `contested` line. "Dyslexia fonts help" isn't covered at all, though it comes up in every brand accessibility brief (see Missing).

## Field-fit problems

- **The table's `source` is `https://fontsinuse.com/`**, the homepage. Each row needs its own citation, or the cell needs to carry the URLs already used in the findings.
- **Healthcare = NHS only**, and it duplicates the Government row. One public-sector example doesn't show a healthcare sector pattern; private health brands are missing (e.g. Oscar, Hims, One Medical). Mark it as a single example or source more.
- **Food & beverage = Coca-Cola only.** The "heritage-coded geometric / display" classification is generalised from one brand. The finding text also bundles in sports to make the claim look broader.
- **Sports:** the Premier League rule is unsourced (Wrong facts #5). Paris 2024 is fine.
- **Fintech:** the "361 scripts" claim for Wise needs fixing (Wrong facts #8). Otherwise OK.
- **Enterprise SaaS "Atlassian Sans"** has no foundry or year. Atlassian Sans is a customised Inter derivative, which is worth stating because it reinforces the Inter point.
- **Luxury:** OK on sources, but "Saint Laurent (2012 sans, later serif)" should say *which* serif and where it's used (nss is vague: "for some time").
- **Agencies/studios:** correctly flagged as unverified. Either source it or drop the row. A hypothesis row in a reference table gets read as fact.
- **No Nordic or Icelandic examples at all**, which matters for a Reykjavík studio. Fonts In Use can be filtered by country, so pull real Icelandic uses before claiming any local pattern.

## Missing (with sources)

1. **Glyph and language coverage as a hard selection gate.** Icelandic needs Þ þ Ð ð Æ æ Ö ö plus the acute vowels Á É Í Ó Ú Ý, and „…" quotes (U+201E / U+201C). Ð/ð and Þ/þ are where many grotesks are under-drawn, so check the shapes and kerning, not just whether the glyphs exist. Sources: Hyperglot (https://hyperglot.rosettatype.com/), Google Fonts glyph sets (https://github.com/googlefonts/glyphsets), Underware Latin Plus (https://underware.nl/latin_plus/). Add a step to subset with `unicode-range` without losing Latin-1 (MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range).
2. **Licensing in detail.** The file covers how medium-split/traffic pricing works, but misses:
   - who owns the licence (client vs agency)
   - logo/wordmark use and modification clauses
   - app, ePub and broadcast tiers
   - subscription services: Adobe Fonts can't be self-hosted and stops working when the subscription ends
   - OFL Reserved Font Name obligations when modifying an open face

   Sources: https://openfontlicense.org/, https://helpx.adobe.com/fonts/using/font-licensing.html, the Klim and TypeTogether licence pages already cited.
3. **Web font performance and loading.**
   - variable vs static file size (when one variable file beats 2–3 statics)
   - `font-display`, preload
   - fallback metric overrides (`size-adjust`, `ascent-override`) to avoid layout shift
   - WOFF2 only

   Sources: https://web.dev/articles/font-best-practices, https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust, the Web Almanac 2024/2025 performance sections (already cited chapters).
4. **GDPR / Google Fonts ruling, made concrete.** It's referenced vaguely as "European GDPR rulings". It should name LG München I, 20 Jan 2022, case 3 O 17493/20 (fine for passing an IP address to Google via hotlinked fonts). This matters for EU/EEA (Iceland) clients and is a direct argument for self-hosting.
5. **Mono in brand systems beyond dev tools.** Cover tabular figures as the alternative to mono for data: `font-variant-numeric: tabular-nums` (https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric). Also cover when a mono is a voice choice and when it's a shortcut for missing `tnum`.
6. **OpenType features as brand spec**: tnum, lnum/onum, case, ss01–ss20, and contextual alternates that Icelandic diacritics depend on. Brand guides should list which features are enabled. Source: OpenType feature registry (https://learn.microsoft.com/en-us/typography/opentype/spec/featurelist).
7. **Fallback stacks** for when the brand font fails (email, Office, slides). Most brand systems break in Google Slides/PowerPoint. Source: https://modernfontstacks.com/. Also specify an "Office-safe" substitute per brand face.
8. **Accessibility myths and evidence.** OpenDyslexic shows no benefit (Wery & Diliberto 2017, https://link.springer.com/article/10.1007/s11881-016-0127-1) and should go in as `contested`. Atkinson Hyperlegible is a legibility-driven design (https://www.brailleinstitute.org/freefont/).
9. **Modern CSS setting tools**: `text-wrap: balance | pretty` for headings and body, `text-box-trim` for cap-height alignment, `hyphens: auto` with `lang` set. Long Icelandic compounds make hyphenation support per browser a real concern; test with `lang="is"`. Sources: MDN pages for each property.
10. **Material 3 Expressive (2025)**: the scale cited is v0_192 tokens. Note that M3 Expressive added emphasized styles, or the Material entry will go stale. Source: https://m3.material.io/styles/typography/type-scale-tokens.
11. **Print and physical specs**: pt sizes, minimum sizes for signage and packaging, ink spread on light weights. The research is web/app-only, but brand systems aren't.

## MUST-FIX

1. Change the Utopia default min viewport from 320px to 360px in fluid finding 1, the Utopia `scales` computation string and finding 2's example.
2. Rewrite the SF Pro finding: keep the numbers, drop the "because Display" causation (or attribute it as inference), and delete the "double-tightens opsz fonts" lesson. Apple's New York table, also an optical-size face, runs negative at display. Replace it with "the tracking curve is font-specific; use the foundry's table."
3. Remove the unsourced Spotify Mix claims (the reason Circular was replaced, the "blends" description, Latin+Vietnamese only) and credit "Spotify in-house (Rasmus Wängelin) with Dinamo".
4. Remove "clubs cannot use custom numbers" from the Premier League claim, or cite a source that says it.
5. Correct the Tailwind ratio description: the steps below 4xl range ×1.11–1.25, so it isn't a two-ratio scale.
6. Fix Wise "361 scripts" → state Latin/Cyrillic/Greek, and quote the 361 figure only as NaN's unexplained claim (likely languages).
7. Fix the Material 3 weight statement: title-large is regular.
8. Remove "with Collins" from Robinhood 2020 (unsourced) and add a source for YouTube Sans or drop that row.
9. Give each `custom-faces` and `field-fit` row its own source. The table-level sources (Netflix page; fontsinuse.com homepage) don't cover the rows.
10. Reword the Burberry/Saville line so it doesn't imply Saville disliked the 2023 serif.
11. Change "Inter dominate[s]" in the summary to the Almanac reality (Roboto/Poppins/Open Sans/Montserrat; Inter ≈1.5% of pages) and keep Inter's dominance scoped to design-led products.
12. Relabel the eight over-confident `established` findings listed in Mislabelled confidence to `common-practice`, and relabel "sector conventions are weaker" off `contested`.
13. Soften the Dyson & Kipping reading ("one 1998 screen study; later work found ~55 cpl best for comprehension") so the `contested` finding doesn't overclaim in the other direction.
14. Date or drop "Firefox caps zoom at 300%", and fix "1118 UPM" (font units) or cite Inter's source for the x-height numbers. Verify Carbon "expressive up to 92px" against Carbon's fluid token source.
15. Fill Geist's year (Oct 2023) and add VF Didot's designers (Commercial Type, Schwartz & Barnes).
16. Add a glyph/language-coverage finding with an Icelandic check (Þ Ð Æ Ö, acute vowels, „" quotes) plus Hyperglot and the glyph-set sources, as a selection gate ahead of field fit.
17. Add licensing-mechanics and font-loading/performance findings (Missing #2–#4) with the listed sources.
