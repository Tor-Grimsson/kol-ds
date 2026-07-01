import { Image } from '@kolkrabbi/kol-component'

export default function ImageDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
      <Image
        src="https://picsum.photos/seed/kol/640/360"
        alt="Sample landscape"
        category="photo"
        name="landscape"
        aspectRatio="16 / 9"
      />
      <Image
        src="/missing-asset.png"
        alt="Missing asset"
        category="photo"
        name="missing"
        aspectRatio="16 / 9"
      />
    </div>
  )
}
