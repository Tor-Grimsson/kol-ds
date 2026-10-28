# Review: foundations / colour-combinations

Reviewed file: `src/research/foundations/colour-combinations.json` (researchedAt 2026-10-21). Reviewed 2026-10-21 against the cited URLs (fetched live; paper abstracts via Crossref / Semantic Scholar where publishers block; Uber PDF rendered and read; Carbon and Tailwind ramps diffed against the package source).

## Verdict

**Sound on numbers, loose on law and on its own headline claim. Fix before use.** Every hex, ramp step and contrast ratio checks out: I recomputed 17 ratios and all match to two decimals. The study figures check out too (O'Donovan, Schloss & Palmer, Ward, Brus, Jonauskaite, Lehmann, Gorn, Singh, Lucidpress). The weak spots are interpretive:

- **The proportion headline is overstated.** The claims that the 60% slot is always a neutral and that every guide caps the most saturated tier at a tenth are contradicted by two of the four guides cited (Somerset, Calgary).
- **The legal section has errors.** It misdescribes Cadbury ("lost its registration"), misattributes the T-Mobile suit (it was against Aio Wireless, not AT&T, and T-Mobile won), and overstates Glossier (those were non-final refusals).
- **One study is labelled `established` unread.** Labrecque & Milne carries that label even though the file admits the paper was never opened.
- **The file breaks its own myth rule.** It debunks colour-meaning lists, then asserts unsourced meaning claims of its own ("warm greys read editorial", "pastels read friendly", "off-white reads printed"). It also repeats Material's "reduces eye strain" without a caveat.
- **Gaps for a studio or type foundry.** It is a screen-only file: no print/CMYK/Pantone, no paper stock, no colour-vision deficiency, no simultaneous contrast, no measured studio or foundry examples.

## Verified claims

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | O'Donovan et al. 2011: 104,426 Kuler + 383,938 COLOURLovers themes, 10,743 rated ×40 on MTurk; "no evidence is found that they predict compatible colors"; 2–3 hues preferred; dark themes rated poorly | dgp.toronto.edu colorcomp.pdf (full text) | **Confirmed**, all numbers and quotes. |
| 2 | Schloss & Palmer 2010: pair preference and harmony rise with hue similarity; preference also depends on lightness contrast; figural preference rises with hue contrast against the ground | Abstract (Semantic Scholar / PMC3037488) | **Confirmed.** The design recommendation drawn from it ("not complementary pairs at equal area") is the author's extrapolation from lab colour pairs, not the paper's. |
| 3 | Ward, Yang, Romaniuk & Beal 2020: 1,281 elements, 13 CPG categories, 19 countries; characters/logos most ownable; colour hard because of competitive sharing | ideas.repec.org abstract | **Confirmed.** |
| 4 | Brus et al. 2025: 405 elements, 50 brands, 5 categories; fame overestimated, uniqueness underestimated | Crossref abstract | **Confirmed.** |
| 5 | Jonauskaite et al. 2020: 4,598 people, 30 nations, 22 languages, 20 emotions × 12 colour terms, r = .88, nation predicts beyond universal | Crossref abstract | **Confirmed.** |
| 6 | Lehmann, Elliot & Calin-Jageman 2018: d = 0.26, N = 2,961, I² = 89%; women rating men d = 0.13 with upward bias; possible decline over time | Crossref abstract | **Confirmed.** |
| 7 | Gorn et al. 1997: value → relaxation → liking; chroma → excitement → liking; managers often pick high value/chroma, "in a large number of cases they do not" | Crossref abstract | **Confirmed.** |
| 8 | Singh 2006: "62–90 percent … colors alone" sits in a literature review with no original data | Crossref abstract (Design: "reviews the literature") | **Confirmed.** The `contested` label is fair. |
| 9 | Loyola "80%" traces to a Xerox leaflet; Hoadley's papers contain no 80% figure | insights4print.ceo | **Confirmed.** The leaflet copy is dated 2005 (Google dates it to 2001). The file's paraphrase of the Hoadley 1990 abstract (time and accuracy by chart type) is **unverifiable**: the publisher hides the abstract. |
| 10 | Lucidpress 23% (2018) / 33% (2019), 200+ orgs, expectations not measurements | asicentral.com | **Confirmed.** |
| 11 | Acolad "approximate 60:30:10 ratio"; 60% white / 30% Zodiac Black #0b1c34 / 10% Blue Ribbon #126cee | acolad.com/brand/design/color | **Confirmed.** |
| 12 | Mintos 60–30–10 (60 neutrals / 30 brand greens / 10 accent+semantic); hexes #FAF9F5 #DADAD7 #255A3C #1F3828 #34DE8D #101110 | brand.mintos.com/color | **Confirmed**, all six hexes. |
| 13 | Somerset: primary "at least 65%", secondary 25%, highlight "up to 10%", tints in multiples of 20; 11 hexes | playbook.somerset.gov.uk | **Confirmed**, all 11 hexes. It undercuts the "60% = neutral" claim, though (Wrong facts #1). |
| 14 | Calgary: accents "only cover 10% of the area", "never … without red and gold"; red #d6001c, gold #ffcd00 | ucalgary.ca | **Confirmed.** |
| 15 | Uber 2018: white/black primaries; Safety Blue #276EF1 "used sparingly for moments of support, assurance, and delight"; 6 secondaries; "only used for critical moments"; measured chart 29/15/18/≈6% | Uber_2018.pdf (text extracted; page 6 rendered) | **Confirmed.** All 9 hexes match, and the chart geometry re-measures to white ≈30%, black ≈15%, blue ≈18.6%, secondaries ≈6.2% each. The source has its own errors: Uber Red is RGB 230 76 53 (#E64C35) beside HEX F25138, and Uber Orange's CMYK 79 59 0 0 is a blue. That matters for the print gap below. |
| 16 | Pentagram Slack: 11 → 4 colours, "suffered against any background color other than white", aubergine "instantly recognizable against the white of other desktop windows" | pentagram.com/work/slack/story (raw HTML) | **Confirmed**, verbatim. |
| 17 | Nestlé v Cadbury [2013] EWCA Civ 1174: Pantone 2685C; "predominant" "opens the door to a multitude of different visual forms" (para 50) | caselaw.nationalarchives.gov.uk | **Quote and paragraph confirmed.** The framing is wrong (Wrong facts #3). |
| 18 | Red Bull: RAL 5002/9006 "approximately 50%–50%" and Pantone 2747C/877C "equal proportion and juxtaposed"; CJEU dismissed appeal, July 2019; Heidelberger "systematic arrangement … predetermined and uniform way" (blue + yellow) | ipkitten 2019/07 and 2004/06 | **Confirmed.** Judgment 29 July 2019. |
| 19 | Louboutin v YSL (2d Cir 2012): rejected the per se "never in fashion" rule; mark limited to a red sole contrasting with the upper | loeb.com | **Confirmed.** The file's "YSL's all-red shoe did not infringe" is loose: the court held the monochrome shoe fell outside the limited mark and affirmed denial of the injunction. It made no infringement finding as such. |
| 20 | Qualitex 514 U.S. 159: "purely and simply, of a color"; functionality test; Owens-Corning precedent | law.cornell.edu | **Confirmed.** Owens-Corning (774 F.2d 1116) is cited in Qualitex itself, which is a better source than the NPR piece. |
| 21 | Tiffany: Pantone 1837 custom, #81D8D0, Blue Book 1845, colour mark since 1998 | en.wikipedia.org/wiki/Tiffany_Blue | **Partly confirmed.** "On boxes and bags since the 1845 Blue Book" is not in the source (Wrong facts #6). |
| 22 | RAL 4010 Telemagenta = Deutsche Telekom corporate colour, registered colour brand | ral-farben.de | **Confirmed.** |
| 23 | Bing #0044CC, Paul Rey, $80–90M | winfuture.de (18 Mar 2010) | **Confirmed.** |
| 24 | Performable +21%, ~2,000 visitors, "only red thing on the page" | poper.ai | **Confirmed as reported by Poper.** The file credits that line to "the team itself", which Poper does not show. |
| 25 | Starbucks: 1997 jazz-themed, 1999 predominantly red, 2014 "every 14 seconds" (reportedly), later green/white/purple | Wikipedia | **Confirmed.** |
| 26 | Tropicana: launch 8 Jan 2009, −20% in two months (~$30M), reverted 23 Feb | thebrandingjournal.com | **Mostly confirmed.** The source says "within two months" and "sales", not "under two months" and "unit sales". The source also contradicts itself on the date (8 vs 9 Jan). |
| 27 | Spotify: "only … on a black or white background", fallback #191414, "Don't introduce new colors", "resting color", "non-duotoned photography" | developer.spotify.com/documentation/design | **Confirmed.** The hex **#1ED760 is not on that page** (the palette is an SVG image), so it is unverifiable from the cited source. |
| 28 | Spotify Wrapped 2024: "vibrant gradients and solid colours", Spotify Mix as main graphic element | itsnicethat.com | **Confirmed.** |
| 29 | Material dark default #121212, "dark grey instead of black … reduces eye strain" | colors.xml + Dark.md (raw) | **Confirmed.** On eye strain, see Myth handling. |
| 30 | Carbon v10: "Neutral Gray family is dominant", "core Blue family serves as the primary action color"; grounds #ffffff/#f4f4f4/#262626/#161616 | v10.carbondesignsystem.com | **Confirmed.** |
| 31 | Atlassian 10 roles; "Neutral colors apply to most backgrounds, text, and shapes" | atlassian.design | **Confirmed.** |
| 32 | Radix six greys; "choose the gray scale which is saturated with the hue closest to your accent hue" | radix-ui.com | **Confirmed.** |
| 33 | Glasgow "Use only one colour in any screenful", #f7f7f7 | gla.ac.uk (raw HTML) | **Partly confirmed.** The file drops the exception (Wrong facts #7). |
| 34 | Reboot top-100: black 34 / blue 30 / red 30 / yellow 9 / green 7 / grey 6 / orange 5 / brown 2; 2,648 consumers; 78% vs 43% recall | fashioncapital.co.uk | **Confirmed as reported.** It is an agency study with no published method, which the file says. |
| 35 | Glossier pink box / pouch refused | thefashionlaw.com | **Overstated** (Wrong facts #5). |
| 36 | Elliot & Maier 2014 call the field "nascent" | Frontiers full text (Elliot 2015) | **Misattributed.** "Nascent stage of development" is Elliot (2015). The 2014 Annual Review abstract is hidden by the publisher, so the 2014 quotes are **unverifiable**. |

**Contrast ratios recomputed (WCAG 2.x relative luminance), all match:** #1ED760/#fff 1.92, #1ED760/#191414 9.50, #81D8D0/#fff 1.66, #34DE8D/#FAF9F5 1.66, #34DE8D/#1F3828 7.24, #276EF1/#fff 4.58, #276EF1/#000 4.59, #0f62fe/#fff 5.00, #0f62fe/#161616 3.62, #1d70b8/#fff 5.17, #d6001c/#fff 5.42, #ffcd00/#fff 1.50, #101110/#FAF9F5 17.96, #0b0c0c/#fff 19.59, #121212/#fff 18.73, #78716c/#fff 4.80, #64748b/#fff 4.76.

**Ramps diffed against source, all match:** Carbon Blue 10–100 and Gray 10–100 (`@carbon/colors@11.60.0/es/index.js`); Tailwind 3.4.17 stone and slate 50–950 (`lib/public/colors.js`); Tailwind v4 slate/stone/zinc/neutral-500 oklch values (`theme.css`, rounded correctly); Uber 9 hexes; Somerset 11 hexes; Mintos 6 hexes. The Stripe gist stops were not fetched. They are labelled as a reproduction, which is honest.

**Unverifiable (publisher-blocked abstracts):** Genschow et al. quotes, Bottomley & Doyle, Madden et al., Palmer & Schloss PNAS detail, Labrecque & Milne (the file says so), Steele 2014 detail. The titles and DOIs all resolve correctly.

## Wrong facts

1. **"The 60% slot is a neutral" is wrong for two of its own four sources.** Somerset's ≥65% primary tier is white **plus teal #006072 and midnight #011e41**, both brand colours. Calgary's primary red #d6001c and gold #ffcd00 are the most saturated colours in that system, and they are not capped at all. Only the accents are. The same rule repeats in the summary ("60–65% neutral/ground") and in the ratio-models table ("60 = neutral ground").
2. **"Every documented ratio caps the most saturated tier at about a tenth" is wrong.** Somerset's secondary tier (25%) includes Marine #19d3c5 and Meadow #76bc21, which are as saturated as anything in its highlight tier. Calgary puts its most saturated pair in the uncapped primary tier. What the guides cap is the *least important* tier, not the most saturated one.
3. **Cadbury did not "lose its purple registration" in 2013.** The 2013 Court of Appeal case was Nestlé's opposition to Cadbury's 2004 **application**, and the court refused it. Cadbury's 1995 registration used the same "predominant" wording. The Court of Appeal refused its bid to amend that wording in December 2018, and Cadbury surrendered the registrations in January 2019. The cited source (the 2013 judgment) cannot support the 2018 sentence. The file also omits that Cadbury's later, precisely worded single-colour applications got a favourable High Court ruling in 2022. That ruling *supports* the file's lesson and should be in it (trademarkblog.kluweriplaw.com/2022/10/03/the-purple-reign-sweet-taste-of-relief-for-cadbury-in-the-high-court/). Check any later appeal before stating the current status.
4. **"In 2014 T-Mobile sued AT&T over a plum".** The defendant was **Aio Wireless**, AT&T's prepaid brand. T-Mobile won a preliminary injunction in S.D. Tex. in February 2014 barring Aio's plum. The file leaves out that T-Mobile *won*, and that is the lesson. The cited WLRN/NPR piece is about Lemonade (2019) and does not support the AT&T sentence (see jonesday.com 2014/01 "Deutsche Telekom wins preliminary injunction against new business of AT&T").
5. **Glossier was not "refused registration".** The USPTO issued **preliminary (non-final) refusals** in July and August 2019, and Glossier could respond. The table row "Refused: decorative / functional" sits among final court outcomes and reads as one. The pouch refusal cited Victoria's Secret. Sephora, Kylie and Petit Vour were cited for the box.
6. **Tiffany: "on boxes and bags since the 1845 Blue Book".** The source dates only the Blue Book cover to 1845. No date for boxes and bags is given.
7. **Glasgow's rule is "one colour … *in addition to the 'University blue' of the banner*"**, and CTA buttons are University blue. So the real rule is one brand blue plus one colour per screen. The finding and both tables drop the exception.
8. **Elliot & Maier (2014) "nascent".** That word is from Elliot (2015). Re-attribute it.
9. **Tropicana "under two months … unit sales".** The source says "within two months" and "sales".
10. **Performable: "the team itself said".** The cited source (Poper) states that line without attributing it to the team.

## Myth handling

The `contested` labels are fair on all eight: Performable red, Loyola 80%, Singh 62–90%, Lucidpress 23%, Baker-Miller pink, red/attractiveness plus Mehta & Zhu, and colour-meaning lists. Each `detail` says why. The Singh and Loyola treatments are the strongest in the file.

Myths left unmarked or carried in as fact:

- **"Dark grey … reduces eye strain"** (neutrals, `established`). Material's marketing line is quoted as the rationale. The evidence runs the other way for normal vision: dark-on-light (positive polarity) gives better legibility and proofreading (Piepenbrock, Mayr, Mund & Buchner 2013, *Ergonomics*, doi.org/10.1080/00140139.2013.790485). Keep #121212 and the shadow/elevation reasoning, and mark eye strain as unsupported.
- **The file breaks its own rule on colour meaning.** It labels "blue = trust" `contested`, then states as fact, with no source: "cool greys read technical or clinical; warm greys read editorial or print", "pastel-led systems read as soft and friendly", and off-white "reads 'printed' rather than 'screen'". These are exactly the context-free meaning claims it debunks. Source them or recast them as conventions.
- **"Blue = trust" is explained away with a speculative mechanism** ("luminance mechanics of mid-blues"). It is a plausible hypothesis, but no source links logo-colour choice to contrast. Say so.
- **The Google "41 shades / $200M"** is cited via Slashdot quoting the Telegraph. The primary sources exist: Doug Bowman's 2009 resignation post for the 41 shades (stopdesign.com/archive/2009/03/20/goodbye-google.html) and Dan Cobley's 2014 talk for the $200M (theguardian.com/technology/2014/feb/05/why-google-engineers-designers). Cite those.
- **60-30-10 is handled well** (`common-practice`, no origin). But the proportion finding then calls the guides that copy it `established` evidence, which is circular (see below).

## Mislabelled confidence

| Finding | Label | Problem | Should be |
|---|---|---|---|
| "Brand guides that state numbers converge on 60–65 / 25–30 / ≤10" | established | Four hand-picked guides (a council, a university, two companies), two of which adopted 60-30-10 by name. That is selection plus a circular meme, and two of the four contradict the claim (Wrong facts #1–2) | common-practice, rewritten |
| "Higher saturation and lightness are part of the meaning" (Labrecque & Milne) | established | The file says it never read the paper or its abstract | common-practice until read, or cut to the Gorn half |
| "Dark ground + one saturated accent exists because …" | established | The contrast maths is established. The causal claim ("exists because") is inference from Spotify alone | Split: ratios = established, rationale = common-practice |
| "Black/white + signal works best at mid-luminance" | established | Ratios are fact. "Works best" and "structural reason so many pick blue/red" rest on no study and no survey | common-practice |
| "Gradients: specify stops + space; CSS defaults to Oklab" | established | MDN default confirmed. The Stripe half rests on one unofficial gist | Keep established for the CSS fact only; label Stripe "reproduction, unverified" |
| "Preferred combinations partly hold across cultures" (Madden 2000) | established | One 2000 study of 8 countries, abstract not read. Jonauskaite 2020 is the stronger anchor | Cite Jonauskaite first, or common-practice |
| "Tinted greys cost almost nothing in contrast" | established | Two grey 500s from one vendor. The ratios are fact, but the generalisation rests on n = 2 | Fine with "(two Tailwind 500s)" added, or common-practice |
| "Tints extend a palette … a 10% tint counts as neutral area" | common-practice | The 10%-tint-counts-as-neutral rule is invented. No cited guide says it, and Somerset's minimum tint is 20% | Remove or attribute |
| "When multi-colour palettes get cut back, the stated reason is reproduction" | common-practice | Generalised from one case (Slack) | Reword as "Slack's stated reason…" |
| Uber "a proportion diagram is a hierarchy picture, not a literal budget" | common-practice | Uber's text says the opposite: "It is important to follow the rules of these proportions." The author's opinion is presented as finding | Quote Uber, then label the recommendation as editorial |

## Missing (with sources)

For a studio or type foundry, these matter more than half the marketing section:

1. **Print translation: CMYK, Pantone, paper.** Missing: spot vs process; Pantone Coated (C) vs Uncoated (U) as distinct targets; the fact that a hex is not a spec and a brand needs a hex/RGB + CMYK (named profile) + Pantone C + Pantone U table. Uber's own guide shows why: its Red has mismatched RGB and HEX and its Orange has a blue CMYK. Profiles: PSO Coated v3 (FOGRA51) and PSO Uncoated v3 (FOGRA52) from eci.org/en/downloads; standard ISO 12647-2 (iso.org/standard/57833.html); GRACoL/CRPC for US work (idealliance). Saturated screen accents (Spotify green, Mintos #34DE8D, magenta) sit outside the CMYK gamut, so they need a spot ink or a documented CMYK compromise.
2. **Paper stock.** Uncoated stock has more dot gain and duller, darker colour, and warm or recycled stocks shift neutrals. Off-white grounds on screen should be matched to the *house stock*, not the reverse. Sources: FOGRA52 characterisation data (eci.org), Pantone Formula Guide C/U pairs (pantone.com).
3. **Colour-vision deficiency.** This is a hard gap in a file about combinations. About 1 in 12 men and 1 in 200 women have CVD (colourblindawareness.org/colour-blindness/). WCAG 2.2 SC 1.4.1 Use of Color (w3.org/WAI/WCAG22/Understanding/use-of-color.html) forbids colour as the only signal. Red/green semantic pairs and Somerset's adjacent "pink #9f2241 / amber #cf3339" fail without luminance difference. Add a rule: accent pairs must differ in lightness, and check with a CVD simulator.
4. **Simultaneous contrast and the area effect.** The same accent looks different on white, off-white and near-black (Albers, *Interaction of Color*, 1963; interactionofcolor.com). Large fields also look more saturated and lighter than the swatch (the colour size effect; Xiao, Luo, Li et al. 2011, *Color Research & Application*, "Investigation of colour size effect for colour appearance assessment"). This explains *why* proportion rules exist, and it is missing from the proportion section.
5. **Monochrome + one accent in studios and foundries.** The file's examples are Uber, councils and fintech. Measure 5–6 studio and foundry sites the way the Uber chart was measured, e.g. pentagram.com, klim.co.nz, commercialtype.com, grillitype.com, abcdinamo.com, wearecollins.com. Record ground, ink, accent and where the accent appears (links, hover, specimen highlight). This is the pattern Kolkrabbi is actually choosing from.
6. **Colour in type specimens and on text.** WCAG 2.x ignores weight. Thin hairlines in a coloured or reversed specimen fail in practice while passing on paper. APCA (github.com/Myndex/SAPC-APCA) weights contrast by size, weight and polarity, which matters for a foundry showing Light/Thin cuts. Light-on-dark also looks bolder (irradiation), so reversed specimens may need a weight or tracking adjustment. Spot-colour text in print needs a minimum size and weight for registration.
7. **Campaign and seasonal extension rules.** Wrapped and Starbucks are described, but no extension *rule* is written down. Missing: what stays locked (mark, type, ink, ground) vs what rotates (accent, gradient); how many campaign colours; how they retire; how they are kept from becoming the core. Anchor it in Romaniuk's distinctive-assets work (already cited via Ward 2020) plus the Spotify Wrapped source.
8. **The Cadbury 2022 outcome and T-Mobile v Aio.** Both are positive precedents for precise deployment rules (see Wrong facts #3–4).

## MUST-FIX

1. Rewrite the proportion finding, the summary sentence and the ratio-models "60 = neutral" cell. The ground tier is the majority, but in Somerset and Calgary it includes brand colours. The capped tier is the least important one, not the most saturated. Downgrade to `common-practice` and note the four-guide selection.
2. Delete "every documented ratio caps the most saturated tier at about a tenth" (contradicted by Somerset Marine/Meadow at 25% and Calgary red/gold uncapped).
3. Cadbury: change "lost its purple registration" to "had its 2004 application refused (2013)". Cite a source for the December 2018 amendment refusal and the January 2019 surrender, and add the 2022 High Court ruling on the precisely worded new applications. Fix the case-table row to match.
4. T-Mobile: replace "sued AT&T" with "won a preliminary injunction against AT&T's Aio Wireless (S.D. Tex., Feb 2014)", and replace the WLRN source for that sentence with the Jones Day / RCR Wireless reports.
5. Glossier: say "preliminary (non-final) USPTO refusals, July/Aug 2019". Fix the table row and move it out of the court-outcomes framing, or label it as an office action.
6. Labrecque & Milne: read the paper and state its actual hue–trait findings, or downgrade the finding from `established` and lead with Gorn.
7. Neutrals / Material dark: strike "reduces eye strain" as a rationale, or flag it as unsupported with Piepenbrock et al. 2013. Keep the shadow/elevation reasoning.
8. Source or remove the unsourced meaning claims ("cool greys technical/clinical, warm greys editorial/print", "pastels soft and friendly", "off-white reads printed"). As written they contradict the file's own `contested` finding on meaning lists.
9. Split the two combination findings ("dark ground … exists because", "mid-luminance works best") into a computed-ratio fact (`established`) and a design rationale (`common-practice`).
10. Remove "a 10% tint of the accent … counts as neutral area" or attribute it. No cited guide says it.
11. Glasgow: add "in addition to the University blue of the banner", and CTA = University blue, to the finding and both tables.
12. Tiffany: drop "on boxes and bags since 1845". Only the Blue Book is dated to 1845 in the source.
13. Re-attribute "nascent" to Elliot (2015), and mark the Elliot & Maier (2014) quotes as unverified unless the paper is read.
14. Spotify green #1ED760: cite a source that actually shows the hex (the developer page only has an image). Re-cite Google 41 shades / $200M to Bowman 2009 and the Guardian 2014.
15. Add a **print** section: hex + CMYK (named FOGRA/GRACoL profile) + Pantone C + Pantone U per brand colour, and how stock affects it. Use Uber's mismatched Red RGB/HEX and blue-valued Orange CMYK as the cautionary example.
16. Add a **colour-vision deficiency** finding (WCAG 1.4.1, CVD prevalence, lightness difference between paired accents).
17. Add measured **studio/foundry mono + accent** examples (5–6 sites, same measurement method as the Uber chart). This is the reference set the palette decision actually needs.
18. Small fixes: Tropicana "within two months" and "sales" (not "unit"); Performable quote attributed to Poper, not "the team"; Louboutin "fell outside the limited mark" instead of "did not infringe"; Uber proportion text quoted ("important to follow the rules of these proportions") before the editorial reading.
