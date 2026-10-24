---
title: Home + Library
type: log
status: active
created: 2026-10-24
updated: 2026-10-24
description: Home is the user's saves, Library is what ships, one card and one detail page across fxr · mirror · monitor
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-10-24-home-library-detail-one-card|The plan]]"
  - "[[../07-apps-tier/06-studio-adoption|Studio adoption]]"
---

# Home + Library

**Run:** 2026-10-24 (one goal, after the Studio adoption the same day) · **Plan:** [[_files/plan-2026-10-24-home-library-detail-one-card|plan-2026-10-24-home-library-detail-one-card]] · **State:** the DS wave published (kol-theme 0.185.0 · kol-component 0.297.0 · kol-shell 0.78.0); the three repos taken through their phases from this session, each closed by the extended pass against studio-hub

## Phases

| Phase | Docs | What was done |
|---|---|---|
| The file rail | [[../../documentation/04-compositions/16-app-anatomy\|app anatomy]] | Details opens with the card's Date and Size; the pencil is the rows' 26; edit mode offers Upload image (`onCover` on `HubHome`, the card, the rail — `utilities/imageToDataUrl`) |
| `StudioDetail` | [[../../documentation/04-compositions/11-shell-system\|shell system]] | a module's or a patch's page made once in kol-shell: a text `‹ Back`, the app masthead, prose, the preview, the actions as DS Buttons; the twins' detail pages are data over it |
| Library is what ships | [[../07-apps-tier/06-studio-adoption\|studio adoption]] · [[../../documentation/04-compositions/16-app-anatomy\|app anatomy]] | the twins' Library lists the shipped presets and the modules — never Home's files; `/library/module/<id>` and `/library/patch/<id>`; a patch card opens its page, Load lives there |
| One card | [[../../documentation/04-compositions/16-app-anatomy\|app anatomy]] | no part card: a module, a shipped preset and a save are the same card — title · date · size · cover with download · cog · trash; Create's parts keep it and gain Insert in the cover's corner (`onInsert`) |
| The pass | [[../07-apps-tier/05-studio-parity\|studio parity]] | `pass.mjs` / `pass-repos.mjs` read every card's fields, the rail's Date · Size and 26px pencil, Upload image, Library ≠ Home, the detail page; the twins green (fxr 71/71 · mirror 92/92 · monitor 92/92) |
| The repos | [[../07-apps-tier/06-studio-adoption\|studio adoption]] | by step message: mirror — shipped presets and the registry's patches on the one card, FX view gone, both detail pages on `StudioDetail`, every cover the composited output (92/92); monitor — the shipped presets back in the Library, the slug scheme, the detail pages, covers from the Output module's canvas; fxr — Home follows the library (the restore merge was the real cause), the shipped Library generated from the labs and randomiser tables, ten morph and ten editor files, the detail page, the user's saves backfilled, the shipped covers drawn on demand by `FileCover` (one frame per preset, reused) — 71/71 against studio-hub |

## Decisions

| Who | What |
|---|---|
| user | Home is the user's saves, Library is what the app ships with — system saves |
| user | every card has the same fields and icons, modules and shipped presets included; the trash is not negotiable |
| user | a patch's cover is its rendered output, never the tool's UI |
| user | a patch card opens its detail page (the same slug type as a module's); Load lives on the page |
| user | fxr's Library ships every labs and randomiser preset, ten morph files, ten editor files — generated, not asked about |
| user | mirror's expressions are not FX and not library content |
| agent | Insert on Create's parts moved to the cover's corner (a card) and before the plate (a row), so the part keeps the plate |
| agent | the worker port per app for local dev — fxr 8787 · mirror 8788 · monitor 8789 |
| agent | mirror's camera patch is captured over the canonical still; the desk's Patch module counts as a module |
