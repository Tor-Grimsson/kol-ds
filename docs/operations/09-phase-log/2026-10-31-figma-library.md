---
title: The KOL Figma library
type: log
status: active
created: 2026-10-31
updated: 2026-10-31
description: The code-built Figma mirror of the design system — tokens, components, pages, Code Connect
tags:
  - domain/workflow
  - audience/agency-internal
related:
  - "[[INDEX|Phase log]]"
  - "[[_files/plan-2026-10-31-figma-library|The plan, as it stood at this run]]"
---

# The KOL Figma library

**Run:** 2026-10-31 (one day, several goals and parallel builds) · **Plan:** [[_files/plan-2026-10-31-figma-library|plan-2026-10-31-figma-library]] (live copy `.kol/llm-context/plan-2026-10-31-figma-library.md`; W16–W19 still running there) · **File:** https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH · **State:** W1–W15 built; the library publish is his click.

## What it is

The user: *"I wanna create a figma mirror to the DS … tokens color, opacity, spacing, text … then we set up a styleguide and at least the control atoms and some molecules and maybe a few modals and organisms"*. Built from the code, never drawn: every component is rendered through the showcase, measured with `getComputedStyle` in light and dark, and rebuilt in Figma bound to variables. Values flow code → Figma only.

| Phase | Closed | Evidence |
|---|---|---|
| W1 — styles | 2026-10-31 | `scripts/figma-tokens.mjs`; 122 used variables (colour Light · Dark), 51 text styles bound to `font/*`, 3 shadows; 212 unused tokens listed |
| W2–W4 — atoms, molecules, styleguide | 2026-10-31 | 7 atom sets measured to the pixel; Prose, Modal, CommandOverlay, SettingsRow, Rail, NavRail, SectionText; one styleguide frame, Dark by mode |
| W5, W15 — Code Connect | 2026-10-31 | template files in `figma/` (React), 440 icon mappings; Button's icon-only snippet reads the swapped icon's id |
| W6 — from usage | 2026-10-31 | the most-used components, the kol-styleguide set, PageShell / SettingsSections / Brand; dashboard cards dropped (being rebuilt) |
| W7–W8 — icons, keyline | 2026-10-31 | 441 icon components from `packages/icons` on `oq/96` (external set in its own colours); KeylineGuide |
| W9 — primitives | 2026-10-31 | kol-theme 0.202.0 neutral ramp (248 colours identical before/after); `primitives` collection, surfaces alias it per mode |
| W10, W13 — article, apps, layouts, document | 2026-10-31 | article set + `11-article`; SiteLayout · AppShell · ShellLayout · WebsiteLayout · AppHub · AppStudio; brand-hub · brand-lab · studio-hub first screens; MarkdownPage + `12-document` |
| W11, W14 — kol-atlas + helpers | 2026-10-31 | TableCell / TableRow, table text styles at the code's line heights, Dropdown fill; nine helper atoms; Button 57 variants; the old Rail retired, not deleted |
| W12 — breakpoints | 2026-10-31 | `breakpoint` collection (Phone · Tablet · Desktop) checked at 375 / 800 / 1280; a Phone frame beside every layout and app page |

## Laws it set

Every page canvas #1E1E1E · variant property names are the code's prop names · transparent control borders bind `tone/border` · icons on `oq` · nothing stored in the file's plugin data · one writer per region of the file · ask before new scope.
