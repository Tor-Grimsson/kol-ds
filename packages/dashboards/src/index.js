// Cards
export { default as DashMetricCard } from './cards/DashMetricCard.jsx'
export { default as DashStackedBarCard } from './cards/DashStackedBarCard.jsx'
export { default as DashChartCard } from './cards/DashChartCard.jsx'
export { default as DashListCard } from './cards/DashListCard.jsx'
export { default as DashFeaturedCard } from './cards/DashFeaturedCard.jsx'
export { default as DashAlertCard } from './cards/DashAlertCard.jsx'
export { default as DashSlotCard } from './cards/DashSlotCard.jsx'
export { default as DashTableCard } from './cards/DashTableCard.jsx'

// The card set (metric's look, 2026-11-03)
export { default as Card } from './cards/Card.jsx'
export { default as RankedList } from './cards/RankedList.jsx'
export { default as StatTiles } from './cards/StatTiles.jsx'
export { default as DetailsOverlay } from './cards/DetailsOverlay.jsx'

// The metric page's parts (kol-dashboards 0.12.0, W5.1) — what apps/metric drew itself
export { default as TopStats } from './cards/TopStats.jsx'
export { default as MetricTiles } from './cards/MetricTiles.jsx'
export { default as ChartHead } from './cards/ChartHead.jsx'
export { default as ChangeBadge } from './cards/ChangeBadge.jsx'
export { default as DeltaBadge } from './cards/DeltaBadge.jsx'
export { default as Behaviours } from './cards/Behaviours.jsx'
export { default as GoalsTable } from './cards/GoalsTable.jsx'
export { default as ColorKey } from './cards/ColorKey.jsx'
export { default as RecordsTable } from './cards/RecordsTable.jsx'

// The float cards (float-everything W7, 2026-11-04) — Card · StatTiles · RankedList take `variant="float"`
export { default as SectionHead } from './cards/SectionHead.jsx'
export { default as FoldedHead } from './cards/FoldedHead.jsx'
export { default as FloatCard } from './cards/FloatCard.jsx'
export { default as TaskCard } from './cards/TaskCard.jsx'
export { default as SourceCard } from './cards/SourceCard.jsx'
export { default as CaptureCard } from './cards/CaptureCard.jsx'
export { default as KanbanColumn } from './cards/KanbanColumn.jsx'
export { default as ProjectCard } from './cards/ProjectCard.jsx'
export { default as LinkCard } from './cards/LinkCard.jsx'
export { default as CoverTile } from './cards/CoverTile.jsx'
export { default as ContinueCard } from './cards/ContinueCard.jsx'
export { default as AssetRow } from './cards/AssetRow.jsx'
export { default as LiveCard } from './cards/LiveCard.jsx'
export { default as NoteCard } from './cards/NoteCard.jsx'
export { default as PositionBlock } from './cards/PositionBlock.jsx'

// Chart visualizations
export { default as Histogram } from './charts/Histogram.jsx'
export { default as Candlestick } from './charts/Candlestick.jsx'
export { default as ScatterPlot } from './charts/ScatterPlot.jsx'
export { default as LineChart } from './charts/LineChart.jsx'
export { default as DonutChart } from './charts/DonutChart.jsx'
export { default as Sparkline } from './charts/Sparkline.jsx'
export { default as Heatmap, CalendarHeatmap, CalendarScale } from './charts/Heatmap.jsx'
// The float charts (float-everything W10, 2026-11-04) — LineChart takes `variant="float"`
export { default as TrendChart } from './charts/TrendChart.jsx'
export { default as ChartWithLegend } from './charts/ChartWithLegend.jsx'
export { default as SegmentBar } from './charts/SegmentBar.jsx'
export { default as FunnelChart } from './charts/FunnelChart.jsx'
export { default as JourneyExplorer } from './charts/JourneyExplorer.jsx'
export { default as WorldMap } from './charts/WorldMap.jsx'
export { default as Legend } from './charts/Legend.jsx'
export { default as WeeklyBars } from './charts/WeeklyBars.jsx'
export { default as ProportionBar } from './charts/ProportionBar.jsx'

// Layout
export { default as DashboardGrid } from './layout/DashboardGrid.jsx'
export { default as GridCard } from './layout/GridCard.jsx'

// Shared
export { default as DashTooltip } from './shared/DashTooltip.jsx'
export { default as useChartTooltip } from './shared/useChartTooltip.js'
export { default as useCountUp } from './shared/useCountUp.js'
export { default as CalendarIcon } from './shared/CalendarIcon.jsx'
export { default as REGION_NAMES } from './shared/regions.js'
export { formatCount, formatDuration, formatRange, formatBucket, formatTick } from './shared/formatSeries.js'
export { default as formatMetric, formatCompact, formatPercent, formatDelta } from './shared/formatMetric.js'

// Compositions — full apparatus (data injected by the consumer)
export { default as MetricsDashboard } from './MetricsDashboard.jsx'
export {
  RANGES,
  DEPLOY_STATE_COLORS,
  DEPLOY_STATE_LABELS,
  TYPE_COLORS,
  PALETTE,
  MILESTONE_COLORS,
  formatB2Size,
  timeAgo,
} from './metrics-constants.js'
