# Plan — the editor back on the design system

**Raised:** 2026-09-27, from your editor review (`backlog/2026-09-27-editor-review-findings.md`)
and the audit behind it (`backlog/2026-09-27-editor-ds-audit.md`).
**Status:** proposed. Nothing started.

---

## The problem in one paragraph

The design editor ships its own copies of components KOL already has — twelve of them by name,
plus a second icon system. Most of the KOL versions were lifted *out of* this editor and cleaned
up, but the editor never switched to them. So every fix lands in one copy and not the other, and
most of your 13 findings are that drift showing.

## The goal

The editor imports KOL for everything KOL has. What's left in the editor is the editor: its
store, its canvas logic, its generators. No second copy of anything.

---

## Phase 1 — Fix three things in KOL itself

Small, and every app gets them, not just the editor.

| Fix | Your finding |
|---|---|
| `MenuItem`'s button gets the KOL focus style instead of the browser's blue ring | #8 |
| `XYPad` borders move from `fg` to `oq` (the editor's copy already did this) | stroke law |
| `SegmentedToggle` warns in dev when it's given a variant that doesn't exist | #11 |

**Done when:** gates clean, the Tools menu shows no blue ring.

## Phase 2 — Make the gates see the editor

Otherwise phases 3–5 drift back.

- The native-tooltip gate checks design-editor (75 `title=` today).
- The icon-ink gate checks `EditorIcon` too, and catches ink set on a wrapper (the constrain button).

**Done when:** the gates run over the editor. They will fail at first — that list is phase 5's work.

## Phase 3 — Swap the editor's copies for KOL's

Cheapest first. Each step: import KOL, move the old file to `_tmp/`, check the editor live.

| Step | Components | Why this order |
|---|---|---|
| 3a | PathNodeOverlay · CropOverlay · XYPad | identical copies — a straight swap |
| 3b | KeyframeEditor · CurveEditor · InspectorRail · ToolPalette | KOL has the cleaned-up version; the editor hands it its data |
| 3c | Canvas · LayerStack · TimelineDock | the two have drifted apart — compare, merge what the editor has into KOL, then swap |
| 3d | PanelTabs → `TabsRow` · Section → `InspectorSection` · TransportBar → `PlaybackBar` | same job, different name |

**Done when:** no editor file shares a job with a KOL component.

## Phase 4 — One icon system

- Move the editor's 59 icons into kol-icons (dropping the ones kol-icons already has).
- Fix the flip icons on the way — the missing end dot (#5).
- Swap the constrain glyph for a lock (#6).
- Retire `EditorIcon`.

**Done when:** the editor uses `Icon` only.

## Phase 5 — The inspector pass

Now that it's all KOL parts, do your UI findings.

| Finding | What changes |
|---|---|
| #3 tooltips | the 75 browser tooltips become KOL `Tooltip`s |
| #6 constrain | a proper `Button`, `oq` ink |
| #9 type glyphs | sized off the ladder, not hand-picked |
| #10 two alignments | text alignment loses its label and gets text-align glyphs (Affinity's row) |
| #11 tones | one toggle look across the editor; grounds from the tone set |
| #12 fill / stroke | out of the inspector; the colour-wheel bugs fixed |
| #13 labels | labels only where a control is ambiguous; "Size" renamed or dropped |
| #7 settings X | isolate and fix (reproduced: Esc and the backdrop close it, the X doesn't) |

**Done when:** you've gone over the editor again and the list is empty.

---

## Two decisions I need from you (any time before phase 5)

1. **#1 Transport in core** — move the transport controls into the motion pack, or keep them in core?
2. **#4 The shortcuts key** — `S` is the sheet key everywhere else, but in an editor letters are tool keys. Keep `S`, or use another key here?

## Publishing

Phases 1 and 3 change kol-component; 4 changes kol-icons; every phase changes design-editor.
I bump versions and write changelogs per phase; you publish.
