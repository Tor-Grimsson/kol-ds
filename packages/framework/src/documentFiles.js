import { kindOf, extOf } from '@kolkrabbi/kol-component'

/* DOCUMENT FILES — the files beside a folder's markdown (DocumentIndexFilesAndIcons049, kol-website 2026-10-28, a point
 * of the MarkdownPage ticket: *"a folder may also hold PDFs and images; the contents index lists them beside the md
 * pages and opens them in the DS QuickLook, not as pages"*). The consumer globs them as URLs and hands the modules over:
 *
 *   documentFiles(import.meta.glob('./brand/business/**\/*.{pdf,png,jpg,jpeg,webp,svg}', { query: '?url', import: 'default', eager: true }))
 *   → [{ id, title, group, file, ext, kind }]   in the glob's (path) order
 *
 *   id      the file's stem without a `NN-` prefix (`02-business-plan.pdf` → `business-plan`)
 *   title   the stem, unprefixed and titlecased (`Business Plan`)
 *   group   the file's parent folder, titlecased and unprefixed (`frumkvaedi-2024/` → `Frumkvaedi 2024`); '' at the root
 *   file    the served URL; ext its extension; kind the DS's (`kindOf`: pdf · image · video · audio · …)
 *
 * A row is what `DocumentIndex` draws as a card in its part and opens in Quick Look. `documentTabs` is the markdown half. */
const unprefix = (s) => s.replace(/^\d+[-_.]\s*/, '')
const titleCase = (s) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export default function documentFiles(modules = {}, { root = '' } = {}) {
  return Object.entries(modules).map(([path, url]) => {
    const rel = root && path.startsWith(root) ? path.slice(root.length) : path
    const parts = rel.replace(/^\.?\//, '').split('/')
    const name = parts.pop()
    const stem = name.replace(/\.[a-z0-9]+$/i, '')
    return { id: unprefix(stem), title: titleCase(unprefix(stem)), group: parts.length ? titleCase(unprefix(parts[parts.length - 1])) : '', file: typeof url === 'string' ? url : '', ext: extOf(name), kind: kindOf({ key: name }) }
  })
}
