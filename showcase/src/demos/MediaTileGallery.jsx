import { MediaTileGallery } from '@kolkrabbi/kol-component'

export const stage = 'full'

const ITEMS = [
  { url: '/kol-images/tt-01.jpg', alt: 'Plate 01', caption: 'Plate 01 — tt-01' },
  { url: '/kol-images/tt-02.jpg', alt: 'Plate 02', caption: 'Plate 02 — tt-02' },
  { url: '/kol-images/tt-03.jpg', alt: 'Plate 03', caption: 'Plate 03 — tt-03' },
  { url: '/kol-images/tt-04.jpg', alt: 'Plate 04', caption: 'Plate 04 — tt-04' },
  { url: '/kol-images/tt-05.jpg', alt: 'Plate 05', caption: 'Plate 05 — tt-05' },
  { url: '/kol-images/tt-06.jpg', alt: 'Plate 06', caption: 'Plate 06 — tt-06' },
]

export default function MediaTileGalleryDemo() {
  return <MediaTileGallery items={ITEMS} layout="grid" cols={3} />
}
