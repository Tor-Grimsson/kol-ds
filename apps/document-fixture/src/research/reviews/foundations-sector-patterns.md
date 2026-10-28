# Review — foundations/sector-patterns.json

Reviewed 2026-10-21 against live CSS (curl, desktop Chrome UA, homepage + up to 8 linked stylesheets), official guides, brandcolorcode.com and the cited press. Probe output is in the session scratchpad; nothing in the research file was edited.

## Verdict

**Usable with fixes.** The typeface column holds up well: 0 wrong typefaces in 50+ checks. Hex and confidence handling are weaker. Three hexes are wrong or unsupported (AstraZeneca, AWS, Cohere), three dated trend claims are wrong (the Saville quote is inverted, Deezer's year, Saint Laurent's "reversal"), and the summary's "verified" wording hides that most luxury and FMCG colours come from an aggregator. The per-sector counts are arithmetically right, but several summary-table labels claim more than the rows show. 14 must-fix items.

## Verified rows

✓ confirmed · ✗ wrong · ? unverifiable · ↑ the source is better than the label says (the row says aggregator, but live CSS carries the value)

| Sector | Brand | Claim checked | Result | Evidence |
|---|---|---|---|---|
| Dev tools | Vercel | theme-color #FAFAFA / #000, Geist | ✓ | live: both theme-color metas, `geist-sans` ×156 |
| Dev tools | GitHub | Mona Sans VF, color-scheme light dark | ✓ (type) · hex #000000 is aggregator-only | live: `MonaSansVF-wdth-wght-opsz`, theme-color #1e2327 |
| Dev tools | Linear | #08090a, data-theme dark, Inter Variable | ✓ | live: `InterVariable.woff2` |
| Dev tools | Supabase | #3fcf8e, Source Code Pro, Manrope | ✓ | `--color-brand-900:#3fcf8e` |
| Dev tools | Cloudflare | #f6821f, theme #ff4801, STK Bureau Sans + Kunst Grotesk | ✓ | `kumo-brand:#f6821f`, STKBureauSans-Regular.otf |
| Dev tools | AWS | #FF6200 orange, #161D26, Amazon Ember | ✗ orange · ✓ ink + type | #FF6200 is not in live CSS. The live orange is #FA6F00 (×44), and the long-standing AWS "smile" orange is #FF9900. #161d26 ×334, Amazon Ember ×629 |
| Dev tools | GitLab | #FC6D26, GitLab Sans + Mono | ✓ ↑ | #fc6d26 ×22 in live CSS |
| Dev tools | Docker | #1D63ED, Inter + Repro | ✓ ↑ | #1d63ed in live CSS |
| Fintech | Stripe | #635bff, sohne-var | ✓ | live + brand-assets page (#635bff ×14). Aggregator #5167FC is absent |
| Fintech | Monzo | #ff4f40, theme #112231, Maison Neue files | ✓ | `--color-brand:#ff4f40` |
| Fintech | Klarna | #FFA8CD, Klarna Text / Title | ✓ | `colors-bg-brand:#FFA8CD` ×16 |
| Fintech | HSBC | Univers Next for HSBC | ✓ | `universnextforhsbc-*.woff` |
| Fintech | Chase | #005EB8, Open Sans | ✓ ↑ | #005EB8 ×104 in live CSS |
| Fintech | Wise | #9FE870 / #163300 | ✓ ↑ | both live (×56, ×118) |
| Fintech | PayPal | #012169 theme, #053782, PayPal Pro | ✓ | PayPal Pro Text VF ×34, PayPalProSWeb |
| Fintech | Robinhood | Nib Pro Display + Capsule Sans + Phonic | ✓ | all three in CSS |
| SaaS | Salesforce | #0176d3, Salesforce Sans | ✓ | ×45 / ×40 |
| SaaS | HubSpot | theme #FF7A59, HubSpot Sans + Serif | ✓ | |
| SaaS | Zoom | #0b5cff | ✓ | ×147 |
| SaaS | Figma | btn-primary-bg #000000, figmaSans | ✓ | |
| AI | Anthropic | clay #d97757, #faf9f5, Anthropic Sans/Serif | ✓ | theme-color #141413 |
| AI | Mistral | #FA500F, ALT Mistral, #fbfbf8 | ✓ ↑ | #FA500F ×115 in live CSS. The row labels it aggregator |
| AI | Cohere | blue #0032FF, Unica77 Cohere | ✗ colour · ✓ type | #0032FF is absent from live CSS. The top live hues are #4C6EE6, coral #FF7759 and lilac #D18EE2, so "blue-led" is not supported |
| Pharma | Roche | #0b41cd, Roche Sans + Serif | ✓ | |
| Pharma | AstraZeneca | #8A0051 mulberry, Lexia | ✗ hex · ✓ type | live CSS has **#830051** ×53, and #8A0051 appears nowhere. `lexia` ×522 |
| Pharma | Sanofi | #7A00E6, Sanofi Sans + Serif | ✓ ↑ | #7a00e6 in live CSS |
| Pharma | Novartis | #0460a9, Volta Modern Display | ✓ ↑ | `volta_modern_display*` ×384 |
| Pharma | NHS | #005EB8 official | ? | identity page returned 202 with an empty body |
| Gov | GOV.UK | #1d70b8, GDS Transport | ✓ | theme-color #1d70b8 |
| Gov | USWDS | #005ea2 | ✓ | theme-tokens page |
| Gov | gov.sg | #D90000, Inter | ✓ | |
| Gov | Ísland.is | IBM Plex Sans | ✓ | |
| Museums | MoMA | MoMA Sans + Condensed, theme #FFFFFF | ✓ | |
| Museums | Whitney | Haas Grotesk Text + Sign | ✓ | |
| Museums | V&A | Spiller VF superfamily, theme #1f1f21 | ✓ | Upright / Serif / Contrast / Rounded / Width VF files |
| Museums | Tate, Stedelijk, Rijksmuseum, Guggenheim, Cooper Hewitt | house or licensed families | ✓ | Tate regular, Union ×50, RijksText, Guggenheim Sans ×61, CooperHewittDisplay |
| Museums | Louvre | EB Garamond + Montserrat + LouvreSerif, theme #000 | ✓ | |
| Museums | Centre Pompidou | #0078C2, Univers Next | ? | the curled page links no stylesheets, so neither value appears |
| Universities | Harvard | #A51C30 | ✓ | theme-color #a51c30 |
| Universities | MIT | #750014, Neue Haas Grotesk | ✓ | brand.mit.edu |
| Universities | Cambridge | #8EE8D8, #133844, Pantone 7471, --primary #6BBBAE | ✓ | |
| Universities | Stanford | #8C1515, Source Sans 3 + Edict | ✓ ↑ | #8c1515 in live CSS |
| Universities | ETH | #007894, DINPro | ✓ | |
| Agencies | Pentagram, Collins, Koto, Wolff Olins, Droga5 | type + theme-color | ✓ | Plain-*, Graphik + Portrait, gt-kotoheim(-mono), Monument-Grotesk + Untitled-Serif, DroteskNo5 |
| Luxury | Burberry | #0006cf, ff-serif | ✓ | ff-serif ×169 |
| Luxury | Prada | GT America, theme #000 | ✓ | |
| Luxury | Balmain | Balmain Sans, theme #000 | ✓ | |
| Luxury | Hermès | grounds #f6f1eb / #fcf7f1; orange #F37021 | ✓ grounds · ? orange | #F37021 is absent from live CSS (aggregator only, labelled as such) |
| FMCG | Coca-Cola | TCCC Unity + Aktiv Grotesk; #F40000 | ✓ type · ? hex | the hex is aggregator only |
| FMCG | Starbucks | SoDo Sans + Lander; #006241 | ✓ type · ? hex | |
| FMCG | Heinz, Oatly, Danone, Liquid Death | tokens + type | ✓ | #540b26, #fdcf85, #005eb8, Acumin Pro Condensed + Splash |
| Sports | Nike, Puma, NFL, FIFA, On | type / tokens | ✓ | Helvetica Now, FFDINforPuma, `nfl-primary:#013369`, FIFASans + #020F2A, On + On Diatype |
| Sports | adidas | adineue PRO | ? | 403 bot wall |

The aggregator values are transcribed correctly: I re-read brandcolorcode for AWS, Cohere, AstraZeneca, Hermès, Chanel, Cambridge, Stripe, Coca-Cola, Columbia and Yale, and every value matched. The problem is that the aggregator is wrong, not the transcription.

**Unlabelled aggregator hexes.** Every table cell is labelled. The finding prose is not: it quotes aggregator-only hexes as plain facts. Examples are AWS #FF6200, Atlassian #0052CC, Workday #3069B5, Asana #FF584A, Robinhood #CCFF00, Starling #7433FF, Perplexity #21808D, Hermès #F37021, Coca-Cola #F40000, McDonald's #FFCC00, Unilever #0F0E9A, Princeton #E77500 and Premier League #3D195B. The summary's "luxury black (8/10 verified)" is the worst case. Six of the 8 black values (Chanel, Dior, Gucci, Balenciaga, Celine, Bottega Veneta) are aggregator `#000000` only. Prada's black is an aggregator hex backed only by theme-color #000000, and Balmain's live theme-color #000000 is the only black with live evidence.

## Wrong facts

1. **Saville quote inverted.** The file says "In June 2025 Saville called the 2018 redesign a management mistake." Dezeen says the opposite: he called *replacing* his 2018 logo "a management mistake" and said "not wise … to forgo continuity". [dezeen.com/2025/06/13](https://www.dezeen.com/2025/06/13/burberry-logo-redesign-irresponsible-peter-saville/)
2. **Saint Laurent "reversal" is unsupported.** The cited Fashionphile page never mentions Vaccarello and says the YSL logo "has remained untouched". "Four houses have now reversed" should read three (Burberry, Dior, Chanel). [fashionphile](https://www.fashionphile.com/blogs/academy/the-remaking-of-saint-laurent/)
3. **Deezer is 2023, not 2022.** Koto's Deezer identity was revealed in November 2023. [Creative Review](https://www.creativereview.co.uk/deezer-koto-rebrand-graphic-design/), [designcompass 2023-11-10](https://designcompass.org/en/2023/11/10/deezer-rebrand)
4. **PayPal yellow.** It was dropped because it "duplicated other retail brands" (Pentagram), not for being "too close to Mastercard". The black wordmark, blue as accent, the distancing from fintech, LL Supreme → PayPal Pro and the date (Creative Review, 19 September 2024) are all confirmed. [pentagram.com/work/paypal](https://pentagram.com/work/paypal)
5. **AstraZeneca mulberry** is #830051, not #8A0051 (live CSS).
6. **AWS orange #FF6200** has no primary-source support. The live CSS orange is #FA6F00.
7. **Cohere is listed as blue-led (#0032FF).** Live CSS doesn't support it, and coral #FF7759 and lilac #D18EE2 are prominent. This changes "AI blue 2/9" to 1/9.
8. **The summary contradicts its own finding.** "Category-breakers … almost all changed colour and kept a clean sans" lists Mailchimp, whose break was Cooper Light, a serif (the file's own Mailchimp finding).
9. **Klarna quote.** "Our iconic Klarna Pink is going nowhere" is not in the cited Creative Review piece, which says "the Klarna pink remains untouched". "The most-recognised non-blue colour in BNPL" has no source.
10. **The pharma exceptions don't all "say outright" why.** A stated rationale is sourced for Sanofi (Transform) and GSK (Wolff Olins) only. AstraZeneca has no cited statement.
11. **Sports, "navy (leagues)".** Of the leagues, only the NFL is navy. The Premier League is purple, the NBA is unverified, and FIFA is a federation, not a league. "Usually a condensed or industrial grotesque" fits 1 of the 6 custom cuts (Puma DIN). NBA Action Condensed is retail, and adineue, FIFA Sans, Premier League, Formula1 and On are not condensed or industrial.
12. **"Heraldic" blue.** Cambridge's #8EE8D8 mint and ETH's petrol are called heraldic, while the same file documents that Cambridge left its crest colours.
13. **Minor dates.** MoMA Gothic dates to about 2003, not 2004 (type.today, NYT September 2003). The Rijksmuseum identity was unveiled in 2011 (the file's own Design Week source) and launched at the 2013 reopening. "2013" should say "2011, launched 2013".

**Confirmed trend facts:** FXC (16 July 2026: 144 brands, 63% blue in palette, 42% blue-primary, red next at 17%, half within 20 RGB units). Canva's Fortune 500 analysis (43% blue; insurance, health, finance, tech). 99designs (about 60% of tech logos, 14 August 2018). Dior's 1946 Cochin wordmark and Chanel's cursive signature (The Fashion Law, updated 7 November 2025). Balmain (Adulte Adulte, "first update in 80 years"). Instagram motion system (Creative Review, 13 March 2024, Studio Dumbar/DEPT). YouTube's first motion system (23 January 2026, in-house). Klarna refresh (6 February 2024, in-house, Colophon). OpenAI (6 February 2025, in-house with ABC Dinamo and Studio Dumbar/DEPT). Geist Pixel (6 February 2026, five variants; the blog post itself doesn't state the OFL licence).

## Count mismatches

The arithmetic matches the tables everywhere I recounted: 122 brands, 41 tech/AI/fintech, 7 serif companions, devtools 2/3/3/4/4, fintech 2/3, 1/9, 11/11, 5, SaaS 4/11, 3/10, AI 5/9, 3/9, 5/9, pharma 6/12, 9/10, 5/10, gov 6/7, museums 7/10, 9/10, universities 5/3/1, agencies 10/10, 3/11, luxury 8/10, FMCG 5/10, 7/8, sports 6/9, 4/9, dark-mode 8/16. The mismatches are in what each count is said to show:

| Claim | Problem | Recount |
|---|---|---|
| Museums "light ground 8/8 verified" | 4 of the 8 (MoMA, Rijksmuseum, Whitney, Guggenheim) rest only on theme-color, which the method calls "a hint only". The Louvre's theme-color #000 is discarded as unverified. | Same rule for all: 8/9 by theme-color, or 4/4 by body background |
| AI "tinted ground 5/9" | Runway (#0C0C0C) and Perplexity come from theme-color, and the Runway row says ground "unverified" | 3/9 on the file's own rule (Anthropic, Mistral, ElevenLabs) |
| AI "blue only 2/9" | Cohere isn't blue in live CSS | 1/9 |
| SaaS "custom 6/10" | Slack runs Salesforce Sans, a proprietary family, and isn't counted | 7/10, or define "custom" as the brand's own |
| Pharma "sans, mostly custom" | 5/10 is half, not most | "half custom" |
| Agencies "dominant colour: monochrome" | 0/11 agency colours are verified (every hex cell says unverified) | label "unverified (theme-colors neutral)" |
| Gov "blue (where verified)" | 2 of 3 verified are blue, and gov.sg is red | "blue 2/3 verified" |
| Luxury "8/10 verified" | 6 of 8 blacks are aggregator-only | "black 8/10 (6 aggregator-only)" |
| Dark-mode "8 of 16 dev and AI homepages" | 7 of the 16 (Resend, PlanetScale, Railway, Sentry, Netlify, PostHog, Cursor) are outside the 122-brand tables, and Anthropic counts as dark-only though its ground is ivory | say it's a separate convenience sample, or add the rows |
| Devtools summary "mono 3/9" | reads as monospace next to "mono companion 4/9" | "monochrome 3/9" |

## Mislabelled confidence

- **"Aggregator hexes are wrong often enough…" (established, n=2).** It is directionally right, and this review adds 3 more failures (AstraZeneca, AWS, Cohere). As written it rests on 2 checks, so it should be common-practice, or cite all 5.
- **"Colour hexes follow a strict source ladder" (established).** The file breaks its own ladder: at least 7 rows labelled aggregator have the value in live CSS (Mistral, Docker, GitLab, Chase, Wise, Sanofi, Novartis, Stanford), so live CSS was never checked for those. Fix the rows or drop the label to common-practice.
- **Monzo (established).** It rests on one UX Collective post, and the file itself says no official statement was found. Should be common-practice, with the account flagged as anecdotal.
- **Oatly (established).** The 50% sales figure is the agency's own award entry, unaudited (the file says so). Split it: the identity facts are established, the sales claim is contested.
- **Luxury reversal (established).** One of the four houses is wrong (Saint Laurent), and Dior and Chanel rest on a single source (The Fashion Law). Common-practice until a second source per house.
- **AI sparkle and gradients (contested).** The README defines contested as "evidence doesn't support". Fast Company and UX Collective do support the convergence, so this is common-practice.
- **Summary "clear colour codes".** Pharma blue at 6/12 and food warm at 5/10 are 50%, called "clear codes" from 10–12-brand convenience samples. Every sector finding is correctly common-practice, but the summary sentence presents them as settled.
- **Cooper Hewitt "passed 9,000 downloads".** The figure isn't checked against the cited page. Flag it or drop it.

## Missing — for a design studio or type foundry direction

1. **Type foundries as their own sector (n=0 today).** I probed 10 foundry sites this session. The pattern: the house typeface *is* the identity, the UI is black or white, and the specimen is the hero.
   - Grilli Type: GT Walsheim + GT Corporate, theme #000. [grillitype.com](https://www.grillitype.com)
   - Klim: Söhne + Martina Plantijn, theme #000. [klim.co.nz](https://klim.co.nz)
   - Lineto: Unica78 LL + Unica78 Mono, theme rgb(0,0,0). [lineto.com](https://lineto.com)
   - ABC Dinamo: own families served under obfuscated names, theme #fff. [abcdinamo.com](https://abcdinamo.com)
   - Colophon: CF Basis. [colophon-foundry.org](https://www.colophon-foundry.org)
   - Pangram Pangram: Neue Montreal. [pangrampangram.com](https://pangrampangram.com)
   - MCKL: Logic Monoscript. [mckltype.com](https://mckltype.com)
   - Displaay: sans, serif and mono tokens. [displaay.net](https://displaay.net)
   - Commercial Type and Optimo served no readable font-family to curl. [commercialtype.com](https://commercialtype.com), [optimo.ch](https://optimo.ch)
   - Needs a table plus a finding on how foundries show range (type testers, rotating specimens) without a brand colour.
2. **Independent design studios split from ad agencies.** The 11-row "agencies" table mixes ad networks (W+K, Droga5, Mother) with design studios. For a studio direction the peer set is design studios such as Order, Experimental Jetset, Studio Feixen, Bureau Borsche, Spin, Made Thought, Build, Hey and Walsh, along with the ones already in the table (Pentagram, Collins, Koto, Manual, Studio Dumbar, Base). Colour for that set is still unmeasured: every agency hex is "unverified", so body background and accent colour need measuring.
3. **Nordic studios and foundries.** Only Ísland.is represents the region. Peers for an Icelandic studio include Kurppa Hosk, Bleed, Heydays, Neue, Stockholm Design Lab, Snøhetta (design) and Kontrapunkt, and among foundries Playtype (Copenhagen) and Letters from Sweden.
4. **Logo type vs site type for studios.** The agency rows record web type only. Studio wordmarks are often custom lettering while the site runs retail type, which is the distinction the luxury section draws but the agency section doesn't.
5. **Studio-plus-foundry identity collaborations as a trend:** Koto + Grilli (GT Kotoheim), Instagram/OpenAI + Dinamo or Studio Dumbar, Klarna + Colophon, Pepsi + MCKL. The file has the examples but no finding on the studio–foundry pairing as a model, which is the direct template for a studio commissioning its own face.
6. **Licensing cost and terms** for a house face vs a retail licence vs an open licence (Cooper Hewitt OFL, Geist OFL). This is decision-relevant for a small studio and absent.

## MUST-FIX

1. Rewrite the Saville sentence: he called the 2023 *reversal* a management mistake, not the 2018 redesign.
2. Remove Saint Laurent from the reversals and change "Four houses" to three in the finding and the summary.
3. Change Deezer's year from 2022 to 2023 in the motion-first finding.
4. Replace "too close to Mastercard" with Pentagram's stated reason, "duplicated other retail brands".
5. Change AstraZeneca's hex to #830051 (live CSS) and relabel it.
6. Mark AWS orange as unverified, or replace it with live #FA6F00 labelled live CSS. Drop #FF6200 from the devtools finding.
7. Reclassify Cohere from blue to unverified or coral-led. Update "AI blue 2/9" to 1/9 in the summary, the sector-summary table and the AI finding.
8. Remove Mailchimp from the summary's "kept a clean sans" list, or reword the sentence.
9. Apply one ground rule (theme-color is a hint) consistently: recount museums 8/8 and AI 5/9, or state that theme-color counts and include the Louvre's #000.
10. Replace "luxury black (8/10 verified)" with "8/10, 6 aggregator-only". Label every aggregator hex quoted in finding prose with "(aggregator)".
11. Upgrade the 8 rows whose "aggregator" hex is in live CSS (Mistral, Docker, GitLab, Chase, Wise, Sanofi, Novartis, Stanford) to live-CSS sources.
12. Fix the confidence labels: Monzo → common-practice, the Oatly sales claim → contested, luxury reversal → common-practice, aggregator-error finding → common-practice (or cite all 5 failures), AI sparkle → common-practice.
13. Fix the sports and university wording: "navy (leagues)" → NFL only, "usually condensed/industrial" → Puma only, and drop "heraldic" for Cambridge and ETH. Fix the summary-table labels "mostly custom" (pharma), "monochrome" (agencies) and "mono 3/9" (devtools).
14. Add a type-foundry sector table and split independent design studios from ad agencies (see Missing 1–2), with measured grounds and accent colours.
