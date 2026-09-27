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

## Phase 1 — Fix the blue focus ring in KOL itself

The Tools / File / Canvas menu buttons (`MenuItem`) get the KOL focus style instead of the
browser's blue ring (#8). It's KOL's bug, so every app using those menus gets the fix.

**Done when:** gates clean, the Tools menu shows no blue ring.

## Phase 2 — Make the gates see the editor

Otherwise phases 3–5 drift back.

- The native-tooltip gate checks design-editor (75 `title=` today).
- The icon-ink gate checks `EditorIcon` too, and catches ink set on a wrapper (the constrain button).
- A new check: a `SegmentedToggle` given a variant that doesn't exist fails. The editor passes
  `ghost` and `primary`, which aren't variants, so those toggles silently fall back to the
  outlined look you flagged (#11). Phase 5 fixes the four call sites; this stops it coming back.

**Done when:** the gates run over the editor. They will fail at first — that list is phase 5's work.

## Phase 3 — Swap the editor's copies for KOL's

Cheapest first. Each step: import KOL, move the old file to `_tmp/`, check the editor live.

| Step | Components | Why this order |
|---|---|---|
| 3a | PathNodeOverlay · CropOverlay · XYPad | identical copies — a straight swap. (XYPad is the drag pad in the Paratype generator's Style tab — generators pack, not visible in `/core`. KOL's copy takes the editor's `oq` strokes first) |
| 3b | KeyframeEditor · CurveEditor · InspectorRail · ToolPalette | KOL has the cleaned-up version; the editor hands it its data |
| 3c | Canvas · LayerStack · TimelineDock | the two have drifted apart — compare, merge what the editor has into KOL, then swap |
| 3d | PanelTabs → `TabsRow` · Section → `InspectorSection` · TransportBar → `PlaybackBar` | same job, different name |

**Done when:** no editor file shares a job with a KOL component.

## Phase 4 — One icon system

- Move the editor's 59 icons into **`kol-icon-set-v1`**, into its existing folders (`tools`,
  `editing`, `layout`, `shape-primitives` …), dropping the ones v1 already has (`check`, `close`,
  `trash`, `lock`, `plus` …). Not a new "editor" set: these are ordinary app UI — align, flip,
  boolean, tool and layer glyphs — the same register as v1. `kol-icon-set-signal` is the
  instruments' set (monitor, mirror). A set per app is exactly how the editor's own set happened.
- Fix the flip icons on the way — the missing end dot (#5).
- Swap the constrain glyph for a lock (#6).
- Retire `EditorIcon`.

**Done when:** the editor uses `Icon` only.

## Phase 5 — The inspector pass

Phases 1–4 are plumbing. This is the visible work: your findings that the swap alone doesn't fix.

| Finding | What changes |
|---|---|
| #3 tooltips | the 75 browser tooltips become KOL `Tooltip`s |
| #6 constrain | a proper `Button`, `oq` ink |
| #9 type glyphs | sized off the ladder, not hand-picked |
| #10 two alignments | text alignment loses its label and gets text-align glyphs (Affinity's row) |
| #11 tones | the `ghost` / `primary` toggles get a real variant; one toggle look across the editor; grounds from the tone set |
| #12 fill / stroke | out of the inspector; the colour-wheel bugs fixed |
| #13 labels | labels only where a control is ambiguous; "Size" renamed or dropped |
| #7 settings X | isolate and fix (reproduced: Esc and the backdrop close it, the X doesn't) |

**Done when:** you've gone over the editor again and the list is empty.

---

## Settled (user, 2026-09-27)

- **#1 Transport goes to the motion pack.** Core has no motion, so it gets no transport. The
  clock goes with it unless something in core still reads it (checked when the move is made).
- **#4 `S` stays the shortcuts key.** Whatever #4 flagged gets checked live in phase 5.

## Publishing

Phases 1 and 3 change kol-component; 4 changes kol-icons; every phase changes design-editor.
I bump versions and write changelogs per phase; you publish.
