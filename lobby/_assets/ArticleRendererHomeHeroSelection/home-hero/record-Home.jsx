import { Logomark } from '@kolkrabbi/kol-component'
import logomarkUrl from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import { BRAND_INFO } from '@data/info.js'

/* Home — the image hero, kol-website apps/brand's Landing on the same CDN mood
 * image, the overlay inline (kol-ds-ui site-hub's line: the inverse ink mixed
 * over the photo, 32% light · 80% dark). No tagline or button: none exists in
 * data/ (BRAND_INFO.labels.manifesto is empty). The links launchpad that lived
 * here is the Dashboard's Links tab. */
const CDN_MOOD = 'https://b2.kolkrabbi.io/website/asset-library/cms/stack/mood'

export default function Home() {
  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={`${CDN_MOOD}/mood-05-1200.jpg`}
          srcSet={`${CDN_MOOD}/mood-05-400.jpg 400w, ${CDN_MOOD}/mood-05-800.jpg 800w, ${CDN_MOOD}/mood-05-1200.jpg 1200w, ${CDN_MOOD}/mood-05-1600.jpg 1600w`}
          sizes="100vw"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="absolute inset-0 w-full h-full pointer-events-none bg-[color-mix(in_srgb,var(--kol-surface-on-inverse)_32%,transparent)] in-data-[theme=dark]:bg-[color-mix(in_srgb,var(--kol-surface-on-inverse)_80%,transparent)] dark:not-in-data-[theme=light]:bg-[color-mix(in_srgb,var(--kol-surface-on-inverse)_80%,transparent)]"
        aria-hidden="true"
      />
      <div className="relative z-[1] flex flex-col items-center gap-10 px-8 text-center">
        <Logomark svgUrl={logomarkUrl} size={180} className="text-emphasis" />
        <h1 className="kol-prose-display uppercase">{BRAND_INFO.identity.name}</h1>
      </div>
    </section>
  )
}
