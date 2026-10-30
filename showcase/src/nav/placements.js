/**
 * placements.js — WHICH PAGES FIT WHICH FRAME (LayoutsAndWebsiteLayout, kol-website 2026-10-28: *"No one can see what fits
 * where"*). One list, read by three things: apps/layouts (a frame's rail lists its pages), the frame docs
 * (18-site-frame · 16-app-anatomy · 23-website-frame), and `scripts/validate-placements.mjs`.
 *
 * A PAGE is a roster organism whose Function is `structure` (classification.js), plus anything placed here. The gate fails
 * when a page is under no frame and has no NOT_A_PAGE reason, and when a placed name matches no live export (rot both ways).
 * Each frame's doc (docs/documentation/04-compositions/<doc>.md) carries a `## Pages` section naming the same
 * pages; the gate checks the two agree.
 * A page may fit more than one frame — list it under each. `evidence` = an app runs it in that frame today; the rest fit by
 * shape and are placed for review.
 *
 * `SectionText` (level page) is the page header — `PageHeader` is on the retirements ledger (2026-10-22).
 *
 * Plain data, no Vite/DOM imports — the gate imports this file directly.
 */
/* a frame's pages come in GROUPS — the way an app of that kind arranges them (LayoutsAppPages, 2026-10-29): the site rail's
   categories, the variants control's Page rows (one segmented row per group). `pages` is the flat list. */
const frame = (f) => ({ ...f, pages: f.groups.flatMap((g) => g.pages) })

export const FRAMES = [
  frame({
    id: 'site', doc: '18-site-frame', name: 'SiteLayout', pkg: '@kolkrabbi/kol-framework',
    shape: 'the site rail (categories, foldernotes, groups), the plane with pageWash, the TOC rail',
    runs: 'brand, record, site-hub, brand-hub',
    groups: [
      { id: 'home', label: 'Home', pages: ['SiteHero'] },
      { id: 'brand', label: 'Brand', pages: ['Brand', 'BrandGuide'] },
      { id: 'pages', label: 'Pages', pages: ['PageHero', 'SectionText', 'PageSection'] },
      /* a FOLDERNOTE: CategoryPage is the group's own overview, its pages the cards */
      { id: 'documents', label: 'Documents', pages: ['CategoryPage', 'MarkdownPage', 'DocumentIndex', 'DocumentLibrary', 'A4Pages'] },
      { id: 'resume', label: 'Resume', pages: ['ResumeLibrary', 'ResumeSource', 'ResumeTreatment', 'KitPreview'] },
      { id: 'tools', label: 'Tools', pages: ['Decks', 'Notes', 'MediaLibrary', 'TimeSet'] },
    ],
    evidence: ['SiteHero', 'CategoryPage', 'SectionText', 'PageSection', 'Brand', 'BrandGuide', 'DocumentIndex', 'Decks', 'Notes', 'MediaLibrary', 'ResumeLibrary', 'ResumeSource', 'ResumeTreatment'],
  }),
  frame({
    id: 'app', doc: '16-app-anatomy', name: 'AppShell', pkg: '@kolkrabbi/kol-shell',
    shape: 'the app rail, the tool frame; AppHub and AppStudio are its page sets',
    runs: 'media, metric, studio-hub, resume, print, the *-hub apps',
    groups: [
      { id: 'hub', label: 'Hub', pages: ['HubHome', 'HubSettings', 'HubDev'] },
      { id: 'studio', label: 'Studio', pages: ['StudioCreate', 'StudioDetail', 'CatalogPage'] },
      { id: 'pages', label: 'Pages', pages: ['SettingsScaffold', 'EditorShell'] },
      { id: 'media', label: 'Media', pages: ['MediaLibrary', 'Decks', 'DeckEditor', 'Notes'] },
      { id: 'tools', label: 'Tools', pages: ['PrintStudio', 'MetricsDashboard', 'ChessAnalysisLayout', 'TimeSet'] },
      { id: 'resume', label: 'Resume', pages: ['ResumeLibrary', 'ResumeSource', 'ResumeTreatment', 'KitPreview'] },
    ],
    evidence: ['HubHome', 'HubSettings', 'HubDev', 'StudioCreate', 'StudioDetail', 'CatalogPage', 'MediaLibrary', 'Decks', 'Notes', 'DeckEditor', 'PrintStudio', 'MetricsDashboard', 'ResumeLibrary', 'ResumeSource', 'ResumeTreatment'],
  }),
  frame({
    id: 'shell', doc: '04-workshop-system', name: 'ShellLayout', pkg: '@kolkrabbi/kol-workshop',
    shape: 'two rails (sidebar + RightRail) around the markdown reader',
    runs: 'ui.kolkrabbi.io (the showcase), the workshop',
    groups: [
      { id: 'docs', label: 'Docs', pages: ['DocumentationReader', 'MarkdownPage', 'DocumentIndex', 'SearchPage'] },
      { id: 'exhibit', label: 'Exhibit', pages: ['ExhibitOverview', 'ExhibitPage'] },
    ],
    evidence: ['DocumentationReader', 'SearchPage', 'ExhibitOverview', 'ExhibitPage'],
  }),
  frame({
    id: 'website', doc: '23-website-frame', name: 'WebsiteLayout', pkg: '@kolkrabbi/kol-framework',
    shape: 'top bar + takeover menu, full-bleed pages, footer, intro and route loaders, the cursor layer',
    runs: 'kolkrabbi.io',
    groups: [
      { id: 'home', label: 'Home', pages: ['SiteHero', 'FeaturedCarousel', 'FeatureSplit', 'NewsletterBand', 'CtaGlobal'] },
      { id: 'stack', label: 'Stack', pages: ['StackHero', 'ArticleHeader', 'StickyNavCard', 'ContentCollection'] },
      { id: 'pages', label: 'Pages', pages: ['SectionText', 'PageSection'] },
      { id: 'prints', label: 'Prints', pages: ['ProductDetailLayout', 'PrintsGrid'] },
      { id: 'foundry', label: 'Foundry', pages: ['TypefaceSpecimenPage', 'FontViewerSection', 'FoundryOpentypeFeatures', 'FoundryTypefaceDetails', 'FoundryTypefacePairing'] },
    ],
    evidence: ['StackHero', 'ArticleHeader', 'StickyNavCard', 'ContentCollection', 'SectionText', 'PageSection', 'FoundryOpentypeFeatures', 'FoundryTypefacePairing'],
  }),
]

/* WHAT A PAGE IS (LayoutsAppPages, 2026-10-29 — user: *"there is no way to understand what you are looking at"*): its
   package, what it is for, and where it runs today. apps/layouts shows it in the variants control's panel. */
export const PAGE_INFO = {
  SiteHero: { pkg: 'kol-framework', purpose: "A site's landing: the image, its wash, the mark, the name, a tagline.", runs: 'brand, record, site-hub, kolkrabbi.io' },
  CategoryPage: { pkg: 'kol-framework', purpose: "A foldernote's overview: the category's lede over its pages as cards, read from the rail's tree.", runs: 'site-hub, brand' },
  PageHero: { pkg: 'kol-framework', purpose: "The brand book's opening band: a title, a lede and the page's mark.", runs: 'brand' },
  SectionText: { pkg: 'kol-component', purpose: 'The page header: eyebrow, headline, body at the page, app, section or content level.', runs: 'brand, record, kolkrabbi.io, every hub' },
  PageSection: { pkg: 'kol-framework', purpose: 'A section of a page: its title and lede over the section’s content.', runs: 'brand, record, kolkrabbi.io' },
  Brand: { pkg: 'kol-styleguide', purpose: 'The brand tool: the brand book and the assets page over one manifest, book ⇄ assets.', runs: 'brand, brand-hub' },
  BrandGuide: { pkg: 'kol-styleguide', purpose: 'A whole brand guide, chapter by chapter, over a manifest.', runs: 'brand, brand-hub' },
  MarkdownPage: { pkg: 'kol-framework', purpose: 'A markdown file as a document page, its links with hover cards.', runs: 'record, brand, document' },
  DocumentIndex: { pkg: 'kol-styleguide', purpose: "A folder's documents as the brand book's contents cards.", runs: 'record, brand, document' },
  DocumentLibrary: { pkg: 'kol-styleguide', purpose: 'A library of documents as a table per folder: kind, date, language, the originals in Quick Look, the markdown.', runs: 'record, brand, document' },
  A4Pages: { pkg: 'kol-styleguide', purpose: 'Any content flowed onto A4 sheets, breaking between elements.', runs: 'record (the resume kit), print' },
  PrintStudio: { pkg: 'kol-styleguide', purpose: 'The print tool: markdown or stationery to A4 sheets, PDF, DOCX, MD.', runs: 'print' },
  ResumeLibrary: { pkg: 'kol-resume', purpose: "Every treatment of the resume, to open or export.", runs: 'record, resume' },
  ResumeSource: { pkg: 'kol-resume', purpose: 'Every fact the resume treatments read, in one place.', runs: 'record, resume' },
  ResumeTreatment: { pkg: 'kol-resume', purpose: 'One treatment of the resume by its route, with its options and export.', runs: 'record, resume' },
  KitPreview: { pkg: 'kol-resume', purpose: 'The whole job-application kit on A4 sheets or fit-to-length.', runs: 'record, resume' },
  Decks: { pkg: 'kol-deck', purpose: 'The presentation tool: decks, the editor, the stage and the filmstrip.', runs: 'presentation, brand-hub, brand' },
  Notes: { pkg: 'kol-notes', purpose: 'The notes tool: the list, the editor and a note’s thumb.', runs: 'notes, brand-hub, brand' },
  MediaLibrary: { pkg: 'kol-component', purpose: 'A bucket of files: browse, preview, upload, trash.', runs: 'media, every hub, brand' },
  TimeSet: { pkg: 'kol-component', purpose: 'A project in time: Timeline, Month, Week and Day over one model, the Today line, a phase’s detail.', runs: 'kol-atlas (its source), record’s dashboard (next)' },
  HubHome: { pkg: 'kol-shell', purpose: "An app's home: its saved files as cards, with the app's actions.", runs: 'every *-hub app' },
  HubSettings: { pkg: 'kol-shell', purpose: "An app's settings: typed rows in sections.", runs: 'every *-hub app' },
  HubDev: { pkg: 'kol-shell', purpose: "A dev server's tabs: the app's internals, on dev only.", runs: 'every *-hub app' },
  StudioCreate: { pkg: 'kol-shell', purpose: 'Create: a catalog of parts beside the case on the studio canvas.', runs: 'studio-hub, monitor' },
  StudioDetail: { pkg: 'kol-shell', purpose: "A part's or patch's page: prose, a preview and its actions.", runs: 'studio-hub' },
  CatalogPage: { pkg: 'kol-shell', purpose: 'A catalog of items: filters, search, views, cards or rows.', runs: 'studio-hub, catalog, media-hub' },
  SettingsScaffold: { pkg: 'kol-shell', purpose: 'The settings page: a masthead, tabs, then the app’s own rows.', runs: 'every *-hub app' },
  EditorShell: { pkg: 'kol-component', purpose: 'An editor’s frame: the canvas between its two rails.', runs: 'editor, fxr' },
  DeckEditor: { pkg: 'kol-deck', purpose: 'The deck editor, opened from Decks on a deck.', runs: 'presentation' },
  MetricsDashboard: { pkg: 'kol-dashboards', purpose: 'A metrics dashboard: cards and charts on a grid.', runs: 'metric' },
  ChessAnalysisLayout: { pkg: 'kol-chess', purpose: 'The chess analysis apparatus: board, notation, archive.', runs: 'chess (no app yet)' },
  DocumentationReader: { pkg: 'kol-workshop', purpose: 'The markdown reader: a doc with its frontmatter and TOC.', runs: 'ui.kolkrabbi.io, workshop' },
  SearchPage: { pkg: 'kol-workshop', purpose: 'The search results page across docs and components.', runs: 'ui.kolkrabbi.io' },
  ExhibitOverview: { pkg: 'kol-workshop', purpose: "An exhibit's overview: its sections as cards.", runs: 'ui.kolkrabbi.io' },
  ExhibitPage: { pkg: 'kol-workshop', purpose: 'One exhibit: a component shown in sections.', runs: 'ui.kolkrabbi.io' },
  StackHero: { pkg: 'kol-content', purpose: 'The journal’s opening: the lead article.', runs: 'kolkrabbi.io /stack' },
  ArticleHeader: { pkg: 'kol-content', purpose: 'An article’s masthead: title, byline, date, cover.', runs: 'kolkrabbi.io /stack' },
  StickyNavCard: { pkg: 'kol-content', purpose: 'The article’s sticky contents card.', runs: 'kolkrabbi.io /stack' },
  ContentCollection: { pkg: 'kol-component', purpose: 'A listing of cards or rows with filters and a view toggle.', runs: 'kolkrabbi.io /work, /stack' },
  FeaturedCarousel: { pkg: 'kol-component', purpose: 'A carousel of featured items.', runs: 'kolkrabbi.io (fits)' },
  FeatureSplit: { pkg: 'kol-component', purpose: 'A feature beside its image.', runs: 'kolkrabbi.io (fits)' },
  NewsletterBand: { pkg: 'kol-component', purpose: 'The newsletter sign-up band.', runs: 'kolkrabbi.io (fits)' },
  CtaGlobal: { pkg: 'kol-component', purpose: 'The closing call to action.', runs: 'kolkrabbi.io (fits)' },
  ProductDetailLayout: { pkg: 'kol-store', purpose: 'A product page: images, price, options, details.', runs: 'kolkrabbi.io /prints (fits)' },
  PrintsGrid: { pkg: 'kol-store', purpose: 'The prints listing.', runs: 'kolkrabbi.io /prints (fits)' },
  TypefaceSpecimenPage: { pkg: 'kol-foundry', purpose: 'A typeface’s specimen page.', runs: 'kolkrabbi.io /foundry (fits)' },
  FontViewerSection: { pkg: 'kol-foundry', purpose: 'The variable-font viewer.', runs: 'kolkrabbi.io /foundry (fits)' },
  FoundryOpentypeFeatures: { pkg: 'kol-foundry', purpose: 'A typeface’s OpenType features, shown live.', runs: 'kolkrabbi.io /foundry' },
  FoundryTypefaceDetails: { pkg: 'kol-foundry', purpose: 'A typeface’s details: styles, metrics, licence.', runs: 'kolkrabbi.io /foundry (fits)' },
  FoundryTypefacePairing: { pkg: 'kol-foundry', purpose: 'A typeface beside its pairings.', runs: 'kolkrabbi.io /foundry' },
}

/* page-shaped by classification, but not a page a frame holds — each with its reason */
export const NOT_A_PAGE = {
  BrandBook: "one of Brand's two pages (book ⇄ assets) — listed once, as Brand (LayoutsAppPages)",
  BrandAssets: "one of Brand's two pages (book ⇄ assets) — listed once, as Brand (LayoutsAppPages)",
  ShellLayout: 'a frame (ShellLayout) — the page list is under it',
  AppHub: 'a page set of AppShell (Hub), not a page',
  AppStudio: 'a page set of AppShell (Studio), not a page',
  ModuleFrame: 'a hardware panel part — sits on a rack, not in a frame',
  ChannelStrip: 'a hardware panel part — sits on a rack, not in a frame',
  RackCase: 'the rack itself — a part a tool page lays out, not a page',
}
