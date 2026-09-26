// @kolkrabbi/kol-deck — presentations: a slide as data (a 1920×1080 stage of text, image and rule
// layers), the renderer, the editor (stage, inspector, filmstrip, undo), present mode and the exports
// (PNG · PDF · PPTX · the deck file). The model is kol-olina's brand decks, itself kol-fxr's compose
// editor cut down. Data is consumer-injected; the layouts a deck starts from are the consumer's.

export { default as Decks } from './Decks.jsx'
export { default as DecksCatalog } from './DecksCatalog.jsx'
export { default as DeckEditor, DECK_SHORTCUTS } from './DeckEditor.jsx'
export { default as DeckFile, DECK_FILE_KIND } from './DeckFile.jsx'
export { default as DeckSettings } from './DeckSettings.jsx'
export { default as SlideRenderer } from './SlideRenderer.jsx'
export { default as SlideThumb } from './SlideThumb.jsx'
export { default as SlideStage } from './SlideStage.jsx'
export { default as SlideInspector } from './SlideInspector.jsx'
export { default as useDeckHistory } from './useDeckHistory.js'
export {
  SLIDE_W, SLIDE_H, newId, CHROME, DISPLAY, text, image, rule, clone,
  GREYS, ABSOLUTE_BLACK, BLACK, resolveColor, ROLE, BLANK_LAYOUT,
} from './slideDoc.js'
export { alignLayers, distributeLayers, duplicateLayers, pasteLayers, reorderZ, applyDeckSettings, duplicateSlide } from './layerOps.js'
export { computeSnapTargets, findSnap, SNAP_THRESHOLD } from './snap.js'
export { FONT_OPTIONS, familyFor, ensureFont } from './webFonts.js'
export { slideToSvg, slideToPngBlob, svgToPngBlob, fontCssForDoc, deckToPdfBlob, deckToPptxBlob, saveBlob } from './slideExport.js'
