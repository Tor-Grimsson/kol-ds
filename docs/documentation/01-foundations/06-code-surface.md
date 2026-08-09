---
title: Code surface
type: reference
status: active
created: 2026-08-01
updated: 2026-08-01
description: Every surface that renders code, in one place
aliases:
  - code-surface
  - codeblock
sources:
  - packages/component/src/molecules/CodeBlock.jsx
  - packages/theme/kol-components-molecules.css
  - packages/theme/kol-type-roles.css
  - packages/theme/kol-components-organisms.css
tags:
  - domain/typography
  - audience/consumer
related:
  - "[[03-typography|type classes]]"
  - "[[05-layout-systems|layout systems registry]]"
---

# Code surface

**Why this doc exists (2026-08-01).** *"do we have overview over all the codeblocks in use? how many components?"* — no, and the first answer given was wrong: it said four when there are eleven class names across four packages. Nothing declared them one system, so they drifted on fill, radius and colour, and the only way to find them was to already know their names. This is the file to grep instead.

## The roles

There are **four** things, not eleven. The class names below are the parts they are built from.

| Role | Entry point | What it is | Wraps |
|---|---|---|---|
| **Block** | `CodeBlock` (component) · `.kol-doc-code` (CSS) | a fenced, framed, highlighted block with a language chip and a copy button | yes |
| **Inline** | `.kol-doc-code-inline` · `.kol-prose code` | code inside a sentence, sized **relative** to its text | yes |
| **Table token** | `.kol-table-token` | the same chip as fixed chrome inside a `Table` | never |
| **Table slot** | `.kol-doc-table-token` · `.kol-doc-table-copy` | not a chip — a `td` role that types a whole cell | token: no · copy: yes |

## Shared values

**One answer, everywhere:** `font-family: var(--kol-font-family-mono)` · `font-weight: 400` · fill `--kol-fg-08` · radius `var(--kol-radius-sm)` · colour `--kol-fg-80`. The two inline chips had drifted on every one of these (`fg-04` against `fg-08`, `radius-sm` against a bare literal, no colour against `fg-80`) — one concept with two spellings, the `.text-fg-*` / `--kol-fg-*` lesson again.

**Deliberately different, by role:**

| | Block | Inline | Table token |
|---|---|---|---|
| Size | `--kol-text-body-02` / `-03` via the size class | `0.875em` — **relative**, tracks its sentence | `0.75rem` — fixed chrome |
| Wrapping | `pre-wrap` + `overflow-x: auto` | wraps | `nowrap` |
| Frame | border + fill | fill only | fill only |

Relative-in-prose against fixed-in-chrome is a real difference and stays. Everything else is one value.

## Block size

`CodeBlock` had **no size prop**. Its padding and type size sat in `.kol-codeblock` as unnamed constants — *"its just whatever its defaulting to? is that good? instead of saying sm or md?"*. Two axes now, independent:

| Prop | Values | Effect |
|---|---|---|
| `size` | `md` *(default)* · `sm` | the BOX — padding and type step together |
| `bare` | `false` *(default)* · `true` | the FRAME — border and radius off, for a host that owns them |

`bare` is not a size. A bare block still has one — that confusion is why `bare` was the only dimensional escape before.

## Fence language

`CodeBlock` falls back to `language: 'text'`, and a `'text'` block draws **no chip** — a chip reading "text" is worse than none. So a fence that declares nothing renders as an unlabelled slab with no highlighting. Fourteen vault fences were bare on the day this was written.

Gate: **`pnpm validate:fences`**. `text` is a legal language — it says *this is not code* on purpose, for a token list or a tree diagram. The rule is that the author chooses.

## Locations

| Class | File |
|---|---|
| `.kol-codeblock` + `--sm` `--md` `--bare` `-wrapper` `-filename` `-copy` | `kol-components-molecules.css` |
| `.kol-doc-code` · `.kol-doc-code-inline` | `kol-type-roles.css` |
| `.kol-doc-table-token` · `.kol-doc-table-copy` | `kol-type-roles.css` |
| `.kol-doc-table-value` | `kol-type-roles.css` — **deprecated**, a slot name doing two jobs |
| `.kol-table-token` | `kol-components-organisms.css` — belongs to `Table` |

**25 files touch a code surface.** The heaviest are `CodeBlock.jsx`, `DocsTypeRoles.jsx`, `component-page-parts.jsx`, `PreviewCard.jsx` and `mdx-components.jsx`; `PortableTextRenderer` (kol-content) and `ColorAnatomy` (kol-styleguide) reach in from other packages.

## The rule

**A new code surface is a defect until proven otherwise.** Four roles cover every case the estate has found in a year. If something does not fit one of them, say so out loud before adding a fifth — a hand-rolled Tailwind lookalike is how the second spelling of the token chip started.
