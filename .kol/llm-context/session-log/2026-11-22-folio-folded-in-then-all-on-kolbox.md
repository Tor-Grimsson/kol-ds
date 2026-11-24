# Session: Folio folded into KOL, then all of Folio on kolbox

**Date:** 2026-11-22
**Agent:** Grim (Claude Fable 5.2), kol-build-agent (Opus) for the builds
**Summary:** Folio's kit became `variant="folio"` on the KOL components; then, on his correction, all of `apps/folio` (editor, home, shelves, reader) was put on kolbox, with the kolbox parts it lacked built. Nothing published, Figma untouched.

## Changes Made

- **Misread first.** He asked to "apply kolbox rules to folio". I read it as the kolbox process (fold the kit in as a variant) and built that. He meant Folio wearing kolbox. The fold stands and was the base for the switch, but the ask was the second half.
- **Folio fold (six agents).** Colors to `packages/theme/kol-color.css` (`--kol-folio-*`), type to `kol-type-folio-classes.css` (`kol-folio-<role>`, was `kol-reader-*`). 34 Folio parts are `variant="folio"` on KOL components; a dozen stay in the app (masthead, jackets, continue cards, image picker, language toggle and others). Map and notes: `_tmp/2026-11-22-folio-migration/batch-0.md`, `batch-A.md` to `batch-E.md`.
- **New KOL parts:** `TabsDocument` (document tabs after Figma's tab strip, his screenshot), `FindBar`, `StatusBar`, each with kolbox and folio looks.
- **Kolbox looks added:** `MenuBar` (kol-shell), `QuantityInput`, `ColorSwatch`, `ShortcutsOverlay`. Kolbox branches extended: `Menu` (items, point anchor, spaced shortcut combos), `Dropdown`, `ButtonGroup` with a value, `TreeRow` (href, linkComponent, count), `CommandOverlay` (results, `mode="commands"`, `body`, `mark`), `SwatchGrid`, `ContentCard` (media, meta), `Table` (columns, rowKey).
- **apps/folio on kolbox.** Every route but `/mockups` runs in kolbox's scope (`useKolboxScope` in `Chrome.jsx`, set on `<html>`). Editor on `EditorShell variant="kolbox"`; home and shelves on kolbox's Home layout (nav Rail, cards with jackets, table, grid and list switch); reader on the editor frame (contents and library Rail, document on the canvas in its reading type, cover Rail, status bar). Menus and dialogs matched against kolbox's own editor. Settings shows Theme only (plus text size and typeface when reading). Notes: `_tmp/2026-11-22-folio-on-kolbox/`, `_tmp/2026-11-22-folio-all-kolbox/`.
- **Nav Rail collapsed on book and document pages** (his ruling): kolbox's narrow strip, expand and collapse, remembered in the setting `navRail`; the home keeps it open.
- **apps/style:** the board's Folio cells repointed at the package parts (find bar, command list).

## Current State

### Working
- Folio's home, a shelf, a book, a document, the editor in markdown, rich text and code, the settings, the new-document window and the menus were looked at in light and dark beside kolbox's Home and editor: one family, no page errors.
- Kolbox's own editor (`apps/editor`, kolbox style) still draws. In a headless browser it only mounts when the style is seeded in two places with `version: 1` (`_tmp/2026-11-22-folio-on-kolbox/scripts/kolbox-shot.mjs`).

### Known Issues
- Kolbox's `Dropdown` changed behaviour for every kolbox caller (a value no option holds shows as it is; number values come back as numbers). No dropdown was opened in kolbox's own editor after that.
- Shelf rows and library rows on the home are not links (no middle-click to a new tab); a single press opens a book where kolbox needs two.
- The editor header has a loose band between the file name row and the menu bar.
- The previews gate cannot run on this machine (its browser is not installed).
- `apps/folio` depends on kol-shell, linked by hand; the lockfile needs the next install.
- The palette, off-white, dark and accent settings are hidden; their code is in `_tmp/2026-11-22-folio-all-kolbox/apps/folio/src/folio/Chrome.jsx`.
- `FolioWrite.jsx` keeps a spare copy of the scope hook. The board's kolbox column is still stale.
- Figma has none of this: no folio variants, no `TabsDocument`, `FindBar` or `StatusBar` masters.
- Three inbox tickets were not touched (FigmaDocFrameRule, LogoShapes, LogoShapesReorganized).

## Next Steps
1. His review of Folio on kolbox and the calls listed in the batch notes.
2. On his word: Figma masters for the new parts and looks.
3. On his word: publish.
