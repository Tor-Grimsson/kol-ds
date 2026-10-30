/* VOYAGER's document library — press releases, letters, a poster, each markdown beside the originals it came from
 * (`library/`), in record's shape: a kind as the file name's first word, a date and a language in the name. The input
 * kol-framework's `documentLibrary` reads and kol-styleguide's `DocumentLibrary` draws (DocumentLibraryAndBoardParts,
 * 2026-10-29). Vite-only (import.meta.glob); the PDFs are generated stand-ins, every word invented. */
export const LIBRARY_MODULES = import.meta.glob('./library/**/*.md', { query: '?raw', import: 'default', eager: true })
const URLS = import.meta.glob('./library/**/*.{pdf,svg,png,jpg}', { query: '?url', import: 'default', eager: true })
/* the originals as a manifest — `{ key, name, url }`, `key` under the library root, as record's bucket list is */
export const LIBRARY_FILES = Object.entries(URLS).map(([path, url]) => {
  const key = path.replace('./library/', '')
  return { key, name: key.split('/').pop(), url }
})
export const LIBRARY_ROOT = './library/'
