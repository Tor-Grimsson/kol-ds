---
title: One right rail
type: playbook
status: active
created: 2026-08-01
updated: 2026-08-01
description: Collapsing two right-rail components into one
tags:
  - domain/design-system
---

# One right rail

Append-only. Real timestamps. One idea per line.

## 0. Prerequisites

- 21:54 — Two components render the right rail: `AutoToc` (ShellChrome.jsx:72) and `DocReaderSidebar` (DocumentationReader.jsx:42).
- 21:54 — `ShellChrome.jsx:318` mounts `AutoToc` as `defaultTocContent`; `DocumentationReader.jsx:395` overrides it via `ShellTocContext` on a vault route.
- 21:54 — They disagree: `AutoToc` has Top tags and no Related; the reader has Related and tag chips and no Top tags.
- 21:54 — User reports sections appearing/vanishing WITHOUT navigating. Route-swap does not explain that.
- 21:54 — Found the second cause: rail renders `Color — anchors and ramps` while `02-color.md` on disk reads `title: Color`. Stale `import.meta.glob` module, not a route change.
- 21:55 — I had claimed the route swap was the cause and told him what he was seeing. Wrong, and he had already said he hadn't left the page.

## 1. Collapse the two rails

- 22:05 — `packages/workshop/src/shell/RightRail.jsx` written. One component, exported from the shell barrel.
- 22:05 — `AutoToc` (ShellChrome) reduced to an adapter: builds `actions`, hands over `toc`/`topTags`/`activeId`. Stopped returning null on empty headings.
- 22:06 — `DocReaderSidebar` reduced to an adapter too. `SidebarSection` deleted — it was a third spelling of a rung RailSection already owned.
- 22:06 — Reader gained `useScrollSpy` with `root: '#main'`; its TOC could not highlight before.
- 22:06 — Reader gained `topTags` from `buildTagCounts(inventory)` — the section exists on every route now.

## 2. Fix the section set

- 22:07 — Fixed set: THIS PAGE > Contents · LINKS > Related · Quick actions · Top tags · Tags. Both tag surfaces under LINKS per the user.
- 22:07 — Nothing conditional. A section with no data renders `(0)` and an empty body.
- 22:07 — Every group gets a count, Quick actions included.

## 3. The eight rulings

- 22:08 — Related rows use `fileLabel(hit.file)` — THE rail-label rule, same as the left tree. Third spelling tried on that row; the first two were the wikilink display text and the frontmatter title.
- 22:09 — `created` moved above `updated` in FIELD_ORDER.
- 22:10 — `.kol-tag` gains `text-transform: uppercase` + `letter-spacing: 0.04em`. Uppercase is an EXPLICIT exception to the no-text-transform law: a tag string is generated, so no call site exists to author the case in. Pill takes the tracking only.
- 22:11 — THE DIV RULE, written into RightRail's header: L1 always wraps groups in `.shell-rail-stack-inner`, L2 always wraps rows in `nav.shell-nav-items`, nothing else wraps anything.
- 22:11 — Left rail conformed: `div.shell-nav-items` → `nav.shell-nav-items` in ShellSidebar and WorkshopSidebar.

## 4. Verification

- 22:13 — `roster` failed: RightRail had no tier. Classified molecule/navigation — it composes RailSection and RailRow, which is the nesting test.
- 22:14 — All 15 gates clean. theme 0.28.0, workshop 0.15.0.
- 22:14 — NOT verified in a browser. The rail is structural and the user validates live.
