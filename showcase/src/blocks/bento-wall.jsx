import { BentoCard } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Bento wall',
  description: 'A bento grid of media hover-cards with varied spans and inline covers',
  category: 'media',
  featured: true,
}
export const stage = 'full'

/* Inline abstract gradient cover — no network, no assets. Each call is its own
 * SVG document, so the reused gradient id is fine. */
const KOL_IMAGES = Array.from({ length: 7 }, (_, i) => `/kol-images/tt-0${i + 1}.jpg`)
let _phi = 0
const cover = () => KOL_IMAGES[_phi++ % KOL_IMAGES.length]

const COVERS = {
  aurora: cover('#5B21B6', '#0EA5E9', 0),
  ember: cover('#B45309', '#DB2777', 1),
  moss: cover('#065F46', '#84CC16', 2),
  slate: cover('#1E293B', '#64748B', 3),
  dusk: cover('#312E81', '#F43F5E', 4),
}

export default function BentoWall() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
      <div className="sm:col-span-2 lg:row-span-2">
        <BentoCard
          src={COVERS.aurora}
          title="Northern Field Recordings"
          subtitle="Sound archive"
          description="A season of location captures from the far coast — wind through basalt, tidewater, and the low hum of the aurora station at 3am."
          href="#/media/field-recordings"
          buttonLabel="Open the archive"
        />
      </div>

      <div className="sm:col-span-2">
        <BentoCard
          src={COVERS.ember}
          title="Kiln Studies"
          subtitle="Ceramics series"
          description="Twelve glaze tests fired at cone six, documented from wet clay to final crackle."
          href="#/media/kiln-studies"
          buttonLabel="See the firings"
        />
      </div>

      <div>
        <BentoCard src={COVERS.moss} title="Meadow Index" enableTilt overlayOpacity={40} />
      </div>

      <div>
        <BentoCard src={COVERS.slate} title="Concrete Diaries" enableTilt overlayOpacity={40} />
      </div>

      <div className="sm:col-span-2">
        <BentoCard
          src={COVERS.dusk}
          title="Nightshift Playlist"
          subtitle="Curated mix"
          description="Ninety minutes of ambient techno for the small hours, sequenced for deep focus."
          href="#/media/nightshift"
          buttonLabel="Press play"
        />
      </div>
    </div>
  )
}
