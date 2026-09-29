# @kolkrabbi/kol-deck

## 0.2.0 — 2026-09-29

- **New is a blank deck.** `open={NEW_DECK}` is a deck not saved yet, in the editor on the first layout, no name asked; the first Save files it ("Untitled deck"). New deck on the shelf opens the same. `NEW_DECK` exported; `DeckEditor unsaved` keeps Save live before the first edit.
- `DeckEditor` — the header wraps on a phone; at 390 its right cluster rode over the left. `Save` is the default tone, not the inverted fill.

## 0.1.1 — 2026-09-27

- `DeckEditor` wears the tool frame — `PageShell` fixed · bleed, where it was `capped` (the site
  tier's container and 64px block padding): the editor sat narrower and lower than the list it
  opens from, and scrolled past the fold under the filmstrip.

## 0.1.0 — 2026-09-27

- **First release.** Presentations as a tool, from kol-olina's brand decks: slides as data (a 1920×1080 stage of text, image and rule layers; `./model` is the pure model), `SlideRenderer` / `SlideThumb`, the editor (`DeckEditor`: `SlideStage` with snapping, rulers, guides and rotate; `SlideInspector`; the filmstrip; undo; copy/paste; deck settings; present mode), `DecksCatalog`, and `Decks` — the whole tool over a client (`listDecks` · `loadDeck` · `saveDeck` · `deleteDeck`). Exports: PNG, PDF (pdf-lib), **PPTX** (pptxgenjs — editable slides), and the `.deck.json` file. Export fonts are read off the page's own `@font-face` rules, so a deck embeds whatever the app serves.
- Fixed on the way in: clicking a layer now focuses the stage, so nudge / Delete / Esc work after a click.
