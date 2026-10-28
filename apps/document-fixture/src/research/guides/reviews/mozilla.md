# Review: mozilla

## Verdict

**Needs fixes.** Chapters, colour values, type scale and most quotes check out against the July 2019 captures. But the logo answers quote a later, rewritten edition of the page while citing the 2019 URLs, several agency quotes are cited to a page that does not contain them, and some assets are weak or mislabelled.

## Chapters check

Compared against the sidebar of the 21 Jul 2019 capture (identical on all six pages): 01 About, 02 Personality, 03 Logo & Usage, 04 Color, 05 Visuals, 06 Typography. Complete, in order, titles verbatim, no invented chapters. Types are acceptable (Personality as `strategy`, Visuals as `illustration`, Logo & Usage as `logo` although it also holds naming and copy rules; that is a defensible single choice). Per-chapter `source` URLs resolve. "Logo is longer than the rest combined" holds once nav boilerplate is stripped (about 7k characters of content against about 4k for the other five).

## Verified claims

| # | Claim | Source checked | Result |
|---|---|---|---|
| 1 | Audience line "anyone using the Mozilla brand for any marketing, communications, or inter-company messaging" | About, 2019 | confirmed |
| 2 | Footer "©1998–2019 ... Creative Commons" | About, 2019 | confirmed |
| 3 | Four traits and their one-liners; "Be playful, be weird, appeal to the imagination." | Personality, 2019 | confirmed |
| 4 | Clear space marked "1/2"; minimum "95 px" and "0.59 in / 15 mm" | figure `03-logo-clearspace-minsize-scaling.png` | confirmed (values only in the figure; text has no unit) |
| 5 | Lockup: "Zilla SemiBold placed flush left above the wordmark"; secondary text "3/5 the height of the logo" | Logo & Usage, 2019 | confirmed |
| 6 | Icon "reserved for social media applications, favicons..." | Logo & Usage, 2019 | confirmed |
| 7 | Four copy patterns (Creation / Product / Projects by / Supported by) | Logo & Usage, 2019 | confirmed |
| 8 | "Our logo lockups never include qualifying language..." | Logo & Usage, 2019 | confirmed |
| 9 | Colour table: Black CMYK 30/20/20/100, Lemon Yellow fff44f, Warm Red ff4f5e, Neon Green #54ffbd, Dark Purple #6e008b, 4 secondaries with Pantone/CMYK/RGB/HEX | Color, 2019 | confirmed (7 primaries, 4 secondaries) |
| 10 | Neon Blue CMYK "0 / 75 / 11/ 0" next to #00ffff, a mismatch | Color, 2019 | confirmed as printed; "likely typo" is a fair label |
| 11 | Type scale XXL 76/76 down to XXXS 18/20, Zilla Slab Bold, "as used on this website" | Typography, 2019 | confirmed |
| 12 | 12 Zilla styles incl. Highlight Regular/Bold; description quote "casual and contemporary slab serif..." | Typography, 2019 | confirmed |
| 13 | Visuals: one sentence, three images | Visuals, 2019 | confirmed |
| 14 | Governance quotes ("approved the brand guidelines library downloads section", "reach out to our brand team or FAQ section") | About, 2019 | confirmed (typos are verbatim) |
| 15 | `Mozilla_Logo_Animation.gif` and `Mozilla_Logo_Static.png` under "Typing out the logo" | Logo & Usage HTML | confirmed |
| 16 | mozilla.design 301s to brand.mozilla.com/all-brands | live HEAD request | confirmed |
| 17 | "the new identity has reached a level of enthusiasm that wasn't achieved in 2017" (Transform) | transformmagazine.net | confirmed |
| 18 | "world's first genuinely open-source rebrand"; "guidelines haven't started in earnest" | It's Nice That | confirmed |
| 19 | Tim Murray: neon "didn't seem practical for use in the user interface" | Mozilla Open Design, Roads not taken | confirmed |
| 20 | "Building the logic and rules into the font..."; Highlight weight / counter shapes | Zilla post | confirmed |
| 21 | Dezeen "imagery collective" | Dezeen | confirmed |
| 22 | "PLEASE NOTE THAT THE MOZILLA LOGO CONSISTS OF THE WORD INSIDE A SURROUNDING RECTANGLE" | not in 2019 capture; present in a later capture only | wrong edition (see below) |
| 23 | "Do not use this logo on black or dark backgrounds! ... white rectangle" | not in 2019 capture; later capture only | wrong edition |
| 24 | "Typing the word 'Moz://a' using the Zilla font does not constitute our logo." | not in 2019 capture; later capture only | wrong edition |
| 25 | Peter Biľak and SIL Open Font License as Zilla credits | cited Zilla post names Djurek only; no Biľak, no OFL | unverifiable from cited sources |
| 26 | johnson banks "Brand Impact Awards ... Highly commended" x2; "champions for a healthy Internet" positioning line | johnsonbanks.co.uk case study is JavaScript-only; not found in It's Nice That, Dezeen, Computer Arts stub | unverifiable (Mozilla's own blog does call itself "the nonprofit champion of a healthy Internet") |

## Wrong facts

1. **Edition mix-up.** The `logo` answer, `omissions`, `rule-style` and `voice`/`elements` examples quote text that is not on the July 2019 Logo & Usage capture they cite. The "Box rule", "Backgrounds" and "Typed vs logo" examples come from a later revision (Wayback `/web/2025/` resolves to a 2026 snapshot). The later page differs in several places: it adds the "PLEASE NOTE..." paragraph, rewrites Background colors, drops "or type out 'mozilla' using Zilla Slab Highlight Bold" from Logo do's, changes "highlight shape" to "surrounding rectangle", and adds "Do not use the word Mozilla without its surrounding box." The July 2019 text says "black shape" and "one color white logo" instead. The logo summary's "distinctive rule" (typed moz://a without the box "does not constitute our logo") is therefore the later edition's rule; in 2019 the guide actively encouraged typing the logo.
2. **Misuse figure described wrongly.** `rule-style` lists "recoloured cyan, outlined, no box, wrong typeface, drop shadow, 3D". The figure shows: cyan text on black, cyan box, no box, a different typeface in the box, drop shadow, 3D extrusion. There is no "outlined" version.
3. **"No accessibility or contrast guidance"** (`omissions`). The 2019 page does carry a contrast rule for the logo: "Do make sure the logo has enough contrast with the background." and "Do not place the logo on a busy background." It is thin, but it exists.
4. **Quotes credited to the johnson banks case study that are in It's Nice That.** "a very flexible system", the "typewriter" slab rationale, the online-gallery promise, "type, messages, images" and "digital collage" all appear in the It's Nice That article (18 Jan 2017), which quotes the agency. They are cited to `johnsonbanks.co.uk/work/mozilla`, which cannot be read without JavaScript. The words are real; the citation is not verified.

## Status problems

- `story` partial: fair. Our own check found no mission or audience text beyond About's Who/Why. Note About does carry a Why paragraph (value of consistent use); the answer says "one line of purpose", slightly underselling it.
- `voice` partial: correct, but note the 2019 Logo & Usage text has no "type it out" rule in the Don'ts, so the "typing" voice-adjacent point depends on edition.
- `omissions` found: earned apart from the contrast overreach above.
- `strengths` partial: honest. No review of the guide itself was found; I could not find one either.
- `rule-style`, `structure`, `format`, `colour`, `type`: `found` is earned.
- `elements` partial: OK, but the `gap` text ("no figures with values survived") is not shown to be true; icon clear-space and minimum-size figures exist on the page (`IconDo_*`, `IconDoNot_*`) and were not opened.

## Website-not-guide problems

The guide is itself a website, so site content is legitimate. Two leans worth fixing:

- `motion` leans on `protocol.mozilla.org` (a separate product design system) for the claim that UI rules lived elsewhere. It is background, not guide content; keep it out of `points` or label it as outside.
- The type scale is the site's own CSS "as used on this website". The guide says so; the dossier flags it. Fine, but `type` should not imply it is a brand-wide scale.

## Closable gaps

1. `elements`: open the icon figures (clear space, minimum size) from the Logo & Usage page and record the values; the gap claims none exist.
2. `strengths`: add the It's Nice That quotes as the correct source for the agency lines; consider Brand New / Under Consideration once more for a post-launch comment on the guide (not found by me either, so keep partial if still absent).
3. `governance`: the 2026 page has "Link" anchors beside each logo zip; check whether the later edition adds contact or versioning.

## Asset problems

All seven files open and are readable.

- `06-type-zilla-specimen.png` is only the large "Aa" glyph (the page's `Aa.png`). It is not a specimen: it shows neither the 12 styles nor the type scale.
- `05-visuals-collage.jpg` is named "collage" but is one illustration beside a newsletter sign-up form; the name misleads. It appears to be one of the three Visuals images, not the whole page.
- `04-colour-combinations.png` shows unlabelled swatches only. Nothing in the asset set shows the palette values or the 7 + 4 structure.
- `03-logo-lockup-spelling.png` shows the primary lockup and the "champion" card. It is cited under `elements` for the 3/5 secondary-text lockup and icon placement, which it does not show. The guide has `Lockup-2Box-1.png`, `Lockup-3Box-2.png` and the `IconDo_*` files that do.
- No asset for About, Personality or the Mozilla icon section.
- Index entry for `03-logo-improper-usage.png` is correct; others carry correct chapter numbers (this guide has no page numbers).

## Source-type problems

- `blog.mozilla.org/opendesign/...`: `owned` is right.
- `protocol.mozilla.org`: `owned` is right but it is not the guide.
- `en.wikipedia.org/wiki/Zilla_Slab`: `reference`, right.
- `johnsonbanks.co.uk/...`: `agency`, right, but unreadable (see Wrong facts 4).
- `creativereview.co.uk`, `transformmagazine.net`, `dezeen.com`, `itsnicethat.com`: `press`, right.
- `web.archive.org/.../files/2019/06/...png` figure sources: typed `owned`; acceptable.
- No wrong types found.

## MUST-FIX

1. Re-source the logo answer by edition. Move the "Box rule", "Backgrounds" and "Typed vs logo" examples to a later-edition URL with its date, or replace them with the July 2019 wording ("Our primary logo ... black containing shape ... use the one color white logo"; Do "type out 'mozilla' using Zilla Slab Highlight Bold"). Rewrite the logo summary's "distinctive rule" sentence accordingly.
2. Add to `guide.edition` that the Logo & Usage page was revised after July 2019 (box rule added, typing rule removed) and say which edition each quote is from.
3. In `rule-style`, change the misuse list to: cyan text, cyan box, no box, wrong typeface, drop shadow, 3D.
4. In `omissions`, replace "No accessibility or contrast guidance" with "no contrast guidance for colour; only the logo-on-background line 'Do make sure the logo has enough contrast with the background.'" Mirror that in `colour` if it says no contrast rules.
5. Re-cite the quotes "very flexible system", the "typewriter" rationale, the gallery promise, "type, messages, images" and "digital collage" to the It's Nice That article (add it as a source on `strengths`, `type`, `imagery`, `elements`), or remove them.
6. Drop or verify the "Brand Impact Awards ... Highly commended" lines and "champions for a healthy Internet" attribution to johnson banks; if unreadable, say so in `gap`.
7. Drop Peter Biľak and "SIL Open Font License" from `type`, or cite a source that states them (the cited Zilla post names only Djurek).
8. Replace `06-type-zilla-specimen.png` with a capture of the Typography page showing the style list and type scale; rename or replace `05-visuals-collage.jpg`; add a labelled palette capture for colour.
9. Remove `03-logo-lockup-spelling.png` from `elements` or add the real secondary-text and icon lockup images (`Lockup-2Box-1.png`, `Lockup-3Box-2.png`, `IconDo_*`) and index them.
10. Open the icon clear-space and minimum-size figures and record values, or correct the `elements` gap sentence.
