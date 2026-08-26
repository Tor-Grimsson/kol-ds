/**
 * @kolkrabbi/kol-workshop — exhibit sections.
 *
 * The scaffold an exhibit section is built from, so adding the NEXT one is
 * content and nothing else. The shell was already shared; the sections above it
 * were not, and every consumer rebuilt the same landing page, the same
 * specimen-grid page, the same prose companion and the same rail block by hand.
 *
 *   ExhibitOverview  the landing — concept, one opt-in action, children as cards
 *   ExhibitPage      an inner page — sections of specimen grids and/or prose
 *   ExhibitSidebar   the rail block: on-this-page · doc links · quick actions
 *   useExhibitToc    registers that block into the shell's TOC slot
 *   ExhibitCard      the specimen header inside a section
 *   ExhibitLinkCard  the child-page card on a landing grid
 *
 * Content is consumer-injected, like everything else in this package — the
 * exhibit declares cards, specimens and doc links; the package renders them.
 */
export { default as ExhibitOverview } from './ExhibitOverview.jsx'
export { default as ExhibitPage } from './ExhibitPage.jsx'
export { default as ExhibitSidebar } from './ExhibitSidebar.jsx'
export { default as ExhibitCard } from './ExhibitCard.jsx'
export { default as ExhibitLinkCard } from './ExhibitLinkCard.jsx'
export { default as useExhibitToc } from './useExhibitToc.js'
