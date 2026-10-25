---
title: Rails
type: reference
status: active
created: 2026-10-24
updated: 2026-10-25
description: The four rail roles, the phone rule, the rail kit and the two tiers
aliases:
  - rail-kit
  - rails
sources:
  - packages/component/src/molecules/Rail.jsx
  - packages/component/src/organisms/RailKit.jsx
  - packages/component/src/organisms/SettingsPanel.jsx
  - packages/theme/kol-design-tokens.css
  - apps/rails/src/App.jsx
tags:
  - domain/app-shell
  - pattern/blocks
  - audience/agency-internal
related:
  - "[[INDEX|Compositions]]"
  - "[[17-settings|Settings]]"
  - "[[11-shell-system|Shell system]]"
---

# Rails

A Rail is a surface docked to an edge (`Rail`, [[11-shell-system|the shell system]]'s word: left, right, top or bottom; over the page on a scrim or pushing the layout). What goes IN one was every app's own until 2026-10-24 (RailKit, kol-monitor — *"FXR uses a system of components to structure their rails … if we can have some reference source of truth"*): the DS shipped the parts and no recipe, so monitor's patch table came out 440 wide with its own padding and a hand-made table, and the settings rail stood at 380 with a different inset again. Now a rail is `Rail` for the shell, the kit for the content, and a tier for the size. The reference is `apps/rails` (`pnpm rails`, 5206), built the way studio-hub is: `AppHub` with the nav rail, two pages (Stage, Rack), the Hub's settings rail on `,`, and on each page the patch rail on P, the page's settings on H and the bottom rail on E — stacking in the order they open, Escape closing the top one. The Variants button carries one axis, Rail: app · site — site swaps the frame for `SiteLayout` with the site rail and the settings rail at the site tier.

## The roles

Every tool has the same four rails (RailRoles, user 2026-10-25 — *"they keep making variations old and new and I want to standardize rails … patch rail P, per page settings H, regular settings [,] … then we have the bottom rail on monitor stage and rack"*). `Rail role` names the job; the side, the tier, the scrim and the key come from it (`RAIL_ROLES`, kol-component), and `useRailKey(role, onToggle)` binds the key. An explicit prop still wins — but a rail that needs one is a question for the DS, not a local fix.

| Role | Key | Desk | Phone (below 768) | Who |
|---|---|---|---|---|
| `patch` | P | right · the app tier · no scrim (the rack stays live) | bottom, 70dvh | monitor (rack, stage) · mirror (hall of mirrors) · rack-hub |
| `page` | H | the settings rail's shell without the scrim — right · the app tier · `SettingsPanel variant="rail" role="page"`, typed rows, the settings rail's tab row when the page has more than one set | fills the screen | monitor (Stage, Rack — its parameter panel and Mark parameters as the tabs) · mirror (mixer) |
| `settings` | , | right · the app tier · THE ONE RAIL WITH THE SCRIM (`SettingsPanel`) | fills the screen | every AppHub app (the Hub binds `,`) · olina |
| `bottom` | E | bottom · 30dvh · resizable 80–600 · no scrim · the full width OVER the nav rail, `RailNav` (the collapsed nav rail's 48 icon column) inside it under the nav rail | bottom, 50dvh | monitor (the Workbench on stage and rack) · rack-hub |

**No role draws an edge** (his ruling 2026-10-25: *"border off, but ship with opt in if they want"* · *"why do some have border and some do not?"*): a rail reads by its scrim (settings, page) or by its content against the live page (patch); `edge` stays on `Rail` as the opt-in. [[../../operations/09-phase-log/INDEX|open questions]] round 19 (the edge, a `surface-secondary` ground, the scrim) is answered with none of the three on the role. **The page rail is the settings rail** (*"why is H same as labs siderail and not the same as settings?"*): the same shell under the page's key, titled with the page, its rows typed; fxr's inspector anatomy stays in the kit for the rail that is an inspector (labs — fxr's own).

**The standard header** (his review 2026-10-25: *"title + close!! then divider!!! thats a fucking standard header!!!"*): every rail with a header draws the title line with the × and the hairline under it — `Rail` draws all three, a rail never its own; `RailHeader`'s subtitle and actions are opt-ins. **The foot** (`Rail footer`, `SettingsFooter`'s reset) is the opt-in on any rail, not the settings rail's alone (*"will that ship with an opt in?"*); the Rail draws it as a band — a full-width rule outside the scroller, the nav rail's Settings foot as the model (*"scrolling would clip there"*) — so `SettingsFooter` and `RailFoot` draw no rule of their own. **One inset** (*"why dont we unify?"*): the app tier's padding is 16 on every width (*"MAKE 16!!!"*), 12 from the title line to the hairline and 24 under it (a section divider's air); the bottom rail's content sits 16 in from `RailNav`'s 48. (An hour at the page's 48 read as *"you went backwards"*, 20 as still too much.) **One width**: the nav rail opens to 380 too (`--kol-shell-rail-open`).

**One grab.** A resizable rail's handle is the nav rails' pill — `useGrabEdge`, `.kol-rail-grab`, waking on proximity, on the edge that faces the page (a bottom rail's top edge, the pill travelling on x) — never a wash of its own (*"why does bottom rail not have the same grab system as other rails?"*). **A rail's controls** take the rail preset where they are chips: `Input preset="rail"`, 8 at the sides; a slider row's readout wears it, its label column 80, the track the rest.

**Rails stack.** P, then H, then `,`: three rails open, the later over the earlier, Escape closing the top one first (`layerStack`), one scroll lock counted across them.

**The phone rule** is one rule for every role, so a tool gets it by naming the role: a side rail turns into a bottom rail (the thumb's reach) with its top edge drawn, the settings rail fills the screen, the bottom rail stands at half the height. Labs and randomiser are its test cases; their rails live in the design editor's source, developed in kol-fxr, so their adoption is fxr's step.

**Adoption.** Monitor's patch table passes `side="right" variant="app" backdrop={false} edge={false} shadow={false} closeHover={false}` — that is `role="patch"`; its Stage and Rack rails are `SettingsPanel role="page"`; its Workbench is `role="bottom"` and drops its `besideSidebar` class. Mirror's patch table is 440 wide with a hand-made header — `role="patch"` and `RailHeader`. A tool's own key handler for P · H · E becomes `useRailKey`. Filed: `RailRolesOnMonitor` (2026-10-25).

## The tiers

| Tier | Width | Padding | Who |
|---|---|---|---|
| `app` | `--kol-rail-w-app` 380 | `--kol-pad-rail-app` 16, every width | a tool's rails — its settings rail, a page's settings, the patch table, the bottom edit rail |
| `site` | `--kol-rail-w-site` 380 | `--kol-pad-rail-site` (= the overlay inset) | a site's rails — the settings rail as locked 2026-08-27 |

`Rail variant="app" | "site"` reads them for a side rail's width (when no `width` is given) and every rail's padding; `SettingsPanel tier` (default `app`) passes it on, so the settings rail and a page rail of one app are one size. Round 18 (the same settings rail at 264 · 320 · 380) is answered: **380**, the settings rail as it was on 2026-08-27 — the app tier stood at 320 for a day (*"why is settings now less wide? it was fine before?"*). A bottom or top rail keeps its own `height`.

## The kit

The anatomy is fxr's inspector (`kol-fxr/src/editor/labs/LabsView.jsx` LabsRail, `params/AutoControls.jsx`, its own `kol-editor.css`), the one the user named good. Two of its parts already shipped under the settings rail's names and stay the same components.

| Part | What it is | fxr's |
|---|---|---|
| `RailHeader` | the title line — helper-14 uppercase title, a subtitle, the actions before the × (`Rail` draws the ×) | the rail's title |
| `RailTabs` | segmented tabs across the rail | Generate · Style · Animation |
| `RailSection` | = `LabeledControlSection` — an eyebrow over its rows, `divided` for the hairline above | `LabeledControlSection divided` |
| `RailRow` | = `SettingsRow` — label · control; the label column is 160 in the settings rail, **112 in an inspector** (fxr's `RAIL_LABEL_W`, its one deviation: a ~300 inspector is not a drawer), `labelWidth="auto"` beside a wide control | TYPE · CATEGORY · PRESET |
| `RailHint` | one quiet line under a row or a group (mono-10, meta ink) | the hint line |
| `RailActions` | full-width buttons stacked; `row` for a line of icon buttons | the action buttons and the icon row |
| `RailFoot` | the pinned foot for `Rail footer` — its own tabs, then the slot (the rule is the Rail's band) | Transport · Output · File and the transport row |
| `RailNav` | the collapsed nav rail's icon column inside a rail (`Rail nav`) — 48 wide, the rail's 8 gutter, md nav buttons with the 20 glyph, lit on the active view, no labels | — (monitor's Workbench views: Edit · Rack · Library) |

`Rail footer` (new with the kit) is pinned under the scrolling body; `SettingsPanel`'s footer rides it, so reset and the file verbs stay in reach while the sections scroll.

## The whole rails

| Role | Built from | In `apps/rails` |
|---|---|---|
| `patch` | `Rail role="patch"` + `RailHeader` (the title alone), the cables as a `Table` (simple, compact — FROM · OUT · TO · IN · the remove, aligned columns: *"a grided way matrix"*), Add a cable as a `RailSection` of two rows under it, `SettingsFooter` in the foot clearing the table | P |
| `page` | `SettingsPanel variant="rail" role="page"` → `RailHeader` (the page's title), the tab row where the page has sets (the Stage: Stage · Marks), `SettingsSections` (typed rows — `type: 'slider'` for the Stage's parameters, switches for its marks), `SettingsFooter` pinned — the settings rail under the page's key, no scrim | H |
| `settings` | the Hub's — `SettingsPanel variant="rail" tier` (= `Rail role="settings"`) → `RailHeader`, `SettingsSections` (typed rows), `SettingsFooter` pinned | `,` |
| `bottom` | `Rail role="bottom" nav={<RailNav items value onChange />}` — the full width over the nav rail; the views as glyphs in `RailNav` under the nav rail's; `RailHeader` (the view's name, the case as subtitle) and the content beside it at the page's inset: the Case rows as a `Table` with their remove and the add buttons, Parked as a `RailHint` — the shape for monitor's Workbench | E |

A page-level rail opens over a live page without the scrim; the settings rail keeps its scrim.

## fxr's inspector against the kit

Checked 2026-10-24: every part of LabsRail maps onto the kit — the title (`RailHeader`), the segmented tabs (`RailTabs`), `LabeledControlSection` + `SettingsRow` (the same components), the hint (`RailHint`, fxr's `kol-mono-10 text-meta`), the full-width buttons and the icon row (`RailActions`), the transport dock (`RailFoot` on `Rail footer`). Two deviations are fxr's own, in its stylesheet: its body padding is `20px 16px` where the tier's is the overlay inset (20 · 24), and its width rides the shell rail's 264 · 320 ramp where the tier is 320 flat. Neither needs a kit change; fxr can adopt the kit and drop `kol-compose-rail*` from `kol-editor.css` when it bumps.
