# Playbook — library taxonomy

> **Live work journal.** Append-only, newest at the bottom, real timestamps. One idea per line, no prose.
> Milestone logs: `session-log/`.

**Goal:** build `plan-2026-09-30-library-taxonomy.md` — the parents as tabs (Styles · Composition · Collection · Docs · Search · Development), a home with a diagram per parent, Cards → Sets, single-package sets fold into their package page; then names doc, publish, phase log entry, /log-work.

**Standing rules (non-negotiable):**
- Nothing overwritten — a replaced file moves to `_tmp/<date>-<what>/` first.
- No user-facing copy renamed beyond what the plan names.
- `pnpm validate` clean at every checkpoint; the run's entry lands in the phase log at close.
- Git is the user's. Publish only package deltas, bumped + changelogged.

---
## Entries

[16:48 CEST · 2026-09-30] · setup · playbook created
  what → initialised the live playbook   why → user: "I want it done as /kol-goal /playbook publish documentation and log-work after"
  note → open issue ruled: a set equal to one package folds into that package's page; only purpose families (Cards) stay sets
  note → W1 names doc moves after the build (user: document what shipped)

[16:54 CEST · 2026-09-30] · W3 header · showcase/src/nav/shell-nav.js · lib/ShellChrome.jsx
  what → six tabs: Styles · Composition · Collection · Docs · Search · Development; LIBRARY_CHILDREN names each parent's children
  before → 8 leaf tabs   after → 6 parent tabs; children are rail categories (COMPONENTS · BLOCKS · APPS / SETS · PACKAGES / the four search views)
  note → URLs unchanged — SPACE_PREFIXES moves ownership only; search items carry the parent as `space` (in:composition, in:collection)
  note → children still gated per rail (isSurfaceAdmitted); a parent shows when any child is admitted

[16:54 CEST · 2026-09-30] · W2 homes · showcase/src/homes/{library,composition,collection,search}.md · pages/Library.jsx
  what → a markdown home per parent + a CompositionDiagram each (the tree · the size nesting · one set from two packages)
  note → DECISION: Library lives at /library, not on `/` — the front door's hero + wall above the fold is a 2026-09-30 ruling; the wordmark stays the front door
  note → Search home shows above the results only while no query is typed
  note → sets.md · cards.md · blocks.md · components.md corrected to the new Set (purpose family, may cross packages)

[16:54 CEST · 2026-09-30] · W4 Cards → Sets · single-package sets → package pages
  what → Cards is the first chapter of the SETS rail; each composed set a row under it
  what → /sets/family/<dir> redirects to /packages/<dir>; the package page carries the family (sets + tier tables)
  before → SetFamily.jsx   after → PackagePage   ▣ SetFamily.jsx → _tmp/2026-09-30-set-family/
  verify → 32 gates ✓ · showcase build ✓ · preview render of 14 routes, 0 console errors ✓

──────────── MILESTONE: library taxonomy ──────────── [16:57]
  changed: 14 files · quarantined: 1 · build ✓ · 32 gates ✓
  log: session-log/2026-09-30-library-taxonomy.md
