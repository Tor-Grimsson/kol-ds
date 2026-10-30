import { BrandLockup, LOCKUP_TYPES } from '@kolkrabbi/kol-styleguide'

export const stage = 'md'

/* one branded-house lockup per type, from one value — the renderer LockupLab's stage and output draw with */
const VALUE = { parent: 'Voyager', product: 'Field', sub: 'Manual', shape: 'rounded' }

export default function BrandLockupPreview() {
  return (
    <div className="flex flex-col gap-8 text-emphasis">
      {LOCKUP_TYPES.map((t) => <BrandLockup key={t.id} value={VALUE} type={t.id} size={36} />)}
    </div>
  )
}
