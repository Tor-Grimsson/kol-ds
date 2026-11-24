# Plan — Folio as the KOL default: three views to align on

**Raised:** 2026-11-14, user. Points verbatim: *"the end goal here is to find a way to implement and align folio standard into ds as a default style. so we expand DS to use Inter and adjust modals and rails."*; *"make a new page for that? this page is getting heavy"*; *"we dont need the entire system do we? can we just grab a couple of key views sucjh that we align??"*
**Status:** DRAFT.
**Shape:** W › phase › list.
**Laws carried:** agents load `kol-ds-claude` then `kol-figma`; components named by KOL component; library instances linked; content leaving a page goes to the `_trash` page; no middot in names.
**Home:** float file 879P1yBsBPqpdGI5a5v2Y5, new page `↳ folio-default` after `↳ ebook-web-style`. Source views: the Folio screens on 455:336247.
**How a phase closes:** acceptance line first, audit 0, I check every frame on screenshots before handing over.

## W1 — Three views, Folio beside KOL default (P: "a couple of key views such that we align")

### 1.1 — The page and the pairs
- New page `↳ folio-default`. Three pairs, each a 1440×900 Folio screen (copied from 455:336247) beside the same view built from KOL default library instances:
  - Library: nav, tabs, continue card, catalog rows.
  - Markdown editor with a menu and a dropdown open: toolbar, menu bar, menu, dropdown, both rails.
  - Reader with the New document modal open: modal, contents rail.
- Acceptance: 3 pairs; every KOL-side part a linked default instance; where KOL has no part, an empty slot labelled with what's missing.

### 1.2 — Your rulings — TALK
- You rule per piece (type, buttons, dropdowns, menus, modals, tabs, rails): take Folio's look, keep KOL's, or adjust. Nothing is built until you rule.

## W2 — Build the default (after W1.2) — PARKED: waits on your rulings
- The approved looks into KOL code (Inter, modals, rails, tabs, menus), then the Figma library.

## Order
W1.1 (one kol-figma-agent) → your rulings → W2.
