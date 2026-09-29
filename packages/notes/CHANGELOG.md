# @kolkrabbi/kol-notes

## 0.2.0 — 2026-09-29

- **New is a blank page.** `open={NEW_NOTE}` is a note not saved yet — the editor, empty, no name asked; the first Save names it (frontmatter `title`, else the first heading, else "Untitled note"), creates the row and opens it by its slug. New note in the list opens the same. `NEW_NOTE` and `blankBody` exported.
- Frontmatter is read from **`@kolkrabbi/kol-markdown`** directly (a dependency), not kol-component's re-export.
- Peer floor: kol-component >=0.229.0 (the blank note's "Not saved yet").

## 0.1.0 — 2026-09-27

- **First release.** Notes as a tool: a note is a database row with a markdown body (kol-olina's brand notes). `Notes` (the whole tool over a client: `listNotes` · `loadNote` · `saveNote` · `deleteNote`), `NotesCatalog` (CatalogPage shelf, article cards, favourites filter), `NoteEditor` (kol-component's `DocumentEditor` in the page — the title is the frontmatter's, drafts in browser memory, ⌘S), `NoteThumb`, and the pure helpers `starterBody` · `titleOf` · `tagsOf` · `previewOf` · `slugFor`.
