# Review: Vercel dossier, strategy layer

Reviewed 2026-10-22 against `src/research/brands/vercel.json`. Scope: the seven `strategy` answers (`brand-idea`, `audience`, `brief`, `design-rationale`, `campaigns`, `off-screen`, `perception`), source types across the whole file, and the assets under `public/research/vercel/strategy/`. The expression layer was reviewed and gated earlier (old review in `_tmp/2026-10-22-reviews-before-strategy/vercel.md`), so axes and expression facts are not re-checked here.

I re-fetched every strategy source with curl using a browser user agent. Every.to renders client-side, so I checked it with WebFetch. Raw pages are in `_tmp/2026-10-22-review-vercel/`.

## Verdict

**Needs fixes.** The quoting is unusually clean: of about 70 quotes I checked across 30 sources, all but three are verbatim at the cited URL (the other three are a job-post paraphrase, a store tagline not found on the store, and a search-snippet attribution), and the Hacker News speculation is labelled as speculation. Five things still need fixing:

- One quote is attached to the wrong thing (the Ship 2025 "Too far, too shiny, and too loud" line).
- One claim about the campaign look is wrong.
- `design-rationale` is marked `found` but has no stated reason for the colour or the mark, and it leans on a search snippet.
- The agency that named Vercel is missing (Lexicon Branding).
- The `off-screen` gap says no event photography exists. Basement's own case-study pages have plenty.

## Verified claims

| # | Claim / quote | Source | Result |
|---|---|---|---|
| 1 | "strongly connects to the words versatile, accelerate, and excel"; "develop, preview, and ship their apps faster, and with confidence"; "11M JavaScript developers"; "This new identity aligns with our new focus"; "retain our signature triangle logo… simplified"; "Rebrand Field Book" | vercel.com/blog/zeit-is-now-vercel | Confirmed |
| 2 | "Vercel frees the world to ship what's next." | vercel.com/about | Confirmed |
| 3 | Basement: "Vercel is all about performance. Their brand had to match"; "precision, speed, and developer-first ethos"; "irregular glyphs and structural imbalances"; "cleaner geometry, improved balance, and optimized scalability"; author Natalia Martinez Lopez | basement.studio/post/scaling-vercel-… | Confirmed |
| 4 | Geist brief: "wanted a bespoke typeface that would resonate with their brand values", "integrate seamlessly into their visual identity", "fully functional type family that included a monospaced font… developer-centric audience", "embodies our design principles of simplicity, minimalism, and speed", "echo the greatness of legendary typefaces like", "angular strokes on specific terminals, elbows, and descender strokes", "late 2022", Swiss, "critics pointed out areas for improvement" | basement.studio/post/the-birth-of-geist-… | Confirmed |
| 5 | "a typeface specifically designed for developers and designers" | Basement "Birth of Geist" **and** vercel.com/font | Confirmed at both URLs. The answer's "(Basement)" attribution holds. |
| 6 | design.md: "Build confidence through clarity…", "Never manufacture confidence through hype…", "The target is Vercel judgment, not Vercel decoration", buyer list "executives, engineering leaders…", "precise, calm, direct, technically literate, evidence-led", "Use color only when it adds significant meaning", "Default to stillness" | vercel.com/design.md | Confirmed |
| 7 | Rauch: "capture the zeitgeist" sentence; "I care a lot about design"; "make things work in the real medium"; dated 4 Feb 2025 | every.to transcript | Confirmed via WebFetch: full transcript, not paywalled. The date is in the JSON-LD `datePublished`. |
| 8 | Contrary: "front-end developers working at agencies, SMBs, and enterprises", JS/TS focus, "land-and-expand product-led growth", "100K new sign-ups each month in 2024", "three distinct design teams"; updated 16 Jan 2026 | research.contrary.com/report/vercel | Confirmed |
| 9 | Job post: "Vercel is the agentic infrastructure company…", "millions of developers worldwide", "Help shape a brand that moves as fast as the platform it represents", "Build and evolve a brand system that scales without going stale" | Greenhouse 5579560004 | Confirmed |
| 10 | Job post scope "print, events, and swag" (off-screen) | Greenhouse 5579560004 | **Not verbatim.** The page says "print, events, environments, and the occasional piece of swag" and "web, motion, 3D, social, print, swag, and environments". Paraphrase shown as a quote. |
| 11 | Next.js logo: "We looked for high legibility and contrasting presence"; "We spotted a retro-futuristic direction right from the start" (Jose Rago, Co-Founder); Steve Jobs and Paul Rand; "To maintain its competitive edge…"; "hard to read in small sizes" | basement.studio/post/nextjs-logo-redesign.md | Confirmed |
| 12 | "Geist Pixel isn't a novelty font. It's a system extension" (Evil Rabbit, 6 Feb 2026) | vercel.com/blog/introducing-geist-pixel | Confirmed |
| 13 | Ship 2025: "the right intersection of motion, magnetism…"; trypophobia; credits Genny Dee, Daniel Linthwaite, Yav Punchev, James Clements, Matias Gonzalez Fernandez | vercel.com/blog/designing-and-building-… | Quotes confirmed. "Too far, too shiny, and too loud" is **misattributed**; see Wrong facts. |
| 14 | The Register: "daringly stroked itself with the rebrando-brush", "audaciously combines the words versatile, accelerate and excel", "The product previously called Now will now not be Now…" | theregister.com 2020/04/22 | Confirmed |
| 15 | Hacker News: "2020 Toyota Vercel" (ltrcola), "lame web 1.0 thing" (deltron3030), "unseen-since-Qwikster proportions" (crousto), "products and design" (mtm7), "super common German word" (jkrems, who opens with "Pure speculation"), "built their brand off the backs of people…" | news.ycombinator.com/item?id=22933479 | Confirmed. Usernames match. The last quote is RonanTheGrey's. "An early ZEIT user" is the researcher's description, not something the thread states. |
| 16 | Pimp my Type: "contemporary take on Helvetica, but with more personality", "gorgeous in larger text sizes", "performs poorly in sizes below 16 px", "there are no italics" | pimpmytype.com/font/geist | Confirmed |
| 17 | Made Good Designs: "the absence of one", "The austerity is the message", play button / deploy arrow / stylised V; 29 Aug 2026 | madegooddesigns.com/vercel-brand-guidelines | Confirmed. Byline is "Editorial Team" (author slug `web-admin`); see Source-type problems. |
| 18 | Rauno Freiberg: "we struggle a lot with consistent quality, as do most companies of our size" | spaces.is/loversmagazine/… | Confirmed |
| 19 | Ship 2024: "Nearly 1,000 people gathered in NYC…", by Morgane Palomares | vercel.com/blog/vercel-ship-2024 | Confirmed |
| 20 | Basement Ship 2024: team credits, "projection mapping, stage design, and creative direction", "From badges to posters and collaterals…" | basement.studio/showcase/vercel-ship-a-home-for-innovation.md | Confirmed |
| 21 | Basement Next.js Conf 2024: "From the website to live production, stage design, motion, and collaterals"; Awwwards Developer Award and SOTD; "3.5M downloads just on Google Fonts" | basement showcase .md pages | Confirmed |
| 22 | Next.js Conf 2022 on 25 Oct; "Today we also unveiled the new logo… bolder and stronger than ever" | vercel.com/blog/nextjs-conf-2022 | Confirmed |
| 23 | Next.js Conf 2022 in-person viewing in San Francisco, London and New York | vercel.com/blog/nextjs-conf-2022 | **Unverifiable at the cited URL.** None of the three cities appear on the page. |
| 24 | The Midway: 24 Oct 2024, 1,000+ in person, "expertly produced by Set Creative"; 2025 edition on 22 Oct | corporate.themidwaysf.com (both pages) | Confirmed. Both pages fetch fine with a browser user agent. |
| 25 | Ship 2025 at The Glass House, 24 Jun; Ship: SF on 15 Oct 2026 | uniform.dev; community.vercel.com meetup | Confirmed |
| 26 | Basement 2020–23 "from minor feature releases to major keynote events" | 2022.basement.studio/showcase/vercel | Confirmed (the page reads "keynote events"; the answer says "keynotes") |
| 27 | Store: VRC Quilted/Unlined jackets $325, Pit Crew Jumpsuit $200, chore coats $265, Origin Tee Burst/Fluid $40, Origin Cap $30, $15 prints incl. Geist Racing Club Print; most apparel sold out | vercel.store | Confirmed |
| 28 | vercel.store tagline "Agentic Infrastructure for Commerce." and "running on Vercel's open-source Shopify storefront" | vercel.store | **Not found.** The page title is "Objects of Craft, by Vercel". Neither claim appears on the page. |
| 29 | Community swag: "representative of the 'minimal' Vercel brand vibes" (Riz) | community.vercel.com/t/…/8681 | Confirmed |
| 30 | Evil Rabbit's influences are Müller-Brockmann, Carson and Ive ("Indent interview, via search; page now offline") | none fetchable | **Search-snippet attribution.** No live URL backs it. It must go. |

## Wrong facts

1. **campaigns: "Too far, too shiny, and too loud" was not said about a spiky version.** According to the Ship 2025 post, the spiky ferrofluid was dropped because it "triggered symptoms of trypophobia". The team then explored "full-spectrum color, oil-slick vibes, and even a callback to our prism", and *those* explorations were "Too far, too shiny, and too loud". The quote describes the colour detour.
2. **campaigns: "All of it stays on-identity: black field… colour enters only as light" is wrong for Next.js Conf 2024.** Basement's case-study images show a saturated blue system: a blue "Next.js C24" mark, a blue "Next.js CONF24" exterior sign, blue speaker cards and a blue pixel "NEXT". Ship 2024 is monochrome but has its own broken-type "S'HIP" system. See https://basement.studio/showcase/nextjs-conf-raising-the-bar-again (images `…/4775ebc5…`, `…/a8ded49a…`, `…/ba5a5235…`).
3. **brief: "Vercel never published a trademark reason" is incomplete.** Lexicon Branding, which developed the name, lists its naming criteria: short, works globally, easy for developers to type, **legally available**, comes with a domain. Its rationale ("strongly connects to the words versatile, accelerate, and excel") is the same line Rauch's post uses. https://www.lexiconbranding.com/vercel-rebrand/ (22 Apr 2020, updated 16 Apr 2024, by Jon Schleuning). The Die Zeit theory is still speculation, but "legally available" is a stated requirement.
4. **off-screen gap: "Basement case-study pages carry no images" and "The Midway recap pages block fetching" are both false.** Only the `.md` versions lack images. The HTML pages have about 12 images each at 3840×2160, among them Ship 2024 stage shots, posters on a wall and a lanyard badge, plus the Next.js Conf 2024 exterior sign and badge. The Midway pages fetch with a browser user agent, and `campaigns` already quotes one of them.
5. **off-screen: the job-post quote "print, events, and swag" is not verbatim** (see #10 in Verified claims).
6. **off-screen: the vercel.store tagline and the "open-source Shopify storefront" claim** are not on the cited page (see #28).
7. **campaigns: London and New York viewing for Next.js Conf 2022** are not on the cited page (see #23). Find a source or cut it.

## Thin answers

- **design-rationale**: of the five choices the ask names (mark, colour, typeface, imagery, motion), only typeface has a stated rationale. Colour and motion are documented as rules ("Design in monochrome", "Default to stillness"), not reasons. The triangle's meaning is "never published". That is `partial`, not `found`. The point "ZEIT-era gradient fill dropped for flat solid" sits in the stated list but no cited source states it; it is the researcher's reading of archives. It also leaves out that the Ship 2025 visuals came from "a model" the team trained "to output consistent lighting, form, and material". That AI-generated imagery is a stated production choice.
- **brand-idea**: the synthesis is honest ("assembled from three statements"). The closing line "In design terms the idea is carried by absence" is the researcher's interpretation and is not labelled. The only press source carrying the reading is Made Good Designs, which is weak (see Source-type problems).
- **audience**: "Prioritisation is bottom-up: the developer is won first through open source… the enterprise buyer second" is inference with no source. Contrary's PLG line supports the first half only. Either cite it or label it as the researcher's read. One HN reply ("built their brand off the backs…") is presented as how "developers" feel. That reads one comment as a constituency.
- **campaigns**: no mention that Next.js Conf has its own blue sub-identity, or of the Ship 2024 type system. Both are visible in the agency sources already cited.
- **perception**: uses the Basement Geist showcase (agency self-report: "the response has been loud") as perception evidence. That is the agency's view, not an outsider's.

## Closable gaps

- **off-screen → can move toward `found`.** Event environments, posters, badges and exterior signage are all photographed on https://basement.studio/showcase/vercel-ship-a-home-for-innovation and https://basement.studio/showcase/nextjs-conf-raising-the-bar-again. Ship 2024 images worth downloading: `09fc5781…` (stage), `5784641550…` (Vercel stage), `9b27f740…` (posters on wall), `a82328d7…` (badge). Next.js Conf 2024: `a8ded49a…` (CONF24 sign). Full URLs are `https://cdn.sanity.io/images/9syto90m/production/<hash>-3840x2160.jpg` (list in `_tmp/2026-10-22-review-vercel/bship-page.html` and `bconf-page.html`). The Midway 2024 page also names the physical makers: "AV was managed by 4Wall, while Alpha Graphics handled the branding". That is a print/signage credit the gap says is missing.
- **brief / origin**: add Lexicon Branding as the naming agency, with its criteria.
- **perception**: I found no review in Brand New, It's Nice That, Creative Review or Eye on Design, which matches the gap. Codrops' Basement profile (https://tympanus.net/codrops/?p=104494) sits behind a Cloudflare challenge for curl but is indexed. Search excerpts say Basement does Next.js Conf "stage and live production" every year. Fetch it properly before citing.

## Asset problems

All 10 files under `public/research/vercel/strategy/` open and show what their names say, with two exceptions:

- **`basement-scaling-vercel-2.jpg` duplicates `basement-nextjs-logo-before-after.jpg`.** It shows the same Next.js before/after image (different bytes, same picture). It is used in `design-rationale` as if it showed the Vercel logo redraw. Replace it with a Vercel-mark image from the Scaling Vercel post, or drop it.
- **None of the 10 strategy assets is in `assetsIndex`.** Every other asset in the file is indexed with `what` and `source`. Add all ten.
- `ship-2025-fluid-hero.png` shows a hollow liquid-metal triangle outline, not a "solid" one. That is fine for `campaigns` but contradicts "the triangle as the hero object" read as the solid mark. Minor.
- The others (`basement-2022-icons/prism`, `basement-geist-1/2`, `basement-scaling-vercel-1` A/B lockups, `community-swag-final`, `ship-2025-moodboard`) are correct.

## Axis problems

Out of scope this round.

## Strategy problems

- **Quotes vs people:** every named-person quote checked matches the person and URL, with these exceptions: the Evil Rabbit influences (search snippet, page offline), the job-post paraphrase, and "an early ZEIT user" (RonanTheGrey's reply; the thread does not say he was an early user).
- **Rationale vs interpretation:** `design-rationale` does label its outside reads (Made Good Designs, Pimp my Type) as press. The "gradient dropped" point and the `brand-idea` "carried by absence" line are still unlabelled interpretation.
- **Status strictness:** none of the answers is built on HN speculation; `brief` keeps the Die Zeit theory as speculation. But `design-rationale` cannot be `found` while colour and mark have no stated reason and one attribution comes from a search snippet. `brand-idea` passes the agency/press rule only through Basement. Its press sources are a Rauch interview (fine) and Made Good Designs (weak).
- **Beyond own site:** good coverage of Basement, the Register, Contrary, Pimp my Type, Lovers Magazine, Korean and Japanese tech press. Missed: **Lexicon Branding** (naming agency), **Basement's HTML case-study images**, **Alpha Graphics / 4Wall / Set Creative** as the physical-production credits for Next.js Conf 2024 (Set Creative is cited in campaigns; the other two are absent).

## Source-type problems

I sampled 24 sources across the file. Most `owned` / `agency` / `reference` labels are right: vercel.com pages, Geist docs, GitHub, Greenhouse, LinkedIn and community.vercel.com are `owned`; Basement and the 2022 Basement site are `agency`; Wikipedia and the Wayback Machine are `reference`. Problems:

| Source | Typed | Problem |
|---|---|---|
| news.ycombinator.com/item?id=22933479 | press | A forum thread, not independent coverage. It can be quoted as reaction, but it must not count toward the `found` press requirement. Retype to `reference`. |
| news.ycombinator.com/item?id=38076798 | press | Same: retype to `reference`. |
| news.hada.io/topic?id=11657 (GeekNews) | press | A user-submitted link aggregator (Korean HN), so retype to `reference`. |
| corporate.themidwaysf.com/?p=10460 and /nextjs-conf-2025-san-francisco/ | press | The venue's own marketing blog: a paid vendor, not independent. Retype to `reference`, or treat as vendor material in the title. |
| uniform.dev/events/vercel-ship-2025-new-york | press | A sponsor's event listing, not coverage. Retype to `reference`. |
| madegooddesigns.com/vercel-brand-guidelines | press | Technically third-party, but unbylined ("Editorial Team") and factually wrong: it says the triangle "arrived with that rebrand" in 2020, while Vercel's own post says it was retained. Keep it as `press`, add a reliability note in the title, and don't lean on it as the only outside read in `brand-idea`. |
| basement.studio/showcase/geist-strengthening-vercels-visual-identity.md in `perception` | agency | The type is right, but it is used in the wrong question. Agency self-report is not outside perception. |

## MUST-FIX

1. **campaigns**: reattribute "Too far, too shiny, and too loud" to the full-spectrum colour / oil-slick / prism explorations that came *after* the trypophobia pivot, not to the spiky version (vercel.com/blog/designing-and-building-the-vercel-ship-conference-platform).
2. **campaigns**: replace "All of it stays on-identity: black field… colour enters only as light". Next.js Conf 2024 ran a saturated-blue sub-identity ("Next.js C24", blue signage and speaker cards) and Ship 2024 a broken-type "S'HIP" system. Cite basement.studio/showcase/nextjs-conf-raising-the-bar-again and …/vercel-ship-a-home-for-innovation (HTML pages).
3. **campaigns**: cut "in-person viewing in San Francisco, London and New York" for Next.js Conf 2022, or cite a page that says it. vercel.com/blog/nextjs-conf-2022 does not.
4. **design-rationale**: delete the Evil Rabbit / Müller-Brockmann / Carson / Ive sentence. It is a search snippet with no live URL.
5. **design-rationale**: set status to `partial` and add a `gap`: no stated reason for monochrome, the triangle's meaning or motion. Name where you looked (Rauch 2020 post, Basement posts, design.md, Geist docs, Made Good Designs).
6. **design-rationale**: move "ZEIT-era gradient fill dropped for flat solid" out of the stated points, or cite a source that says it. Add the Ship 2025 trained-model production fact ("We had already trained a model to output consistent lighting, form, and material").
7. **brief** (and `origin` if it names makers): add Lexicon Branding as the naming agency with its stated criteria (short, global, typeable, legally available, domain). Source: https://www.lexiconbranding.com/vercel-rebrand/, type `agency`. Rewrite "Vercel never published a trademark reason" to say legal availability was a stated naming criterion and the Die Zeit theory is still speculation.
8. **off-screen**: fix the job-post quote to the verbatim "print, events, environments, and the occasional piece of swag".
9. **off-screen**: remove the vercel.store tagline "Agentic Infrastructure for Commerce." and the "open-source Shopify storefront" claim, or cite where each appears. The store title is "Objects of Craft, by Vercel".
10. **off-screen**: download 4–5 event photos from the Basement HTML case studies (Ship 2024 stage `09fc5781…`, Vercel stage `5784641550…`, posters `9b27f740…`, badge `a82328d7…`; Next.js Conf 2024 sign `a8ded49a…`) into `public/research/vercel/strategy/`. Add Alpha Graphics (branding) and 4Wall (AV) from the Midway 2024 page. Rewrite the gap to drop "no images" and "block fetching", then reassess status.
11. **assets**: replace `basement-scaling-vercel-2.jpg`. It is the Next.js before/after image again, not a Vercel mark.
12. **assets**: add all 10 `/research/vercel/strategy/*` files to `assetsIndex`, each with `what` and `source`.
13. **source types**: retype both Hacker News threads, GeekNews, both Midway pages and the Uniform page from `press` to `reference`. Then re-check that each strategy `found` still has a real `agency` or `press` source.
14. **audience**: label "Prioritisation is bottom-up…" as the researcher's read or cite it. Change "an early ZEIT user" to the commenter's handle (RonanTheGrey) and stop presenting one reply as developer sentiment at large.
15. **brand-idea**: mark "In design terms the idea is carried by absence" as interpretation. Note in the Made Good Designs source title that it is an unbylined guide site with a factual error about when the triangle arrived.
16. **perception**: remove the Basement Geist showcase from perception sources, or move its "response has been loud" line to `campaigns`/`typefaces`. Agency self-report is not outside perception.
