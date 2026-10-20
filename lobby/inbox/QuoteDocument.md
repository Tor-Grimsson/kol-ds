---
component: QuoteDocument
source: kol-atlas — three standalone HTML mockups, copied to lobby/_assets/2026-10-20-quote-document/ (v1-original · v2-invoice-synced · v3-split, each with a Chrome-printed PDF)
staged: 2026-10-20
status: draft
deps: [kol-brand Asset (kol-lockup-hori)]
---

# QuoteDocument

## Purpose
A printable A4 quote (and by extension invoice) layout for Kolkrabbi's client work. kol-atlas needs it now: the Atlas quote goes out as a PDF beside the link to atlas.kolkrabbi.io/quote. Three mockups were made in a kol-atlas session; the user takes the decision and the build here.

## Anatomy
All three share the same content, two A4 pages:
- **Page 1:** letterhead (Kolkrabbi lockup + sender block) → client and quote details → intro paragraph → line items (M1 Foundation, M2 Applications: scope, dates, amount) → subtotal · VSK 24% · total → payment schedule (+ account)
- **Page 2:** optional add-on (Starter / Full tiers) → terms (label · value rows) → link to the online quote → acceptance (two signature lines)

## Variants
- **v1 — original** (`v1-original.html`): Helvetica placeholder, a 26pt "Quote" title, uppercase 7.5pt labels, the line-item table with Description · Dates · Amount, a right-aligned totals block, footer with quote no. and page count. The user's preferred base: *"this is fine lets work from here"*.
- **v2 — invoice-synced** (`v2-invoice-synced.html`): rebuilt after the user's own invoice (`~/Library/Mobile Documents/com~apple~CloudDocs/Workbox/Aftra – Invoice #102.pdf`): one type size, four styles (text · medium label · muted · mono number), no title, a bordered line-item box with a tinted Total row, the lockup in brand orange. **The user's verdict: it went too far** (*"you changed everything, I didnt say that, I said sync a little bit"*).
- **v3 — split** (`v3-split.html`): v1 with additions only: the lockup in brand orange in place of the "KOLKRABBI" text, Right Grotesk for text, JetBrains Mono for numbers, more white space above the title and between sections. Nothing in v1 removed or shrunk.

## Props
To be decided here. The data a quote needs: sender (name, person, address, kt., VSK nr., web/email/phone), client (company, contact, address), quote no., date, validity, project, online link, intro, line items `{ title, scope[], when, hours?, amount }`, VSK rate, payment rows `{ when, amount }`, bank/account, add-on tiers, terms `[label, value]`.

## Styling
- Faces: KOL `--kol-font-family-sans` (Right Grotesk) for text, `--kol-font-family-mono` (JetBrains Mono) for every number (v2, v3).
- Logo: kol-brand `kol-lockup-hori.svg` (currentColor) coloured `#AD5038`, the orange baked into kol-brand's own `kol-lockup-vert.svg`; height 24–26px.
- Paper: A4 (`@page { size: A4; margin: 0 }`), 18–20mm margins, light always.
- The user's ruling on type: **not** KOL's screen doc roles. An in-app attempt on `.kol-doc-*` / `.kol-mono-*` was rejected as too restrictive (*"all of those suck"*). The quote gets its own small print-type set on KOL faces.
- **Drop:** the yellow `.ph` placeholder highlight and the `file://` font URLs (mockup-only).

## States & interactions
None. Print only.

## Dependencies
kol-brand `Asset` / `kol-lockup-hori.svg`. Number formatting stays the consumer's.

## Recreation notes
- **Page fit is unsolved.** Printed in headless Chrome, v1 and v3 run to **three** pages (page 1 overflows by the payment schedule's tail and footer); v2 fits two. The user ruled out squeezing space to fit (*"DONT WORK REDUCTIVE"*), so a fix has to be structural: move a block to page 2, or let it flow onto three pages.
- **VSK is open:** the mockups show VSK 24% (478,800 on 1,995,000), but the user's invoice charges VSK 0. The online quote also says "prices exclude 24% VSK".
- kol-atlas also has a rejected in-app attempt, `apps/workspace/src/components/QuotePrint.jsx` (dev-only `/quote/print`, three layouts on KOL doc roles), still in its tree. Its useful part is the data wiring: the numbers come from Project + Hours through the engine, so the PDF and `/quote` cannot disagree.
