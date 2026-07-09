/**
 * Example compositions — the app-specific glue that wires the KOL shell + docs
 * engine into a product's navigation. These are reference implementations meant
 * to be copied and adapted; they take app data (routes, inventory) and href
 * helpers (basePath, docHref) as props rather than importing any singleton.
 */
export { default as WorkshopSidebar } from './WorkshopSidebar.jsx'
export { default as WorkshopDefaultSidebar } from './WorkshopDefaultSidebar.jsx'
