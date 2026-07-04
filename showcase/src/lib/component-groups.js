/**
 * Component sub-part grouping — a HAND-AUTHORED overlay (never mined).
 *
 * A component's compositional sub-parts are MEMBERS of one component, not
 * peers in the roster: they render inside the parent's page (one sidebar
 * row) instead of each getting its own. See
 * docs/documentation/02-components/00-taxonomy.md → "One page per component".
 *
 * Why here and not in usage-index.json: the usage miner regenerates that
 * file and would wipe the 125 hand-seeded entries (taxonomy audit, ledger
 * #18/#23). Grouping lives in this overlay so the mined data stays untouched.
 *
 *   parent name → [member names]
 */
export const COMPONENT_GROUPS = {
  MenuItem: ['MenuDropdownItem', 'MenuDropdownDivider', 'MenuDropdownNest'],
  Accordion: ['AccordionPanel'],
}

/* member name → parent name (derived) */
export const MEMBER_OF = Object.fromEntries(
  Object.entries(COMPONENT_GROUPS).flatMap(([parent, members]) =>
    members.map((m) => [m, parent])),
)
