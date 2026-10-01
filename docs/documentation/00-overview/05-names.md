---
title: Names
type: reference
status: active
created: 2026-09-30
updated: 2026-09-30
description: What every level and kind is called
aliases:
  - names
  - conventions
  - vocabulary
  - rail levels
tags:
  - domain/architecture
  - domain/files
related:
  - "[[INDEX|Overview]]"
  - "[[../03-components/00-taxonomy|component taxonomy]]"
  - "[[../04-compositions/02-shells|reference shells]]"
  - "[[../04-compositions/16-app-anatomy|app anatomy]]"
  - "[[../04-compositions/01-blocks-and-sets|blocks & sets]]"
---

# Names

One page for the words the design system uses about itself, so a name is looked up instead of
re-invented. Every term below is its own heading, so ⌘K on it lands here. The law behind each
term lives in the page it links.

## The tree

What holds what, from the grandest parent down (2026-09-30, the library taxonomy). The showcase
draws it at `/library`.

```text
KOL                                   the design system
├─ Styles                             what everything is painted with
├─ Library                            everything you build with
│   ├─ Composition                    grouped by SIZE — each is made of the one before
│   │     Components → Blocks → Apps
│   └─ Collection                     grouped by BELONGING — the same things, cut another way
│         Sets      by purpose
│         Packages  by shipping
└─ Reference                          about the system, not part of it
      Docs · Search · Development
```

## Library

Everything a consumer takes from the design system, cut two ways: **Composition** by size and
**Collection** by belonging. The same component sits in both, on its tier and in its package.

## Composition

The Library grouped by **size**. Each level is made of the one before it: a component inside a
block, a block inside an app. Its children are Components, Blocks and Apps.

## Collection

The Library grouped by **belonging**. It adds nothing new; it groups what Composition holds, by
what it is for (Sets) or by how it ships (Packages).

## Reference

What is about the system rather than part of it: Docs (the written law), Search (the way to find
a page) and Development (the repo's instruments).

## Spaces

The tabs in the showcase header are the tree's parents. Each has a home page and its own left
rail, and its children are that rail's categories.

| Space | Holds |
|---|---|
| Styles | what everything is painted with: tokens, color, type, icons, guides |
| Library | Composition (Components · Blocks · Apps) and Collection (Sets, Cards first · Packages, each package's page carrying install, the apps that use it and its family, its changelog a page of its own) |
| Docs | the `docs/` vault: Documentation and Operations |
| Search | the four views: Results · Tags · Graph · A–Z |
| Development | the repo's instruments: tools (references, quarantine), records (phase log, open questions), the lobby |

## Rail levels

The same four names in code comments, gate messages and conversation (ruled 2026-08-01, see
[[../04-compositions/02-shells|reference shells § The rail's vocabulary]]).

| Level | Is | Example |
|---|---|---|
| Category | the eyebrow at the top of a rail block | `COMPONENTS`, `RECORDS` |
| Chapter | the second level — a count and a chevron; its label opens the chapter's home, the chevron only folds. A chapter may hold chapters: the rail nests to any depth (Library › Composition › Components › Atoms) | `Atoms (61)` |
| Page | a link | `Button` |
| Section | a row in the right rail — a heading on the page | `Installation` |

## Homes

Every space and every chapter has a home: a markdown page with frontmatter, so it is tagged and
searchable like any doc. The frontmatter is hidden on a home and shown on a page; `F` flips it.

## Component

One export with a face — it paints and stands alone, or composes things that do. Placed on the
atomic ladder by what it **is**:

| Tier | Is |
|---|---|
| Atom | one interface element |
| Molecule | nameable parts working as one unit |
| Organism | a self-contained region |

Law: [[../03-components/00-taxonomy|component taxonomy]].

## Utility

One export with **no face of its own** — a layout wrapper, a mechanism other components wear, an
overlay drawn onto a target, a guard or a fallback state. One group, beside the ladder.

## Block

A composition of shells and tools — sidenavs, headers, footers, heroes, panels, toolbars — shown at
every width to show **how it breakpoints**. Copied whole into a page.

## Card

A **website card**: one section of a page — a hero, a text-and-image split (text left image right,
image left, centred, image above), a call to action, a signup, a set of feature cards, an FAQ, a
content card. Made from the `Section*` components and the content cards, shown live at every width
with its source to copy. **Cards is a set**, a purpose family drawn from two packages; a card is not
a block (shells and tools).

## Set

A **family grouped by purpose**: components shown together, then what they compose. It may cross
packages. Cards takes the `Section*` family from kol-component and the content cards from kol-content.
A family that is only one package's components is not a set: it is that package's page under
Packages (2026-09-30).

## Package

A published `@kolkrabbi/*` package: what `npm install` gives you. Its page carries its family (every
component it ships, on the atomic ladder, and the sets built from it), its changelog and its version.

## Styles

The reference lookup: pages that read their values straight off the installed packages
(Foundations), the icon sets (Interface · Signal), and the guides.

## App layers

The words for how an app is built, from the bottom (law:
[[../04-compositions/16-app-anatomy|app anatomy]]).

| Layer | Is |
|---|---|
| Engine | plain JS, no UI — parse, index, rank |
| Shell | the frame: the rail, the layout root, the nav keys, the phone bar |
| Hub | the standard pages around the work — Home, Settings, the `S` sheet |
| Studio | the Hub plus Library · Create · Use |
| Catalog | the filter-and-cards page |
| Tool | the work itself |
| Fixture | fake data the apps run on |

## Records

What work leaves behind: the **phase log** (every run — phases, decisions, the plan) and **open
questions** (visual calls laid out side by side, one round per page).
