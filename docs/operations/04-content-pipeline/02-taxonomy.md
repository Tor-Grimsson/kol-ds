---
title: Categories, chapters, pages
type: reference
status: active
created: 2026-07-31
updated: 2026-08-01
description: The three-level naming law behind the sidebar
aliases:
  - taxonomy
  - categories-sections
tags:
  - domain/content-pipeline
  - audience/agency-internal
  - pattern/docs-as-data
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

## The minimum

**A chapter needs THREE pages beside its `INDEX.md`** (user ruling 2026-08-01: *"every folder should minimum have 3 documents, thats the minimum requirement for a folder ownership"*, and asked whether the index counts, *"no index does not"*).

Gate: **`pnpm validate:chapters`**.

Seven of thirteen chapters were short when the rule was written, and three of them — `01-release`, `02-workbench`, `05-brand` — held nothing at all except their own index. A folder with one file in it is not a chapter; it is a document that grew a directory, and the rail renders it as a group of one whose label repeats its parent's.

The rule cuts both ways, and the second direction is the useful one: **a folder that cannot reach three pages is telling you its subject belongs inside a sibling.** Fold it rather than padding it. Every chapter that fell short here turned out to be the first case — three subjects already written under three headings in a single file — but that is a finding, not the expected answer.

**And every folder HAS one** (same day): *"multiple folders are without INDEX.md, its a rule, there needs to be one, and its always the first page, obviously its a toc"*. Five chapters had none — including `01-foundations`, `03-components` and `04-compositions`, three of the largest — so a reader arriving at a folder of ten files got no door and no ordering. An index is the chapter's first page and its contents, and it links its pages by wikilink so the vault is walkable without the app.

`INDEX.md` is excluded from the count because it is the chapter's front door, not its content.

**It renders as `About`, first in the list, and the chapter header opens it** (2026-08-02). `About`, not `Overview` — `00-overview` is a chapter, so an index row called Overview printed `Overview › Overview`. **No row may repeat its chapter's name**, gated by `validate:chapters`; that check also caught `08-breakpoints/01-breakpoints`, renamed to `01-values`. It used to sort alphabetically into the middle of its own siblings under the label `INDEX` — a chapter listing its own front door among its contents. The **filename stays `INDEX.md`**: that is the framework's contract, it is how Obsidian resolves a folder note, and `00-overview` is already a chapter, so renaming every index would print `Overview › Overview`. The label is a render decision; the filename is a contract. Same reason `docs/INDEX.md` and a category's own `INDEX.md` are not pages: an index names what is inside it and cannot be one of the things it names.

## The split

**`documentation/` is the design system; `operations/` is the repo.** The line is *what the page is about*, not what vocabulary it uses — a keyword count called the brand index "repo" for saying the word *pipeline* once.

Four things sat on the wrong side and moved 2026-08-02:

| Moved | To | Because |
|---|---|---|
| `06-research/workflows/` | `operations/06-workflows/` | Ladle vs Storybook, Changesets, CI, distribution — how a repo is run, never a KOL component |
| `08-breakpoints/03-methods` | `operations/06-workflows/07-device-testing` | a Chrome/Xcode/Playwright rig is machinery |
| `03-showcase/02-doc-card-sets` | `01-foundations/07-doc-card-sets` | it scopes the `kol-doc-*` / `kol-card-*` type roles |
| `operations/SHIPPED-PACKAGES` | `01-release/02-shipped-packages` | a DS fact, but the release ritual owns updating it — the chapter that owns the update owns the page |

**`05-reference-graph` stays in operations, and that is a decision, not an oversight.** It is repo machinery measuring a design-system subject — the only chapter where both homes are genuinely defensible. It sits with the tooling because what it *is* is a generator; what it is *about* is downstream of that.

The split is now readable off a tag rather than re-judged per file: **`audience/agency-internal`** on machinery, **`audience/consumer`** on design-system content.

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

```text
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

```text
foundations · icons · components · blocks · sets · docs · references · documentation · quarantine
```

`foundations` and `documentation` are in that list **as siblings**, while `foundations` is a chapter *inside* the vault that `documentation` renders. One body of content, two doors, no parent. That is the structural defect; the label string is only its symptom.

## Target shape

```text
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
