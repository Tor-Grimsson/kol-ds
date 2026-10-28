# Final gate: MUST-FIX verification

Checked 2026-10-21 against `src/research/brands/<slug>.json` and `public/research/<slug>/`. Every item was checked in the JSON itself: the old wording was searched across all answers, `colors`, `fonts`, `typeScale`, `axes` and `assetsIndex`, and the correction was confirmed present. No researcher disputed any item, so nothing is marked DISPUTED.

Gate edits (minimal, shape kept):
- `sanity.json` › `answers.tokens.points[0]`: `--color-brand #f50` → `--color-brand renders #ff560a (layered #f50 is overridden; …)`.
- `sanity.json` › `answers.tokens.points[4]`: "Only two radii on marketing site" → "Only two radius tokens …; markup adds literal 3–12px radii on UI mock-ups".
- `rijksmuseum.json` › `answers.distinctive.points[2]`: "Exclusive Rijksmuseum typeface" → "Custom Rijksmuseum typeface".

Validator after the edits:

```
✓ cloudflare — {"found":31,"partial":1}, 78 sources, 52 colours, 10 fonts
✓ rijksmuseum — {"found":24,"partial":6,"not-found":2}, 54 sources, 24 colours, 4 fonts
✓ sanity — {"found":24,"partial":6,"not-found":2}, 68 sources, 21 colours, 4 fonts
✓ vercel — {"found":27,"partial":5}, 52 sources, 37 colours, 3 fonts
✓ wieden-kennedy — {"found":24,"partial":7,"not-found":1}, 49 sources, 22 colours, 5 fonts
```

## Cloudflare (18 landed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | brand-guide rewrite from /brand/ | LANDED | `found`; 7 sub-pages, Canto, Content Style Guide PDF, brand-design@ cited; "no public brand book" gone |
| 2 | logo-rules from /brand/logo/ | LANDED | `found`; 100% clearspace, 75/100px and 0.7/1in, backgrounds, every "What to avoid" line verbatim |
| 3 | voice-principles from Content Style Guide | LANDED | 3 traits, tone dials with verbatim examples; docs guide kept as second layer; old claim gone |
| 4 | Documented palette + Dawn/Haze | LANDED | 10 primaries/secondaries in `colors` as `documented`; Dawn/Haze stops in `palette` answer (gradients have no `colors` slot) |
| 5 | Tangerine / Ruby relabel | LANDED | `#f6821f` Tangerine, `#ff6633` Ruby, both documented primary; "Kumo brand text", "Product icon orange" gone |
| 6 | colour-roles guide rules + 70/25/5 | LANDED | Four guide rules verbatim; 70/25/5 replaced by a stated pixel-count method |
| 7 | typefaces: Inter guide, foundry URLs | LANDED | Inter + Noto Sans CJK + Inter Medium; typekiosk.smuss.studio and formulatype.com cited |
| 8 | type-usage guide specs | LANDED | Eyebrow/Headline/Sub/Body/URL specs and left-align rule verbatim |
| 9 | fifth-element Flare system | LANDED | Four arcs, never complete, max two, Multi-flare 01–06, 20% crop, Lemon stroke; 3 Multi-flare images added |
| 10 | imagery illustration + photography | LANDED | Principles, palette, photo rules; 4 guide samples in assets |
| 11 | logo-system lockups, logo-anatomy colours | LANDED | Partner/Corporate/Teams specs, backgrounds; Tangerine/Mango/#000 and "right aligned to the 'E'" |
| 12 | tensions guide vs site; polish axis | LANDED | Tension (1) covers all four mismatches; "eight orange hexes" gone; `axes.polish.why` rewritten |
| 13 | accessibility 3.06 links, 16.48 CTA, p.22 | LANDED | All three present |
| 14 | iconography Untitled UI | LANDED | Browser/Cloud01/Check path evidence; gap removed, status `found` |
| 15 | Asset relabels | LANDED | Renamed `lockup-workers-platform-{color,mono}.svg` and relabelled everywhere; presskit card relabelled; multiflare.png kept as a labelled thumbnail with full-size replacements |
| 16 | origin in-house evidence + blog date | LANDED | BDES codes, brand-design@, X post ID, Medium; label "published 24 Aug 2026; migration 12 Aug" |
| 17 | motion video frames + keyframe sources | LANDED | 8.0s loop, 240 frames, frame assets; keyframes split across `_separator`, `index.Cm-titPL.css` and inline HTML |
| 18 | social sample; "Why choose" headline | LANDED | Two Bluesky posts with URLs; homepage quotes "Everything needed to build secure, performant applications" |

Spot-check: `guide-multiflare-01.png` (orange flare-arc composition), `guide-logo-bg-ruby.png` (white stacked logo on Ruby), `guide-logo-partner-stacked.png` (Partner Network lockup with spacing guides). All match. `lockup-workers-platform-color.svg` has an `#FF530F` cloud and the mono one a `#262626` cloud, as described.

## Vercel (19 landed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Footer 12 columns | LANDED | homepage and navigation both say 12; "11 columns" gone |
| 2 | Step-700 dark values | LANDED | themes lists all seven; 7 dark entries in `colors` |
| 3 | OG cards not all black | LANDED | colour-roles, themes, imagery, colour-type-together all name the light Blog/Geist cards, stripe and selection-box emphasis |
| 4 | Light-theme hero | LANDED | hero and imagery describe both lightings; light is the default for light-OS visitors under `system` |
| 5 | Logo wall section | LANDED | Section 3 in homepage, marquee classes; in message-core as proof |
| 6 | Testimonials | LANDED | Jonathan Lemon quotes with URLs; "none on homepage" stated |
| 7 | tensions: marquee, OG split | LANDED | Tensions (8) and (9) |
| 8 | 72 components, Grid, geistcn, .md | LANDED | Count with method, Grid in Foundations, `@vercel/geistcn`, .md feature quoted |
| 9 | gray-700 role | LANDED | "High contrast background" in `colors` and accessibility; "disabled text" gone |
| 10 | AI SDK #171717/#EDEDED | LANDED | architecture answer and points |
| 11 | Measured proportion; gap line | LANDED | 0.00% chromatic, RGB spread >8 threshold, luma split; "no browser rendering" gone |
| 12 | Header logo asset; currentColor relabel | LANDED | `vercel-logotype-site-light.svg` gone; `vercel-header-logo-symbol.svg` added; currentColor entry relabelled |
| 13 | origin: Basement Next.js post, Evil Rabbit, ZEIT mark | LANDED | 9/8/2022 Mateo Zaragoza cited; Evil Rabbit byline; ZEIT gradient triangle described with archive SVG |
| 14 | iconography package, naming, licence | LANDED | `@vercel/geistcn-assets/icons`, `Icon<Name>`, forum quote; gap lists 307 chain and 404 twins |
| 15 | Wordmark "custom-drawn" | LANDED | Downgraded to unconfirmed with third-party note and gap |
| 16 | typeScale completion | LANDED | All 13 listed tokens present |
| 17 | Missing grays, alpha, theme tags | LANDED | gray 200/300/500/800, background-100 light, `#00000014`; every name carries a theme |
| 18 | Social sample; real error state | LANDED | LinkedIn post + tagline; "This email address is already in use." |
| 19 | Motion: what actually runs | LANDED | Running vs bundle-only keyframes separated |

Spot-check: `og-geist.jpg` (light card, hue stripe), `og-design.png` (selection box "185 × 56", outlined "engineers", glow on "researchers"), `screens/desktop.png` (black triangle with soft shadow on near-white, logo row). All match, with one stripe nit under Still open. `zeit-logo-2019-archive.svg` is a white→black gradient triangle, as described.

## Sanity (17 landed · 2 fixed by gate)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Rendered brand `#ff560a` | FIXED BY GATE | Answers, `colors`, accessibility (6.17 / 3.19) were already done; `tokens.points[0]` still said `--color-brand #f50`. Corrected |
| 2 | Waldenburg static, 425→400 | LANDED | "variable instance" gone; static CFF, no fvar; typeScale and type-usage note 425 renders 400 |
| 3 | 36 textures | LANDED | tokens, fifth-element, distinctive say 36; no stray 34 |
| 4 | 24 primitives | LANDED | Answer and points |
| 5 | Hero video frames | LANDED | `hero-video-frames.png` (12 frames) described; "no product UI" gone; hero assets no longer use `hero-background.jpg` (kept in index, relabelled as the blank poster) |
| 6 | motion found | LANDED | `found`, plus testimonial Mux frames; "couldn't watch" gap gone |
| 7 | Bleed quote verbatim | LANDED | Exact sentence in answer and example |
| 8 | Radius claim | FIXED BY GATE | layout and distinctive were fixed; `tokens.points[4]` still said "Only two radii on marketing site". Scoped to tokens + markup radii |
| 9 | CTA hover, mobile 20px | LANDED | inverse-base (black/white), hero override; 20px subhead and CTAs |
| 10 | Favicons | LANDED | `legacy-favicon-red-s-192.png` in tensions/origin only; `favicon-current-192.png` in logo-system |
| 11 | Swag collage | LANDED | logo-system (a–d), sanity.market in architecture, neon fields in imagery/colour-roles, tension (11) |
| 12 | Bleed colour and audience intent | LANDED | Both quotes verbatim in origin and palette; reconciled with "near-monochrome" |
| 13 | brand-guide answer | LANDED | Non-empty; robots `/styleguide`; brandarchive and d1s1 as leads in gap |
| 14 | Social samples; "never punny" | LANDED | 3 Bluesky posts with URLs, "free-range" aside; vocabulary softened |
| 15 | Onori post, styled-components fork | LANDED | design-system points and sources |
| 16 | Awards source, npm time | LANDED | bleed.com/work cited; 2025-05-08T13:34Z |
| 17 | brand.founded | LANDED | "2017" only; half-name gone |
| 18 | Axes | LANDED | chroma 3, tone 3, density 3, each with a reason |
| 19 | Legacy wordmark fill; header symbol note | LANDED | SVG fills all `#0D0E12`; assetsIndex notes the `#0B0B0B` hard-code |

Spot-check: `hero-video-frames.png` (particle sphere → terminal → Content Release → detection boxes → pixel squiggle → collages), `favicon-current-192.png` (white squiggle on near-black), `legacy-favicon-red-s-192.png` (red "S"). All match.

## Wieden+Kennedy (19 landed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Dev-bar colours; public privacy bar | LANDED | Roles say dev/build-debug only; privacy-bar shadow entry; palette, tokens, colour-roles match |
| 2 | SFMono role; privacy bar font | LANDED | Font role updated; typefaces states Univers LT Std .875rem |
| 3 | 2011 credentials archived | LANDED | "not retrievable" gone from all gaps; Wayback URL cited; contents described |
| 4 | Worldwide descriptor lockup | LANDED | logo-system (8) plus `logo-worldwide-descriptor-2011.png` |
| 5 | Welcome to Optimism | LANDED | Re-cited as the 2011-era blog welcome2optimism.com |
| 6 | London Contact red, gold, #262626 | LANDED | All three in `colors` and palette |
| 7 | colour-roles proportion | LANDED | Slider counted as imagery; `opacity:.45` noted |
| 8 | OG image description | LANDED | "rooftop terrace, staff waving, shot from above"; atrium only on `office-portland.jpg` |
| 9 | News-item images | LANDED | Renamed `news-case-for-chaos-monkey.jpg`, `news-chante-washte-wicasha-scholarship.jpg`; homepage notes 9 unrendered news items |
| 10 | Logo width and menu behaviour | LANDED | 100px ≤991.98px; opacity:0 ≥992px; black only below 992px |
| 11 | Footer reveal breakpoints | LANDED | layout and homepage both say ≥1168px margin, fixed from 992px |
| 12 | About og:description | LANDED | Verbatim, sourced to wk.com/about/ |
| 13 | Social + empty state | LANDED | Instagram tribute (via trade-press reprint; gap explains why) and search placeholder with JS-bundle URL |
| 14 | 2011 mission gloss, brand onions | LANDED | Both quoted; status stays `partial` |
| 15 | London contrast 9.16:1 | LANDED | `#262626` on `#ffbf00` = 9.16:1; 12.7 gone |
| 16 | Chroma axis 2 | LANDED | Score 2 with the requested reason |
| 17 | distinctive examples | LANDED | One example per point, each with source |
| 18 | Composite asset; orphan assets | LANDED | Marked self-made, re-rendered unclipped; `portland-hq-2008` in imagery; `screens/*` referenced |
| 19 | TOR/SYD spacing | LANDED | Written `"TOR "` / `"SYD "` |

Spot-check: `logo-worldwide-descriptor-2011.png` (stacked mark + grey "Worldwide"), `og-workingpage-people.jpg` (rooftop, waving staff, from above), `logo-lockups-overview.png` (three marks, "Wieden" not clipped). All match.

## Rijksmuseum (16 landed · 1 fixed by gate)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | /styleguide source; design-system found | LANDED | Cited in design-system, tokens, palette, ctas, brand-guide (and more); `found` with 4 sections, 20 page + 13 ticketshop templates |
| 2 | Documented colour names | LANDED | 7 Dutch-named entries `documented`; Active Rood role "Red when active"; "Tiara" only survives as the CSS class-name fact in tensions/tokens |
| 3 | Lichtgrijs `#eaeaea` | LANDED | In `colors` and palette |
| 4 | ACE dates 2024 + credits | LANDED | 4 Nov 2024 with Adformatie; origin credits Bonkers United, Huurdeman, Hendrickx; no 2025 ACE date left in answers |
| 5 | Collection Online 26 Nov 2024 | LANDED | architecture and origin, press release cited; "7 Jan" gone |
| 6 | Wilmotteblauw documented | LANDED | fifth-element and distinctive cite the styleguide name; "my inference" gone |
| 7 | 60ch | LANDED | Scoped to `.info-prices` in layout and type-usage |
| 8 | `--base-space` | LANDED | Moved to Collection Online `.cms-footer`; main site hard-codes on `.footer-content` / `.spacing-top` |
| 9 | DNA palette and wallpaper | LANDED | "not published" gone; 6 DNA 20 colours measured; `rijksmuseum-dna-wallpaper-20.jpg` in assetsIndex; renamed "Rijksmuseum DNA" |
| 10 | Half-space; Monocle citations | LANDED | "half-space" gone; Van Dale and "Ayee" cite Monocle |
| 11 | "Exclusive and not sold" | FIXED BY GATE | Removed from typefaces, but `distinctive.points[2]` still said "Exclusive Rijksmuseum typeface". Changed to "Custom". PRINT/IamExpat credit landed |
| 12 | je vs u split | LANDED | vocabulary, voice-practice, tension (9) |
| 13 | Social samples | LANDED | 3 YouTube Shorts with URLs |
| 14 | `.button-tertiary`, link rule | LANDED | Both verbatim in ctas |
| 15 | brand-guide gap | LANDED | Names /styleguide; press kit and searches kept; Monocle DNA note in points |
| 16 | Axes tone/polish | LANDED | tone 3, polish 3 with reasons |
| 17 | Small corrections | LANDED | 45 reduced-motion; 1330×2000; Dutch Interactive Award 2013; "Must see" on Tickets; logo is one of the 32 symbols; `#8c9095` now an observed pair (radio circles) |

Spot-check: `rijksmuseum-dna-wallpaper-20.jpg` (six stripes matching the six sampled hexes), `rijksmuseum-dna-wallpaper-19.jpg` (narrow-stripe variant), `home-block-1.jpg` (Night Watch with blurred visitors, 1330×2000 confirmed). All match.

## Still open

All MUST-FIX items are resolved. These are new issues found during the gate. None was a correction already evidenced in a review, so they were not edited:

- **Cloudflare `colour-roles`:** the measured split "21% orange / 73% white / 5% grey / ~10% other" adds up to 109%. Re-run the pixel count or say the classes overlap.
- **Vercel `og-geist.jpg`:** the top stripe has seven segments (blue, purple, pink, red, amber, green, teal), not six. "Six-hue" appears in colour-roles, imagery, colour-type-together and tensions; the review made the same error.
- **Rijksmuseum `origin.points[4]`:** keeps "Dutch Design Awards 2013" next to the corrected "Dutch Interactive Award 2013", backed by its own dutchdesignawards.nl source. That is plausible but was not re-verified here.

## Foundations — 2026-10-21

### colour-combinations (16 landed · 1 fixed by gate · 1 disputed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Proportion finding, summary, "60 = neutral" cell | LANDED | Large tier neutral in Acolad/Mintos, brand colours in Somerset/Calgary; `common-practice` with four-guide caveat; summary and ratio-models row 0 rewritten; "60 = neutral" gone |
| 2 | "every documented ratio caps the most saturated tier" | LANDED | Wording gone; Somerset Marine/Meadow 25% and Calgary red/gold uncapped cited |
| 3 | Cadbury | LANDED | "2004 application refused (2013)" in claim, example, table; 2018/2019 surrender and [2022] EWHC 1671 in detail; "lost its" gone |
| 4 | T-Mobile v Aio | LANDED | Preliminary injunction, S.D. Tex. 2014, Jones Day cited; WLRN only backs Lemonade |
| 5 | Glossier | LANDED | "preliminary (non-final) refusals", Jul/Aug 2019; table row "not a court ruling" |
| 6 | Labrecque & Milne | LANDED | `common-practice`, Gorn leads, "paper not read" stated |
| 7 | "reduces eye strain" | LANDED | Only as Material's quote, flagged unsupported with Piepenbrock 2013 |
| 8 | Unsourced meaning claims | LANDED | Greys, pastels, off-white "print-like" called convention, no study found |
| 9 | Split the two combination findings | LANDED | Ratio findings `established`; rationale and mid-luminance hypothesis separate `common-practice` |
| 10 | "10% tint counts as neutral" | LANDED | Gone; tints cite Somerset 20% steps, Carbon, Refactoring UI |
| 11 | Glasgow | LANDED | University blue in finding, example, occasion-rule finding, ratio-models row 3, documented-proportions row 4 |
| 12 | Tiffany 1845 | LANDED | 1845 tied to Blue Book only; boxes/bags no start date |
| 13 | "nascent" / Elliot & Maier 2014 | DISPUTED | Detail quotes the 2014 abstract ("remains at a nascent stage of development") via the cited OpenAlex record; gate re-fetched and confirmed |
| 14 | Spotify hex; 41 shades / $200M sources | FIXED BY GATE | colors.svg has `#1ED760` / `#121212`; Bowman 2009 cited; Guardian 2014 was named but not in `sources` — added (`sections[3].findings[1]`) with the review's URL |
| 15 | Print section | LANDED | Section 7: FOGRA51/52, ISO 12647-2, GRACoL, Pantone C/U, stock, Uber Red #E64C35 vs F25138, gamut table |
| 16 | Colour-vision deficiency finding | LANDED | 1 in 12 / 1 in 200, WCAG 1.4.1; Somerset 1.51:1, Uber 1.31:1 recomputed |
| 17 | Studio/foundry measured examples | LANDED | 5 sites in finding + table, measured from CSS declarations (stated); Commercial Type excluded with reason |
| 18 | Small fixes | LANDED | Tropicana "within two months"/"sales"; Performable line to Poper; Louboutin "outside the limited mark"; Uber quote before reading |

Checks: 24 contrast ratios recomputed, all match; Uber chart shares sum 100.05% (rounding); 44/18/6 agree finding vs table; ΔE text matches print-gamut table; summary agrees.

### colour-systems (16 landed · 2 fixed by gate · 1 disputed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Carbon `$link-inverse` → `$link-primary` Blue 40 | LANDED | brand-vs-ui#0, themes#3: G100 `$link-primary` #78a9ff (7.68:1); `@carbon/themes@11.83.0` source; summary "Blue 60 → Blue 40" |
| 2 | 40-tone gap → 60 | LANDED | themes#0 "60 tones in both modes"; "40-tone" only in the contrast sentence |
| 3 | Fabricated Stripe quote | LANDED | Quotes "the way HSL calculates lightness is flawed"; "perceptually uniform" 0 hits |
| 4 | Material mapping labelled 2021 spec + MCU 2025 | LANDED | themes#0, ramps#2, light-dark-mapping title, brand-ui-split row; `color_spec_2025.ts` cited |
| 5 | Tone Δ50 ≈4.5:1 (4.48, Δ≥51 strict) | LANDED | colour-spaces#2, accessibility#4, magic-numbers row, summary |
| 6 | "HCT chroma tops out at roughly 120" | DISPUTED | colour-spaces#2 detail adds "theoretically unbounded … H26 C231 T100" and attributes 120 to MCU `concepts/dynamic_color_scheme.md` (cited; line 16 confirmed) — review only checked color_spaces.md |
| 7 | Carbon step counts per starting colour | LANDED | "Black 6, Gray 100 5, Gray 90 4" in accessibility#5 and magic-numbers; "6 steps from" 0 hits |
| 8 | Polaris deprecated, dark fill #ffffff, inference marked | LANDED | Deprecation in brand-vs-ui#1, tokens#1, semantic#0/#2, table, summary; rgba(255,255,255) flip; "same reason" 0 hits |
| 9 | accessibility#2 as a myth | LANDED | "Myth: 'APCA is the WCAG 3 contrast algorithm.'", `contested` |
| 10 | Relabel 8; scope ramps#5, semantic#3 | LANDED | 8 → `common-practice`; ramps#5 Tailwind-only (300 at 251.813); semantic#3 "At IBM/Carbon" |
| 11 | P3 ≈26–36%, contested | LANDED | `contested`, 1.36× xy / 1.26× u′v′ (recomputed 1.357 / 1.256); WebKit 50% only as quote |
| 12 | Encore 2019, Stripe paraphrase, Atlassian ladder, DTCG | FIXED BY GATE | Encore year, Stripe quote, tokens#1 (10 tokens), DTCG wording landed; semantic#1 still implied 12 Atlassian tokens — rewritten to "success, success.subtler and success.bold, each with .hovered/.pressed, plus success.subtle with no states" |
| 13 | Leonardo Theme/Color API | LANDED | ramps#7 Theme/Color/contrastColors, pre-v1 name, packages/contrast-colors cited |
| 14 | semantic#4 cites data-vis.json5 | LANDED | `src/tokens/functional/color/data-vis.json5`; README not cited |
| 15 | Focus finding | LANDED | accessibility#7: 2.4.7, 1.4.11, 2.4.11, C40; Carbon $focus #ffffff G100; GOV.UK #ffdd00/#0b0c0c |
| 16 | UI-safe brand variant, SchemeFidelity, amend brand-vs-ui#5 | FIXED BY GATE | Procedure in brand-vs-ui#7, #5 detail cites SchemeFidelity; #5 claim amended to "pinned, 'harmonized', or kept via SchemeFidelity/SchemeContent" |
| 17 | P3 delivery finding | LANDED | colour-spaces#5: color-gamut, fallback, DTCG hex, color-mix, relative colour |
| 18 | Dark-mode brand fill finding | LANDED | themes#6 with Polaris, Carbon, MCU, Apple HIG; gate also corrected its MCU per-variant wording, which contradicted themes#0 (NEUTRAL 40 light / 80 dark; TONAL_SPOT max-chroma light / 80 dark; EXPRESSIVE/VIBRANT max-chroma both), checked against `color_spec_2025.ts` 638–650 |
| 19 | Sequential/diverging data-viz | LANDED | semantic#5 cites Datawrapper, ColorBrewer, Carbon |

Checks: summary matches findings; 34 + 15 + 2 = 51; USWDS 10 + 9 vivid; table cells agree with findings.

### type-systems (14 landed · 3 fixed by gate · 0 disputed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Utopia 320 → 360px | LANDED | Finding 1.0 and `scales` computation say 360; remaining 320s are other examples; clamp() strings recompute at 360 |
| 2 | SF Pro causation, "double-tightens" | FIXED BY GATE | Finding 2.3 fixed; summary still had "flips positive at display because of optical sizes" — rewritten to "SF Pro's table flips positive again at display while New York's keeps falling, so use the foundry's table" |
| 3 | Spotify Mix | LANDED | In-house (Wängelin) with Dinamo in 5.4 and table; three unsourced claims gone |
| 4 | Premier League "custom numbers" | FIXED BY GATE | Gone from 4.7; field-fit Sports note "regulated system" → "Bespoke league/event lettering" |
| 5 | Tailwind ratio | LANDED | 0.5 lists real steps (×1.11–1.33); "two-ratio" gone |
| 6 | Wise "361 scripts" | LANDED | Latin/Cyrillic/Greek in 4.1 and table; 361 only as NaN's figure, "almost certainly languages" |
| 7 | Material 3 title-large weight | LANDED | Regular in 0.3 and 2.6 |
| 8 | Robinhood "Collins"; YouTube Sans source | LANDED | "not named in source"; Collins only as Mailchimp's agency; YouTube Sans cites itsnicethat 2017 |
| 9 | Per-row sources | LANDED | Every row in both tables has a Sources cell |
| 10 | Burberry/Saville | LANDED | 4.4 quotes "management mistake" and "really nice … I like it" |
| 11 | Summary "Inter dominates" | LANDED | Web Almanac 2025 shares, Inter ~1.5%; matches 6.2 |
| 12 | Confidence relabels | LANDED | 3.1, 5.2, 5.4, 3.4, 4.3, 4.4, 2.2, 2.3, 1.2 → `common-practice`; 4.8 marked opinion |
| 13 | Dyson & Kipping | LANDED | 2.5 "one 1998 screen study" + 2001 follow-up |
| 14 | Firefox 300%, "1118 UPM", Carbon 92px | LANDED | Firefox dated; 1118 font units; display-04 42→156px, "up to 92" gone (12→92 formula in summary is the confirmed productive scale) |
| 15 | Geist year; VF Didot designers | LANDED | 17 Oct 2023; Commercial Type (Schwartz, Barnes) |
| 16 | Icelandic glyph gate | LANDED | 4.0 with Hyperglot, Google glyphsets, Underware, MDN unicode-range |
| 17 | Licensing, loading, GDPR | FIXED BY GATE | 6.5, 6.6 in; 5.6 lacked the Adobe Fonts point — added with helpx.adobe.com/fonts/using/font-licensing.html |

Checks: summary numbers match findings and scales; ratio table 16 × r⁵, major-third and Utopia steps recompute.

### sector-patterns (13 landed · 1 fixed by gate · 0 disputed)

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | Saville quote | LANDED | trends-type-system#1 "a management mistake"; inverted version gone |
| 2 | Saint Laurent out; four → three | LANDED | "Saint Laurent is not a reversal" (Fashionphile); "three houses" in claim and summary |
| 3 | Deezer 2023 | LANDED | November 2023 in claim and detail; no 2022 |
| 4 | PayPal yellow reason | LANDED | breaking#7 "duplicated other retail brands"; "Mastercard" 0 hits |
| 5 | AstraZeneca #830051 | LANDED | Health table ×53 live CSS, #8A0051 "absent"; pharma finding and method#2 agree |
| 6 | AWS orange | LANDED | #FA6F00 ×44, #FF6200 absent; devtools finding agrees |
| 7 | Cohere; AI blue 1/9 | LANDED | Multi-accent #4C6EE6 / #FF7759 / #D18EE2; "1/9" in summary, summary table, AI claim |
| 8 | Mailchimp in clean-sans list | LANDED | Dropped; "Mailchimp is the exception … Cooper Light" |
| 9 | Ground rule (museums, AI) | FIXED BY GATE | Museums 4/4 body CSS and AI 3/9 landed; bracketed hints wrong — AI "2 more via theme-color" → "Perplexity hints at one via theme-color (#FCFCF9)" (Runway is #0C0C0C), summary cell "+1 theme-color hint, Perplexity"; museums "8 of 9 white" → "8 of 9 light" with theme-color filling rows without body value (V&A #1f1f21), summary cell to match |
| 10 | Luxury 8/10, 6 aggregator-only, labels | LANDED | Summary, table, claim agree; script pass found all aggregator hexes labelled |
| 11 | 8 rows to live CSS | LANDED | Mistral, Docker, GitLab, Chase, Wise, Sanofi, Novartis, Stanford all "(live CSS)" with counts |
| 12 | Confidence labels | LANDED | Monzo, luxury reversal, AI sparkle, source ladder → `common-practice`; Oatly split; aggregator-error stays `established` on 36 rechecks citing 5 failures (review's allowed option) |
| 13 | Sports, university, summary-table wording | LANDED | "NFL is the only league verified navy"; Puma DIN; "not heraldic"; pharma "half custom"; devtools 3/9; agencies split |
| 14 | Foundry table; studios split | LANDED | sector-studios 19, sector-ad-agencies 7, sector-foundries 11, measured hexes and grounds |

Checks: 148 brands in 14 tables; serif companion 7/41; dark mode 8/16; method 16 + 8 + 12 = 36; all summary counts match tables after gate edits.

Validator after gate edits:

```
✓ colour-combinations — 8 sections, 62 findings {"established":26,"common-practice":29,"contested":7}, 96 sources, 6 tables, 8 ramps, 0 scales
✓ colour-systems — 7 sections, 51 findings {"established":34,"common-practice":15,"contested":2}, 77 sources, 6 tables, 10 ramps, 0 scales
✓ sector-patterns — 7 sections, 49 findings {"established":19,"common-practice":28,"contested":2}, 157 sources, 15 tables, 0 ramps, 0 scales
✓ type-systems — 7 sections, 53 findings {"established":26,"common-practice":23,"contested":4}, 97 sources, 3 tables, 0 ramps, 9 scales
```

### Still open

No MUST-FIX item is open. New issues found by the gate, not edited because no review evidence settles them:

- **colour-combinations `sections[2].findings[10]`:** "converge on monochrome + one accent" overclaims; its own data fits 2 of 5 (Pentagram, Klim). Soften to "lean towards". Item 17 is CSS-measured, not pixel-share; needs a rendered pass.
- **colour-systems semantic#5:** Carbon diverging details (red–cyan, purple–teal, "do not differ between light and dark") were added after the review and are unchecked. The review's verdict says "nine ramps"; the file has 10 (Radix dark separate) — review count is wrong, data fine.
- **type-systems:** custom-faces and field-fit tables keep a table-level source covering one row (redundant, misleading alone). Mona Sans year "—" and Atlassian Sans foundry/year still blank (raised outside MUST-FIX).
- **sector-patterns:** studios "at most one warm accent" contradicts its table (Hey multicolour, Feixen blue, Heydays earth, Koto yellow); 6/19 count is right. method#2 "present" list gives 17 hexes against 16 (Wise both); the 12 "absent" end in "…and others", so 36 can't be rechecked. Breaking-convention intro "almost always change colour, not type" — Mailchimp, Oatly, Liquid Death broke on type too (3 of 8). Minor count drift vs review (AWS ink ×327 vs ×334, Lexia 521 vs 522).

## sanity — strategy layer — 2026-10-22

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | perception: Gullblyanten 2025 label | LANDED | "Gullblyanten 2026" absent file-wide; answer "Gullblyanten 2025 (Kreativt Forum), awarded 13 March 2026", points match |
| 2 | perception → partial | LANDED | status `partial`; gap keeps no design-press critique / no criticism, juries + aggregator + foundry post |
| 3 | design-rationale → partial, credits, serif gap | LANDED | status `partial`; answer + points name Papiernikova / Lia / Holstad Andersen, "none of them is quoted"; gap names the heavy serif wordmark vs Waldenburg/Plex |
| 4 | off-screen: Fujimoto quote, Artist in Residence | LANDED | "ran through the building" absent file-wide; "Artist in Residence" in answer + points; everything.sanity.io cited (owned) |
| 5 | off-screen: script → serif | LANDED | off-screen has "serif Sanity wordmark", no "script"; asset entry matches |
| 6 | campaigns + off-screen: mockups in body | LANDED | Both answer bodies say "presentation mockups, not documented runs" with the "Name Surname" placeholder evidence; Café Sanity, NY/LA posters, A-frame covered |
| 7 | audience: Lia not press release | LANDED | "quoted in Kampanje (9 May 2025)"; no Lia/press-release pairing anywhere |
| 8 | brand-idea: keynote line as recap summary | LANDED | "The 2026 keynote recap sums up Hillestad's theme as…"; points match |
| 9 | CMS Critic "16 May 2025" | LANDED | Basis given: titles say "datePublished 2025-05-16 in page JSON-LD"; brand-idea + brief gaps carry a date note |
| 10 | CMSWire → owned, retitled | LANDED | All 4 uses (positioning, tensions, brand-idea, brief) `owned`, "Sanity press release via CMSWire" |
| 11 | PR Newswire → owned | LANDED | audience + campaigns `owned`, "Sanity press release via PR Newswire" |
| 12 | Fonts In Use → reference | LANDED | All 6 uses `reference` (origin, typefaces, imagery, fifth-element, design-rationale, perception) |
| 13 | Working Nomads | LANDED | Retyped `reference`, title says repost of Sanity's listing, original no longer live |
| 14 | assetsIndex for 14 strategy files | LANDED | 14/14 indexed, none unindexed; renders marked; Arc'teryx named; diptych both halves; builder-talks wide says "different portrait" |

Assets read: `bleed-bottle-merch.png` (serif "Sanity" on dark bottle, matches), `visuelt-entry-stage-partner.jpg` (squiggle "and" Arc'teryx, stats panels, matches), `visuelt-entry-mobile-swag-store.jpg` (magenta webinar phone + sanity.market tote on laptop, matches).

Validator:

```
✓ sanity — {"found":29,"partial":8,"not-found":2}, 90 sources, 21 colours, 4 fonts
```

### Still open

No MUST-FIX item is open. New, not edited (no review evidence settles them):

- **perception points:** "Rebrand Gallery (Jun 2026)" keeps a date the review (row 18) found nowhere on the page. Drop it or give a basis.
- **perception sources:** Rebrand Gallery is typed `press`; the review calls it a descriptive aggregator. Not in the source-type table, so left as is; `reference` fits better.

## wieden-kennedy — strategy layer — 2026-10-22

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | off-screen: exterior branding Portland + London | LANDED | Now "In Portland the only exterior branding found is…" then London window lockup "Wieden Kennedy +" and pink inflatable NOT (CR, Jan 2023); point 2 matches; `not-wk-team-creative-review-2023.jpg` attached to off-screen |
| 2 | assetsIndex for 8 strategy files | LANDED | 8/8 indexed with `what` + `source`; 4 Commons photos carry "Another Believer, CC BY-SA 3.0"; Adweek image described as staff group photo, "not an award graphic" |
| 3 | brief: US revenue, "not defended", KFC report card | LANDED | "300M flat" and "resigned" absent file-wide; brief says "US revenue flat at ~$300M… Bud Light and KFC not defended"; Campaign Report Cards 2022 URL in sources |
| 4 | campaigns: cred deck wording | LANDED | "closes with", "hostile", "Brand New comment" absent file-wide; answer + example label say "in the words of others" section, commenter RebrandouVer |
| 5 | audience: About meta description | LANDED | "About copy" absent; answer says "About page's meta description (page-data seoDescription…)"; page-data URL cited `owned` |
| 6 | brand-idea: interpretation marked | LANDED | Both sentences prefixed "Interpretation (ours)" / "Interpretation (ours, not stated by W+K)" |
| 7 | Source types | LANDED | Global Credentials `owned` in all 12 uses (more answers than the review's 8; none left `reference`); belgium-architects `agency` in all 4 and retitled "Allied Works project text (via belgium-architects.com)"; Creativepool `owned`; NYU ITP `reference`; LBB company page gone |
| 8 | campaigns: 2026 sources + So Win look | LANDED | LBB company page, Owler, mmponline absent file-wide; 2026 line now cites Campaign Asia, Campaign ×2, Adweek, wk.com, ATDb; Michelob dropped; "a black-and-white film of athletes…" added |
| 9 | Graphis / C.S. Anderson lead | LANDED | Wayback copy (18 Jan 2022) cited in brief + design-rationale; gaps record credits confirmed, image and year not archived, unmatched to a known mark |
| 10 | Missed press | LANDED | LBB news + creativebrief in brief and off-screen; Mumbrella "Pin point creativity" in off-screen with the reader-comment quote |
| 11 | perception: no critique of master wordmark | LANDED | Answer and last point state none found; NOT and maker logos framed as sub-identity verdicts |

Assets read: `not-wk-team-creative-review-2023.jpg` (staff in front of E1 street front, window lockup "Wieden Kennedy+", pink inflatable NOT, matches), `adweek-2025-global-agency-of-the-year.png` (night-time staff group photo, matches), `not-wk-generator-wordmarks-creative-review.jpg` (grid of "not" wordmarks in Latin, 不是, Devanagari, matches).

Validator:

```
✓ wieden-kennedy — {"found":29,"partial":9,"not-found":1}, 93 sources, 22 colours, 5 fonts
```

### Still open

No MUST-FIX item is open. New, not edited (no review evidence settles them):

- **Barber name drift:** off-screen answer says "SliderCuts"; off-screen point 4, origin and logo-system say "SlideCuts". Check against the wklondon.com post and use one spelling.
- **"building-height" NOT inflatable** (off-screen, assetsIndex): the photo shows it spanning the ground-floor glazing and rising about one storey up the brick, not the full building. "Two-storey" is closer.
- **brief additions beyond the review:** "flat at ~$300M in 2021, 2022 and 2023" (review asked for 2022 and 2023) and "KFC moved on in late 2021" are unchecked. The 2021 figure rests on the 2022 report card.
- **perception still unscoped:** "Campaign's 2023 review — revenue flat at $300M" and point 4 don't say the figure is US and covers 2022 (review row 33). Not in MUST-FIX, so it was left.

## vercel — strategy layer — 2026-10-22

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | campaigns: "Too far, too shiny, and too loud" reattributed | LANDED | Answer, points[5] and examples[1] tie it to the full-spectrum colour / oil-slick / prism route after the trypophobia pivot; no spiky attribution left |
| 2 | campaigns: "stays on-identity… colour only as light" replaced | LANDED | Phrases absent file-wide; answer names the blue Next.js CONF24 sub-identity and Ship 2024 "S'HIP" type; both Basement HTML pages cited; assets `nextjs-conf-2024-sign/blue-system`, `ship-2024-posters` |
| 3 | campaigns: London / New York viewing for Conf 2022 | LANDED | "London" absent file-wide; no viewing-city claim left |
| 4 | design-rationale: Evil Rabbit influences sentence | LANDED | Müller-Brockmann / Carson / Ive absent file-wide; gap notes the Indent page 404s and is not used |
| 5 | design-rationale → partial + gap | LANDED | Status `partial`; gap: no reason for monochrome, triangle meaning or stillness, lists where looked |
| 6 | design-rationale: gradient point; trained-model fact | LANDED | Gradient point labelled "Researcher's reading… not a stated reason" (points[1]), gone from answer; trained-model quote in answer + points[7] |
| 7 | brief/origin: Lexicon Branding | LANDED | brief answer, points, example, source (`agency`) carry criteria incl. "legally available"; "never published a trademark reason" absent; origin answer + points[2] + source name Lexicon; Die Zeit kept as speculation |
| 8 | off-screen: job-post quote verbatim | LANDED | "print, events, and swag" absent; "print, events, environments, and the occasional piece of swag" in answer + points |
| 9 | off-screen: store tagline / Shopify claim | LANDED | Both absent file-wide; store cited by title "Objects of Craft, by Vercel" |
| 10 | off-screen: event photos, makers, gap rewrite | LANDED | 5 photos in `public/research/vercel/strategy/` (stage, Vercel stage, posters, badge, CONF24 sign) used in off-screen; 4Wall + Alpha Graphics quoted from Midway 2024; "no images" / "block fetching" absent; status `found` holds on the Basement agency sources |
| 11 | asset: `basement-scaling-vercel-2.jpg` | LANDED | File gone from the folder and from every answer and assetsIndex; design-rationale uses `basement-scaling-vercel-1.png` |
| 12 | assetsIndex for strategy files | LANDED | 15/15 files in `strategy/` indexed with `what` + `source`; no indexed path missing on disk; fluid hero described as "hollow" |
| 13 | source retypes + found re-check | LANDED | All 9 HN / GeekNews / Midway / Uniform source entries are `reference`; each strategy `found` (brand-idea, audience, brief, campaigns, off-screen) still has an `agency` or `press` source |
| 14 | audience: bottom-up label; RonanTheGrey | LANDED | "Researcher's read, not a stated priority"; reply attributed to RonanTheGrey as "one dissenting reaction, not a measure of developer sentiment"; "early ZEIT user" absent |
| 15 | brand-idea: absence as interpretation; MGD note | LANDED | "Researcher's reading, not a stated position: …carried by absence"; MGD title says unbylined and wrong about the triangle date (all 3 uses) |
| 16 | perception: Basement Geist showcase | LANDED | Geist showcase gone from perception; answer defers agency reception claims to typefaces; "response has been loud" survives only in `distinctive` |

Assets read: `ship-2024-posters.jpg` (three black S'HIP posters on a wall, "MAY 23, 2024 NEW YORK CITY", matches), `nextjs-conf-2024-blue-system.jpg` (blue square, grid, blue blocks, "HOSTED BY VERCEL" label, matches), `ship-2024-badge.jpg` (black S'HIP lanyard badge, ▲Vercel, matches).

Validator:

```
✓ vercel — {"found":32,"partial":7}, 79 sources, 37 colours, 3 fonts
```

### Still open

No MUST-FIX item is open. New, not edited (no review evidence settles them):

- **campaigns, Next.js logo date:** answer says the 2022 edition "(25 Oct) unveiled the redrawn Next.js logo" and points[1] "Next.js Conf 2022 (25 Oct): new Next.js logo unveiled". The cited post is dated 2 Sep 2022 (JSON-LD `datePublished`) and announces the conf "on October 25"; "Today we also unveiled the new logo" means 2 Sep, with the conf announcement, not at the conf. Raw page: `_tmp/2026-10-22-review-vercel/conf22.html`.
- **perception awards:** the Awwwards Developer Award / SOTD line rests only on Basement's showcase (`agency`) inside perception. An Awwwards URL would make it outside evidence.
- **off-screen wording:** the S'HIP posters asset looks like a mockup render on a wall rather than event photography; the answer calls the set "photographs". Minor.
- **origin (out of scope this round):** still states the gradient → flat-solid change as fact from the archived SVG, while design-rationale labels it as the researcher's reading.

## rijksmuseum — strategy layer — 2026-10-22

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | brief → partial + gap | LANDED | Status `partial`; gap: no published 2012 museum brief, no museum statement on replacing Dumbar, ACE brief covers campaigns only; places searched listed |
| 2 | design-rationale → partial + gap | LANDED | Status `partial`; gap lists the space, black-and-white-only logo, Documenta → custom sans, motion |
| 3 | campaigns: Vermeer sell-out timing; IamExpat date | LANDED | "within weeks" absent file-wide; answer "sold by 11 Feb 2023, the exhibition's second day, with 200,000 sold before opening"; point "by day two (11 Feb)"; source title 13 Mar 2023 |
| 4 | campaigns: flash-mob example verbatim | LANDED | Value "ruim 1.500.000 views wereldwijd", label carries the English gloss; "over 1.5 million" splice absent |
| 5 | brief: Volume date | LANDED | "Feb 2012" absent file-wide; answer and point say 9 Mar 2012 |
| 6 | brief: 2025 quote without "om" | LANDED | "om de publiekscommunicatie" absent file-wide; answer quotes "de publiekscommunicatie beter stroomlijnen alsmede…" |
| 7 | off-screen: "Both use paintings, not the house style" | LANDED | Phrase absent file-wide; New Amsterdam collab described as co-branded with the wordmark (asset `shop-new-amsterdam-collab.jpg`); POLSPOTTEN "no house style" |
| 8 | Albert Heijn packaging in off-screen + campaigns | LANDED | Both answers, points and an example each; Design Week (Tom Banks, 12 Apr 2013) typed `press` in both; assets `ah-dairy-range-2013.jpg`, `ah-dairy-miffy-carton-2013.jpg` |
| 9 | perception: Designs of the Year 2013 shortlist | LANDED | Answer, points[6], example verbatim from Design Week; source `press` |
| 10 | audience: Heineken / under-18 | DISPUTED (valid) + LANDED | Dispute in `audience.gap` with Jaarverslag 2024 cited. Checked against the reviewer's own extraction (`_tmp/2026-10-22-review-rijksmuseum/dl/jv24.txt` l.1565–1570, "Begunstigers en stakeholders"): "Met Heineken zijn de afgelopen jaren evenementen georganiseerd voor jongvolwassenen, zoals de Heineken Music Sessions en het Rijksmuseum NEXT tuinfeest" — verbatim. Researcher is right; the review searched only the Magnum release. "Garden party" rendering gone (now "tuinfeest"). Under-18 claim removed file-wide |
| 11 | audience: what they should believe; interpretation label | LANDED | Jaarverslag 2024 campaign-aim line in answer, points[7], examples[5]; "brief to herself" absent; Boom link labelled "Our reading, not a stated link" (brand-idea closing also labelled "Our reading") |
| 12 | design-rationale: Fabrique, not Fabrique/Q42 | FIXED BY GATE | design-rationale and points landed. Perception still read "the Fabrique/Q42 website won EDA Gold 2021"; changed to "the website (designed by Fabrique, built with Q42) won EDA Gold 2021" on the review's EDA evidence. "Fabrique/Q42" now absent file-wide |
| 13 | off-screen: "past security", "about ten paintings" | LANDED | Both absent file-wide; Schiphol sentence now cites the wordmark on the intro panel (NEXT photo) |
| 14 | assets: drop two, add physical identity | LANDED | `irma-boom-art-books.jpg`, `press-new-amsterdam-vermeer.jpg` absent from JSON and folder (moved to `_tmp/2026-10-22-strategy-rijksmuseum/retired/`); added façade unveiling, carrier bag, two AH cartons; all 7 `strategy/` files indexed, no indexed path missing |
| 15 | source retypes | LANDED | DTL Documenta `reference`; Thomas Eyck t.e. 216 (×4 answers) and DNA 20 swatch `reference`; NEXT `agency`; Brand New Wayback `press` in all 5 answers (brand-idea, brief, design-rationale, off-screen, perception) |

Assets read: `brandnew-2012-unveiling.jpg` (RIJKS MUSEUM banner being uncovered on the Cuypers façade, matches), `ah-dairy-miffy-carton-2013.jpg` (Miffy carton, "RIJKS ZEGEL 09 · € 5 KORTING" panel, RIJKS MUSEUM white on blue band, matches), `brandnew-2012-bag.jpg` (white bag, wordmark cropped at "RIJKS MU", matches).

Validator:

```
✓ rijksmuseum — {"found":29,"partial":8,"not-found":2}, 78 sources, 24 colours, 4 fonts
```

### Still open

No MUST-FIX item is open. New, not edited (no review evidence settles them):

- **off-screen, unchecked additions:** "T-shirts from €65, surfboards at €1,200" (DutchNews) and "DNA wallpaper (Thomas Eyck, 2014)" are not in the review's verified table.
- **design-rationale vs logo claim:** the gap notes the AH cartons run the wordmark white on blue (confirmed by the Miffy carton asset), which undercuts Monocle's "realised only in black and white" as stated in the answer and points[4]. The gap flags it; the answer does not.

## cloudflare — strategy layer — 2026-10-22

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | brand-idea: verbatim brand-promise quote | LANDED | "At its essence, this brand promise" absent file-wide; examples[0] and answer carry the full verbatim "This creative direction is an interpretation of our brand promise: "Boldly go"…" sentence; first sentence kept separately |
| 2 | brand-idea → partial + gap; Rosenberg wording | LANDED | Status `partial`; gap names the 2025–26 identity and lists places searched (incl. rebrand.gallery); "their team sat under" absent; points[4] "thanked Jessica Rosenberg… for the opportunity to lead this work" |
| 3 | audience: "increase the awareness" | LANDED | "expand the awareness" absent file-wide; examples[2] and answer say "increase" |
| 4 | campaigns: "first paid brand campaign" | LANDED | Phrase absent file-wide; answer and points[0] say the blog calls it an experiment in two US cities (SF, NYC), "first campaign" attributed to Merca2.0 |
| 5 | campaigns: Transmission single source | LANDED | "comes from Merca2.0 alone, which gives no source… Cloudflare's post names no agency"; points[1] "Merca2.0 only"; example label "(single source)" |
| 6 | campaigns: #BuiltForThis agency | LANDED | Clayman "HO Studios", "sister agency of 72 and Sunny", "likely Hecho Studios… single source: an auto-transcript" in answer, points[2], examples[6]. brief does not mention #BuiltForThis, so no mirror needed |
| 7 | campaigns: Connect 2025 dates | LANDED | Now sourced to Wayback capture 20251214135711 of events.cloudflare.com/connect/2025/overview (`reference`). Gate fetched it: "October 13-16, 2025", "Oct 13-16 · Aria Resort & Casino, Las Vegas" — verbatim |
| 8 | campaigns: Birthday Week visuals | LANDED | Kari Linder, in-house, "light as a metaphor for technology"; source cloudflare.tv/…/9Zdod8aj typed `owned`; points[6], examples[7] |
| 9 | campaigns: Connect 2025 look; #BetterInternet reading | LANDED | Connect 2025 gradients + illustrated skyline marked "Researcher's reading of Invision's own photos"; "#BetterInternet… far off" prefixed "Researcher's reading" |
| 10 | off-screen: Paint the Town Orange as planned; Greenhouse URL | LANDED | "returns it to Bay Area" absent; off-screen "describes a planned Q4 2026 OOH push… no evidence yet that it ran"; campaigns says "planned, not documented as run". Greenhouse URL cited (`owned`) in both; webhosting.today kept once in campaigns, titled as a third-party mirror |
| 11 | brief: Off-brand single source, IO image, redirect, rebrand.gallery | LANDED | All four in answer/points/gap; asset `2025-workers-platform-site-interface-office.webp` attached |
| 12 | brief: Creative Corner dating | LANDED | Both source titles "recorded c. 2020; rerun 4 Jan 2022 / 11 Mar 2023"; answer quotes "we kicked it off last July" and "a few months before going public" |
| 13 | Medium source → Wayback URL | LANDED | 24 of 24 `allati.medium.com` occurrences sit inside `web.archive.org/web/20201102102653/`; no live link left |
| 14 | design-rationale: icons salvageable; photography asset | LANDED | "was also one of the salvageable elements from our initial attempt" in answer; `2020-refresh-cf-woman-working.jpg` attached, 1600×983, 311 KB (was 6.8 MB PNG; old `.png` path absent) |
| 15 | rename collages | LANDED | `refresh-homepage` absent file-wide; `2020-pre-refresh-collage.png` / `2020-post-refresh-collage.png` on disk and in brief.assets |
| 16 | attach 2018-betterinternet-2/-6, stage-3 | LANDED | `-2` and `-6` in campaigns; `-6` also in off-screen; `stage-3` in campaigns |
| 17 | assetsIndex for strategy assets | LANDED | 25 `/strategy/` rows; 25 files on disk, 25 referenced; no file unreferenced, no reference unindexed, no index row missing a file; each has `what` + source |
| 18 | 10-K → `owned` | LANDED | Both uses (brand-idea, audience) typed `owned`; no `reference` 10-K left |
| 19 | perception: label social/blog; drop unused sources | LANDED | 60fps titled "social post", @yusufmohd72 titled "personal blog post (unaffiliated)", answer calls them "not critique"; Light Reading, Designing with AI, Wikipedia gone from perception |
| 20 | brief: drop unused sources | LANDED | "Redesigning CloudFlare" absent file-wide; EmDash absent from brief (remaining two uses are in origin and themes, out of scope) |

Assets read: `2025-connect-invision-stage-3.webp` (Prince on stage, Athenian Project slide, red-magenta-to-blue LED gradient, isometric globe — matches the "researcher's reading"), `2025-workers-platform-site-interface-office.webp` (monitor mockup, flat orange hero "Everything we learned from powering 20% of the Internet—yours by default", digit-texture field — matches), `2020-refresh-cf-woman-working.jpg` (woman in orange at a laptop with white radiating linework — matches), plus `2020-pre-refresh-collage.png` (old palette, icon grid, booths, #BetterInternet posters, old web comps — a collage, not a homepage; rename is right).

Validator:

```
✓ cloudflare — {"partial":5,"found":34}, 100 sources, 52 colours, 10 fonts
```

### Still open

No MUST-FIX item is open. Nothing fixed by gate. New, not edited (no review evidence settles them):

- **campaigns, Birthday Week:** the third Linder quote, "all of these illustrations are on light or white backgrounds", is not in the review's verified set.
- **brief, "exact hero":** the Interface Office mockup matches today's H1, but its subhead ("Cloudflare is your AI Cloud with compute, AI inference, and security…") differs from the live subhead the positioning answer quotes. "Exact hero" holds for the headline only.
- **off-screen, Light Reading:** listed as a source but never named in the answer; presumably backs the London/Singapore installations, but the answer does not say so.
