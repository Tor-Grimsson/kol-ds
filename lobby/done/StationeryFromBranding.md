# apps/stationery — rebuilt from kol-branding's stationery, on VOYAGER placeholder copy

**Staged:** 2026-10-27 · from a kol-hq session
**Change:** one app refresh, placeholder content swapped
**Plan:** `~/dev/projects/kol-hq/.kol/llm-plan/02-estate-split.md`

---

## The problem, in one case

`apps/stationery` is out of date. The current stationery layouts live in kol-branding: `/guide/stationery` (Foundations — document elements · Quote A · Header Grid/Compact/Display · Letterhead, letter, envelope and slip · Letter styles · Documents — invoices and agreements) and the brand guide chapters 08 Stationery and 12 Applications. Some of them carry the user's private letters as placeholder text — that must never become placeholder copy.

## The fix

Bring those layouts into `apps/stationery`. Keep every layout; replace the content:
- **Short document** — the VOYAGER dispute letter below (same length and format as a real formal letter).
- **Long document** — the "Brand comparison" research paper (16 A4 sheets) from the canvas https://claude.ai/artifact/K1oDtb7qrpThuHY6DM5Xca, page "Brand comparison" — proves the layout holds long content.
Use `/voyager` for any other client data.

> **VOYAGER ehf.** · Reykjavík, 27 October 2026
> **To:** Orbital Freight Partners ehf., Board of Directors
> **Re:** Formal dispute — damages from the unscheduled landing of vessel OFP-7 on our property at Hvítárvellir
>
> On 14 October 2026, at approximately 03:40, your vessel OFP-7 made an unscheduled landing on the eastern pasture of our base camp at Hvítárvellir, without notice or permission. The landing destroyed a fenced equipment yard, flattened two storage huts, and left a scorched area of roughly 1,200 m² that cannot be used this season.
>
> We have documented the damage with photographs, a surveyor's report and statements from two staff members present that night, all enclosed. Our total claim is ISK 18,450,000, itemised in Appendix A, covering repairs, replacement equipment, and revenue lost from three cancelled expeditions.
>
> We ask that you confirm receipt of this letter and propose a settlement within 30 days. If we receive no satisfactory reply by 26 November 2026, we will take the matter to the District Commissioner without further notice.
>
> Respectfully, Sigrún Hafsteinsdóttir, Managing Director, VOYAGER ehf.

## Definition of done

- [ ] every kol-branding stationery layout renders in `apps/stationery`
- [ ] no private content anywhere; short = the VOYAGER letter, long = Brand comparison

## ✅ RESOLUTION — 2026-10-27 · kol-ds-ui apps/stationery (no package)

apps/stationery is rebuilt from kol-branding's stationery: all 35 layouts on its /guide/stationery canvas page (Foundations, Quote A + template, Header, letterhead/letter/envelope/slip, letter styles A–D, cards/badge/signature, invoices/contract/NDA, the research template R0–R8) as plain HTML boards on the pan-and-zoom desk, in the canvas's row groups. The layouts are kept; the content is VOYAGER's. Every Kolkrabbi and personal detail (name, kennitala, address, phone, emails, bank number, Atlas/Aftra) is swapped for the fixture's, with Orbital Freight Partners ehf. as the counterparty. Short document: the five letter layouts carry the VOYAGER dispute letter verbatim. Long document: the Brand comparison paper, 16 A4 sheets from the Branding research print canvas, as the last row. VOYAGER's marks and burgundy throughout; fonts from the repo's /fonts/. The old desk (iCloud brand sheets, real invoices) is in _tmp/2026-10-27-stationery-desk/, and the iCloud dev path is gone from vite.config. Docs: docs/operations/07-apps-tier/04-stationery-desk.md.

**Remainder here:** none — kol-branding none.

