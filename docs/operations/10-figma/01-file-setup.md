---
title: Figma file setup
type: reference
status: active
created: 2026-11-06
updated: 2026-11-12
description: Which Figma file holds what — the KOL library, the family files, the move between them
aliases:
  - figma files
  - figma setup
tags:
  - domain/figma
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Figma]]"
  - "[[../../documentation/06-research/05-figma-file-setup|Figma file setup (research)]]"
  - "[[02-issues|Figma issues to revisit]]"
---

# Figma file setup

All files sit in the Figma folder **kol-ds-ui [library files]** (team Kolkrabbi Vinnustofa). Every family file uses the KOL library; kol-ds-ui is switched on for every new file, so Code Connect reaches all of them.

## The rule

A master stays in the KOL library **only if it belongs to a published KOL package that more than one app uses**. App-only masters and an app's screens live in that app's family file. Borderline → it stays in the library until ruled. A thing goes where its **app** is, never by its look: float parts are library, an app's float screens go with the app.

## The files

Fourteen files, in the folder's order (checked against the folder 2026-11-08; `covers` in the folder is a stray file, not part of the set). **Every Figma agent reads this table before its first call** — a file missing here is a file the agent doesn't know exists.

| File | Key | Type | Holds | Published |
|---|---|---|---|---|
| `❖ library--kol-ds-ui` | n48kE2bJtrFjl7wxst30xH | library | foundations, icon masters, shared atoms, molecules and organisms, layout modules, the identity system | yes |
| `◇ foundry--kol-ds-ui` | uKJdSFNoAJkYqqpiSXETFR | instances | the foundry page template and its screens — built by the kol-website agent (kol-website owns the foundry code) | no |
| `◇ website--kol-ds-ui` | 7YxebZmHy7slweU5E1gt7p | family | what kolkrabbi.io uses — website and article screens | yes |
| `media--kol-ds-ui` | GqMIvP0T7WKfH8QjFCl98c | family | media, media-hub — screens only | no |
| [`brand--kol-ds-ui`](https://www.figma.com/design/WsyWxelBX6QLNgRBQ1aK4W/brand--kol-ds-ui) | WsyWxelBX6QLNgRBQ1aK4W | family | brand, brand-hub, brand-lab, brand-sections, site-hub (a client's brand site) | yes |
| `document--kol-ds-ui` | iYvYkjaQ1JGxGGhh1HO4hk | family | the document screens | no |
| `layout--kol-ds-ui` | EMdyp9gS3UiMT9tYMZHF5T | instances | layout reference screens — shell, hub, the workshop layout | no |
| `iconset--kol-ds-ui` | Lud0oSRKPTyHvT9MDVIczN | instances | icon review work — Icons WIP, review sheets, keyline boards | no |
| `◇ float--kol-ds-ui` | 879P1yBsBPqpdGI5a5v2Y5 | instances | the float system's development file — the float parts' home on one `↳ Parts` page (a section per family), then one page per apps/float view route, each opened by a `SectionText` float header | no |
| `print--kol-ds-ui` | jQABZz0smdlw5UqbfMd6I4 | family | empty — Print kit is shared, so it stays in the library | no |
| `modular--kol-ds-ui` | fqkq6IOFPPMFDRYWNwEDBR | family | rack, rack-hub, mixer, mixer-hub | yes |
| `presentation--kol-ds-ui` | 265LaCcBZ2rPxdtWr2fEn2 | family | presentation, presentation-hub — screens only | no |
| `metric--kol-ds-ui` | 5zfJNoF3I9vOXjwUqryBKY | family | metric | yes |
| `editor--kol-ds-ui` | MjcVTXxsOUjCeZ419Bk5J5 | family | editor, labs, randomiser, Morph, float editor, editor-hub | yes |


No showcase file: the showcase is the code rendering the library.

## The library's pages

| Chapter | Pages |
|---|---|
| Cover | — |
| ➤ Library | ↳ Icon masters, ↳ Atoms (index frame at 0,0), ↳ Molecules, ↳ Organisms and ↳ Modules |
| ➤ Styles | ↳ Foundations |
| ➤ Collection | ↳ Sets |
| ➤ Apps | ↳ Studio (held), ↳ Catalog--note--need--work (held) and ↳ Other apps |
| after the divider | ↳ Not yet drawn and _trash |

Each page: one section per family, one column from x 0, 200 between sections. The page law lives in the kol-figma skill.

## Moving a family out

1. **Read-only pass** — the move list (masters + screens), what stays and why, flags for the user.
2. **Stage** — every leaving item moved (never recreated) onto one page ↳ _to &lt;family&gt; in the library.
3. **Cut and paste (the user)** — on the staging page `Cmd + A` → `Cmd + X`, open the family file → `Cmd + V`. The plugin cannot move nodes between files.
4. **Publish** — the family file first (only if it received masters), then the library once. Figma lists the masters as *moved*; every instance follows.
5. **Cleanup** — family file pages set up, the library index rebuilt, empty pages removed.

## Status — 2026-11-06

The moving is done. Every family file has its content; the staging pages are gone.

**Held in the library until their parts are components:**

- ↳ Studio (studio and studio-hub) — waits on the Rail system (every Rail, desktop and phone, HubSettingsRail keeps its code name), the Home system (HubHome, sign in and sign up on AccountForm, settings) and the studio grid (CanvasStudio). Then both move to `layout--kol-ds-ui`.
- ↳ Catalog--note--need--work — CatalogPage is a shipped kol-shell component (PageHeader, ContentFilters, a grid of ContentCard / ContentRow, the action row); it needs a real master on ↳ Modules. The current frames are loose.

**Still in the library, undecided:** ↳ Sets (the showcase's tiles), ↳ Other apps and ↳ Not yet drawn (lists of empty placeholder cards, nothing to look at).

**Cleanup not yet run:** the ↳ Atoms index frame still links to sections that left; the family files' pages are not set up.

**Parked:**

- the article layouts in `website--kol-ds-ui` — keep the two "Article — monitor" frames, retire the six empty variants, build the no-hero article from a real post, then make both components linked into the document file
- no overview yet of how a workshop document looks
- inside masters: about 84 sample texts ("Label", Lorem) and 29 stacked variants in the Menu sets

## Stayed as borderline (shared by another family's app)

- MediaLibrary — five apps use it
- the deck masters — brand-hub mounts the deck tool
- Print kit — brand-sections and voyager-fixture
- the Brand section (BrandBook, BrandAssets, Brand) — brand-hub and site-hub
- SiteHero, the Website organisms and Site parts — SiteLayout and DocumentIndex
- Knob and JackSocket — controls and studio-hub
- CardLogo and Favicon — the identity system
- ShortcutsOverlay, SettingsPanel, ResizeHandle, SettingsMulti and SettingsChoice — kol-component
- ToolPalette, SwatchStack, LayerStack, TimelineDock and MenuBar — shared parts pulled back out of the editor sections

Working lists: `_tmp/2026-11-06-figma-library-layout/` (pass.md, editor-move.md, rest-move.md).
