# Review: Rijksmuseum dossier — strategy layer

Reviewed 2026-10-22 against `src/research/brands/rijksmuseum.json`. Scope: the seven `strategy` answers (brand-idea, audience, brief, design-rationale, campaigns, off-screen, perception), the assets under `public/research/rijksmuseum/strategy/`, and source types across the whole file. The expression layer was reviewed and gated earlier; that review is kept at `_tmp/2026-10-22-reviews-before-strategy/rijksmuseum.md`.

How sources were checked: both annual reports were downloaded and searched as text. Emerce is behind a bot check, so its pages were read from Wayback captures (wire item 8 May 2026, Emerce TV item 17 Apr 2026). Frieze, Design Week and Brand New were also read from Wayback captures. Everything else was fetched live.

## Verdict

Needs fixes. The quotes are unusually solid: every Dutch quote checked is verbatim, correctly attributed and faithfully translated, and every annual-report figure matches the PDF. The problems are elsewhere. `brief` and `design-rationale` are marked `found` but do not meet their `ask`. A few dates and spliced quotes are wrong. Three source types are wrong. One claim in off-screen is contradicted by the dossier's own asset.

## Verified claims

| Claim | Source | Result |
|---|---|---|
| Mission "het verbinden van mensen, kunst en geschiedenis" (connecting people, art and history) | Jaarverslag 2024 PDF | Confirmed verbatim. Translation is faithful. |
| 2024: 2,406,210 visitors; 38% (903,515) Dutch, 62% (1,502,695) abroad | Jaarverslag 2024 | Confirmed. 2023 total 2,702,824 also confirmed. |
| 2024 visits "7.5% under budget" | Jaarverslag 2024 | Confirmed ("bleef 7,5% achter op de begroting"). |
| 2025: 36% (839,860) Dutch, 64% (1,461,141) international; 48% of Dutch visitors from the four big cities | Jaarverslag 2025 | Confirmed in the narrative text. The report's own appendix table gives slightly different figures (842,523 / 1,461,139, total 2,303,662 against 2,301,113 in the text). The dossier uses the narrative figures, which is fine. |
| "speciale aandacht wordt gegeven aan de groepen Jongvolwassenen en Families en kinderen"; young adults bound "structureel" | Jaarverslag 2024 | Confirmed. |
| "de eerste campagne voor het hele Rijksmuseum en de vaste collectie sinds de heropening in 2013"; "een breed publiek"; co-funded by the VriendenLoterij | Jaarverslag 2024 | Confirmed. |
| 2025: one umbrella for exhibition campaigns; "…stroomlijnen alsmede het merk Rijksmuseum meer emotioneel laden"; "directe conversie (kaartverkoop), met name onder een jonger publiek"; campaigns "buiten de Randstad" | Jaarverslag 2025 | Confirmed. The example is verbatim; the answer prose is not (see Wrong facts 5). |
| "Ontwerp Irma Boom Office (Julia Neller)" in the colophon of both reports; Boom Office designed American Photography | Jaarverslag 2024 and 2025 | Confirmed ("werd vormgegeven door Irma Boom Office"). |
| Rogier de Bruin, ECD ACE: "Ze hebben ons ook gevraagd het merk Rijksmuseum emotioneel te laden, zodat het groter wordt dan de optelsom van exposities" and "…neemt je mee op een wilde, vermakelijke en wonderlijke reis door de tijd en het leven" | Emerce Industry Wire (Wayback) | Confirmed verbatim. The second quote follows "De eerste campagne introduceert het nieuwe merkverhaal:". The wire item is a paid submission ("ingezonden bericht"), so `agency` is the right type. |
| Gerald van der Wijngaart, Brand Manager: "Het interessante is dat die reis voor iedereen anders is" | Emerce Industry Wire | Confirmed verbatim. |
| Nanet Beumer: "plezierbelever … het Efteling publiek dat een dagje uitgaat met een etentje"; 75% come for the permanent collection; 70m online reach | Emerce TV, Jan Libbenga, 19 Nov 2024 | Confirmed. Her title in the credits is "Hoofd Marketing, Digitaal en Campagnes", which the dossier's English renders fine. The source spells it "Rijsmuseum"; the dossier silently corrects that. |
| Credits: Bonkers United, director Femke Huurdeman, Ewoudt Boonstra, Stephen Fry / Monic Hendrickx; "op choreografische wijze"; ACE won the pitch | Adformatie, 4 Nov 2024; Emerce wire | Confirmed. |
| Taco Dibbits, Director of Collections: "belongs to us all" and "unleash the artist in everyone"; 125,000 works | ArtsProfessional, 12 Nov 2012 | Confirmed. |
| Boom: "My starting point … anchors the museum in the present" | Design Week, Angus Montgomery, 28 Aug 2012; Brand New capture | Confirmed. Design Week also has the 32-year Dumbar logo and the reader comments "Too bad it's misspelled." / "clever". |
| Brand New: "reptile with an amphibian…", "a vast typographic improvement", "a fine design. But nothing more … it just sits there", "idiosyncrasy"; the palette as "the DNA of the Rijksmuseum" | Brand New, Wayback 3 Nov 2012 | Confirmed. The DNA line comes from the press release reprinted by Brand New, so "the museum called" is correct. |
| Bold Monday: "only invited us to draw the type for the logo"; nine fonts, four of them for signage; "early sketches"; "slowly disappeared"; "strengthens its Dutch character"; Panno Text | boldmonday.com/en/rijksmuseum | Confirmed verbatim. |
| ATypI: "a predominantly typographical solution" | atypi.org | Confirmed. The speaker is Paul van der Laan of Bold Monday. |
| Monocle: "The Rijks have a lot of courage"; "I'm just making a logo"; "kill me because of the 'Ayee'"; "space police"; Van Dale editor; "realised only in black and white"; the swan and Milkmaid stripes | Monocle, Robert Bound, issue 62 | Confirmed. "Ballpoint pens … umbrellas" paraphrases Monocle's "Bic Biro" and "brollies", which is acceptable. |
| Frieze: "hard-to-dislike sans serif"; "small gap … clearer to non-Dutch speakers"; "locals 1 – tourists 1"; "a radical act of conciliation" | Frieze, Emily King (Wayback) | Confirmed. |
| AT5, 3 Sep 2012: hundreds of complaints, chairman "gigantische fout", Boom declined to comment on camera | at5.nl | Confirmed. |
| Volume: "It's a challenging job because it forces us to think in another way" | archis.org | Confirmed, and it is about the Rijksmuseum house style. **The date is 9 Mar 2012, not Feb** (see Wrong facts 2). |
| Studio Dumbar has done the museum's graphic design since 1980 | Bulletin van het Rijksmuseum, 1985 | Confirmed ("Sinds 1980 verzorgt hij de grafische vormgeving voor het Rijksmuseum"). |
| Art + Books page: "caused quite a commotion!"; "Irma Boom and her office design all the Rijksmuseum's graphic output"; a partnership of more than 20 years | Wayback 16 May 2026 | Confirmed. |
| ING flash mob in Breda; national TV in six countries; free entry on reopening day | Banken.nl, 12 Apr 2013 | Confirmed, but the example value is not verbatim (see Wrong facts 4). |
| Vermeer: 450,000 tickets | IamExpat | The number is confirmed. **The timing and the date are wrong** (see Wrong facts 1). |
| EDA 2021 Gold: "image first … one clear message per image" | awards.europeandesign.org | Confirmed. The credit goes to **Fabrique**; Q42 is named only as the CMS developer. |
| EMYA 2015 jury: "a great museum, at the height of its powers…" | ArchDaily, 28 May 2015 | Confirmed. |
| 2024 press release: 445,000 children; 7.2m website visitors; 58.5m social reach | rijksmuseum.nl press release | Confirmed. The release does not mention free entry under 18. |
| Magnum partnership, 23 Mar 2026, "experiences for young adults", Janneke van der Wijk, Director of Audiences | rijksmuseum.nl press release | Confirmed. **Heineken is not in it**, and no source in the dossier supports the Heineken claim. |
| POLSPOTTEN collection from 17 Oct 2025; Femke Diercks quote | rijksmuseum.nl partnership page | Confirmed. Diercks is Head of the Decorative Arts Department and curator of the exhibition. |
| NEXT architects pavilion, 2017; "modern and innovative framework" | nextarchitects.com | Confirmed. "Past security" and "about ten paintings" are not on the page. |

## Wrong facts

1. **campaigns: the Vermeer tickets did not sell out "within weeks of opening".** IamExpat says 200,000 were sold before opening, and "By February 11 - or day two … all 450.000 tickets had been sold". The article is dated 13 Mar 2023, not Feb 2023.
2. **brief: the Volume interview is dated "Feb 2012" in the answer.** It was published on 9 Mar 2012, and the example label and source title in the same answer already say Mar.
3. **off-screen: "Both use paintings, not the house style" is contradicted by the dossier's own asset.** `strategy/shop-new-amsterdam-collab.jpg` shows a co-branded lockup, the NewAmsterdam mark over the RIJKS MUSEUM wordmark with the IJ and the space. The surf-brand collab does carry the logo. Only the POLSPOTTEN statement can stand.
4. **campaigns: the flash-mob example value is a splice.** "De video verspreidde zich online in hoog tempo — over 1.5 million views" joins a Dutch sentence to an English paraphrase. The source has "ruim 1.500.000 views wereldwijd".
5. **brief: the 2025 annual-report quote in the answer prose is altered.** It reads "om de publiekscommunicatie beter stroomlijnen…". The source has "Met deze strategie wil het museum de publiekscommunicatie beter stroomlijnen alsmede het merk Rijksmuseum meer emotioneel laden". The word "om" was inserted inside the quotation marks.
6. **audience: two claims have no source.** "Heineken events" (and the "Rijksmuseum NEXT garden party" in the points) is not in any cited source, and the Magnum release does not mention Heineken. "Under 18s enter free" is not in the cited press release.
7. **design-rationale: "Fabrique/Q42's 'image first'" gives Q42 a credit it does not have.** The EDA entry credits Fabrique for creative direction, art direction, visual and UX design. Q42 built the CMS.
8. **off-screen: "past security, showing about ten paintings" is not in the NEXT source.** Source it or cut it.

## Thin answers

- **brief should be `partial`, not `found`.** The ask is the brief for the *current identity*: what was wrong with the previous identity, what changed, and what the rebrand set out to fix, quoted from the people involved. For the 2012 identity the answer itself says "No written brief from the museum has been published". What it offers instead is the reopening situation, the designers' scope (Bold Monday, ATypI), Boom's "think in another way", and Brand New's outside jab at the Dumbar mark. No one from the museum says what was wrong with the Dumbar identity or what the new one had to fix. The 2024 ACE material is a brief for brand strategy and campaigns, not for the identity, which ACE did not touch. Keep the content, set `partial`, and add a `gap`: no published museum brief, no museum statement on why the Dumbar identity was replaced, and ACE's brief covers the campaign layer only.
- **design-rationale should be `partial`, not `found`.** The ask names mark, colour, typeface, imagery and motion. Stated rationale exists for the IJ (Bold Monday), the typographic route (ATypI), palette = collection (press release) and web imagery (Fabrique, EDA). The answer itself admits there is no rationale for the space, the most debated feature of the mark, or for black-and-white-only. It also has none for replacing Documenta with a custom sans, and motion is not covered at all. Boom's "clear and powerful" is adjective-led, not a reason. Set `partial` and add a `gap` listing those four.
- **audience is missing "what each audience is meant to feel or believe".** It is strong on numbers and priorities. One line closes it: the Jaarverslag 2024 says the campaign aims "om een breed publiek aan te spreken en te laten zien dat de reis door het museum voor elke bezoeker anders is en er dus voor iedereen iets te ontdekken valt". Beumer's plezierbelever line already covers the leisure audience.
- **off-screen is missing packaging and images of the physical identity.** It omits the 2013 Albert Heijn dairy packaging, which carried the Boom identity (see Closable gaps). The ask wants images "where available", and the façade unveiling photo (Brand New) exists. None of the assets shows signage, print or the façade.
- **campaigns does not list exhibition posters.** "Exhibition poster credits are not published" sits unflagged in a `found` answer. The 2025 report credits Irma Boom Office with exhibition design (American Photography); say that much and stop.

## Closable gaps

- **Albert Heijn packaging, 2013 (campaigns + off-screen).** Design Week, Tom Banks, 12 Apr 2013: https://www.designweek.co.uk/issues/march-2013/irma-booms-rijksmuseum-food-packaging-brings-art-into-homes/ (live page is behind Cloudflare; Wayback capture 11 Sep 2024 works). Albert Heijn stocked dairy packs with 16 masterpieces: "The packaging comprises the new Rijksmuseum branding designed by Irma Boom and images of the artworks". The campaign ran until 5 May 2013 and gave discount coupons for entry. This is the clearest case of the identity used off screen, and it is press.
- **Designs of the Year 2013 shortlist (perception).** The same Design Week article says "Boom's Rijksmuseum branding was recently shortlisted in the Design Museum's Designs of the Year competition." It belongs with the awards in perception.
- **Phaidon, 28 Aug 2012 (perception/press).** "Irma Boom designs new Rijks Museum logo", which stresses the IJ. The phaidon.com URL now 404s and only a staging copy is indexed, so it is optional.
- **The space rationale is still unclosable.** I searched Dutch and English press: AT5, Volume, Monocle, Phaidon, Design Week, PRINT, AnOther. Boom's only words on it are the Monocle deflection. The dossier is right that none is published.

## Asset problems

- `strategy/irma-boom-art-books.jpg` is a generic blue-duotone photo of an open book: the exhibition page's share image. It shows nothing of the Rijksmuseum identity or Boom Office's work for the museum, so it adds nothing to off-screen. Replace it with something that shows the identity in print or space (annual report spread, exhibition graphics, the façade).
- `strategy/press-new-amsterdam-vermeer.jpg` shows a model in a blue jacket in front of a map. It has no Vermeer reference and no Rijksmuseum mark, and the filename oversells it. Drop it from campaigns; `shop-new-amsterdam-collab.jpg` already covers the collab and shows the lockup.
- `strategy/shop-new-amsterdam-collab.jpg` is a good asset, but it proves Wrong facts 3.
- `strategy/ace-moves-you-still.jpg` (woman floating in the Vermeer room) and `strategy/schiphol-holland-boulevard-next.jpg` match their claims. The Schiphol image shows the RIJKS MUSEUM wordmark on the intro panel, which is worth one line in off-screen.

## Axis problems

Not in scope this round.

## Strategy problems

- **Quote attribution:** clean. Every named-person quote checked (Boom ×6, De Bruin ×2, Van der Wijngaart, Beumer, Dibbits ×2, Vit ×3, King ×3, Diercks, the AT5 chairman) is said by that person at the cited URL. The two defects are the spliced flash-mob value and the "om" insertion (Wrong facts 4, 5).
- **Dutch translations:** faithful. The mission gloss "connecting people, art and history" is exact. The English glosses of Beumer and the annual-report lines keep their meaning.
- **Rationale and interpretation:** design-rationale keeps them apart well (Vit and King are labelled). Two lapses elsewhere. In audience, "Boom's 2012 brief to herself … names exactly this split" is the researcher's reading presented as fact. In brand-idea, the closing "the identity carries the 2012 idea; the 2024 idea lives in film and copy" is unlabelled interpretation. Mark both as interpretation.
- **Range beyond owned:** good. It uses Dutch trade press (Adformatie, Emerce, AT5, Banken.nl), design press (Brand New, Design Week, Frieze, PRINT, Monocle, Volume), awards (EDA, EMYA) and both annual reports. It missed the Design Week packaging piece and the Designs of the Year shortlist.

## Source-type problems

I checked every non-owned source in the file (about 45 entries) plus the owned ones outside rijksmuseum.nl.

- **Dutch Type Library — DTL Documenta (typefaces) is typed `agency`.** DTL made the *previous* corporate typeface, not the current identity. Retype it `reference`.
- **Thomas Eyck (t.e. 216 page and the DNA 20 swatch image) is typed `agency`.** Thomas Eyck produces and sells the Boom wallpaper; it did not make the identity. Retype both `reference`.
- **NEXT architects — Holland Boulevard is typed `press`.** It is the architect's own project page, not independent coverage. NEXT made the Schiphol environment. Retype it `agency`.
- **Brand New, Wayback capture is typed `reference`, while the live Brand New URL is `press`.** It is the same article; an archive copy keeps the type of what it archives. Retype it `press`.
- **Bold Monday as `agency`: correct.** It drew the logo lettering and the nine-font family under Boom's art direction, which is a core part of the identity.
- **ATypI 2013 as `agency`: acceptable.** The abstract describes a talk by Paul van der Laan (Bold Monday), so it is the type designer's own account. Keep it.
- **Q42 as `agency`: acceptable only for the website claims.** Q42 co-built the 2020 site and styleguide, part of the identity's digital expression, and its case page is the maker's own account. It is not the source for the "image first" design rationale, which should be cited to Fabrique via EDA.
- **Emerce Industry Wire as `agency`: correct.** It is a paid submission posted by ACE.
- **Fine as typed:** Waag (independent report), Bulletin van het Rijksmuseum (`owned`), the Wayback Art + Books page (`owned`), Fonts In Use and Wikipedia (`reference`), and IamExpat, DutchNews, Interior Design and Famous Campaigns (`press`).

## MUST-FIX

1. `brief`: set `status` to `partial`. Add a `gap` saying no museum brief for the 2012 identity has been published, the museum never stated why the Dumbar identity was replaced, and the ACE 2024 brief covers brand strategy and campaigns, not the identity. Places searched: Brand New, Design Week, PRINT, Volume, Monocle, ATypI, Bold Monday, AT5, Bulletin.
2. `design-rationale`: set `status` to `partial`. Add a `gap` listing what has no published rationale: the space in the wordmark, the black-and-white-only logo, replacing DTL Documenta with a custom sans, and motion.
3. `campaigns`: change "sold out within weeks of opening" to "sold out by 11 Feb 2023, the exhibition's second day (200,000 before opening)". Change the IamExpat source title date to 13 Mar 2023.
4. `campaigns`: replace the flash-mob example value with the verbatim "ruim 1.500.000 views wereldwijd" (label it with its English gloss).
5. `brief`: change "Feb 2012" in the answer to "Mar 2012" (published 9 Mar 2012).
6. `brief`: fix the 2025 quote in the answer prose to the source wording, "de publiekscommunicatie beter stroomlijnen alsmede het merk Rijksmuseum meer emotioneel laden", without the inserted "om".
7. `off-screen`: delete "Both use paintings, not the house style". Say that the New Amsterdam Surf Association collab is co-branded with the Rijksmuseum wordmark (asset `shop-new-amsterdam-collab.jpg`), and that the POLSPOTTEN page shows no house style.
8. `off-screen` and `campaigns`: add the Albert Heijn dairy packaging (Apr–May 2013, 16 masterpieces, "the new Rijksmuseum branding designed by Irma Boom"). Cite Design Week, Tom Banks, 12 Apr 2013 (URL in Closable gaps), typed `press`.
9. `perception`: add "shortlisted, Design Museum Designs of the Year 2013", same Design Week source.
10. `audience`: remove the Heineken / "Rijksmuseum NEXT garden party" claim from the answer and the points, or add a source that supports it. Remove "Under 18s enter free" or cite a page that states it.
11. `audience`: add what the audience is meant to believe, using the Jaarverslag 2024 line "laten zien dat de reis door het museum voor elke bezoeker anders is en er dus voor iedereen iets te ontdekken valt". Label "Boom's 2012 brief to herself … names exactly this split" as interpretation.
12. `design-rationale`: change "Fabrique/Q42's 'image first'" to "Fabrique's 'image first' (EDA 2021)".
13. `off-screen`: cut "past security" and "about ten paintings" from the Schiphol sentence, or cite a source that states them.
14. Assets: drop `strategy/irma-boom-art-books.jpg` from off-screen and `strategy/press-new-amsterdam-vermeer.jpg` from campaigns. Add one image of the identity in physical use, either the façade unveiling photo (Brand New) or an Albert Heijn pack.
15. Source types: retype Dutch Type Library → `reference`. Retype both Thomas Eyck entries → `reference`. Retype NEXT architects → `agency`. Retype the Brand New Wayback capture → `press` in all five answers that cite it.
