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
const cover = (a, b, seed = 0) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='700'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/>` +
      `</linearGradient></defs>` +
      `<rect width='900' height='700' fill='url(#g)'/>` +
      `<circle cx='${160 + seed * 70}' cy='200' r='180' fill='#ffffff' opacity='0.08'/>` +
      `<rect x='${480 - seed * 40}' y='360' width='320' height='320' rx='28' fill='#000000' opacity='0.12'/>` +
      `<path d='M0 ${540 + seed * 20} L900 ${380 - seed * 30} L900 700 L0 700 Z' fill='#ffffff' opacity='0.06'/>` +
      `</svg>`,
  )}`

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
