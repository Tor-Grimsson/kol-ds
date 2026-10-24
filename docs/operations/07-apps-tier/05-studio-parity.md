---
title: Studio parity
type: reference
status: active
created: 2026-10-23
updated: 2026-10-24
description: Studio parity pass for hubs
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
aliases:
  - studio-parity
related:
  - "[[INDEX|Apps tier]]"
  - "[[01-tier-rules|Tier rules]]"
  - "[[06-studio-adoption|Studio adoption]]"
  - "[[../../documentation/04-compositions/16-app-anatomy|App anatomy]]"
---

# Studio parity

`apps/studio-hub` is the reference for the Studio's shape. A hub on the Studio — FXR, Mirror, Monitor (`apps/editor-hub`, `apps/mixer-hub`, `apps/rack-hub`), and the siblings after their bump — matches it **page for page, measured against it**, or names the sibling's `file:line` that rules the difference.

**The pass diffs the hub against the reference directly** (`_tmp/2026-10-24-hubs-pass/pass.mjs`, 2026-10-24 — the fifth hub plan in two days; user: *"why wouldnt you just CHECK THE REFERENCE?"*). The old pass asserted one row per point he had already named, so anything he had not yet complained about passed by construction. This one opens studio-hub and the hub side by side, runs the same steps on both, and compares:

| What | How | Fails when |
|---|---|---|
| the component tree | the DOM's tag + sorted classes, every datum stripped (text, `src`, `href`, `style`, `aria-*`, measured utilities) | the first node that differs — reported as a path, `ref +classes · hub +classes` |
| the card | the first card's box; its date · size group's line count; the download's and the mark's corner boxes | a width or height differs, the meta row is two lines, a corner box is not 32 square |
| the row | the first row's tree and box | as the card |
| the file rail, read mode | the pencil on the header; every value's right edge against the header's | a value is not on the value column's edge |
| the settings rail | it is a rail (not a route); the header; the tabs row (exactly Settings · Shortcuts · About · Repo); every control inside the rows against the reference's control kinds; the toggle's and reset's tree and box; no sentence in the helper voice inside the rows | a tab row, toggle or reset differs; a control the reference does not draw (a foreign dropdown); a sentence wears `kol-helper-*` |
| the walkthrough | opened from the masthead's sheet, at its last step: the first Get started button's tree | a button that is not the Hub's `Button tone="grey" size="md"` |
| the helper law, at runtime | on every state the pass visits, every `kol-helper-*` element's height against its line height | any helper taller than one line |
| the phone | the first row, the pill's height and 16px gap, no horizontal scroll | as above |
| the rail's one rule at Home | every section on the way ENTERS (a Back row named for it), the last EXPANDS into a tighter group (`.kol-rail-group`, the sm rung on a 4px gap) — the reference walks Chrome → Labs → Effects (its dummy), FXR walks Labs → Effects (its own rail) | the rule does not hold at Home, or the expanded rows are not a group |

Surfaces, at 1440 (the rail closed, then open) and 390: Home (grid, list), the file rail, Library (files grid and list, then the parts pair), Create (the masthead, the filter row, the bar, the parts pair), the settings rail, the phone.

**The allowlist.** A difference passes only when the hub's list names the sibling's ruling with its `file:line`; a failing row carries the first differing node so the reason is read off the tree, not guessed. Run `node pass.mjs` (all three) or `node pass.mjs mirror` with `pnpm hubs` up. Shots land in `shots/` as `<hub>-<surface>.png` beside `ref-<surface>.png` — the pairs to look at before anything is reported.

**Per hub, from the sibling** (the allowlist, 2026-10-24):

| Hub | Sibling | Name · subtitle | Rail | Library | Differs, and why |
|---|---|---|---|---|---|
| FXR (`apps/editor-hub`) | kol-fxr `src/AppLayout.jsx:116` | FXR · Pick a chrome. All three run the same engine. | Library · Editor · Labs · Randomiser · Morph (fxr.kolkrabbi.io's rail, his ruling 2026-10-24); Labs enters, Effects expands — Labs' categories static from the editor's labs catalog, so the rule holds at Home; Morph a placeholder until the mirror carries its route | the files alone, each marked with the chrome it was made with, in the download's box | the mark on every file (`AppLayout.jsx` CHROMES); no parts and no view strip; `navKeys: false` for its chromes' keys; its six settings as typed rows over the editor's store (kol-fxr's AppSettings on adoption) |
| Mirror (`apps/mixer-hub`) | kol-mirror `src/App.jsx:41` | Mirror · Interactive image distortion playground | Library · Create · Studio | PATCHES (Home's files, the same card) · MODULES (the desk's modules through `ModuleMedia`) | a part's `<img>` through `ModuleMedia` (contain, the glyph when none); a part opens its module page (`cursor-pointer`); drag-to-place wraps each part on Create; Patch table and Clear in Create's bar; its render budget as sections under Settings (no app tab); its icon set registered beside the DS's — a DS name never overridden (kol-icons 0.45.0) |
| Monitor (`apps/rack-hub`) | kol-monitor `src/App.jsx:33` | Monitor · Video synthesis workstation | Library · Create · Rack · Stage; the module catalog in the rail's own slot | PATCHES (the presets, the same card) · MODULES | a part opens its module page; drag-to-place wraps each part on Create; HP as the third bar action; Type and Tags groups on Home; two coming-soon notes under Settings, reset live (the theme) |

What every hub has, and the pass holds it to: Home as `HubHome`'s data contract with every verb (rename, duplicate, delete, tags, note, download) over the app's own state; Library on the same `fileCard`, opening on the files; Create on `StudioCreate` with its link as data; the settings rail over typed rows with the Hub's tabs, toggle and reset; the walkthrough's buttons and About as data; the `app` card whose date · size never break; the mark in the download's box. **Nothing an app writes as JSX reaches a Hub surface** — a settings row's `render`, a tab's `content`, the walkthrough's actions, `app.about`, Create's link — each is data the Hub draws, and the shell warns in dev on any element handed to one (2026-10-24: *"we are literally avoiding this custom per repo shit"*).
