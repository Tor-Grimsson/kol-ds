---
title: Stationery desk
type: plan
status: active
created: 2026-10-20
updated: 2026-10-27
description: Quote, invoice and letter layouts for print
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

## Desk

Rebuilt 2026-10-27 (StationeryFromBranding, kol-hq): every layout on kol-branding's `/guide/stationery` canvas page, as plain HTML in `apps/stationery/src/boards/`, each in its own iframe on the desk, in the canvas's row groups. The layouts are kept; the content is VOYAGER's (`apps/voyager-fixture`). No Kolkrabbi or personal detail is on the desk. The 2026-10-20 desk (the iCloud brand sheets, the real invoices, the quote mockups) is in `_tmp/2026-10-27-stationery-desk/`.

| Row | Boards |
|---|---|
| Foundations — document elements | F1 Text · F2 Lists and blocks · F3 Tables, notes and sign-off |
| Quote A | A 1/4–4/4 · C Template 1/2–2/2 |
| Header | variants · component |
| Letterhead, letter, envelope and slip | letterhead · letter · DL envelope · compliment slip |
| Letter styles | A Clean · B Centered header · C Official letter · D Marks and stamps |
| Cards | business cards · name badge · email signature |
| Documents | invoice A · invoice B · contract · NDA |
| Research — document template | R0–R8, from kol-atlas |
| Long document | the "Brand comparison" research paper, 16 A4 sheets, from the Branding research print canvas |

Content: the letters carry the VOYAGER dispute letter (VOYAGER ehf. to Orbital Freight Partners ehf., the short document); the counterparty everywhere else is Orbital Freight Partners ehf.; marks are VOYAGER's (`__LOCKUP__` · `__LOGOMARK__` · `__WORDMARK__` tokens in the boards, swapped for the fixture's URLs at runtime); the accent is VOYAGER's burgundy; fonts are the repo's `/fonts/`.

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
