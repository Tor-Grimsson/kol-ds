---
title: Question round
type: log
status: active
created: 2026-10-02
updated: 2026-10-02
description: Round two's open calls, ruled and built
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[2026-10-01-review-round-two|Review round two]]"
  - "[[../../documentation/00-overview/05-names|Names]]"
  - "[[../../documentation/03-components/00-taxonomy|Taxonomy]]"
  - "[[../01-release/04-retirements|Retirements]]"
---

# Question round

**Run:** 2026-10-01 → 2026-10-02 · **Plan:** `.kol/llm-context/plan-2026-10-01-showcase-review-round-2.md` (its TALK phases) · **Journal:** `.kol/llm-context/playbook/2026-10-01-review-round-2-goals.md`. Round two left six visual calls and a list of TALK phases. The user answered them in one sitting — twenty-odd questions, each with a recommendation — and this run built what he approved. Nothing is published.

## Phases

| W | Phase | Docs | What was done |
|---|---|---|---|
| Visual calls | 1.3 | — | result row: the wash variant, a glyph for the kind, the path as the second line |
| | 6.7 | — | the preview stage sits on the sunken surface (`.bg-surface-sunken`, new in kol-theme) |
| | 6.6 · 6.12 | — | knob bar: every axis is a dropdown that names itself — the name, a divider, the list — with capitalised labels; `MultiSelect` (one dropdown, a column per setting) is a component for further work |
| | 3.7 | — | rail glyphs on every group and on the Docs, Styles, Start and Lookup pages; component rows stay text |
| | 3.10 | [[../../documentation/01-foundations/14-cursor-lookup\|Cursor lookup]] | the line handle stays a variant beside the pill |
| Taxonomy | 7.1 | [[../../documentation/03-components/00-taxonomy\|Taxonomy]] | Chess Board, Color Swatch, Action Button, Rail Section, Clearspace Diagram to molecules; control + label + value is a molecule (Rotary Dial, Knob, Fader) |
| | 7.2 | [[../01-release/04-retirements\|Retirements]] | `HlsVideo` → `BackgroundVideo`, a utility; `ProfileAvatar` → `BrandAvatar`; the hardware twins merged — `Fader` → `Slider`, `Knob` → `RotaryDial`, `PanelLabel` → `LabeledControl`, each as `variant="panel"` |
| | 7.3 | [[../01-release/04-retirements\|Retirements]] | Button's six tone-duplicate variants deprecated; 268 call sites moved to `tone`; `validate:variants` V3 |
| | — | — | Knob and Fader report a touch hold (`onHold`) instead of opening `ParamSheet` |
| | 7.5 | [[../../documentation/00-overview/05-names\|Names]] | a Set is the parts that make a thing; Rack and Mixer added; the rack (`RackCase` · `RackRow` · `RackSlot`) lifted into kol-hardware |
| Site shape | 1.6 · 3.2 | — | a rail row with no children lists its page's sections as `#` links, from a generated manifest (`pnpm extract:sections`); the Styles and Search rails no longer list the space as their own parent |
| | 3.8 | — | the expand-everything shortcut already existed (`C`); its label now says so |
| | 2.2 | — | graph: files and orphans beside tags, a filter, label · node-size · link-width settings (`indexGraph` in kol-search) |
| | 5.4 | — | the landing's card wall is one component (`LandingWall`); Modules and Sets open on it, Apps and Packages gained one |
| | 6.9 | — | a tier's home filters by package with a checklist dropdown |
| | — | — | each foundation page lists the docs behind it under Related |
| Code | 6.14 | [[../04-content-pipeline/INDEX\|Content pipeline]] | "demo" is "preview" across the showcase code — `previews/`, `PREVIEWS`, `PreviewStage`, `validate:preview-files` |
| | 4.3 | — | framed previews for Notes, Decks, Media Library, App Hub, App Studio and Brand (the apps' own entry files on their fixtures), and Touch Device Overlay forced on; fourteen parts show their tool's preview |
| Gates | — | — | `validate:gaps` reads every rendered page for a rule flush against its neighbour (1,114 pages); `validate:syntax` covers the showcase, workbench and apps |

## Decisions

| Decision | By |
|---|---|
| Rail glyphs go on groups and on docs and styles pages; the component rows stay text | user |
| The knob bar is three named dropdowns; the one-dropdown `MultiSelect` is kept as a component for further development | user |
| Knob labels are capitalised — "everything is always in lowercase" | user |
| A hardware control that does the same job as a kol-component control is that control's panel variant, not a second component | user |
| The hardware Icon Button does not merge into Button — it has a lit state Button has not | user, on the agent's reading |
| Close Button and Button's icon-only form stay as they are | user |
| Button's `variant` is default · accent · danger · nav | user |
| A Set is the parts that make a thing; the rack comes into the design system | user |
| A rail row with no children lists its page's sections; Foundations, Icons and Guides are the Styles rail's top layer | user |
| Component pages keep their sections — nothing taken from the shadcn comparison | user |
| The names `MultiSelect`, `BackgroundVideo`, `BrandAvatar`, `RackCase` · `RackRow` · `RackSlot`, and `variant="panel"` | agent |
| The kind glyphs on result rows and the rail glyphs | agent |
| The sections manifest is generated from the rendered pages, not hand-listed | agent |
| The tools' previews mount the apps' own entry files, so a preview cannot drift from its app | agent |
| `validate:gaps` judges the page's own rules only — a component's rule (a card's plate, a header tab) is its design | agent |

## Open

- **Not published.** theme · component · workshop · hardware · search · shell · styleguide carry Unreleased entries. kol-hardware must peer on the kol-component that ships the panel variants.
- **Consumers.** monitor · mirror · fxr lose the touch sheet on Knob and Fader at their next bump until they pass `onHold`; the aliases keep everything else resolving.
- **One recommendation waiting on a ruling** — the four audio components: one transport, `PlaybackBar`; retire `AudioPlayer` and `AudioPreview`'s own player (`backlog/2026-10-01-component-audit.md` § 5). The drop needs the iMac's estate scan.
- **Component pages still without a preview** — Video Sheet (no video in the showcase), the two font-viewer parts, Shell Layout and Tag Mode Gate (they are this site's own shell), Row Menu Button (touch only), the two editor overlays ruled out. Eight in all (`pnpm validate:previews`), down from 31.
- **Tags** — the taxonomy session and tagging from the site stay parked.
- **For the user's eye** — the rail with sections and glyphs, the walls, the graph settings, `MultiSelect`, and the panel variants beside their kol-component twins.
