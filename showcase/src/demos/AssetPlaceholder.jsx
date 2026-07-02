import { AssetPlaceholder } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function AssetPlaceholderDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
      <AssetPlaceholder category="photo" name="hero-01" aspectRatio="16 / 9" />
      <AssetPlaceholder category="icon" name="logo-mark" aspectRatio="1 / 1" note="not found" />
    </div>
  )
}
