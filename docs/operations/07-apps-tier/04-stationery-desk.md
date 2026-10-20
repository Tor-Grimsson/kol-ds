---
title: Stationery desk
type: plan
status: active
created: 2026-10-20
updated: 2026-10-20
description: The quote, invoice and letter layouts, designed in apps/stationery and shipped as kol-stationery
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
phases:
  - Desk
  - Quote
  - Invoice
  - Letter
  - Package
aliases:
  - stationery-desk
related:
  - "[[INDEX|Apps tier]]"
  - "[[01-tier-rules|Tier rules]]"
  - "[[03-candidate-apps|Candidate apps]]"
---

# Stationery desk

| | |
|---|---|
| Workspace | `apps/stationery` · `pnpm stationery` · localhost:5202 · `ui.kolkrabbi.io/apps/stationery` |
| Ticket | `lobby/inbox/QuoteDocument.md` (kol-atlas, 2026-10-20) — open until the quote layout is settled |
| Hand-off | the **Kolkrabbi Stationery** artifact (claude.ai) — quote · invoice · letter on A4, the user's copy to iterate on |
| Ships as | `@kolkrabbi/kol-stationery` — not yet created |

## Desk keys

| Key | Does |
|---|---|
| Space + drag · middle-drag | pan |
| ⌘ scroll · pinch | zoom at the cursor |
| ⌘= · ⌘− · ⌘0 | zoom step · fit the desk |
| G | dot grid |
| T | ground light / dark (the paper stays white) |
| S | the shortcuts sheet |

## What is on the desk

| Row | Pieces | Source |
|---|---|---|
| References | the brand sheets (`01-sheet`, `01-Brand-sheet-M`, `01-logo-display`) · the Aftra and Studio 16 invoices, page one | iCloud `Workbox/kol-images/kol-brand` served in dev only via `/@fs/` · the PDFs rendered by `qlmanage` into the app's gitignored `_tmp/refs/` |
| Brand book | business card front · back · DL envelope · email signature, at print size | kol-styleguide `StationeryMocks` wearing kol-brand's marks and `brandInfo(brand)`, navy ink on white |
| A4 | letterhead · correspondence letterhead · quote v1 · v2 · v3 · a blank invoice | the two letterheads from kol-styleguide; the quotes are the ticket's mockups in iframes (`lobby/_assets/2026-10-20-quote-document/`), their `file://` fonts rewritten to `/fonts/` |

Every sheet is A4: the mockups' `.page` is forced to 297 mm and what does not fit hangs off the paper past a red dashed line. The mockups' all-orange lockup is recolored to the brand's two-tone one (orange mark, navy wordmark).

## Why

kol-atlas sends its quote as a PDF beside the online quote, and the next invoices need the same system. Three mockups came from a kol-atlas session; the user rejected an in-app attempt on the DS doc roles and ruled that page fit is solved structurally, never by squeezing. The layouts needed a place to be judged against what Kolkrabbi already prints, so the desk lays the brand book's set, the real invoices and the mockups side by side on one canvas.

## Current state

- The desk runs: kol-component's `PanZoomViewport` over rack's dot grid, fitted to the window at rest, keys as above.
- The brand-book mocks draw at real mm with the brand's ink and marks; kol-brand has no two-tone horizontal lockup asset (only `kol-lockup-vert` carries the orange), so the desk composes it from `kol-logomark` and `kol-wordmark`.
- The hand-off artifact carries the first synthesis: quote v1's content on the user's own invoice system (the bordered table with a tinted total row, 18 mm margins, two-tone lockup, Right Grotesk for text, JetBrains Mono for numbers), three pages for the quote (items · schedule and add-on · terms and acceptance), one for the invoice, one for the letter.

## Target state

A `@kolkrabbi/kol-stationery` package: `Quote`, `Invoice`, `Letter`, `Envelope`, `BusinessCard` as real documents at real sizes with a data contract, print CSS (`@page A4`) and the brand's marks from kol-brand. The brand book renders those instead of its own mocks (the kol-styleguide mocks move over; old names aliased on the 30-day ledger). kol-atlas imports `Quote`; the desk stays the workbench.

## Phases

### 1. Desk
Done 2026-10-20 — the canvas, the rows, the references, the keys.

### 2. Quote
The user takes the artifact, iterates, and brings the layout back. Open on the ticket: page fit (structural — the schedule moved to page 2), VSK (the mockups show 24 %, the real invoices charge 0; the online quote says prices exclude 24 % VSK).

### 3. Invoice
The same system as the quote, modeled on the Aftra and Studio 16 invoices: client · date · due · number · sender block, one boxed table, account and terms at the foot.

### 4. Letter
The correspondence letterhead: lockup, date · ref · to in mono labels, body, signoff, the entity line in the footer.

### 5. Package
Create `packages/stationery`, move the layouts in, add the data contract and print CSS, publish, bump kol-atlas, close `QuoteDocument` with its receipt.

## Acceptance

- A quote printed from kol-atlas is the same document as the artifact, page for page.
- The brand book's stationery page renders kol-stationery, not its own mocks.
- Nothing in `apps/stationery` is a component: fixture, references and wiring only.
