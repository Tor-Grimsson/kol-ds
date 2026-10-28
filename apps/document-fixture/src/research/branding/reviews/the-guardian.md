# Review — The Guardian (2018 redesign)

Reviewed 2026-10-22 against `src/research/branding/brands/the-guardian.json`. Validator passes (14 found, 6 partial, 32 sources). Pages were fetched from the live URLs; The Drum, Design Week, Brand New and Karmarama came through the Wayback Machine. WebSearch was used up for the session, so the open gaps were tested against known URLs only.

## Verdict

**needs fixes.** The quoting is unusually clean. Every Breuer, Clarke, Viner, Chadwick and critic quote I checked is verbatim at its cited URL, and the D&AD Yellow Pencil is confirmed. The problems are elsewhere:

- Two important sources were left unchecked, and both change answers. Karmarama's case study is the agency's own account of the launch campaign, with results. Brand New ran a full review on 16 Jan 2018.
- One asset is mislabelled.
- The masthead credit and the dark-blue masthead claim go further than their sources.
- The caveat on the hex values is filed as "Our reading" and never reaches the palette entries.

## Verified claims

| # | Claim | Source | Result |
|---|---|---|---|
| 1 | D&AD 2018 **Yellow Pencil**, Crafts for Design / Typefaces, "The Guardian Headline and Titlepiece fonts" | dandad.org entry 26503. Embedded data: `"awardType":"YELLOW"`, `entryCategory.name: "Crafts for Design / Typefaces"`, `year: 2018` | confirmed |
| 2 | D&AD credits: Barnes, Ripper (type designers), Karpow (type engineer), Record (director of font technology), Breuer (ECD), Clarke (deputy CD); design agency "The Guardian" | D&AD embedded `credits` | confirmed |
| 3 | D&AD entry text: "reduce headline size, maintain character and legibility across all weights were key drivers… warmth and freshness" | D&AD | confirmed |
| 4 | Breuer: "driven by the opportunity to reduce both logistical and production costs" | Design Museum Q&A | confirmed, verbatim |
| 5 | Breuer: "to challenge all preconceptions. To really explore what The Guardian in print means for our readers" | Design Museum Q&A | confirmed |
| 6 | Breuer: "from one that reflected our internal structure to one that reflects the way our readers use the site and app" | Design Museum Q&A | confirmed |
| 7 | Breuer: "urgent, inclusive and bold" (his answer when asked for words describing the new brand identity) | Design Museum Q&A | confirmed |
| 8 | Breuer: "shift our core colour language away from journalistic tone … simple five colour system" | Design Museum Q&A | confirmed |
| 9 | Breuer: "there was no iphone … crafted for the newspaper and then subsequently applied" | Design Museum Q&A | confirmed |
| 10 | Breuer and Clarke: "We had to start from scratch", the reader dummy "in about a week", "the format didn't feel alien" | magCulture, Jeremy Leslie, 15 Jan 2018 | confirmed |
| 11 | Breuer and Clarke: "try some crazy things. Some of which didn't survive but the extra reach has left us with and exciting new Guardian" (source typo kept) | magCulture | confirmed |
| 12 | Masthead "hand drawn from a high contrast version of the bold weight of Guardian Headline"; type by Ripper and Barnes | magCulture | confirmed, but who drew it is not stated (see Wrong facts) |
| 13 | Clarke: "obnoxious yellow highlights, which subsequently now plagues…" | magCulture, *At work with Chris Clarke*, 11 Oct 2021 | confirmed |
| 14 | Viner: "thoughtful, progressive, fiercely independent and challenging; and also witty, stylish and fun"; clarity and imagination as "guiding principles"; "zing"; new.guardian@ address | Viner, 15 Jan 2018 | confirmed |
| 15 | Viner essay: "uncynical, unsnobbish, on people's side"; "We must build hope"; Scott Trust "in perpetuity"; "funded more by our readers than by our advertisers" | Viner, 16 Nov 2017 | confirmed |
| 16 | GNM release: "space for big ideas, for debate…", "enhanced use of photographic journalism and graphics", 150m browsers, 800,000 supporters | GNM press office, 14 Jan 2018 | confirmed |
| 17 | 13 Jun 2017: Trinity Mirror printing, £80m presses, about 50 roles, £57m → £38m losses, 154,000 vs 341,000, Pemsel "three-year transformation plan" | Guardian, 13 Jun 2017 | confirmed |
| 18 | Chadwick: yellow "Adverse response was significant, and usage is being cut back"; about 2,400 responses; "used judiciously"; "simultaneous reading" | Chadwick, 29 Apr 2018 | confirmed |
| 19 | GNM operating profit £800,000 in 2018/19 | Guardian, 7 Aug 2019 | confirmed |
| 20 | Endline "This is the Guardian. Space for big ideas." (Drum version); "a space for big ideas" (It's Nice That transcript) | The Drum 12 Jan 2018 (Wayback); It's Nice That 12 Jan 2018 | confirmed. The two transcriptions differ; the dossier notes this. |
| 21 | Film: white box floats over political visuals; voiceover by Maxine Peake | The Drum 12 Jan (Wayback) | confirmed |
| 22 | Terry Watson "somehow safe", "What it isn't any more is distinctive"; roundel "forcibly squashed"; Warren Johnson "minimal marketing support"; Lee Fasciani "stronger and more confident" | The Drum 15 Jan (Wayback) | confirmed |
| 23 | Anthony Cox (Dragon Rouge): "doesn't stand out on the newsstand anymore", "a tad solemn", "subdued salmon" | Transform | confirmed |
| 24 | Transform: promo video "developed by … Karmarama" | Transform | confirmed |
| 25 | Mario Garcia: "youthful blue, all lowercase logo", "not very contemporary" | GXpress, Jan 17 2018 | confirmed |
| 26 | Design Week: Breuer "bold new masthead represents…"; text font kept with size and spacing changes; Observer Magazine "photo-reportage"; reader comments on WCAG contrast and horizontal rules | Design Week (Wayback) | confirmed. Also confirms Ben Longden as digital design director. |
| 27 | Pillar hexes C70000, C74600, 0077B6, 866D50, BB3B80; brand 052962, brandAlt FFE500, 121212; GH/GT/GuardianTextEgyptian/GuardianTextSans stacks | unpkg `@guardian/source-foundations@16.0.0` tokens.js | confirmed. npm registry: package created 2021-10-07, **v16.0.0 published 2024-05-13**. |
| 28 | Wordmark SVG fills: 2005 `#0a5787`/`#a2c0d8`, 2018 `#121212` | Local SVGs from Wikimedia | confirmed |
| 29 | Style guide: Aristotle epigraph, "illegal asylum seeker", full points rule, Bryson jargon line | guardian-style-guide-a / -j | confirmed |
| 30 | The Sun front page: "into our tabloid club … £1.50 cheaper" | Guardian, rivals respond | confirmed |
| 31 | Guardian Egyptian by Christian Schwartz and Paul Barnes, made for Mark Porter | Commercial Type catalogue (Wayback, Dec 2019) | confirmed |
| 32 | Creative Review (Rachael Steven): "what started as a print project soon became something much larger" | Creative Review (intro, before the paywall) | confirmed |

## Wrong facts

1. **The masthead was not shown to be drawn in-house.** magCulture says only that "the new masthead [was] hand drawn from a high contrast version of the bold weight of Guardian Headline". It does not say who drew it. Three places say more than that:
   - `logo.summary`: "hand-drawn by the in-house team"
   - `pitch.points[4]`: "the in-house team evolved the final masthead from it"
   - `typefaces[1].role`: "masthead hand-drawn from it in-house"

   The name "Guardian Titlepiece" for that high-contrast cut comes from the D&AD board, not from magCulture.
2. **The dark-blue masthead switch is overclaimed.** The only source is a readers' letters page dated **Sun 15 Jul 2018**, not 16 Jul. One reader notes a dark-blue masthead "Five days in succession (10-14 July)" and asks whether it is "really here to stay". That does not show a permanent switch "in July 2018". The claim appears in `logo.summary`, `logo.points[5]`, `reception.summary` ("the masthead turned dark blue by July") and `palette[Guardian navy].role`.
3. **One quote is stitched from two sources.** `insight.points[6]` credits "the problem of disaggregation…" (Design Museum, Breuer) and "lost in the back of the paper" to Breuer alone. The second phrase is Breuer and Clarke in magCulture.
4. **One quote was silently corrected.** `imagery.points[1]` has "interupting". magCulture reads "interutping". Minor, but verbatim quotes should keep the source text or mark [sic].
5. **The Drum's wording is credited to Watson and Cox.** `elements.points[2]` says Watson and Cox "describe the stock as a 'pink wash'". "Pink wash colour" is The Drum's paraphrase of Watson. Cox said "subdued salmon".
6. **The launch answer leaves out the campaign.** `launch.points[5]` quotes Warren Johnson's "minimal marketing support" as the rollout critique, and nothing answers it. Karmarama's case study describes an integrated campaign: out-of-home in city centres, mobile-first digital, social video, then a second phase of direct and subscription-driving media.

## Status problems

- **launch (found):** found is earned, but the answer is incomplete without the Karmarama campaign (see Closable gaps).
- **pitch (partial):** stays partial for the identity routes. The launch proposal now has a source. Karmarama: "Rather than position The Guardian and its new tabloid format as a physical product, we would position it as a rare and much needed space. A space for hope, for truth, for imagination". The gap text ("Karmarama's own case study … was not found") is now wrong.
- **motion (partial):** stays partial, since there is no sonic or motion system. The film's device is now explained by its maker: "a simple white space, sized the same as the new tabloid", placed "on top of a range of provocative and timely topical backgrounds". Replace the "Our reading" point with this, and fix the gap text.
- **positioning (partial):** could move to found. Karmarama's challenge statement is an outside positioning statement: the Guardian as "an independent, challenging voice in a media sea of fake news, knee-jerk reactions and corporate agendas", representing "an alternative way of thinking, that combined clarity and imagination". Brand New adds the competitive read: the new covers "blend in more with other publications".
- **colour (found):** acceptable as found for the system, because Breuer states the five-pillar logic. The values are not 2018 material, so a caveat must sit on them (see below).
- **reception (found):** earned, but it leaves out the only reviewed verdict in the design press (Brand New) and the only campaign results (Karmarama).

## Website-not-branding problems

- **colour / palette:** nine of the 11 palette entries are sourced to `@guardian/source-foundations@16.0.0`. That is digital product code, published to npm in May 2024, six years after launch. The caveat exists, but:
  - it is filed as "Our reading" in `colour.points[6]`, when it is a sourcing caveat, not an interpretation;
  - none of the `palette[].role` strings carry it.

  Anyone reading the palette alone will take #C70000 and the rest as 2018 launch colours. Nothing in the 2018 material (GNM release, D&AD boards, Design Museum, magCulture) gives values. The summary sentence ("Hex values below are from the Guardian's later public Source design-system tokens") is right but does not name the 2024 date.
- **type.points[6]:** Source font-family stacks are web CSS, not brand typography. They are fine as supporting evidence but should not count toward the answer.
- **guide:** relies on the npm tokens as "the public pieces". Acceptable, since the answer says no brand book is public. Label it as the digital design system, not a brand guide.
- **elements.points[5]:** "stacks of thin horizontal rules divide sections online" comes from a reader comment about the website. Keep it only as a reader observation.

## Closable gaps

Every URL below was fetched and read.

| Answer | Source | What it adds |
|---|---|---|
| pitch, core-message, motion, launch, reception, positioning | **Karmarama case study**: `https://web.archive.org/web/20191120231748/https://www.karmarama.com/work/the-guardian/` (live URL now redirects to Accenture Song). Type `agency`. | Challenge statement; strategy ("position it as a rare and much needed space. A space for hope, for truth, for imagination, and more"); the white-space motif "sized the same as the new tabloid"; media plan (city-centre out-of-home, mobile-first digital, social video, a second phase of direct and subscription media); results ("despite January being a seasonally difficult time for print sales, and despite category wide decline, sales increased. We also recorded a record level of subscription acquisitions in the first quarter of the campaign"; "halo effect" on reader contributions). These are self-reported agency claims: label them as such. |
| reception, logo, elements, positioning | **Brand New**, Armin Vit, "Don't Stop the Presses", reviewed 16 Jan 2018: `https://www.underconsideration.com/brandnew/archives/new_masthead_for_the_guardian.php` (full text in the Wayback snapshot of 19 Jan 2018). Type `press`. | Verdict: the masthead "ups the gravitas with a very elegant, serious, and business-minded serif … It looks pretty fantastic and has a strong, confident presence". On the old logo: "the all lowercase approach made it feel less serious than it was". Roundel: the new 'G' has "a stencil design that is nowhere to be seen in any of the print or online applications". Cover: lost "the thick blue bar, which was perhaps its most distinctive asset … they also blend in more with other publications". Overall: "the change is positive". |
| type | Commercial Type has **no Guardian Headline page**. `commercialtype.com/catalog/guardian_headline` returns the catalogue shell, and there is no Wayback capture. It is a custom face, not a retail one. | Record this in the gap. The current catalogue URL also fails to render; the Wayback copy (`…/20191207200643/https://commercialtype.com/catalog/guardian_egyptian`) confirms "designed for Mark Porter and the Guardian", Schwartz and Barnes. |
| guide | `theguardian.design` is a client-rendered zeroheight site and returns no content without JS. No Wayback capture was retrievable (the archive was briefly offline). | Still unverifiable. Record it as checked-but-unreadable, not "not opened". |
| imagery | Not closed. No photography guidance was found at any URL above. | — |

## Asset problems

- **`digital-homepage-pillar-nav.jpg` is mislabelled.** It is a photograph of the printed 15 Jan 2018 front page held in a hand, not a desktop homepage. It is used as the digital/pillar-nav asset in `audience` and `colour`, and its assetsIndex entry says "Desktop homepage, 15 Jan 2018, with pillar nav and kickers" (source Dezeen).
- All other 22 assets open and match their labels:
  - 12 D&AD boards: glyph set, numerals, three specimens, G poster, weights list, two posters, brand signifiers;
  - 7 print spreads;
  - 2 digital screenshots;
  - 2 SVG wordmarks (fills match the stated hexes).
- `print-g2-cover.jpg` matches the Tarana Burke / "Truth be told" / cyan description, but that description comes from the image, not from It's Nice That's text. `print-financial-spread.jpg` shows a photo-led spread; its red kickers are hard to see at this size. Neither is a blocker.
- No unindexed files. Every file on disk is in `assetsIndex`.
- Motion has no asset. A still of the white-box film would be useful if one can be sourced.

## Source-type problems

I sampled 20 sources:

- The design-press sources are correctly typed `press`: Design Museum, magCulture ×2, Creative Review, The Drum ×2, Design Week, It's Nice That ×2, Dezeen, Transform, GXpress, Creative Bloq. The designer interviews are typed `press`, which is acceptable.
- Correctly typed `owned`: the GNM releases, the Viner letter and essay, Chadwick, and the Guardian news reports.
- Correctly typed `reference`: Wikimedia and Wikipedia.

Problems:

- **D&AD** is typed `press`. That is acceptable as an award record, but the boards themselves are the Guardian's own entry material. Fine as is; noted only.
- **Commercial Type** typed `agency`: correct, it co-made the type.
- **`@guardian/source-foundations` tokens** typed `owned`: the type is correct, but it is product code (see Website-not-branding).
- **Guardian letters page** (`technology/2018/jul/15/…`) typed `owned`: it is reader correspondence, and it is the sole support for a factual claim. Type it `press` or drop it as evidence for the masthead change.
- **B&T** is listed in `reception.sources` but no point or example draws on it. Either use it or drop it.
- **There is no `agency` source anywhere for the campaign.** Karmarama should be added as `agency`.

## MUST-FIX

1. `assetsIndex` and the file:
   - rename `digital-homepage-pillar-nav.jpg` to `print-front-page-in-hand-15-jan-2018.jpg` and relabel it "Printed 15 Jan 2018 front page, photographed";
   - remove it from `audience.assets` and `colour.assets`;
   - use `digital-mobile-desktop-pillars.jpg` for the pillar navigation instead.
2. `logo.summary`: replace "hand-drawn by the in-house team" with "hand-drawn from a high-contrast cut of Guardian Headline's bold weight (magCulture; who drew it is not stated)". Make the same change in `pitch.points[4]` and `typefaces[1].role`. Credit the "Guardian Titlepiece" name to the D&AD board.
3. Dark-blue masthead:
   - change `logo.points[5]` to "A dark-blue print masthead ran 10–14 July 2018; a reader asked if it was 'really here to stay' (letters, 15 Jul 2018)";
   - remove "the masthead turned dark blue by July" from `reception.summary`;
   - remove the "print masthead went dark blue in July 2018" clause from `palette[Guardian navy].role`, unless a dated GNM or design-press source is found.
4. `insight.points[6]`: split the quote. Credit "the problem of disaggregation…" to Breuer (Design Museum) and "lost in the back of the paper" to Breuer and Clarke (magCulture), with magCulture added to that point's sourcing.
5. `imagery.points[1]`: keep the source spelling "interutping [sic]".
6. `elements.points[2]`: give "pink wash" to The Drum, paraphrasing Watson. Give "subdued salmon" to Cox.
7. Colour caveat:
   - move the hex-value caveat out of "Our reading" in `colour.points[6]` and into `colour.summary`, worded "values from @guardian/source-foundations 16.0.0 (npm, May 2024), not 2018 launch material";
   - append "(Source token, 2024)" to the `role` of every palette entry sourced to unpkg;
   - mark `type.points[6]` as digital/web stacks.
8. Add a source and use it across answers:
   - add the Karmarama case study as type `agency` (Wayback URL in Closable gaps);
   - `pitch`: add the "position it as a rare and much needed space" strategy and rewrite the gap;
   - `motion`: replace the "Our reading" point with Karmarama's "simple white space, sized the same as the new tabloid" and rewrite the gap;
   - `launch`: add the campaign media plan and second phase alongside the "minimal marketing support" critique;
   - `core-message`: credit the "space for" platform to Karmarama;
   - `reception`: add the sales and subscription claims, labelled as agency-reported.
9. `brand.agency` and `oneLiner`: name Karmarama as the launch-campaign agency, and Ben Longden's role (digital design director, per Design Week).
10. Add Brand New as type `press`, reviewed 16 Jan 2018, Armin Vit:
    - `reception`: add the masthead verdict and "the change is positive";
    - `elements` and `logo`: add the stencil-G roundel critique;
    - `positioning`: add the lost blue bar and "blend in more with other publications".
11. `positioning`: add Karmarama's challenge statement ("an independent, challenging voice in a media sea of fake news…"; "an alternative way of thinking, that combined clarity and imagination"). Upgrade to `found`, keeping "Our reading" separate.
12. `type.gap` and `guide.gap`, or a type point: record that Commercial Type has no public Guardian Headline page (custom face). Record that theguardian.design was checked and returns only a JS shell.
13. `reception.sources`: drop B&T or cite it in a point. Retype the July 2018 letters page `press`, or remove it once item 3 is done.
