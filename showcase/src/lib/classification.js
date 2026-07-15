/**
 * classification.js — THE hand-authored classification layer, validated for
 * completeness by `pnpm validate:roster` (scripts/validate-roster.mjs).
 *
 * Plain data, no Vite/DOM imports — the CI gate imports this file directly.
 * The contract (docs/documentation/03-components/00-taxonomy.md):
 *   - every roster component has exactly one Tier and one Function;
 *   - absence is an ERROR (red build), never a silent default;
 *   - a key here that matches no barrel export is ALSO an error (rot both ways).
 *
 * TIERS is only consulted for packages whose src/ is flat (no atoms/molecules/
 * organisms folders) — kol-component's tiers come from its folder structure.
 */

/* ── Tier (flat packages only; plural = sidebar category keys). Values from
 *    the 2026-07-15 classification sweep — mechanical nesting test applied
 *    per component; organism = page-region judgment call, justifications in
 *    the playbook arc. ──────────────────────────────────────────────────── */
export const TIERS = {
  /* kol-styleguide */
  MoodTile: 'atoms', TypeBlock: 'atoms', ClearspaceDiagram: 'atoms', LogoScaling: 'atoms',
  ColorAnatomy: 'molecules', AssetTable: 'molecules', LogoCard: 'molecules',
  ComboLab: 'organisms',
  /* kol-content */
  SourcesReferences: 'atoms',
  /* WorkViewToggle: atom→molecule 2026-07-15 — now nests SearchInput (expanding) */
  WorkViewToggle: 'molecules',
  ArticleCard: 'molecules', PortableTextRenderer: 'molecules', AuthorLine: 'molecules',
  ShareButtons: 'molecules', WorkCard: 'molecules', WorkListItem: 'molecules',
  StackHero: 'organisms', ArticleHeader: 'organisms', ParallaxShelf: 'organisms',
  ScrollDriftGallery: 'organisms',
  /* kol-store */
  PriceDisplay: 'atoms', PrintGridCard: 'atoms', PrintGridCardGsap: 'atoms',
  PrintBuyButton: 'molecules',
  ProductDetailLayout: 'organisms', DiagonalMarqueeRiver: 'organisms', PrintsGrid: 'organisms',
  /* kol-chess */
  ChessBoard: 'atoms', ChessPiece: 'atoms',
  NotationPanel: 'molecules', PlaybackControls: 'molecules', VariationTree: 'molecules',
  ChessAnalysisLayout: 'organisms', ChessBoardWithControls: 'organisms',
  ChessBoardWithSidebar: 'organisms', ChessBoardFullscreen: 'organisms',
  ChessSidebar: 'organisms', GameArchiveTable: 'organisms', AlternativeControlsMock: 'organisms',
  ChessHero: 'organisms',
  /* kol-dashboards */
  DashMetricCard: 'atoms', DashStackedBarCard: 'atoms', DashSlotCard: 'atoms',
  Sparkline: 'atoms', DashboardGrid: 'atoms', GridCard: 'atoms', DashTooltip: 'atoms',
  DashChartCard: 'molecules', DashListCard: 'molecules', DashFeaturedCard: 'molecules',
  DashAlertCard: 'molecules', DashTableCard: 'molecules',
  Histogram: 'molecules', Candlestick: 'molecules', ScatterPlot: 'molecules',
  LineChart: 'molecules', DonutChart: 'molecules', Heatmap: 'molecules',
  MetricsDashboard: 'organisms',
  /* kol-workshop */
  ShellSidebar: 'atoms', WorkshopDefaultSidebar: 'atoms',
  TagModeGate: 'molecules', WorkshopSidebar: 'molecules',
  ShellLayout: 'organisms', DocumentationReader: 'organisms',
  /* kol-foundry */
  TypefaceLibraryItem: 'atoms', TypeSample: 'atoms', TypeSpecCard: 'atoms', TextPressure: 'atoms',
  SpecimenSectionHeader: 'molecules', TypefaceVariablePreview: 'molecules', ColorLoader: 'molecules',
  TypefaceHero: 'organisms', TypefaceStyleSection: 'organisms', FontPreviewSection: 'organisms',
  VariableFontSection: 'organisms', GlyphMetricsGrid: 'organisms', GlyphMetricsSection: 'organisms',
  FoundryCharacterSets: 'organisms', TypefaceLibraryGrid: 'organisms',
  TypefaceLibraryGridWithVariables: 'organisms', TypeSpecimenLive: 'organisms',
  TypefaceSpecimenPage: 'organisms',
}

/* ── Function: closed set — action, input, display, feedback, navigation,
 *    wayfinding, overlay, media, structure, utility ───────────────────────── */
export const FUNCTIONS_BY_NAME = {
  /* component + framework (migrated verbatim from registry.js FUNCTION_MAP) */
  Button: 'action', ThemeToggle: 'action',
  Input: 'input', Textarea: 'input', Slider: 'input', Stepper: 'input',
  QuantityInput: 'input', PropertyInput: 'input',
  ToggleSwitch: 'input', ToggleCheckbox: 'input', ToggleBracket: 'input',
  SegmentedToggle: 'input', ViewToggle: 'input', Dropdown: 'input',
  LabeledControl: 'input', Label: 'input',
  Badge: 'display', Tag: 'display', Pill: 'display', Avatar: 'display',
  ColorSwatch: 'display', TransparentX: 'display', CodeBlock: 'display',
  Table: 'display', SectionLabel: 'display', Icon: 'display',
  SideNav: 'navigation', ExitPreview: 'navigation',
  Tooltip: 'overlay', MenuItem: 'overlay', MenuPopover: 'overlay',
  MenuDropdownItem: 'overlay', MenuDropdownDivider: 'overlay',
  MenuDropdownNest: 'overlay', FullscreenOverlay: 'overlay',
  Image: 'media', Carousel: 'media', Graphic: 'media', AssetPlaceholder: 'media',
  MediaViewer: 'media', MediaTileGallery: 'media', Figure: 'media',
  OverlayGlassPanel: 'display', EmptyState: 'feedback',
  HlsVideo: 'media', AssetGrid: 'structure', FeatureSplit: 'structure',
  CurveOverlay: 'input', RotaryDial: 'input',
  TabsRow: 'navigation',
  ContentFilters: 'wayfinding', DropdownTagFilter: 'wayfinding',
  ShellSearchOverlay: 'wayfinding', ShellDrawer: 'wayfinding',
  DocsToc: 'wayfinding', AsciiCursor: 'wayfinding',
  WorkViewToggle: 'wayfinding', ShellHeader: 'wayfinding', PortalFooter: 'wayfinding',
  PriceDisplay: 'display', ProsePreview: 'display', TypeSample: 'display',
  TypeSpecCard: 'display', SpecList: 'display',
  ShapeDropdown: 'action', SplitToolButton: 'action', ErrorBoundary: 'feedback',
  SearchInput: 'input',
  FramedMediaBand: 'media', FullBleedHero: 'structure', CardFeatureItem: 'structure',
  FeaturesCardSection: 'structure', CtaGlobal: 'structure', FoundryCTA: 'structure', NewsletterBand: 'input',
  BentoCard: 'display', FeaturedCarousel: 'media',
  TiltCard: 'display', AnimatedTitle: 'display', TextPressure: 'display',
  ColorLoader: 'display', LoaderOverlay: 'overlay',
  SpectrumControls: 'input', SwatchControls: 'input', ColorInputRow: 'input',
  ColorRamp: 'display', SpectrumGrid: 'display',
  ArticleCard: 'display', ArticleHeader: 'structure', ImageBlock: 'media', VideoBlock: 'media',
  PortableTextRenderer: 'display', StackHero: 'structure',
  SourcesReferences: 'display',
  WorkCard: 'display', WorkListItem: 'display',
  GalleryCarousel: 'media', ParallaxShelf: 'media',
  ProductDetailLayout: 'structure', DiagonalMarqueeRiver: 'media', ScrollDriftGallery: 'media',
  Canvas: 'structure', SelectionOverlay: 'overlay', EditorShell: 'structure', AlignmentGrid: 'input',
  SpecimenSectionHeader: 'structure', GlyphMetricsGrid: 'display', VariableFontSection: 'input',
  TypefaceHero: 'display', TypefaceStyleSection: 'display', FontPreviewSection: 'display',
  FoundryCharacterSets: 'display',
  Divider: 'structure', Section: 'structure', Accordion: 'structure', ButtonGroup: 'structure',
  AccordionPanel: 'structure', PageSection: 'structure', BrandHero: 'structure',
  SubPageHero: 'structure',
  useReveal: 'utility', useScrollSpy: 'utility',
  usePrefersReducedMotion: 'utility', useTilt: 'utility',
  useAxisAnimation: 'utility', useChartTooltip: 'utility', useCountUp: 'utility',
  useFontMetrics: 'utility',

  /* component gaps closed 2026-07-15 (Modal/Popover keys removed — they were
   * never barrel exports; the real system parts are rostered instead) */
  CopyButton: 'action', PopoverPanel: 'overlay', MediaCard: 'media', MediaRow: 'media',
  PaletteHarmonyWheel: 'input',
  /* framework */
  AppShell: 'structure',
  /* styleguide */
  MoodTile: 'media', ColorAnatomy: 'display', TypeBlock: 'display', AssetTable: 'display',
  LogoCard: 'display', ClearspaceDiagram: 'display', LogoScaling: 'display', ComboLab: 'display',
  /* content */
  AuthorLine: 'display', ShareButtons: 'action',
  /* store */
  PrintsGrid: 'structure', PrintGridCard: 'media', PrintGridCardGsap: 'media', PrintBuyButton: 'action',
  /* chess */
  ChessAnalysisLayout: 'structure', ChessBoard: 'display', ChessBoardWithControls: 'display',
  ChessBoardWithSidebar: 'display', ChessBoardFullscreen: 'display', ChessSidebar: 'action',
  GameArchiveTable: 'display', NotationPanel: 'display',
  PlaybackControls: 'action', VariationTree: 'display', AlternativeControlsMock: 'action',
  ChessPiece: 'media', ChessHero: 'display',
  /* dashboards */
  DashMetricCard: 'display', DashStackedBarCard: 'display', DashChartCard: 'display',
  DashListCard: 'display', DashFeaturedCard: 'display', DashAlertCard: 'feedback',
  DashSlotCard: 'display', DashTableCard: 'display',
  Histogram: 'display', Candlestick: 'display', ScatterPlot: 'display', LineChart: 'display',
  DonutChart: 'display', Sparkline: 'display', Heatmap: 'display',
  DashboardGrid: 'structure', GridCard: 'structure', DashTooltip: 'overlay',
  MetricsDashboard: 'display',
  /* workshop */
  ShellLayout: 'structure', ShellSidebar: 'navigation', DocumentationReader: 'display',
  TagModeGate: 'overlay', WorkshopSidebar: 'navigation', WorkshopDefaultSidebar: 'navigation',
  /* foundry additions */
  GlyphMetricsSection: 'display', TypefaceLibraryGrid: 'wayfinding',
  TypefaceLibraryGridWithVariables: 'wayfinding', TypefaceLibraryItem: 'display',
  TypefaceVariablePreview: 'display', TypeSpecimenLive: 'display', TypefaceSpecimenPage: 'structure',
}

/* ── Exempt: exports that are deliberately NOT roster rows ─────────────────
 * name → reason ('member-of:Parent' | 'non-component' | 'loader' |
 * 're-export:@kolkrabbi/kol-x'). The gate accepts these; anything not
 * exported anymore is an error here too. 're-export:*' entries stay on the
 * roster under their OWNING package (dedup drops the re-exporting copy). */
export const EXEMPT = {
  /* styleguide — foreign re-exports (ComboLab's layout primitives are
   * registry-internal, not barrel-exported — nothing to exempt) */
  AssetGrid: 're-export:@kolkrabbi/kol-component', FeatureSplit: 're-export:@kolkrabbi/kol-component',
  ProsePreview: 're-export:@kolkrabbi/kol-component', SpectrumGrid: 're-export:@kolkrabbi/kol-component',
  TypeSample: 're-export:@kolkrabbi/kol-foundry', TypeSpecCard: 're-export:@kolkrabbi/kol-foundry',
  /* chess */
  ChessControlsProvider: 'non-component',
  /* workshop — contexts, providers, single-parent doc/tag sub-parts */
  ShellTocContext: 'non-component', ShellFullHeightContext: 'non-component',
  ShellTocCollapsedContext: 'non-component', TagModeProvider: 'non-component',
  DocsArticle: 'member-of:DocumentationReader', DocsHeader: 'member-of:DocumentationReader',
  DocsFrontmatter: 'member-of:DocumentationReader',
  TagModeOverlay: 'member-of:TagModeGate', TagGraph: 'member-of:TagModeOverlay',
  /* component — headless system parts + single-parent sub-parts */
  ModalProvider: 'non-component',
  HueStrip: 'member-of:SpectrumControls', SBSquare: 'member-of:SpectrumControls',
  WheelTriangle: 'member-of:SpectrumControls',
  SwatchStack: 'member-of:SwatchControls', EyedropPick: 'member-of:SwatchControls',
  CanvasFrame: 'member-of:Canvas', PanViewport: 'member-of:Canvas',
}

/* ── Off-roster lists (moved from registry.js so the CI gate can import
 *    them without touching Vite-bound modules) ───────────────────────────── */

/* Route wrappers / behaviors / loaders — documented on /docs pages.
 * Providers/contexts render nothing themselves — a card would always be a
 * ghost; their story lives on the pages of the components they power. */
export const DOCS_ONLY = [
  'Layout', 'AppShell', 'ScrollToTop', 'Icon', 'Graphic',
  'ChessControlsProvider', 'ModalProvider', 'ShellTocContext', 'ShellTocCollapsedContext',
]

/* Deprecated aliases / merged-away exports. Story lives on the survivor's page. */
export const DEPRECATED = ['MenuPopover', 'QuantityStepper']
