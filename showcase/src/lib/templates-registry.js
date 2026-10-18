import { PREVIEWS } from './previews-registry.js'

/**
 * Templates — the page layer above components and modules (W6, 2026-10-17 — user: "is there a showcase for
 * those templates? … hero + sections with text and containers and tables, thats could be a template of
 * structured text + media … slide deck has library and template pages both use catalog, so thats a
 * template?"). A template is a page shape: one header, a body of blocks, for one kind of content.
 *
 * A template's preview is either a file in ../templates/ (rendered and shown as its own source, like every
 * preview) or the page-sized preview a component already has (`preview: 'CatalogPage'`), so a template and
 * the component it is built on cannot drift.
 */
const modules = import.meta.glob('../templates/*.jsx', { eager: true })
const sources = import.meta.glob('../templates/*.jsx', { eager: true, query: '?raw', import: 'default' })
const fileEntry = (key) => {
  const path = `../templates/${key}.jsx`
  const mod = modules[path]
  return mod && { name: `template-${key}`, Component: mod.default, Card: null, source: sources[path], stage: mod.stage || 'full', variants: null, tones: null, sizes: null, states: null, picker: null, frame: mod.frame || false }
}

/* the header styles a template can carry — the three the apps use (two the Hub/Shell's, one external) and
 * the site's two */
export const HEADERS = {
  'page-header': { label: 'PageHeader', from: 'kol-component', kind: 'Hub / Shell', note: 'the masthead: a title and one line, actions at the right' },
  'filters-row': { label: 'ContentFilters title row', from: 'kol-component', kind: 'Hub / Shell', note: 'title · filter · search, the page controls at the right, under a PageHeader' },
  'library-header': { label: 'LibraryHeader', from: 'MediaLibrary (kol-component)', kind: 'External', note: 'the media browser brings its own wordmark and controls' },
  'doc-header': { label: 'DocHeader', from: 'kol-workshop', kind: 'Site', note: 'eyebrow · title · lede, for documents and indexes' },
  'section-hero': { label: 'SectionHero', from: 'kol-component', kind: 'Site', note: 'a hero over media, its text in a glass panel' },
  none: { label: 'No header', from: '—', kind: 'Tool', note: 'the rail only — the tool takes the whole page' },
}

export const TEMPLATES = [
  { slug: 'document', title: 'Document', description: 'Structured text and media — a hero, then sections of text, media containers and tables.',
    headers: ['section-hero'], blocks: ['text', 'heading', 'section', 'media', 'table'],
    builtFrom: [['SectionHero', '/components/section-hero'], ['SectionText', '/components/section-text'], ['Table', '/components/table']],
    usedBy: ['brand.kolkrabbi.io — the brand page', 'the asset pages'], entry: () => fileEntry('document') },
  { slug: 'catalog', title: 'Catalog', description: 'A library of things as cards or rows, filtered and searched.',
    headers: ['page-header', 'filters-row'], blocks: ['heading', 'table'],
    builtFrom: [['CatalogPage', '/components/catalog-page'], ['HubHome', '/components/hub-home']],
    usedBy: ['the slide deck — Library and Templates', 'every Hub Home (monitor, mirror, fxr)'], entry: () => PREVIEWS.CatalogPage },
  { slug: 'gallery', title: 'Gallery', description: 'A wall of specimens with the controls that change how they are seen — size, ground, guide.',
    headers: ['doc-header', 'filters-row'], blocks: ['heading', 'media'],
    builtFrom: [['IconPlate', '/components/icon-plate'], ['CompareGrid', '/components/compare-grid'], ['ContentFilters', '/components/content-filters']],
    usedBy: ['Styles › Icons', 'the open-questions glyph rounds', 'monitor › Dev › Icons'], entry: () => fileEntry('gallery') },
  { slug: 'browser', title: 'Browser', description: 'An imported layout from another system that brings its own header — the media browser.',
    headers: ['library-header'], blocks: ['imported-layout'],
    builtFrom: [['MediaLibrary', '/components/media-library']],
    usedBy: ['Library › Browse', 'apps/media', 'r2b2'], entry: () => PREVIEWS.MediaLibrary },
  { slug: 'tool', title: 'Tool', description: 'The tool itself, full bleed — the rail beside it, nothing above it.',
    headers: ['none'], blocks: [],
    builtFrom: [['AppStudio', '/components/app-studio']],
    usedBy: ["monitor's rack", "fxr's editor", "mirror's studio"], entry: () => fileEntry('tool') },
  { slug: 'index', title: 'Index', description: 'A page about its pages — what each section holds, then its pages as links, one line each.',
    headers: ['doc-header'], blocks: ['heading', 'table', 'section', 'link-list'],
    builtFrom: [['DocHeader · DocSection (kol-workshop)', null], ['Table', '/components/table']],
    usedBy: ['the Development home', 'every chapter home in the showcase'], entry: () => fileEntry('index-page') },
  { slug: 'dev', title: 'Dev', description: "A hub's development page — tabs of experiments, references and comparisons, on a dev server only.",
    headers: ['page-header'], blocks: ['heading'],
    builtFrom: [['HubDev', '/components/hub-dev'], ['CompareGrid', '/components/compare-grid']],
    usedBy: ['monitor (first)', 'then mirror, fxr and every Hub app'], entry: () => PREVIEWS.HubDev },
]

export const templateHref = (slug) => `/templates/${slug}`
export const blockHref = (slug) => `/templates/blocks/${slug}`
