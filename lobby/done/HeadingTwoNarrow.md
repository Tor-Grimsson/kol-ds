---
component: HeadingTwoNarrow
source: kol-theme/kol-typography.css (.kol-sans-heading-02)
staged: 2026-08-12
status: draft
deps: []
---

# HeadingTwoNarrow — `.kol-sans-heading-02` moves to sans-narrow

## The ask (user ruling 2026-08-12, kol-website session)

`.kol-sans-heading-02` currently sets `font-family: var(--kol-font-family-sans-compact)`.
User verbatim: *"this should be Narrow ,, make heading-02 narrow not compact"*.

So the ramp's narrow/compact boundary moves down one rung: heading-01 AND
heading-02 render sans-narrow; heading-03..06 stay sans-compact.

## Where it was ruled from

kol-website home hero — `p.kol-sans-heading-02.uppercase.text-auto`
("KOLKRABBI VINNUSTOFA") renders compact next to the narrow display line under
it; the user wants that rung in the narrow family.

## Recreation notes

- One declaration in kol-typography.css; check whether `.kol-prose h2` or any
  other rule pairs "heading-02 = compact" in prose comments — the prose ramp
  deliberately skips heading-02, so it should be untouched, but the comment at
  the headings block cites the family split and may want its wording synced.
- Consumers pick it up on the next theme publish — no call-site changes.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-theme@0.40.0** (registry-verified). `.kol-sans-heading-02`
family `sans-compact` → `sans-narrow`; the block comment, the vault typography
table (01/02 narrow · 03/04/05 compact) and the showcase reasoning prose all
synced. Prose ramp untouched — it skips heading-02 by design. Adoption is
kol-website's: bump theme ≥0.40.0, the hero rung goes narrow with no call-site
changes.
