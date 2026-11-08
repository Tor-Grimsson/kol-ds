/**
 * Example compositions — the app-specific glue that wires the KOL shell + docs
 * engine into a product's navigation. These are reference implementations meant
 * to be copied and adapted; they take app data (routes, inventory) and href
 * helpers (basePath, docHref) as props rather than importing any singleton.
 */
export { default as WorkshopRail } from './WorkshopRail.jsx'
/** @deprecated WorkshopSidebar = WorkshopRail (2026-11-08, ITS RAIL) — alias for the 30-day ledger */
export { default as WorkshopSidebar } from './WorkshopRail.jsx'
export { default as WorkshopDefaultRail } from './WorkshopDefaultRail.jsx'
/** @deprecated WorkshopDefaultSidebar = WorkshopDefaultRail (2026-11-08, ITS RAIL) — alias for the 30-day ledger */
export { default as WorkshopDefaultSidebar } from './WorkshopDefaultRail.jsx'
