/**
 * @kolkrabbi/kol-workshop — tag system.
 *
 * Route- and inventory-decoupled tag mode lifted from the monorepo. Wrap the
 * routed tree in <TagModeProvider inventory={...} docHref={...} tagHref={...}>,
 * mount <TagModeGate> as a layout route, and open with useTagMode().openTagMode.
 */
export { TagModeProvider, useTagMode } from './TagModeContext.jsx'
export { default as TagModeGate } from './TagModeGate.jsx'
export { default as TagModeOverlay } from './TagModeOverlay.jsx'
export { default as TagGraph } from './TagGraph.jsx'
