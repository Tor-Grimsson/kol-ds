# Review: github (GitHub brand toolkit + GitHub-BrandGuidelines-2026.pdf)

Reviewed 2026-10-22 against the live site (all 25 pages fetched and read), the PDF (downloaded, all 89 pages OCR'd, key pages viewed) and the 12 assets.

## Verdict

**Needs fixes.** The dossier is accurate on nearly everything it states and the chapter list is the real table of contents. No wrong numbers or colour values found. The problems are omissions from the PDF (it holds specs the answers say are absent or leave out), one mistyped chapter, a maker credit the guide does not make, and weak or unverifiable outside sources.

## Chapters check

- 25 pages, 6 sidebar sections, titles verbatim, order matches the sidebar (A-Z inside each section). No chapter missing, none invented.
- Sizes spot-checked and right: Logo 6 sections / 16 images (alt count 16), Color 3 palettes x 13 swatches, Motion Overview 8 sections, 9 Mona Pixel GIFs.
- Type problem: **Copilot (ch. 4) is typed `naming`.** The page holds sub-brand lockups, a deprecated logo, a palette and a mascot. Nothing is about naming. Use `logo`.
- Coverage gap: the PDF's own contents (4 parts) is only in the `structure` answer. PDF-only material (sub-branding and Security lockups, pp.25-38; booth budget tiers and lighting, folios 90-91) appears in no chapter and in the `applications` answer only partly.

## Verified claims

| # | Claim | Result |
|---|---|---|
| 1 | Invertocat clear space "Keep a clear space of 25% for all placements." (PDF p.17, 1.0X / 0.25X) | Confirmed. Text is in the image; web logo page has only the alt text "Invertocat clear space guide" |
| 2 | Lockup "Keep a clear space of 50% height for all placements." (PDF p.18) | Confirmed |
| 3 | No minimum logo size anywhere | Confirmed (site, OCR of pp.15-42, zip page) |
| 4 | Logo colours "white, black, or in few cases grey or green" | Confirmed (web) |
| 5 | Six logo misuses; deprecated marks 2012-2015, 2015-2025, 2008-2012, 2012-2025, Copilot 2025 | Confirmed (page text and alt text) |
| 6 | GitHub Green #0FBF3E / 15,191,62 / 92,0,67,25 / 360 | Confirmed (site and PDF p.51) |
| 7 | Site Gray 1-6 (#F2F5F3 to #101411), PDF Gray 0-9 (to #121613) | Confirmed |
| 8 | PDF White reads HEX FFFFFF, RGB 225/225/225 | Confirmed (guide's own error) |
| 9 | Copilot Purple #8534F3 (2685), Security Blue #3094FF (279) | Confirmed |
| 10 | Ratios 80/10/5/5 (themes, image alt) and 90/10 (PDF p.51) | Confirmed |
| 11 | Type scale H0 110/110 Display, H2 38/44 Medium, Body Large 17/26 Medium, Body Main 15/25 Regular, pullquote Mono 58/68 | Confirmed (PDF p.73) |
| 12 | "V2.08+ ... OPSZ axis" (PDF p.73); "OPS2" quote on web | Confirmed (both as written) |
| 13 | Four type don'ts, four texture don'ts, three mascot do/don't pairs, four booth dos | Confirmed |
| 14 | Accessibility "Do not re-scale text sizes" vs Typography "simply a starting point" | Confirmed contradiction |
| 15 | "Tag PDFs properly..." vs PDF: Tagged: no, image-only | Confirmed (`pdfinfo`) |
| 16 | PDF 89 pages, 1920x1080 pt, 37 MB, created 13 Jan 2026; folios run to PG 92; p.51 = PG 54 | Confirmed |
| 17 | PDF contents ranges (1-14, 15-38, 39-42, 43-51, 52-57, 58-64, 65-70, 71-73, 74-85, 86-91) | Confirmed (p.2) |
| 18 | Contact brand-marketing-design@github.com (PDF p.89) | Confirmed |
| 19 | Layout: key art 1/3, 1/2, 2/3; one accent border; "margin can vary when appropriate" | Confirmed (web image and PDF p.82) |
| 20 | Voice page stub; linked doc github/brand/docs/how-to-write-at-github.md | Confirmed, 404 |
| 21 | Presentations "For GitHub Staff only"; Web "Samples coming soon." | Confirmed |
| 22 | Co-branding FAQ answers (Hosted with GitHub, swag, landing page, product names) | Confirmed |
| 23 | Motion: five named transitions, no ms/easing/fps, "No slapping, rolling, or bouncing" | Confirmed |
| 24 | Copy slips "Imaginitive", "clear queues", "heirarchy" (image), garbled Product UI paragraph | Confirmed |
| 25 | Octicons PR #1146 merged 13 Jan 2026 | Confirmed |
| 26 | BUCK quote "evergreen toolkit for GitHub's communications"; abduzeedo "branding system with longevity", 7 Nov 2024; Made Good Designs "very on-brand, developer-friendly move", 26 Aug 2026 | Confirmed (Made Good quote is about Primer, not the toolkit) |
| 27 | BUCK Universe 2023 "shape library" | Unverifiable. The 2023 page says icons, animations and a "brand toolkit"; no "shape library" |
| 28 | Maker "Mona Sans with Degarism" and BUCK credit | Not stated by the guide (see MUST-FIX 4) |

## Wrong facts

None outright. Statements that are incomplete or unsupported:

- `type` says tracking is left to the optical-size axis. The PDF type specs (pp.75-77) give letter-spacing values (eyebrow "18, Regular, LS: 1px, uppercase"; footnote 12/12 with LS) and a "LETTER TRACKING 0 / -.5px" spec. The don't is about manual tracking, not an absence of tracking values.
- `elements`/`layout` say no numeric values. The PDF gives border weights (2 px and 4 px, p.80) and icon size bands.
- `colour` labels the fifth value "Pantone". The PDF calls it SPOT. PDF and site also disagree on spot values (site Gray 2 #E4EBE6 = 441; PDF Gray 1 #E4EBE6 = Cool Gray 2).

## Status problems

- `format`, `structure`, `rule-style` are `found` on owned sources only. The validator exempts the "document" part, so this passes. It is a reading call, not a bug.
- `logo` is `partial`, and the only missing item is a minimum size. The rest of the `ask` is fully answered. The partial is driven by the no-outside-source rule, but the `gap` text does not say so. Add one sentence to `gap`.
- `colour`, `type`, `elements` are `found` and earn it from the guide. Their agency/press sources are thin: abduzeedo is about Universe, not colour; fontsinuse is about the 2022 homepage.
- `omissions` `gap` says no agency or press source discusses omissions but lists a `reference` source (logos.fandom.com, returns 403, unverifiable).

## Website-not-guide problems

The guide is itself a website, so the site is allowed. Items that lean outside the guide:

- `type`: licence "SIL Open Font License", release history (Dec 2022, v2.0.08) come from github.blog and the mona-sans repo, not the guide. Label them or move them out.
- `colour`: primer.style/brand/primitives/color source is Primer's tokens, not the toolkit.
- `format`: the "Dating" point (PDF date matches octicons PR #1146) is inference from a repo PR. It is labelled, but keep it clearly separate.

## Closable gaps

- `logo` min size: genuinely absent (checked). Gap stands.
- `motion` timings: genuinely absent in the web pages. The PDF has no motion section. Gap stands.
- `voice`: private, stays partial.
- `applications`: PDF folios 88-91 hold three booth budget tiers (lightweight, mid-tier, premium), "other considerations" and lighting. Add these. They do not close the stationery/signage/packaging gap.
- `imagery`: the PDF has no photography section either (OCR checked). Gap stands.
- `type` fallback/system fonts: not in the guide. Say so in the answer. The ask lists it and the answer is silent.

## Asset problems

All 12 assets open and read correctly. Page labels match: p.2, 17, 18, 20, 51 (PG 54), 54 (PG 57), 73 (PG 76), 84 (PG 87). All 12 are indexed. No broken, unreadable or mislabelled files. No asset covers `story`, `voice`, `motion`, `imagery`, `applications`, `strengths` or `omissions`. That is acceptable, but PDF p.80 (borders) and the icon-size page would strengthen `elements`.

## Source-type problems

- `github.com/FortAwesome/Font-Awesome/issues/21500` typed `reference` and cited under `logo`: a third-party issue about an outdated icon. Weak. Drop it or move it to `format` (dating).
- `logos.fandom.com/wiki/GitHub` typed `reference`: user-edited wiki, 403 to fetch. Drop it.
- `madegooddesigns.com` typed `press`: it is a blog about Primer tokens. Keep it, but it does not count as evidence the toolkit is praised.
- `github.com/primer/octicons/pull/1146`, `github.blog`, `github.com/github/mona-sans/releases`, `primer.style` typed `owned`: right.
- `buck.co` x2 typed `agency`: right.

## MUST-FIX

1. Change chapter 4 (Copilot) `type` from `naming` to `logo`.
2. `type` answer: replace "tracking is left to the optical-size axis" with what the PDF says. Add the Regular/Medium weight rule, H1 80/78, and eyebrow "18, Regular, LS: 1px, uppercase" (PDF pp.74-77). State that the guide gives no fallback or system fonts. Label the licence and release-history points as from github.blog / the mona-sans repo.
3. `elements` answer: add the PDF icon sizes (Octicons 24px, spot icons 60px, marketing icon bands 16-30 / 31-54 / 55-96 / 128+ px, PDF folio 67) and border weights 2 px and 4 px (PDF p.80, PG 83). Fix the "no numeric values" wording.
4. `guide.maker`: the guide never names BUCK or Degarism. Keep "GitHub Brand Studio" as the maker. Move BUCK and Degarism to a labelled "inferred from BUCK case studies / GitHub blog" note. Drop "shape library" for Universe 2023, which BUCK's page does not say.
5. `logo` quote "Keep a clear space of 25%..." cites the web logo page where it exists only inside an image. Re-cite it to PDF p.17 (`#page=17`). Add one sentence to `logo.gap` saying the partial status is because no outside source covers the logo.
6. `omissions`: remove the logos.fandom.com source and the sentence that contradicts the gap text. Remove the FortAwesome source from `logo`.
7. `applications`: add the PDF booth budget tiers and lighting guidance (folios 90-91), and fix the "pp.83-88" range to cover folios 87-91 (PDF pp.84-88).
8. `colour`: add that the PDF labels the fifth value SPOT and that PDF and site spot values differ for the same hex (e.g. #E4EBE6). Add as one point next to the Gray ramp mismatch.
9. `format`: add that the PDF's sub-branding pages carry the running header "2025 BRAND REFACTOR" while the rest says "2026 BRAND GUIDELINES" (OCR of PDF pp.25-38, 2025 vs 2026 in the page headers). This matters for the edition claim.
10. `strengths`: the Made Good Designs quote is about Primer tokens, not the guide. Either drop it from `points` or label it as off-topic in the summary. The summary already says "outside comment covers its parts", so cut the quote and keep the BUCK and abduzeedo ones.
