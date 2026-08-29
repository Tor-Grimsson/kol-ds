---
component: FullscreenOverlay
source: kol-fxr — LabsShortcuts.jsx:80 · BatchExportModal.jsx:73 · PaletteModal.jsx:131 · MediaPicker.jsx:82,208 · EditorFooter.jsx:259
staged: 2026-08-27
status: draft
deps: [FullscreenOverlay, ShellDrawer, kol-overlay-scrim]
---

# EditorOverlaysOnFullscreenOverlay

## The ask

**Rule the overlay tier, and say what the editor's six should be.** kol-fxr
hand-rolls every overlay it has. None of them touch `FullscreenOverlay` or
`.kol-overlay-scrim`, both of which already exist and already do the job.
The user's words: *"the overlays are a MESS."*

This is filed as a consumer's mess, not a DS defect — but the DS owns the
answer, because six consumers inventing six scrims is exactly what a design
system is for. What is wanted back is the ruling plus whatever gap the
adoption exposes.

## The evidence — six overlays, five scrims, two z-layers

| overlay | scrim | z |
|---|---|---|
| `LabsShortcuts` | `rgba(0,0,0,0.6)` via a local `SCRIM` const | `z-[1000]` |
| `BatchExportModal` | `rgba(0,0,0,0.6)` via a **second** local `SCRIM` const | `z-[1000]` |
| `PaletteModal` | `bg-black/50` | `z-[1000]` |
| `MediaPicker` (browser) | `rgba(0,0,0,0.6)` inline | `z-[1000]` |
| `MediaPicker` (lightbox) | `rgba(0,0,0,0.88)` + `blur(6px)` inline | `z-[1100]` |
| `EditorFooter` (webm progress) | `rgba(0,0,0,0.6)` inline | `z-[1000]` |
| mobile sheets ×4 | `bg-black/60 backdrop-blur-sm` | `z-10/20` |

`SCRIM = 'rgba(0, 0, 0, 0.6)'` is declared **twice**, in two files, byte for
byte. The DS's `.kol-overlay-scrim` is `color-mix(in srgb, #000 60%,
transparent)` + `blur(1px)` — the same intent, expressed once.

The hand-typed `z-[1000]` / `z-[1100]` sit far above the DS's own overlay
layer (`.kol-overlay` is z-100, `ShellDrawer` z-[100]), so the estate has two
stacking universes that only agree by luck.

## And the part that is not cosmetic

`FullscreenOverlay` owns Escape, backdrop dismiss, the close button, scroll
lock, **focus trap** and stacking. Audited across fxr's six:

| | Escape | backdrop | focus trap | scroll lock |
|---|---|---|---|---|
| LabsShortcuts | ✅ | ✅ | ❌ | ❌ |
| BatchExportModal | ✅ | ❌ | ❌ | ❌ |
| PaletteModal | ✅ | ✅ | ❌ | ❌ |
| MediaPicker | ✅ | ✅ | ❌ | ❌ |
| EditorFooter | ❌ | ❌ | ❌ | ❌ |

**Not one traps focus** — a Tab out of any of them walks the page underneath,
the exact bug `FullscreenOverlay` fixed for SettingsPanel on 2026-08-26. Four
re-implement an Escape listener that already ships. One dismisses on nothing.

## What we are asking the DS to answer

1. **Is `FullscreenOverlay` the one overlay for this tier**, or is the
   editor's lightbox (full-bleed media, prev/next, 0.88 scrim) a second
   archetype that should ship rather than be hand-rolled?
2. **Should the scrim be a token** a consumer can step (the lightbox wants a
   heavier one than a settings sheet) rather than a fixed rule?
3. **What is the z-contract?** If DS overlays live at 100, a consumer at 1000
   is either wrong or the DS's number is too low for an app with a menubar,
   rails and popovers. One of the two should move, and the DS should say which.

## What this repo will do on the answer

Retire all five local scrims and both `SCRIM` consts, drop the hand-typed
z-indices, and put the four modal-shaped overlays on the DS component.
Mobile's four sheets stay their own shape (they are full-bleed, rail-offset
and not centred) unless the ruling says otherwise.

## DS answer — 2026-08-27 · the facts; the rulings held 🔴

**What ships today (not a ruling — the state):**

1. **`FullscreenOverlay` is the one overlay mechanism** — Escape, backdrop dismiss (backdrop only, so portalled dropdowns survive), the DS Button close, scroll lock, **focus trap** (since 2026-08-26), stacking at `.kol-overlay` z 100. **The lightbox already ships on it: `MediaViewer`** — full-bleed media, prev/next arrows `fixed` at the viewport edges, slides inside 10rem gutters (0.114.0). Nothing hand-rolled is a second archetype the DS lacks; the editor's four modal-shaped overlays are `FullscreenOverlay`, its lightbox is `MediaViewer` (or `FullscreenOverlay` + its own stage, as kol-r2b2 does).
2. **Two scrims ship, neither steppable:** `.kol-overlay` is a **flat `surface-primary`** (user ruling 2026-08-27 — "the backdrop is the surface, no wash"); `.kol-overlay-scrim` is `#000 60 %` + blur(1px), worn by `ShellDrawer`, `ShellSearchOverlay`, the framework's mobile nav backdrop. fxr's `rgba(0,0,0,.6)` ×5 IS `.kol-overlay-scrim`; its lightbox's `.88` + blur(6) has no DS twin.
3. **The z ladder exists as tokens** (kol-theme.css): `--kol-z-base 1 · dropdown 10 · sticky 20 · overlay 50 · modal 100 · toast 200 · tooltip 300 · nav 1000`. The DS's own chrome does not all sit on it: `.kol-overlay` 100 ✓ · `ShellDrawer` scrim 100 / sheet 200 · `ShellSearchOverlay` 300 · `.kol-popover-float` 210 · **`.kol-popover` and `.kol-tooltip` 1000** (the nav tier). It is documented nowhere in `docs/` — one mention in the shell doc.

**Rulings needed (yours):**
- (a) one tier — modals on `FullscreenOverlay`, the lightbox on `MediaViewer`, no third archetype; or the editor's heavy-scrim lightbox ships as one.
- (b) a steppable scrim token (`--kol-overlay-scrim`, e.g. 60 % default, the lightbox at 88 %) — or the two fixed scrims are the whole vocabulary.
- (c) the z-contract — the ladder is it and the DS moves its own strays (`.kol-popover` / `.kol-tooltip` off 1000 onto `--kol-z-tooltip`, search off 300), consumers never above `--kol-z-nav`; or the ladder is re-cut.

On the ruling: the doc paragraph (`01-tokens.md § Stacking` + the overlay contract), the DS strays moved, and the receipt back to kol-fxr.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.76.0 · kol-component 0.116.0

Ruled (user, 2026-08-27) and documented in `01-tokens.md § Stacking` + `§ Overlays`: (a) ONE tier — a modal-shaped overlay is `FullscreenOverlay` (Escape, backdrop, close, scroll lock, focus trap, `modal` z), a paged media view is `MediaViewer` on it (arrows fixed at the viewport edges, 10rem gutters); no third archetype. (b) NO scrim token — two fixed scrims are the vocabulary: `.kol-overlay` flat `surface-primary`, `.kol-overlay-scrim` `#000 60 %` + blur (your five `rgba(0,0,0,.6)` are that class); the lightbox takes `MediaViewer`'s flat scrim. (c) the `--kol-z-*` ladder IS the z-contract; the DS moved its own strays — `.kol-popover` / `.kol-tooltip` 1000 → `tooltip` 300, `ShellSearchOverlay` 300 → `modal` 100 — and a consumer never rises above `--kol-z-nav`, nor an overlay above `--kol-z-modal`. 21 gates clean; verified in source.

**Remainder here:** none — kol-fxr: bump kol-theme 0.76.0 · kol-component 0.116.0; the four modal-shaped overlays (LabsShortcuts · BatchExportModal · PaletteModal · EditorFooter progress) onto `FullscreenOverlay`, the MediaPicker lightbox onto `MediaViewer` (or `FullscreenOverlay` + your stage), both `SCRIM` consts and every `z-[1000]` / `z-[1100]` gone; the four mobile sheets keep their shape on `.kol-overlay-scrim` at `--kol-z-modal`. Also still owed from LabeledControlSection: `AutoControls.jsx` imports `SettingsSection` — it is `LabeledControlSection` since component 0.112.0, no alias.
