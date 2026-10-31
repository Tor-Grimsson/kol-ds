# Playbook — Interface icon categories

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`. Plan: `plan-2026-10-31-icon-categories.md`.

**Goal:** kol-icon-set-interface regrouped into the user's 18 categories (2.1); an outline · solid · all filter in the icon browser (2.2).

**Standing rules (non-negotiable):**
- Interface only: signal, identity and external are separate sets.
- Icon names never change; every `<Icon name>` resolves before and after.
- Solid is a variant, not a category.
- The batch (2.3) stays parked: TALK.

---

[22:39 · 2026-10-31] · W1 · plan-2026-10-31-icon-categories.md
  what → W1 ruled as placed (user: "go on both dont stop until done go!"); building 2.1 + 2.2
  note → 2.3 stays TALK (his pick on duplicate drawings)
[22:43 · 2026-10-31] · 2.1 · packages/icons/src/kol-icon-set-interface/
  what → 255 SVGs moved from 25 group folders into 16 category folders (flow, commerce wait for the batch)
  what → showcase gallery ORDER = plan order; interface's category layer dropped (folders are the categories)
  what → inventory + home + loader docs regenerated; external inventory gains social (0.57.0 leftover)
  verify → names before/after 255 = 255, 0 lost ✓ · reachable gate ✓ · cuts 433 ✓ · page renders 16 groups ✓
[22:43 · 2026-10-31] · 2.2 · showcase IconsGallery Type chips
  what → filter already shipped (Stroke · Solid · Color, none = all); no code
  verify → Solid 49 of 255, all solid cut ✓ · Stroke 0 `-solid` ✓
  note → IconBrowser renders an empty first grid cell on every set (signal too) — existing, not this change
[22:44 · 2026-10-31] · W2 · published kol-icons 0.58.0
[22:58 · 2026-10-31] · 2.3 · packages/icons/src/kol-icon-set-interface/
  what → all 559 batch icons (treated copies) in their categories; 50 renamed to the next free -02/-03; flow + commerce folders open
  verify → 814 names, 18 folders ✓ · cuts 992 ✓ · reachable ✓ · Commerce page 39 icons, 0 blank ✓
  note → icon-ink's 4 failures are in component/framework/metric code, not the icons
  what → published kol-icons 0.59.0; ClaudeListIconSet closed, kol-hq receipt returned
