# Plan — the folio style, read off his two frames

**Raised:** 2026-11-15, him. Points verbatim: "first we log the standard type style" (float file 475:978 `folio-reader`, 475:979 `folio-article`); "you know what the style is right? its the FUCKING READER!!"; "FUCKING READ THE PAGE. DEFINE what you seee. then make a table and list it, plan the swap"; "dont make up stupid names, one is folio-reader the other one is folio- article, though the style is just called folio".
**Status:** his go 2026-11-15 ("ok swap both"). Building: 1.1 and 3.1. Open: his publish, then 2.1.
**Shape:** W › phase › list.
**Laws carried:** his two frames are the design and are not edited; work on copies in the `folio` section 587:4231; styles live in the library, never local; never delete; he publishes; the app chrome (top bar, nav, contents rail, library list, buttons) is not the job.
**How a phase closes:** the acceptance count by script, then I look at both copies beside the originals.

## What the frames hold (reading text only)

| # | Role | Where | His design | Style | Step | State |
|---|---|---|---|---|---|---|
| 1 | Title | article, top | Bold 72/72 | `folio/title` | D5 72/70 | exists |
| 2 | Chapter title | reader, "The third interlude" | Bold 56/58.8 | `folio/chapter` | H1 56/56 | exists |
| 3 | Figure heading | article, in the picture | Bold 64/65.3 | `folio/figure` | D6 64/64 | change (is 56/56) |
| 4 | Lede | article, under the title | Regular 25/35 | `folio/lede` | T1 24/34 | new |
| 5 | Kicker | caps lines above headings and blocks | Semi Bold 10/12.1, caps, tracked | `folio/label` | L8 10/13 | exists |
| 6 | Section heading | "A place, not a list" | Bold 28/33.6 | `folio/prose-h2` | H6 28/32 | exists |
| 7 | Body | paragraphs, list text, highlight | Regular 20/33 | `folio/prose-body` | T2 20/30 | change (is 16/24) |
| 8 | Bold in body | runs inside paragraphs | Bold 20/33 | `folio/prose-strong` | T2 20/30 | new |
| 9 | List number | "1." "2." "3." | Semi Bold 20/33 | `folio/prose-number` | T2 20/30 | new |
| 10 | Link in body | underlined run | Regular 20/33, underline | `folio/prose-link` | T2 20/30 | new |
| 11 | Pull quote | both frames | Medium 25/36.3 | `folio/prose-quote` | T1 24/34 | change (is 20/30) |
| 12 | Caption | under quotes, under the chapter title, under the figure | Regular 12/19.2 and 12/14.5 | `folio/prose-caption` | T6 12/18 | new |
| 13 | Note text | "A note on comfort" box | Regular 16/26.4 | `folio/prose-note` | T4 16/24 | new |
| 14 | Footnote | bottom of the text | Regular 12/19.8, bold number, link | `folio/prose-footnote` (+ `-strong`) | T6 12/18 | new |
| 15 | Side title | "Less managing. More reading.", related card titles | Bold 25/30 and 25/28.8 | `folio/book` | L1 24/32 | exists |
| 16 | Side text | idea-in-brief text, reading note, author text, card text | Regular 13/20.8 to 13/21.5 | `folio/body-interface` | T5 14/20 | exists |
| 17 | Contents item | "In this article" list | Regular 13/19.5, active Bold | `folio/body-interface` (+ `-strong`) | T5 14/20 | exists, strong new |
| 18 | Byline, end line, next and previous titles | "By Folio studio" | Semi Bold 13/15.7 | `folio/row` | L5 14/18 | exists |
| 19 | Date line, page line | "01 November 2026, 5 min read" | Regular 12/14.5 | `folio/date` | L6 12/16 | new |
| 20 | Small meta | tags, "Your note, Page 125", numbers | Regular 11/13.3 | `folio/meta` | L7 11/14 | exists |
| 21 | Small meta, strong | "Your highlight, Note 1", "01 / READING NOTE" | Semi Bold 11/13.3 | `folio/meta-strong` | L7 11/14 | new |
| 22 | Tiny caps | "PREVIOUS INTERLUDE", "STUDY / 03" | Regular 10/12.1 | `folio/meta-small` | L8 10/13 | exists |
| 23 | Text buttons | "Save to my library", "Read field note" | Semi Bold 12/14.5 | `folio/control` | U6 12/12 | exists |

Not styles: the `folio` wordmark, the "f." mark, the cover thumbnails.

What a reader would see change once linked (the ramp's values replace his):
- Body line height 33 → 30. This is the big one.
- Lede, pull quote and side titles 25 → 24.
- 13px text → 14 (ruled earlier).
- Smaller line-height moves of 1 to 2px on the headings, captions, footnotes and the note.

## W1 — The library's folio set carries the reading text

### 1.1 — Three styles change, twelve are new
- Change `folio/figure`, `folio/prose-body`, `folio/prose-quote` to the steps in the table.
- Create `lede`, `prose-strong`, `prose-number`, `prose-link`, `prose-caption`, `prose-note`, `prose-footnote`, `prose-footnote-strong`, `body-interface-strong`, `date`, `meta-strong`, `prose-code-inline` (size from `reader.css`), bound like the existing `folio/*` styles.
- Each new style gets a row in the folio styles table on the library's Typography page.
- Acceptance: every row of the table above resolves to a `folio/*` style whose step matches.

### 1.2 — His publish
- One line to him.

## W2 — The swap, on the copies

### 2.1 — Reading text linked
- In `folio` 587:4231 (`folio-reader`, `folio-article`): every reading text run takes the style in its table row. The links already put on app chrome stay as they are.
- Acceptance: 0 reading text runs without a `folio/*` style; the originals unchanged.

### 2.2 — The look
- Both copies beside the originals; list what moved.

## W3 — `folio-elements`: every element once (P: "we need another document that shows every element that is accounted for, images, captions, pull quote, quote, lists and bullets ina few levels, code inline, code block, media, video , audio, diagram, etc etc")

### 3.1 — The document
- A third child section `folio-elements` in `folio` 587:4231: one Folio article page holding every element a Folio document can have, each under a kicker naming it.
- Each element's look comes from his two frames first, then the code (`apps/folio/src/folio/reader.css`), then a library component; where none defines it, a labelled empty slot.
- Acceptance: every element in his list present or shown as a labelled gap; 0 elements drawn from taste.

### 3.2 — Linked with the rest
- After his publish, its reading text takes `folio/*` styles in the same pass as 2.1. Roles the set still lacks are listed for a second round.

## Order
1.1 and 3.1 together → his publish → 2.1 and 3.2 → 2.2.
