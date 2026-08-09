/**
 * AssetGrid — thin responsive N-column grid for tiling asset figures
 * (swatches, placeholders, spec cards). Fixed 2/3/4-column layout that
 * collapses to 2 columns under the md breakpoint and to 1 column under
 * 480px, all via Tailwind responsive utilities — no CSS of its own.
 *
 * Purely structural — no styling of the cells, no spacing outside itself
 * (the source's `mt-8` was a call-site concern and was dropped). Children
 * just fill the tracks.
 *
 * @param {2|3|4}     cols      column count at full width (unknown values fall back to 3)
 * @param {string}    gap       Tailwind gap utility for both axes
 * @param {ReactNode} children  grid items
 * @param {string}    className extra classes appended
 */

const COLS = {
  2: 'grid-cols-1 min-[480px]:grid-cols-2',
  3: 'grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4',
}

export default function AssetGrid({ cols = 3, gap = 'gap-4', children, className = '' }) {
  return (
    <div className={`grid ${COLS[cols] || COLS[3]} ${gap} ${className}`.trim()}>
      {children}
    </div>
  )
}
