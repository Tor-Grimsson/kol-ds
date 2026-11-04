# ProseWrapsLongStrings — prose text wraps an unbroken string instead of widening the page

**Staged:** 2026-11-03 · from kol-website (`apps/record`, brand folded into record — plan `.kol/llm-context/plans/2026-11-03-brand-into-record.md` § TODO)
**User:** *"this should be fixed tho"* — `/assets` scrolls sideways on a phone.

No stopgap in kol-website: the consumer waits for the release and bumps.

## The fault

- `kol-theme/kol-typography.css:1015` (0.210.x) — `.kol-prose-lede` (and its trio, `.kol-prose-title` and the rest of the `kol-prose-*` text classes) carry no `overflow-wrap`.
- kol-framework `PageSection` renders its `body` in `.kol-prose-lede`. A lede holding an unbroken string — a path such as `packages/component/src/graphics/svg/patterns/`, a URL — cannot break, so its line runs past the column.
- Measured on record `/assets` at 390 (kol-styleguide `Brand view="assets"`, ledes from the consumer's manifest): the Graphics, Patterns and Stationery ledes end at x 441–449; the page scrolls 59px sideways. Brand had the same before the merge.

## Ask

Every `kol-prose-*` text class wraps an unbroken string at the column's edge (`overflow-wrap: break-word` — it breaks only a word that would overflow, so normal text and the min-content width are unchanged). If there is one shared place for prose text (a base rule or the type-role layer), put it there so a new prose class inherits it.

## Acceptance

- At 390, a `PageSection` whose body holds `packages/component/src/graphics/svg/patterns/` has `scrollWidth ≤ clientWidth` on the document; the string breaks onto a second line.
- Ordinary prose renders identically before and after (same line breaks on a ledes page at 1440).

## Remainder in kol-website once it ships

Bump kol-theme; record `/assets` at 390 scrolls 0px sideways.

## ✅ RESOLUTION — 2026-11-03

Shipped in **kol-theme 0.210.2**. One rule covers `.kol-prose` and every `.kol-prose-*` class, present and future: `[class^="kol-prose"], [class*=" kol-prose"] { overflow-wrap: anywhere; }` — `packages/theme/kol-typography.css:962`.

**`anywhere`, not the asked `break-word`:** break-word keeps the unbroken string's full min-content width, so a lede inside a flex row (PageHero's head in apps/brand) still pushed the page to 722px at 390 — measured. `anywhere` lets the item shrink; only a word that cannot fit breaks.

Measured (Playwright, apps/brand at 390): a `kol-prose-lede` in a PageSection-shaped header holding `packages/component/src/graphics/svg/patterns/` breaks onto 2 lines, document scrollWidth 390 = clientWidth; long paths appended to every prose element on the page, still 390. At 1440 every prose element's box is identical with the rule on and off.
