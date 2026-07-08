# Session: Button hover — touch stuck-hover guard (DISPUTED, likely wrong root cause)

**Date:** 2026-07-08
**Agent:** Grim (Opus 4.8 1M)
**Summary:** Gated all `.kol-btn` hover rules behind `@media (hover: hover)` to stop sticky hover on touch. User tested a repro and rejected it — the real complaint is almost certainly different (see Known Issues). Handing off unresolved.

## Changes Made

### Files Modified
- `packages/theme/kol-components-atoms.css` — wrapped all 7 button hover rulesets (primary/secondary/accent/outline/ghost + `.kol-btn-quiet` + the `.kol-btn:hover .kol-icon-*` swap) in `@media (hover: hover)`.
- `.changeset/btn-hover-touch-guard.md` — new (kol-theme **patch**).
- `_tmp/kol-touch-hover-repro.html` — a repro (image + two buttons) published as an Artifact.

## Current State

### Working
- SegmentedToggle → Button size alignment (earlier this session) is done, published-pending. See `session-log/2026-07-08-segmented-toggle-button-sizes.md`.
- The touch-guard change is applied and is *correct in itself* (touch should not fire hover), but see below.

### Known Issues — READ THIS
- **The fix likely addresses the wrong thing.** The user's real complaint: a primary button **turns see-through / invisible** when its hover state fires. Root cause is the hover rule swapping the solid fill for a **translucent** color (`--kol-fg-08`) — over an image background that reads as the button vanishing. This happens on **desktop hover too**, not just touch. The `@media (hover: hover)` guard only stops the *touch-sticking*; it does NOT stop the button going see-through on a normal hover.
- **Probable real fix (next agent):** change the button hover states so they swap to an **opaque** color (e.g. an `oq`/solid neutral, or darken/lighten the existing solid fill) instead of a translucent `--kol-fg-*` fill — so a button never turns see-through over content on hover. Then decide whether the touch-guard stays or is redundant.
- My repro confused the user (a deliberately-"broken" button next to a "fixed" one; on desktop both go translucent on hover, which read as "the fix doesn't work"). It demonstrated the wrong axis.
- User ended the session dissatisfied and is handing to another agent.

## Next Steps
1. Re-diagnose from the user's words: "button turns invisible on hover" → the translucent hover fill, not touch.
2. Make button hover fills opaque so they never go see-through over an image; keep or drop the `@media (hover: hover)` guard accordingly.
3. Two changesets pending (`segmented-toggle-button-sizes`, `btn-hover-touch-guard`) — the latter may need revising/replacing per the real fix before publish.
