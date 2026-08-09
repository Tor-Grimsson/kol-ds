---
title: Showcase recovery
type: plan
status: active
created: 2026-07-31
updated: 2026-08-01
description: Twenty-two defects, five root causes, one roadmap
aliases:
  - showcase-recovery
  - quarantine-roadmap
tags:
  - domain/showcase
  - audience/agency-internal
related:
  - "[[../../documentation/04-compositions/02-shells|shells and rails]]"
  - "[[../../documentation/03-components/02-placement|component placement]]"
  - "[[../../documentation/01-foundations/04-layout-breakpoints|layout & breakpoints]]"
  - "[[../01-release/02-shipped-packages|shipped packages]]"
---

# Showcase recovery — audit findings and the quarantine roadmap

Every defect raised in the 2026-07-30 review, traced to a file and a line. Nothing here is a guess; where a cause was not found it says so.

The headline: **almost none of this is a missing feature.** The wordmark exists, the icons page exists, the components index exists, the width law exists, the rail law exists, the tag taxonomy exists. They are overridden, bypassed, or hash-randomised by code that was written next to them without reading them. That is why a roadmap rather than a bug list — the failure is a process one, and the fix has to be procedural.

**The findings moved** (2026-08-01) — the twenty-two defects with their file and line now live at [[03-audit-findings|audit findings]], so this page is the roadmap and that page is the evidence.

**The causes moved** (2026-08-02) — the five root causes now live at [[02-root-causes|root causes]], so this page is the roadmap and its two neighbours are the evidence and the diagnosis.

## The roadmap

His instruction: *"remove everything from the sidebar into a quarantine zone, and reimport it based on RULES, one by one, asking me to check after each category import."*

That is the right shape, and it fits the machinery already here. The sidebar is not a hand-written list — `showcase/src/lib/roster.js:34-58` derives it from the package barrels at build time, and `classification.js` is the hand-authored layer `pnpm validate:roster` already checks for completeness. Quarantine is therefore **an admission gate on the derived roster**, not a file move: everything starts out, and a category comes back only when its rule is written and he has looked at it.

### Phase 0 — freeze and write the rules (no UI change)

Nothing renders differently. Four rule documents get written and approved before any readmission:

1. **Membership** — what earns a place in a published package. The test placement never asked. Settles ExitPreview.
2. **Rail** — one row idiom, one label voice, one indent, both rails. Supersedes the prose at `02-shells.md:78` with enforceable class names.
3. **Width** — which cap applies to which content kind, written as the wrapper each surface must use. The tokens exist; the mapping does not.
4. **Metadata** — one dialect. Either MDX and sets carry kol-docs frontmatter, or the panel is honest about carrying three schemas.

### Phase 1 — quarantine

The roster gains an explicit `admitted` set. Anything absent renders in a `/quarantine` holding page rather than the sidebar. The sidebar empties to the four rule docs and the quarantine page. Ugly and short-lived, and it is the only state where readmission means anything.

### Phase 2 — readmit, one category at a time

Order runs foundations-first because everything downstream references it:

| # | Category | Gate before it returns |
|---|---|---|
| 0 | **The shell frame** | `ShellLayout.jsx:186` gains the cap and the ramp; the `lg`/`xl` TOC-column mismatch fixed; `hasToc` stops being always-true. Nothing else can be judged until the frame is right. |
| 1 | Foundations (tokens, colour, type) | width rule applied; tables at panel; no page-local hexes |
| 2 | Icons | sidebar row navigates; size ramp and toggles verified live. **The icon *mode* toggle cannot return as-was** — the stroke/solid/svg sets were deleted and `Icon`'s `variant` prop removed at kol-icons 0.8.0; the legacy SVGs sit in `_tmp/legacy-icons/`, this machine only. |
| 3 | Documentation (vault) | frontmatter panel renders the real contract; tag colour by namespace |
| 4 | Components — atoms | membership test applied; each survivor named; each rejection given a reason |
| 5 | Components — molecules, organisms | same |
| 6 | Framework, workshop, and the flat packages | same |
| 7 | Blocks and Sets | one preview card; one metadata dialect |

**Each row stops for a check.** He looks, he says yes or no, and only then does the next one start. A rejected category goes back to quarantine with its reason written down, not quietly fixed.

### Phase 3 — enforce

Every rule from phase 0 gains a validator beside `validate-taxonomy` / `validate-roster` / `validate-groups`. A rule with no gate is folklore, and folklore is how this happened.

## Non-goals

- It does not restyle anything before the rules are written. That is the loop being escaped.
- It does not delete components. Quarantine is reversible; deletion is his call, per category, with the reason recorded.
- It does not touch git. Branching, staging and commits stay his.
