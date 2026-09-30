# Plan — the editor inspector rebuild (Affinity as the guide)

**Raised:** 2026-09-27, the user's second review of apps/editor after the DS sync
(`plan-2026-09-27-editor-ds-sync.md`), with Affinity Designer screenshots as the reference.
**Status:** done 2026-09-27, all three phases in one run ("do all of it"). Unpublished: kol-theme 0.154.0 ·
kol-component 0.227.0 · kol-icons 0.29.0 · design-editor 0.16.0. 29 gates clean; checked live at 1440.

**Done notes:**
- 1a is SCOPED to `.kol-tool-palette` — the inverted pressed tile is a system-wide law (2026-07-08) and
  stays for every other toggle.
- 1c had no root bug: the footer had set the strip `filled` and never let it grow in its flex row.
- The pane decision: `InspectorSection pane` (a variant, not a new component).
- New glyphs `text-valign-*` drawn for the text-box row. A dev server started before they existed
  needs a restart to see them — Vite's watcher does not pick up new files in `packages/icons`.
- Tooltip copy added where labels were dropped (X position · Y position · Width · Height · Rotation ·
  Opacity · Corner radius).
- Not done: swapping the editor's `AlignmentPanel` for KOL's `AlignmentGrid` (same strips, different
  layout — the grid stacks them).
**Related:** `backlog/2026-09-27-editor-review-findings.md` (#3 tooltips, #11 grounds still open) ·
`lobby/inbox/editor-chrome-review.md` (#14 glyphs, #15 primary hover — his rulings, parked)

---

## 0. The one sentence

The sync put the editor on KOL parts but took every KOL default as-is, so the inspector reads like
a form — a dim label on every row, dividers that stop short, a header naming what is already
selected. Affinity is the model: **a few named panes, unlabelled controls, tooltips carry the words.**

## 1. What the user said

- Tool icons: *"low resolution"* by default, **inverted active state**, odd hover. Affinity: quiet
  active tile, short click animation. *"we are making things too complicated no?"*
- Dividers changed — fxr had full-width rules and bold section titles; *"something didnt translate"*.
- Line-height / letter-spacing inputs misaligned; text size has *"a dropdown where the chevron is
  outside the dropdown"*.
- *"just too many section headers"*, and *"a stupid greyed out lower case section title everywhere"* —
  panes should be named like the Colour panel: *"this is type, this is transform"*.
- Type settings sit next to the type selector — should be in a pane header.
- Wrong icons on the text-box settings (can't name them: no tooltips); icons at 12px are too small.
- Transport *"completely fucked"* — should look like fxr's; the segmented toggle should fill width.
- *"why are we saying TEXT"* when the layer is selected in the layers panel.
- Vector shapes are nearly impossible to select — the hit area is too slim.

---

## 2. Phase 1 — KOL root fixes (every app benefits)

| # | Change | Where |
|---|---|---|
| 1a | **Tool button states.** Active = a quiet raised tile (`surface` step up) with emphasis ink — not the inverted white tile `pressed` paints today. Hover = ink brightens only. Press = ~80ms scale. Rest ink one step up (the "low resolution" is thin glyphs on a dim ink) | kol-theme (the pressed ghost / tool rule) · `ToolPalette` · `SplitToolButton` |
| 1b | **Tooltips from `SegmentedToggle`.** An option with `ariaLabel` / `tooltip` gets a KOL `Tooltip` automatically, so icon-only cells stop being mute. Then a gate: no icon-only control in design-editor without a tooltip | kol-component · `scripts/` |
| 1c | **Find what broke the segmented toggle's fill width** and fix it at the root | kol-component / kol-theme |

**Done when:** the editor toolbar matches the Affinity reference in rest / hover / active / press; every
icon-only control shows a tooltip; the gates pass.

## 3. Phase 2 — The inspector, as panes

**Three panes, with real headers** (the Colour panel's look: title in emphasis, full-width rule):

| Pane | Holds | Labels dropped |
|---|---|---|
| **Transform** | object align · X / Y · W / H + lock · rotation + rotate / flip — Affinity's Transform, one block | Alignment · Position · Rotation · Resizing · Dimensions |
| **Appearance** | opacity · corner radius · visibility + blend in the header | Opacity · Corner radius (glyph affordances + tooltips) |
| **Type** | family · style + size · line height + letter spacing · paragraph align + text-box vertical align; variable axes as a header action | Line height · Letter spacing · Alignment |

- **The "TEXT" header row goes.** Its ⋯ and trash move to the Inspector / Parameters / Effects tab row.
- **Dividers** are the pane header's full-width rule — replaces `InspectorSection`'s inset hairline + dim
  10px label in the editor. Whether KOL gets a `pane` variant of `InspectorSection` or a new
  `InspectorPane` is decided by what the Colour panel already uses (reuse, not a third look).
- **Type rows on one grid:** two equal columns; line height and letter spacing fill their cells instead
  of hugging content.
- **Size is one combo field** — number input with its chevron inside (presets in the menu), replacing
  the input + detached dropdown trigger.
- **Glyphs:** the text-box vertical-align row gets text glyphs, not the object-align ones; inspector
  glyphs on the ladder's 16px (not 12–14).
- **#11 grounds** ride along: the `bg-fg-04` / `bg-fg-08` grounds (13 + 5 sites) move to `surface-*` / tone.

**Done when:** a selected text layer shows three named panes, no sub-labels, no TEXT row, aligned type
rows, one size field; checked live against the Affinity screenshot.

## 4. Phase 3 — Transport and selection

- **Transport back to fxr's shape:** the Transport / Output / File tabs as a full-width
  `SegmentedToggle`; play | pause and stop | rewind as two strips; the loop field fills between them.
  Every control keeps its KOL tooltip.
- **Vector hit-testing:** a ~6px screen-space tolerance on path strokes; filled shapes hit anywhere inside.

**Done when:** the transport matches fxr's screenshot; a thin vector line selects on the first click.

## 5. Not in this plan (parked, his rulings)

- #14 — redrawing the align / rotate / flip marks (drawings or a proposal page).
- #15 — the `tone="primary"` hover stop.
- #12 — asset thumbnails.

## 6. Publishing

Phase 1 bumps kol-theme · kol-component; every phase bumps design-editor. I bump and write changelogs
per phase and publish on your go after each phase's live check.
