# Review: Cloudflare dossier, strategy layer

Reviewed 2026-10-22 against `src/research/brands/cloudflare.json`. Scope: the seven `strategy` answers (brand-idea, audience, brief, design-rationale, campaigns, off-screen, perception), the 25 files in `public/research/cloudflare/strategy/`, and source types across the whole file. The expression layer was reviewed and gated earlier; that review is in `_tmp/2026-10-22-reviews-before-strategy/cloudflare.md`.

The Allati El Henson Medium post was read from the Wayback Machine (`datePublished` 2020-10-30). Every Medium quote below was string-matched against that capture.

## Verdict

**Needs fixes.** The strategy layer is well researched. It goes far past the brand's own site: Allati El Henson's case study, Invision, Interface Office, Merca2.0, Fast Company and the 10-K. 33 of 37 checked quotes are verbatim. The problems:

- Two quotes are not verbatim. One is the brand-promise line that brand-idea rests on.
- One claim is attributed to the wrong source.
- brand-idea is marked `found` for an identity that is no longer the live one.
- The 2020 #BuiltForThis video has an agency credit the dossier missed. It sits in a transcript the dossier already cites.
- Five downloaded images are unreferenced. Two of them are the best evidence for claims made in the text.
- None of the 20 referenced strategy images is in `assetsIndex`.

## Verified claims

| Claim | Source | Result |
|---|---|---|
| "I conceived the creative concept based on our brand promise, boldly go. At its essence, this brand promise is about curiosity, innovation, performance, and adaptability." | El Henson, Medium (Wayback) | **Wrong (stitched).** The first sentence is real. The second is reworded from a later paragraph, which actually reads: "This creative direction is an interpretation of our brand promise: "Boldly go", which at its essence is about curiosity, innovation, performance, and adaptability." |
| "The dynamic linework symbolizes Cloudflare's network, scale, connection, protection, speed, energy, and enablement of Cloudflare's service." / "a clear representation of data being sent from one endpoint to another" | Medium | Confirmed |
| "first-ever foundational brand strategy", co-written with Rebecca Clayman | Medium | Confirmed. She completed work Clayman "had initially started before I'd joined". |
| Four principles, "scale like our globally distributed network", "tech company with a soul" | Medium | Confirmed |
| Star Trek nod | Medium | Confirmed ("If you're thinking of Star Trek…") |
| Five one-hour focus groups, "our core audience (technical users)" | Medium | Confirmed. The post calls it "our pay-as-you-go focus group". Enterprise testing moved to #BuiltForThis. |
| "did not capture the Cloudflare essence", "convince leadership", "a fraction of the amount of time, budget, and resources" | Medium | Confirmed |
| Logo deferred: "it wasn't the right time for a change of that caliber" | Medium | Confirmed |
| DesignStudio, NY (Medium) vs DesignStudio, SF (portfolio) | Medium; allati.co | Confirmed. Both spellings are on the record. |
| "two orange tones", "deep study and exploration", palette "salvageable", "I decided to add white" | Medium | Confirmed |
| Inter "born and bred for screens, open-source (free)"; "Rasmus Andersson the type designer who created Inter uses our products"; Noto Sans; system fonts "to ensure optimum performance" | Medium | Confirmed |
| "diagonal notched corners", Susan Kare; illustration "modular, adaptive, and performant" | Medium | Confirmed. The icon system was also "salvageable" from the DesignStudio round; the dossier only says that of the palette. |
| "neutral-lighting", "fear-based imagery of dark rooms or malicious hackers" | Medium | Confirmed |
| "seven-day turnaround", "keep the look and feel for our homepage" | Medium | Confirmed |
| El Henson role "Creative Director / Brand Strategist / Design Lead"; "Brand Strategist / Rebecca Clayman"; "DesignStudio, SF" | allati.co | Confirmed |
| Clayman: "it was all there. It just hadn't been surfaced yet and written down and brought to life." | Cloudflare TV, 18 Feb 2022 | Confirmed. "It" is the mission, personality, values and voice. |
| Clayman: "we decided to create a video to celebrate the Internet", "It was risky, but the response was overwhelmingly, almost entirely positive." | same | Confirmed. The same passage names an agency the dossier leaves out (see Strategy problems). |
| Rosenberg: "inconsistent in the way that we showed up in the world" / "Cloudflare the mature post IPO company was showing up in the world…" | Cloudflare TV Creative Corner | Confirmed. See the dating note under Strategy problems. |
| Content Style Guide: "Cloudflare is for everyone…", "This is the broadest audience group…", "We are principled… we mean that literally", contracted-customer roles, policymakers, "for everyone" dialled up at "event booths" | CSG 2025 PDF | Confirmed |
| 10-K: "an effective and differentiated marketing channel to expand the awareness of our brand" | 10-K FY2025 | **Wrong word.** The filing says "to **increase** the awareness of our brand". |
| 10-K: "enables millions of users…", ~332,000 paying customers, 4,298 large customers | 10-K FY2025 | Confirmed |
| Samuels: "And I think it's a lot about building a foundation of trust." | Cloudflare TV | Confirmed. The page header says "originally aired on August 13"; the intro says "March the 20th, 2026 edition". |
| #BetterInternet: "bold, provocative, and declarative", "do NOT look like polished, boring, corporate IT ads", "created fast and furiously by a team" | blog, 2 Oct 2018 | Confirmed |
| #BetterInternet was Cloudflare's "first paid brand campaign (blog, 2 Oct 2018)" | blog | **Not in the source.** The post says "starting to experiment with a new campaign" and "start testing this campaign in two US cities". "Primera campaña" comes from Merca2.0's headline. |
| Placements: wild postings, Muni bus wraps, Civic Center Muni takeover, SF billboards, Forbes takeover | blog image captions | Confirmed. The caption says "Forbes Takeover", not Forbes.com. |
| Campaign lines incl. "A FAST AND SECURE INTERNET IS YOUR RIGHT!" | blog images | Confirmed, but only in `2018-betterinternet-2.png`, which is not referenced. |
| Merca2.0: "diseñada junto con Transmission Agency", 1960s protest posters, "Cloudflare quiso convertir una cuestión técnica en un tema ciudadano", Pablo Petovel, 18 Nov 2025 | merca20.com | Confirmed. Merca2.0 gives no source for the Transmission credit. |
| Invision: "Working within Cloudflare's brand system…", "continuous LED stage", "nearly 1,500", NPS 76, pillars, ARIA, Sekou Andrews | iv.com | Confirmed. **The dates 13–16 Oct 2025 are not on that page**; they are unsourced. |
| Interface Office: "collaborated with Off-brand studio to ship a marketing site aligned with their modern visual identity refresh" | interfaceoffice.com | Confirmed. It is the Workers Platform launch site, 2025. No individuals or Off-brand link are credited. |
| Connect 2026: Moscone West, 19–21 Oct, "Don't just anticipate the future. Build it.", "Exclusive event swag", "Orange Cloud Theater", "The Frequency" | cloudflare.com/connect | Confirmed |
| "Paint the Town Orange", "large-scale Out-of-Home (OOH) advertising blitz…", "Timed alongside Connect", "Virtual OOH" | webhosting.today mirror | Confirmed on the mirror. Its Apply link goes to boards.greenhouse.io/cloudflare/jobs/8054093. |
| Fast Company: "a giant wall of 100 lava lamps", "kitsch effect", "a clever way to engage customers…", Prince "Nobody notices us…" and "…behind the scenes." | fastcompany.com (Wayback) | Confirmed. Published 18 Aug 2017, Katharine Schwab. |
| iTWire: "an amazing sight to behold", "a very subtle, understated building" | itwire.com | Confirmed (David M Williams, 6 Oct 2024) |
| notnotp: "It's partly marketing.", "not essential to the entropy generation" | notnotp.com | Confirmed (14 Jan 2026, no author named) |
| Buchman 2016: flare "responds to things in real-time", "really hard to reproduce on t-shirts, signs, stickers", capital F, orange and yellow, cloud logos common | blog, 27 Sep 2016 | Confirmed |
| Brand New: 29 Sep 2016, "One Piece of Flair", paywalled, "No Comments" | underconsideration.com | Confirmed |

## Wrong facts

1. **brand-idea (examples[0], answer):** the brand-promise quote is stitched from two places and its second sentence is not verbatim (see table).
2. **audience (examples[2], answer):** "expand the awareness of our brand" should be "increase the awareness of our brand".
3. **campaigns (answer, points[0]):** "Cloudflare's first paid brand campaign (blog, 2 Oct 2018)". The blog does not say this. The "first campaign" framing is Merca2.0's. The blog calls it an experiment being tested in two cities.
4. **campaigns (answer):** "Connect 2025 (ARIA, Las Vegas, 13–16 Oct 2025)". The dates are not on the Invision page, and no other source in the file gives them.
5. **off-screen (answer):** "The Q4 2026 'Paint the Town Orange' OOH push returns it to Bay Area streets" states a planned campaign as fact. The only source is an intern job post describing plans.
6. **brief, design-rationale (sources):** the Medium title says "Wayback capture 2 Nov 2020", but the cited URL is the live Medium link. Cite the Wayback URL that was actually read.

## Thin answers

- **brand-idea:** It answers for the 2020 system. The live identity is the 2025–26 orange #ff5e1f, STK Bureau Sans and Kumo. The answer admits "nobody has published a new brand idea for it", so how the idea is carried into today's design is unanswered. That is a `partial` with a gap, not `found`. "Their team sat under Jess Rosenberg" is inference; the post only thanks her "for the opportunity to lead this work".
- **audience:** Good on who. Thin on what each group should feel: only the "for everyone" and "bold" dial-ups and Samuels's "trust" are given. The Content Style Guide's per-audience guidance (what press, shareholders and policymakers need) is summarised by topic only.
- **campaigns:**
  - "Who made them" is missing for #BuiltForThis (agency missed, see Strategy problems) and for Birthday Week.
  - "How closely they follow the identity" is not assessed for Connect 2025. Invision's own images (`2025-connect-invision-*`) show magenta-to-blue gradients and an illustrated skyline. That is neither the 2020 linework system nor the 2025 orange/STK look, and the answer only repeats Invision's "within Cloudflare's brand system".
  - Birthday Week is named as a recurring format with no visual description. A source exists: Cloudflare TV, "Birthday Week 2024: Behind-the-scenes with Design" (4 Oct 2024). There Kari Linder, Principal Visual Communications Design Lead, says the in-house team does "all of the illustrations, the header illustrations for the blog posts", and "we always like to use light as a metaphor for technology".
- **off-screen:** No photograph of installed 2020 or 2025-identity work. The posters, T-shirt and wall are mockups, and the answer says so. The bus-wrap photo that proves the 2018 OOH claim was downloaded but not attached.
- **perception:** Correctly `partial`. Two of its four 2025 "reactions" are a one-line X post and an unaffiliated Medium post; they are not critique. Light Reading, "Designing with AI" (Rosenberg) and Wikipedia are listed as sources but not used in the answer.
- **brief:** "Redesigning CloudFlare (2015)" and the EmDash post are listed as sources but never used in the answer.

## Closable gaps

- **#BuiltForThis agency (campaigns, brief).** Clayman's Cloudflare TV transcript, already cited, says "We worked with an agency called HO Studios", "a sister agency of 72 and Sunny". That is almost certainly Hecho Studios, mis-transcribed by the auto-transcript. It is the only source; Hecho's site and press were searched with no hit. Add it with "single source, auto-transcript; likely Hecho Studios" wording.
- **2025–26 look (brief, design-rationale).** `2025-workers-platform-site-interface-office.webp` was downloaded from Interface Office's case study but not used. It shows the exact hero now on cloudflare.com: "Everything we learned from powering 20% of the Internet—yours by default", orange field, STK-style type. Also, workers.cloudflare.com now 301-redirects to cloudflare.com/products/workers/. So the Interface Office × Off-brand work is the strongest lead on who built the 2025–26 marketing-site language, though it is still one source. Say so in brief, and attach the image.
- **rebrand.gallery** lists "Cloudflare Rebrand 2025" as "In house" (no source, colour and type sections paywalled). It is weak, but it is the only outside attribution for the 2025 identity. Record it in the gap list as checked.
- **Birthday Week visuals (campaigns).** See Thin answers.
- Still not closable: a 2025–26 brief or rationale, design-press critique, and awards. Searched: Brand New, Fonts In Use, an STK/Smuss credit search, "Off-brand" studio (no website found), and the tjcages post on Interface Office (no credit). The dossier's gap lists stand.

## Asset problems

All 25 files open and render. Notes on the 20 referenced files:

- **`2020-pre-refresh-homepage.png` / `2020-post-refresh-homepage.png` are mislabelled.** They are not homepages. They are the brand collages captioned "Cloudflare pre-brand refresh" and "Cloudflare post-brand refresh" in the post's Conclusion: old palette, icons, booths and posters vs. refreshed posters, socks, T-shirt, booth wall and web comps. Rename them (`2020-pre-refresh-collage`, `2020-post-refresh-collage`) and describe them as such.
- **None of the 20 referenced strategy assets has an `assetsIndex` entry.** The index has 59 rows, none under `/strategy/`, so no strategy image carries a "what" or a source URL.
- `2020-refresh-cf-posters`, `-t-shirt-1` and `-wall` are mockups, and off-screen correctly says so.

**Downloaded but unreferenced:**

| File | What it is | Where it belongs |
|---|---|---|
| `2018-betterinternet-2.png` | Poster pair: "Impeach Latency", "Say No! to slow load times!", "A fast and secure Internet is your right!", #BetterInternet hand | campaigns: the only image carrying the line the answer quotes |
| `2018-betterinternet-6.png` | SF Muni trolleybus wrap ("The faster safer global cloud network") | campaigns / off-screen: the evidence for "Muni bus wraps" |
| `2020-refresh-cf-woman-working.png` | Photography with radiating linework | design-rationale (photography). 6.8 MB, 2928×1800: downscale before attaching |
| `2025-connect-invision-stage-3.webp` | Matthew Prince at Connect 2025, Athenian Project slide | campaigns (optional) |
| `2025-workers-platform-site-interface-office.webp` | Interface Office mockup showing today's cloudflare.com hero | brief / design-rationale (see Closable gaps) |

## Axis problems

Out of scope this round. Axes were gated with the expression layer.

## Strategy problems

- **Status strictness:**
  - **brand-idea** should be `partial`. Its idea and its "carried into the design" evidence describe the 2020 system; the live identity has none, by the dossier's own admission.
  - **campaigns** and **off-screen** hold `found` on agency and press sources, which is acceptable once the wrong facts above are fixed.
  - **audience** holds `found` (10-K, El Henson, CSG).
  - **brief**, **design-rationale** and **perception** are correctly `partial`.
- **Single-source agency credits are stated flat.** Each needs "single source" wording:
  - Transmission for #BetterInternet: Merca2.0 only, uncited, and absent from Cloudflare's post.
  - Off-brand studio: Interface Office only. The dossier's gap already says it is unconfirmed, but the answer text does not.
  - The proposed HO/Hecho Studios credit: Clayman transcript only.
  - DesignStudio is fine: El Henson names it in two places.
- **Dating the Creative Corner quotes.** Cloudflare TV "aired" dates are rerun dates. The same episode shows 4 Jan 2022 on one page and "originally aired on March 11, 2023" on the other. In the transcript Rosenberg says "we kicked it off last July, and we're just now launching the work, starting next week" and that she wanted "to kick this off a few months before going public" (IPO Sep 2019). So it was recorded around 2020, which fits the 2019–21 framing. Label it "recorded c. 2020, rerun Jan 2022", not "aired Jan 2022". El Henson is introduced there as leading design systems, not as creative director.
- **Stated vs interpretation:** kept apart well in design-rationale ("Outside interpretation (Kumo/2025–26): none published"). Two exceptions. brand-idea's paraphrase sits inside quote marks (Wrong facts 1). Campaigns says #BetterInternet "is far off the orange-and-white identity", which is the researcher's reading and should be marked as such.
- **Breadth:** good. Agency case studies (El Henson, Invision, Interface Office), local-language press (Merca2.0), business press, SEC filing. Missed: the Hecho/HO Studios credit, the Birthday Week design episode, and the rebrand.gallery "In house" listing.

## Source-type problems

Sampled 22 sources across the file.

| Source | Typed | Should be | Why |
|---|---|---|---|
| Cloudflare 10-K FY2025 (sec.gov) | reference | owned | The company's own statement. EDGAR only hosts it. As `reference` it reads as independent evidence, which it is not. |
| Brand Social Media Intern job post (webhosting.today) | owned | owned, but cite the Greenhouse URL | The cited page is a third-party mirror. Cite boards.greenhouse.io/cloudflare/jobs/8054093. |
| 60fps on X, "New @Cloudflare 🧡" | press | press (keep), label as a social post | A one-line post, not coverage. It cannot carry a "press verdict". |
| Medium @yusufmohd72, "Cloudflare Just Dropped a Bold Rebrand" | press | press (keep), label as a personal blog | Unaffiliated personal post, not design press. |
| Allati El Henson Medium + allati.co | agency | agency (OK) | She was in-house, but the README's `agency` covers "designers who made the identity". It is the only non-owned source under brand-idea. |

Correct as typed: Invision (agency), Interface Office (agency), Merca2.0, Fast Company, iTWire, Light Reading, Brand New, notnotp (press), Moscone listing, Wikipedia, Wayback CDX (reference), Clayman / Rosenberg / Samuels Cloudflare TV, Content Style Guide, brand guide pages, blog posts, Kumo repo (owned). Smuss Type Kiosk and Formula Type as `reference` are acceptable: they are foundry pages, not identity makers.

## MUST-FIX

1. **brand-idea:** replace examples[0] and the answer quote with the verbatim text. Either "I conceived the creative concept based on our brand promise, boldly go." alone, or the full sentence "This creative direction is an interpretation of our brand promise: "Boldly go", which at its essence is about curiosity, innovation, performance, and adaptability."
2. **brand-idea:** set status to `partial`. Add a `gap` saying no brand idea or concept has been published for the 2025–26 identity, listing where was searched (reuse brief's list). Drop "their team sat under Jess Rosenberg" or reword it as "thanked Jessica Rosenberg, Head of Creative & Brand Design, for the opportunity to lead".
3. **audience:** change "expand the awareness of our brand" to "increase the awareness of our brand" in examples[2] and the answer.
4. **campaigns:** remove "Cloudflare's first paid brand campaign (blog, 2 Oct 2018)". Write that the blog calls it an experiment tested in two US cities (SF, NYC), and attribute "first campaign" to Merca2.0. Fix points[0] the same way.
5. **campaigns:** state the Transmission credit as "per Merca2.0 only (no source given; not named by Cloudflare)".
6. **campaigns:** add the #BuiltForThis video agency: "Clayman (Cloudflare TV, 18 Feb 2022, auto-transcript): 'We worked with an agency called HO Studios', 'a sister agency of 72 and Sunny' — likely Hecho Studios; single source." Mirror it in brief if #BuiltForThis is mentioned there.
7. **campaigns:** source the Connect 2025 dates 13–16 Oct or remove them.
8. **campaigns:** add Birthday Week visuals from Cloudflare TV, "Birthday Week 2024: Behind-the-scenes with Design" (https://cloudflare.tv/event/birthday-week-2024-behind-the-scenes-with-design/9Zdod8aj, owned): in-house, Kari Linder, light as a metaphor for technology.
9. **campaigns:** say how Connect 2025 looks against the identity (magenta/blue gradients and an illustrated skyline, not the orange/STK system), and mark it as the researcher's reading. Mark "far off the orange-and-white identity" for #BetterInternet the same way.
10. **off-screen:** reword "Paint the Town Orange … returns it to Bay Area streets" as planned ("a Cloudflare job post describes a planned Q4 2026 OOH push"). In campaigns and off-screen, replace the webhosting.today URL with https://boards.greenhouse.io/cloudflare/jobs/8054093 (owned), or keep the mirror labelled as a mirror.
11. **brief:** state the Off-brand studio credit as single-source (Interface Office only). Add that Interface Office's image of the 2025 site shows the hero now live on cloudflare.com, and that workers.cloudflare.com redirects to cloudflare.com/products/workers/. Attach `/research/cloudflare/strategy/2025-workers-platform-site-interface-office.webp`. Add rebrand.gallery ("In house", unsourced) to the gap list as checked.
12. **brief:** relabel the Creative Corner sources as "recorded c. 2020 (rerun 4 Jan 2022 / 11 Mar 2023)", from the transcript's "kicked it off last July… launching next week" and "a few months before going public".
13. **brief, brand-idea, audience, design-rationale, campaigns:** point the El Henson Medium source URL at the Wayback capture actually read (a `web.archive.org/web/2020…/https://allati.medium.com/…` URL), not the live Medium link.
14. **design-rationale:** add that the icon system, like the palette, was "one of the salvageable elements" from the DesignStudio round. Attach `2020-refresh-cf-woman-working.png` for photography after downscaling it (it is 6.8 MB).
15. **Assets:** rename `2020-pre-refresh-homepage.png` and `2020-post-refresh-homepage.png` to `-collage` and update the brief's `assets`.
16. **Assets:** attach `2018-betterinternet-2.png` (campaigns) and `2018-betterinternet-6.png` (campaigns and off-screen). Attach `2025-connect-invision-stage-3.webp` to campaigns, or retire it to `_tmp/`.
17. **assetsIndex:** add one entry per strategy asset (all 20 referenced plus any newly attached), each with `what` and its source URL: Medium/Wayback, allati.co, blog.cloudflare.com/betterinternet-join-the-movement, iv.com, interfaceoffice.com.
18. **Source types:** retype the 10-K (all uses) from `reference` to `owned`.
19. **perception:** label the 60fps X post and the @yusufmohd72 Medium post as social and personal-blog reactions, not press verdicts. Remove sources the answer never uses (Light Reading, Designing with AI, Wikipedia), or use them.
20. **brief:** remove the unused sources "Redesigning CloudFlare (2015)" and the EmDash post, or cite them in the answer.
