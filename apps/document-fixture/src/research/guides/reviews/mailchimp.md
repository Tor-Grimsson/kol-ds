# Review: mailchimp

## Verdict

**Needs fixes.** Chapters are accurate and the quotes I could check are verbatim. The problems are a few wrong or misfiled facts in `omissions`, one gap that was never closed (the logo zips), and some unverified press claims. Nothing structural.

Method note: the Content Style Guide pages and the Brand Assets page were re-fetched live. The 2018 microsite was read from the Wayback snapshot of 2020-01-01. The press sources (GatherContent, Fonts In Use, Creative Review, Brand New, COLLINS, GitHub stats) were not re-opened and are marked unverifiable.

## Chapters check

- Brand Assets (ch. 1-7): headings match the live page exactly and in order (Brand Assets, Our name, Our logo, Our colors, The fine print, Download, Brand Assets FAQ). Complete.
- Content Style Guide (ch. 21-38): welcome page plus 17 nav sections in the live order and with verbatim titles. Complete. The per-chapter word counts add up to about 13,400 words, which matches `guide.format`.
- 2018 microsite (ch. 8-20): the order and titles match the snapshot. One omission: the page's hero heading "Crafting Mailchimp's new look" and its deck ("Mailchimp has a new brand identity and design system.") is not a chapter. It should be a chapter, or `note` on ch. 8 should say it is folded in.
- Ch. 7 (Brand Assets FAQ) is generic SEO copy, not guide content. It is flagged as such, but it is still counted as a chapter. Keep it, but label it clearly, or move it out.
- Types: all fine except as noted under Source-type problems.

## Verified claims

| # | Claim | Source | Result |
|---|---|---|---|
| 1 | Cavendish Yellow #FFE01B, Peppercorn #241C15 | brand-assets-colors.jpg | confirmed (in the image only; the page text gives no hex) |
| 2 | 14 secondary swatches, 5 functional, 4 background, 5 accent, hex values | design-2018-secondary-palette.jpg | confirmed, all 14 values match |
| 3 | "We always pair our company name with the Freddie icon" / reverse on dark | Brand Assets | confirmed |
| 4 | "Provide plenty of space around the Mailchimp logo and Freddie" | Brand Assets | confirmed |
| 5 | Cooper Light is the brand typeface; "dusty old funk records" quote | 2018 microsite | confirmed |
| 6 | Credits COLLINS and R/GA | 2018 microsite | confirmed |
| 7 | Four voice headings: plainspoken, genuine, translators, dry humor | Voice and Tone | confirmed |
| 8 | "same voice all the time, but your tone changes"; the dry-humor paragraph | Voice and Tone | confirmed |
| 9 | Freddie "smiles, winks, and sometimes high-fives, but he does not talk" | Voice and Tone | confirmed |
| 10 | "never break up our name"; never "chimp" alone; no ape imagery; never personify Freddie | Writing about Mailchimp | confirmed |
| 11 | Word list: automagical, leverage, thought leader, ninja/rockstar/wizard/unicorn, crushing it; "defer to the AP Style Guide" | Word List | confirmed |
| 12 | Copyright example "© 2001-2015 ... The Rocket Science Group"; "almost always uses original images in our blog posts" | Copyright and Trademarks | confirmed |
| 13 | TL;DR buttons: "Capitalize every word, including articles" vs Web Elements "use sentence case" | TL;DR, Web Elements | confirmed contradiction |
| 14 | TL;DR "title case for headings and sentence case for subheadings" vs Web Elements "Headings and subheadings are written in sentence case" | TL;DR, Web Elements | confirmed contradiction, but the dossier quotes only the first half |
| 15 | Twitter 280 characters; hashtags "rarely and deliberately"; no trending hashtags | Writing for Social Media | confirmed |
| 16 | "Organize your page around one topic"; form titles title case / fields sentence case | Web Elements | confirmed |
| 17 | Underline/italic/bold/caps rule | TL;DR | confirmed |
| 18 | Framework: persistent vs expressive; "Consistent and grounded" / "Playful and expressive" | 2018 microsite | confirmed |
| 19 | Wordmark "lives exclusively alongside Freddie"; icon "simplified... at any size" | 2018 microsite | confirmed |
| 20 | Brand Assets FAQ is generic and the page gives no hex in text | Brand Assets | confirmed |
| 21 | GitHub created 2015-07-15, pushed 2022-05-04, 559 stars / 238 forks | GitHub | unverifiable (not opened) |
| 22 | Means replaced Cooper Light ~a year after launch | Fonts In Use | unverifiable |
| 23 | Round table "around 10 people... meets once a month" | GatherContent | unverifiable |
| 24 | COLLINS value-strategy quote, "outsider art" quote | COLLINS case study | unverifiable |

## Wrong facts

1. `omissions` points: "social channel list still names Twitter and Tumblr" is wrong. The four channels are Twitter, Facebook, LinkedIn and Instagram. Tumblr appears only in a note about team-specific accounts "on Twitter, Tumblr, Dribbble, and other platforms". "Twitter" being a stale name is fair; Tumblr is not.
2. `omissions` points: the headings contradiction is quoted as "TL;DR 'Use title case for headings'". The full TL;DR line is "Use title case for headings and sentence case for subheadings." Quote it in full, or the reader cannot see that subheadings are the half that agrees.
3. `omissions` points: "GatherContent's 2019 'technical content... 8 templates' section is gone" was not checked against the guide. It cannot be tied to a page in the sources.

## Status problems

- `omissions` is marked `found` but carries press opinions as if they were omissions: the Web Designer Depot "Initially I hated the new logotype..." line and the "The type is debatable." example. These are reception, not absences. They belong in `strengths` or in a note, not in `omissions`.
- `elements` is `not-found` with no `points`; that is acceptable. But the gap text says "all Content Style Guide sections" were checked for icons and patterns. That is the writing guide, which could not contain them, so it adds nothing. The real evidence is the Brand Assets page, the zips and the 2018 microsite.
- `format`, `structure`, `story`, `strengths`, `governance` and `omissions` are `found` and earn it (they cite press). `logo`, `colour`, `type`, `imagery`, `motion` and `applications` are correctly `partial`.

## Website-not-guide problems

- Brand Assets is mailchimp.com's own page, but it is the only public visual-rules page, so it counts as the guide. The FAQ (ch. 7) is marketing SEO and should not be used as evidence anywhere. It is not used, which is good.
- `format` says "Brand Assets page live 2026 with Intuit Mailchimp lockup". The date comes from the research date, not a date on the page. Rephrase as "current as read on 2026-10-22".
- `motion` leans on Content Style Guide UI-copy rules (button copy, forms, header levels) as if they were motion material. They are web-element writing rules, not motion. Say so, or drop them and keep the answer at one paragraph plus a clear gap.

## Closable gaps

1. Logo gap: "both download zip links (listed, not opened)". Open the EPS and PNG zips and list what is inside (variants, colourways, any README or usage sheet). That may close or reduce the missing-variants part of the gap.
2. Motion and elements gaps: "Mailchimp's separate product design system, not checked". Search for it and say whether it is public. If it is, that closes UI-element gaps. If not, record that it was looked for and absent.
3. Type gap: Means is "not named in any Mailchimp guide page". Re-check the current Brand Assets page and zips for a font file or name before closing.
4. Colour gap: the guide's accessibility section links "Accessible Color Combinations" in Further Reading. Follow that link and say what it is. The dossier says the guide sets no rule, which is true of the guide, but the link target is the closest thing to a contrast rule.

## Asset problems

All 10 files exist, open, and are indexed in `assetsIndex`. Labels match what I saw, with these notes:

- `design-2018-framework-spot.jpg`: a spot illustration of three shapes with faces. It illustrates the section, but it shows nothing of the framework. Label it as "illustration used under the framework heading" so it does not read as evidence of the rule.
- `design-2018-cavendish.jpg` and `brand-assets-colors.jpg` both show #FFE01B; that is fine, one is 2018 and one current.
- `brand-assets-reverse-do-dont.jpg`: both panels are light-on-black Intuit Mailchimp lockups. The left is crossed out, the right is ticked. The label's "inverted positive (crossed) vs purpose-drawn reverse (ticked)" is plausible but not self-evident from the image; hedge it ("crossed vs ticked") or note it is read from the page's caption.
- `design-2018-cooper-light.jpg`: "Aa" specimen, first frame of a GIF, labelled correctly.
- No broken, unreadable or unindexed assets. No page numbers apply (web guide).

## Source-type problems

- GatherContent (blog) is typed `press`. It is a vendor blog; defensible, but `reference` would be more honest for the round-table and "own style" claims.
- COLLINS case study is `agency`: correct. Wikipedia `reference`: correct. GitHub and styleguide pages `owned`: correct.
- The Wayback Machine snapshot is typed `owned` in several answers. It is Mailchimp's own page, archived. Acceptable, but name the snapshot date in the source title wherever it appears.

## MUST-FIX

1. In `omissions`, delete the claim that the social channel list "still names Twitter and Tumblr". Replace with: the list names Twitter (not renamed X) and the four channels Twitter, Facebook, LinkedIn, Instagram; Tumblr appears only in a team-accounts aside.
2. In `omissions`, quote the TL;DR headings line in full: "Use title case for headings and sentence case for subheadings." against Web Elements "Headings and subheadings are written in sentence case."
3. In `omissions`, remove or substantiate the "GatherContent... 8 templates section is gone" point; cite a page for it or delete it.
4. In `omissions`, move the Web Designer Depot "hated the new logotype" and "The type is debatable." lines out of the omissions examples into `strengths` or a reception note.
5. Open the two logo zips (EPS, PNG) and update the `logo` answer and its gap with what they contain, or state that they were opened and hold only logo files.
6. Check whether Mailchimp's product design system is public and record the result in the `motion` and `elements` gaps; drop "not checked".
7. Follow the "Accessible Color Combinations" link from Further Reading and state what it is in the `colour` gap.
8. Add the page hero "Crafting Mailchimp's new look" as a chapter before ch. 8 (or state in ch. 8's `note` that it is included), and renumber.
9. In `motion`, stop presenting button, form and header rules as motion examples; label them "UI copy, not motion" or remove them.
10. Reword `guide.edition` "Brand Assets page live 2026" to "as read on 2026-10-22".
11. Relabel `design-2018-framework-spot.jpg` in `assetsIndex` as an illustration under the framework heading, and soften the do/don't label for `brand-assets-reverse-do-dont.jpg`.
12. Retype GatherContent as `reference` (or justify `press`), and add the snapshot date to Wayback source titles.
