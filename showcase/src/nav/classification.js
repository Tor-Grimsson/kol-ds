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
  /* comboLayouts.jsx — the palette-combination slabs ComboLab arranges, also
   * exported standalone for a guide that wants one. Surfaced 2026-08-15 when
   * the barrel parser learned multi-line export blocks; ungated until then. */
  RatioBar: 'molecules', Tower: 'molecules', QuadSplit: 'molecules',
  CardRow: 'molecules', StripeRow: 'molecules', AppliedCard: 'molecules',
  ComboLab: 'organisms',
  /* the brand-book set both brand apps were maintaining locally
   * (brand-book-mocks-two-consumers, 2026-09-03). The mocks are molecules: a
   * frame plus a mark plus a text block, nesting nothing. */
  AssetCard: 'atoms', Swatch: 'molecules',
  PostPhoto: 'molecules', PostType: 'molecules', PostProduct: 'molecules',
  PostEditorial: 'molecules', StoryPhoto: 'molecules', StoryType: 'molecules',
  ProfileAvatar: 'atoms',
  BusinessCardFront: 'molecules', BusinessCardBack: 'molecules', Envelope: 'molecules',
  Letterhead: 'molecules', LetterheadCorrespondence: 'molecules', EmailSignature: 'molecules',
  /* kol-content */
  SourcesReferences: 'atoms',
  /* WorkViewToggle: atom→molecule 2026-07-15 — now nests SearchInput (expanding) */
  WorkViewToggle: 'molecules',
  PortableTextRenderer: 'molecules', AuthorLine: 'molecules',
  ShareButtons: 'molecules', StackHero: 'organisms', ArticleHeader: 'organisms', ParallaxShelf: 'organisms',
  ScrollDriftGallery: 'organisms',
  /* kol-store */
  PriceDisplay: 'atoms', PrintGridCardGsap: 'atoms',
  PrintBuyButton: 'molecules',
  ProductDetailLayout: 'organisms', DiagonalMarqueeRiver: 'organisms', PrintsGrid: 'organisms',
  /* kol-chess */
  ChessBoard: 'atoms', ChessPiece: 'atoms',
  NotationPanel: 'molecules', PlaybackControls: 'molecules', VariationTree: 'molecules',
  ChessAnalysisLayout: 'organisms', ChessBoardWithControls: 'organisms',
  ChessBoardWithSidebar: 'organisms', ChessBoardFullscreen: 'organisms',
  ChessSidebar: 'organisms', GameArchiveTable: 'organisms', AlternativeControlsMock: 'organisms',
  ChessHero: 'organisms',
  /* rail blocks — AlternativeControlsMock's parts, barrel-exported 0.5.2 */
  SetupPanel: 'molecules', PiecePalette: 'molecules', GamePicker: 'molecules',
  MaterialSummary: 'molecules',
  /* kol-dashboards */
  DashMetricCard: 'atoms', DashStackedBarCard: 'atoms', DashSlotCard: 'atoms',
  Sparkline: 'atoms', DashboardGrid: 'atoms', GridCard: 'atoms', DashTooltip: 'atoms',
  DashChartCard: 'molecules', DashListCard: 'molecules', DashFeaturedCard: 'molecules',
  DashAlertCard: 'molecules', DashTableCard: 'molecules',
  Histogram: 'molecules', Candlestick: 'molecules', ScatterPlot: 'molecules',
  LineChart: 'molecules', DonutChart: 'molecules', Heatmap: 'molecules',
  MetricsDashboard: 'organisms',
  /* kol-workshop */
  /* RailSection is an ATOM by the placement test: it renders one row and its
   * children slot, composes no KOL component (the chevron is injected), and
   * previews in isolation. It is the rail LADDER — every rail header at every
   * rung comes from it (2026-08-01). */
  ShellSidebar: 'atoms', WorkshopDefaultSidebar: 'atoms', RailSection: 'atoms', RailRow: 'atoms',
  /* RightRail is a MOLECULE: it composes RailSection and RailRow, which is the
   * nesting test. THE right rail for every route — it replaced two components
   * that disagreed about which sections exist (2026-08-01). */
  RightRail: 'molecules',
  TagModeGate: 'molecules', WorkshopSidebar: 'molecules',
  ShellLayout: 'organisms', DocumentationReader: 'organisms',
  /* Exhibit sections — the scaffold a workshop section is declared against, so
   * the next one is content only. ExhibitCard and ExhibitLinkCard are ATOMS by
   * the placement test (each paints alone and composes no KOL component);
   * ExhibitSidebar is a MOLECULE by the nesting test (RailSection + RailRow +
   * DocsToc, the RightRail precedent); the two page scaffolds are ORGANISMS. */
  ExhibitCard: 'atoms', ExhibitLinkCard: 'atoms',
  ExhibitSidebar: 'molecules',
  ExhibitOverview: 'organisms', ExhibitPage: 'organisms',
  /* DocKit — the Doc* composer family over kol-doc-* roles (0.1.8) */
  DocHeader: 'molecules', DocSection: 'molecules', DocTable: 'molecules', DocFigure: 'molecules',
  /* kol-foundry */
  TypeSample: 'atoms', TypeSpecCard: 'atoms', TextPressure: 'atoms',
  GlyphItem: 'atoms', FontViewerComponent: 'organisms', FontViewerSection: 'organisms',
  SpecimenSectionHeader: 'molecules', TypefaceVariablePreview: 'molecules', ColorLoader: 'molecules', TypefaceAlphabet: 'molecules', PairingCard: 'molecules',
  FoundryOpentypeFeatures: 'organisms', FoundryTypefaceDetails: 'organisms', FoundryTypefacePairing: 'organisms',
  TypefaceHero: 'organisms', TypefaceStyleSection: 'organisms', FontPreviewSection: 'organisms',
  VariableFontSection: 'organisms', GlyphMetricsGrid: 'organisms', GlyphMetricsSection: 'organisms',
  FoundryCharacterSets: 'organisms', TypefaceLibraryGrid: 'organisms',
  TypefaceLibraryGridWithVariables: 'organisms', TypeSpecimenLive: 'organisms',
  TypefaceSpecimenPage: 'organisms',
}

/* ── Function: closed set — action, input, display, feedback, navigation,
 *    wayfinding, overlay, media, structure, utility ───────────────────────── */
export const FUNCTIONS_BY_NAME = {
  CloseButton: 'action',
  /* the app tier, shipped once (ShellHomeSystem, 2026-08-27) */
  SettingsMulti: 'input', CatalogPage: 'structure', SettingsShortcuts: 'display', SettingsLinks: 'wayfinding', SettingsColophon: 'display', TouchDeviceOverlay: 'overlay', useTouchPrimary: 'utility',
  /* component + framework (migrated verbatim from registry.js FUNCTION_MAP) */
  Button: 'action', ThemeToggle: 'action',
  Input: 'input', Textarea: 'input', Slider: 'input', Stepper: 'input',
  QuantityInput: 'input', PropertyInput: 'input',
  ToggleSwitch: 'input', ToggleCheckbox: 'input', ToggleBracket: 'input',
  SegmentedToggle: 'input', ViewToggle: 'input', Dropdown: 'input',
  LabeledControl: 'input', Label: 'input',
  Badge: 'display', Tag: 'display', Pill: 'display', Avatar: 'display',
  ColorSwatch: 'display', TransparentX: 'display', CodeBlock: 'display',
  Table: 'display', SectionLabel: 'display', Icon: 'display', IconFrame: 'display',
  RecordManager: 'display', FieldRow: 'input', StatusChip: 'input',
  SideNav: 'navigation', ExitPreview: 'navigation',
  Tooltip: 'overlay', MenuItem: 'overlay', MenuPopover: 'overlay',
  MenuDropdownItem: 'overlay', MenuDropdownDivider: 'overlay',
  MenuDropdownNest: 'overlay', FullscreenOverlay: 'overlay',
  QuadrantSync: 'overlay',
  Image: 'media', Carousel: 'media', Graphic: 'media', AssetPlaceholder: 'media', FileIcon: 'media', QuickLookFrame: 'media', MediaTile: 'media',
  RowMenuButton: 'action',
  EmblaNav: 'navigation', AudioPlayer: 'media',
  MediaViewer: 'media', MediaTileGallery: 'media', Figure: 'media',
  MediaLibrary: 'media', MediaPicker: 'media', MediaLibraryProvider: 'utility',
  MediaLibraryExplorer: 'media',
  ContextMenu: 'overlay', useContextMenu: 'utility',
  OverlayGlassPanel: 'display', EmptyState: 'feedback',
  HlsVideo: 'media', AssetGrid: 'structure', FeatureSplit: 'structure',
  CurveOverlay: 'input', RotaryDial: 'input',
  TabsRow: 'navigation',
  MobileTabBar: 'navigation',
  ContentFilters: 'wayfinding', DropdownTagFilter: 'wayfinding',
  ShellSearchOverlay: 'wayfinding', ShellDrawer: 'wayfinding',
  DocsToc: 'wayfinding', AsciiCursor: 'wayfinding',
  WorkViewToggle: 'wayfinding', ShellHeader: 'wayfinding', PortalFooter: 'wayfinding',
  PriceDisplay: 'display', ProsePreview: 'display', TypeSample: 'display',
  TypeSpecCard: 'display', SpecList: 'display',
  ShapeDropdown: 'action', SplitToolButton: 'action', ToolPalette: 'action', ErrorBoundary: 'feedback',
  SearchInput: 'input',
  FramedMediaBand: 'media', FullBleedHero: 'structure', CardFeatureItem: 'structure', SectionCardItem: 'structure',
  SectionText: 'display', SectionHero: 'structure', SectionSplit: 'structure', SectionCards: 'structure', SectionCta: 'structure', SectionFaq: 'structure', InspectorSection: 'structure',
  FeaturesCardSection: 'structure', CtaGlobal: 'structure', NewsletterBand: 'input', SectionNewsletter: 'structure',
  BentoCard: 'display', TiltBento: 'display', ProfileCard: 'display', FeaturedCarousel: 'media',
  TiltCard: 'display', AnimatedTitle: 'display', TextPressure: 'display',
  GlyphItem: 'display', FontViewerComponent: 'display', FontViewerSection: 'structure',
  ColorLoader: 'display', LoaderOverlay: 'overlay',
  SpectrumControls: 'input', SwatchControls: 'input', ColorInputRow: 'input',
  ColorRamp: 'display', SpectrumGrid: 'display',
  ArticleHeader: 'structure', ImageBlock: 'media', VideoBlock: 'media',
  PortableTextRenderer: 'display', StackHero: 'structure',
  SourcesReferences: 'display',
  GalleryCarousel: 'media', ParallaxShelf: 'media',
  ProductDetailLayout: 'structure', DiagonalMarqueeRiver: 'media', ScrollDriftGallery: 'media',
  Canvas: 'structure', SelectionOverlay: 'overlay', EditorShell: 'structure', AlignmentGrid: 'input',
  SpecimenSectionHeader: 'structure', GlyphMetricsGrid: 'display', VariableFontSection: 'input',
  TypefaceHero: 'display', TypefaceStyleSection: 'display', FontPreviewSection: 'display',
  FoundryCharacterSets: 'display',
  Divider: 'structure', Section: 'structure', Accordion: 'structure', ButtonGroup: 'structure',
  AccordionPanel: 'structure', PageSection: 'structure', BrandHero: 'structure',
  SubPageHero: 'structure', PageHero: 'structure',
  TagPath: 'display',
  useReveal: 'utility', useScrollSpy: 'utility', useDragResize: 'utility',
  usePrefersReducedMotion: 'utility', useTilt: 'utility', usePlayback: 'utility', parseFrontmatter: 'utility', readCover: 'utility',
  useCoarsePointer: 'utility', useLongPress: 'utility', useInViewAttention: 'utility', usePlaceholders: 'utility',
  useAxisAnimation: 'utility', useChartTooltip: 'utility', useCountUp: 'utility',
  useFontMetrics: 'utility',
  /* Named-export hooks — ungated until 2026-08-15: the parser pushed
   * `export { default as useX }` but dropped `export { useX }`, so the same
   * hook was gated or invisible depending on its export shape. */
  useModal: 'utility', usePopover: 'utility', useEyedropper: 'utility',
  useMediaLibrary: 'utility', useChessControls: 'utility', useTheme: 'utility',
  useNavHidden: 'utility', useSettingsToggle: 'utility', useGrabEdge: 'utility', useTagMode: 'utility',

  /* component gaps closed 2026-07-15 (Modal/Popover keys removed — they were
   * never barrel exports; the real system parts are rostered instead) */
  ActionButton: 'action', SizeOrDownload: 'action', SortHeader: 'input', SortControls: 'input', CopyButton: 'action', ColumnBrowser: 'wayfinding', KindPreview: 'media', AudioPreview: 'media', VideoSheet: 'media', PlaybackBar: 'media', AudioSheet: 'media', DocPage: 'display', PopoverPanel: 'overlay', SettingsPanel: 'overlay',
  PaletteHarmonyWheel: 'input',
  /* content-card system (2026-08-15) */
  ContentText: 'display', ContentMedia: 'media', ContentCard: 'display',
  ContentRow: 'display', ContentItem: 'display', ContentCollection: 'structure',
  /* the canvas viewport's zoom seam (editor-set-is-behind-its-source, 2026-09-03) */
  PanZoomViewport: 'structure', CanvasZoomContext: 'utility', useFps: 'utility',
  CanvasRuler: 'display', CanvasGuides: 'display', useFrameGeom: 'utility', niceStep: 'utility', ticksFor: 'utility',
  /* editor-panels-the-held-specs A6 (2026-09-03) */
  XYPad: 'input', InspectorRail: 'structure',
  PathNodeOverlay: 'overlay', CropOverlay: 'overlay',
  LayerStack: 'structure', AddLayerButton: 'action', BLEND_MODES: 'utility',
  TimelineDock: 'input', sampleTrack: 'utility', TIMELINE_EASINGS: 'utility',
  SettingsSections: 'structure',
  MediaInspector: 'overlay',
  svgToPngBlob: 'utility', inlineFontFaces: 'utility', embedFontFace: 'utility', downloadBlob: 'utility', useHistory: 'utility',
  CurveEditor: 'input', CURVE_KINDS: 'utility', defaultCurveFor: 'utility',
  KeyframeEditor: 'input', KEYFRAME_EASES: 'utility', DEFAULT_KEYFRAMES: 'utility',
  TYPE_LABELS: 'utility', BOOL_OP_LABELS: 'utility', SHAPE_KIND_LABELS: 'utility', labelForLayer: 'utility', rowLabelForLayer: 'utility', findLayerDeep: 'utility',
  pathD: 'utility', pathBounds: 'utility', shiftNode: 'utility', normalizePath: 'utility', scalePathNodes: 'utility', normalizePathRings: 'utility', rotatePathNodes: 'utility', dist: 'utility', nearestSegmentT: 'utility', splitSegment: 'utility', smoothNode: 'utility',
  /* the structural-fork hook (ColumnBrowserStackMode, 2026-09-03) */
  useMediaQuery: 'utility',
  /* framework */
  AppShell: 'structure', PageLayout: 'structure',
  /* styleguide */
  MoodTile: 'media', ColorAnatomy: 'display', TypeBlock: 'display', AssetTable: 'display',
  LogoCard: 'display', ClearspaceDiagram: 'display', LogoScaling: 'display', ComboLab: 'display',
  RatioBar: 'display', Tower: 'display', QuadSplit: 'display',
  CardRow: 'display', StripeRow: 'display', AppliedCard: 'display',
  /* brand-book set (2026-09-03) — every one of these SHOWS something: a mark
   * in situ, a colour with its value, an asset in a frame. */
  AssetCard: 'display', Swatch: 'display',
  PostPhoto: 'media', PostType: 'display', PostProduct: 'media',
  PostEditorial: 'media', StoryPhoto: 'media', StoryType: 'display',
  ProfileAvatar: 'media',
  BusinessCardFront: 'display', BusinessCardBack: 'display', Envelope: 'display',
  Letterhead: 'display', LetterheadCorrespondence: 'display', EmailSignature: 'display',
  /* content */
  AuthorLine: 'display', ShareButtons: 'action',
  /* store */
  PrintsGrid: 'structure', PrintGridCardGsap: 'media', PrintBuyButton: 'action',
  /* chess */
  ChessAnalysisLayout: 'structure', ChessBoard: 'display', ChessBoardWithControls: 'display',
  ChessBoardWithSidebar: 'display', ChessBoardFullscreen: 'display', ChessSidebar: 'action',
  GameArchiveTable: 'display', NotationPanel: 'display',
  PlaybackControls: 'action', VariationTree: 'display', AlternativeControlsMock: 'action',
  ChessPiece: 'media', ChessHero: 'display',
  SetupPanel: 'action', PiecePalette: 'input', GamePicker: 'input',
  MaterialSummary: 'display', useChessKeyboardShortcuts: 'utility',
  /* kol-controls — hardware panel controls (KolControlsPackage, 2026-09-01) */
  Knob: 'input', Fader: 'input', Toggle: 'input', FlipToggle: 'input', LED: 'feedback',
  IconButton: 'action',
  PanelLabel: 'structure', ModuleHeader: 'structure', JackSocket: 'input', LabeledJack: 'input',
  RockerSwitch: 'input', ParamSheet: 'overlay',
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
  RailSection: 'navigation', RailRow: 'navigation', RightRail: 'navigation',
  DocHeader: 'structure', DocSection: 'structure', DocTable: 'display', DocFigure: 'structure',
  TagModeGate: 'overlay', WorkshopSidebar: 'navigation', WorkshopDefaultSidebar: 'navigation',
  ExhibitCard: 'display', ExhibitLinkCard: 'navigation', ExhibitSidebar: 'navigation',
  ExhibitOverview: 'structure', ExhibitPage: 'structure',
  /* foundry additions */
  GlyphMetricsSection: 'display', TypefaceLibraryGrid: 'wayfinding',
  TypefaceLibraryGridWithVariables: 'wayfinding', TypefaceVariablePreview: 'display', TypefaceAlphabet: 'display', TypeSpecimenLive: 'display', TypefaceSpecimenPage: 'structure', PairingCard: 'display', FoundryOpentypeFeatures: 'structure', FoundryTypefaceDetails: 'structure', FoundryTypefacePairing: 'structure',
  /* shell — the app-shell set (2026-08-14) */
  NavRail: 'navigation', TabStrip: 'navigation',
  PageShell: 'structure', SettingsScaffold: 'structure',
  PageHeader: 'wayfinding',
  WalkthroughPanel: 'overlay', ShortcutsOverlay: 'overlay',
  Logomark: 'display',
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
  ShellTocContext: 'non-component', ShellFullHeightContext: 'non-component', ShellContentWidthContext: 'non-component',
  ShellTocCollapsedContext: 'non-component', ShellNavCollapsedContext: 'non-component', TagModeProvider: 'non-component',
  DocsArticle: 'member-of:DocumentationReader', DocsHeader: 'member-of:DocumentationReader',
  DocsFrontmatter: 'member-of:DocumentationReader',
  TagModeOverlay: 'member-of:TagModeGate', TagGraph: 'member-of:TagModeOverlay',
  useExhibitToc: 'non-component',
  /* shell — namesake twins (NOT re-exports: the app-tier component shares a
   * name with a different site/dashboard-tier component; both stay on the
   * roster under their own package) + contexts + single-parent sub-parts */
  AppShell: 'namesake:framework-site-shell vs shell-app-shell',
  ContentFilters: 'namesake:component-filters vs shell-catalog-organism',
  GridCard: 'namesake:dashboards-grid-cell vs shell-A4-card',
  NavHiddenContext: 'non-component',
  SettingsToggleContext: 'non-component',
  PageBleed: 'member-of:PageShell',
  LabeledControlSection: 'member-of:SettingsPanel', SettingsRow: 'member-of:SettingsPanel', SettingsSwitch: 'member-of:SettingsPanel', SettingsChoice: 'member-of:SettingsPanel',
  SettingsChipRow: 'member-of:SettingsPanel', SettingsFooter: 'member-of:SettingsPanel',
  AudioTile: 'member-of:AudioPreview', VideoTile: 'member-of:AudioPreview', DocFrontmatter: 'member-of:DocPage',
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
  'Layout', 'PageLayout', 'AppShell', 'ScrollToTop', 'Icon', 'Graphic',
  'ChessControlsProvider', 'ModalProvider', 'ShellTocContext', 'ShellTocCollapsedContext', 'ShellNavCollapsedContext', 'ShellContentWidthContext',
]

/* Deprecated aliases / merged-away exports. Story lives on the survivor's page. */
export const DEPRECATED = [
  'MenuPopover', 'QuantityStepper',
  /* Content Set retirement wave — step 3 landed 2026-08-30: the eight absorbed
   * cards are GONE from the barrels, not deprecated. Sources quarantined to
   * `_tmp/2026-08-30-content-set-exports/`. kol-dashboards' `GridCard` is a
   * different component and was ruled KEEP (2026-08-27). */
  /* SectionSet (2026-08-26): the section family took the Section* prefix; the
   * old names are aliases of SectionHero / SectionSplit / SectionCards /
   * SectionCta / InspectorSection until the next major. */
  'FullBleedHero', 'FeatureSplit', 'FeaturesCardSection', 'CtaGlobal', 'Section',
  /* SectionNewsletter (2026-08-27): NewsletterBand = SectionNewsletter (title → headline, description → body) */
  'NewsletterBand',
  /* SectionHeroRound2 (2026-08-26): FeaturedCarousel = SectionHero media=[…] (kept as the engine).
   * FoundryCTA dropped 2026-09-25. */
  'FeaturedCarousel',
  /* CardFeatureItem = SectionCardItem (2026-08-26) */
  'CardFeatureItem',
  /* page-family-is-not-a-set (2026-09-03): BrandHero + SubPageHero = PageHero;
   * kol-framework's AppShell = PageLayout (kol-shell's AppShell is a different
   * component and stays live under its own name). */
  'BrandHero', 'SubPageHero',
  /* BentoCard = TiltBento (2026-08-27, the Tilt family) */
  'BentoCard',
  /* brand-book-mocks-two-consumers (2026-09-03): the forks' LetterheadB =
   * LetterheadCorrespondence — a B suffix says nothing about which sheet to
   * reach for. Kept so a fork migrates without touching its call sites. */
  'LetterheadB',
]

/* Components that ship without a demo file ON PURPOSE (pnpm validate:demos).
 * A reason is mandatory — the gate exists because "no demo yet" was never
 * written down anywhere, so nobody could tell debt from a ruling. Anything not
 * listed here needs showcase/src/demos/<Name>.jsx. */
export const NO_DEMO = (() => {
  /* THE 2026-08-15 SEED — debt, not rulings. These 46 shipped without a page
   * because nothing failed the build when they didn't; they are listed so the
   * gate can go live against NEW work while this backlog is worked down. A
   * name leaves this map by getting showcase/src/demos/<Name>.jsx (the gate
   * then fails on the stale exemption, so the list can't rot upward). */
  const debt = (names, why) => Object.fromEntries(names.map((n) => [n, `no demo yet (2026-08-15 seed) — ${why}`]))
  return {
    ...debt(['SetupPanel', 'PiecePalette', 'GamePicker', 'MaterialSummary'],
      'chess apparatus parts; the board demos cover the system, these never got their own'),
    ...debt(['MediaLibrary', 'MediaLibraryProvider', 'PopoverPanel'],
      'kol-component organisms/overlays predating the demo convention'),
    ContextMenu: 'no demo yet (2026-09-21) — a right-click menu needs a surface to right-click on, '
      + 'and a demo stage of one component has none that means anything. It is exercised in '
      + 'apps/media on folder and file rows; a demo lands with the blocks page that has a list.',
    RowMenuButton: 'renders only on a coarse-pointer device, inside a row or tile that has a context '
      + 'menu (MediaTile, ColumnBrowser, the media pages); nothing to show on a desktop demo (2026-09-23)',
    MediaLibraryExplorer: 'no demo yet (2026-09-21) — it is a variant dispatch over the two page '
      + 'components, and `MediaLibrary` itself is still on this list; it gets a demo when that one '
      + 'does, since a demo for either needs an injected client the showcase does not carry. The '
      + 'live surface is apps/media.',
    ...debt(['VideoSheet'], 'the QuickTime bar needs a video the showcase does not carry (PlayDiscAndVideoBar 2026-08-27)'),
    ...debt(['AudioPlayer', 'EmblaNav'],
      'born 2026-08-15, shipped straight to consumers without a showcase surface'),
    ...debt(['GlyphItem', 'FontViewerComponent', 'FontViewerSection'],
      'foundry font-viewer parts; the deferred @kol/fontviewer engine is their real story'),
    ...debt(['TouchDeviceOverlay', 'useTouchPrimary'], 'renders only on a coarse-pointer device; nothing to show on a desktop demo'),
    ...debt(['NavRail', 'PageShell', 'SettingsScaffold', 'TabStrip',
      'WalkthroughPanel', 'ShortcutsOverlay', 'Logomark'],
      'kol-shell 0.1.0 — the package ships entirely unexercised (AGENT-CONTEXT ⚠️)'),
    ...debt(['RatioBar', 'Tower', 'QuadSplit', 'CardRow', 'StripeRow', 'AppliedCard'].slice(1),
      'styleguide combo slabs, ungated until the barrel parser was fixed 2026-08-15'),
    ...debt(['ExhibitOverview', 'ExhibitPage', 'ExhibitSidebar', 'ExhibitCard', 'ExhibitLinkCard'],
      'kol-workshop 0.22.0 exhibit system — ships unexercised (AGENT-CONTEXT ⚠️)'),
    /* editor-panels-the-held-specs A1 (2026-09-03): AddLayerButton is the `+`
     * in the layers panel's tab row and renders INSIDE the LayerStack demo,
     * where it adds real rows to the tree — a page of its own would show one
     * button and a menu that adds to nothing. */
    AddLayerButton: 'rendered in the LayerStack demo, where it adds rows to the live tree (2026-09-03)',
    /* the full-screen viewer needs a real media set and a URL resolver to show
     * anything; the MediaLibrary demo opens it on real files (2026-09-04). */
    MediaInspector: 'opened from the MediaLibrary demo, over real files (2026-09-04 ruling)',
    /* rulers-and-guides-are-private (2026-09-03): both layers render INSIDE the
     * Canvas demo, over its `panEnabled` viewport, where a drag off a ruler
     * makes a real guide. A page of their own would have to build a canvas to
     * show one tick. */
    CanvasRuler: 'rendered in the Canvas demo, over its live viewport (2026-09-03 ruling)',
    CanvasGuides: 'rendered in the Canvas demo — drag off a ruler to create one (2026-09-03 ruling)',
    /* editor-panels-the-held-specs B2 (2026-09-03) — a RULING: these two are
     * editing chrome whose every prop is a consumer's geometry and write path
     * (a path layer with nodes, a photo with a crop rect, screen→virtual,
     * an undo transaction). A demo would have to build a small editor to show
     * one drag. `packages/design-editor` in THIS repo runs both on real layers
     * and is built under the same gates — that is the exercise. */
    ...Object.fromEntries([
      ['PathNodeOverlay', 'editing chrome over a consumer path layer — packages/design-editor runs it on real layers (2026-09-03 ruling)'],
      ['CropOverlay', 'editing chrome over a consumer photo layer — packages/design-editor runs it on real layers (2026-09-03 ruling)'],
    ]),
    /* editor-set-is-behind-its-source (2026-09-03) — a RULING. `Canvas`'s demo
     * renders `panEnabled`, which IS a PanZoomViewport, so a second page would
     * show the same pan/zoom/rulers twice; and a context object renders
     * nothing at all — its contract is that `SelectionOverlay` divides by it,
     * which the Canvas demo shows by zooming. */
    ...Object.fromEntries([
      ['PanZoomViewport', "the Canvas demo IS this — `panEnabled` wraps in it (2026-09-03 ruling)"],
      ['CanvasZoomContext', 'a context object — nothing to render; the Canvas demo exercises it by zooming (2026-09-03 ruling)'],
    ]),
    /* brand-book-mocks-two-consumers (2026-09-03) — a RULING, not debt: these
     * thirteen are one SET, and a mock of a mark in situ says nothing without a
     * brand behind it (a mark node, a palette, an info block). The styleguide
     * set page renders all thirteen off one authored `BRAND_BOOK` object, which
     * is both the exercise and the reference call shape; thirteen per-component
     * pages would each have to invent a brand to show anything. AssetCard and
     * Swatch DO have demos — they carry no brand. */
    ...Object.fromEntries([
      'PostPhoto', 'PostType', 'PostProduct', 'PostEditorial', 'StoryPhoto', 'StoryType',
      'ProfileAvatar', 'BusinessCardFront', 'BusinessCardBack', 'Envelope', 'Letterhead',
      'LetterheadCorrespondence', 'EmailSignature',
    ].map((n) => [n, 'brand-book mock — the styleguide set page renders the whole set off one authored brand object (2026-09-03 ruling)'])),
    ...debt(['ShellLayout', 'ShellSidebar', 'WorkshopSidebar', 'WorkshopDefaultSidebar',
      'RightRail', 'RailSection', 'RailRow', 'TagModeGate', 'TagPath',
      'DocumentationReader', 'DocHeader', 'DocSection', 'DocTable', 'DocFigure'],
      'workshop shell + doc chrome; /workshop-preview renders the system, not the pieces'),
  }
})()

/* R1 membership flags — the 2026-08-09 pass, ledger at
 * docs/documentation/03-components/02-placement.md § The pass. A flagged
 * component stays LISTED and stays shipping: "flagged, not silently blessed,
 * and its page says so." Removal is the owner's call, never this file's. */
export const MEMBERSHIP_FLAGS = {
  ExitPreview:
    "fails membership tests 1 + 2 — a CMS escape hatch worn as DS chrome; flagged for removal, kept pending the owner's decision",
  TagModeGate:
    'orphaned export — its only mount was deleted by the ONE-search ruling (2026-08-01); the package still ships it',
  AlternativeControlsMock:
    'a demo harness in a published API — it assembles the chess control apparatus for showing, not for consuming',
}
