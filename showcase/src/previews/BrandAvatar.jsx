import { BrandAvatar } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export default function BrandAvatarPreview() {
  return (
    <div className="flex items-center gap-6">
      <BrandAvatar mark={<Asset name="kol-logomark" title="Kolkrabbi" />} className="w-24" />
      <BrandAvatar mark={<Asset name="kol-logomark" title="Kolkrabbi" />} polarity="light" bg="#222D3D" className="w-24" />
    </div>
  )
}
