---
title: Figma file setup
type: reference
status: active
created: 2026-11-04
updated: 2026-11-04
description: How design systems set up Figma libraries and component pages, and how an agent checks its Figma work
aliases:
  - figma setup
  - figma practices
tags:
  - domain/research
  - domain/figma
related:
  - "[[INDEX|research]]"
  - "[[../../operations/10-figma/01-file-setup|Figma file setup]]"
---

# Figma file setup

Outside reading on two questions. How do mature design systems split and arrange their Figma libraries? And how should an agent working in Figma check its own work? It was prompted by the 2026-11-04 Figma review, where agents shipped overlapping sections, a component set with two properties of the same name, and messy layouts.

**This page is reference, not law.** The rules the user approved from it live in the kol-figma skill (§6–7, `scripts/audit.js`) and in the float Figma plan (W8). Every line below comes from a page opened on 2026-11-04, and the links are under Sources.

## The practices

| # | Practice | Who says it | In their words |
|---|---|---|---|
| 1 | **Split a growing system into several libraries** | Figma · Primer | Figma: teams "break up their components into multiple libraries. This tends to scale much better", so people "turn on only the libraries they need". Primer ships Primitives (tokens), Web (components), Octicons (icons), and separate template libraries (Interfaces, Email). |
| 2 | **Templates and views live apart from the components** | Primer | Primer Interfaces holds "common views and UI patterns", in a different library from Primer Web's components. |
| 3 | **Pages and frames are the grouping, not long slash names** | Figma | "Use pages and frames as organizing containers." Page names become headings in the assets panel, frame names become collapsible subheads, and components in one frame show up together. |
| 4 | **Usage notes live beside the masters** | Figma | Put "accompanying notes, annotations, proper and improper usage examples" on the master's page; a description on each component shows as a tooltip. |
| 5 | **Private parts start with `_` or `.`** | Figma | A prefix keeps a component out of the published library. |
| 6 | **Tokens are variables, scoped** | Primer · Figma skill | Primer scopes colour variables to frame fill, shape fill, text fill and stroke. Figma's own library skill: "NEVER leave as `ALL_SCOPES`." |
| 7 | **Use properties, not overrides; never detach** | Primer | Keep components small and simple, use component properties rather than nested overrides, and use components as they are, without detaching. |
| 8 | **Variants are laid out, never left stacked** | Figma skill | After `combineAsVariants`, variants stack at (0,0) and must be laid out in a grid by hand. |
| 9 | **Validate from evidence, and keep checked frames readable** | Figma skill · Seamgen | Figma: one composition screenshot, and inspect the review frame "at normal scale and repair clipped, truncated, low-contrast, empty, misplaced, or detached content". Seamgen: keep frames small enough that the rendered image is legible. |
| 10 | **A script audit runs until clean** | Geist skill (unofficial) | A read-only `audit.js` checks values, geometry, overlays, instances, look-alikes, prototype and theme. "The audit runs until it is clean." Its report lists what was built, the evidence, and the agent's own choices. |
| 11 | **Figma now ships its own linter** | Figma | Check designs (June 2026) flags hard-coded colour, text, radius and spacing, contrast, library mismatches and detached components. It is limited to Organization and Enterprise plans, and designers report false positives on intentional exceptions. |

## How the named systems are set up

| System | What could be confirmed |
|---|---|
| **Primer (GitHub)** | Several team libraries: Primitives (tokens), Web (components, light and dark through variables), Mobile (internal), Octicons (icons), Interfaces and Email (templates). Designers turn on only what they need. |
| **Material 3** | One community kit with styles, components and a getting-started page. Google reports 28 components, 169 Figma components, 1,984 variants and 429 styles. It carries metadata for accessibility, colour values, token names and state details. Its page list is read below. |
| **Ant Design** | No official Figma library. ant.design lists the open-source Figma kit under *Third Party*, and the community kit's preview groups pages as Dashboard, Style Guide, Components and Blocks. |
| **Vercel Geist** | No official Figma file. Geist ships as code (`@vercel/geistcn`, `@vercel/geistcn-assets`) and a machine-readable `design.md`. The community Figma files are unofficial recreations. |

## Three library files, read

The user opened three community libraries on 2026-11-04 (three more in round 2, below) as the model for how a library file should be built. The files were read by script, read-only, and every number below comes from the file itself.

### Page lists

| File | Pages, in order |
|---|---|
| **macOS 27** (Apple) | Cover · Getting Started · — · Examples · — · Colors · Materials · Text Styles · Product Bezels · — · **one page per component, A–Z** (Alerts … Windows, 30 pages) · — · Change log · License · `_Kit` |
| **Material 3 Design Kit** (Google) | Getting started · Table of contents · Avatars · Icons · Examples · Shape · Styles · Utilities · `---` · **one page per component, A–Z** (App bars … Tooltips, 24 pages) |
| **Simple Design System** (Figma) | Cover · `---` · Foundations · Icons · `---` · Examples · Composition guide · `---` · **one page per component, A–Z** (Accordion … Tooltip, 16 pages) · `---` · Forms · Sections · `---` · Utilities · Component Playground |

All three follow the same order: cover and getting started, then foundations, then examples, then **one page per component**, then compositions and utilities. Dividers separate each group. Private parts start with `_` or `.` (macOS `_Kit`, Material's `.Building Blocks/…`, SDS's `_Component Annotation`).

### A component page

| | macOS 27 | Material 3 | Simple Design System |
|---|---|---|---|
| Page canvas | flat grey `#808080` | the kit's lilac `#DFD5EC` | light grey `#F5F5F5` |
| Header | a **`Header` instance** above everything: component name, one-line description, link to the guideline | a **`Header` instance** at the top of each section | none, the page name does the job |
| The masters | the component sets in one **section named after the component**, set frames **dashed** | one section per component family (App bar · XR app bar · Bottom app bar), each section 632 wide, set beside its private `Building Blocks` frame | one section holding all three sets (Button · Icon Button · Button Group), **dashed** set frames |
| Axis labels | — | — | **`_Component Annotation` instances** label each variant row and column (Medium/Small → Primary/Neutral/Subtle, and Default/Hover/Disabled along the bottom) |
| Examples | **Light Example** and **Dark Example** sections beside the masters, built from instances | example instances in the same section as the set | — |
| Property names | `Mode` · `State` · `Color Selected` | `Configuration` · `Elevation`, plus `Show 1st trailing action`-style booleans, `Image` swap | `Variant` · `State` · `Size`, plus `Label` text, `Has Icon Start`, `Icon Start` swap |
| Descriptions | empty | — | search keywords (`Keywords: action, negative, destructive`) |

### Foundations

- **Material's Styles page** sets each foundation (Typography, Color Guidance, Elevation) on its own card. The card has a title, a "See design guideline" link, one line of intent, then the specimen: type ramp in two columns (baseline and emphasis), tonal palettes beside the light and dark theme roles, and elevation levels on light and dark grounds.
- **Variables carry the modes.** macOS has `Colors [Light|Dark]`, `Sizes [Medium|Mini|Small|Large|XL]` and `Context [Content Area|Over-glass]`. SDS has `Color Primitives`, then `Color [SDS Light|SDS Dark]`, `Typography Primitives`, `Typography`, `Size` and `Responsive [Desktop|Mobile|Tablet]`. In both, primitives sit in their own collection under the semantic layer.

### What this means for KOL's library

| They all do | KOL's library today |
|---|---|
| One page per component, A–Z, in a group behind a divider | **every master on one page** (↳ Components, 309:88) |
| A shared Header component on every page or section: name, description, guideline link | no header; pages carry only their name |
| The sets sit in a section named after the component, with examples beside them in light and dark | sets placed wherever they were built, examples on separate pages |
| Variant axes labelled by an annotation component | no labels; the reader decodes variant names |
| Foundations as cards: title, link, intent, specimen | the Foundations page holds the variables and styles with specimens, but no shared card |
| Examples and compositions in their own group of pages | app screens, sets and Float all inside the library (W7, W8) |

### Five more, read (round 2)

The user added five more files the same day. They were read by script the same way.

| File | Pages | A page | Variables |
|---|---|---|---|
| **Atlassian ADS Components** | Readme · Changelog · Cover · `---` · **NEW DESIGN LANGUAGE** (a label page) · one page per component A–Z, each prefixed `❖` (`❖ Button`, `❖ Date picker` …, 68 pages; a page that links out is `🔗 Icon`) · `---` · **USE WITH CAUTION** · three `(Caution)` pages · `---` · **DEPRECATED** · `⚠️ ❖ … (Deprecated)`. 86 pages in all | A **`Frame header`** instance across the top (1682 wide). Below it, two frames side by side: **Components** (the set, under a `Section header` instance) and **Stickers** (ready-made usage examples, with one frame per mode: `Mode: Light (Inherit)` and `Mode: Dark`) | Component-scoped collections whose modes are the variants: `Link [ADS / M · S · L · Editor / Heading 1…]`, `Icon tile [red · redBold · …]`, `Navigation level [Level 0…6]` |
| **Untitled UI** (free v2.0) | `❖ Getting started` · `❖ Variables` · dividers `––––––––––` · chapter pages in caps with `❖` (`❖ FOUNDATIONS`, `❖ BASE COMPONENTS`, `❖ SHARED ASSETS`, `❖ APPLICATION EXAMPLES`, `❖ APPLICATION COMPONENTS`, `❖ MARKETING WEBSITE EXAMPLES` …) with indented `↳` pages under each. Pages for the paid version carry `🔒`. 109 pages | Each topic is **one tall frame**: a `_Design system header` instance (title, intro, a Resources link list, breadcrumb `Foundations › Typography`, site URL), then the section, then a `_Design system footer` instance. Frames sit side by side (Colors · Gradients · Notes and documentation). The private parts (`_Swatch base`, `_Type scale base`) sit **on the same page, left of the frames, under a frame titled `_Unpublished base components`**. Colors: one row per ramp, each step a swatch cell with name and hex. Typography: a specimen (`Ag`, the alphabet), then each size as a row of four weights with its metrics on the right. Notes and documentation: a long frame of how-to and rationale beside the specimen | — (styles) |
| **MCP Apps for Claude** (Anthropic) | `🖼️ Cover` · `---` · **Foundations** (label) · `🖌️ Color` · `🔠 Typography` · `📐 Layout` · `🖋️ Icons` · `---` · **Displays** · `⬜️ Inline card` · `🎠 Inline carousel` · `↔ Full screen` · `---` · **Claude Components** · `🖥️ Desktop web components` · `📱 Mobile components` · `📣 Promotional assets`. 18 pages | **Few pages, grouped by platform, not by component.** Desktop web components holds three big frames side by side, **Forms** ("Controls"), **UI** ("User Messaging & Navigation") and **App**, each a title plus rows of sets: Button, Icon button, ToggleSwitch, Radio … Canvas warm off-white `#F5F4ED` | `Colors [Light · Dark]` 37 · `Typography` 29 · `Border` 15: small and flat |

| **MUI for Figma (+ MUI X)** | Welcome (delete this) · Overview · Theme · **COMPONENTS** (label) · `❖ Alert`, `❖ Card`, `❖ Avatar`, `❖ Button`, `❖ Checkbox`, `❖ Text Field`, **only the six that hold masters** · **INSTANCES** (label) · `↓ Inputs`, `↓ Data Display`, `↓ Feedback`, `↓ Navigation`, `↓ Layout`, `↓ MUI X` category labels, each followed by `♢ <component>` pages · **Blocks** · `♢ Forms`, `♢ Headings`, `♢ Navs`, `♢ Screens`. 71 pages | A `*Library / Component Heading` instance over a **Grid** frame of the component's states (2563 wide), and **beside it a real usage frame** (`Slider: filter`, a 1440 screen with top bar and main) | `palette [light · dark]` 136 · `material/colors` 252 · `typography [desktop · mobile]` · `spacing` · `shape` · `breakpoints` · `metadata` |
| **Adobe Spectrum** | 📋 Introduction · `---` · **🖥️ Desktop Components** · `↳ 🔆 Light Theme`, `↳ 🔅 Dark Theme`, `↳ 🌙 Darkest Theme`, `↳ ⚙️ Wireframes` · `---` · **📱 Mobile Components** · the same four · `---` · 🎨 Color Styles · 🔠 Typography · 🎲 Icons · 📐 Application Frames & Grids · `---` · 🗂️ File Components. **20 pages** | **One page per platform × theme, every component on it.** The page is a row of **sections by category**: Actions, Containers, Data Visualization, Feedback, Inputs, Navigation, Status, Patterns. Each section holds one frame per component (Button, Menu, Action Bar …), and the sets are named per theme (`Table - Desktop - Dark`) | — (styles) |

**Two answers to "one page per component".** MUI uses the glyph to mark the difference: `❖` pages hold masters and `♢` pages hold instances, grouped under `↓` category labels. Spectrum goes the other way, with every component on one page per theme, grouped into sections by category, for 20 pages in all. Both show the same thing: when a library is large, the page list groups by **category**, and the master pages are kept separate from the instance pages.

**What round 2 adds to round 1:**
- **A header and a footer instance on every topic frame** (Untitled UI), not just a header. The header carries breadcrumb, intro and a Resources list of links.
- **Base parts live on the page they serve**, under a visible `_Unpublished base components` frame (Untitled UI), rather than on a separate building-blocks page.
- **Examples as "Stickers"** (Atlassian): ready-made example frames beside the component, one per mode.
- **Status in the page list**: Atlassian groups pages under `USE WITH CAUTION` and `DEPRECATED`, Untitled UI marks locked pages `🔒`, and `🔗` marks a page that links out.
- **One frame per topic, side by side on the page** (Untitled UI), each a self-contained document: header, content, footer.
- **Grouping by platform instead of by component** works for a small set (Anthropic: Desktop · Mobile, three frames each) and keeps the page count at 18.
- **Notes and documentation as their own frame** beside the specimen (Untitled UI): the how and why, with screenshots.

### The proposed move (parked)

Raised 2026-11-04 and parked by the user: *"lets park it but base the move in research, maybe we make a demo file with proposals"*. Nothing changes in the library until a demo file shows it.

- **Pages:** Cover · `---` · Foundations · Icons · `---` · one page per component family, A–Z, using the showcase's families · `---` · utilities (`_trash`, `_source`). Float, app screens and sets live in their own files (W7, W8).
- **Each component page:** a KOL `Header` master at the top (name, one-line description, docs link), then one section per component holding its sets (dashed), an annotation master labelling every variant row and column, and light and dark example instances beside them.
- **Foundations:** one card per foundation (title, docs link, one line of intent, specimen), the way Material's Styles page does it.
- **The move itself:** masters are moved, never rebuilt, so every instance stays linked; the audit script runs clean on each page.
- **Next step:** a demo file with two or three families laid out this way (one simple set, one large set, one foundation card), for his review before anything moves.

## Why KOL's Figma agents kept shipping mess

- **Their one check was a thumbnail.** "Check once" turned into one screenshot of a whole page or a 7000px section, where overlaps, stretched glyphs and stray labels can't be seen (practice 9).
- **Layout had no script check.** The close-out audit covered colours, instances and glyphs, but not overlaps, spills, duplicate properties or stacked variants, which is where the 2026-11-04 defects were (practice 10).
- **One file holds everything.** Masters, foundations, icon masters, every app's screens, sets and the Float family all sit in `❖ library--kol-ds-ui`, which is the opposite of practices 1 and 2.

## What KOL took from it

The user ruled 2026-11-04 (*"Yes, all three"*):

| Ruling | Where it lives |
|---|---|
| Every Figma agent runs a read-only audit on what it touched, and any error blocks its report | kol-figma skill §7, `~/.claude/skills/kol-figma/scripts/audit.js` |
| One readable screenshot per changed frame or set, both themes, compared against the source; never a whole page | kol-figma skill §7 |
| Canvas stays organised: a clean grid per section, no overlaps | kol-figma skill §6 |
| The library keeps masters, foundations and icon masters; Float, app screens and sets move to their own files | float Figma plan W7 (Float) and W8 (apps, sets) |

Not taken: Figma's Check designs, which needs an Organization plan.

## Sources

Opened 2026-11-04.

- Figma — [Components, styles and shared libraries](https://www.figma.com/best-practices/components-styles-and-shared-libraries/)
- Figma — [Name and organize components](https://help.figma.com/hc/en-us/articles/360038663994)
- Figma — [MCP server guide](https://github.com/figma/mcp-server-guide) and the bundled `figma-use` / `figma-generate-library` skills
- Figma forum — [Check designs: catch what's off, ship what's right](https://forum.figma.com/product-updates-3/check-designs-catch-what-s-off-ship-what-s-right-54551)
- Primer — [Figma libraries](https://primer.style/guides/figma) and [Getting started](https://primer.style/guides/figma/getting-started)
- Material — [Introducing the M3 design kit for Figma](https://m3.material.io/blog/material-3-figma-design-kit) and the [Material 3 Design Kit](https://www.figma.com/community/file/1035203688168086460/material-3-design-kit) community file
- Ant Design — [Resources](https://ant.design/docs/resources/) and [Ant for Figma](https://www.antforfigma.com/)
- Vercel — [Geist](https://vercel.com/design/components) and the unofficial [geist-figma-skill](https://github.com/eyexzy/geist-figma-skill)
- The three files read: [macOS 27 (Community)](https://www.figma.com/design/fcWp9Li9K1Dhj5lQTJmAzO/macOS-27--Community-?node-id=207-14472) · [Material 3 Design Kit (Community)](https://www.figma.com/design/wGAM4g5h0UFMJfq3HZDegj/Material-3-Design-Kit--Community-?node-id=55141-14169) · [Simple Design System (Community)](https://www.figma.com/design/IdMqRYH3EJkTxCeCjFKepM/Simple-Design-System--Community-?node-id=128-10284)
- Round 2: [ADS Components (Community)](https://www.figma.com/design/g7xwLzDB74dLGKjwy2Znzf/ADS-Components--Community-?node-id=13285-45907) · [Untitled UI free v2.0 (Community)](https://www.figma.com/design/D6DZl4E67h149ySmbmIMFQ/?node-id=1023-36350) · [MCP Apps for Claude (Community)](https://www.figma.com/design/fqiOhOYcIPsjjALOmDZXkg/MCP-Apps-for-Claude--Community-?node-id=7-20) · [MUI for Figma (Community)](https://www.figma.com/design/ghwcmrNrIiWKSGkvZq6MGr/?node-id=6026-53669) · [Adobe Spectrum (Community)](https://www.figma.com/design/syMxH3DZdUwfoaHAjuTCUz/?node-id=91-19908)
- Seamgen — [Figma MCP: complete guide](https://www.seamgen.com/blog/figma-mcp-complete-guide-to-design-to-code-automation)
