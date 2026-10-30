/* The `## The pages it holds` table for a frame's doc, from placements.js — written by `--write`, compared by the gate. */
export const MARK = (id) => `<!-- placements: ${id} -->`
export function pagesTable(f) {
  const rows = f.pages.map((p) => `| \`${p}\` | ${(f.evidence ?? []).includes(p) ? 'runs here today' : 'fits, placed for review'} |`)
  return [
    MARK(f.id),
    `Every page that fits ${f.name}, from \`showcase/src/nav/placements.js\` (the list apps/layouts and \`validate-placements\` read).`,
    '',
    '| Page | Placement |',
    '|---|---|',
    ...rows,
    `<!-- /placements: ${f.id} -->`,
  ].join('\n')
}
