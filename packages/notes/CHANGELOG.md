# @kolkrabbi/kol-notes

## 0.1.0 — 2026-09-27

- **First release.** Notes as a tool: a note is a database row with a markdown body (kol-olina's brand notes). `Notes` (the whole tool over a client: `listNotes` · `loadNote` · `saveNote` · `deleteNote`), `NotesCatalog` (CatalogPage shelf, article cards, favourites filter), `NoteEditor` (kol-component's `DocumentEditor` in the page — the title is the frontmatter's, drafts in browser memory, ⌘S), `NoteThumb`, and the pure helpers `starterBody` · `titleOf` · `tagsOf` · `previewOf` · `slugFor`.
