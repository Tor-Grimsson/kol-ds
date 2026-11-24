# Session: Folio reading styles and the elements document

**Date:** 2026-11-16
**Agent:** Claude (Fable 5.2), Opus agents for the Figma passes
**Summary:** The library's `folio` set now carries the reading text read off his two Folio frames (34 styles), and the float file has a `folio` section with copies of both frames plus a new `folio-elements` document. The swap (linking the reading text) waits on his library publish.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-15-folio-reading-styles.md` — the plan: the table of 23 reading roles read from his frames, W1 library, W2 swap, W3 elements document
- `.kol/llm-context/plan-2026-11-15-typography-page.md` — W8 added (the `ui-font` switch retired)

### Features Added/Removed (Figma)
- Library `folio` set, 22 → 34 styles. Changed: `figure` D6 64/64, `prose-body` T2 20/30, `prose-quote` T1 24/34, `prose-h3` L1 24/32, `prose-h4` L6 12/16, `prose-table` T3 18/27. New: `lede`, `prose-strong`, `prose-number`, `prose-link`, `prose-caption`, `prose-note`, `prose-footnote`, `prose-footnote-strong`, `body-interface-strong`, `date`, `meta-strong`, `prose-code-inline`. Rows added on the folio styles table. Unpublished.
- Float file, page `↳ ebook-web-style`: new section `folio` 587:4231 holding `folio-reader`, `folio-article` (copies; his originals 475:978 and 475:979 untouched) and `folio-elements` 599:4263 (frame 599:4264, every element once; looks taken from his frames, then Folio's code, then the library; labelled empty slots for h5, h6, task list, two images side by side, key and value table, diagram, attachment, playback bar over video). Type mode on the section set to Inter.
- An earlier pass linked 176 app-chrome text layers in the two copies to `folio/*` (nav, label, meta); he rejected that as the wrong target. Those links are still there.
- His `Parts`, `Parts table` and `Folio layout` sections were moved 2185 right as a group by an agent to make room.

## Current State

### Working
- The reading roles are a table in the plan; the library set matches it by script (34 styles, 34 rows).
- `folio-elements` built and looked at; same ground and column as his article.

### Known Issues
- Reading text in the three documents is not linked yet: the float file can only link published styles.
- Once linked, the ramp's values replace his: body line height 33 → 30, lede and quote 25 → 24, 13px text → 14.
- Roles in `folio-elements` with no style yet: `prose-code-lang` (11, mono caps), `prose-media-label` (16/26.4), `prose-bullet`; the code's image caption is 11/13.3 against his 12/19.2 caption.
- Folio's code sets no size for inline code, so `prose-code-inline` is body size (T2).
- `folio-elements` grows with its content (not 1440 × 900).

## Next Steps
1. He publishes the library; then link every reading text run in `folio-reader`, `folio-article` and `folio-elements` to its `folio/*` style (plan W2.1, W3.2), look at the copies beside the originals and list what moved.
2. Then float: the folio-default page (`plan-2026-11-14-folio-default.md` W1).
