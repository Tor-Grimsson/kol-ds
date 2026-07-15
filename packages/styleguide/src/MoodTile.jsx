/**
 * MoodTile — image tile with a centered logo overlay.
 *
 * A cover-cropped photo in a 4:3 frame, an optional centered brand-logo
 * overlay, and an optional caption below. Image and logo are consumer-injected
 * (no app coupling): pass an image `src` / `alt` and a `logo` node.
 *
 * Class contract (chrome lives in @kolkrabbi/kol-theme →
 * packages/framework/kol-framework.css):
 *   .kol-mood-tile-frame img              — absolute inset-0, object-cover (crop)
 *   .kol-mood-tile-overlay .kol-brand-logo — logo box sized to 32% / max 180px
 *   .kol-mood-tile-overlay svg            — svg fills its wrapper (width 100%)
 *
 * Props:
 *   src     — image URL.
 *   alt     — image alt text. Default ''.
 *   logo    — logo node centered over the image (e.g. a brand <svg> or a
 *             logo component). Wrapped in .kol-brand-logo for overlay sizing.
 *   overlay — show the logo overlay. Default true (only renders when `logo`
 *             is also provided).
 *   caption — optional caption string rendered below the frame. Author its
 *             casing at the call site (no auto text-transform).
 */
export default function MoodTile({ src, alt = '', logo, overlay = true, caption }) {
  return (
    <figure className="kol-mood-tile">
      <div className="kol-mood-tile-frame relative rounded-[4px] overflow-hidden aspect-[4/3]">
        <img src={src} alt={alt} loading="lazy" />
        {overlay && logo && (
          <div className="kol-mood-tile-overlay text-emphasis absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="kol-brand-logo">{logo}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="kol-helper-12 tracking-wider text-meta mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
