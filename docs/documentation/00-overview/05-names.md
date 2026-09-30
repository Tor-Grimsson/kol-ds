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
  - audience/consumer
related:
  - "[[INDEX|Overview]]"
  - "[[../03-components/00-taxonomy|component taxonomy]]"
  - "[[../04-compositions/02-shells|reference shells]]"
  - "[[../04-compositions/16-app-anatomy|app anatomy]]"
---

# Names

One page for the words the design system uses about itself, so a name is looked up instead of
re-invented. Every term below is its own heading, so ⌘K on it lands here. The law behind each
term lives in the page it links.

## Spaces

The tabs in the showcase header. Each space has a home page and its own left rail.

| Space | Holds |
|---|---|
| Components | every component, on the atomic ladder |
| Blocks | shells and tools composed, and how they breakpoint |
| Cards | website cards — the sections a marketing site is built from |
| Sets | each package's family, and what it composes |
| Styles | the reference lookup — tokens, color, type, icons, guides |
| Docs | the `docs/` vault — Documentation and Operations |
| Apps | the apps tier — one app per layer or tool |
| Development | the repo's instruments — tools (tag graph, tags, index), records (phase log, open questions), packages |

## Rail levels

The same four names in code comments, gate messages and conversation (ruled 2026-08-01, see
[[../04-compositions/02-shells|reference shells § The rail's vocabulary]]).

| Level | Is | Example |
|---|---|---|
| Category | the eyebrow at the top of a rail block | `COMPONENTS`, `RECORDS` |
| Chapter | the second level — a count and a chevron; its label opens the chapter's home | `Atoms (67)` |
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
with its source to copy. Not a block (shells and tools) and not a set (a package's family).

## Set

A **family**: every component one package ships, shown together, then the apparatus composed from
them. A set is where a package's name leads.

## Styles

The reference lookup: pages that read their values straight off the installed packages
(Foundations), the icon sets (V1 · Signal), and the guides.

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
