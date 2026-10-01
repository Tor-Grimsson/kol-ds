import { ProfileAvatar } from '@kolkrabbi/kol-styleguide'
import { Asset } from '@kolkrabbi/kol-brand/svg'

export default function ProfileAvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <ProfileAvatar mark={<Asset name="kol-logomark" title="Kolkrabbi" />} className="w-24" />
      <ProfileAvatar mark={<Asset name="kol-logomark" title="Kolkrabbi" />} polarity="light" bg="#222D3D" className="w-24" />
    </div>
  )
}
