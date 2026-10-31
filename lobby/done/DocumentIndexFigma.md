---
component: DocumentIndexFigma (DocumentIndex in Figma · SectionText level="document" · Table/TableRow slots)
source: kol-atlas/apps/lab/src/App.jsx#L46-L61 · kol-atlas/apps/workspace/src/workspace.css#L13-L15 · Figma proxy--atlas 05RUcW1vfOy4lNdWSgma3U page 43:28 (Lab / Home)
staged: 2026-10-31
status: draft
deps: [DocumentIndex, SectionText, Table, TableRow, TableCell, Icon]
---

# DocumentIndexFigma

## Purpose
The user, 2026-10-31, rebuilding kol-atlas's lab home (proxy--atlas page 01-lab) on the KOL library: the page's title, its description and its table are hand-drawn there, and the table is loose TableCells, because the library has no DocumentIndex, no SectionText level for a document page, and a Table that cannot take more rows or cells. In code the page is already `DocumentIndex variant="table"` (kol-framework 0.66.0). Three parts, one ticket:

1. **DocumentIndex as a Figma component** — `variant` cards · table, built from the code like the Layout* pages.
2. **SectionText `level="document"`** — code and Figma. The Research page style (the workspace sheet): title 36/1.2 bold, display face, tracking −0.005em, 12 under it; lede 15/1.6 in the body face to a 724 edge. None of page · app · section · content is this. DocumentIndex's `title` / `lede` should render it (today they render PageHeader `size="sm" voice="mono"`).
3. **Table and TableRow on Figma slots** — the Table's body rows as a slot (any number of TableRow instances), and each TableRow's cells as a slot (any number of TableCell instances). Today Table is a fixed `thead` + three `tr` instances and TableRow three cells; page 01-lab needs ten rows of five, which means detaching.

## Anatomy
```
DocumentIndex (variant=table)
├─ SectionText level=document   title · lede
└─ Table variant=simple
   ├─ TableRow kind=head         slot: TableCell × n
   └─ slot: TableRow kind=body × n
         └─ slot: TableCell × n  (Title cell: icon + link label)
```

## Variants
- DocumentIndex: `cards` (default) · `table`.
- SectionText: new `level=document`; the Figma SectionText gets a `level` variant for all five (it has none today, only three text layers).
- Table / TableRow: unchanged variants (default · simple; head · body), slots added.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| DocumentIndex `variant` | `cards` \| `table` | `cards` | the contents form (exists in code) |
| DocumentIndex `title` · `lede` | node | — | the header, now SectionText `level="document"` |
| SectionText `level` | + `document` | — | the Research page header |
| Table body | slot | head + 3 rows | the rows |
| TableRow cells | slot | 3 cells | the columns |

## Styling
- Research header (kol-atlas `workspace.css` `.sheet`): `h1` 36px, line-height 1.2, weight 700, letter-spacing −.005em, `margin 0 0 12px`, display face; body 15px / 1.6 in the body face, text to a 724 edge.
- The lab home today (App.jsx L50-L53): `text-[36px] font-bold leading-[1.2] tracking-[-.005em]` in `--kol-font-family-sans`, `max-w-[724px]` 15/1.6 lede. Atlas's faces (`--lab-text`, `--ws-*`) are app-specific — drop; KOL faces only.
- Table: `variant="simple"`, the DocumentIndex table classes as shipped in kol-framework 0.66.0 (ContentsTable).

## States & interactions
Title links: plain ink, the accent underline on hover (as shipped).

## Dependencies
DocumentIndex (kol-framework), SectionText, Table, TableRow, TableCell, kol-icons.

## Recreation notes
Code first for `level="document"`, then the Figma parts from the code. Once shipped, kol-atlas rebuilds proxy--atlas 01-lab's Lab / Home as one DocumentIndex instance (dark component, Light instance beside it).

## ✅ RESOLUTION — 2026-10-31 · kol-component@0.323.0 · kol-framework@0.67.0

Code: SectionText gains level="document" (title 36/1.2, 700, −0.005em, 12 under it; lede Public Sans 15/1.6 to 724) in kol-component 0.323.0, and DocumentIndex renders its title and lede through it in kol-framework 0.67.0 (peer kol-component ≥0.323.0). Figma (❖ library--kol-ds-ui): SectionText is a set with level page|app|section|content|document (197:1153, the old ID kept); Table's body rows are a `rows` slot and TableRow's cells a `cells` slot, so any number of rows and cells place without detaching; DocumentIndex is a set with variant cards|table (198:700) on page 22-document-index. Code Connect published for SectionText, DocumentIndex and CardLogo. The library itself is unpublished until the user clicks publish.

**Remainder here:** none — kol-atlas bump kol-component@0.323.0 + kol-framework@0.67.0; rebuild proxy--atlas 01-lab's Lab / Home as one DocumentIndex instance once the library is published.

