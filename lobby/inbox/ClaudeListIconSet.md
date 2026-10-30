# ClaudeListIconSet — 252 icons drawn on the KOL keyline, waiting for import

**Staged:** 2026-10-29 · from kol-hq (user: *"lobby DS and let them know about them, we will do further work there, just tell them where they are and that import is a separate session in DS repo with me"*)

## What it is

252 icons, already drawn to the set spec (24 grid, 1.5 stroke, `currentColor`, inside the 2–22 live area):
- **001–182:** drawn from the user's reference boards in Figma (studio/design · time/plan · writing/blog · metrics/dashboard). Each one was checked side by side against its reference, and 18 were redrawn after his review.
- **183–252:** a set he picked in Figma, refitted onto the 3–21 keyline square at 1.5.

They are grouped into categories and sub-categories (studio / design · time / plan · writing / blog · metrics / dashboard · general).

## Where they are

| what | where |
|---|---|
| the SVGs | `~/dev/projects/kol-hq/_tmp/icons/2026-10-28-claude-list/drawn/NNN-<name>.svg` (`_tmp/` is gitignored, so they exist on the MBP only) |
| the grouping | `~/dev/projects/kol-hq/_tmp/icons/2026-10-28-claude-list/groups.json` |
| the set sheet + review | https://claude.ai/artifact/VUeNYrgM6EdYofeVHKi1pJ (`#set` grouped and labelled · `#review` each reference beside its drawing, light and dark, KeylineBg guides) |
| the references | Figma `library--kol-icon` (91RgXQdroY01wN96lAiOv1) › design fav › "categories needed" (123-935) and 130-7545 |

## What to do

**Nothing until the user opens a session in this repo.** The import is a separate session with him: names, collisions with the set, where they land, and further work all happen there.

## Notes for that session

- The file names are the drawing names with a running number (`065-clock`, `068-clock` …). Some references repeat (two clocks, two layers, two compasses), so the set will need names, and a pick wherever two drawings share one.
- Collision check against `packages/icons/src/kol-icon-set-*/` has not been run on the final names.
- Solid references are drawn solid (fill plus the 1.5 stroke): the clocks with thick rings, the alarm bells, the hourglass, the compass.
- Two are known to read differently at 24 px: `024-text-tool` (outlined T) is heavy, and `071-stopwatch`'s ticks read as dots.

## Definition of done
- [ ] Import session held with the user
- [ ] Icons landed in the set under their agreed names and groups
- [ ] published
