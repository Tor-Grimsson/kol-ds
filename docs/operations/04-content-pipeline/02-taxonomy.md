---
title: Categories, chapters, pages
type: reference
status: active
updated: 2026-07-31
description: The three-level naming law for everything the sidebar shows — what a category is, what a chapter is, what a page is, why a surface is none of them, and the 2026-07-30 failure that made the distinction load-bearing.
aliases:
  - taxonomy
  - categories-sections
tags:
  - domain/workflow
  - domain/design-system
  - pattern/information-architecture
related:
  - "[[INDEX|content pipeline]]"
  - "[[03-manifest|the nav manifest]]"
  - "[[../../documentation/04-compositions/02-shells|shells]]"
---

# Categories, chapters, pages

Three levels. Every row in the left rail is exactly one of them, and the level decides what it may contain.

| Level | What it is | Comes from | Examples |
|---|---|---|---|
| **CATEGORY** | a top-level body of material with its own spine | a `docs/` root folder, or a first-class app area | `DOCUMENTATION` · `OPERATIONS` · `COMPONENTS` |
| **CHAPTER** | a numbered division inside a category | a numbered folder inside that root | `00-overview` · `01-foundations` · `03-components` |
| **PAGE** | one document or one component | a file | `04-layout-breakpoints.md` · `Button` |

## The rule

> **A category is a body of material. A chapter is a division of it. A page is a leaf.**
> Anything that is not one of those three is a **surface** — a route the app happens to serve — and a surface is not a rung in this ladder.

## Page slots

**The renderer is a property of the page, not of the chapter.** A chapter does not have to be "markdown" or "React" — it holds pages, and each page declares how it renders. Three renderers exist today and a fourth costs nothing:

| Renderer | Implementation | For |
|---|---|---|
| `DocumentationReader` | kol-workshop | plain vault markdown |
| `MdxDoc` | `showcase/src/lib/MdxDoc.jsx` | **markdown + JSX together** — live components inside prose (`<Preview>`, `<Api>`, `<Install>`) |
| React page | `showcase/src/pages/*.jsx` | what markdown cannot express — live theme reads, the icon wall |

The user's words: *"we can't say everything has to work only with mds, we have to think modular, sometimes we need to render xyz and we have to be flexible to how and to change."*

This dissolves the apparent conflict in chapter 01. **Foundations is the vault chapter `01-foundations/`** — that was never in question, the folder says so. Its five markdown docs are pages; the three live React pages (`Foundations` · `FoundationsColor` · `FoundationsTypography`) are *also* pages in that chapter, with a different renderer. Nothing merges, nothing is deleted, and neither copy is demoted.

The corollaries follow from "slot":

- A page may be **split** — markdown body with JSX components inside it. That is MDX, and 70 component docs already work this way.
- A chapter may hold **several markdown pages under one parent** — that is what a chapter *is*.
- A new renderer is a new value in the manifest's `render` field, not a new level in this ladder.

## The failure

On 2026-07-30 the quarantine port admitted "Foundations" as a **category**, so the sidebar read:

```
SHOWCASE
  Foundations (3)
    Tokens
    Color
    Typography
  Quarantine
```

Three things are wrong in five lines:

| Wrong | Right |
|---|---|
| `SHOWCASE` as the section label | `DOCUMENTATION` — Showcase is the app, not a body of material |
| `Foundations` as a category | a **chapter** — it is `docs/documentation/01-foundations/`, chapter 01 of the Documentation category |
| `Quarantine` beside it | a **surface** (a tool page), not a peer of a chapter |

The port was deliberately one category at a time so that exactly this kind of mismatch would surface early. It did — the label was simply believed instead of checked.

## Flattening

`showcase/src/lib/shell-nav.js` declares `ALL_ROUTES` as a flat list of peers:

```
foundations · icons · components · blocks · sets · docs · references · documentation · quarantine
```

`foundations` and `documentation` are in that list **as siblings**, while `foundations` is a chapter *inside* the vault that `documentation` renders. One body of content, two doors, no parent. That is the structural defect; the label string is only its symptom.

## Target shape

```
DOCUMENTATION            ← category (docs/documentation/)
  00 Overview            ← chapter
  01 Foundations         ← chapter
    Tokens               ← page
    Color                ← page
    Typography           ← page
  02 Icons
  03 Components
  04 Compositions
  …

COMPONENTS               ← category (the package barrels)
  Atoms                  ← chapter (tier)
    Button               ← page
  Molecules
  Organisms

OPERATIONS               ← category (docs/operations/)
  01 Release             ← chapter
  02 Workbench
  03 Showcase
  04 Content pipeline

TOOLS                    ← surfaces, not a category: Blocks · Sets · References · Quarantine
```

## Naming

- Category labels are **authored**, upper display case, and live in the manifest — never derived from a folder slug and never CSS-transformed ([[../../documentation/04-compositions/02-shells|no auto text-transform]]).
- Chapter labels drop the numeric prefix and Title-Case the remainder (`01-foundations` → `Foundations`). The number carries order, not identity.
- Page labels come from the document's `title:` frontmatter, or for a component, its export name verbatim.

## Ordering

- Chapters order by their numeric prefix. A chapter with no prefix sorts last and is a bug — the framework requires the prefix.
- Pages inside a chapter order by filename prefix; components order alphabetically inside their tier.
- Categories order by an explicit list in the manifest. There is no rule that derives category order, and there should not be — it is an editorial decision.
