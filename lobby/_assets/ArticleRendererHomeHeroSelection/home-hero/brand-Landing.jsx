import KolLogo from '../brand/logos/KolLogo'
import usePageTitle from '../components/hooks/usePageTitle'
import { BRAND } from '../brand/config'

/* Hero background — the /stack hero system (2026-07-29): CDN mood master as a
 * responsive <img> + theme-conditional color-mix overlay (.landing-hero-overlay
 * in styles/landing.css), replacing the local-jpg CSS background. */
const CDN_MOOD = 'https://b2.kolkrabbi.io/website/asset-library/cms/stack/mood'

export default function Landing() {
  usePageTitle()

  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={`${CDN_MOOD}/mood-05-1200.jpg`}
          srcSet={`${CDN_MOOD}/mood-05-400.jpg 400w, ${CDN_MOOD}/mood-05-800.jpg 800w, ${CDN_MOOD}/mood-05-1200.jpg 1200w, ${CDN_MOOD}/mood-05-1600.jpg 1600w`}
          sizes="100vw"
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        />
      </div>
      <div className="absolute inset-0 w-full h-full pointer-events-none landing-hero-overlay" aria-hidden="true" />

      <div className="relative z-[1] flex flex-col items-center gap-10 px-8 text-center">
        <div className="w-[clamp(140px,16vw,220px)] text-emphasis">
          <KolLogo variant="logomark" title={BRAND.name} />
        </div>

        <h1 className="kol-prose-display uppercase">{BRAND.name}</h1>

        <p className="kol-prose-tagline">
          A design studio rooted in craft and clarity.
        </p>
      </div>
    </section>
  )
}
