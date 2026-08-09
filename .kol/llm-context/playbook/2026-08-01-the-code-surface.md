---
title: The code surface
type: playbook
status: active
created: 2026-08-01
updated: 2026-08-01
description: Auditing every code surface into one system
tags:
  - domain/design-system
---

# The code surface

Append-only. Real timestamps. One idea per line.

## 0. Prerequisites

- 22:30 — User: *"do we have overview over all the codeblocks in use? how many components?"* — no, and my first answer said four when there are more.
- 22:31 — He caught it: *"you are definitely not reading ALL, there are for sure more code blocks."* Correct.
- 22:32 — Grep by class name, not by memory. **Nine** class names carry code: `kol-codeblock` · `--bare` · `-copy` · `-filename` · `-wrapper` · `kol-doc-code` · `kol-doc-code-inline` · `kol-doc-table-token` · `kol-doc-table-copy` · `kol-doc-table-value` · `kol-table-token`.
- 22:32 — 25 files touch a code surface. Heaviest: `CodeBlock.jsx` (13), `DocsTypeRoles.jsx` (10), `component-page-parts.jsx` (9), `PreviewCard.jsx` (5), `mdx-components.jsx` (4).
- 22:33 — Four packages involved: component, workshop, content (`PortableTextRenderer`), styleguide (`ColorAnatomy`).
- 22:33 — `kol-doc-table-value` is already marked deprecated in `kol-type-roles.css` but still has a rule.
- 22:34 — The screenshot's block is `CodeBlock`, rendered by `DocumentationReader.jsx:181`. Chip hidden because the fence declares no language and line 88 hides it when `language === 'text'`.
- 22:34 — CodeBlock has NO size prop. Padding `1rem` and the type size sit in `.kol-codeblock` with nothing naming them.

## 1. Audit

- 22:36 — 11 class names, not 4. 25 files. Four packages: component · workshop · content · styleguide.
- 22:36 — Consumers per class: kol-codeblock 6 · kol-doc-code 5 · kol-doc-code-inline 4 · kol-table-token 5 · kol-doc-table-value 2 (deprecated) · kol-doc-table-token 1 · kol-doc-table-copy 1.
- 22:37 — Collapsed to FOUR roles: block · inline · table token · table slot. Everything else is a part.

## 2. The doc

- 22:45 — `docs/documentation/01-foundations/06-code-surface.md`. What each role is, the shared values, the deliberate differences, where every class lives, and the rule that a fifth surface is a defect until argued.

## 3. Shared values

- 22:40 — Already unified earlier tonight across the two inline chips (fill fg-08, radius-sm, colour fg-80). Documented rather than re-changed.
- 22:40 — Kept different on purpose: relative size in prose vs fixed in chrome, wrap vs nowrap.

## 4. CodeBlock size

- 22:41 — `.kol-codeblock` stripped of padding + font-size; `--md` and `--sm` classes carry them.
- 22:41 — `size` prop added, default `md` = the exact old values, so nothing moves until a call site asks for `sm`.
- 22:41 — `bare` is NOT a size — it drops the frame. Stated in the JSDoc; that confusion is why bare was the only dimensional escape.
- 22:42 — Radius moved to `--kol-radius-sm`; padding/type to `--kol-spacing-{3,4}` and `--kol-text-body-{02,03}`.

## 5. Language always

- 22:43 — 14 bare fences in 5 files, labelled by inference from the body (bash where a command leads, else text). Every choice printed.

## 6. The gate

- 22:44 — `validate:fences` written and negative-tested: a bare fence fails, `text` passes. 16 gates now.

## 7. Right rail

- 22:50 — LINKS → TOOLS. Order: Quick actions · Tags · Related.
- 22:50 — ONE Tags section. Page tags first at `text-emphasis`, system tags below with counts; `otherTags` dedupes so a tag cannot appear twice.
- 22:50 — Related accepts `r.url` so a source can be an external link.

## 8. Verification

- 22:52 — `headings` failed on 5 of the new doc's H2s — the 2-word nav-label law. Shortened.
- 22:53 — All 16 gates clean. theme 0.29.0 · workshop 0.16.0 · component 0.23.0.
- 22:53 — NOT opened in a browser.
