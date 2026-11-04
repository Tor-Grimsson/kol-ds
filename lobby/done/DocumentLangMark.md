---
component: DocumentLangMark
source: kol-website/apps/record/src/pages/Library.jsx#L17-L36 (consumer) · kol-styleguide/src/DocumentLibrary.jsx#L69-L96 (the parts)
staged: 2026-11-04
status: draft
deps: [DocumentFiles, DocumentLangs, Icon (kol-icons flag-*), Tag]
---

# DocumentLangMark — a language-mark seam for DocumentLibrary

## Purpose
record.kolkrabbi.io/library draws a document's languages as text: the EN / IS subscript under a twin file glyph (`DocumentFiles`, `Subscripted sub={langOf(f)}`) and the Language column (`DocumentLangs`, `langView` text · chips · icon). The user: *"we have is and en flags as icons"* — kol-icons ships `flag-is`, `flag-gb`, `flag-de`. Today there is no way to put them there from the consumer.

## The ask — the general thing, once
One prop on `DocumentLibrary` and `DocumentView` (forwarded to `DocumentFiles` and `DocumentLangs`):

| prop | type | default | controls |
|------|------|---------|----------|
| `langMark` | `(code: string) => ReactNode` | `(c) => c` (today's text) | how ONE language code is drawn — in the twin-file subscript and in every Language cell |

Plus a preset so no consumer writes the map: `langMark="flags"` → kol-icons `flag-<country>` by a code map (`is → flag-is`, `en → flag-gb`, `de → flag-de`), falling back to the text code for any code without a flag. `langView` keeps its job (the cell's layout); `langMark` is only the glyph per code.

## Anatomy
- File subscript: `Subscripted glyph={file glyph} sub={langMark(code)}` — a node instead of a string; size the flag to the subscript box (≈ 10–12 px tall at `size="sm"`), keeping `aria-label={fullLabel(f)}` text on the button.
- Language cell: each code → `langMark(code)`, in the same row/gap the chips use; the cell's `aria-label` stays the text codes.

## Styling
- Flags from `@kolkrabbi/kol-icons` (`<Icon name="flag-is" />`), as Folio already draws them in kol-website: `inline-flex overflow-hidden rounded-[2px] shadow-[0_0_0_1px_var(--rule-token)]`.
- Nothing app-specific to drop.

## States & interactions
None new; the file button's hover/focus are unchanged.

## Recreation notes
- Prop, not a fork: `langMark` (fn) + the `"flags"` preset; both components read it so the two places never disagree.
- Accessibility: the visible mark may be a flag, the accessible name stays the language code(s).
- Consumer will pass `langMark="flags"` on /library (DocumentLibrary + DocumentView) on the next bump; no local stopgap is written meanwhile.

## ✅ RESOLUTION — 2026-11-04

**kol-styleguide 0.22.0** (live). `langMark` on `DocumentLibrary` and `DocumentView`, forwarded to `DocumentFiles` and the Language cell: `(code) => node`, or `"flags"` — `is`/`en`/`de` → kol-icons `flag-is`/`flag-gb`/`flag-de` (case-insensitive), any other code stays text. Flags 12px in the 2px-rounded hairline frame the ticket named, `role="img"` + the code as label; the cell's aria-label keeps the codes. Unset, nothing changes. Preview: showcase DocumentLibrary (second table, `langMark="flags"`, an `fr` row shows the fallback). Docs: 04-compositions/20-document.md.
