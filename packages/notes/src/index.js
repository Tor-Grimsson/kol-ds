// @kolkrabbi/kol-notes — notes as database rows with a markdown body: the catalog, the editor (the
// DS DocumentEditor in the page) and the whole tool over a consumer-injected client. Data never
// fetched here. The model is kol-olina's brand notes.

export { default as Notes } from './Notes.jsx'
export { default as NotesCatalog } from './NotesCatalog.jsx'
export { default as NoteEditor } from './NoteEditor.jsx'
export { default as NoteThumb } from './NoteThumb.jsx'
export { starterBody, titleOf, tagsOf, previewOf, slugFor } from './notes.js'
