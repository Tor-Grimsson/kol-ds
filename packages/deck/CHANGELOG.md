# @kolkrabbi/kol-deck

## 0.1.0 — 2026-09-27

- **First release.** Presentations as a tool, from kol-olina's brand decks: slides as data (a 1920×1080 stage of text, image and rule layers; `./model` is the pure model), `SlideRenderer` / `SlideThumb`, the editor (`DeckEditor`: `SlideStage` with snapping, rulers, guides and rotate; `SlideInspector`; the filmstrip; undo; copy/paste; deck settings; present mode), `DecksCatalog`, and `Decks` — the whole tool over a client (`listDecks` · `loadDeck` · `saveDeck` · `deleteDeck`). Exports: PNG, PDF (pdf-lib), **PPTX** (pptxgenjs — editable slides), and the `.deck.json` file. Export fonts are read off the page's own `@font-face` rules, so a deck embeds whatever the app serves.
- Fixed on the way in: clicking a layer now focuses the stage, so nudge / Delete / Esc work after a click.
