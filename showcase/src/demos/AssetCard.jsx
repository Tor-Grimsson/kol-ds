import { AssetCard } from '@kolkrabbi/kol-styleguide'

export const stage = 'md'

/* The frame every brand-book mock sits in: a caption over a washed plate, and
 * NO scaling — the child keeps its own proportions, so the aspect box belongs
 * to the caller. Group similar aspects in one row and their heights line up;
 * that is the whole contract. */
export default function AssetCardDemo() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <AssetCard caption="Business card">
        <div
          className="flex items-center justify-center kol-helper-12 text-meta"
          style={{ aspectRatio: '85 / 55', background: 'var(--kol-surface-primary)' }}
        >
          85 × 55
        </div>
      </AssetCard>
      <AssetCard caption="Envelope (DL)" backdrop="var(--kol-surface-secondary)">
        <div
          className="flex items-center justify-center kol-helper-12 text-meta"
          style={{ aspectRatio: '220 / 110', background: 'var(--kol-surface-primary)' }}
        >
          220 × 110
        </div>
      </AssetCard>
    </div>
  )
}
